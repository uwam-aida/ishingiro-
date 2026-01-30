'use client';

import React, { useState } from 'react';
import { Search, Package, AlertTriangle, Store, ShoppingBag } from 'lucide-react';

export default function ShopProductsPage() {
  const [activeStatus, setActiveStatus] = useState('baked');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Define Data (Unchanged)
  const productsData = [
    { id: 1, name: 'Bread Flour', quantity: '50', unit: 'piece', addedBy: 'baker', status: 'baked', action: 'available' },
    { id: 2, name: 'Sugar', quantity: '20', unit: 'kg', addedBy: 'store keeper', status: 'baked', action: 'available' },
    { id: 3, name: 'Croissant', quantity: '15', unit: 'piece', addedBy: 'baker', status: 'out_of_stock', action: 'unavailable' },
    { id: 4, name: 'Chocolate Cake', quantity: '5', unit: 'piece', addedBy: 'baker', status: 'available', action: 'available' },
  ];

  // 2. Define Tabs (Unchanged Logic)
  const tabs = [
    { label: 'Baked Products', value: 'baked', icon: '🍞' },
    { label: 'Order Per Piece', value: 'available', icon: '🍪' }, 
    { label: 'Shop Stock', value: 'out_of_stock', icon: '📦' },   
    { label: 'All Items', value: 'all', icon: '📋' },
  ];

  // 3. Filter Logic (Unchanged)
  const filteredData = productsData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeStatus === 'all' || item.status === activeStatus;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 relative">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products Management</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">Manage your products inventory by category</p>
      </div>

      {/* --- TABS --- */}
      <div className="bg-[#EAEAEA] p-1.5 rounded-2xl flex items-center gap-6 w-full md:w-auto overflow-x-auto">
        {tabs.map((tab) => {
           const isActive = activeStatus === tab.value;
           return (
             <button 
               key={tab.value}
               onClick={() => setActiveStatus(tab.value)}
               className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize flex items-center gap-2 ${
                 isActive 
                 ? 'bg-white text-gray-900 shadow-sm transform scale-[1.02]' 
                 : 'text-gray-500 hover:text-gray-900'
               }`}
             >
               <span className="text-base">{tab.icon}</span>
               {tab.label}
             </button>
           );
        })}
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[600px]">
         
         <div className="space-y-6 mb-8">
            {/* Active Section Title */}
            <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-xl bg-gray-100 text-gray-900">
                  <Store size={20} />
               </div>
               <h2 className="text-lg font-bold capitalize text-gray-900">
                 {tabs.find(t => t.value === activeStatus)?.label || 'All Items'} List
               </h2>
            </div>

            {/* Professional Search Bar */}
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="text-gray-400 group-focus-within:text-black transition-colors" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder="Search Products..." 
                 className="w-full bg-[#EAEAEA] text-gray-900 pl-14 pr-6 py-4 rounded-2xl border-2 border-transparent focus:border-gray-200 focus:bg-white focus:outline-none transition-all font-semibold text-sm placeholder:text-gray-400 placeholder:font-medium"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* --- TABLE --- */}
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-50">
                <th className="pb-4 pl-4 font-extrabold text-gray-900">Name</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">Unit</th>
                <th className="pb-4">Added by</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                  <td className="py-6 pl-4 font-bold text-gray-900 text-sm">{item.name}</td>
                  <td className="py-6 font-medium text-gray-900 text-sm">{item.quantity}</td>
                  <td className="py-6 text-sm text-gray-500 font-medium">{item.unit}</td>
                  <td className="py-6">
                    <span className="bg-[#F3F4F6] text-gray-700 text-xs font-bold px-4 py-1.5 rounded-lg capitalize border border-gray-100">
                      {item.addedBy}
                    </span>
                  </td>
                  <td className="py-6">
                    <span className={`text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-wide border shadow-sm ${
                      item.status === 'out_of_stock' ? 'bg-red-600 text-white border-red-600' :
                      item.status === 'baked' ? 'bg-orange-500 text-white border-orange-500' :
                      'bg-black text-white border-black'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-6 pr-4 text-right">
                    <span className="bg-[#EAEAEA] text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full capitalize">
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Package size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}