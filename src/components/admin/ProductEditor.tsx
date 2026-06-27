"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeftIcon, 
  PhotoIcon, 
  PlusIcon, 
  TrashIcon,
  Bars3Icon,
  ListBulletIcon,
  Square3Stack3DIcon,
  ChatBubbleBottomCenterTextIcon,
  QueueListIcon,
  ViewColumnsIcon,
  ChartPieIcon,
  StarIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  SparklesIcon,
  CubeTransparentIcon,
  PresentationChartBarIcon,
  ArrowsRightLeftIcon,
  MegaphoneIcon,
  ShoppingCartIcon,
  CursorArrowRaysIcon
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import CustomSelect from "./CustomSelect";
import RichTextEditor from "./RichTextEditor";

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'gif' | 'heading' | 'features' | 'bundles' | 'testimonials' | 'accordion' | 'before_after' | 'stats' | 'rating' | 'trust_marquee' | 'comparison' | 'express_checkout' | 'checkout_button';
  content: any;
}

const blockIcons: Record<string, React.ReactNode> = {
  text: <PlusIcon className="w-4 h-4 text-gray-400" />,
  heading: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 19.5H16.5v-1.609a2.25 2.25 0 0 1 1.244-2.012l2.89-1.445c.651-.326 1.116-.955 1.116-1.683 0-.498-.04-.987-.118-1.463-.135-.825-.835-1.422-1.668-1.489a15.202 15.202 0 0 0-3.464.12M2.243 4.492v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501" /></svg>,
  image: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>,
  features: <ListBulletIcon className="w-4 h-4 text-gray-400" />,
  bundles: <Square3Stack3DIcon className="w-4 h-4 text-gray-400" />,
  testimonials: <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-gray-400" />,
  accordion: <QueueListIcon className="w-4 h-4 text-gray-400" />,
  before_after: <ViewColumnsIcon className="w-4 h-4 text-gray-400" />,
  stats: <ChartPieIcon className="w-4 h-4 text-gray-400" />,
  rating: <StarIcon className="w-4 h-4 text-gray-400" />,
  trust_marquee: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>,
  comparison: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" /></svg>,
  gif: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
  express_checkout: <ShoppingCartIcon className="w-4 h-4 text-gray-400" />,
  checkout_button: <CursorArrowRaysIcon className="w-4 h-4 text-gray-400" />
};

