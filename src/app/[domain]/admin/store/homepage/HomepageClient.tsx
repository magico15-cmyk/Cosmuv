"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function HomepageClient({ store }: { store: any }) {
  const router = useRouter();
  
  // slider_images comes from the database as a JSONB array or string
  const initialImages = Array.isArray(store?.slider_images) 
    ? store.slider_images 
    : (typeof store?.slider_images === 'string' ? JSON.parse(store.slider_images || '[]') : []);

  const [images, setImages] = useState<string[]>(initialImages);
  
  // Products Section State
  const [productsEnabled, setProductsEnabled] = useState<boolean>(store?.homepage_products_enabled ?? true);
  const [productsTitle, setProductsTitle] = useState<string>(store?.homepage_products_title || 'Featured Products');
  const [productsSubtitle, setProductsSubtitle] = useState<string>(store?.homepage_products_subtitle || '');
  const [productsLimit, setProductsLimit] = useState<number>(store?.homepage_products_limit || 8);
  const [productsCategory, setProductsCategory] = useState<string>(store?.homepage_products_category || '');
  const [productsLoadMore, setProductsLoadMore] = useState<boolean>(store?.homepage_products_load_more ?? false);
  const [productsViewType, setProductsViewType] = useState<string>(store?.homepage_products_view_type || 'Grid');

  // Categories fetched from store_categories table
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      if (!store?.id) return;
      const { data } = await supabase
        .from('store_categories')
        .select('id, name')
        .eq('store_id', store.id)
        .order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [store?.id]);

  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for banner images
      if (file.size > MAX_FILE_SIZE) {
        showToast("Image size too large. Please upload an image under 5MB.", "error");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Upload failed');
      
      setImages(prev => [...prev, data.url]);
    } catch (error: any) {
      showToast('Error uploading image: ' + error.message, 'error');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const urlToRemove = images[indexToRemove];
    
    // Optimistically update UI
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));

    // Delete from storage if it's an R2 URL
    if (urlToRemove && urlToRemove.includes('.r2.dev/')) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToRemove }),
        });
      } catch (e) {
        console.error('Failed to delete image', e);
      }
    }
  };

  const handleSave = async () => {
    if (!store?.id) {
      showToast("Store ID missing. Cannot save.", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('stores')
        .update({ 
          slider_images: images,
          homepage_products_enabled: productsEnabled,
          homepage_products_title: productsTitle,
          homepage_products_subtitle: productsSubtitle,
          homepage_products_limit: productsLimit,
          homepage_products_category: productsCategory,
          homepage_products_load_more: productsLoadMore,
          homepage_products_view_type: productsViewType
        })
        .eq('id', store.id);

      if (error) throw error;

      showToast("Homepage settings saved successfully!", "success");
      router.refresh();
    } catch (err: any) {
      console.error("Error updating settings:", err);
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in-right max-w-sm w-full ${toast.type === 'success' ? 'bg-white border-green-100 text-gray-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {toast.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{toast.type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-sm mt-0.5 opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <XMarkIcon className="w-4 h-4 opacity-50" />
          </button>
        </div>
      )}

      <div className="w-full pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Slider Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Hero Slider Images</h3>
              <p className="text-sm text-gray-500">Upload up to 2 images for a slideshow, or just one for a static banner.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[21/9]">
                    <img src={url} alt={`Slider ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Upload Button — max 2 images */}
                {images.length < 2 && (
                <label className="relative rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer aspect-[21/9]">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <PhotoIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-medium">Add Image</span>
                    </div>
                  )}
                </label>
                )}
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Products List Section</h3>
              <p className="text-sm text-gray-500">Configure the featured products section on your homepage.</p>
              
              <div className="bg-gray-50/50 p-4 md:p-5 rounded-xl border border-gray-100 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-1">Enable Products Section</label>
                    <p className="text-xs text-gray-500">Show a list of your products on the homepage.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setProductsEnabled(!productsEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${productsEnabled ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${productsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {productsEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-200/60">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={productsTitle}
                        onChange={(e) => setProductsTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                        placeholder="e.g. Featured Products"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={productsSubtitle}
                        onChange={(e) => setProductsSubtitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                        placeholder="e.g. ✦ CURATED FOR YOU ✦"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                      <select
                        value={productsCategory}
                        onChange={(e) => setProductsCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none appearance-none"
                      >
                        <option value="">All Products</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">Filter homepage products by category.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Products to Show</label>
                      <input
                        type="number"
                        min="4"
                        max="24"
                        step="4"
                        value={productsLimit}
                        onChange={(e) => setProductsLimit(parseInt(e.target.value) || 8)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">Maximum number of products to display (recommend multiples of 4).</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                      <select
                        value={productsViewType}
                        onChange={(e) => setProductsViewType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none appearance-none"
                      >
                        <option value="Grid">Grid</option>
                        <option value="Slider">Slider</option>
                        <option value="Style 1">Style 1</option>
                        <option value="Style 2">Style 2</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between md:col-span-2 bg-white p-4 rounded-xl border border-gray-200">
                      <div>
                        <label className="text-sm font-medium text-gray-900 block mb-1">Show Load More Button</label>
                        <p className="text-xs text-gray-500">Display a button to load more products below the grid.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setProductsLoadMore(!productsLoadMore)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${productsLoadMore ? 'bg-gray-900' : 'bg-gray-200'}`}
                      >
                        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${productsLoadMore ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-56 bg-white border-t border-gray-200 p-4 flex justify-end z-40">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-2.5 rounded-md font-bold text-white shadow-sm transition-all flex items-center justify-center min-w-[140px] ${
            isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </>
  );
}
