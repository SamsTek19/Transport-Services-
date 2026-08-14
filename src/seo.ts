import type { Page } from './hooks/useNavigation';
import { BUSINESS_NAME, EMAIL, ICON_512_URL, LOGO_URL, SITE_URL } from './constants/site';

const pageMeta: Record<Page, { title: string; description: string; indexable: boolean }> = {
  home: {
    title: 'Angels Of Hope Transportation | NEMT & Medical Transport in Northern Virginia',
    description:
      'Reliable non-emergency medical transportation, wheelchair transportation, and dialysis transportation across Manassas, Manassas Park, Woodbridge, Fairfax, Alexandria, Arlington, and Prince William County.',
    indexable: true,
  },
  services: {
    title: 'NEMT, Wheelchair & Dialysis Transportation Services | Angels Of Hope',
    description:
      'Professional NEMT, wheelchair transportation, medical transport, and dialysis transportation services serving Northern Virginia communities.',
    indexable: true,
  },
  about: {
    title: 'About Angels Of Hope Transportation | Trusted NEMT Provider',
    description:
      'Learn about Angels Of Hope Transportation, a trusted provider of non-emergency medical transportation and wheelchair transport in Northern Virginia.',
    indexable: true,
  },
  contact: {
    title: 'Contact Angels Of Hope Transportation | Book a Ride',
    description:
      'Contact Angels Of Hope Transportation for NEMT, wheelchair transportation, and medical transport in Northern Virginia. Call (703) 452-1665 or email info@angelsofhopetransportation.com.',
    indexable: true,
  },
  book: {
    title: 'Book Medical Transportation | Angels Of Hope Transportation',
    description:
      'Book reliable medical transportation, wheelchair accessible rides, and dialysis transportation in Northern Virginia.',
    indexable: true,
  },
  admin: {
    title: 'Admin Dashboard | Angels Of Hope Transportation',
    description: 'Administrative dashboard for Angels Of Hope Transportation.',
    indexable: false,
  },
};

function setMetaTag(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(`${selector}[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

export function updatePageMetadata(page: Page) {
  const meta = pageMeta[page] ?? pageMeta.home;
  const canonicalUrl = `${SITE_URL}/${page === 'home' ? '' : page}`;

  document.title = meta.title;

  setMetaTag('meta', 'name', 'description', meta.description);
  setMetaTag('meta', 'name', 'robots', meta.indexable ? 'index, follow' : 'noindex, nofollow');

  setLinkTag('canonical', canonicalUrl);

  setMetaTag('meta', 'property', 'og:title', meta.title);
  setMetaTag('meta', 'property', 'og:description', meta.description);
  setMetaTag('meta', 'property', 'og:url', canonicalUrl);
  setMetaTag('meta', 'property', 'og:type', 'website');
  setMetaTag('meta', 'property', 'og:site_name', BUSINESS_NAME);
  setMetaTag('meta', 'property', 'og:image', LOGO_URL);
  setMetaTag('meta', 'property', 'og:image:alt', `${BUSINESS_NAME} logo`);

  setMetaTag('meta', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta', 'name', 'twitter:title', meta.title);
  setMetaTag('meta', 'name', 'twitter:description', meta.description);
  setMetaTag('meta', 'name', 'twitter:image', ICON_512_URL);
}

export function getPageCanonicalUrl(page: Page) {
  return `${SITE_URL}/${page === 'home' ? '' : page}`;
}

export { pageMeta, EMAIL };