export default function ProductEditor({ initialData, storeId }: { initialData?: any; storeId?: string }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);
  const [dragEnabledId, setDragEnabledId] = useState<string | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  const [storeCategories, setStoreCategories] = useState<any[]>([]);

  useEffect(() => {
    if (storeId) {
      supabase
        .from('stores')
        .select('currency')
        .eq('id', storeId)
        .single()
        .then(({ data }) => {
          if (data?.currency) setCurrencySymbol(data.currency);
        });
        
      supabase
        .from('store_categories')
        .select('*')
        .eq('store_id', storeId)
        .then(({ data }) => {
          if (data) setStoreCategories(data);
        });
    }
  }, [storeId]);

  const [title, setTitle] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);

  // Auto-generate slug from title if it hasn't been manually edited
  useEffect(() => {
    if (!slugEdited) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, slugEdited]);
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [inventory, setInventory] = useState(initialData?.inventory || "Tracked");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "0");
  const [visibility, setVisibility] = useState(initialData?.visibility || "Visible");
  const [images, setImages] = useState<string[]>(() => {
    if (!initialData?.image) return [];
    try {
      const parsed = JSON.parse(initialData.image);
      return Array.isArray(parsed) ? parsed : [initialData.image];
    } catch {
      return [initialData.image];
    }
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);

  const deleteImage = async (url: string) => {
    if (!url || !url.includes('.r2.dev/')) return;
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch (e) {
      console.error('Failed to delete image', e);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_FILE_SIZE) {
        alert("Image size too large. Please upload an image under 2MB.");
        return null;
      }

      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }
      
      return data.url;
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Initialize blocks
  const defaultBlocks: ContentBlock[] = [
    {
      "id": "rating-1",
      "type": "rating",
      "content": {
        "score": "",
        "reviews": ""
      }
    },
    {
      "id": "features-1",
      "type": "features",
      "content": ["", "", ""]
    },
    {
      "id": "bundles-1",
      "type": "bundles",
      "content": [
        {
          "badge": "",
          "image": "",
          "price": "",
          "title": "Option 1",
          "originalPrice": ""
        },
        {
          "badge": "Best Sale",
          "image": "",
          "price": "",
          "title": "Option 2",
          "originalPrice": ""
        },
        {
          "badge": "Best value",
          "image": "",
          "price": "",
          "title": "Option 3",
          "originalPrice": ""
        }
      ]
    },
    {
      "id": "testimonials-1",
      "type": "testimonials",
      "content": [
        {
          "quote": "",
          "author": "",
          "avatar": ""
        },
        {
          "quote": "",
          "author": "",
          "avatar": ""
        },
        {
          "quote": "",
          "author": "",
          "avatar": ""
        }
      ]
    },
    {
      "id": "accordion-1",
      "type": "accordion",
      "content": [
        {
          "title": "Description",
          "content": ""
        },
        {
          "title": "How to Use",
          "content": ""
        },
        {
          "title": "Ingredients",
          "content": ""
        }
      ]
    },
    {
      "id": "before-after-1",
      "type": "before_after",
      "content": {
        "title": "Real Results",
        "subtitle": "See the difference our product makes.",
        "afterImage": "",
        "beforeImage": ""
      }
    },
    {
      "id": "marquee-1",
      "type": "trust_marquee",
      "content": [
        "30-DAY MONEY BACK GUARANTEE 😊",
        "800,000+ HAPPY CUSTOMERS 😊"
      ]
    },
    {
      "id": "stats-1",
      "type": "stats",
      "content": {
        "items": [
          {
            "label": "of participants",
            "percentage": "",
            "description": "noticed a positive difference."
          },
          {
            "label": "of users",
            "percentage": "",
            "description": "reported great results."
          },
          {
            "label": "said they ",
            "percentage": "",
            "description": "would recommend to a friend."
          }
        ],
        "title": "Backed by Real Results"
      }
    }
  ] as ContentBlock[];
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialData?.content_blocks && Array.isArray(initialData.content_blocks) && initialData.content_blocks.length > 0
      ? initialData.content_blocks 
      : defaultBlocks
  );

  const addBlock = (type: ContentBlock['type']) => {
    const defaultContent = 
      type === 'text' ? { text: '', align: 'left', color: '#4B5563' } :
      type === 'features' ? [''] : 
      type === 'bundles' ? [{ title: 'Single', badge: '', originalPrice: '', price: '', image: '' }] : 
      type === 'testimonials' ? [{ quote: '', author: '', avatar: '' }] :
      type === 'accordion' ? [
        { title: 'Description', content: '' },
        { title: 'How to Use', content: '' },
        { title: 'Ingredients', content: '' }
      ] :
      type === 'trust_marquee' ? ['30-DAY MONEY BACK GUARANTEE 😊', '800,000+ HAPPY CUSTOMERS 😊'] :
      type === 'before_after' ? { title: 'Real Results', subtitle: 'See the difference our product makes.', beforeImage: '', afterImage: '' } :
      type === 'stats' ? { title: 'Backed by Real Results', items: [{ percentage: '94', label: 'of participants', description: 'noticed a positive difference in their wellbeing within weeks.' }] } :
      type === 'comparison' ? { title: 'What Makes Us So Special?', highlightWord: 'Special', description: '', storeName: '', competitorName: 'Others', rows: [] } :
      type === 'rating' ? { score: '4.8', reviews: '8,300' } :
      type === 'express_checkout' ? { buttonText: 'COMPLETE ORDER', showGuarantee: true, guaranteeText: 'Free 30 Day Returns' } :
      type === 'checkout_button' ? { buttonText: 'ORDER NOW', showGuarantee: true, guaranteeText: 'Free 30 Day Returns' } :
      '';
    const newId = Math.random().toString(36).substr(2, 9);
    setBlocks([...blocks, { id: newId, type, content: defaultContent }]);
    setExpandedBlockId(newId);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const payload: any = {
        name: title,
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        price: parseFloat(price) || 0,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        inventory,
        stock: parseInt(stock) || 0,
        visibility,
        image: JSON.stringify(images),
        content_blocks: blocks,
      };

      if (storeId) {
        payload.store_id = storeId;
      }

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{ ...payload, orders: 0 }]);
        if (error) throw error;
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error("Error saving product:", err);
      alert("Failed to save product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button 
              onClick={() => window.open(`/product/${initialData.id}?preview=true`, '_blank')}
              className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
              title="Preview Product"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-xl transition-colors shadow-sm"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 mt-8 grid grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="col-span-2 space-y-6">
          
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Short Sleeve T-Shirt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-xl text-gray-500 text-sm">/product/</span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugEdited(true);
                    }}
                    placeholder="e.g. short-sleeve-t-shirt"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">Leave empty to automatically generate from title.</p>
              </div>
            </div>
          </div>

          {/* Block Builder Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Content</h2>
            
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div 
                  key={block.id} 
                  draggable={dragEnabledId === block.id}
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.setData('text/plain', index.toString());
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    
                    const newBlocks = [...blocks];
                    const draggedBlock = newBlocks[draggedIndex];
                    newBlocks.splice(draggedIndex, 1);
                    newBlocks.splice(index, 0, draggedBlock);
                    
                    setBlocks(newBlocks);
                    setDraggedIndex(null);
                    setDragEnabledId(null);
                  }}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragEnabledId(null);
                  }}
                  className={`relative group border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:border-gray-300 transition-colors ${draggedIndex === index ? 'opacity-50 border-dashed border-2 border-brand-500' : ''}`}
                >
                  
                  {/* Block Header */}
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer select-none"
                    onClick={() => setExpandedBlockId(expandedBlockId === block.id ? null : block.id)}
                    onMouseDown={() => setDragEnabledId(block.id)}
                    onMouseUp={() => setDragEnabledId(null)}
                    onMouseLeave={() => setDragEnabledId(null)}
                  >
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="cursor-move p-1 -ml-1 hover:bg-gray-200 rounded transition-colors" title="Drag to reorder">
                        <Bars3Icon className="w-5 h-5 text-gray-400 hover:text-brand-600 transition-colors" />
                      </div>
                      {expandedBlockId === block.id ? (
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      )}
                      {blockIcons[block.type] || <CubeTransparentIcon className="w-4 h-4 text-gray-400" />}
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {block.type === 'accordion' ? 'Description' : block.type === 'accordion_icons' ? 'Instructions' : block.type.replace('_', ' ')}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Block Content */}
                  {expandedBlockId === block.id && (
                    <div className="pt-2 border-t border-gray-100 mt-2">
                      {block.type === 'text' && (() => {
                        const content = typeof block.content === 'string' 
                          ? { text: block.content, align: 'left', color: '#4B5563' }
                          : block.content || { text: '', align: 'left', color: '#4B5563' };
                        
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                <button 
                                  onClick={() => updateBlock(block.id, { ...content, align: 'left' })}
                                  className={`px-3 py-1 text-xs font-medium rounded-md ${content.align === 'left' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                  Left
                                </button>
                                <button 
                                  onClick={() => updateBlock(block.id, { ...content, align: 'center' })}
                                  className={`px-3 py-1 text-xs font-medium rounded-md ${content.align === 'center' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                  Center
                                </button>
                                <button 
                                  onClick={() => updateBlock(block.id, { ...content, align: 'right' })}
                                  className={`px-3 py-1 text-xs font-medium rounded-md ${content.align === 'right' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                  Right
                                </button>
                              </div>
                            </div>
                            <RichTextEditor 
                              id={block.id}
                              value={content.text}
                              onChange={(val) => updateBlock(block.id, { ...content, text: val })}
                              align={content.align}
                              color="#4B5563"
                            />
                          </div>
                        );
                      })()}

                  {block.type === 'heading' && (() => {
                    const content = typeof block.content === 'string' 
                      ? { text: block.content, align: 'left', color: '#111827' }
                      : block.content || { text: '', align: 'left', color: '#111827' };
                    
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                            <button 
                              onClick={() => updateBlock(block.id, { ...content, align: 'left' })}
                              className={`px-3 py-1 text-xs font-medium rounded-md ${content.align === 'left' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              Left
                            </button>
                            <button 
                              onClick={() => updateBlock(block.id, { ...content, align: 'center' })}
                              className={`px-3 py-1 text-xs font-medium rounded-md ${content.align === 'center' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              Center
                            </button>
                            <button 
                              onClick={() => updateBlock(block.id, { ...content, align: 'right' })}
                              className={`px-3 py-1 text-xs font-medium rounded-md ${content.align === 'right' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                              Right
                            </button>
                          </div>
                        </div>
                        <RichTextEditor 
                          id={block.id}
                          value={content.text}
                          onChange={(val) => updateBlock(block.id, { ...content, text: val })}
                          align={content.align}
                          color="#111827"
                        />
                      </div>
                    );
                  })()}

                  {(block.type === 'image' || block.type === 'gif') && (
                    <div>
                      {block.content ? (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 inline-block max-w-[200px]">
                          <img src={block.content} alt="Block image" className="w-full h-auto object-cover max-h-[140px]" />
                          <button 
                            onClick={() => { if (block.content) deleteImage(block.content); updateBlock(block.id, ''); }}
                            className="absolute top-1 right-1 bg-white/90 p-1 rounded-md text-red-500 hover:bg-white shadow-sm"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                          <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <label className="cursor-pointer bg-brand-50 text-brand-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors inline-block">
                            <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingImage}
                              onChange={async (e) => {
                                if (!e.target.files || e.target.files.length === 0) return;
                                const url = await uploadImage(e.target.files[0]);
                                if (url) updateBlock(block.id, url);
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'features' && (
                    <div className="space-y-3">
                      {(Array.isArray(block.content) ? block.content : ['']).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckBadgeIcon className="w-6 h-6 text-pink-400 flex-shrink-0" />
                          <input 
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = Array.isArray(block.content) ? [...block.content] : [''];
                              newFeatures[i] = e.target.value;
                              updateBlock(block.id, newFeatures);
                            }}
                            placeholder="Enter a feature..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                          />
                          <button 
                            onClick={() => {
                              const newFeatures = (Array.isArray(block.content) ? block.content : ['']).filter((_, idx) => idx !== i);
                              updateBlock(block.id, newFeatures);
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newFeatures = Array.isArray(block.content) ? [...block.content, ''] : ['', ''];
                          updateBlock(block.id, newFeatures);
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add feature
                      </button>
                    </div>
                  )}

                  {block.type === 'trust_marquee' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 mb-2">Add items to scroll in the trust marquee.</p>
                      {(Array.isArray(block.content) ? block.content : []).map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <Bars3Icon className="w-6 h-6 text-pink-400 flex-shrink-0" />
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = Array.isArray(block.content) ? [...block.content] : [];
                              newItems[i] = e.target.value;
                              updateBlock(block.id, newItems);
                            }}
                            placeholder="Enter marquee item text (e.g. 30-DAY MONEY BACK GUARANTEE 😊)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                          />
                          <button 
                            onClick={() => {
                              const newItems = (Array.isArray(block.content) ? block.content : []).filter((_, idx) => idx !== i);
                              updateBlock(block.id, newItems);
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newItems = Array.isArray(block.content) ? [...block.content, ''] : [''];
                          updateBlock(block.id, newItems);
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add Marquee Item
                      </button>
                    </div>
                  )}

                  {block.type === 'bundles' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(Array.isArray(block.content) ? block.content : []).map((bundle: any, i: number) => (
                          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white relative shadow-sm">
                            <button 
                              onClick={() => {
                                const newBundles = [...block.content];
                                newBundles.splice(i, 1);
                                updateBlock(block.id, newBundles);
                              }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            <div className="space-y-3 mt-4">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                                <input 
                                  type="text"
                                  value={bundle.title || ''}
                                  onChange={(e) => {
                                    const newBundles = [...block.content];
                                    newBundles[i] = { ...bundle, title: e.target.value };
                                    updateBlock(block.id, newBundles);
                                  }}
                                  placeholder="e.g. Single"
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Badge (Optional)</label>
                                <input 
                                  type="text"
                                  value={bundle.badge || ''}
                                  onChange={(e) => {
                                    const newBundles = [...block.content];
                                    newBundles[i] = { ...bundle, badge: e.target.value };
                                    updateBlock(block.id, newBundles);
                                  }}
                                  placeholder="e.g. Most Popular"
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase">Original {currencySymbol}</label>
                                  <input 
                                    type="text"
                                    value={bundle.originalPrice || ''}
                                    onChange={(e) => {
                                      const newBundles = [...block.content];
                                      newBundles[i] = { ...bundle, originalPrice: e.target.value };
                                      updateBlock(block.id, newBundles);
                                    }}
                                    placeholder="50.00"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase">Price {currencySymbol}</label>
                                  <input 
                                    type="text"
                                    value={bundle.price || ''}
                                    onChange={(e) => {
                                      const newBundles = [...block.content];
                                      newBundles[i] = { ...bundle, price: e.target.value };
                                      updateBlock(block.id, newBundles);
                                    }}
                                    placeholder="45.00"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Image</label>
                                {bundle.image ? (
                                  <div className="relative rounded-lg overflow-hidden border border-gray-200 mt-1">
                                    <img src={bundle.image} alt="Bundle" className="w-full h-auto object-cover" />
                                    <button 
                                      onClick={() => {
                                        const newBundles = [...block.content];
                                        if (bundle.image) deleteImage(bundle.image);
                                        newBundles[i] = { ...bundle, image: '' };
                                        updateBlock(block.id, newBundles);
                                      }}
                                      className="absolute top-1 right-1 bg-white/90 p-1 rounded-md text-red-500 hover:bg-white shadow-sm"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer flex items-center justify-center w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors mt-1">
                                    <PhotoIcon className="w-4 h-4 mr-2" /> {uploadingImage ? 'Uploading...' : 'Upload'}
                                    <input 
                                      type="file" 
                                      accept="image/*"
                                      className="hidden"
                                      disabled={uploadingImage}
                                      onChange={async (e) => {
                                        if (!e.target.files || e.target.files.length === 0) return;
                                        const url = await uploadImage(e.target.files[0]);
                                        if (url) {
                                          const newBundles = [...block.content];
                                          newBundles[i] = { ...bundle, image: url };
                                          updateBlock(block.id, newBundles);
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const newBundles = Array.isArray(block.content) ? [...block.content] : [];
                          newBundles.push({ title: 'New Bundle', badge: '', originalPrice: '', price: '', image: '' });
                          updateBlock(block.id, newBundles);
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add bundle
                      </button>
                    </div>
                  )}

                  {block.type === 'testimonials' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {(Array.isArray(block.content) ? block.content : []).map((testimonial: any, i: number) => (
                          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white relative shadow-sm flex gap-4">
                            <button 
                              onClick={() => {
                                const newTestimonials = [...block.content];
                                newTestimonials.splice(i, 1);
                                updateBlock(block.id, newTestimonials);
                              }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            
                            {/* Avatar Upload */}
                            <div className="w-16 h-16 flex-shrink-0 mt-2">
                              {testimonial.avatar ? (
                                <div className="relative w-full h-full rounded-full overflow-hidden border border-gray-200">
                                  <img src={testimonial.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                  <button 
                                    onClick={() => {
                                      const newTestimonials = [...block.content];
                                      newTestimonials[i] = { ...testimonial, avatar: '' };
                                      updateBlock(block.id, newTestimonials);
                                    }}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="cursor-pointer w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                  <PhotoIcon className="w-5 h-5 text-gray-400" />
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingImage}
                                    onChange={async (e) => {
                                      if (!e.target.files || e.target.files.length === 0) return;
                                      const url = await uploadImage(e.target.files[0]);
                                      if (url) {
                                        const newTestimonials = [...block.content];
                                        newTestimonials[i] = { ...testimonial, avatar: url };
                                        updateBlock(block.id, newTestimonials);
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>

                            {/* Text Fields */}
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Quote</label>
                                <textarea 
                                  value={testimonial.quote || ''}
                                  onChange={(e) => {
                                    const newTestimonials = [...block.content];
                                    newTestimonials[i] = { ...testimonial, quote: e.target.value };
                                    updateBlock(block.id, newTestimonials);
                                  }}
                                  placeholder="I love the fact that these are organic..."
                                  rows={2}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-y"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Author</label>
                                <input 
                                  type="text"
                                  value={testimonial.author || ''}
                                  onChange={(e) => {
                                    const newTestimonials = [...block.content];
                                    newTestimonials[i] = { ...testimonial, author: e.target.value };
                                    updateBlock(block.id, newTestimonials);
                                  }}
                                  placeholder="Emily R. - Verified Buyer"
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                />
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const newTestimonials = Array.isArray(block.content) ? [...block.content] : [];
                          newTestimonials.push({ quote: '', author: '', avatar: '' });
                          updateBlock(block.id, newTestimonials);
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add testimonial
                      </button>
                    </div>
                  )}

                  {block.type === 'accordion' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {(Array.isArray(block.content) ? block.content : []).map((item: any, i: number) => (
                          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white relative shadow-sm">
                            <button 
                              onClick={() => {
                                const newAccordion = [...block.content];
                                newAccordion.splice(i, 1);
                                updateBlock(block.id, newAccordion);
                              }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            
                            <div className="space-y-3 mt-2 pr-8">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                                <input 
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => {
                                    const newAccordion = [...block.content];
                                    newAccordion[i] = { ...item, title: e.target.value };
                                    updateBlock(block.id, newAccordion);
                                  }}
                                  placeholder="e.g. Description or How to Use"
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Content</label>
                                <RichTextEditor 
                                  id={`${block.id}-${i}`}
                                  value={item.content || ''}
                                  onChange={(val) => {
                                    const newAccordion = [...block.content];
                                    newAccordion[i] = { ...item, content: val };
                                    updateBlock(block.id, newAccordion);
                                  }}
                                  align={item.align || 'left'}
                                  color="#4B5563"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const newAccordion = Array.isArray(block.content) ? [...block.content] : [];
                          newAccordion.push({ title: '', content: '' });
                          updateBlock(block.id, newAccordion);
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add row
                      </button>
                    </div>
                  )}

                  {block.type === 'accordion_icons' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {(Array.isArray(block.content) ? block.content : []).map((item: any, i: number) => (
                          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white relative shadow-sm">
                            <button 
                              onClick={() => {
                                const newAccordion = [...block.content];
                                newAccordion.splice(i, 1);
                                updateBlock(block.id, newAccordion);
                              }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            
                            <div className="space-y-3 mt-2 pr-8">
                              <div className="grid grid-cols-3 gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase">Icon</label>
                                  <select
                                    value={item.icon || 'star'}
                                    onChange={(e) => {
                                      const newAccordion = [...block.content];
                                      newAccordion[i] = { ...item, icon: e.target.value };
                                      updateBlock(block.id, newAccordion);
                                    }}
                                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none"
                                  >
                                    <option value="star">Star</option>
                                    <option value="chat-bubble">Chat Bubble</option>
                                    <option value="paper-airplane">Send / Plane</option>
                                    <option value="arrow-uturn-left">Return / Undo</option>
                                    <option value="heart">Heart</option>
                                    <option value="bolt">Lightning Bolt</option>
                                    <option value="leaf">Sun / Leaf</option>
                                    <option value="truck">Truck / Shipping</option>
                                    <option value="shield-check">Shield Check</option>
                                    <option value="check-circle">Check Circle</option>
                                    <option value="shopping-bag">Shopping Bag</option>
                                    <option value="sparkles">Sparkles</option>
                                    <option value="gift">Gift</option>
                                  </select>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                                  <input 
                                    type="text"
                                    value={item.title || ''}
                                    onChange={(e) => {
                                      const newAccordion = [...block.content];
                                      newAccordion[i] = { ...item, title: e.target.value };
                                      updateBlock(block.id, newAccordion);
                                    }}
                                    placeholder="e.g. How it works"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Content</label>
                                <RichTextEditor 
                                  id={`${block.id}-${i}`}
                                  value={item.content || ''}
                                  onChange={(val) => {
                                    const newAccordion = [...block.content];
                                    newAccordion[i] = { ...item, content: val };
                                    updateBlock(block.id, newAccordion);
                                  }}
                                  align={item.align || 'left'}
                                  color="#4B5563"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const newAccordion = Array.isArray(block.content) ? [...block.content] : [];
                          newAccordion.push({ icon: 'star', title: '', content: '' });
                          updateBlock(block.id, newAccordion);
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add row
                      </button>
                    </div>
                  )}

                  {block.type === 'comparison' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input 
                            type="text"
                            value={block.content?.title || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                            placeholder="What Makes Us So Special?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Word</label>
                          <input 
                            type="text"
                            value={block.content?.highlightWord || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, highlightWord: e.target.value })}
                            placeholder="Special"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                          value={block.content?.description || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, description: e.target.value })}
                          placeholder="We're dedicated to your comfort..."
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Store Name (Left Col)</label>
                          <input 
                            type="text"
                            value={block.content?.storeName || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, storeName: e.target.value })}
                            placeholder="Stepprs."
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Competitor Name (Right Col)</label>
                          <input 
                            type="text"
                            value={block.content?.competitorName || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, competitorName: e.target.value })}
                            placeholder="Others"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
                        <div className="space-y-2">
                          {(block.content?.rows || []).map((row: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                              <input 
                                type="text"
                                value={row.feature || ''}
                                onChange={(e) => {
                                  const newRows = [...block.content.rows];
                                  newRows[i] = { ...row, feature: e.target.value };
                                  updateBlock(block.id, { ...block.content, rows: newRows });
                                }}
                                placeholder="Feature Name"
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                              />
                              <label className="flex items-center gap-1 text-sm bg-white px-2 py-1.5 rounded border border-gray-200">
                                <input 
                                  type="checkbox"
                                  checked={row.store || false}
                                  onChange={(e) => {
                                    const newRows = [...block.content.rows];
                                    newRows[i] = { ...row, store: e.target.checked };
                                    updateBlock(block.id, { ...block.content, rows: newRows });
                                  }}
                                /> Store
                              </label>
                              <label className="flex items-center gap-1 text-sm bg-white px-2 py-1.5 rounded border border-gray-200">
                                <input 
                                  type="checkbox"
                                  checked={row.others || false}
                                  onChange={(e) => {
                                    const newRows = [...block.content.rows];
                                    newRows[i] = { ...row, others: e.target.checked };
                                    updateBlock(block.id, { ...block.content, rows: newRows });
                                  }}
                                /> Others
                              </label>
                              <button 
                                onClick={() => {
                                  const newRows = [...block.content.rows];
                                  newRows.splice(i, 1);
                                  updateBlock(block.id, { ...block.content, rows: newRows });
                                }}
                                className="p-2 text-gray-400 hover:text-red-500"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            const newRows = block.content?.rows ? [...block.content.rows] : [];
                            newRows.push({ feature: 'New Feature', store: true, others: false });
                            updateBlock(block.id, { ...block.content, rows: newRows });
                          }}
                          className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                        >
                          <PlusIcon className="w-4 h-4" /> Add row
                        </button>
                      </div>
                    </div>
                  )}

                  {block.type === 'before_after' && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                        </div>
                        <RichTextEditor 
                          id={`${block.id}-title`}
                          value={block.content?.title || ''}
                          onChange={(val) => updateBlock(block.id, { ...block.content, title: val })}
                          align={block.content?.titleAlign || 'center'}
                          color="#111827"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                        </div>
                        <RichTextEditor 
                          id={`${block.id}-subtitle`}
                          value={block.content?.subtitle || ''}
                          onChange={(val) => updateBlock(block.id, { ...block.content, subtitle: val })}
                          align={block.content?.subtitleAlign || 'center'}
                          color="#4B5563"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Before Image</label>
                          {block.content?.beforeImage ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200">
                              <img src={block.content.beforeImage} alt="Before" className="w-full h-32 object-cover" />
                              <button 
                                onClick={() => { if (block.content?.beforeImage) deleteImage(block.content.beforeImage); updateBlock(block.id, { ...block.content, beforeImage: '' }); }}
                                className="absolute top-2 right-2 bg-white p-1.5 rounded-lg text-red-500 hover:bg-gray-50 shadow-sm transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-32 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors">
                              <PhotoIcon className="w-6 h-6 text-gray-400 mb-2" />
                              <span className="text-xs font-medium text-gray-600 text-center px-2">{uploadingImage ? 'Uploading...' : 'Upload Before Image'}</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingImage}
                                onChange={async (e) => {
                                  if (!e.target.files || e.target.files.length === 0) return;
                                  const url = await uploadImage(e.target.files[0]);
                                  if (url) updateBlock(block.id, { ...block.content, beforeImage: url });
                                }}
                              />
                            </label>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">After Image</label>
                          {block.content?.afterImage ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200">
                              <img src={block.content.afterImage} alt="After" className="w-full h-32 object-cover" />
                              <button 
                                onClick={() => { if (block.content?.afterImage) deleteImage(block.content.afterImage); updateBlock(block.id, { ...block.content, afterImage: '' }); }}
                                className="absolute top-2 right-2 bg-white p-1.5 rounded-lg text-red-500 hover:bg-gray-50 shadow-sm transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-32 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors">
                              <PhotoIcon className="w-6 h-6 text-gray-400 mb-2" />
                              <span className="text-xs font-medium text-gray-600 text-center px-2">{uploadingImage ? 'Uploading...' : 'Upload After Image'}</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingImage}
                                onChange={async (e) => {
                                  if (!e.target.files || e.target.files.length === 0) return;
                                  const url = await uploadImage(e.target.files[0]);
                                  if (url) updateBlock(block.id, { ...block.content, afterImage: url });
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === 'stats' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                          type="text"
                          value={block.content?.title || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                          placeholder="e.g. Backed by Real Results"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        {(block.content?.items || []).map((item: any, i: number) => (
                          <div key={i} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white relative shadow-sm">
                            <button 
                              onClick={() => {
                                const newItems = [...block.content.items];
                                newItems.splice(i, 1);
                                updateBlock(block.id, { ...block.content, items: newItems });
                              }}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            <div className="w-24 shrink-0">
                              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Value</label>
                              <div className="relative">
                                <input 
                                  type="text"
                                  value={item.percentage || ''}
                                  onChange={(e) => {
                                    const newItems = [...block.content.items];
                                    newItems[i] = { ...item, percentage: e.target.value };
                                    updateBlock(block.id, { ...block.content, items: newItems });
                                  }}
                                  placeholder="94"
                                  className="w-full pl-3 pr-6 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                              </div>
                            </div>
                            <div className="flex-1 space-y-2 pr-6">
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Bold Text (Label)</label>
                                <input 
                                  type="text"
                                  value={item.label || ''}
                                  onChange={(e) => {
                                    const newItems = [...block.content.items];
                                    newItems[i] = { ...item, label: e.target.value };
                                    updateBlock(block.id, { ...block.content, items: newItems });
                                  }}
                                  placeholder="e.g. of participants"
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Description</label>
                                <textarea 
                                  value={item.description || ''}
                                  onChange={(e) => {
                                    const newItems = [...block.content.items];
                                    newItems[i] = { ...item, description: e.target.value };
                                    updateBlock(block.id, { ...block.content, items: newItems });
                                  }}
                                  placeholder="e.g. noticed a positive difference..."
                                  rows={2}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-y"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const newItems = Array.isArray(block.content?.items) ? [...block.content.items] : [];
                          newItems.push({ percentage: '', label: '', description: '' });
                          updateBlock(block.id, { ...block.content, items: newItems });
                        }}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add stat
                      </button>
                    </div>
                  )}

                  {block.type === 'rating' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rating Score</label>
                          <input 
                            type="text"
                            value={block.content?.score || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, score: e.target.value })}
                            placeholder="e.g. 4.8"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                          <input 
                            type="text"
                            value={block.content?.reviews || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, reviews: e.target.value })}
                            placeholder="e.g. 8,300"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === 'express_checkout' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                        <input 
                          type="text"
                          value={block.content?.buttonText || 'COMPLETE ORDER'}
                          onChange={(e) => updateBlock(block.id, { ...block.content, buttonText: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                        />
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id={`showGuarantee-${block.id}`}
                          checked={block.content?.showGuarantee ?? true}
                          onChange={(e) => updateBlock(block.id, { ...block.content, showGuarantee: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`showGuarantee-${block.id}`} className="ml-2 block text-sm text-gray-900">
                          Show Guarantee Text below button
                        </label>
                      </div>
                      {(block.content?.showGuarantee ?? true) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Guarantee Text</label>
                          <input 
                            type="text"
                            value={block.content?.guaranteeText || 'Free 30 Day Returns'}
                            onChange={(e) => updateBlock(block.id, { ...block.content, guaranteeText: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'checkout_button' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                        <input 
                          type="text"
                          value={block.content?.buttonText || 'ORDER NOW'}
                          onChange={(e) => updateBlock(block.id, { ...block.content, buttonText: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                        />
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="checkbox"
                          id={`showGuarantee-${block.id}`}
                          checked={block.content?.showGuarantee ?? true}
                          onChange={(e) => updateBlock(block.id, { ...block.content, showGuarantee: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`showGuarantee-${block.id}`} className="ml-2 block text-sm text-gray-900">
                          Show Guarantee Text below button
                        </label>
                      </div>
                      {(block.content?.showGuarantee ?? true) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Guarantee Text</label>
                          <input 
                            type="text"
                            value={block.content?.guaranteeText || 'Free 30 Day Returns'}
                            onChange={(e) => updateBlock(block.id, { ...block.content, guaranteeText: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  )}

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-xl focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 transition-colors bg-white">
                    <span className="text-gray-500 mr-2 whitespace-nowrap">{currencySymbol}</span>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price</label>
                  <div className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-xl focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 transition-colors bg-white">
                    <span className="text-gray-500 mr-2 whitespace-nowrap">{currencySymbol}</span>
                    <input 
                      type="number" 
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Status</label>
                  <CustomSelect
                    value={inventory}
                    onChange={setInventory}
                    options={[
                      { value: "Tracked", label: "Tracked" },
                      { value: "Untracked", label: "Untracked" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input 
                    type="number" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6 sticky top-24 self-start">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Product Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  draggable
                  onDragStart={(e) => {
                    setDraggedImageIndex(i);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedImageIndex === null || draggedImageIndex === i) return;
                    const newImages = [...images];
                    const [dragged] = newImages.splice(draggedImageIndex, 1);
                    newImages.splice(i, 0, dragged);
                    setImages(newImages);
                    setDraggedImageIndex(null);
                  }}
                  onDragEnd={() => setDraggedImageIndex(null)}
                  onTouchStart={(e) => {
                    setDraggedImageIndex(i);
                  }}
                  onTouchEnd={(e) => {
                    if (draggedImageIndex === null) return;
                    const touch = e.changedTouches[0];
                    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
                    const dropTarget = targetEl?.closest('[data-image-index]');
                    if (dropTarget) {
                      const targetIndex = parseInt(dropTarget.getAttribute('data-image-index') || '0');
                      if (targetIndex !== draggedImageIndex) {
                        const newImages = [...images];
                        const [dragged] = newImages.splice(draggedImageIndex, 1);
                        newImages.splice(targetIndex, 0, dragged);
                        setImages(newImages);
                      }
                    }
                    setDraggedImageIndex(null);
                  }}
                  data-image-index={i}
                  className={`relative rounded-xl overflow-hidden border cursor-grab active:cursor-grabbing transition-all ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'} ${draggedImageIndex === i ? 'opacity-40 border-dashed border-2 border-pink-400 scale-95' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover pointer-events-none" />
                  <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm cursor-grab">
                    <Bars3Icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); { deleteImage(images[i]); setImages(images.filter((_, idx) => idx !== i)); } }}
                    className="absolute top-2 right-2 bg-white p-1.5 rounded-lg text-red-500 hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide">Main Image</span>
                  )}
                </div>
              ))}
              {images.length < 4 && (
                <div className={`border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer relative ${images.length === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}>
                  <PhotoIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-[10px] font-medium text-gray-500 text-center px-2">{uploadingImage ? '...' : 'Add Image'}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      if (!e.target.files || e.target.files.length === 0) return;
                      const url = await uploadImage(e.target.files[0]);
                      if (url) setImages([...images, url]);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Add Block Menu */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Add Block</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => addBlock('text')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all"
              >
                <PlusIcon className="w-5 h-5" /> Text
              </button>
              <button 
                onClick={() => addBlock('heading')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 19.5H16.5v-1.609a2.25 2.25 0 0 1 1.244-2.012l2.89-1.445c.651-.326 1.116-.955 1.116-1.683 0-.498-.04-.987-.118-1.463-.135-.825-.835-1.422-1.668-1.489a15.202 15.202 0 0 0-3.464.12M2.243 4.492v7.5m0 0v7.502m0-7.501h10.5m0-7.5v7.5m0 0v7.501" />
                </svg> Heading
              </button>
                <button 
                  onClick={() => addBlock('image')}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg> Image
                </button>
              <button 
                onClick={() => addBlock('gif')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg> GIF
              </button>
              <button 
                onClick={() => addBlock('features')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all"
              >
                <ListBulletIcon className="w-5 h-5" /> Features
              </button>
              <button 
                onClick={() => addBlock('bundles')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all"
              >
                <Square3Stack3DIcon className="w-5 h-5" /> Bundles
              </button>
              <button 
                onClick={() => addBlock('testimonials')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" /> Testimonials
              </button>
              <button 
                onClick={() => addBlock('accordion')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <QueueListIcon className="w-5 h-5" /> Description
              </button>
              <button 
                onClick={() => addBlock('accordion_icons')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg> Instructions
              </button>
              <button 
                onClick={() => addBlock('before_after')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <ViewColumnsIcon className="w-5 h-5" /> Before & After
              </button>
              <button 
                onClick={() => addBlock('stats')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <ChartPieIcon className="w-5 h-5" /> Results / Stats
              </button>
              <button 
                onClick={() => addBlock('rating')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <StarIcon className="w-5 h-5" /> Rating
              </button>
              <button 
                onClick={() => addBlock('trust_marquee')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg> Trust Marquee
              </button>
              <button 
                onClick={() => addBlock('comparison')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" /></svg> Comparison
              </button>
              <button 
                onClick={() => addBlock('express_checkout')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-400 hover:shadow-md rounded-xl text-xs font-medium text-blue-800 hover:text-blue-900 transition-all text-center"
              >
                <ShoppingCartIcon className="w-5 h-5" /> Express Form
              </button>
              <button 
                onClick={() => addBlock('checkout_button')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 hover:shadow-md rounded-xl text-xs font-medium text-gray-700 hover:text-gray-900 transition-all text-center"
              >
                <CursorArrowRaysIcon className="w-5 h-5" /> Order Button
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Status</h2>
            <CustomSelect
              value={visibility}
              onChange={setVisibility}
              options={[
                { value: "Visible", label: "Active" },
                { value: "Hidden", label: "Draft" },
              ]}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">Product Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                {storeCategories.length > 0 ? (
                    <CustomSelect
                      value={category}
                      onChange={setCategory}
                      options={[
                        { value: "", label: "None" },
                        ...storeCategories.map(c => ({ value: c.name, label: c.name }))
                      ]}
                    />
                ) : (
                  <div>
                    <input 
                      type="text" 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Footwear"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">Create categories in the Categories page to use a dropdown here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
