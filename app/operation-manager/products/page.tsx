'use client';

import React, { useState } from 'react';
import { Search, Scale, Package, ShoppingBag, Store, Filter } from 'lucide-react';

export default function OperationProductsPage() {
  const [activeTab, setActiveTab] = useState<'measured' | 'baked' | 'orders' | 'shop'>('measured');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const allProducts = [
    { id: 1, name: 'Bread flour', qty: '50', unit: 'kg', addedBy: 'Baker assistant', status: 'measured', category: 'measured' },
    { id: 2, name: 'Bread', qty: '100', unit: 'pieces', addedBy: 'Baker assistant', status: 'baked', category: 'baked' },
    { id: 3, name: 'Bread Order', qty: '50', unit: 'pieces', addedBy: 'Shop manager', status: 'ordered', category: 'orders' },
    { id: 4, name: 'Cake', qty: '1', unit: 'pieces', addedBy: 'Shop manager', status: 'in_shop', category: 'shop' },
  ];

  // Filter Logic
  const filteredData = allProducts.filter(item => {
    return item.category === activeTab && item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Tab Config
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
        <p className="text-gray-500 mt-2 font-medium">Manage inventory stages and distribution.</p>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max md:min-w-0">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 flex items-center gap-3 ${
                activeTab === tab.id 
                ? 'bg-gray-900 text-white shadow-md transform scale-[1.02]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[500px]">
         
         <div className="space-y-6 mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-xl bg-gray-50 text-gray-900">
                  <Filter size={20} />
               </div>
               <h2 className="text-lg font-bold capitalize text-gray-900">
                 {activeTab.replace(/_/g, ' ')} Inventory
               </h2>
            </div>

            {/* Search Bar */}
            <div className="relative group max-w-2xl">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder={`Search ${activeTab} products...`}
                 className="w-full bg-gray-50 text-gray-900 pl-14 pr-6 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-sm focus:outline-none transition-all font-medium text-sm placeholder:text-gray-400"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* --- TABLE --- */}
         <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                <th className="pb-5 pl-4">Name</th>
                <th className="pb-5">Quantity</th>
                <th className="pb-5">Unit</th>
                <th className="pb-5">Added by</th>
                <th className="pb-5">Status</th>
                <th className="pb-5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                    <td className="py-6 pl-4 font-bold text-gray-900 text-sm">{item.name}</td>
                    <td className="py-6">
                      <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-xs">{item.qty}</span>
                    </td>
                    <td className="py-6 text-sm font-medium text-gray-500">{item.unit}</td>
                    <td className="py-6">
                      <span className="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {item.addedBy}
                      </span>
                    </td>
                    <td className="py-6">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase ${
                        item.status === 'measured' ? 'bg-gray-100 text-gray-600' :
                        item.status === 'baked' ? 'bg-black text-white' :
                        item.status === 'ordered' ? 'bg-red-50 text-red-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-6 text-right pr-4">
                      <button className="text-xs font-bold text-gray-400 hover:text-gray-900 underline decoration-2 underline-offset-4 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium">No items found in {activeTab}.</p>
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