'use client';

import { useEffect } from 'react';

export default function AsyncFontLoader({ href }: { href: string }) {
  useEffect(() => {
    // Load font stylesheet asynchronously after paint to avoid render-blocking
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [href]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* Preload hints the browser to start downloading early, but as="style" + preload is non-render-blocking */}
      <link rel="preload" as="style" href={href} />
    </>
  );
}
