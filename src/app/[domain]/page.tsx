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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to {store.store_name}</h1>
      <p className="text-gray-600 mb-8">This is the public storefront for {params.domain}</p>
      
      <div className="flex gap-4">
        <a 
          href={`/product/test`} 
          className="px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          View a Product
        </a>
        <a 
          href={`/checkout`} 
          className="px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go to Checkout
        </a>
      </div>
    </div>
  );
}
