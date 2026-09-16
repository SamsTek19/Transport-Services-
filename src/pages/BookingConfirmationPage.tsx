import { CheckCircle, Home, CreditCard } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

export function BookingConfirmationPage() {
  const { navigate } = useNavigation();
  const reference = sessionStorage.getItem('aoh_booking_reference');

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 text-teal-200 mx-auto mb-5" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Booking Request Received!</h1>
          <p className="text-teal-100 text-lg">
            Thank you for your booking request. We have received your details successfully.
          </p>
        </div>
      </section>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-600 leading-7">
            Our team will review your request and get back to you shortly to confirm your ride and process your booking and payment.
          </p>
          {reference && (
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mt-6">
              <p className="text-sm text-teal-700">Your booking reference</p>
              <p className="text-2xl font-bold text-teal-900 tracking-wide mt-1">{reference}</p>
              <p className="text-xs text-teal-700 mt-2">Keep this reference available when you contact us or make a payment.</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            {reference && (
              <button
                type="button"
                onClick={() => navigate('payment')}
                className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                Go to Payment
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('home')}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              Return to Homepage
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
