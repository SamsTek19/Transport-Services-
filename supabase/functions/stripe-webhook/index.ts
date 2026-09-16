import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!signature || !webhookSecret) return new Response('Webhook is not configured', { status: 500 });

  const payload = await req.text();
  if (!(await verifySignature(payload, signature, webhookSecret))) return new Response('Invalid signature', { status: 400 });

  const event = JSON.parse(payload);
  const session = event.data?.object;
  const bookingId = session?.metadata?.booking_id;
  if (!bookingId) return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const paymentStatus = event.type === 'checkout.session.completed' && session.payment_status === 'paid'
    ? 'paid'
    : event.type === 'checkout.session.expired'
      ? 'failed'
      : null;

  if (paymentStatus) {
    const { error } = await supabase.from('bookings').update({ payment_status: paymentStatus }).eq('id', bookingId);
    if (error) return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
});

async function verifySignature(payload: string, header: string, secret: string) {
  const values = Object.fromEntries(header.split(',').map((part) => part.split('=')));
  const timestamp = values.t;
  const receivedSignature = values.v1;
  if (!timestamp || !receivedSignature || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expectedSignature = [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return expectedSignature === receivedSignature;
}
