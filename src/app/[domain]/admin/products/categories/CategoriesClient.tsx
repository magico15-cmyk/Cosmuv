"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CategoriesClient({ storeId }: { storeId: string }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (storeId) {
      fetchCategories();
    }
  }, [storeId]);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("store_categories")
      .select("*")
      .eq("store_id", storeId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCategories(data);
    } else {
      console.error("Error fetching categories:", error);
    }
    setIsLoading(false);
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!editingCategory) {
      setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  };

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
    } else {
      setEditingCategory(null);
      setName("");
      setSlug("");
      setDescription("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return alert("Name and Slug are required.");

    setIsSaving(true);
    try {
      if (editingCategory) {
        // Update
        const { error } = await supabase
          .from("store_categories")
          .update({ name, slug, description })
          .eq("id", editingCategory.id);
        
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from("store_categories")
          .insert([{ store_id: storeId, name, slug, description }]);
        
        if (error) throw error;
      }
      
      await fetchCategories();
      handleCloseModal();
    } catch (error: any) {
      console.error("Error saving category:", error);
      alert(error.message || "Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const { error } = await supabase.from("store_categories").delete().eq("id", id);
      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== id));
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="w-full pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your products into meaningful groups.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <PlusIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No categories yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Create categories to help customers find what they're looking for easily.</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-brand-500 text-white px-5 py-2.5 rounded-xl hover:bg-brand-600 transition-colors font-medium"
            >
              Create your first category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 bg-gray-100 inline-flex px-2 py-1 rounded-md">/{category.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{category.description || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                  placeholder="e.g. Summer Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Slug</label>
                <div className="flex items-center">
                  <span className="px-4 py-2.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-r-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none text-sm"
                    placeholder="summer-collection"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">This will be used in the URL of the category page.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none resize-none"
                  placeholder="Brief description of this category..."
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
