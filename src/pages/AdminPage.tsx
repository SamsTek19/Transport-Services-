import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Car,
  LogOut,
  Loader2,
  RefreshCw,
  Calendar,
  Users,
  Clock,
  AlertCircle,
  Shield,
  ArrowLeft,
  Mail,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { checkIsAdmin, inviteAdminUser } from '../lib/admin';
import { clearAuthParamsFromUrl, isAuthCallbackInUrl, isPasswordSetupPending, userNeedsPasswordSetup } from '../lib/auth';
import { useNavigation } from '../hooks/useNavigation';
import type { Booking } from '../types';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function AdminSessionPrompt({
  session,
  onContinue,
  onSwitchAccount,
}: {
  session: Session;
  onContinue: () => void;
  onSwitchAccount: () => void;
}) {
  const { navigate } = useNavigation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSwitchAccount = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    onSwitchAccount();
    setIsSigningOut(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-teal-300 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-3 rounded-xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-6">
            You're already signed in as{' '}
            <span className="font-medium text-gray-900">{session.user.email}</span>
          </p>
          <div className="space-y-3">
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3.5 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg"
            >
              Continue to Dashboard
            </button>
            <button
              onClick={handleSwitchAccount}
              disabled={isSigningOut}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing out...
                </>
              ) : (
                'Sign in with a different account'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
      return;
    }

    onLogin();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-teal-300 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-3 rounded-xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-500 text-sm">Angels Of Hope Transportation</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3.5 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SetPasswordForm({ onComplete }: { onComplete: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
      data: { needs_password_setup: false },
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    clearAuthParamsFromUrl();
    onComplete();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-3 rounded-xl">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Your Password</h1>
            <p className="text-gray-500 text-sm">You've been invited to the admin team. Choose a password to continue.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              placeholder="Repeat your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3.5 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Create Password & Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function InviteAdminForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await inviteAdminUser(email);
      setSuccess(`Invitation sent to ${email.trim()}`);
      setEmail('');
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to send invitation.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-semibold text-gray-900">Invite Admin</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Send an email invitation so a new team member can set their password and access the dashboard.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="colleague@example.com"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          Send Invite
        </button>
      </form>
    </div>
  );
}

