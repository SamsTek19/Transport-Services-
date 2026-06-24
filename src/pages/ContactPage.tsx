import { Phone, Mail, Clock, MapPin, MessageSquare, Send } from 'lucide-react';
import { useNavigation, Page } from '../hooks/useNavigation';

const businessHours = [
  { day: 'Monday', hours: '6:00 AM – 9:00 PM' },
  { day: 'Tuesday', hours: '6:00 AM – 9:00 PM' },
  { day: 'Wednesday', hours: '6:00 AM – 9:00 PM' },
  { day: 'Thursday', hours: '6:00 AM – 9:00 PM' },
  { day: 'Friday', hours: '6:00 AM – 5:00 PM' },
  { day: 'Saturday', hours: 'By appointment' },
  { day: 'Sunday', hours: 'By appointment' },
];

export function ContactPage() {
  const { navigate } = useNavigation();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <MessageSquare className="w-5 h-5 text-teal-300" />
            <span className="text-teal-100 text-sm font-medium">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help you with all your transportation needs.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Phone Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
                <Phone className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <a
                href="tel:+17039805916"
                className="text-teal-600 font-semibold text-lg hover:text-teal-700 transition-colors"
              >
                +1 (703) 980-5916
              </a>
              <p className="text-gray-500 text-sm mt-2">Available during business hours</p>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <a
                href="mailto:isaacaopoku@yahoo.com"
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors break-all"
              >
                isaacaopoku@yahoo.com
              </a>
              <p className="text-gray-500 text-sm mt-2">We'll respond within 24 hours</p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Service Area</h3>
              <p className="text-teal-600 font-semibold">Northern Virginia</p>
              <p className="text-gray-500 text-sm mt-2">And surrounding areas</p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
              </div>
              <ul className="space-y-4">
                {businessHours.map((item) => (
                  <li
                    key={item.day}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium text-gray-900">{item.day}</span>
                    <span className={`${
                      item.hours === 'By appointment' ? 'text-teal-600 italic' : 'text-gray-600'
                    }`}>
                      {item.hours}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 text-sm mt-6 bg-gray-50 rounded-xl p-4">
                Weekend and after-hours service available by appointment. Please contact us in advance
                to schedule.
              </p>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigate('book' as Page)}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about our services.
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'How do I book a ride?',
                a: 'You can book a ride by calling us at (703) 980-5916 or using our online booking form. We recommend booking at least 24 hours in advance.',
              },
              {
                q: 'Do you offer wheelchair accessible vehicles?',
                a: 'Yes, we have wheelchair accessible vehicles available. Please let us know when booking if you require this service.',
              },
              {
                q: 'What areas do you serve?',
                a: 'We serve Northern Virginia and surrounding areas. Contact us to confirm service in your specific location.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept cash, credit cards, and can arrange billing for recurring medical appointments.',
              },
            ].map((faq, index) => (
              <details key={index} className="bg-gray-50 rounded-2xl group">
                <summary className="cursor-pointer list-none p-6 flex justify-between items-center group-open:bg-teal-50 rounded-t-2xl">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-teal-600 transform group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="px-6 pb-6 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Ride?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Experience safe, reliable, and compassionate transportation with Angels Of Hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('book' as Page)}
              className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              Book Online
            </button>
            <a
              href="tel:+17039805916"
              className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-800 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
