"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/admin/ToastProvider";
import HeaderBuilder from "@/components/admin/HeaderBuilder";
import RichTextEditor from "@/components/admin/RichTextEditor";
import CustomSelect from "@/components/admin/CustomSelect";
import CustomColorPicker from "@/components/admin/CustomColorPicker";
import { Flame, Sparkles, Star, Zap } from 'lucide-react';

const DeliveryIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" height={size} viewBox="0 0 24 24" width={size} strokeWidth="1.5" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

type Tab = 'mobile_header' | 'desktop_header' | 'footer' | 'desktop_notice' | 'mobile_notice';

const allHeaderItems = ["menu", "logo", "search", "account", "cart"];

const iconOptions = [
  { value: "none", label: "None" },
  { value: "flame", label: "Flame (Pulse)", icon: <Flame size={16} className="text-gray-600" /> },
  { value: "sparkles", label: "Sparkles (Pop)", icon: <Sparkles size={16} className="text-gray-600" /> },
  { value: "star", label: "Star (Spin)", icon: <Star size={16} className="text-gray-600" /> },
  { value: "zap", label: "Zap (Flash)", icon: <Zap size={16} className="text-gray-600" /> },
  { value: "delivery", label: "Delivery (Ride)", icon: <DeliveryIcon size={16} className="text-gray-600" /> },
];

