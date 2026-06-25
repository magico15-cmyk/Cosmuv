"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/admin/ToastProvider";

export default function FooterClient({ store }: { store: any }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newsletterTitle, setNewsletterTitle] = useState(store?.footer_newsletter_title || 'Subscribe to our emails');
  const [newsletterSubtitle, setNewsletterSubtitle] = useState(store?.footer_newsletter_subtitle || 'Join our email list for exclusive offers and the latest news.');
  const [showNewsletter, setShowNewsletter] = useState(store?.footer_show_newsletter !== false);
  const [logoText, setLogoText] = useState(store?.footer_logo_text || 'Yu.');
  const [logoUrl, setLogoUrl] = useState(store?.footer_logo_url || '');
  const [logoSize, setLogoSize] = useState(store?.footer_logo_size || 48);
  const [linksTitle, setLinksTitle] = useState(store?.footer_links_title || 'Products');

  const uploadImage = async (file: File): Promise<string | null> => {
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size too large. Please upload an image under 2MB.", "error");
      return null;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data.url;
    } catch (error: any) {
      console.error('Upload error:', error);
      showToast('Error uploading image: ' + error.message, 'error');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          footer_newsletter_title: newsletterTitle,
          footer_newsletter_subtitle: newsletterSubtitle,
          footer_show_newsletter: showNewsletter,
          footer_logo_text: logoText,
          footer_logo_url: logoUrl,
          footer_logo_size: logoSize,
          footer_links_title: linksTitle
        })
        .eq('id', store.id);

      if (error) throw error;
      
      router.refresh();
      showToast("Footer settings saved successfully!", "success");
    } catch (error: any) {
      console.error("Error saving footer settings:", error);
      showToast(error?.message || "Failed to save settings. Make sure you have run the database migration.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-[15px] font-bold text-gray-900">Newsletter Section</h3>
          </div>
          <div className="px-5 py-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showNewsletter"
                checked={showNewsletter}
                onChange={(e) => setShowNewsletter(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="showNewsletter" className="ml-2 text-[13px] font-medium text-gray-700 cursor-pointer">
                Show Newsletter Subscription Form
              </label>
            </div>
            
            {showNewsletter && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Title</label>
                  <input
                    type="text"
                    value={newsletterTitle}
                    onChange={(e) => setNewsletterTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                    placeholder="Subscribe to our emails"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Subtitle</label>
                  <input
                    type="text"
                    value={newsletterSubtitle}
                    onChange={(e) => setNewsletterSubtitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                    placeholder="Join our email list..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-[15px] font-bold text-gray-900">Footer Branding & Links</h3>
          </div>
          <div className="px-5 py-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo Image</label>
              {logoUrl ? (
                <div className="relative inline-block border border-gray-200 rounded-xl p-2 bg-gray-50">
                  <img src={logoUrl} alt="Footer Logo" className="h-16 object-contain" />
                  <button
                    onClick={() => setLogoUrl('')}
                    className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-full md:w-1/2 h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {uploadingImage ? 'Uploading...' : 'Click to upload logo'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = await uploadImage(e.target.files[0]);
                        if (url) setLogoUrl(url);
                      }
                    }}
                  />
                </label>
              )}
              <p className="text-[12px] text-gray-400 mt-2">If uploaded, the image will override the logo text below.</p>
            </div>
            
            {logoUrl && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Logo Size</label>
                  <span className="text-sm text-gray-500">{logoSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="150"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>
            )}
            
            <div className={logoUrl ? "opacity-50" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Logo Text</label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                disabled={!!logoUrl}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors disabled:bg-gray-100"
                placeholder="Yu."
              />
              <p className="text-[12px] text-gray-400 mt-1">Displays when no image logo is uploaded.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Links Title</label>
              <input
                type="text"
                value={linksTitle}
                onChange={(e) => setLinksTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors"
                placeholder="Products"
              />
              <p className="text-[12px] text-gray-400 mt-1">Heading above the footer menu links.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="fixed bottom-0 left-0 md:left-56 right-0 bg-white border-t border-gray-200 p-4 flex justify-end z-10">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
