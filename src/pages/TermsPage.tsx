import { CheckCircle, DollarSign, FileText, Shield } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';
import { PHONE_DISPLAY } from '../constants/site';
import { FARE_RULES } from '../lib/fare';

const money = (amount: number) => `$${amount.toFixed(2)}`;

export function TermsPage() {
  const { navigate } = useNavigation();

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <FileText className="w-5 h-5 text-teal-300" />
            <span className="text-teal-100 text-sm font-medium">Service Terms</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Clear pricing and service expectations for Angels Of Hope Transportation rides.
          </p>
        </div>
      </section>

      <main className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <DollarSign className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Rates and service charges</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-xl p-5">
                <p className="text-sm text-teal-800">Minimum fare</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{money(FARE_RULES.minimumFare)}</p>
                <p className="text-sm text-gray-600 mt-1">Includes the first {FARE_RULES.includedMiles} miles.</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-5">
                <p className="text-sm text-teal-800">Additional mileage</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{money(FARE_RULES.mileageRate)} per mile</p>
                <p className="text-sm text-gray-600 mt-1">Applies after the included miles.</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-5">
                <p className="text-sm text-teal-800">Waiting time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{money(FARE_RULES.waitingBlockRate)} per 15 minutes</p>
                <p className="text-sm text-gray-600 mt-1">Any fraction of 15 minutes counts as a full block.</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-5">
                <p className="text-sm text-teal-800">Round trips</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">Both legs are billed</p>
                <p className="text-sm text-gray-600 mt-1">The entered distance is doubled for round-trip mileage.</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Booking and payment</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li>Fare estimates are based on the mileage and waiting time entered when you request a ride. The final charge may be adjusted if the actual trip details differ.</li>
              <li>Cash bookings are submitted immediately and payment is due to the driver at the time of service.</li>
              <li>Card bookings continue to secure Stripe Checkout after the booking form is submitted. A card booking is considered paid only after Stripe confirms the payment.</li>
              <li>Stripe card payments are processed in U.S. dollars. Payment receipts are sent to the email address configured for Angels Of Hope Transportation.</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Service expectations</h2>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li>Ride requests are subject to availability and are confirmed by Angels Of Hope Transportation.</li>
              <li>Please provide accurate pickup, destination, mileage, passenger, and accessibility information.</li>
              <li>Contact us at {PHONE_DISPLAY} as soon as possible if you need to change or cancel a ride.</li>
              <li>Transportation is non-emergency medical transportation. Call 911 for emergencies.</li>
            </ul>
          </section>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('book')}
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-teal-700 hover:to-teal-800 transition-all"
            >
              Book a Ride
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
