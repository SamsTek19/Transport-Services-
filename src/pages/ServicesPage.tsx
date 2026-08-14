import { Check, Phone, ArrowRight, Clock, Users, Shield, Car } from 'lucide-react';
import { useNavigation, Page } from '../hooks/useNavigation';
import { PHONE_E164 } from '../constants/site';

const services = [
  {
    icon: '🩺',
    title: 'Non-Emergency Medical Transportation (NEMT)',
    description: 'Safe and reliable transportation for medical visits, treatments, and recurring care needs without the stress of driving yourself.',
    features: [
      'Door-to-door pickup and drop-off',
      'Scheduled rides for appointments',
      'Comfortable, medically focused transport',
      'Ideal for seniors and patients with mobility needs',
    ],
  },
  {
    icon: '♿',
    title: 'Wheelchair Transportation',
    description: 'Accessible transportation for passengers who need wheelchair-friendly vehicles and trained assistance throughout the trip.',
    features: [
      'Wheelchair-accessible vehicles',
      'Secure loading and unloading support',
      'Mobility assistance from trained staff',
      'Safe transportation for medical and personal travel',
    ],
  },
  {
    icon: '🚶',
    title: 'Ambulatory Transportation',
    description: 'Reliable transportation for patients who are able to walk, but still need dependable support getting to appointments and treatments.',
    features: [
      'Assistance with getting in and out of the vehicle',
      'Great for outpatient visits and therapy',
      'Flexible scheduling for recurring appointments',
      'Comfortable, non-emergency service',
    ],
  },
  {
    icon: '🏥',
    title: 'Hospital Discharge Transportation',
    description: 'Prompt transportation home after a hospital stay, procedure, or outpatient treatment so you can recover safely and comfortably.',
    features: [
      'Timely pickup after discharge',
      'Support for recovery and post-care travel',
      'Coordination with family or care providers',
      'Safe ride home when you need it most',
    ],
  },
  {
    icon: '🩸',
    title: 'Dialysis Transportation',
    description: 'Dependable transportation for dialysis appointments with reliable timing and compassionate care for each trip.',
    features: [
      'Regularly scheduled rides',
      'Punctual arrival for treatment',
      'Support for patients with ongoing care needs',
      'Peace of mind for caregivers and families',
    ],
  },
  {
    icon: '🧑‍⚕️',
    title: 'Physical Therapy & Rehabilitation Visits',
    description: 'Transportation for therapy appointments, rehabilitation sessions, and other follow-up visits that are essential to recovery.',
    features: [
      'Reliable rides to therapy centers',
      'Support for recurring visits',
      'Flexible scheduling around treatment plans',
      'Comfortable travel for recovery support',
    ],
  },
  {
    icon: '🩺',
    title: 'Doctor & Specialist Appointments',
    description: 'On-time transportation to primary care offices, specialists, and other medical appointments across Northern Virginia.',
    features: [
      'Appointment-focused scheduling',
      'Wait time available during your visit',
      'Helpful support for sensitive or long appointments',
      'Dependable transportation for every visit',
    ],
  },
  {
    icon: '✈️',
    title: 'Airport Transportation (Private Pay)',
    description: 'Private transportation to and from major airports for travelers who want a comfortable and reliable ride.',
    features: [
      'Airport pickup and drop-off',
      'Luggage assistance available',
      'Punctual service for flights and arrivals',
      'Private, comfortable travel experience',
    ],
  },
  {
    icon: '🛣️',
    title: 'Long-Distance Medical Transportation',
    description: 'Safe long-distance transportation for medical appointments, treatments, and care needs outside your local area.',
    features: [
      'Travel for specialty care and treatment centers',
      'Comfortable ride for longer journeys',
      'Flexible planning for non-local appointments',
      'Dependable service for medical travel needs',
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
            Medical Transportation Services in Northern Virginia
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Professional NEMT, wheelchair transportation, dialysis transportation, and private medical transportation serving Manassas, Manassas Park, Woodbridge, Fairfax, Alexandria, Arlington, and Prince William County.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Transportation Services</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From routine medical visits to wheelchair-accessible transport and long-distance care travel, we offer clear, dependable transportation solutions for every need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              href={`tel:${PHONE_E164}`}
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
