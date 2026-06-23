"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '', title: '', brand: 'YU.', price: '', old_price: '', save: '', image: '', link: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    let q = supabase.from('products').select('*').order('created_at', { ascending: true });
    if (search) {
      q = q.or(`title.ilike.%${search}%,id.ilike.%${search}%`);
    }
    const { data } = await q;
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('products').update(formData).eq('id', editingId);
    } else {
      await supabase.from('products').insert([formData]);
    }
    closeModal();
    fetchProducts();
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ id: '', title: '', brand: 'YU.', price: '', old_price: '', save: '', image: '', link: '' });
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setFormData(product);
    setEditingId(product.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ id: '', title: '', brand: 'YU.', price: '', old_price: '', save: '', image: '', link: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Store Admin</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage your products and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-[13px] text-gray-500 hover:text-gray-900 font-medium mr-2">View Store</a>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>
      </header>

      {/* Table Card */}
      <div className="bg-white rounded-xl overflow-hidden max-w-6xl mx-auto border border-gray-100 shadow-sm">
        {/* Table Header with search */}
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative max-w-xs w-full">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap hidden sm:inline">
              {products.length} products
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[13px] text-gray-500 font-medium">Loading products...</div>
        ) : products.length === 0 && !search ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No products yet</h3>
            <p className="text-[13px] text-gray-500 mt-1.5 max-w-sm mb-6">
              Add your first product to display it on your store.
            </p>
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-gray-900 text-white font-semibold text-[13px] rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider w-16">Image</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Product Info</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Brand</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[13px]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 tracking-tight">{p.title}</span>
                        <span className="text-[11px] text-gray-400 font-mono mt-0.5">{p.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 font-medium">{p.brand}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#f899a2]">${p.price}</span>
                        {p.old_price && <span className="text-gray-400 line-through text-[11px]">${p.old_price}</span>}
                        {p.save && <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">-{p.save}%</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && search && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-[13px]">
                      No products matching this search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Fill in the product details below.</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Product ID *</label>
                  <input
                    required
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    disabled={!!editingId}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none disabled:opacity-50"
                    placeholder="e.g. turmeric-gummies"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Title *</label>
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none"
                    placeholder="e.g. Enhanced Bioactive Turmeric"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Brand *</label>
                  <input
                    required
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none"
                    placeholder="e.g. YU."
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Price *</label>
                  <input
                    required
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none"
                    placeholder="e.g. 25.00"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Old Price</label>
                  <input
                    name="old_price"
                    value={formData.old_price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none"
                    placeholder="e.g. 35.00"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Save %</label>
                  <input
                    name="save"
                    value={formData.save}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none"
                    placeholder="e.g. 28"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Image URL *</label>
                  <input
                    required
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none"
                    placeholder="e.g. /assets/bottle.png"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Product Link *</label>
                  <input
                    required
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 rounded-lg py-2.5 px-3.5 text-[13px] transition-all outline-none"
                    placeholder="e.g. /product/turmeric"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 text-gray-500 font-medium hover:bg-gray-50 rounded-lg transition-all text-[13px] border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all text-[13px]"
                >
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
