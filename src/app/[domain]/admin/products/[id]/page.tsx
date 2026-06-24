import ProductEditor from "@/components/admin/ProductEditor";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

import { getTenantFromHost } from "@/lib/tenant";

export default async function EditProductPage(props: { params: Promise<{ domain: string, id: string }> }) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductEditor initialData={product} storeId={store?.id} />;
}
