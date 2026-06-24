"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import type { Product } from "@/data/products";

interface ProductGridProps {
  onToggleFilter?: () => void;
}

export default function ProductGrid({ onToggleFilter }: ProductGridProps) {
  const getFirstImage = (imageStr: string) => {
    try {
      const parsed = JSON.parse(imageStr);
      return Array.isArray(parsed) ? parsed[0] : imageStr;
    } catch {
      return imageStr || '/assets/bottle.png';
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("createdAt", { ascending: false });
    
    if (!error && data) {
      // Format dates
      const formattedData = data.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt).toISOString().replace("T", " ").substring(0, 19)
      }));
      setProducts(formattedData);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setProductToDelete(null); // Close modal
    
    // Optimistic UI update
    setProducts(prev => prev.filter(p => p.id !== id));
    
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Failed to delete: " + error.message);
      fetchProducts(); // revert
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleting(false); // Close modal
    
    const idsToDelete = Array.from(selectedIds);
    
    // Optimistic UI update
    setProducts(prev => prev.filter(p => !idsToDelete.includes(p.id)));
    setSelectedIds(new Set()); // clear selection
    
    const { error } = await supabase.from("products").delete().in("id", idsToDelete);
    if (error) {
      alert("Failed to delete some products: " + error.message);
      fetchProducts(); // revert
    }
  };

  const handleDuplicate = async (product: Product) => {
    setLoading(true);
    try {
      // Remove id and createdAt so Supabase generates new ones
      const { id, createdAt, ...productData } = product;
      const newProduct = {
        ...productData,
        name: `${product.name} (Copy)`,
        orders: 0,
        visibility: "Hidden" // Keep duplicate as draft by default
      };

      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const formatted = {
          ...data,
          createdAt: new Date(data.createdAt).toISOString().replace("T", " ").substring(0, 19)
        };
        setProducts(prev => [formatted, ...prev]);
      }
    } catch (err: any) {
      alert("Failed to duplicate: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(selectedIds);
      paginatedProducts.forEach(p => next.delete(p.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedProducts.forEach(p => next.add(p.id));
      setSelectedIds(next);
    }
  };

  const toggleOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Products</h2>

      {/* White Card Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1">
        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-brand-400 focus-within:border-brand-400 focus-within:bg-white transition-all duration-200 w-72">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>
            
            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <button
                onClick={() => setIsBulkDeleting(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 hover:border-red-200"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Selected ({selectedIds.size})
              </button>
            )}
          </div>

          {/* Search Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Search filters
            <span className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
              <AdjustmentsHorizontalIcon className="w-3 h-3 text-white" />
            </span>
            <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Table / Loader */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-20 pl-5 pr-10 py-3.5">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="peer appearance-none w-full h-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 checked:bg-brand-500 checked:border-brand-500 cursor-pointer transition-all duration-200"
                    />
                    <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </th>
                <th className="text-left py-3.5 pr-4">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors">
                    <ChevronUpDownIcon className="w-3 h-3 text-gray-400" />
                    <span>Name</span>
                  </button>
                </th>
                <th className="text-center py-3.5 pr-4">
                  <button className="flex items-center justify-center gap-1 w-full text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors">
                    <ChevronUpDownIcon className="w-3 h-3 text-gray-400" />
                    <span>Price</span>
                  </button>
                </th>
                <th className="text-center py-3.5 pr-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Inventory
                  </span>
                </th>
                <th className="text-center py-3.5 pr-4">
                  <button className="flex items-center justify-center gap-1 w-full text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors">
                    <ChevronUpDownIcon className="w-3 h-3 text-gray-400" />
                    <span>Orders</span>
                  </button>
                </th>
                <th className="text-left py-3.5 pr-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Visibility
                  </span>
                </th>
                <th className="text-left py-3.5 pr-4">
                  <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors">
                    <ChevronUpDownIcon className="w-3 h-3 text-gray-400" />
                    <span>Creation date</span>
                  </button>
                </th>
                <th className="text-center py-3.5 pr-5">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-150 group"
                >
                  {/* Checkbox */}
                  <td className="pl-5 pr-10 py-3">
                    <div className="relative flex items-center justify-center w-4 h-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleOne(product.id)}
                        className="peer appearance-none w-full h-full border-2 border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 checked:bg-brand-500 checked:border-brand-500 cursor-pointer transition-all duration-200"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </td>

                  {/* Name + Image */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={getFirstImage(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <a
                        href="#"
                        className="text-sm font-semibold text-gray-800 hover:text-gray-900 hover:underline transition-colors leading-snug line-clamp-2 max-w-[180px]"
                      >
                        {product.name}
                      </a>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 pr-4 text-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {product.price.toFixed(0)}
                    </span>
                  </td>

                  {/* Inventory */}
                  <td className="py-3 pr-4 text-center">
                    <span
                      className={`text-sm ${
                        product.inventory === "Tracked"
                          ? "text-gray-700 font-medium"
                          : "text-brand-600"
                      }`}
                    >
                      {product.inventory}
                    </span>
                  </td>

                  {/* Orders */}
                  <td className="py-3 pr-4 text-center">
                    <span className="text-sm text-gray-700">
                      {product.orders}
                    </span>
                  </td>

                  {/* Visibility */}
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.visibility === "Visible"
                          ? "bg-emerald-50 text-emerald-600"
                          : product.visibility === "Hidden"
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.visibility}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 pr-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {product.createdAt}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-5">
                    <div className="flex items-center justify-center gap-1 transition-opacity duration-200">
                      <button
                        title="View"
                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setProductToDelete(product.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <button
                        title="Duplicate"
                        onClick={() => handleDuplicate(product)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 bg-white hover:bg-gray-50 transition-colors shadow-sm mr-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg> Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1 hidden sm:flex">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1 bg-white shadow-sm ml-1"
              >
                Next <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="flex justify-end mt-5">
        <button 
          onClick={() => router.push('/admin/products/new')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:from-brand-600 hover:to-brand-700 transition-all duration-200 active:scale-[0.98]"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add a product</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(productToDelete)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete {selectedIds.size} Products</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete {selectedIds.size} products? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsBulkDeleting(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
