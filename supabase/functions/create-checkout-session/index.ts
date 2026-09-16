import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { booking_reference, phone } = await req.json();
    if (typeof booking_reference !== 'string' || typeof phone !== 'string') {
      return json({ error: 'Booking reference and phone number are required.' }, 400);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) return json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to Supabase secrets.' }, 500);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, booking_reference, name, email, phone, pickup_date, pickup_time, fare_amount, payment_method, payment_status, status')
      .eq('booking_reference', booking_reference.trim().toUpperCase())
      .eq('phone', phone.trim())
      .single();
    if (bookingError || !booking) return json({ error: 'We could not find a matching booking.' }, 404);
    if (booking.payment_method !== 'card') return json({ error: 'This booking is not configured for card payment.' }, 400);
    if (booking.payment_status === 'paid') return json({ error: 'This booking has already been paid.' }, 409);
    if (booking.status === 'cancelled') return json({ error: 'This booking has been cancelled.' }, 409);

    const fare = Number(booking.fare_amount);

    const origin = req.headers.get('origin') || Deno.env.get('SITE_URL') || 'http://localhost:5173';
    const checkoutParams = new URLSearchParams({
      mode: 'payment',
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': 'Angels Of Hope Transportation ride',
      'line_items[0][price_data][unit_amount]': String(Math.round(fare * 100)),
      'line_items[0][quantity]': '1',
      'metadata[booking_id]': booking.id,
      'metadata[booking_reference]': booking.booking_reference,
      success_url: `${origin}/payment?status=success&reference=${encodeURIComponent(booking.booking_reference)}`,
      cancel_url: `${origin}/payment?status=cancelled&reference=${encodeURIComponent(booking.booking_reference)}`,
    });
    if (typeof booking.email === 'string' && booking.email.trim()) {
      checkoutParams.set('customer_email', booking.email.trim());
    }

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: checkoutParams,
    });
    const session = await stripeResponse.json();
    if (!stripeResponse.ok || !session.url) {
      return json({ error: session.error?.message || 'Unable to create Stripe Checkout Session.' }, 502);
    }

    await supabase.from('bookings').update({ stripe_checkout_session_id: session.id }).eq('id', booking.id);
    return json({ url: session.url });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected payment error.' }, 500);
  }
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
