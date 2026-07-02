"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon, PhotoIcon, TrashIcon, PlusIcon, Bars2Icon, GlobeAltIcon, StarIcon, ShoppingBagIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CustomSelect from "@/components/admin/CustomSelect";

function DraggableSection({ id, title, icon, isOpen, toggleOpen, children }: { id: string, title: string, icon: React.ReactNode, isOpen: boolean, toggleOpen: () => void, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative bg-white border ${isDragging ? 'border-gray-900 shadow-xl ring-1 ring-gray-900' : 'border-gray-200'} rounded-xl transition-all`}>
      <div className="flex items-center w-full px-2 py-1.5">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab hover:bg-gray-100 p-2 rounded-lg text-gray-400 hover:text-gray-900 transition-colors shrink-0 touch-none"
        >
          <Bars2Icon className="w-5 h-5" />
        </div>
        <button 
          type="button"
          onClick={toggleOpen}
          className="flex-1 flex items-center gap-3 py-2 px-2 hover:opacity-80 transition-opacity text-left"
        >
          <ChevronRightIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
          <div className="shrink-0 text-gray-400">{icon}</div>
          <span className="text-[13px] font-bold tracking-wider text-gray-700 uppercase truncate">{title}</span>
        </button>
      </div>
      
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30 rounded-b-xl">
          {children}
        </div>
      )}
    </div>
  );
}

export default function HomepageClient({ store }: { store: any }) {
  const router = useRouter();
  
  // slider_images comes from the database as a JSONB array or string
  const initialImages = Array.isArray(store?.slider_images) 
    ? store.slider_images 
    : (typeof store?.slider_images === 'string' ? JSON.parse(store.slider_images || '[]') : []);

  const [images, setImages] = useState<string[]>(initialImages);
  const [heroText, setHeroText] = useState<string>(store?.homepage_hero_text || 'Profitez des meilleures offres de la semaine avec des réductions incroyables !');
  const [heroButtonText, setHeroButtonText] = useState<string>(store?.homepage_hero_button_text || 'Offres du jour');
  const [heroTextEnabled, setHeroTextEnabled] = useState<boolean>(store?.homepage_hero_text_enabled ?? true);
  
  // Products Section State
  const [productsEnabled, setProductsEnabled] = useState<boolean>(store?.homepage_products_enabled ?? true);
  const [productsTitle, setProductsTitle] = useState<string>(store?.homepage_products_title || 'Featured Products');
  const [productsSubtitle, setProductsSubtitle] = useState<string>(store?.homepage_products_subtitle || '');
  const [productsLimit, setProductsLimit] = useState<number>(store?.homepage_products_limit || 8);
  const [productsCategory, setProductsCategory] = useState<string>(store?.homepage_products_category || '');
  const [productsLoadMore, setProductsLoadMore] = useState<boolean>(store?.homepage_products_load_more ?? false);
  const [productsViewType, setProductsViewType] = useState<string>(store?.homepage_products_view_type || 'Grid');

  // Ticker Section State
  const defaultTickerItems = [
    "https://pub-33219faf94984e759ea6b688e0938491.r2.dev/1782523114620-4af3073e4ce7d21a.png",
    "https://pub-33219faf94984e759ea6b688e0938491.r2.dev/1782523120209-a1f6e87acb4941f4.png"
  ];
  const [tickerEnabled, setTickerEnabled] = useState<boolean>(store?.homepage_ticker_enabled ?? true);
  const [tickerItems, setTickerItems] = useState<string[]>(
    Array.isArray(store?.homepage_ticker_items)
      ? store.homepage_ticker_items
      : (typeof store?.homepage_ticker_items === 'string' ? JSON.parse(store.homepage_ticker_items || '[]') : defaultTickerItems)
  );

  // Features Section State
  const [featuresEnabled, setFeaturesEnabled] = useState<boolean>(store?.homepage_features_enabled ?? true);
  const [featuresViewType, setFeaturesViewType] = useState<string>(store?.homepage_features_view_type || 'Grid (2x2)');
  const [featuresTitle, setFeaturesTitle] = useState<string>(store?.homepage_features_title || 'Why Choose Us');
  const [featuresSubtitle, setFeaturesSubtitle] = useState<string>(store?.homepage_features_subtitle || '✦ OUR BENEFITS ✦');
  const [features, setFeatures] = useState<any[]>(
    Array.isArray(store?.homepage_features) 
      ? store.homepage_features 
      : (typeof store?.homepage_features === 'string' ? JSON.parse(store.homepage_features || '[]') : [])
  );

  // Layout Order State
  const defaultLayout = ["ticker", "features", "products"];
  const [layoutOrder, setLayoutOrder] = useState<string[]>(
    Array.isArray(store?.homepage_layout_order) 
      ? store.homepage_layout_order 
      : (typeof store?.homepage_layout_order === 'string' ? JSON.parse(store.homepage_layout_order || '["ticker", "features", "products"]') : defaultLayout)
  );

  useEffect(() => {
    if (store) {
      const dbImages = Array.isArray(store.slider_images) 
        ? store.slider_images 
        : (typeof store.slider_images === 'string' ? JSON.parse(store.slider_images || '[]') : []);
      setImages(dbImages);
    }
  }, [store?.slider_images]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLayoutOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
  const [productsOpen, setProductsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [tickerOpen, setTickerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for banner images
      if (file.size > MAX_FILE_SIZE) {
        showToast("Image size too large. Please upload an image under 10MB.", "error");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.details || 'Upload failed');
      }
      
      const newImages = [...images, data.url];
      setImages(newImages);
      if (store?.id) {
        const { error } = await supabase.from('stores').update({ slider_images: newImages }).eq('id', store.id);
        if (error) {
          showToast('Failed to save image: ' + error.message, 'error');
          return;
        }
        router.refresh();
      }
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
    const newImages = images.filter((_, idx) => idx !== indexToRemove);
    
    // Optimistically update UI
    setImages(newImages);

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

    // Immediately save updated array to database
    if (store?.id) {
      const { error } = await supabase.from('stores').update({ slider_images: newImages }).eq('id', store.id);
      if (error) {
        showToast('Failed to remove image from database: ' + error.message, 'error');
        return;
      }
      router.refresh();
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
          homepage_hero_text: heroText,
          homepage_hero_button_text: heroButtonText,
          homepage_hero_text_enabled: heroTextEnabled,
          homepage_products_enabled: productsEnabled,
          homepage_products_title: productsTitle,
          homepage_products_subtitle: productsSubtitle,
          homepage_products_limit: productsLimit,
          homepage_products_category: productsCategory,
          homepage_products_load_more: productsLoadMore,
          homepage_products_view_type: productsViewType,
          homepage_ticker_enabled: tickerEnabled,
          homepage_ticker_items: tickerItems,
          homepage_features_enabled: featuresEnabled,
          homepage_features_view_type: featuresViewType,
          homepage_features_title: featuresTitle,
          homepage_features_subtitle: featuresSubtitle,
          homepage_features: features,
          homepage_layout_order: layoutOrder
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
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

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-1">Enable Hero Text Block</label>
                  <p className="text-xs text-gray-500">Show the text and button below the slider.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setHeroTextEnabled(!heroTextEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${heroTextEnabled ? 'bg-gray-900' : 'bg-gray-200'}`}
                >
                  <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${heroTextEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {heroTextEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description Text</label>
                    <input
                      type="text"
                      value={heroText}
                      onChange={(e) => setHeroText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                      placeholder="e.g. Profitez des meilleures offres..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={heroButtonText}
                      onChange={(e) => setHeroButtonText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Draggable Sections */}
            <div className="space-y-2">
              {isMounted ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={layoutOrder} strategy={verticalListSortingStrategy}>
                    {layoutOrder.map((sectionId) => {
                      if (sectionId === 'ticker') {
                        return (
                          <DraggableSection
                            key={sectionId}
                            id={sectionId}
                            title="Brand/Shipping Ticker"
                            icon={<GlobeAltIcon className="w-5 h-5"/>}
                            isOpen={tickerOpen}
                            toggleOpen={() => setTickerOpen(!tickerOpen)}
                          >
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-1">Enable Ticker</label>
                    <p className="text-xs text-gray-500">Show scrolling logo marquee banner on homepage.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setTickerEnabled(!tickerEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${tickerEnabled ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${tickerEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {tickerEnabled && (
                  <div className="space-y-3 pt-3 border-t border-gray-200/60">
                    <label className="block text-sm font-medium text-gray-700">Ticker Logos</label>
                    <p className="text-xs text-gray-500">Upload brand/partner logo images (PNG, JPG). They will scroll across the banner.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {tickerItems.map((url, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-3 h-20">
                          <img src={url} alt={`Logo ${index + 1}`} className="max-h-full max-w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...tickerItems];
                              newItems.splice(index, 1);
                              setTickerItems(newItems);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      
                      <label className="relative rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer h-20">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const res = await fetch('/api/upload', { method: 'POST', body: formData });
                              const data = await res.json().catch(() => ({}));
                              if (!res.ok || !data.success) {
                                throw new Error(data.error || data.details || 'Upload failed');
                              }
                              setTickerItems(prev => [...prev, data.url]);
                            } catch (err: any) {
                              showToast('Error uploading logo: ' + err.message, 'error');
                            }
                            e.target.value = '';
                          }}
                        />
                        <PhotoIcon className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500 font-medium">Add Logo</span>
                      </label>
                    </div>
                  </div>
                )}
              </DraggableSection>
            );
                      }
                      if (sectionId === 'products') {
                        return (
                          <DraggableSection
                            key={sectionId}
                            id={sectionId}
                            title="Products List Section"
                            icon={<ShoppingBagIcon className="w-5 h-5"/>}
                            isOpen={productsOpen}
                            toggleOpen={() => setProductsOpen(!productsOpen)}
                          >
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
                      <CustomSelect
                        value={productsCategory}
                        onChange={(val) => setProductsCategory(val)}
                        options={[
                          { value: '', label: 'All Products' },
                          ...categories.map((cat) => ({ value: cat.name, label: cat.name }))
                        ]}
                      />
                      <p className="text-xs text-gray-500 mt-2">Filter homepage products by category.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Products to Show</label>
                      <input
                        type="number"
                        min="2"
                        max="24"
                        step="2"
                        value={productsLimit}
                        onChange={(e) => setProductsLimit(parseInt(e.target.value) || 8)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">Maximum number of products to display (recommend multiples of 2).</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                      <CustomSelect
                        value={productsViewType}
                        onChange={(val) => setProductsViewType(val)}
                        options={[
                          { value: 'Grid', label: 'Grid' },
                          { value: 'Slider', label: 'Slider' },
                          { value: 'Style 1', label: 'Style 1' },
                          { value: 'Style 2', label: 'Style 2' }
                        ]}
                      />
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
              </DraggableSection>
            );
                      }
                      if (sectionId === 'features') {
                        return (
                          <DraggableSection
                            key={sectionId}
                            id={sectionId}
                            title="Content Boxes / Features"
                            icon={<StarIcon className="w-5 h-5"/>}
                            isOpen={featuresOpen}
                            toggleOpen={() => setFeaturesOpen(!featuresOpen)}
                          >
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-1">Enable Features Section</label>
                    <p className="text-xs text-gray-500">Show a row of content boxes with icons.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFeaturesEnabled(!featuresEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${featuresEnabled ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${featuresEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {featuresEnabled && (
                  <div className="space-y-4 pt-4 border-t border-gray-200/60">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                      <CustomSelect
                        value={featuresViewType}
                        onChange={(val) => setFeaturesViewType(val)}
                        options={[
                          { value: 'Grid (2x2)', label: 'Grid (2x2) - Default' },
                          { value: 'Grid (4x1)', label: 'Grid (4x1) - Horizontal' },
                          { value: 'List (Vertical)', label: 'List (Vertical)' },
                          { value: 'Slider', label: 'Slider (Swipeable)' }
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                          type="text"
                          value={featuresTitle}
                          onChange={(e) => setFeaturesTitle(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                          placeholder="e.g. Why Choose Us"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Subtitle</label>
                        <input
                          type="text"
                          value={featuresSubtitle}
                          onChange={(e) => setFeaturesSubtitle(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                          placeholder="e.g. ✦ OUR BENEFITS ✦"
                        />
                      </div>
                    </div>

                    {features.map((feature, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                        <button 
                          type="button"
                          onClick={() => {
                            const newFeatures = [...features];
                            newFeatures.splice(index, 1);
                            setFeatures(newFeatures);
                          }}
                          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        
                        <div className="grid gap-4 mt-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Icon (Heroicon Name)</label>
                            <div className="flex items-center gap-2">
                              <div className="w-full [&>div>button]:py-2 [&>div>button]:px-3 [&>div>button]:text-sm">
                                <CustomSelect
                                  value={feature.icon || 'star'}
                                  onChange={(val) => {
                                    const newFeatures = [...features];
                                    newFeatures[index].icon = val;
                                    setFeatures(newFeatures);
                                  }}
                                  options={[
                                    { value: 'star', label: 'Star' },
                                    { value: 'heart', label: 'Heart' },
                                    { value: 'bolt', label: 'Lightning Bolt' },
                                    { value: 'leaf', label: 'Sun' },
                                    { value: 'truck', label: 'Truck / Shipping' },
                                    { value: 'shield-check', label: 'Shield Check' },
                                    { value: 'check-circle', label: 'Check Circle' },
                                    { value: 'shopping-bag', label: 'Shopping Bag' },
                                    { value: 'sparkles', label: 'Sparkles' },
                                    { value: 'gift', label: 'Gift' },
                                    { value: 'globe-alt', label: 'Globe' },
                                    { value: 'face-smile', label: 'Smile Face' },
                                    { value: 'clock', label: 'Clock' },
                                    { value: 'currency-dollar', label: 'Dollar' }
                                  ]}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={feature.title || ''}
                              onChange={(e) => {
                                const newFeatures = [...features];
                                newFeatures[index].title = e.target.value;
                                setFeatures(newFeatures);
                              }}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              rows={2}
                              value={feature.description || ''}
                              onChange={(e) => {
                                const newFeatures = [...features];
                                newFeatures[index].description = e.target.value;
                                setFeatures(newFeatures);
                              }}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => setFeatures([...features, { icon: 'star', title: 'New Feature', description: 'Describe the feature here.' }])}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Add Content Box
                    </button>
                  </div>
                )}
                          </DraggableSection>
                        );
                      }
                      return null;
                    })}
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="space-y-3">
                  {layoutOrder.map((id) => (
                    <div key={id} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-3 text-gray-500">
                      <Bars2Icon className="w-5 h-5 opacity-50" />
                      <span className="text-sm font-medium">Loading section...</span>
                    </div>
                  ))}
                </div>
              )}
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