function AdminDashboard({ session }: { session: Session }) {
  const { navigate } = useNavigation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Failed to load bookings. Please try again.');
      setIsLoading(false);
      return;
    }

    setBookings(data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);

    const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', id);

    if (updateError) {
      setError('Failed to update booking status.');
    } else {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    }

    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('home');
  };

  const filteredBookings =
    filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-2 rounded-lg">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900">Admin Dashboard</span>
              <span className="hidden sm:block text-xs text-gray-500">{session.user.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('home')}
              className="text-sm text-gray-600 hover:text-teal-600 transition-colors hidden sm:block"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InviteAdminForm />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, icon: Calendar, iconClass: 'text-teal-600' },
            { label: 'Pending', value: stats.pending, icon: Clock, iconClass: 'text-amber-600' },
            { label: 'Confirmed', value: stats.confirmed, icon: Users, iconClass: 'text-blue-600' },
            { label: 'Completed', value: stats.completed, icon: Shield, iconClass: 'text-green-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.iconClass}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Ride Bookings</h2>
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchBookings}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No bookings found</p>
              <p className="text-sm mt-1">
                {filter === 'all' ? 'New ride requests will appear here.' : `No ${filter} bookings.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Trip</th>
                    <th className="px-6 py-3 font-medium">Pickup</th>
                    <th className="px-6 py-3 font-medium">Options</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{booking.phone}</div>
                        <div className="text-gray-500 text-xs">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700 max-w-[180px]">
                          <span className="text-gray-400 text-xs">From: </span>
                          {booking.pickup_address}
                        </div>
                        <div className="text-gray-700 max-w-[180px] mt-1">
                          <span className="text-gray-400 text-xs">To: </span>
                          {booking.dropoff_address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{formatDate(booking.pickup_date)}</div>
                        <div className="text-gray-500 text-xs">{booking.pickup_time}</div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {booking.passengers} passenger{booking.passengers !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {booking.wheelchair_accessible && (
                            <span className="inline-flex text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full w-fit">
                              Wheelchair
                            </span>
                          )}
                          {booking.round_trip && (
                            <span className="inline-flex text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full w-fit">
                              Round trip
                            </span>
                          )}
                          {booking.special_requests && (
                            <span className="text-xs text-gray-500 max-w-[120px] truncate" title={booking.special_requests}>
                              {booking.special_requests}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status ?? 'pending'}
                          onChange={(e) => booking.id && handleStatusChange(booking.id, e.target.value)}
                          disabled={updatingId === booking.id}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-teal-500 ${
                            STATUS_STYLES[booking.status ?? 'pending'] ?? STATUS_STYLES.pending
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                        {booking.created_at ? formatDateTime(booking.created_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AccessDenied({ session }: { session: Session }) {
  const { navigate } = useNavigation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsSigningOut(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 text-sm mb-2">
          You're signed in as <span className="font-medium text-gray-900">{session.user.email}</span>, but
          this account is not authorized for the admin dashboard.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Ask an existing admin to send you an invite, or sign out and use a different account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-70"
          >
            {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Sign Out
          </button>
          <button
            onClick={() => navigate('home')}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordSetupPending, setPasswordSetupPending] = useState(() => isAuthCallbackInUrl());
  const passwordSetupPendingRef = useRef(isAuthCallbackInUrl());
  const [loginConfirmed, setLoginConfirmed] = useState(false);

  const syncPasswordSetupState = useCallback((currentSession: Session | null) => {
    if (isPasswordSetupPending(currentSession)) {
      passwordSetupPendingRef.current = true;
      setPasswordSetupPending(true);
      setLoginConfirmed(true);
    }
  }, []);

  useEffect(() => {
    syncPasswordSetupState(null);

    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(currentSession);
        syncPasswordSetupState(currentSession);
        setIsCheckingAuth(false);

        if (currentSession) {
          const admin = await checkIsAdmin(currentSession.user.id);
          if (mounted) setIsAdmin(admin);
        }
      } catch {
        if (mounted) setIsCheckingAuth(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setTimeout(async () => {
        if (!mounted) return;

        setSession(currentSession);
        syncPasswordSetupState(currentSession);

        if (currentSession) {
          const admin = await checkIsAdmin(currentSession.user.id);
          if (mounted) setIsAdmin(admin);
        } else if (!passwordSetupPendingRef.current) {
          setIsAdmin(false);
          setLoginConfirmed(false);
        }
      }, 0);
    });

    const timeout = setTimeout(() => {
      if (mounted) setIsCheckingAuth(false);
    }, 4000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [syncPasswordSetupState]);

  const mustSetPassword =
    passwordSetupPending || (session ? userNeedsPasswordSetup(session.user) : isAuthCallbackInUrl());

  if (isCheckingAuth || (mustSetPassword && !session)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        <p className="text-sm text-gray-500">Completing your invitation...</p>
      </div>
    );
  }

  if (mustSetPassword && session) {
    return (
      <SetPasswordForm
        onComplete={async () => {
          passwordSetupPendingRef.current = false;
          setPasswordSetupPending(false);
          setLoginConfirmed(true);
          const {
            data: { session: s },
          } = await supabase.auth.getSession();
          setSession(s);
          if (s) {
            setIsAdmin(await checkIsAdmin(s.user.id));
          }
        }}
      />
    );
  }

  if (!session || !loginConfirmed) {
    if (session && !loginConfirmed) {
      return (
        <AdminSessionPrompt
          session={session}
          onContinue={() => setLoginConfirmed(true)}
          onSwitchAccount={() => {
            setSession(null);
            setIsAdmin(false);
            setLoginConfirmed(false);
          }}
        />
      );
    }

    return (
      <AdminLogin
        onLogin={async () => {
          const {
            data: { session: s },
          } = await supabase.auth.getSession();
          setSession(s);
          setLoginConfirmed(true);
          if (s) {
            setIsAdmin(await checkIsAdmin(s.user.id));
          }
        }}
      />
    );
  }

  if (!isAdmin) {
    return <AccessDenied session={session} />;
  }

  return <AdminDashboard session={session} />;
}
