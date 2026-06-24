import { Metadata } from "next";
import { getTenantFromHost } from "@/lib/tenant";
import React from "react";

export async function generateMetadata(
  props: { params: Promise<{ domain: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  if (!store) {
    return {
      title: "Store Not Found",
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

export default function DomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
