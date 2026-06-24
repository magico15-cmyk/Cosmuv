import { StoreClient } from "./StoreClient";
import { getTenantFromHost } from "@/lib/tenant";

export default async function StoreHomePage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-500">The store you are looking for does not exist or is inactive.</p>
        </div>
      </div>
    );
  }

  return <StoreClient store={store} />;
}
