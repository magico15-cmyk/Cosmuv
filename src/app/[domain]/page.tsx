import { StoreClient } from "./StoreClient";
import { getTenantFromHost } from "@/lib/tenant";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function StoreHomePage(props: {
  params: Promise<{ domain: string }>;
}) {
  const params = await props.params;
  const store = await getTenantFromHost(params.domain);

  if (!store) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
        <div className="text-center max-w-md">
          {/* Animated icon */}
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Store Not Found
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-8 leading-relaxed">
            The store you&apos;re looking for doesn&apos;t exist, may have been removed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
            >
              Go to Homepage
            </a>
          </div>

          <p className="mt-10 text-xs text-gray-400">
            Powered by <span className="font-semibold text-gray-500">Cosmuv</span>
          </p>
        </div>
      </div>
    );
  }

  // Fetch products server-side for instant loading
  let query = supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .eq('visibility', 'Visible');

  if (store.homepage_products_category && store.homepage_products_category.trim() !== '') {
    query = query.eq('category', store.homepage_products_category);
  }

  const { data: rawProducts } = await query;

  const products = (rawProducts || []).map(p => ({
    ...p,
    title: p.name,
    oldPrice: p.originalPrice
  }));

  // Preload the LCP hero banner image so the browser discovers it immediately from HTML
  const sliderImages = Array.isArray(store.slider_images)
    ? store.slider_images
    : (typeof store.slider_images === 'string' ? JSON.parse(store.slider_images || '[]') : []);
  const firstHeroImage = sliderImages.length > 0 ? sliderImages[0] : null;

  return (
    <>
      {firstHeroImage && (
        <link
          rel="preload"
          as="image"
          href={firstHeroImage}
          fetchPriority="high"
        />
      )}
      <StoreClient store={store} initialProducts={products} />
    </>
  );
}
