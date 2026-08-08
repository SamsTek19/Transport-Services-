import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Page = 'home' | 'services' | 'about' | 'contact' | 'book' | 'admin';

const VALID_PAGES: Page[] = ['home', 'services', 'about', 'contact', 'book', 'admin'];
const PAGE_PATHS: Record<Page, string> = {
  home: '/',
  services: '/services',
  about: '/about',
  contact: '/contact',
  book: '/book',
  admin: '/admin',
};

function getPageFromLocation(): Page {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const pathPage = pathname === '/' ? 'home' : pathname.slice(1);

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.slice(1));

  if (
    searchParams.get('code') ||
    hashParams.get('access_token') ||
    hashParams.get('type') === 'invite' ||
    hashParams.get('type') === 'signup' ||
    hashParams.get('type') === 'recovery'
  ) {
    return 'admin';
  }

  if (VALID_PAGES.includes(pathPage as Page)) {
    return pathPage as Page;
  }

  return 'home';
}

interface NavigationContextValue {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>(() => getPageFromLocation());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(getPageFromLocation());
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((page: Page) => {
    const nextPath = PAGE_PATHS[page];
    setCurrentPage(page);
    window.history.pushState(null, '', nextPath);
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
