import React from 'react';

export default function AsyncFontLoader({ href }: { href: string }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" as="style" href={href} />
      <link rel="stylesheet" href={href} />
    </>
  );
}
