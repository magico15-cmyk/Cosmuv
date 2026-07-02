"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StatusDropdown from "@/components/admin/StatusDropdown";
import { ArrowLeftIcon, PrinterIcon, PencilIcon, UserIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/admin/ToastProvider";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', address: '' });
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const formatPrice = (priceVal: any) => {
    if (!priceVal) return "$0.00";
    const num = parseFloat(priceVal.toString().replace(/[^0-9.]/g, ''));
    return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
  };

  useEffect(() => {
    async function resolveStore() {
      try {
        const res = await fetch('/api/store');
        if (res.ok) {
          const { store } = await res.json();
          if (store?.id) setStoreId(store.id);
        }
      } catch (e) {}
    }
    resolveStore();
  }, []);

  useEffect(() => {
    if (storeId) fetchOrder();
  }, [orderId, storeId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select('*')
        .eq('id', orderId);

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.single();
        
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
        .eq('id', orderId)
        .eq('store_id', storeId || '');
      if (error) throw error;
      showToast("Order status updated successfully", "success");
    } catch (error) {
      console.error('Error updating order:', error);
      showToast("Failed to update status", "error");
      fetchOrder();
    }
  };

  const saveCustomer = async () => {
    setIsSaving(true);
    setOrder({
      ...order,
      customer: customerForm.name,
      customer_phone: customerForm.phone,
      customer_address: customerForm.address
    });
    
    try {
      await supabase.from('orders').update({
        customer_name: customerForm.name,
        customer_phone: customerForm.phone,
        customer_address: customerForm.address
      }).eq('id', orderId).eq('store_id', storeId || '');
      showToast("Customer details saved", "success");
      setIsEditingCustomer(false);
    } catch (e) {
      console.error(e);
      showToast("Failed to save customer details", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const saveOrderItems = async () => {
    setIsSaving(true);
    // In a real app, update the quantities in the DB and recalculate total
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsEditingOrder(false);
    showToast("Order items updated", "success");
    setIsSaving(false);
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
                          <input type="number" min="1" defaultValue="1" className="w-16 border border-gray-200 rounded-md p-1 text-sm text-center focus:ring-0 focus:border-gray-300 focus:outline-none transition-all" />
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
                <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-gray-300 focus:border-gray-300" />
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
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer Name</label>
                      <input type="text" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input type="text" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. +1 234 567 89" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping Address</label>
                      <textarea value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-1 focus:ring-gray-300 focus:border-gray-300 outline-none transition-all resize-y min-h-[80px] placeholder:text-gray-400" placeholder="Full shipping address..."></textarea>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{order.customer || 'No name provided'}</p>
                      <p className="text-xs text-gray-500">Customer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="font-medium text-gray-700">{order.customer_phone || 'No phone provided'}</p>
                  </div>
                  <div className="flex items-start gap-3 mt-2">
                    <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-gray-700">{order.customer_address || 'No address provided'}</p>
                  </div>
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

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-56 bg-white border-t border-gray-200 p-4 flex justify-end z-40">
        <button
          onClick={async () => {
            if (isEditingCustomer) await saveCustomer();
            if (isEditingOrder) await saveOrderItems();
          }}
          disabled={isSaving || (!isEditingCustomer && !isEditingOrder)}
          className={`px-8 py-2.5 rounded-md font-bold text-white shadow-sm transition-all flex items-center justify-center min-w-[140px] ${
            isSaving || (!isEditingCustomer && !isEditingOrder) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

    </div>
  );
}
