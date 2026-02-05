'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Added Router import
import { Search, Package, AlertTriangle, Store, ShoppingBag, Clock, CheckCircle, ArrowLeft } from 'lucide-react'; // 2. Added ArrowLeft

export default function ShopProductsPage() {
  const router = useRouter(); // 3. Initialize Router
  const [activeStatus, setActiveStatus] = useState('baked');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Define Data (Unchanged)
  const productsData = [
    // BAKED
    { id: 1, name: 'Bread Flour', quantity: '50', unit: 'piece', addedBy: 'baker', status: 'baked', action: 'available' },
    { id: 2, name: 'Sugar', quantity: '20', unit: 'kg', addedBy: 'store keeper', status: 'baked', action: 'available' },
    // ORDERS
    { id: 3, name: 'Wedding Cake', quantity: '1', unit: 'piece', addedBy: 'Shop Manager', status: 'orders', action: 'pending' },
    // RECEIVED
    { id: 4, name: 'Donuts', quantity: '100', unit: 'piece', addedBy: 'Head Baker', status: 'received', action: 'stocked' },
    // REST PRODUCT (STOCK)
    { id: 5, name: 'Milk', quantity: '2', unit: 'bottles', addedBy: 'Shop Manager', status: 'rest_product', action: 'low stock' },
    // DAMAGED
    { id: 6, name: 'Burnt Toast', quantity: '5', unit: 'piece', addedBy: 'Shop Manager', status: 'damaged', action: 'discarded' },
  ];

  // 2. Define Tabs (Unchanged)
  const tabs = [
    { label: 'Baked Items', value: 'baked', icon: <ShoppingBag size={18} /> },
    { label: 'Orders', value: 'orders', icon: <Clock size={18} /> }, 
    { label: 'Received', value: 'received', icon: <CheckCircle size={18} /> }, 
    { label: 'Rest Product', value: 'rest_product', icon: <Store size={18} /> }, 
    { label: 'Damaged', value: 'damaged', icon: <AlertTriangle size={18} /> },
    { label: 'All Items', value: 'all', icon: <Package size={18} /> },
  ];

  // 3. Filter Logic (Unchanged)
  const filteredData = productsData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeStatus === 'all' || item.status === activeStatus;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 relative">
      
      {/* --- MOBILE LOGO (VISIBLE ONLY ON PHONE) --- */}
      <div className="md:hidden flex items-center justify-center mb-6">
         <img 
           src="/logo.png" 
           alt="Shop Logo" 
           className="h-16 w-auto object-contain" 
         />
      </div>

      {/* --- HEADER (UPDATED WITH BACK ARROW) --- */}
      <div className="flex items-start gap-4">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mt-1 p-2 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-[#5D4037] tracking-tight">Products Management</h1>
          <p className="text-[#A67C37] mt-2 text-sm font-medium">Manage your products inventory by category</p>
        </div>
      </div>

      {/* --- TABS (SCROLLABLE ON MOBILE) --- */}
      <div className="bg-white border border-[#EBE0CC] p-2 rounded-2xl flex items-center gap-2 w-full overflow-x-auto shadow-sm no-scrollbar">
        {tabs.map((tab) => {
           const isActive = activeStatus === tab.value;
           return (
             <button 
               key={tab.value}
               onClick={() => setActiveStatus(tab.value)}
               className={`flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize flex items-center gap-2 ${
                 isActive 
                 ? 'bg-[#5D4037] text-white shadow-md shadow-[#5D4037]/20 transform scale-[1.02]' 
                 : 'text-gray-400 hover:text-[#5D4037] hover:bg-[#EBE0CC]/30'
               }`}
             >
               {tab.icon}
               {tab.label}
             </button>
           );
        })}
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 min-h-[500px]">
         
         <div className="space-y-6 mb-8">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 rounded-xl bg-[#EBE0CC]/30 text-[#5D4037]">
                      {tabs.find(t => t.value === activeStatus)?.icon}
                   </div>
                   <h2 className="text-lg font-bold capitalize text-[#5D4037]">
                     {tabs.find(t => t.value === activeStatus)?.label || 'All Items'} List
                   </h2>
                </div>

                <div className="relative group w-full md:w-80">
                   <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                     <Search className="text-gray-400 group-focus-within:text-[#A67C37] transition-colors" size={20} />
                   </div>
                   <input 
                     type="text" 
                     placeholder="Search Products..." 
                     className="w-full bg-gray-50 text-[#5D4037] pl-14 pr-6 py-3.5 rounded-2xl border-2 border-transparent focus:border-[#A67C37]/30 focus:bg-white focus:outline-none transition-all font-semibold text-sm placeholder:text-gray-400"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
            </div>
         </div>

         {/* --- TABLE (RESPONSIVE) --- */}
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-[#A67C37] text-xs font-bold uppercase tracking-wider border-b border-[#EBE0CC]">
                <th className="pb-4 pl-4 font-extrabold text-[#5D4037]">Name</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">Unit</th>
                <th className="pb-4">Added by</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE0CC]/30">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-[#EBE0CC]/10 transition-colors duration-200">
                  <td className="py-6 pl-4 font-bold text-[#5D4037] text-sm">{item.name}</td>
                  <td className="py-6 font-medium text-gray-700 text-sm">{item.quantity}</td>
                  <td className="py-6 text-sm text-gray-500 font-medium">{item.unit}</td>
                  <td className="py-6">
                    <span className="text-[#A67C37] text-xs font-bold capitalize">
                      {item.addedBy}
                    </span>
                  </td>
                  <td className="py-6">
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border ${
                      item.status === 'damaged' ? 'bg-red-50 text-red-600 border-red-100' :
                      item.status === 'rest_product' ? 'bg-[#5D4037] text-white border-[#5D4037]' :
                      item.status === 'received' ? 'bg-[#A67C37] text-white border-[#A67C37]' :
                      item.status === 'orders' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-green-50 text-green-700 border-green-100'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-6 pr-4 text-right">
                    <span className="bg-gray-50 text-gray-500 text-xs font-bold px-4 py-1.5 rounded-full capitalize border border-gray-100">
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Package size={48} strokeWidth={1} className="mb-4 opacity-20 text-[#5D4037]" />
              <p className="text-sm font-medium">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}