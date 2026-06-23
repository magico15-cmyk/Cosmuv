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
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import CustomSelect from "./CustomSelect";

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'heading' | 'features' | 'bundles' | 'testimonials' | 'accordion' | 'before_after' | 'stats' | 'rating' | 'trust_marquee';
  content: any;
}

export default function ProductEditor({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.name || "");
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

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
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

  const addBlock = (type: 'text' | 'image' | 'heading' | 'features' | 'bundles' | 'testimonials' | 'accordion' | 'before_after' | 'stats' | 'rating' | 'trust_marquee') => {
    const defaultContent = 
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
      type === 'rating' ? { score: '4.8', reviews: '8,300' } :
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
      
      const payload = {
        name: title,
        price: parseFloat(price) || 0,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        inventory,
        stock: parseInt(stock) || 0,
        visibility,
        image: JSON.stringify(images),
        content_blocks: blocks,
      };

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
              onClick={() => window.open(`/product/${initialData.id}`, '_blank')}
              className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-transparent hover:border-teal-100"
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
            className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm shadow-teal-600/20 transition-all disabled:opacity-50"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
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
                  draggable
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
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={`relative group border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:border-gray-300 transition-colors ${draggedIndex === index ? 'opacity-50 border-dashed border-2 border-teal-500' : ''}`}
                >
                  
                  {/* Block Header */}
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer select-none"
                    onClick={() => setExpandedBlockId(expandedBlockId === block.id ? null : block.id)}
                  >
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="cursor-move p-1 -ml-1 hover:bg-gray-200 rounded transition-colors" title="Drag to reorder">
                        <Bars3Icon className="w-5 h-5 text-gray-400 hover:text-teal-600 transition-colors" />
                      </div>
                      {expandedBlockId === block.id ? (
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-xs font-semibold uppercase tracking-wider">{block.type}</span>
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
                      {block.type === 'text' && (
                    <textarea 
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Write your text here..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-y"
                    />
                  )}

                  {block.type === 'heading' && (
                    <input 
                      type="text"
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Heading text..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  )}

                  {block.type === 'image' && (
                    <div>
                      {block.content ? (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200">
                          <img src={block.content} alt="Block image" className="w-full h-auto object-cover" />
                          <button 
                            onClick={() => updateBlock(block.id, '')}
                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-md text-red-500 hover:bg-white shadow-sm"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                          <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                          <label className="cursor-pointer bg-teal-50 text-teal-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors inline-block">
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2"
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
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase">Original $</label>
                                  <input 
                                    type="text"
                                    value={bundle.originalPrice || ''}
                                    onChange={(e) => {
                                      const newBundles = [...block.content];
                                      newBundles[i] = { ...bundle, originalPrice: e.target.value };
                                      updateBlock(block.id, newBundles);
                                    }}
                                    placeholder="50.00"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase">Price $</label>
                                  <input 
                                    type="text"
                                    value={bundle.price || ''}
                                    onChange={(e) => {
                                      const newBundles = [...block.content];
                                      newBundles[i] = { ...bundle, price: e.target.value };
                                      updateBlock(block.id, newBundles);
                                    }}
                                    placeholder="45.00"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2"
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
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y"
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
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2"
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
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Content</label>
                                <textarea 
                                  value={item.content || ''}
                                  onChange={(e) => {
                                    const newAccordion = [...block.content];
                                    newAccordion[i] = { ...item, content: e.target.value };
                                    updateBlock(block.id, newAccordion);
                                  }}
                                  placeholder="Enter the accordion text here..."
                                  rows={3}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y"
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
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2"
                      >
                        <PlusIcon className="w-4 h-4" /> Add row
                      </button>
                    </div>
                  )}

                  {block.type === 'before_after' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                          type="text"
                          value={block.content?.title || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                          placeholder="e.g. Real Results"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                        <input 
                          type="text"
                          value={block.content?.subtitle || ''}
                          onChange={(e) => updateBlock(block.id, { ...block.content, subtitle: e.target.value })}
                          placeholder="e.g. See the difference our product makes."
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Before Image</label>
                          {block.content?.beforeImage ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200">
                              <img src={block.content.beforeImage} alt="Before" className="w-full h-32 object-cover" />
                              <button 
                                onClick={() => updateBlock(block.id, { ...block.content, beforeImage: '' })}
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
                                onClick={() => updateBlock(block.id, { ...block.content, afterImage: '' })}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                                  className="w-full pl-3 pr-6 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y"
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
                        className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-2"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                          <input 
                            type="text"
                            value={block.content?.reviews || ''}
                            onChange={(e) => updateBlock(block.id, { ...block.content, reviews: e.target.value })}
                            placeholder="e.g. 8,300"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                        </div>
                      </div>
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
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compare-at Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
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
                <div key={i} className={`relative rounded-xl overflow-hidden border border-gray-200 ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}>
                  <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
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
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all"
              >
                <PlusIcon className="w-5 h-5" /> Text
              </button>
              <button 
                onClick={() => addBlock('heading')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all"
              >
                <PlusIcon className="w-5 h-5" /> Heading
              </button>
              <button 
                onClick={() => addBlock('image')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all"
              >
                <PlusIcon className="w-5 h-5" /> Image
              </button>
              <button 
                onClick={() => addBlock('features')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all"
              >
                <ListBulletIcon className="w-5 h-5" /> Features
              </button>
              <button 
                onClick={() => addBlock('bundles')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all"
              >
                <Square3Stack3DIcon className="w-5 h-5" /> Bundles
              </button>
              <button 
                onClick={() => addBlock('testimonials')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all text-center"
              >
                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" /> Testimonials
              </button>
              <button 
                onClick={() => addBlock('accordion')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all text-center"
              >
                <QueueListIcon className="w-5 h-5" /> Accordion
              </button>
              <button 
                onClick={() => addBlock('before_after')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all text-center"
              >
                <ViewColumnsIcon className="w-5 h-5" /> Before & After
              </button>
              <button 
                onClick={() => addBlock('stats')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all text-center"
              >
                <ChartPieIcon className="w-5 h-5" /> Results / Stats
              </button>
              <button 
                onClick={() => addBlock('rating')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all text-center"
              >
                <StarIcon className="w-5 h-5" /> Rating
              </button>
              <button 
                onClick={() => addBlock('trust_marquee')}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl text-xs font-medium text-gray-700 hover:text-teal-700 transition-all text-center"
              >
                <Bars3Icon className="w-5 h-5" /> Trust Marquee
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
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Footwear"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
