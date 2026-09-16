import { useState } from 'react';
import { AlertCircle, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigation } from '../hooks/useNavigation';

type PaymentBooking = {
  booking_reference: string;
  name: string;
  pickup_date: string;
  pickup_time: string;
  fare_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
};

export function PaymentPage() {
  const { navigate } = useNavigation();
  const paymentResult = new URLSearchParams(window.location.search).get('status');
  const [reference, setReference] = useState(sessionStorage.getItem('aoh_booking_reference') || '');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<PaymentBooking | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [paymentStarted, setPaymentStarted] = useState(false);

  const findBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBooking(null);
    setIsLoading(true);

    const { data, error: lookupError } = await supabase.rpc('get_payment_booking', {
      requested_reference: reference.trim(),
      requested_phone: phone.trim(),
    });

    if (lookupError || !data) {
      setError('We could not find a matching booking. Check your reference and phone number and try again.');
    } else {
      const paymentBooking = Array.isArray(data) ? data[0] : data;
      if (!paymentBooking) {
        setError('We could not find a matching booking. Check your reference and phone number and try again.');
      } else if (paymentBooking.payment_method !== 'card') {
      setError('This booking is set up for cash payment. Please contact us if you need to change the payment method.');
      } else {
        setBooking(paymentBooking as PaymentBooking);
      }
    }
    setIsLoading(false);
  };

  const startPayment = async () => {
    if (!booking) return;
    setError('');
    setIsStartingPayment(true);

    const { data, error: paymentError } = await supabase.functions.invoke('create-checkout-session', {
      body: { booking_reference: booking.booking_reference, phone },
    });

    if (paymentError || !data?.url) {
      let functionMessage = '';
      if (paymentError instanceof FunctionsHttpError) {
        try {
          const responseBody = await paymentError.context.json();
          if (responseBody && typeof responseBody.error === 'string') functionMessage = responseBody.error;
        } catch {
          // Use the SDK error below when the function response is not JSON.
        }
      }

      setError(functionMessage || paymentError?.message || data?.error || 'Unable to start secure payment. Please try again.');
      setIsStartingPayment(false);
      return;
    }

    setPaymentStarted(true);
    window.location.assign(data.url);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <CreditCard className="w-12 h-12 text-teal-200 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">Secure Booking Payment</h1>
          <p className="text-teal-100">Use your booking reference and phone number to review and pay your approved card booking.</p>
        </div>
      </section>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {paymentResult === 'success' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">Stripe received your payment. Your booking will be marked paid after our secure webhook confirms it.</p>
            </div>
          )}
          {paymentResult === 'cancelled' && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-amber-800 text-sm">Payment was cancelled. Your booking remains pending and you can try again when ready.</p>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          {paymentStarted && (
            <div className="mb-6 bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <p className="text-teal-800 text-sm">Redirecting you to Stripe's secure payment page...</p>
            </div>
          )}
          <form onSubmit={findBooking} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking reference</label>
              <input value={reference} onChange={(event) => setReference(event.target.value)} required placeholder="AOH-XXXXXXXXXX" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone number used for the booking</label>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} required type="tel" placeholder="(xxx) xxx-xxxx" className="w-full px-4 py-3 border border-gray-200 rounded-xl" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-70 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find Booking'}
            </button>
          </form>

          {booking && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Payment Review</h2>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 capitalize">{booking.payment_status}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-900">Reference:</span> {booking.booking_reference}</p>
                <p><span className="font-medium text-gray-900">Rider:</span> {booking.name}</p>
                <p><span className="font-medium text-gray-900">Pickup:</span> {booking.pickup_date} at {booking.pickup_time}</p>
              </div>
              <div className="flex justify-between border-t border-gray-100 mt-5 pt-5 text-xl font-bold text-gray-900">
                <span>Amount due</span>
                <span>${Number(booking.fare_amount).toFixed(2)}</span>
              </div>
              {booking.payment_status === 'paid' ? (
                <p className="mt-5 text-green-700 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Payment received.</p>
              ) : (
                <button type="button" onClick={startPayment} disabled={isStartingPayment} className="w-full mt-6 bg-teal-600 text-white py-3.5 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-70 flex items-center justify-center gap-2">
                  {isStartingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                  Pay securely with Stripe
                </button>
              )}
            </div>
          )}
        </div>
        <button type="button" onClick={() => navigate('home')} className="block mx-auto mt-6 text-sm text-teal-700 hover:text-teal-900">Return to homepage</button>
      </main>
    </div>
  );
}
