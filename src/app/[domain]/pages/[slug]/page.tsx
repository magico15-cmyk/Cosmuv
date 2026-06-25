import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getTenantFromHost } from "@/lib/tenant";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function CustomStorePage({ params }: { params: Promise<{ domain: string, slug: string }> }) {
  const resolvedParams = await params;
  const store = await getTenantFromHost(resolvedParams.domain);
  
  if (!store) {
    notFound();
  }

  // Fetch the page content
  const { data: page } = await supabase
    .from('store_pages')
    .select('*')
    .eq('store_id', store.id)
    .eq('slug', resolvedParams.slug)
    .eq('is_published', true)
    .single();

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Spacer (assuming global layout header exists) */}
      <div className="pt-[100px]" style={{ backgroundColor: store.body_bg || '#f9fafb' }}></div>
      
      <main className="flex-grow w-full max-w-[800px] mx-auto px-5 py-12 md:py-20" style={{ backgroundColor: store.body_bg || '#f9fafb' }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pb-6 border-b border-gray-100">
            {page.title}
          </h1>
          
          <div 
            className="prose prose-gray max-w-none text-gray-700 leading-relaxed custom-page-content"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
        </div>
      </main>

      {/* Basic styles for raw HTML content injected via dangerouslySetInnerHTML if typography plugin is absent */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-page-content h1 { font-size: 2em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #111827; }
        .custom-page-content h2 { font-size: 1.5em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #1f2937; }
        .custom-page-content h3 { font-size: 1.25em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; color: #374151; }
        .custom-page-content p { margin-top: 0; margin-bottom: 1em; }
        .custom-page-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .custom-page-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .custom-page-content a { color: ${store.primary_color || '#3b82f6'}; text-decoration: underline; }
        .custom-page-content strong { font-weight: 600; color: #111827; }
        .custom-page-content em { font-style: italic; }
        .custom-page-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1em; color: #6b7280; font-style: italic; }
      `}} />
    </div>
  );
}
