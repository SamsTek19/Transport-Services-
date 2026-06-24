import { Heart, Shield, Award, Users, Target, Eye, CheckCircle } from 'lucide-react';
import { useNavigation, Page } from '../hooks/useNavigation';

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Every trip is planned with safety as our top priority. Our vehicles are regularly maintained and our drivers are thoroughly trained.',
  },
  {
    icon: Heart,
    title: 'Compassion',
    description: 'We treat every passenger with dignity, respect, and genuine care. Your comfort matters to us.',
  },
  {
    icon: Users,
    title: 'Reliability',
    description: 'Count on us to be there when you need us. We take our commitments seriously because we know you depend on us.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We continually strive to exceed expectations and provide the best possible transportation experience.',
  },
];

const team = [
  {
    role: 'Management Team',
    description: 'Our leadership team brings decades of experience in healthcare and transportation services.',
  },
  {
    role: 'Professional Drivers',
    description: 'Background-checked, trained, and dedicated to providing safe, comfortable rides for every passenger.',
  },
  {
    role: 'Customer Support',
    description: 'Friendly, responsive team members ready to help with scheduling, questions, and any concerns.',
  },
];

export function AboutPage() {
  const { navigate } = useNavigation();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5 text-teal-300" />
            <span className="text-teal-100 text-sm font-medium">About Our Company</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Angels Of Hope Transportation
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Dedicated to providing safe, reliable, and compassionate non-emergency medical transportation services.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To provide safe, reliable, and compassionate transportation services that enable individuals,
                especially those with mobility challenges, to maintain their independence and access essential
                medical care with dignity and comfort.
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                To be the most trusted and respected non-emergency medical transportation provider in our
                community, known for our commitment to excellence, compassion, and the well-being of every
                passenger we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl opacity-20 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=800&q=80"
                alt="Professional transportation service"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-96"
              />
            </div>
            <div>
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Building Trust, One Ride at a Time
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Angels Of Hope Transportation was founded with a simple but powerful idea: everyone deserves
                access to reliable transportation, especially when it comes to medical care and essential
                appointments.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We recognized that many individuals, particularly seniors and those with mobility challenges,
                face significant barriers to transportation. This can lead to missed appointments, delayed
                care, and a loss of independence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our founders set out to create a service that would bridge this gap – providing not just
                transportation, but genuine care and support for every passenger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our core values guide every decision we make and every ride we provide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-teal-50 transition-colors group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 rounded-xl mb-4 group-hover:bg-teal-600 transition-colors">
                  <value.icon className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Dedicated Professionals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team is committed to providing exceptional service with every ride.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{member.role}</h3>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-8">
                Experience the Difference
              </h2>
              <div className="space-y-4">
                {[
                  'Fully licensed and insured transportation provider',
                  'Drivers trained in passenger assistance and mobility support',
                  'Clean, well-maintained, and comfortable vehicles',
                  'Wheelchair and mobility aid accessible vehicles available',
                  'Flexible scheduling to meet your specific needs',
                  'Competitive, transparent pricing with no hidden fees',
                  'Bilingual staff available to assist you',
                  '24/7 customer support for booking and inquiries',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl opacity-20 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=800&q=80"
                alt="Comfortable transportation experience"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Our Care?
          </h2>
          <p className="text-teal-100 text-lg mb-8">
            Join the thousands of passengers who trust Angels Of Hope Transportation for their travel needs.
          </p>
          <button
            onClick={() => navigate('book' as Page)}
            className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            Book Your Ride Today
          </button>
        </div>
      </section>
    </div>
  );
}
