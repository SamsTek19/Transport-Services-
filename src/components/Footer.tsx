import { Phone, Mail, Clock, MapPin, Car, Facebook, Twitter, Instagram } from 'lucide-react';
import { useNavigation, Page } from '../hooks/useNavigation';

const businessHours = [
  { day: 'Monday – Thursday', hours: '6:00 AM – 9:00 PM' },
  { day: 'Friday', hours: '6:00 AM – 5:00 PM' },
];

export function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-teal-600 p-2.5 rounded-xl">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Angels Of Hope</span>
                <span className="text-sm text-teal-400 font-medium -mt-0.5">Transportation</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md mb-6">
              Providing safe, reliable, and compassionate non-emergency medical transportation services.
              Your health and comfort are our top priorities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-teal-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-teal-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-xl hover:bg-teal-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'Services', page: 'services' as Page },
                { label: 'About Us', page: 'about' as Page },
                { label: 'Contact', page: 'contact' as Page },
                { label: 'Book a Ride', page: 'book' as Page },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+17039805916"
                  className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <Phone className="w-5 h-5 text-teal-500" />
                  +1 (703) 980-5916
                </a>
              </li>
              <li>
                <a
                  href="mailto:isaacaopoku@yahoo.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <Mail className="w-5 h-5 text-teal-500" />
                  isaacaopoku@yahoo.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <Clock className="w-5 h-5 text-teal-500 mt-0.5" />
                  <div className="space-y-1">
                    {businessHours.map((item) => (
                      <div key={item.day} className="text-sm">
                        <span className="font-medium text-white">{item.day}:</span> {item.hours}
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-teal-500 mt-0.5" />
                  <span>Serving Northern Virginia and surrounding areas</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Angels Of Hope Transportation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
