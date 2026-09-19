import { useEffect, useRef, useState } from 'react';
import { Phone, Calendar, MapPin, Users, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types';
import { PHONE_DISPLAY, PHONE_E164 } from '../constants/site';
import { calculateFare } from '../lib/fare';
import { useNavigation } from '../hooks/useNavigation';

function normalizePickupTime(value: string) {
  return value.trim().slice(0, 5);
}

export function BookPage() {
  const { navigate } = useNavigation();
  const [formData, setFormData] = useState<Booking>({
    name: '',
    email: '',
    phone: '',
    pickup_address: '',
    dropoff_address: '',
    pickup_date: '',
    pickup_time: '',
    return_time: '',
    passengers: 1,
    wheelchair_accessible: false,
    round_trip: false,
    distance_miles: 0,
    waiting_minutes: 0,
    payment_method: 'card',
    special_requests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const returnTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOccupiedTimes([]);
    setAvailabilityError('');

    if (!formData.pickup_date) {
      return;
    }

    let active = true;
    setIsCheckingAvailability(true);
    supabase
      .rpc('get_booked_slots', { requested_date: formData.pickup_date })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAvailabilityError('Availability could not be checked. The server will still verify this time when you submit.');
        } else {
          const slots = Array.isArray(data) ? data : [];
          setOccupiedTimes(
            slots
              .map((slot: { pickup_time?: string }) => slot.pickup_time)
              .filter((pickupTime): pickupTime is string => Boolean(pickupTime))
              .map(normalizePickupTime)
          );
        }
        setIsCheckingAvailability(false);
      });

    return () => {
      active = false;
    };
  }, [formData.pickup_date]);

  useEffect(() => {
    if (!formData.round_trip) return;

    const frame = window.requestAnimationFrame(() => {
      const returnTimeInput = returnTimeRef.current;
      if (!returnTimeInput) return;

      returnTimeInput.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      });
      returnTimeInput.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [formData.round_trip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      newValue = name === 'distance_miles' ? parseFloat(value) || 0 : parseInt(value) || 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.round_trip && !formData.return_time) {
      setSubmitStatus('error');
      setSubmitError('Please select a return time for your round trip.');
      return;
    }
    if (occupiedTimes.includes(normalizePickupTime(formData.pickup_time))) {
      setSubmitStatus('error');
      setSubmitError('This date and time has already been booked. Please select another time.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');

    try {
      const { data, error } = await supabase.rpc('create_booking', {
        booking_data: formData,
      });

      if (error) throw error;
      const bookingResult = data as { booking_reference?: string };
      if (bookingResult?.booking_reference) {
        sessionStorage.setItem('aoh_booking_reference', bookingResult.booking_reference);
      }
      navigate('confirmation');
    } catch (error) {
      setSubmitStatus('error');
      const message = error && typeof error === 'object' && 'message' in error ? String((error as { message: unknown }).message) : '';
      setSubmitError(
        message.includes('already been booked')
          ? 'This date and time has already been booked. Please select another time.'
          : message || 'The booking could not be submitted. Please review your details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const fare = calculateFare({
    distanceMiles: formData.distance_miles,
    waitingMinutes: formData.waiting_minutes,
    roundTrip: formData.round_trip,
  });
  const timeUnavailable = occupiedTimes.includes(normalizePickupTime(formData.pickup_time));

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Calendar className="w-5 h-5 text-teal-300" />
            <span className="text-teal-100 text-sm font-medium">Schedule Your Ride</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book a Ride</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Fill out the form below to schedule your transportation. We'll contact you to confirm your booking.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitStatus === 'error' && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Submission Failed</h3>
                <p className="text-red-700 text-sm mt-1">
                  {submitError || `Something went wrong. Please try again or call us directly at ${PHONE_DISPLAY}.`}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="(xxx) xxx-xxxx"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trip Distance (miles) <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="number"
                      name="distance_miles"
                      value={formData.distance_miles || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="e.g. 8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waiting Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="waiting_minutes"
                      value={formData.waiting_minutes || ''}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  Trip Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickup_address"
                      value={formData.pickup_address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Street address, city, state, zip"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="dropoff_address"
                      value={formData.dropoff_address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      placeholder="Street address, city, state, zip"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="pickup_date"
                      value={formData.pickup_date}
                      onChange={handleChange}
                      required
                      min={today}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                    {isCheckingAvailability && <p className="text-xs text-gray-500 mt-2">Checking booked times for this date...</p>}
                    {!isCheckingAvailability && !availabilityError && formData.pickup_date && occupiedTimes.length === 0 && (
                      <p className="text-xs text-green-700 mt-2">No booked times found for this date.</p>
                    )}
                    {availabilityError && <p className="text-xs text-amber-700 mt-2">{availabilityError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="pickup_time"
                      value={formData.pickup_time}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                        timeUnavailable ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formData.pickup_date && occupiedTimes.length > 0 && (
                      <p className="text-xs text-amber-700 mt-2">Unavailable times for this date: {occupiedTimes.join(', ')}</p>
                    )}
                    {formData.pickup_date && formData.pickup_time && timeUnavailable && (
                      <p className="text-sm text-red-700 mt-2">This date and time has already been booked. Please select another time.</p>
                    )}
                  </div>
                  {formData.round_trip && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="return_time"
                        ref={returnTimeRef}
                        value={formData.return_time ?? ''}
                        onChange={handleChange}
                        min="00:00"
                        max="23:59"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-2">Choose a return time within 24 hours of pickup.</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Passengers
                    </label>
                    <select
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'passenger' : 'passengers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Fare and payment */}
              <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-600" />
                  Fare and Payment
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                    >
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.payment_method === 'card'
                        ? 'Your request will be saved as pending. Our team will send you to the payment page after review.'
                        : 'Your booking request will be saved as pending. Pay the driver in cash after confirmation.'}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-teal-100">
                    <div className="flex justify-between text-sm text-gray-600"><span>Base fare</span><span>${fare.baseFare.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2"><span>Additional mileage</span><span>${fare.mileageCharge.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2"><span>Waiting time</span><span>${fare.waitingCharge.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 mt-3 pt-3"><span>Estimated total</span><span>${fare.total.toFixed(2)}</span></div>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  Additional Options
                </h2>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="wheelchair_accessible"
                      checked={formData.wheelchair_accessible}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                        Wheelchair Accessible Vehicle
                      </span>
                      <p className="text-sm text-gray-500">
                        Select if you require a vehicle equipped for wheelchair transport
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="round_trip"
                      checked={formData.round_trip}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                        Round Trip
                      </span>
                      <p className="text-sm text-gray-500">
                        Select if you need a ride back after your appointment
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests or Notes
                </label>
                <textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                  placeholder="Any special requirements, medical needs, or additional information..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || timeUnavailable}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>
                <p className="text-center text-gray-500 text-sm mt-4">
                  By submitting this form, you agree to be contacted about your booking request.
                </p>
              </div>
            </div>
          </form>

          {/* Alternative Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Prefer to speak with us directly?</p>
            <a
              href={`tel:${PHONE_E164}`}
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold border-2 border-teal-200 hover:border-teal-500 hover:bg-teal-50 transition-all"
            >
              <Phone className="w-5 h-5" />
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
