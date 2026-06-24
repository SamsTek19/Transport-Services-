import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Missing authorization. Please sign in again.' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return json({ error: 'Session expired. Please sign in again.' }, 401);
    }

    let body: { email?: string; redirectTo?: string };
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Invalid request body' }, 400);
    }

    const { email, redirectTo } = body;

    if (!email || typeof email !== 'string') {
      return json({ error: 'Email is required' }, 400);
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: adminRow, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminError) {
      return json({ error: `Admin check failed: ${adminError.message}` }, 500);
    }

    if (!adminRow) {
      return json(
        {
          error:
            'Your account is not in admin_users. Add yourself in Supabase SQL Editor: INSERT INTO admin_users (user_id) SELECT id FROM auth.users WHERE email = \'your@email.com\';',
        },
        403
      );
    }

    const siteUrl = (redirectTo || Deno.env.get('SITE_URL') || 'http://localhost:5173').replace(/\/$/, '');

    const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: siteUrl,
        data: { needs_password_setup: true },
      }
    );

    if (inviteError) {
      const message = inviteError.message;

      if (message.toLowerCase().includes('redirect')) {
        return json(
          {
            error: `Redirect URL not allowed. Add "${siteUrl}" to Supabase → Authentication → URL Configuration → Redirect URLs.`,
          },
          400
        );
      }

      if (message.toLowerCase().includes('already') || message.toLowerCase().includes('registered')) {
        return json(
          {
            error: 'This email is already registered. Ask them to sign in, or remove the user in Supabase Auth and invite again.',
          },
          400
        );
      }

      if (message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('too many')) {
        return json(
          {
            error: 'Email rate limit exceeded. Supabase limits how many invite emails can be sent per hour. Wait about an hour and try again, or add custom SMTP in Supabase → Authentication → SMTP Settings for higher limits.',
          },
          429
        );
      }

      return json({ error: message }, 400);
    }

    const { error: upsertError } = await supabaseAdmin
      .from('admin_users')
      .upsert({ user_id: data.user.id }, { onConflict: 'user_id' });

    if (upsertError) {
      return json(
        {
          error: `Invite sent but admin access setup failed: ${upsertError.message}. Ensure the admin_users table exists.`,
        },
        500
      );
    }

    return json({ success: true, email: data.user.email });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return json({ error: message }, 500);
  }
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
