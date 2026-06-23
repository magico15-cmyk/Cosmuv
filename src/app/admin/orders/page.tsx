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

const STATUS_CONFIGS = {
  confirmation: {
    'Open': 'bg-gray-400',
    'Closed': 'bg-green-500',
    'Processed': 'bg-gray-400',
    'Canceled by seller': 'bg-red-500'
  },
  payment: {
    'Paid': 'bg-green-500',
    'Unpaid': 'bg-gray-400',
    'Captured': 'bg-gray-400',
    'Refunded': 'bg-green-500',
    'Pending': 'bg-amber-500'
  },
  shipping: {
    'Fulfilled': 'bg-amber-500',
    'Unfulfilled': 'bg-gray-400',
    'Canceled': 'bg-sky-400',
    'Shipped': 'bg-brand-700',
    'Processing': 'bg-red-600'
  }
};

function StatusDropdown({ 
  type, 
  value, 
  onChange 
}: { 
  type: 'confirmation'|'payment'|'shipping', 
  value: string, 
  onChange: (v: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = Object.keys(STATUS_CONFIGS[type]);
  const color = STATUS_CONFIGS[type][value as keyof typeof STATUS_CONFIGS[typeof type]] || 'bg-gray-400';

  return (
    <div className="relative inline-block text-left">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
          isOpen ? 'border-blue-500 text-gray-900 bg-white shadow-[0_0_0_1px_rgba(59,130,246,0.1)]' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        {value}
        <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500 ml-0.5" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 mt-1 w-40 rounded-md bg-white shadow-lg border border-gray-100 z-20 py-1">
            {options.map((option) => {
              const optColor = STATUS_CONFIGS[type][option as keyof typeof STATUS_CONFIGS[typeof type]];
              const isSelected = option === value;
              return (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 relative`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-blue-500 rounded-r-sm"></div>
                  )}
                  <div className={`w-2 h-2 rounded-full ${optColor} ${isSelected ? 'ml-1' : 'ml-1'}`}></div>
                  <span className={`${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

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

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      if (data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data if table doesn't exist yet for demo purposes
      setOrders(initialMockOrders);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: number, field: string, value: string) => {
    // Optimistic update
    setOrders(orders.map(o => o.id === id ? { ...o, [field]: value } : o));
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: value })
        .eq('id', id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating order:', error);
      // Revert on error (fetch fresh data)
      fetchOrders();
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
        {/* Filters Top Bar */}
        <div className="p-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for orders"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for products"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 relative">
            <select className="w-full pl-3 pr-8 py-2 appearance-none border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900">
              <option>Confirmation status</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="md:col-span-3 relative">
            <select className="w-full pl-3 pr-8 py-2 appearance-none border border-gray-200 rounded-lg text-sm text-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900">
              <option>Filter by status</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="md:col-span-1 flex justify-end">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full">
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
          <table className="w-full text-sm text-left">
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
              {orders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">{order.ref}</td>
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
                      <button className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-100">
                        <PencilIcon className="w-4 h-4" />
                      </button>
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
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400 font-medium cursor-not-allowed flex items-center gap-1">
              <ChevronLeftIcon className="w-4 h-4" /> Previous
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center gap-1">
              Next <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
          Mass operations
        </button>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
          Export
        </button>
        <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add an order
        </button>
      </div>
    </div>
  );
}
