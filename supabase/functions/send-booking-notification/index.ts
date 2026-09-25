import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const statusCopy: Record<string, { subject: string; heading: string; message: string }> = {
  pending: {
    subject: 'Your Angels Of Hope Transportation request is being reviewed',
    heading: 'Your ride request is being reviewed',
    message: 'We received your ride request and our team is reviewing the details. We will follow up with any next steps.',
  },
  confirmed: {
    subject: 'Your Angels Of Hope Transportation ride is confirmed',
    heading: 'Your ride is confirmed',
    message: 'Your transportation request has been confirmed. Please keep this email for your records.',
  },
  completed: {
    subject: 'Thank you for riding with Angels Of Hope Transportation',
    heading: 'Thank you for riding with us',
    message: 'Your ride has been marked completed. Thank you for choosing Angels Of Hope Transportation.',
  },
  cancelled: {
    subject: 'Update about your Angels Of Hope Transportation ride',
    heading: 'Your ride has been cancelled',
    message: 'Your transportation request has been cancelled. Please contact us if you have questions or need to arrange another ride.',
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization. Please sign in again.' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) return json({ error: 'Session expired. Please sign in again.' }, 401);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { data: adminRow, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (adminError) return json({ error: `Admin check failed: ${adminError.message}` }, 500);
    if (!adminRow) return json({ error: 'You are not authorized to send booking notifications.' }, 403);

    const body = await req.json().catch(() => null) as { booking_id?: string; subject?: string; message?: string } | null;
    if (!body?.booking_id || typeof body.booking_id !== 'string') {
      return json({ error: 'Booking ID is required.' }, 400);
    }
    if (body.subject !== undefined && (typeof body.subject !== 'string' || !body.subject.trim())) {
      return json({ error: 'Email subject cannot be empty.' }, 400);
    }
    if (body.message !== undefined && (typeof body.message !== 'string' || !body.message.trim())) {
      return json({ error: 'Email message cannot be empty.' }, 400);
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('name, email, booking_reference, pickup_date, pickup_time, pickup_address, dropoff_address, status, fare_amount, payment_method, payment_status')
      .eq('id', body.booking_id)
      .maybeSingle();
    if (bookingError) return json({ error: bookingError.message }, 500);
    if (!booking) return json({ error: 'Booking not found.' }, 404);
    if (!booking.email?.trim()) return json({ error: 'This customer does not have an email address.' }, 400);

    const copy = statusCopy[booking.status ?? 'pending'] ?? statusCopy.pending;
    const subject = body.subject?.trim() || copy.subject;
    const message = body.message?.trim() || copy.message;
    const reference = booking.booking_reference ?? 'your booking';
    const details = [
      `Booking reference: ${reference}`,
      `Pickup: ${booking.pickup_date} at ${booking.pickup_time}`,
      `From: ${booking.pickup_address}`,
      `To: ${booking.dropoff_address}`,
      booking.fare_amount != null ? `Fare: $${Number(booking.fare_amount).toFixed(2)} (${booking.payment_method}, ${booking.payment_status ?? 'pending'})` : '',
    ].filter(Boolean).join('\n');
    const text = `Hello ${booking.name},\n\n${message}\n\n${details}\n\nIf you have any questions, reply to this email or contact Angels Of Hope Transportation.\n\nThank you,\nAngels Of Hope Transportation`;
    const html = `<h2>${escapeHtml(subject)}</h2><p>Hello ${escapeHtml(booking.name)},</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p><p><strong>Booking reference:</strong> ${escapeHtml(reference)}<br><strong>Pickup:</strong> ${escapeHtml(booking.pickup_date)} at ${escapeHtml(booking.pickup_time)}<br><strong>From:</strong> ${escapeHtml(booking.pickup_address)}<br><strong>To:</strong> ${escapeHtml(booking.dropoff_address)}${booking.fare_amount != null ? `<br><strong>Fare:</strong> $${Number(booking.fare_amount).toFixed(2)} (${escapeHtml(booking.payment_method)}, ${escapeHtml(booking.payment_status ?? 'pending')})` : ''}</p><p>If you have any questions, reply to this email or contact Angels Of Hope Transportation.</p><p>Thank you,<br>Angels Of Hope Transportation</p>`;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) return json({ error: 'Email service is not configured. Add RESEND_API_KEY to Supabase secrets.' }, 503);

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Deno.env.get('EMAIL_FROM') || 'Angels Of Hope Transportation <onboarding@resend.dev>',
        reply_to: 'angelsofhopetransportation@gmail.com',
        to: [booking.email.trim()],
        subject,
        text,
        html,
      }),
    });
    if (!resendResponse.ok) {
      const resendError = await resendResponse.json().catch(() => null) as { message?: string } | null;
      return json({ error: resendError?.message || 'The email provider could not send this message.' }, 502);
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected error.' }, 500);
  }
});

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] ?? character));
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}