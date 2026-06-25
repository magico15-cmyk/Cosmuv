"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, DocumentTextIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";

export default function PagesClient({ store }: { store: any }) {
  const router = useRouter();
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchPages();
  }, [store.id]);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_pages')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (err: any) {
      console.error("Error fetching pages:", JSON.stringify(err));
      showToast(err?.message || JSON.stringify(err) || "Failed to fetch pages", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page? This cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from('store_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      
      showToast("Page deleted successfully", "success");
      setPages(pages.filter(p => p.id !== pageId));
    } catch (err: any) {
      console.error("Error deleting page:", err);
      showToast(err.message || "Failed to delete page", "error");
    }
  };

  const togglePublish = async (page: any) => {
    try {
      const { error } = await supabase
        .from('store_pages')
        .update({ is_published: !page.is_published })
        .eq('id', page.id);

      if (error) throw error;
      
      setPages(pages.map(p => p.id === page.id ? { ...p, is_published: !p.is_published } : p));
      showToast(page.is_published ? "Page unpublished" : "Page published", "success");
    } catch (err: any) {
      console.error("Error updating page:", err);
      showToast(err.message || "Failed to update page", "error");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
      <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">All Pages</h3>
        <Link 
          href={`/admin/store/pages/new`}
          className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Create Page
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">URL Slug</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">Loading pages...</td>
              </tr>
            ) : pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <DocumentTextIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No pages created yet</p>
                    <p className="text-gray-400 text-sm mt-1 mb-4">Create your first custom page for your store</p>
                    <Link 
                      href={`/admin/store/pages/new`}
                      className="text-brand-500 text-sm font-medium hover:text-brand-600"
                    >
                      + Create New Page
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{page.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Updated {new Date(page.updated_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    /{page.slug}
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => togglePublish(page)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        page.is_published 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {page.is_published ? (
                        <><CheckCircleIcon className="w-3.5 h-3.5" /> Published</>
                      ) : (
                        <><XCircleIcon className="w-3.5 h-3.5" /> Draft</>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/admin/store/pages/${page.id}`}
                        className="text-gray-400 hover:text-brand-500 transition-colors"
                        title="Edit Page"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => deletePage(page.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Page"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <a 
                        href={`http://${store.custom_domain || (store.subdomain || store.slug) + '.localhost'}:3000/pages/${page.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-gray-400 hover:text-brand-500 transition-colors"
                        title="View Page"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
