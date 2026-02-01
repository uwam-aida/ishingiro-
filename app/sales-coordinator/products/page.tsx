'use client';

import React, { useState } from 'react';
import { Search, ShoppingBag, Store, Filter } from 'lucide-react';

export default function SalesProductsPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const products = [
    // Orders
    { id: 1, name: 'Bread', quantity: '100', unit: 'piece', by: 'Shop manager', status: 'Requested', category: 'orders' },
    { id: 2, name: 'Birthday cake', quantity: '1', unit: 'piece', by: 'Shop manager', status: 'Requested', category: 'orders' },
    // Stock
    { id: 3, name: 'Bread', quantity: '100', unit: 'pieces', by: 'shop manager', status: 'shop-stock', category: 'stock' },
  ];

  // Filter Logic
  const filteredData = products.filter(item => {
    return item.category === activeTab && item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your products inventory by category.</p>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2 max-w-2xl">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 w-full px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'orders' 
            ? 'bg-gray-900 text-white shadow-md' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <ShoppingBag size={16} /> Order per piece
        </button>
        
        <button 
          onClick={() => setActiveTab('stock')}
          className={`flex-1 w-full px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'stock' 
            ? 'bg-gray-900 text-white shadow-md' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Store size={16} /> Shop stock
        </button>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[500px]">
         
         <div className="space-y-6 mb-8">
            <h2 className="text-lg font-bold capitalize text-gray-900 flex items-center gap-2">
               {activeTab === 'orders' ? <ShoppingBag size={20} /> : <Store size={20} />}
               {activeTab === 'orders' ? 'Order per piece' : 'Shop stock'}
            </h2>

            {/* Search Bar */}
            <div className="relative group max-w-full bg-gray-100 rounded-2xl">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder="Search Products..."
                 className="w-full bg-transparent text-gray-900 pl-14 pr-6 py-4 rounded-2xl border-none focus:ring-0 focus:outline-none transition-all font-medium text-sm placeholder:text-gray-400"
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
                <th className="pb-5">{activeTab === 'orders' ? 'Ordered by' : 'Added by'}</th>
                <th className="pb-5 text-right pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                    <td className="py-6 pl-4 font-bold text-gray-900 text-sm">{item.name}</td>
                    <td className="py-6">
                      <span className="font-bold text-gray-900 text-sm">{item.quantity}</span>
                    </td>
                    <td className="py-6 text-sm font-medium text-gray-500">{item.unit}</td>
                    <td className="py-6">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {item.by}
                      </span>
                    </td>
                    <td className="py-6 text-right pr-4">
                      <span className={`text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wide ${
                        item.status === 'Requested' 
                        ? 'bg-red-500 text-white shadow-red-200 shadow-md' // Matches Red Button in Image
                        : 'bg-black text-white shadow-md' // Matches Black Pill in Image
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
                       <p className="text-sm font-medium">No items found.</p>
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