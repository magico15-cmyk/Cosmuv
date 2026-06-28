"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  PrinterIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import StatusDropdown from "@/components/admin/StatusDropdown";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ExportOrdersModal from "@/components/admin/ExportOrdersModal";

const initialMockOrders = [
  { id: 1, ref: "#382", date: "2026-04-02 21:21:17", customer: "Test", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
  { id: 2, ref: "#381", date: "2026-03-15 14:28:03", customer: "Said", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "278 MAD" },
  { id: 3, ref: "#380", date: "2026-03-14 18:08:30", customer: "رضوان", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
  { id: 4, ref: "#379", date: "2026-03-14 17:14:29", customer: "Wadie", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
  { id: 5, ref: "#378", date: "2026-03-14 01:55:08", customer: "Ismael", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "278 MAD" },
  { id: 6, ref: "#377", date: "2026-03-14 01:02:37", customer: "محمد", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
  { id: 7, ref: "#376", date: "2026-03-13 23:53:57", customer: "ادريس فكي", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
  { id: 8, ref: "#375", date: "2026-03-13 20:09:09", customer: "MEZIANE HAMMADI", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
  { id: 9, ref: "#374", date: "2026-03-13 15:16:40", customer: "Radouane", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
  { id: 10, ref: "#373", date: "2026-03-13 14:18:55", customer: "حميد زفيتي", confStatus: "Open", payStatus: "Unpaid", shipStatus: "Unfulfilled", total: "139 MAD" },
];

export default function OrdersClient({ storeId }: { storeId?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  // Add Order State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    total_amount: '',
  });

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (storeId) {
        query = query.eq('store_id', storeId);
      }
      
      const { data, error } = await query;
        
      if (error) throw error;
      if (data) {
        const formattedOrders = data.map((o: any, index: number) => {
          let orderCurrency = '$';
          if (o.items && o.items.length > 0 && o.items[0].price) {
            const extracted = String(o.items[0].price).replace(/[0-9.,\s]/g, '');
            if (extracted) orderCurrency = extracted;
          }
          let city = '';
          let address = o.customer_address || '';
          if (address.includes(', ')) {
            const parts = address.split(', ');
            city = parts.pop() || '';
            address = parts.join(', ');
          }

          const firstItem = Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : null;
          const bundle = firstItem?.package || 'N/A';

          return {
            id: o.id,
            ref: `#${(index + 1).toString().padStart(4, '0')}`,
            date: new Date(o.created_at || new Date()).toLocaleString(),
            customer: o.customer_name,
            customer_phone: o.customer_phone,
            customer_address: address || o.customer_address,
            city: city,
            bundle: bundle,
            total: `${parseFloat(o.total_amount).toFixed(2)} ${orderCurrency}`,
            confStatus: o.status === 'pending' ? 'Open' : o.status,
            payStatus: 'Unpaid',
            shipStatus: 'Unfulfilled',
          };
        });
        setOrders(formattedOrders.reverse());
      }
    } catch (error) {
      // Fallback to mock data if table doesn't exist yet for demo purposes
      setOrders(initialMockOrders);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: number, field: string, value: string) => {
    // Optimistic update
    setOrders(orders.map(o => o.id === id ? { ...o, [field]: value } : o));
    
    if (field !== 'confStatus') return; // We only support confStatus -> status for now
    
    try {
      const dbStatus = value === 'Open' ? 'pending' : value;
      const { error } = await supabase
        .from('orders')
        .update({ status: dbStatus })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating order:', error);
      // Revert on error (fetch fresh data)
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    return (
      order.ref?.toLowerCase().includes(lowerTerm) ||
      order.customer?.toLowerCase().includes(lowerTerm) ||
      order.total?.toString().toLowerCase().includes(lowerTerm)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          store_id: storeId,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          customer_address: newOrder.customer_address,
          total_amount: parseFloat(newOrder.total_amount) || 0,
          status: 'pending',
          items: [{
             product_id: "manual",
             product_name: "Manual Order",
             package: "Custom",
             price: `${newOrder.total_amount}`,
             image: ""
          }],
          ip_address: 'admin_manual'
        }]);
        
      if (error) throw error;
      
      setIsAddModalOpen(false);
      setNewOrder({ customer_name: '', customer_phone: '', customer_address: '', total_amount: '' });
      fetchOrders();
    } catch (err: any) {
      alert("Failed to add order: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
        {/* Filters Top Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for orders"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative min-h-[200px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          <table className="w-full text-sm text-left whitespace-nowrap min-w-[1200px]">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Ref</th>
                <th className="px-6 py-4 font-semibold">Creation date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Confirmation status</th>
                <th className="px-6 py-4 font-semibold">Payment status</th>
                <th className="px-6 py-4 font-semibold">Shipping status</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedOrders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-gray-900 hover:text-blue-600 transition-colors">
                      {order.ref}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4">
                    <StatusDropdown 
                      type="confirmation" 
                      value={order.confStatus} 
                      onChange={(val) => updateOrder(order.id, 'confStatus', val)} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <StatusDropdown 
                      type="payment" 
                      value={order.payStatus} 
                      onChange={(val) => updateOrder(order.id, 'payStatus', val)} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <StatusDropdown 
                      type="shipping" 
                      value={order.shipStatus} 
                      onChange={(val) => updateOrder(order.id, 'shipStatus', val)} 
                    />
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{order.total}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-100">
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-100">
                        <PrinterIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="flex justify-between items-center mt-6">
        {/* Pagination */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || totalPages === 0}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 bg-white hover:bg-gray-50 transition-colors shadow-sm mr-1"
          >
            <ChevronLeftIcon className="w-4 h-4" /> Previous
          </button>
          
          {/* Page Numbers */}
          <div className="flex items-center gap-1 hidden sm:flex">
            {totalPages === 0 ? (
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-gray-900 text-white shadow-sm">1</button>
            ) : (
              Array.from({ length: totalPages }).map((_, i) => {
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
              })
            )}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1 bg-white shadow-sm ml-1"
          >
            Next <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add an order
          </button>
        </div>
      </div>

      {/* Add Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add Manual Order</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddOrderSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
                <input 
                  type="text" 
                  required
                  value={newOrder.customer_name}
                  onChange={e => setNewOrder({...newOrder, customer_name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={newOrder.customer_phone}
                  onChange={e => setNewOrder({...newOrder, customer_phone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all text-sm"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                <input 
                  type="text" 
                  required
                  value={newOrder.customer_address}
                  onChange={e => setNewOrder({...newOrder, customer_address: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all text-sm"
                  placeholder="123 Main St, City"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Amount (Numeric)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={newOrder.total_amount}
                  onChange={e => setNewOrder({...newOrder, total_amount: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all text-sm"
                  placeholder="99.00"
                />
              </div>
            </form>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddOrderSubmit}
                disabled={isAdding}
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Orders Modal */}
      <ExportOrdersModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        orders={filteredOrders}
      />
    </div>
  );
}
