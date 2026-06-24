import { supabase } from '@/lib/supabase';
import CheckoutClient from './CheckoutClient';
import { notFound, redirect } from 'next/navigation';
import { getTenantFromHost } from '@/lib/tenant';

export default async function CheckoutPage(props: { searchParams: Promise<{ productId?: string, package?: string }>, params: Promise<{ domain: string }> }) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([props.params, props.searchParams]);
  const store = await getTenantFromHost(resolvedParams.domain);
  
  if (!store) {
    notFound();
  }

  const productId = resolvedSearchParams.productId;
  const packageIdStr = resolvedSearchParams.package || '1';
  
  if (!productId) {
    redirect('/');
  }

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('store_id', store.id)
    .single();

  if (!product) {
    notFound();
  }

  // extract the packages
  let pkgs = [];
  const bundlesBlock = product.content_blocks?.find((b: any) => b.type === 'bundles');
  
  let mainImage = '';
  try {
    const imgs = JSON.parse(product.image);
    if (Array.isArray(imgs) && imgs.length > 0) mainImage = imgs[0];
  } catch(e) {}
  
  const currencySymbol = store.currency || '$';

  const formatPrice = (p: any) => {
    if (!p) return p;
    let str = String(p).trim().replace('$', '');
    if (!str.includes('.')) {
      str = str + '.00';
    }
    return `${str} ${currencySymbol}`;
  };

  if (bundlesBlock && bundlesBlock.content && bundlesBlock.content.length > 0) {
    pkgs = bundlesBlock.content.map((pkg: any, idx: number) => ({
      ...pkg,
      id: idx + 1,
      price: formatPrice(pkg.price)
    }));
  } else {
    pkgs = [{ id: 1, title: 'Single', price: formatPrice(product.price), image: mainImage }];
  }
  
  const pkgIdNum = parseInt(packageIdStr) || 1;
  let foundPkg = pkgs.find((p: any) => p.id === pkgIdNum) || pkgs.find((p: any) => p.id === packageIdStr);
  if (!foundPkg) foundPkg = pkgs[0];
  
  const selectedPkg = {
    ...foundPkg,
    image: foundPkg.image || mainImage // fallback to main image if bundle doesn't have one
  };

  return <CheckoutClient product={product} selectedPkg={selectedPkg} storeId={store.id} store={store} />;
}
