import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Page = 'home' | 'services' | 'about' | 'contact' | 'book' | 'admin';

const VALID_PAGES: Page[] = ['home', 'services', 'about', 'contact', 'book', 'admin'];

function getPageFromHash(): Page {
  const rawHash = window.location.hash.slice(1);

  if (!rawHash) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('code')) {
      return 'admin';
    }
    return 'home';
  }

  const hashParams = new URLSearchParams(rawHash);
  if (
    hashParams.get('access_token') ||
    hashParams.get('type') === 'invite' ||
    hashParams.get('type') === 'signup' ||
    hashParams.get('type') === 'recovery'
  ) {
    return 'admin';
  }

  const page = rawHash as Page;
  return VALID_PAGES.includes(page) ? page : 'home';
}

interface NavigationContextValue {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPage, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
