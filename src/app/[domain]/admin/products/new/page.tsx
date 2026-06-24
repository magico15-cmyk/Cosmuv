import ProductEditor from "@/components/admin/ProductEditor";

import { getTenantFromHost } from "@/lib/tenant";

export default async function NewProductPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  return <ProductEditor storeId={store?.id} />;
}
