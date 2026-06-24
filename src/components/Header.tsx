import { useState } from 'react';
import { Menu, X, Phone, Car } from 'lucide-react';
import { useNavigation, Page } from '../hooks/useNavigation';

const navLinks: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Services', page: 'services' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

export function Header() {
  const { currentPage, navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: Page) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group"
          >
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Angels Of Hope</span>
              <span className="text-sm text-teal-600 font-medium -mt-0.5">Transportation</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === link.page
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+17039805916"
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">(703) 980-5916</span>
            </a>
            <button
              onClick={() => handleNav('book')}
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-teal-800 transition-all transform hover:-translate-y-0.5"
            >
              Book a Ride
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={`px-4 py-3 rounded-lg font-medium text-left transition-colors ${
                    currentPage === link.page
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-3 mt-4 px-4">
                <a
                  href="tel:+17039805916"
                  className="flex items-center justify-center gap-2 py-3 text-teal-600 font-medium bg-teal-50 rounded-lg"
                >
                  <Phone className="w-5 h-5" />
                  (703) 980-5916
                </a>
                <button
                  onClick={() => handleNav('book')}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Book a Ride
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
