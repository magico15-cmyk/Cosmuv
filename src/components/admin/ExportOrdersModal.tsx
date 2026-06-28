"use client";

import { useState, useRef, useEffect } from "react";
import { XMarkIcon, CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Field {
  id: string;
  label: string;
}

const ALL_AVAILABLE_FIELDS: Field[] = [
  { id: "date", label: "Creation date" },
  { id: "customer", label: "Customer Name" },
  { id: "phone", label: "Phone number" },
  { id: "address", label: "Address" },
  { id: "confStatus", label: "Confirmation status" },
  { id: "payStatus", label: "Payment status" },
  { id: "shipStatus", label: "Shipping status" },
  { id: "sku", label: "SKU" },
  { id: "totalQuantity", label: "Total quantity" },
  { id: "vendor", label: "Vendor" },
  { id: "trackingNumber", label: "Tracking number" },
  { id: "paymentGateway", label: "Payment gateway" },
  { id: "total", label: "Total charge" },
];

export default function ExportOrdersModal({ 
  isOpen, 
  onClose, 
  orders 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  orders: any[];
}) {
  const [selectedFields, setSelectedFields] = useState<Field[]>([
    { id: "ref", label: "Order ID" }
  ]);
  const [availableFields, setAvailableFields] = useState<Field[]>(ALL_AVAILABLE_FIELDS);

  const STATUS_OPTIONS = ['All', 'Paid', 'Unpaid', 'Fulfilled', 'Unfulfilled', 'Pending'];
  const [status, setStatus] = useState('All');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const prevMonthDays = getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendarDays = () => {
    const days = [];
    // Previous month filler days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(<div key={`prev-${i}`} className="text-gray-300">{prevMonthDays - i}</div>);
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = selectedDate && 
                         selectedDate.getDate() === i && 
                         selectedDate.getMonth() === currentMonth.getMonth() && 
                         selectedDate.getFullYear() === currentMonth.getFullYear();
      days.push(
        <div 
          key={`current-${i}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
            setIsDateOpen(false);
          }}
          className={`cursor-pointer rounded-full w-7 h-7 flex items-center justify-center mx-auto transition-colors ${isSelected ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
        >
          {i}
        </div>
      );
    }
    // Next month filler days
    const totalCurrentDays = firstDay + daysInMonth;
    const remainingDays = 42 - totalCurrentDays;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(<div key={`next-${i}`} className="text-gray-300">{i}</div>);
    }
    return days;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleDragStart = (e: React.DragEvent, field: Field, sourceList: "selected" | "available") => {
    e.dataTransfer.setData("fieldId", field.id);
    e.dataTransfer.setData("sourceList", sourceList);
  };

  const handleDrop = (e: React.DragEvent, targetList: "selected" | "available") => {
    e.preventDefault();
    const fieldId = e.dataTransfer.getData("fieldId");
    const sourceList = e.dataTransfer.getData("sourceList");

    if (sourceList === targetList) return;

    if (sourceList === "available" && targetList === "selected") {
      const field = availableFields.find(f => f.id === fieldId);
      if (field) {
        setAvailableFields(prev => prev.filter(f => f.id !== fieldId));
        setSelectedFields(prev => [...prev, field]);
      }
    } else if (sourceList === "selected" && targetList === "available") {
      const field = selectedFields.find(f => f.id === fieldId);
      if (field) {
        setSelectedFields(prev => prev.filter(f => f.id !== fieldId));
        setAvailableFields(prev => [field, ...prev]); // Add to top for visibility
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Allow click to move as a fallback/accessibility
  const moveField = (fieldId: string, sourceList: "selected" | "available") => {
    if (sourceList === "available") {
      const field = availableFields.find(f => f.id === fieldId);
      if (field) {
        setAvailableFields(prev => prev.filter(f => f.id !== fieldId));
        setSelectedFields(prev => [...prev, field]);
      }
    } else {
      const field = selectedFields.find(f => f.id === fieldId);
      if (field) {
        setSelectedFields(prev => prev.filter(f => f.id !== fieldId));
        setAvailableFields(prev => [field, ...prev]);
      }
    }
  };

  const handleExport = () => {
    let ordersToExport = orders;
    if (status !== 'All') {
      ordersToExport = orders.filter(o => {
        if (status === 'Paid') return o.payStatus === 'Paid';
        if (status === 'Unpaid') return o.payStatus === 'Unpaid';
        if (status === 'Fulfilled') return o.shipStatus === 'Fulfilled';
        if (status === 'Unfulfilled') return o.shipStatus === 'Unfulfilled';
        if (status === 'Pending') return o.confStatus === 'Open' || o.confStatus === 'Pending';
        return true;
      });
    }

    if (selectedDate) {
      ordersToExport = ordersToExport.filter(o => {
        if (!o.date) return false;
        const orderDate = new Date(o.date);
        return orderDate.getFullYear() === selectedDate.getFullYear() &&
               orderDate.getMonth() === selectedDate.getMonth() &&
               orderDate.getDate() === selectedDate.getDate();
      });
    }

    if (!ordersToExport.length) {
      alert("No orders match the selected filters.");
      return;
    }
    
    const headers = selectedFields.map(f => f.label);
    const csvContent = [
      headers.join(','),
      ...ordersToExport.map(order => {
        return selectedFields.map(f => {
          switch(f.id) {
            case 'ref': return `"${order.ref || ''}"`;
            case 'date': return `"${order.date || ''}"`;
            case 'customer': return `"${order.customer || ''}"`;
            case 'phone': return `"${order.customer_phone || ''}"`;
            case 'address': return `"${order.customer_address || ''}"`;
            case 'confStatus': return `"${order.confStatus || ''}"`;
            case 'payStatus': return `"${order.payStatus || ''}"`;
            case 'shipStatus': return `"${order.shipStatus || ''}"`;
            case 'total': return `"${order.total || ''}"`;
            case 'sku': return `""`; 
            case 'totalQuantity': return `"1"`; 
            case 'vendor': return `""`;
            case 'trackingNumber': return `""`;
            case 'paymentGateway': return `"Cash on Delivery"`; 
            default: return `""`;
          }
        }).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Export orders</h2>
          <button 
            onClick={onClose}
            className="text-gray-900 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Top Filters Row */}
        <div className="p-6 grid grid-cols-2 gap-6 pb-0">
          <div ref={statusRef} className="relative">
            <label className="block text-sm text-gray-600 mb-2">Orders status</label>
            <div 
              className={`w-full pl-4 pr-10 py-2.5 bg-white border ${isStatusOpen ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'} rounded-lg text-sm cursor-pointer flex justify-between items-center`}
              onClick={() => setIsStatusOpen(!isStatusOpen)}
            >
              <span>{status}</span>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            {isStatusOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-900 rounded-md shadow-lg overflow-hidden py-1">
                {STATUS_OPTIONS.map((opt) => (
                  <div 
                    key={opt}
                    className={`px-4 py-2 text-sm cursor-pointer ${status === opt ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-100'}`}
                    onClick={() => { setStatus(opt); setIsStatusOpen(false); }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div ref={dateRef} className="relative">
            <label className="block text-sm text-gray-600 mb-2">Filter by date</label>
            <div 
              className={`w-full pl-10 pr-4 py-2.5 bg-white border ${isDateOpen ? 'border-gray-300' : 'border-gray-200'} rounded-lg text-sm cursor-pointer flex items-center justify-between`}
              onClick={() => setIsDateOpen(!isDateOpen)}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
              <span className={`truncate ${selectedDate ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Filter by date"}
              </span>
              {selectedDate && (
                <XMarkIcon 
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors ml-2" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(null);
                  }}
                />
              )}
            </div>
            
            {isDateOpen && (
              <div className="absolute z-20 top-[calc(100%+4px)] left-0 bg-white border border-gray-200 rounded-xl shadow-xl w-72 p-0 overflow-hidden">
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Custom</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#64748b] mb-2">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm gap-y-2">
                    {renderCalendarDays()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div className="p-6 grid grid-cols-2 gap-8 flex-1 overflow-hidden min-h-[400px]">
          
          {/* Selected Fields */}
          <div className="flex flex-col h-full border border-gray-100 rounded-lg overflow-hidden bg-gray-50/30">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <span className="font-semibold text-gray-900 text-sm">Selected fields</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
            </div>
            <div 
              className="p-4 flex-1 overflow-y-auto space-y-3"
              onDrop={(e) => handleDrop(e, "selected")}
              onDragOver={handleDragOver}
            >
              {selectedFields.map(field => (
                <div 
                  key={field.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, field, "selected")}
                  onClick={() => moveField(field.id, "selected")}
                  className="bg-gray-100 border border-gray-200 text-gray-900 px-4 py-3 rounded-md text-sm font-medium cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow flex justify-between items-center"
                >
                  {field.label}
                </div>
              ))}
              {selectedFields.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                  Drag fields here
                </div>
              )}
            </div>
          </div>

          {/* Drag indication icon in the middle */}
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 pointer-events-none">
             <div className="bg-white p-1 rounded-full shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
             </div>
             <div className="bg-white p-1 rounded-full shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
             </div>
          </div>

          {/* Available Fields */}
          <div className="flex flex-col h-full border border-gray-100 rounded-lg overflow-hidden bg-gray-50/30">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <span className="font-semibold text-gray-900 text-sm">Available fields</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
            </div>
            <div 
              className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar"
              onDrop={(e) => handleDrop(e, "available")}
              onDragOver={handleDragOver}
            >
              {availableFields.map(field => (
                <div 
                  key={field.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, field, "available")}
                  onClick={() => moveField(field.id, "available")}
                  className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-md text-sm font-medium cursor-grab active:cursor-grabbing hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  {field.label}
                </div>
              ))}
              {availableFields.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                  No fields left
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleExport}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Export
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #111827; /* gray-900 */
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
