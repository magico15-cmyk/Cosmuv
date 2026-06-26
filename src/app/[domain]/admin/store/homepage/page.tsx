import { getTenantFromHost } from "@/lib/tenant";
import HomepageClient from "./HomepageClient";

export default async function HomepageSettingsPage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-[calc(100vh-80px)]">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Homepage</h2>
        <p className="text-gray-500 mt-1">
          Manage your store's homepage slider and promotional banners.
        </p>
      </div>
      <HomepageClient store={store} />
    </div>
  );
}
