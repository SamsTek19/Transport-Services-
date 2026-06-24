import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BookPage } from './pages/BookPage';
import { AdminPage } from './pages/AdminPage';
import { useNavigation } from './hooks/useNavigation';

function App() {
  const { currentPage } = useNavigation();

  if (currentPage === 'admin') {
    return <AdminPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'services':
        return <ServicesPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'book':
        return <BookPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header />
      <main className="min-h-screen">{renderPage()}</main>
      <Footer />
    </div>
  );
}

export default App;
