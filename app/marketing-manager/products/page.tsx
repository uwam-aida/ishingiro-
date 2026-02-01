'use client';

import React, { useState } from 'react';
import { Search, Scale, Package, ShoppingBag, Store, Filter } from 'lucide-react';

export default function MarketingProductsPage() {
  const [activeTab, setActiveTab] = useState<'measured' | 'baked' | 'orders' | 'shop'>('measured');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data (Matches the screenshot data)
  const products = [
    // Measured
    { id: 1, name: 'Bread flour', qty: '50', unit: 'kg', addedBy: 'Baker assistant', status: 'measured', category: 'measured' },
    
    // Baked (Black Pill)
    { id: 2, name: 'Bread', qty: '100', unit: 'pieces', addedBy: 'Baker assistant', status: 'baked', category: 'baked' },
    
    // Orders (Red Pill)
    { id: 3, name: 'Bread Order', qty: '50', unit: 'pieces', addedBy: 'Shop manager', status: 'Ordered', category: 'orders' },
    { id: 4, name: 'Birthday Cake', qty: '1', unit: 'piece', addedBy: 'Shop manager', status: 'Ordered', category: 'orders' },
    
    // Shop Stock
    { id: 5, name: 'Biscuits', qty: '15', unit: 'pieces', addedBy: 'Shop manager', status: 'shop-stock', category: 'shop' },
  ];

  // Filter Logic
  const filteredData = products.filter(item => {
    return item.category === activeTab && item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const tabs = [
    { id: 'measured', label: 'Measured (kg)', icon: Scale },
    { id: 'baked', label: 'Baked products', icon: Package },
    { id: 'orders', label: 'Order per piece', icon: ShoppingBag },
    { id: 'shop', label: 'Shop stock', icon: Store },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your products inventory by category.</p>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max md:min-w-0">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 flex-1 ${
                activeTab === tab.id 
                ? 'bg-gray-200 text-gray-900 shadow-inner' // Matches the grey active state in image
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[500px]">
         
         <div className="space-y-6 mb-8">
            <h2 className="text-lg font-bold capitalize text-gray-900 flex items-center gap-2">
               {activeTab === 'measured' && <Scale size={20} />}
               {activeTab === 'baked' && <Package size={20} />}
               {activeTab === 'orders' && <ShoppingBag size={20} />}
               {activeTab === 'shop' && <Store size={20} />}
               {activeTab === 'orders' ? 'Order per piece' : activeTab.replace(/_/g, ' ')}
            </h2>

            {/* Search Bar (Matches the gray rounded bar in image) */}
            <div className="relative group max-w-full">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="text-gray-400" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder={`Search Products...`}
                 className="w-full bg-gray-200/60 text-gray-900 pl-14 pr-6 py-4 rounded-2xl border-none focus:ring-0 focus:bg-gray-200 transition-all font-medium text-sm placeholder:text-gray-400"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* --- TABLE --- */}
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                <th className="pb-5 pl-4">Name</th>
                <th className="pb-5">Quantity</th>
                <th className="pb-5">Unit</th>
                <th className="pb-5">Added by</th>
                <th className="pb-5 text-right pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-6 pl-4 font-bold text-gray-900 text-sm">{item.name}</td>
                    <td className="py-6 font-bold text-gray-900">{item.qty}</td>
                    <td className="py-6 text-sm font-medium text-gray-500">{item.unit}</td>
                    <td className="py-6">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {item.addedBy}
                      </span>
                    </td>
                    <td className="py-6 text-right pr-4">
                      {/* Status Pills Matching the Image */}
                      <span className={`text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wide ${
                        item.status === 'Ordered' 
                        ? 'bg-[#FF4D4D] text-white shadow-md shadow-red-100' // Red for Orders
                        : item.status === 'baked' 
                        ? 'bg-black text-white shadow-md shadow-gray-200' // Black for Baked
                        : item.status === 'shop-stock'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-gray-100 text-gray-600 border border-gray-200' // Default Gray
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                       <Filter size={32} className="mb-2 opacity-20" />
                       <p className="text-sm font-medium">No items found in {activeTab}.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}