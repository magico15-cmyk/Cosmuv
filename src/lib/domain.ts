/**
 * Centralized Domain and URL Helper Utilities
 * Strictly handles domain decoding and URL construction for cosmuv.com, accounts.cosmuv.com, and *.cosmuv.com.
 */

export function getRootDomain(): string {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  if (isProd) {
    const configured = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (configured && !configured.includes('localhost') && !configured.includes('127.0.0.1')) {
      return configured.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
    }
    return 'cosmuv.com';
  }
  const configured = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  return (configured || 'localhost:3000').replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
}

export function isLocalhost(hostOrDomain?: string): boolean {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  if (isProd && !hostOrDomain) {
    return false;
  }
  if (typeof window !== 'undefined' && !hostOrDomain) {
    const host = window.location.hostname;
    return host.includes('localhost') || host === '127.0.0.1';
  }
  const target = hostOrDomain || getRootDomain();
  return target.includes('localhost') || target === '127.0.0.1';
}

export function getProtocol(reqHeaders?: Headers | { get: (key: string) => string | null }): string {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  if (isProd) {
    return 'https';
  }
  if (typeof window !== 'undefined') {
    return window.location.protocol.replace(':', '');
  }
  if (isLocalhost()) {
    return 'http';
  }
  if (reqHeaders && typeof reqHeaders.get === 'function') {
    const proto = reqHeaders.get('x-forwarded-proto');
    if (proto) return proto;
  }
  return 'http';
}

export function getBaseHost(): string {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  if (isProd) {
    return getRootDomain();
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
      return window.location.host; // includes port e.g. localhost:3000
    }
  }
  const root = getRootDomain();
  if (root.includes('localhost')) {
    return root.includes(':') ? root : `${root}:3000`;
  }
  return root;
}

export interface DecodedHost {
  type: 'root' | 'accounts' | 'store';
  hostname: string;
  subdomain: string | null;
}

/**
 * Strictly decodes the incoming hostname into distinct route cases:
 * 1. Root Landing Page (cosmuv.com)
 * 2. Centralized Authentication Hub (accounts.cosmuv.com)
 * 3. Dynamic Store Subdomains (*.cosmuv.com)
 */
export function decodeHostname(rawHost: string): DecodedHost {
  const hostname = rawHost.split(':')[0].toLowerCase().trim();
  const rootDomain = getRootDomain().split(':')[0].toLowerCase().trim();

  // 1. Centralized Authentication Hub detection
  if (
    hostname === `accounts.${rootDomain}` ||
    hostname === 'accounts.cosmuv.com' ||
    hostname === 'accounts.localhost' ||
    (hostname.endsWith('.vercel.app') && hostname.startsWith('accounts---'))
  ) {
    return {
      type: 'accounts',
      hostname,
      subdomain: 'accounts',
    };
  }

  // 2. Root Landing Page detection
  if (
    hostname === rootDomain ||
    hostname === `www.${rootDomain}` ||
    hostname === 'cosmuv.com' ||
    hostname === 'www.cosmuv.com' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === 'cosmuv.vercel.app'
  ) {
    return {
      type: 'root',
      hostname,
      subdomain: null,
    };
  }

  // 3. Dynamic Store Subdomains (*.cosmuv.com)
  let subdomain = hostname;
  if (hostname.endsWith(`.${rootDomain}`)) {
    subdomain = hostname.replace(`.${rootDomain}`, '');
  } else if (hostname.endsWith('.cosmuv.com')) {
    subdomain = hostname.replace('.cosmuv.com', '');
  } else if (hostname.endsWith('.localhost')) {
    subdomain = hostname.replace('.localhost', '');
  } else if (hostname.endsWith('.vercel.app')) {
    subdomain = hostname.includes('---') ? hostname.split('---')[0] : hostname.replace('.vercel.app', '');
  }

  // Ensure 'www' or 'accounts' are not treated as valid store subdomains
  if (subdomain === 'www' || subdomain === 'accounts' || subdomain === 'cosmuv') {
    return {
      type: 'root',
      hostname,
      subdomain: null,
    };
  }

  return {
    type: 'store',
    hostname,
    subdomain,
  };
}

export function getAccountsUrl(path: string = ''): string {
  const normalizedPath = path.startsWith('/') || path === '' ? path : `/${path}`;
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  if (isProd) {
    const root = getRootDomain();
    return `https://accounts.${root}${normalizedPath}`;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('localhost') || host === '127.0.0.1') {
      const port = window.location.port ? `:${window.location.port}` : ':3000';
      return `http://accounts.localhost${port}${normalizedPath}`;
    }
  }
  const root = getRootDomain();
  if (root.includes('localhost')) {
    const port = root.includes(':') ? '' : ':3000';
    return `http://accounts.${root}${port}${normalizedPath}`;
  }
  const protocol = getProtocol();
  return `${protocol}://accounts.${root}${normalizedPath}`;
}

export function getStoreUrl(subdomain: string, path: string = ''): string {
  const normalizedPath = path.startsWith('/') || path === '' ? path : `/${path}`;
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  if (isProd) {
    const root = getRootDomain();
    return `https://${subdomain}.${root}${normalizedPath}`;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('localhost') || host === '127.0.0.1') {
      const port = window.location.port ? `:${window.location.port}` : ':3000';
      return `http://${subdomain}.localhost${port}${normalizedPath}`;
    }
  }
  const root = getRootDomain();
  if (root.includes('localhost')) {
    const port = root.includes(':') ? '' : ':3000';
    return `http://${subdomain}.${root}${port}${normalizedPath}`;
  }
  const protocol = getProtocol();
  return `${protocol}://${subdomain}.${root}${normalizedPath}`;
}
