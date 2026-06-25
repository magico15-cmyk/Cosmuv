"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, DocumentTextIcon, GlobeAltIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
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
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading page...</span>
        </div>
      </div>
    );
  }

  const storeDomain = store.custom_domain || store.subdomain || store.slug;

  return (
    <div className="w-full pb-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/store/pages"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Create New Page' : 'Edit Page'}
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {isNew ? 'Set up a new custom page for your store' : `Editing "${title || 'Untitled'}"`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/store/pages"
            className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Discard
          </Link>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:shadow-sm"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {isSaving ? 'Saving...' : (isNew ? 'Publish Page' : 'Save Changes')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. About Us, Contact, FAQ"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none text-lg"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">Page Content</h3>
            </div>
            <div className="p-6">
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

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Visibility Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Visibility</h3>
            </div>
            <div className="p-5">
              <button 
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                  isPublished 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isPublished ? (
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      <EyeIcon className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                      <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${isPublished ? 'text-green-700' : 'text-gray-700'}`}>
                      {isPublished ? 'Published' : 'Draft'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isPublished ? 'Visible to customers' : 'Only visible to you'}
                    </p>
                  </div>
                </div>
                <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* URL Slug Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">URL & SEO</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="about-us"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none text-sm"
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 font-medium mb-1">Page URL Preview</p>
                <p className="text-sm text-brand-600 font-mono break-all">
                  {storeDomain}/pages/<span className="font-semibold">{slug || '...'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
