'use client';

import React, { useState } from 'react';
import { Search, Scale, Package, CheckCircle } from 'lucide-react';

export default function FinanceProductsPage() {
  const [activeTab, setActiveTab] = useState<'measured' | 'baked_products'>('measured');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Mock Data
  const products = [
    { id: 1, name: 'Bread flour', quantity: '50', unit: 'kg', addedBy: 'Baker assistant', status: 'measured', category: 'measured' },
    { id: 2, name: 'Bread', quantity: '100', unit: 'pieces', addedBy: 'Baker assistant', status: 'baked', category: 'baked_products' },
  ];

  // 2. Filter Logic
  const filteredData = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your products inventory by category</p>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white p-2 rounded-[20px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2 w-full">
        
        {/* Measured Tab */}
        <button 
          onClick={() => setActiveTab('measured')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'measured' 
            ? 'bg-emerald-50 text-emerald-700 shadow-md ring-1 ring-emerald-100 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-700'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'measured' ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
            <Scale size={18} />
          </div>
          Measured (kg)
        </button>

        {/* Baked Products Tab */}
        <button 
          onClick={() => setActiveTab('baked_products')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'baked_products' 
            ? 'bg-slate-50 text-slate-700 shadow-md ring-1 ring-slate-200 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-slate-700'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'baked_products' ? 'bg-slate-200 text-slate-800' : 'bg-gray-100 text-gray-400'}`}>
            <Package size={18} />
          </div>
          Baked Products
        </button>
      </div>

      {/* --- MAIN CARD --- */}
      <div className={`bg-white rounded-[32px] p-8 shadow-xl shadow-gray-100/50 border-2 transition-colors duration-500 ${
        activeTab === 'measured' ? 'border-emerald-50' : 'border-slate-50'
      }`}>
         
         <div className="space-y-6 mb-8">
            <div className="flex items-center gap-3">
               <div className={`p-2.5 rounded-xl ${
                 activeTab === 'measured' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
               }`}>
                  {activeTab === 'measured' ? <Scale size={20} /> : <Package size={20} />}
               </div>
               <h2 className="text-lg font-bold capitalize text-gray-900">
                 {activeTab.replace(/_/g, ' ')}
               </h2>
            </div>

            {/* Professional Search Bar */}
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="text-gray-400 group-focus-within:text-black transition-colors" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder={`Search ${activeTab.replace(/_/g, ' ')}...`}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                  <td className="py-6 pl-4 font-bold text-gray-900 text-sm">{item.name}</td>
                  <td className="py-6">
                    <span className="font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm">{item.quantity}</span>
                  </td>
                  <td className="py-6 text-sm font-medium text-gray-500">{item.unit}</td>
                  <td className="py-6">
                    <span className="bg-gray-50 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg capitalize border border-gray-200">
                      {item.addedBy}
                    </span>
                  </td>
                  <td className="py-6">
                    <span className={`text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase border inline-flex items-center gap-1.5 ${
                      item.status === 'baked' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.status === 'baked' ? <CheckCircle size={10} strokeWidth={3} /> : <Scale size={10} strokeWidth={3} />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Scale size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}