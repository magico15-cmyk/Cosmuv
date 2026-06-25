import { notFound } from "next/navigation";
import { getTenantFromHost } from "@/lib/tenant";
import PagesClient from "./PagesClient";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function StorePagesPage({ params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  const store = await getTenantFromHost(resolvedParams.domain);

  if (!store) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-[calc(100vh-80px)]">
      <div className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pages</h2>
          <p className="text-gray-500 mt-1">Manage your store's custom pages.</p>
        </div>
      </div>
      <PagesClient store={store} />
    </div>
  );
}
