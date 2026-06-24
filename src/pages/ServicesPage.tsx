import { Check, Phone, ArrowRight, Clock, Users, Shield, Car } from 'lucide-react';
import { useNavigation, Page } from '../hooks/useNavigation';

const services = [
  {
    icon: '🏥',
    title: 'Medical Appointment Transportation',
    description: 'Reliable, on-time transportation to and from doctor visits, dialysis appointments, physical therapy, and other medical appointments. Our drivers are trained to assist patients and ensure you arrive comfortably.',
    features: [
      'Door-to-door service',
      'On-time guaranteed arrivals',
      'Assistance with mobility aids',
      'Wait time for appointments available',
    ],
  },
  {
    icon: '✈️',
    title: 'Airport & Long Distance Travel',
    description: 'Stress-free airport transportation and long-distance travel services. We handle your luggage and ensure you arrive at your destination relaxed and on schedule.',
    features: [
      'Flight tracking for pickups',
      'Luggage assistance',
      'Comfortable, spacious vehicles',
      'Early morning & late night availability',
    ],
  },
  {
    icon: '👴',
    title: 'Senior Transportation Services',
    description: 'Compassionate transportation designed specifically for elderly passengers. Our drivers are patient, respectful, and trained to provide the extra care seniors deserve.',
    features: [
      'Patient, experienced drivers',
      'Easy vehicle entry/exit',
      'Companion seating available',
      'Regular appointment scheduling',
    ],
  },
  {
    icon: '♿',
    title: 'Wheelchair Accessible Vehicles',
    description: 'Our fleet includes fully equipped wheelchair accessible vehicles. Safe, dignified transportation for passengers requiring mobility assistance.',
    features: [
      'ADA-compliant vehicles',
      'Hydraulic lifts and ramps',
      'Secured wheelchair transport',
      'Trained mobility assistance',
    ],
  },
  {
    icon: '🏥',
    title: 'Hospital Discharge Transportation',
    description: 'Safe transportation home after hospital stays or procedures. We coordinate with hospital staff and ensure you get home comfortably.',
    features: [
      'Hospital coordination',
      'Discharge timing flexibility',
      'Comfortable recovery seating',
      'Family notification available',
    ],
  },
  {
    icon: '🛒',
    title: 'Errand & Shopping Assistance',
    description: 'Transportation for grocery shopping, pharmacy visits, and personal errands. We help you maintain independence and stay connected.',
    features: [
      'Multiple stop availability',
      'Shopping assistance',
      'Grocery loading help',
      'Flexible scheduling',
    ],
  },
];

const pricing = [
  {
    type: 'Local Medical Appointments',
    price: 'From $25',
    description: 'Within 10 mile radius',
  },
  {
    type: 'Extended Distance',
    price: 'From $45',
    description: '10-25 mile radius',
  },
  {
    type: 'Airport Transfers',
    price: 'From $65',
    description: 'DCA, IAD, BWI airports',
  },
  {
    type: 'Hourly Service',
    price: 'From $40/hr',
    description: 'Flexible booking',
  },
];

export function ServicesPage() {
  const { navigate } = useNavigation();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Car className="w-5 h-5 text-teal-300" />
            <span className="text-teal-100 text-sm font-medium">Comprehensive Care</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Transportation Services
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Professional, compassionate transportation services designed for your comfort and safety.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Competitive rates with no hidden fees. Contact us for a personalized quote.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-teal-50 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.type}</h3>
                <div className="text-3xl font-bold text-teal-600 mb-2">{item.price}</div>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Flexible Scheduling',
                desc: 'Available 6 AM - 9 PM weekdays. Advanced booking and same-day service available.',
              },
              {
                icon: Users,
                title: 'Experienced Drivers',
                desc: 'Background-checked, trained professionals who care about your comfort and safety.',
              },
              {
                icon: Shield,
                title: 'Fully Insured',
                desc: 'Complete insurance coverage for your peace of mind during every trip.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600/20 rounded-2xl mb-4">
                  <item.icon className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Book Your Ride?</h2>
          <p className="text-teal-100 text-lg mb-8">
            Contact us today for a personalized quote or to schedule your transportation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('book' as Page)}
              className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
            >
              Book Online
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:+17039805916"
              className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-800 transition-all inline-flex items-center justify-center gap-2"
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
