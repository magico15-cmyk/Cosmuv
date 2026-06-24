import { supabase } from '@/lib/supabase';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';
import { getTenantFromHost } from '@/lib/tenant';

export default async function ProductPage({ params }: { params: Promise<{ domain: string; id: string }> }) {
  const resolvedParams = await params;
  const store = await getTenantFromHost(resolvedParams.domain);
  
  if (!store) {
    notFound();
  }

  // Fetch product data on the server
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .eq('store_id', store.id)
    .single();

  if (!product) {
    notFound();
  }

  // Pass the fetched product data directly to the client component
  // so that it renders instantly without a loading screen
  return <ProductClient initialProduct={product} store={store} />;
}