export default function FooterClient({ store }: { store: any }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('desktop_header');

  // --- FOOTER SETTINGS ---
  const [newsletterTitle, setNewsletterTitle] = useState(store?.footer_newsletter_title || 'Subscribe to our emails');
  const [newsletterSubtitle, setNewsletterSubtitle] = useState(store?.footer_newsletter_subtitle || 'Join our email list for exclusive offers and the latest news.');
  const [showNewsletter, setShowNewsletter] = useState(store?.footer_show_newsletter !== false);
  const [logoText, setLogoText] = useState(store?.footer_logo_text || 'Cosmuv.');
  const [logoUrl, setLogoUrl] = useState(store?.footer_logo_url || '');
  const [logoSize, setLogoSize] = useState(store?.footer_logo_size || 48);
  const [linksTitle, setLinksTitle] = useState(store?.footer_links_title || 'Products');
  
  // --- HEADER SETTINGS ---
  // --- HEADER DESKTOP ---
  const [desktopActiveItems, setDesktopActiveItems] = useState<string[]>(store?.header_desktop_layout || ["menu", "logo", "search", "account", "cart"]);
  const [desktopUnwantedItems, setDesktopUnwantedItems] = useState<string[]>(allHeaderItems.filter(i => !(store?.header_desktop_layout || ["menu", "logo", "search", "account", "cart"]).includes(i)));
  const [desktopHeaderBgColor, setDesktopHeaderBgColor] = useState(store?.header_desktop_bg_color || '#FFFFFF');
  const [desktopHeaderButtonColor, setDesktopHeaderButtonColor] = useState(store?.header_desktop_button_color || '#171717');
  const [desktopHeaderBorderEnabled, setDesktopHeaderBorderEnabled] = useState(store?.header_desktop_border_enabled ?? true);
  const [desktopHeaderBorderColor, setDesktopHeaderBorderColor] = useState(store?.header_desktop_border_color || '#F0F0F0');

  // --- HEADER MOBILE ---
  const [mobileActiveItems, setMobileActiveItems] = useState<string[]>(store?.header_mobile_layout || ["menu", "logo", "cart"]);
  const [mobileUnwantedItems, setMobileUnwantedItems] = useState<string[]>(allHeaderItems.filter(i => !(store?.header_mobile_layout || ["menu", "logo", "cart"]).includes(i)));
  const [mobileHeaderBgColor, setMobileHeaderBgColor] = useState(store?.header_bg_color || '#FFFFFF');
  const [mobileHeaderButtonColor, setMobileHeaderButtonColor] = useState(store?.header_button_color || '#171717');
  const [mobileHeaderBorderEnabled, setMobileHeaderBorderEnabled] = useState(store?.header_border_enabled ?? true);
  const [mobileHeaderBorderColor, setMobileHeaderBorderColor] = useState(store?.header_border_color || '#F0F0F0');

  // --- NOTICE BAR SETTINGS (DESKTOP) ---
  const [desktopNoticeEnabled, setDesktopNoticeEnabled] = useState(store?.notice_bar_desktop_enabled ?? false);
  const [desktopNoticeText, setDesktopNoticeText] = useState(store?.notice_bar_desktop_text || '');
  const [desktopNoticeIcon, setDesktopNoticeIcon] = useState(store?.notice_bar_desktop_icon || 'flame');
  const [desktopNoticeBgColor, setDesktopNoticeBgColor] = useState(store?.notice_bar_desktop_bg_color || '#000000');
  const [desktopNoticeTextColor, setDesktopNoticeTextColor] = useState(store?.notice_bar_desktop_text_color || '#FFFFFF');
  const [desktopNoticeAboveHeader, setDesktopNoticeAboveHeader] = useState(store?.notice_bar_desktop_above_header ?? true);

  // --- NOTICE BAR SETTINGS (MOBILE) ---
  const [mobileNoticeEnabled, setMobileNoticeEnabled] = useState(store?.notice_bar_mobile_enabled ?? false);
  const [mobileNoticeText, setMobileNoticeText] = useState(store?.notice_bar_mobile_text || '');
  const [mobileNoticeIcon, setMobileNoticeIcon] = useState(store?.notice_bar_mobile_icon || 'flame');
  const [mobileNoticeBgColor, setMobileNoticeBgColor] = useState(store?.notice_bar_mobile_bg_color || '#000000');
  const [mobileNoticeTextColor, setMobileNoticeTextColor] = useState(store?.notice_bar_mobile_text_color || '#FFFFFF');
  const [mobileNoticeAboveHeader, setMobileNoticeAboveHeader] = useState(store?.notice_bar_mobile_above_header ?? true);

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
          // Footer
          footer_newsletter_title: newsletterTitle,
          footer_newsletter_subtitle: newsletterSubtitle,
          footer_show_newsletter: showNewsletter,
          footer_logo_text: logoText,
          footer_logo_url: logoUrl,
          footer_logo_size: logoSize,
          footer_links_title: linksTitle,
          
          // Header Layout & Styling
          header_desktop_layout: desktopActiveItems,
          header_desktop_bg_color: desktopHeaderBgColor,
          header_desktop_button_color: desktopHeaderButtonColor,
          header_desktop_border_enabled: desktopHeaderBorderEnabled,
          header_desktop_border_color: desktopHeaderBorderColor,

          header_mobile_layout: mobileActiveItems,
          header_bg_color: mobileHeaderBgColor,
          header_button_color: mobileHeaderButtonColor,
          header_border_enabled: mobileHeaderBorderEnabled,
          header_border_color: mobileHeaderBorderColor,
          
          // Notice Bar Desktop
          notice_bar_desktop_enabled: desktopNoticeEnabled,
          notice_bar_desktop_text: desktopNoticeText,
          notice_bar_desktop_icon: desktopNoticeIcon,
          notice_bar_desktop_bg_color: desktopNoticeBgColor,
          notice_bar_desktop_text_color: desktopNoticeTextColor,
          notice_bar_desktop_above_header: desktopNoticeAboveHeader,
          
          // Notice Bar Mobile
          notice_bar_mobile_enabled: mobileNoticeEnabled,
          notice_bar_mobile_text: mobileNoticeText,
          notice_bar_mobile_icon: mobileNoticeIcon,
          notice_bar_mobile_bg_color: mobileNoticeBgColor,
          notice_bar_mobile_text_color: mobileNoticeTextColor,
          notice_bar_mobile_above_header: mobileNoticeAboveHeader,
        })
        .eq('id', store.id);

      if (error) throw error;
      
      router.refresh();
      showToast("Settings saved successfully!", "success");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      showToast(error?.message || "Failed to save settings. Make sure you have run the database migration.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabs = () => {
    const tabs: { id: Tab; label: string }[] = [
      { id: 'mobile_header', label: 'Mobile header' },
      { id: 'desktop_header', label: 'Desktop header' },
      { id: 'footer', label: 'Footer' },
      { id: 'desktop_notice', label: 'Desktop notice bar' },
      { id: 'mobile_notice', label: 'Mobile notice bar' },
    ];

    return (
      <div className="flex space-x-6 border-b border-gray-200 mb-8 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-[14px] font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full pb-20">
      
      {renderTabs()}

      {/* --- DESKTOP HEADER --- */}
      {activeTab === 'desktop_header' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <HeaderBuilder
            title="Desktop Header Layout"
            activeItems={desktopActiveItems}
            setActiveItems={setDesktopActiveItems}
            unwantedItems={desktopUnwantedItems}
            setUnwantedItems={setDesktopUnwantedItems}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Header background</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={desktopHeaderBgColor} onChange={setDesktopHeaderBgColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: desktopHeaderBgColor }} />} />
                <input type="text" value={desktopHeaderBgColor} onChange={(e) => setDesktopHeaderBgColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Header buttons color</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={desktopHeaderButtonColor} onChange={setDesktopHeaderButtonColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: desktopHeaderButtonColor }} />} />
                <input type="text" value={desktopHeaderButtonColor} onChange={(e) => setDesktopHeaderButtonColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Header border</label>
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                <span className="text-sm text-gray-600">Enable</span>
                <input type="checkbox" checked={desktopHeaderBorderEnabled} onChange={(e) => setDesktopHeaderBorderEnabled(e.target.checked)} className="w-4 h-4 text-brand-600 cursor-pointer" />
              </div>
            </div>
            {desktopHeaderBorderEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Header border color</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                  <CustomColorPicker color={desktopHeaderBorderColor} onChange={setDesktopHeaderBorderColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: desktopHeaderBorderColor }} />} />
                  <input type="text" value={desktopHeaderBorderColor} onChange={(e) => setDesktopHeaderBorderColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MOBILE HEADER --- */}
      {activeTab === 'mobile_header' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <HeaderBuilder
            title="Mobile Header Layout"
            activeItems={mobileActiveItems}
            setActiveItems={setMobileActiveItems}
            unwantedItems={mobileUnwantedItems}
            setUnwantedItems={setMobileUnwantedItems}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Header background</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={mobileHeaderBgColor} onChange={setMobileHeaderBgColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: mobileHeaderBgColor }} />} />
                <input type="text" value={mobileHeaderBgColor} onChange={(e) => setMobileHeaderBgColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Header buttons color</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={mobileHeaderButtonColor} onChange={setMobileHeaderButtonColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: mobileHeaderButtonColor }} />} />
                <input type="text" value={mobileHeaderButtonColor} onChange={(e) => setMobileHeaderButtonColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Header border</label>
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                <span className="text-sm text-gray-600">Enable</span>
                <input type="checkbox" checked={mobileHeaderBorderEnabled} onChange={(e) => setMobileHeaderBorderEnabled(e.target.checked)} className="w-4 h-4 text-brand-600 cursor-pointer" />
              </div>
            </div>
            {mobileHeaderBorderEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Header border color</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                  <CustomColorPicker color={mobileHeaderBorderColor} onChange={setMobileHeaderBorderColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: mobileHeaderBorderColor }} />} />
                  <input type="text" value={mobileHeaderBorderColor} onChange={(e) => setMobileHeaderBorderColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- DESKTOP NOTICE BAR --- */}
      {activeTab === 'desktop_notice' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
             <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="text-[15px] font-bold text-gray-900">Notice Text</h3>
             </div>
             <div className="p-5">
               <RichTextEditor
                 id="desktop-notice-editor"
                 value={desktopNoticeText}
                 onChange={setDesktopNoticeText}
                 align="left"
                 color={desktopNoticeTextColor}
               />
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text color</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={desktopNoticeTextColor} onChange={setDesktopNoticeTextColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: desktopNoticeTextColor }} />} />
                <input type="text" value={desktopNoticeTextColor} onChange={(e) => setDesktopNoticeTextColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background color</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={desktopNoticeBgColor} onChange={setDesktopNoticeBgColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: desktopNoticeBgColor }} />} />
                <input type="text" value={desktopNoticeBgColor} onChange={(e) => setDesktopNoticeBgColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Above the header</label>
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                <span className="text-sm text-gray-600">Enable</span>
                <input type="checkbox" checked={desktopNoticeAboveHeader} onChange={(e) => setDesktopNoticeAboveHeader(e.target.checked)} className="w-4 h-4 text-brand-600 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Show</label>
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 bg-white">
                <span className="text-sm text-gray-600">Enable</span>
                <input type="checkbox" checked={desktopNoticeEnabled} onChange={(e) => setDesktopNoticeEnabled(e.target.checked)} className="w-4 h-4 text-brand-600 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Animated Icon</label>
              <CustomSelect
                value={desktopNoticeIcon}
                onChange={setDesktopNoticeIcon}
                options={iconOptions}
                direction="up"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE NOTICE BAR --- */}
      {activeTab === 'mobile_notice' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
             <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="text-[15px] font-bold text-gray-900">Notice Text</h3>
             </div>
             <div className="p-5">
               <RichTextEditor
                 id="mobile-notice-editor"
                 value={mobileNoticeText}
                 onChange={setMobileNoticeText}
                 align="left"
                 color={mobileNoticeTextColor}
               />
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text color</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={mobileNoticeTextColor} onChange={setMobileNoticeTextColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: mobileNoticeTextColor }} />} />
                <input type="text" value={mobileNoticeTextColor} onChange={(e) => setMobileNoticeTextColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background color</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                <CustomColorPicker color={mobileNoticeBgColor} onChange={setMobileNoticeBgColor} trigger={<div className="w-6 h-6 rounded cursor-pointer mr-3 border border-gray-200" style={{ backgroundColor: mobileNoticeBgColor }} />} />
                <input type="text" value={mobileNoticeBgColor} onChange={(e) => setMobileNoticeBgColor(e.target.value)} className="w-20 text-sm text-gray-600 font-mono focus:outline-none bg-transparent uppercase" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Above the header</label>
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                <span className="text-sm text-gray-600">Enable</span>
                <input type="checkbox" checked={mobileNoticeAboveHeader} onChange={(e) => setMobileNoticeAboveHeader(e.target.checked)} className="w-4 h-4 text-brand-600 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Show</label>
              <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 bg-white">
                <span className="text-sm text-gray-600">Enable</span>
                <input type="checkbox" checked={mobileNoticeEnabled} onChange={(e) => setMobileNoticeEnabled(e.target.checked)} className="w-4 h-4 text-brand-600 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Animated Icon</label>
              <CustomSelect
                value={mobileNoticeIcon}
                onChange={setMobileNoticeIcon}
                options={iconOptions}
                direction="up"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      {activeTab === 'footer' && (
        <div className="space-y-6 animate-in fade-in duration-200">
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
                  className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 cursor-pointer"
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
                  placeholder="Cosmuv."
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
      )}

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
