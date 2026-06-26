import { StoreClient } from "./StoreClient";
import { getTenantFromHost } from "@/lib/tenant";
import { supabase } from "@/lib/supabase";

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

  // Fetch products server-side for instant loading
  const { data: rawProducts } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .eq('visibility', 'Visible');

  const products = (rawProducts || []).map(p => ({
    ...p,
    title: p.name,
    oldPrice: p.originalPrice
  }));

  return <StoreClient store={store} initialProducts={products} />;
}
