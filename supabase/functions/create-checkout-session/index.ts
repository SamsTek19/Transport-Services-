import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { booking } = await req.json();
    if (!booking || booking.payment_method !== 'card') return json({ error: 'A card booking is required.' }, 400);

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) return json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to Supabase secrets.' }, 500);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const fare = calculateFare(booking.distance_miles, booking.waiting_minutes, booking.round_trip);

    const { data: createdBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{ ...booking, fare_amount: fare, payment_status: 'pending' }])
      .select('id')
      .single();
    if (bookingError || !createdBooking) return json({ error: bookingError?.message || 'Unable to create booking.' }, 400);

    const origin = req.headers.get('origin') || Deno.env.get('SITE_URL') || 'http://localhost:5173';
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        mode: 'payment',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': 'Angels Of Hope Transportation ride',
        'line_items[0][price_data][unit_amount]': String(Math.round(fare * 100)),
        'line_items[0][quantity]': '1',
        customer_email: booking.email,
        receipt_email: 'angelsofhopetransportation@gmail.com',
        'metadata[booking_id]': createdBooking.id,
        success_url: `${origin}/?payment=success`,
        cancel_url: `${origin}/?payment=cancelled`,
      }),
    });
    const session = await stripeResponse.json();
    if (!stripeResponse.ok || !session.url) {
      await supabase.from('bookings').delete().eq('id', createdBooking.id);
      return json({ error: session.error?.message || 'Unable to create Stripe Checkout Session.' }, 502);
    }

    await supabase.from('bookings').update({ stripe_checkout_session_id: session.id }).eq('id', createdBooking.id);
    return json({ url: session.url });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected payment error.' }, 500);
  }
});

function calculateFare(distanceMiles: number, waitingMinutes: number, roundTrip: boolean) {
  const miles = Math.max(0, Number(distanceMiles) || 0) * (roundTrip ? 2 : 1);
  const extraMiles = Math.max(0, miles - 4);
  const waitBlocks = Math.ceil(Math.max(0, Number(waitingMinutes) || 0) / 15);
  return Math.round((25 + extraMiles * 2.5 + waitBlocks * 10) * 100) / 100;
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
