import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return !!data;
}

async function readFunctionError(error: unknown, data: unknown): Promise<string> {
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    return String(data.error);
  }

  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      if (body && typeof body === 'object' && 'error' in body && body.error) {
        return String(body.error);
      }
    } catch {
      // fall through to generic message
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message);
    if (message.includes('Failed to send a request') || message.includes('FunctionsFetchError')) {
      return 'Invite service is not available. Deploy the invite-user Edge Function in Supabase.';
    }
    return message;
  }

  return 'Failed to send invitation';
}

export async function inviteAdminUser(email: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: {
      email,
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(await readFunctionError(error, data));
  }

  if (data?.error) {
    throw new Error(String(data.error));
  }
}
