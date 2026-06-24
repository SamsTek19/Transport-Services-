import { Phone, Shield, Clock, Heart, ChevronRight, Star, Users, Award } from 'lucide-react';
import { useNavigation, Page } from '../hooks/useNavigation';

const services = [
  {
    icon: '🏥',
    title: 'Medical Appointments',
    description: 'Reliable transportation to and from doctor visits, dialysis, and therapy sessions.',
  },
  {
    icon: '✈️',
    title: 'Airport Transfers',
    description: 'Comfortable and timely airport transportation for all your travel needs.',
  },
  {
    icon: '👴',
    title: 'Senior Transportation',
    description: 'Compassionate service designed for elderly passengers with special care.',
  },
  {
    icon: '♿',
    title: 'Wheelchair Accessible',
    description: 'Fully equipped vehicles for passengers with mobility challenges.',
  },
];

const stats = [
  { value: '10,000+', label: 'Rides Completed', icon: Users },
  { value: '99%', label: 'On-Time Rate', icon: Clock },
  { value: '5-Star', label: 'Customer Rating', icon: Star },
  { value: '24/7', label: 'Support Available', icon: Award },
];

export function HomePage() {
  const { navigate } = useNavigation();

  const scrollToServices = () => {
    navigate('services' as Page);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5 text-teal-300" />
              <span className="text-teal-100 text-sm font-medium">Trusted by families across Northern Virginia</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Safe & Reliable{' '}
              <span className="text-teal-300">Transportation</span>{' '}
              You Can Trust
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Compassionate non-emergency medical transportation services. We get you there safely, comfortably, and on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('book' as Page)}
                className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Book a Ride Now
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="tel:+17039805916"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Transportation Solutions for Every Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a wide range of transportation services tailored to meet your specific requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={scrollToServices}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={scrollToServices}
              className="text-teal-600 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All Services
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Your Trusted Partner in Transportation
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At Angels Of Hope Transportation, we understand that getting to your destination safely and on time
                is essential. Our professional drivers and well-maintained vehicles ensure you receive the best
                care possible.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Safe & Insured', desc: 'Fully licensed, insured, and background-checked drivers' },
                  { icon: Clock, title: 'Always On Time', desc: 'Punctual service you can rely on for important appointments' },
                  { icon: Heart, title: 'Compassionate Care', desc: 'Trained to assist passengers with special needs' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl opacity-20 blur-2xl"></div>
              <img
                src="https://res.cloudinary.com/dzydzt8x8/image/upload/v1782159429/774-219-1809_kwnk93.jpg"
                alt="Professional driver helping passenger"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Our Service?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Book your ride today and enjoy safe, reliable transportation with a team that truly cares.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('book' as Page)}
              className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              Book Your Ride
            </button>
            <a
              href="tel:+17039805916"
              className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-800 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              (703) 980-5916
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
