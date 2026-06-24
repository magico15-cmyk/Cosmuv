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
  
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '' });
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  const formatPrice = (priceVal: any) => {
    if (!priceVal) return "$0.00";
    const num = parseFloat(priceVal.toString().replace(/[^0-9.]/g, ''));
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  };

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
        setOrder({
          ...data,
          ref: `#${data.id.toString().substring(0, 8)}`,
          date: new Date(data.created_at).toLocaleString(),
          customer: data.customer_name,
          confStatus: data.status === 'pending' ? 'Open' : data.status,
          payStatus: 'Unpaid',
          shipStatus: 'Unfulfilled',
          total: data.total_amount
        });
      }
    } catch (error) {
      // Fallback for demo if the table is empty or missing
      setOrder({
        id: orderId,
        ref: "#" + orderId.substring(0, 8),
        date: "April 2, 2026 at 21:21",
        customer: "Test User",
        confStatus: "Open",
        payStatus: "Unpaid",
        shipStatus: "Unfulfilled",
        total: 139
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (field: string, value: string) => {
    setOrder({ ...order, [field]: value });
    
    if (field !== 'confStatus') return;
    
    try {
      const dbStatus = value === 'Open' ? 'pending' : value;
      const { error } = await supabase
        .from('orders')
        .update({ status: dbStatus })
        .eq('id', orderId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating order:', error);
      fetchOrder();
    }
  };

  const saveCustomer = async () => {
    setOrder({
      ...order,
      customer: customerForm.name,
      customer_phone: customerForm.phone,
      customer_address: customerForm.address
    });
    setIsEditingCustomer(false);
    
    try {
      await supabase.from('orders').update({
        customer_name: customerForm.name,
        customer_phone: customerForm.phone,
        customer_address: customerForm.address
      }).eq('id', orderId);
    } catch (e) {
      console.error(e);
    }
  };

  const saveOrderItems = () => {
    // In a real app, update the quantities in the DB and recalculate total
    setIsEditingOrder(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-6 text-center text-gray-500">Order not found</div>;
  }

  return (
    <div className="p-4 md:p-6 flex-1 min-w-0 flex flex-col min-h-[calc(100vh-80px)] pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit order {order.ref}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Details Top */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Order details</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => updateOrder('confStatus', 'Canceled by seller')} className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">Cancel order</button>
                <button onClick={() => alert('Customer IP blocked')} className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">Block customer IP</button>
                <button onClick={() => updateOrder('shipStatus', 'Fulfilled')} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Fulfill order</button>
                <button onClick={() => updateOrder('payStatus', 'Paid')} className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors shadow-sm">Mark order as paid</button>
              </div>
            </div>
            
            <div className="p-6 overflow-visible">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-gray-500">
                  <tr>
                    <th className="font-medium pb-4 pr-6">Order ref</th>
                    <th className="font-medium pb-4 pr-6">Ordered at</th>
                    <th className="font-medium pb-4 pr-6">Confirmation status</th>
                    <th className="font-medium pb-4 pr-6">Payment status</th>
                    <th className="font-medium pb-4">Shipping status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium text-blue-600 pr-6">{order.ref}</td>
                    <td className="text-gray-600 pr-6">{order.date}</td>
                    <td className="pr-6">
                      <StatusDropdown type="confirmation" value={order.confStatus} onChange={(v) => updateOrder('confStatus', v)} />
                    </td>
                    <td className="pr-6">
                      <StatusDropdown type="payment" value={order.payStatus} onChange={(v) => updateOrder('payStatus', v)} />
                    </td>
                    <td>
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
                  {order.items?.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                            {item.image ? (
                              <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-blue-600 hover:underline cursor-pointer">{item.product_name}</div>
                            <div className="text-xs text-gray-500">Package: {item.package}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatPrice(item.price)}</td>
                      <td className="px-6 py-4 text-gray-500">Not tracked</td>
                      <td className="px-6 py-4 text-gray-600">
                        {isEditingOrder ? (
                          <input type="number" min="1" defaultValue="1" className="w-16 border border-gray-200 rounded-md p-1 text-sm text-center focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all" />
                        ) : (
                          "1"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{formatPrice(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-gray-900" />
                Return stock on close ?
              </label>
              {isEditingOrder ? (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditingOrder(false)} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors focus:outline-none">
                    Cancel
                  </button>
                  <button onClick={saveOrderItems} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">
                    Save changes
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditingOrder(true)} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:outline-none">
                  Edit order
                </button>
              )}
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
                    <td className="px-6 py-4 text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-gray-500">- $0.00</td>
                    <td className="px-6 py-4 text-gray-500">- $0.00</td>
                    <td className="px-6 py-4 text-gray-500">$0.00</td>
                    <td className="px-6 py-4 text-gray-500">$0.00</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 text-base">{formatPrice(order.total)}</td>
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
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[100px] resize-y bg-gray-50 transition-all"
            ></textarea>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Customer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">Customer</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Customer information</span>
                {!isEditingCustomer && (
                  <button onClick={() => {
                    setCustomerForm({ name: order.customer || '', phone: order.customer_phone || '', address: order.customer_address || '' });
                    setIsEditingCustomer(true);
                  }} className="w-6 h-6 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none">
                    <PencilIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
              {isEditingCustomer ? (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <input type="text" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="Customer name" />
                  <input type="text" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="Phone number" />
                  <textarea value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 min-h-[80px] resize-y transition-all" placeholder="Shipping address"></textarea>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveCustomer} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex-1 focus:outline-none">Save details</button>
                    <button onClick={() => setIsEditingCustomer(false)} className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors flex-1 focus:outline-none">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-100 bg-gray-50/50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">{order.customer}</p>
                  <p>{order.customer_phone}</p>
                  <p>{order.customer_address}</p>
                </div>
              )}
            </div>
          </div>



          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">Payment info</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">Paid using: <span className="font-semibold text-gray-900">COD (Cash on Delivery)</span></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
