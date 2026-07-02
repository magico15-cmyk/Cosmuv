import ProductEditor from "@/components/admin/ProductEditor";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

import { getTenantFromHost } from "@/lib/tenant";

export default async function EditProductPage(props: { params: Promise<{ domain: string, id: string }> }) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  let query = supabase
    .from("products")
    .select("*")
    .eq("id", params.id);

  // Enforce store isolation: only allow editing products belonging to this store
  if (store?.id) {
    query = query.eq("store_id", store.id);
  }

  const { data: product, error } = await query.single();

  if (error || !product) {
    notFound();
  }

  return <ProductEditor initialData={product} storeId={store?.id} />;
}
