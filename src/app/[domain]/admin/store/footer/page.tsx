import { notFound } from "next/navigation";
import { getTenantFromHost } from "@/lib/tenant";
import FooterClient from "./FooterClient";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function FooterSettingsPage({ params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  const store = await getTenantFromHost(resolvedParams.domain);

  if (!store) {
    console.error("Error fetching store: Store not found for domain", resolvedParams.domain);
    notFound();
  }

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-[calc(100vh-80px)]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Footer</h2>
        <p className="text-gray-500 mt-1">Manage your store's footer content and settings.</p>
      </div>
      <FooterClient store={store} />
    </div>
  );
}
