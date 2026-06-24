import type { Session, User } from '@supabase/supabase-js';

export function isAuthCallbackInUrl(): boolean {
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const searchParams = new URLSearchParams(window.location.search);
  const type = hashParams.get('type') || searchParams.get('type');

  return (
    hashParams.has('access_token') ||
    searchParams.has('code') ||
    type === 'invite' ||
    type === 'signup' ||
    type === 'recovery'
  );
}

export function userNeedsPasswordSetup(user: User): boolean {
  return user.user_metadata?.needs_password_setup === true;
}

/** True when the user arrived via an invite link or still needs to create a password. */
export function isPasswordSetupPending(session: Session | null): boolean {
  if (isAuthCallbackInUrl()) return true;
  if (session && userNeedsPasswordSetup(session.user)) return true;
  return false;
}

export function clearAuthParamsFromUrl() {
  window.history.replaceState(null, '', `${window.location.pathname}#admin`);
}
