"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useToast } from "@/components/admin/ToastProvider";

interface MenuItem {
  id?: string;
  label: string;
  url: string;
}

interface StoreMenu {
  id: string;
  name: string;
  slug: string;
  items: MenuItem[];
}

export default function MenusClient({ storeId, domain }: { storeId: string; domain: string }) {
  const { showToast } = useToast();
  const [menus, setMenus] = useState<StoreMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, [storeId]);

  const fetchMenus = async () => {
    try {
      const { data, error } = await supabase
        .from('store_menus')
        .select('*')
        .eq('store_id', storeId)
        .order('name', { ascending: true });

      if (error) throw error;
      
      const menusWithIds = (data || []).map((m: any) => ({
        ...m,
        items: m.items.map((item: any) => ({ 
          ...item, 
          id: item.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11))
        }))
      }));

      setMenus(menusWithIds);
      if (menusWithIds.length > 0 && !activeMenuId) {
        setActiveMenuId(menusWithIds[0].id);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      showToast('Failed to load menus', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (menuId: string) => {
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
        return { ...m, items: [...m.items, { id: newId, label: 'New Link', url: '/' }] };
      }
      return m;
    }));
  };

  const handleRemoveItem = (menuId: string, index: number) => {
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        const newItems = [...m.items];
        newItems.splice(index, 1);
        return { ...m, items: newItems };
      }
      return m;
    }));
  };

  const handleUpdateItem = (menuId: string, index: number, field: 'label' | 'url', value: string) => {
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        const newItems = [...m.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...m, items: newItems };
      }
      return m;
    }));
  };

  const moveItem = (menuId: string, index: number, direction: -1 | 1) => {
    setMenus(prev => prev.map(m => {
      if (m.id === menuId) {
        if (index + direction < 0 || index + direction >= m.items.length) return m;
        const newItems = [...m.items];
        const temp = newItems[index];
        newItems[index] = newItems[index + direction];
        newItems[index + direction] = temp;
        return { ...m, items: newItems };
      }
      return m;
    }));
  };

  const handleSave = async (menu: StoreMenu) => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('store_menus')
        .update({ items: menu.items })
        .eq('id', menu.id)
        .eq('store_id', storeId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Update was blocked by database permissions.');
      }
      showToast('Menu updated successfully', 'success');
    } catch (error) {
      console.error('Error updating menu:', error);
      showToast('Failed to update menu', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  const activeMenu = menus.find(m => m.id === activeMenuId);

  return (
    <div className="flex h-full min-h-[500px]">
      {/* Sidebar - Menu List */}
      <div className="w-1/4 border-r border-gray-200 bg-gray-50/50 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Menus</h3>
        <div className="space-y-2">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setActiveMenuId(menu.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeMenuId === menu.id 
                  ? 'bg-brand-50 text-brand-700 border border-brand-200' 
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent'
              }`}
            >
              {menu.name}
            </button>
          ))}
          {menus.length === 0 && (
            <p className="text-sm text-gray-500 italic">No menus found.</p>
          )}
        </div>
      </div>

      {/* Main Area - Menu Editor */}
      <div className="w-3/4 p-6 bg-white">
        {activeMenu ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">{activeMenu.name}</h3>
              <button 
                onClick={() => handleSave(activeMenu)}
                disabled={saving}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Menu'}
              </button>
            </div>

            <div className="space-y-4">
              {activeMenu.items.map((item, index) => (
                <div key={item.id || `menu-item-${index}`} className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col gap-1 text-gray-400">
                    <button 
                      onClick={() => moveItem(activeMenu.id, index, -1)} 
                      disabled={index === 0}
                      className="hover:text-gray-600 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveItem(activeMenu.id, index, 1)} 
                      disabled={index === activeMenu.items.length - 1}
                      className="hover:text-gray-600 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={item.label}
                        onChange={(e) => handleUpdateItem(activeMenu.id, index, 'label', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-300 sm:text-sm px-3 py-2 border"
                        placeholder="e.g. About Us"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
                      <input 
                        type="text" 
                        value={item.url}
                        onChange={(e) => handleUpdateItem(activeMenu.id, index, 'url', e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-300 sm:text-sm px-3 py-2 border"
                        placeholder="e.g. /pages/about"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemoveItem(activeMenu.id, index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {activeMenu.items.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                  No links in this menu. Add one below.
                </div>
              )}

              <button 
                onClick={() => handleAddItem(activeMenu.id)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-brand-600 hover:border-brand-400 hover:bg-brand-50 transition-colors"
              >
                <Plus size={18} />
                Add Menu Item
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            Select a menu from the left to edit its items.
          </div>
        )}
      </div>
    </div>
  );
}
