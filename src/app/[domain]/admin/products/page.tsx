import ProductGrid from "@/components/admin/ProductGrid";
import { getTenantFromHost } from "@/lib/tenant";

export default async function ProductsPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-[calc(100vh-80px)]">
      <ProductGrid storeId={store?.id} />
    </div>
  );
}
