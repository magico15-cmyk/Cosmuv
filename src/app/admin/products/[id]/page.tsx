import ProductEditor from "@/components/admin/ProductEditor";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductEditor initialData={product} />;
}
