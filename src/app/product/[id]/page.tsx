import { supabase } from '@/lib/supabase';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Fetch product data on the server
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!product) {
    notFound();
  }

  // Pass the fetched product data directly to the client component
  // so that it renders instantly without a loading screen
  return <ProductClient initialProduct={product} />;
}
