'use client';

import React, { useState } from 'react';
import { Search, Package, AlertTriangle } from 'lucide-react';

export default function StoreKeeperProducts() {
  const [activeTab, setActiveTab] = useState<'baked' | 'damaged'>('baked');

  // 1. Baked Data
  const bakedItems = [
    { id: 1, name: 'Bread flour', quantity: '50', unit: 'piece', addedBy: 'baker assistant', status: 'baked', action: 'available' },
    { id: 2, name: 'Sugar', quantity: '20', unit: 'kg', addedBy: 'store keeper', status: 'baked', action: 'available' },
  ];
  
  // 2. Damaged Data
  const damagedItems = [
    { id: 1, name: 'Burnt Bread', quantity: '10', unit: 'piece', addedBy: 'baker assistant', status: 'damaged', action: 'discarded' },
  ];

  const currentData = activeTab === 'baked' ? bakedItems : damagedItems;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <p className="text-gray-500 mt-1">Manage your products inventory by category</p>
      </div>

      {/* --- TAB CONTAINER (Modified for BIG GAP) --- */}
      {/* 'justify-between' pushes buttons to far left and far right */}
      <div className="bg-[#EAEAEA] p-1.5 rounded-2xl flex w-full justify-between items-center">
        
        {/* Baked Tab (Left) */}
        <button 
          onClick={() => setActiveTab('baked')}
          className={`px-10 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'baked' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package size={18} /> Baked Products
        </button>

        {/* Damaged Tab (Right) - RED Style */}
        <button 
          onClick={() => setActiveTab('damaged')}
          className={`px-10 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'damaged' 
            ? 'bg-white text-red-600 shadow-sm border border-red-100' // Red Text on White bg when active
            : 'text-gray-500 hover:text-red-600'
          }`}
        >
          <AlertTriangle size={18} /> Damaged Products
        </button>
      </div>

      {/* --- MAIN CARD --- */}
      <div className={`bg-white rounded-3xl p-8 shadow-sm border min-h-[500px] transition-colors ${
        activeTab === 'damaged' ? 'border-red-100' : 'border-gray-100'
      }`}>
         
         {/* Card Header & Search */}
         <div className="space-y-6 mb-8">
            
            {/* Title with Icon */}
            <div className="flex items-center gap-3">
               <div className={`p-2.5 rounded-xl ${
                 activeTab === 'damaged' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-900'
               }`}>
                  {activeTab === 'baked' ? <Package size={20} /> : <AlertTriangle size={20} />}
               </div>
               <h2 className={`text-lg font-bold capitalize ${
                 activeTab === 'damaged' ? 'text-red-700' : 'text-gray-900'
               }`}>
                 {activeTab} products
               </h2>
            </div>

            {/* Search Bar (Wide Gray Pill) */}
            <div className="relative">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                 <Search size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder="Search Products..." 
                 className="w-full bg-[#EAEAEA] border-transparent text-gray-900 rounded-2xl py-4 pl-12 pr-4 focus:bg-gray-100 outline-none transition-all font-medium text-sm placeholder:text-gray-500"
               />
            </div>
         </div>

         {/* --- TABLE --- */}
         <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-900 text-sm font-bold capitalize border-b border-gray-100">
                <th className="pb-4 pl-2">Name</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">unit</th>
                <th className="pb-4">Added by</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-5 pl-2 font-medium text-gray-900 text-sm">{item.name}</td>
                  <td className="py-5 font-medium text-gray-900 text-sm">{item.quantity}</td>
                  <td className="py-5 text-sm text-gray-900">{item.unit}</td>
                  
                  {/* Added By Pill */}
                  <td className="py-5">
                    <span className="bg-[#EAEAEA] text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg capitalize">
                      {item.addedBy}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-5">
                    <span className={`text-[11px] font-bold px-5 py-2 rounded-full uppercase tracking-wide border ${
                      item.status === 'damaged' 
                        ? 'bg-red-600 text-white border-red-600' // Red background for damaged
                        : 'bg-black text-white border-black'
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Action Pill */}
                  <td className="py-5 pr-2 text-right">
                    <span className="bg-[#EAEAEA] text-gray-600 text-xs font-bold px-4 py-1.5 rounded-full capitalize">
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {currentData.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm">No items found.</div>
          )}
        </div>
      </div>

    </div>
  );
}