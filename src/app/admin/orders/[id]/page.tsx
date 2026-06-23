"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StatusDropdown from "@/components/admin/StatusDropdown";
import { ArrowLeftIcon, PrinterIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (error) throw error;
      if (data) {
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      // Fallback for demo if the table is empty or missing
      setOrder({
        id: orderId,
        ref: "#" + (383 - parseInt(orderId)),
        date: "April 2, 2026 at 21:21",
        customer: "Test User",
        confStatus: "Open",
        payStatus: "Unpaid",
        shipStatus: "Unfulfilled",
        total: "139 MAD"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (field: string, value: string) => {
    setOrder({ ...order, [field]: value });
    try {
      const { error } = await supabase
        .from('orders')
        .update({ [field]: value })
        .eq('id', orderId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating order:', error);
      fetchOrder();
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-6 text-center text-gray-500">Order not found</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit order {order.ref}</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <ArrowLeftIcon className="w-4 h-4" /> Previous {`#${parseInt(order.ref.replace('#','')) - 1}`}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Details Top */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Order details</h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">Cancel order</button>
                <button className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors">Block customer IP</button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Fulfill order</button>
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm">Mark order as paid</button>
              </div>
            </div>
            
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-gray-500 mb-4 block">
                  <tr className="flex gap-12">
                    <th className="font-medium pb-2 w-20">Order ref</th>
                    <th className="font-medium pb-2 w-40">Ordered at</th>
                    <th className="font-medium pb-2 w-40">Confirmation status</th>
                    <th className="font-medium pb-2 w-32">Payment status</th>
                    <th className="font-medium pb-2 w-32">Shipping status</th>
                  </tr>
                </thead>
                <tbody className="block">
                  <tr className="flex gap-12 items-center">
                    <td className="w-20 font-medium text-blue-600">{order.ref}</td>
                    <td className="w-40 text-gray-600">{order.date}</td>
                    <td className="w-40">
                      <StatusDropdown type="confirmation" value={order.confStatus} onChange={(v) => updateOrder('confStatus', v)} />
                    </td>
                    <td className="w-32">
                      <StatusDropdown type="payment" value={order.payStatus} onChange={(v) => updateOrder('payStatus', v)} />
                    </td>
                    <td className="w-32">
                      <StatusDropdown type="shipping" value={order.shipStatus} onChange={(v) => updateOrder('shipStatus', v)} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Order ref {order.ref}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Inventory</th>
                    <th className="px-6 py-4 font-medium">Quantity</th>
                    <th className="px-6 py-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                        {/* Placeholder image */}
                        <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
                      </div>
                      <div>
                        <div className="font-medium text-blue-600 hover:underline cursor-pointer">Restaurateur de plastique...</div>
                        <div className="text-xs text-gray-500">Default: Default</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">139.00 p.h</td>
                    <td className="px-6 py-4 text-gray-500">Not tracked</td>
                    <td className="px-6 py-4 text-gray-600">1</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">139.00 p.h</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-gray-900" />
                Return stock on close ?
              </label>
              <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                Edit order
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Subtotal</th>
                    <th className="px-6 py-4 font-medium">Coupon</th>
                    <th className="px-6 py-4 font-medium">Discount</th>
                    <th className="px-6 py-4 font-medium">Shipping fee</th>
                    <th className="px-6 py-4 font-medium">VAT (0.00%)</th>
                    <th className="px-6 py-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 text-gray-900">139.00 p.h</td>
                    <td className="px-6 py-4 text-gray-500">- 0.00 p.h</td>
                    <td className="px-6 py-4 text-gray-500">- 0.00 p.h</td>
                    <td className="px-6 py-4 text-gray-500">0.00 p.h</td>
                    <td className="px-6 py-4 text-gray-500">0.00 p.h</td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600">139.00 p.h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-3 text-sm">Note</h2>
            <textarea 
              placeholder="Add a note to this order" 
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 min-h-[100px] resize-y bg-gray-50"
            ></textarea>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Customer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">Customer</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Customer information</span>
                <button className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <PencilIcon className="w-3 h-3" />
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 text-sm text-gray-500 space-y-1">
                <p>Test</p>
                <p>0660025560</p>
                <p>Test</p>
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 text-sm">Custom fields</h2>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 text-sm">Shipping address</h2>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 text-sm">Billing address</h2>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">Tags</h2>
            </div>
            <div className="p-4">
              <input 
                type="text" 
                placeholder="Type in (comma separated)" 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">Payment info</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">Paid using: <span className="font-medium">cod</span></p>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <button className="flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
          <PrinterIcon className="w-5 h-5" /> Print order
        </button>
      </div>
    </div>
  );
}
