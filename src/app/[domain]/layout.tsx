import { Metadata } from "next";
import { getTenantFromHost } from "@/lib/tenant";
import React from "react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { GlobalFooter } from "@/components/GlobalFooter";

export async function generateMetadata(
  props: { params: Promise<{ domain: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  if (!store) {
    return {
      title: "Store Not Found | Sello",
    };
  }

  return {
    title: store.store_name || "Store",
    icons: store.favicon_url
      ? {
          icon: store.favicon_url,
          apple: store.favicon_url,
        }
      : undefined,
  };
}

export default async function DomainLayout(props: {
  params: Promise<{ domain: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);
  const { children } = props;

  const storeFont = store?.store_font;
  const menuFont = storeFont || store?.menu_font || 'Inter';
  const bodyFont = storeFont || store?.body_font || 'Inter';

  // Construct Google Fonts URL for the selected fonts
  const fontsToLoad = Array.from(new Set([menuFont, bodyFont])).map(f => f.replace(/ /g, '+'));
  const fontUrl = `https://fonts.googleapis.com/css2?${fontsToLoad.map(f => `family=${f}:wght@400;500;600;700;800`).join('&')}&display=swap`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* Preload and async load the Google Fonts to prevent render blocking */}
      <link rel="preload" as="style" href={fontUrl} />
      <link rel="stylesheet" href={fontUrl} />

      {store && (
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-menu: '${menuFont}', sans-serif;
            --font-body: '${bodyFont}', sans-serif;
          }
          
          /* Apply body font globally */
          body, .font-body {
            font-family: var(--font-body) !important;
          }

          /* Apply menu font to specific elements */
          .font-menu, h1, h2, h3, h4, h5, h6, .header, nav, button {
            font-family: var(--font-menu) !important;
          }
        `}} />
      )}
      <GlobalHeader store={store} />
      {children}
      <GlobalFooter store={store} />
    </>
  );
}
