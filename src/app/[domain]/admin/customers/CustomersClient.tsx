"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: any[];
}



// --- Filter Options ---
type FilterKey = "all" | "total_spent" | "order_count" | "status";
type SortDirection = "desc" | "asc";

const filterOptions: { value: FilterKey; label: string }[] = [
  { value: "all",         label: "All Customers" },
  { value: "total_spent", label: "Total Spent" },
  { value: "order_count", label: "Order Count" },
];

export default function CustomersClient({ storeId, currency }: { storeId?: string; currency: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<FilterKey>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchCustomers();
  }, [storeId]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (storeId) {
        query = query.eq("store_id", storeId);
      }

      const { data: orders, error } = await query;

      if (error) throw error;

      // Aggregate orders by customer phone (COD primary key)
      const customerMap = new Map<string, {
        name: string;
        email: string;
        phone: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string;
        orders: any[];
      }>();

      (orders || []).forEach((order: any) => {
        const phone = order.customer_phone || order.phone || "N/A";
        const existing = customerMap.get(phone);

        if (existing) {
          existing.totalOrders += 1;
          existing.totalSpent += parseFloat(order.total_amount || 0);
          if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = order.created_at;
            existing.name = order.customer_name || existing.name;
          }
          existing.orders.push(order);
        } else {
          customerMap.set(phone, {
            name: order.customer_name || "Unknown",
            email: order.customer_email || order.email || "",
            phone,
            totalOrders: 1,
            totalSpent: parseFloat(order.total_amount || 0),
            lastOrderDate: order.created_at || new Date().toISOString(),
            orders: [order],
          });
        }
      });

      const aggregatedCustomers: Customer[] = Array.from(customerMap.entries()).map(
        ([phone, data], index) => ({
          id: `cust-${index}`,
          name: data.name,
          email: data.email,
          phone,
          totalOrders: data.totalOrders,
          totalSpent: data.totalSpent,
          lastOrderDate: data.lastOrderDate,
          orders: data.orders,
        })
      );

      setCustomers(aggregatedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering & Sorting ---
  const filteredCustomers = useMemo(() => {
    let result = customers;

    // Search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.email.toLowerCase().includes(lower) ||
          c.phone.toLowerCase().includes(lower)
      );
    }

    // Sort by filter
    if (filterBy === "total_spent") {
      result = [...result].sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (filterBy === "order_count") {
      result = [...result].sort((a, b) => b.totalOrders - a.totalOrders);
    }

    return result;
  }, [customers, searchTerm, filterBy]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy]);

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({ name: customer.name, email: customer.email, phone: customer.phone });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    
    setIsSaving(true);
    try {
      const orderIds = editingCustomer.orders.map(o => o.id);
      const sampleOrder = editingCustomer.orders[0] || {};
      
      const updates: any = {};
      if (sampleOrder.customer_name !== undefined) updates.customer_name = editForm.name;
      if (sampleOrder.customer_email !== undefined) updates.customer_email = editForm.email;
      if (sampleOrder.customer_phone !== undefined) updates.customer_phone = editForm.phone;
      if (sampleOrder.name !== undefined) updates.name = editForm.name;
      if (sampleOrder.email !== undefined) updates.email = editForm.email;
      if (sampleOrder.phone !== undefined) updates.phone = editForm.phone;
      
      const { error } = await supabase
        .from("orders")
        .update(updates)
        .in("id", orderIds);
        
      if (error) throw error;
      
      setEditingCustomer(null);
      await fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Error updating customer");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete this customer?\nThis will permanently delete all ${customer.orders.length} associated order(s).`)) return;
    
    try {
      const orderIds = customer.orders.map(o => o.id);
      
      const { error } = await supabase
        .from("orders")
        .delete()
        .in("id", orderIds);
        
      if (error) throw error;
      
      await fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Error deleting customer");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your store&apos;s customer database and track their order history.
        </p>
      </div>



      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
        {/* Filters Top Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              {filterOptions.find((f) => f.value === filterBy)?.label || "Filter"}
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 animate-in fade-in duration-150">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilterBy(option.value);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      filterBy === option.value
                        ? "bg-gray-50 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative min-h-[200px] flex-1">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {!loading && paginatedCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <UserGroupIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">No customers yet</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {searchTerm
                  ? "No customers match your search. Try a different query."
                  : "When customers place orders, they'll appear here automatically."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[900px]">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold text-center">Orders</th>
                  <th className="px-6 py-4 font-semibold text-right">Total Spent</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCustomers.map((customer) => {
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Customer Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {getInitials(customer.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                            {customer.email && (
                              <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Phone */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <PhoneIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{customer.phone}</span>
                        </div>
                      </td>
                      {/* Total Orders */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium text-gray-900">{customer.totalOrders}</span>
                        <span className="text-gray-400 ml-1">{customer.totalOrders === 1 ? "order" : "orders"}</span>
                      </td>
                      {/* Total Spent */}
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200"
                            title="View details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-100"
                            title="Edit customer"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
                            title="Delete customer"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 bg-white hover:bg-gray-50 transition-colors shadow-sm mr-1"
            >
              <ChevronLeftIcon className="w-4 h-4" /> Previous
            </button>

            <div className="hidden sm:flex items-center gap-1">
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1 bg-white shadow-sm ml-1"
            >
              Next <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} of{" "}
            {filteredCustomers.length}
          </p>
        </div>
      )}

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedCustomer(null)}
          />
          {/* Panel */}
          <div className="relative w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(selectedCustomer.name)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                  <p className="text-xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(selectedCustomer.totalSpent)}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-2">
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                </div>
              </div>



              {/* Order History */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Order History</h3>
                <div className="space-y-2">
                  {selectedCustomer.orders.map((order: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{String(order.id).padStart(4, "0")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(parseFloat(order.total_amount || 0))}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {order.status || "pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {selectedCustomer.orders.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No orders found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSaving && setEditingCustomer(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Edit Customer</h2>
              <button
                onClick={() => !isSaving && setEditingCustomer(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSaving}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  disabled={isSaving}
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 text-white bg-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
