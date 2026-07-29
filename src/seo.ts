import type { Page } from './hooks/useNavigation';

const pageMeta: Record<Page, { title: string; description: string }> = {
  home: {
    title: 'Angels Of Hope Transportation | NEMT & Medical Transport in Northern Virginia',
    description:
      'Reliable non-emergency medical transportation, wheelchair transportation, and dialysis transportation across Manassas, Manassas Park, Woodbridge, Fairfax, Alexandria, Arlington, and Prince William County.',
  },
  services: {
    title: 'NEMT, Wheelchair & Dialysis Transportation Services | Angels Of Hope',
    description:
      'Professional NEMT, wheelchair transportation, medical transport, and dialysis transportation services serving Northern Virginia communities.',
  },
  about: {
    title: 'About Angels Of Hope Transportation | Trusted NEMT Provider',
    description:
      'Learn about Angels Of Hope Transportation, a trusted provider of non-emergency medical transportation and wheelchair transport in Northern Virginia.',
  },
  contact: {
    title: 'Contact Angels Of Hope Transportation | Book a Ride',
    description:
      'Contact Angels Of Hope Transportation for NEMT, wheelchair transportation, and medical transport in Northern Virginia.',
  },
  book: {
    title: 'Book Medical Transportation | Angels Of Hope Transportation',
    description:
      'Book reliable medical transportation, wheelchair accessible rides, and dialysis transportation in Northern Virginia.',
  },
  admin: {
    title: 'Admin Dashboard | Angels Of Hope Transportation',
    description: 'Administrative dashboard for Angels Of Hope Transportation.',
  },
};

export function updatePageMetadata(page: Page) {
  const meta = pageMeta[page] ?? pageMeta.home;

  document.title = meta.title;

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute('content', meta.description);
  }

  const canonicalTag = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = `https://angelsofhopetransportation.com/${page === 'home' ? '' : page}`;
  if (canonicalTag) {
    canonicalTag.setAttribute('href', canonicalUrl);
  } else {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }
}
