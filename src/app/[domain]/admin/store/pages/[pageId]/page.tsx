import { notFound } from "next/navigation";
import { getTenantFromHost } from "@/lib/tenant";
import PageEditor from "./PageEditor";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function StorePageEditorPage({ params }: { params: Promise<{ domain: string, pageId: string }> }) {
  const resolvedParams = await params;
  const store = await getTenantFromHost(resolvedParams.domain);

  if (!store) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col h-[calc(100vh-80px)]">
      <PageEditor store={store} pageId={resolvedParams.pageId} />
    </div>
  );
}
