"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function PageEditor({ store, pageId }: { store: any, pageId: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  
  const isNew = pageId === "new";
  
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [pageId]);

  const fetchPage = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) throw error;
      
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content || "");
        setIsPublished(data.is_published);
      }
    } catch (err: any) {
      console.error("Error fetching page:", err);
      showToast(err.message || "Failed to load page", "error");
      router.push("/admin/store/pages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate slug if it's a new page and the user hasn't heavily modified it
    if (isNew) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      showToast("Title and URL Slug are required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const pageData = {
        store_id: store.id,
        title,
        slug,
        content,
        is_published: isPublished
      };

      let error;

      if (isNew) {
        const { error: insertError } = await supabase
          .from('store_pages')
          .insert([pageData]);
        error = insertError;
      } else {
        const { error: updateError } = await supabase
          .from('store_pages')
          .update(pageData)
          .eq('id', pageId);
        error = updateError;
      }

      if (error) {
        if (error.code === '23505') {
          throw new Error("A page with this URL slug already exists. Please choose a different slug.");
        }
        throw error;
      }

      showToast(`Page ${isNew ? 'created' : 'updated'} successfully!`, "success");
      router.push("/admin/store/pages");
      router.refresh();
    } catch (err: any) {
      console.error("Error saving page:", err);
      showToast(err.message || "Failed to save page", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/store/pages"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isNew ? 'Create New Page' : 'Edit Page'}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer mr-2">
            <span className="text-sm font-medium text-gray-700">Published</span>
            <button 
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPublished ? 'bg-brand-500' : 'bg-gray-200'}`}
            >
              <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </label>
          <Link 
            href="/admin/store/pages"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </Link>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircleIcon className="w-5 h-5" />
            )}
            Save Page
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Page Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. About Us"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Slug</label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-gray-500 text-sm whitespace-nowrap">
                  /{store.domain}/pages/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="about-us"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-0 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <label className="block text-sm font-semibold text-gray-700">Content</label>
            </div>
            <div className="flex-1 relative overflow-hidden rounded-b-xl">
              <RichTextEditor
                id={`page-${pageId}`}
                value={content}
                onChange={setContent}
                align="left"
                color="#000000"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
