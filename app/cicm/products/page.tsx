'use client';

import React, { useState } from 'react';
import { Search, Package, AlertTriangle, Store, CheckCircle, XCircle } from 'lucide-react';

export default function CICMProducts() {
  const [activeTab, setActiveTab] = useState<'damage_items' | 'baked_products' | 'shop_stock'>('damage_items');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const products = [
    { id: 1, name: 'Burnt Bread', quantity: '15', unit: 'pieces', addedBy: 'baker assistant', status: 'damaged', action: 'discarded', category: 'damage_items' },
    { id: 2, name: 'Spoiled Flour', quantity: '5', unit: 'kg', addedBy: 'store keeper', status: 'damaged', action: 'discarded', category: 'damage_items' },
    { id: 3, name: 'White Bread', quantity: '100', unit: 'pieces', addedBy: 'baker assistant', status: 'baked', action: 'available', category: 'baked_products' },
    { id: 4, name: 'Croissants', quantity: '50', unit: 'pieces', addedBy: 'baker assistant', status: 'baked', action: 'available', category: 'baked_products' },
    { id: 5, name: 'Birthday Cake', quantity: '5', unit: 'pieces', addedBy: 'Shop manager', status: 'in_stock', action: 'selling', category: 'shop_stock' },
  ];

  // Filter Logic
  const filteredData = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  // Dynamic Styles based on Active Tab
  const getThemeColor = () => {
    switch (activeTab) {
      case 'damage_items': return 'red';
      case 'baked_products': return 'orange';
      case 'shop_stock': return 'blue';
      default: return 'gray';
    }
  };

  const theme = getThemeColor();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products Inventory</h1>
        <p className="text-gray-500 mt-2 font-medium">Categorized view of production quality and stock levels.</p>
      </div>

      {/* --- DISTINCT TABS (Professional & Unique) --- */}
      <div className="bg-white p-2 rounded-[20px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2 w-full">
        
        {/* 1. DAMAGE ITEMS (Red Theme) */}
        <button 
          onClick={() => setActiveTab('damage_items')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'damage_items' 
            ? 'bg-red-50 text-red-600 shadow-md ring-1 ring-red-100 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-red-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'damage_items' ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
            <AlertTriangle size={18} />
          </div>
          Damage Items
        </button>

        {/* 2. BAKED PRODUCTS (Orange Theme) */}
        <button 
          onClick={() => setActiveTab('baked_products')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'baked_products' 
            ? 'bg-orange-50 text-orange-600 shadow-md ring-1 ring-orange-100 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'baked_products' ? 'bg-orange-200 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
            <Package size={18} />
          </div>
          Baked Products
        </button>

        {/* 3. SHOP STOCK (Blue Theme) */}
        <button 
          onClick={() => setActiveTab('shop_stock')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'shop_stock' 
            ? 'bg-blue-50 text-blue-600 shadow-md ring-1 ring-blue-100 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'shop_stock' ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
            <Store size={18} />
          </div>
          Shop Stock
        </button>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className={`bg-white rounded-[32px] p-8 shadow-xl shadow-gray-100/50 border-2 transition-colors duration-500 ${
        activeTab === 'damage_items' ? 'border-red-50' : 
        activeTab === 'baked_products' ? 'border-orange-50' : 
        'border-blue-50'
      }`}>
         
         {/* Card Header & Search */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            
            {/* Dynamic Title */}
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl shadow-sm ${
                 activeTab === 'damage_items' ? 'bg-red-100 text-red-600' : 
                 activeTab === 'baked_products' ? 'bg-orange-100 text-orange-600' : 
                 'bg-blue-100 text-blue-600'
               }`}>
                  {activeTab === 'damage_items' ? <AlertTriangle size={24} /> : activeTab === 'baked_products' ? <Package size={24} /> : <Store size={24} />}
               </div>
               <div>
                 <h2 className="text-xl font-bold capitalize text-gray-900">
                   {activeTab.replace(/_/g, ' ')}
                 </h2>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">List Overview</p>
               </div>
            </div>

            {/* Professional Search Bar */}
            <div className="relative group w-full md:w-96">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Search className="text-gray-400 group-focus-within:text-gray-800 transition-colors" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder={`Search in ${activeTab.replace(/_/g, ' ')}...`}
                 className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-4 rounded-2xl border border-transparent focus:bg-white focus:border-gray-200 focus:shadow-sm focus:outline-none transition-all font-medium text-sm placeholder:text-gray-400"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* --- TABLE --- */}
         <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-5 pl-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Product Name</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Unit</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Added By</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="pb-5 pr-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                  
                  {/* Name */}
                  <td className="py-6 pl-4">
                    <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                  </td>

                  {/* Quantity */}
                  <td className="py-6">
                    <span className="font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm">{item.quantity}</span>
                  </td>

                  {/* Unit */}
                  <td className="py-6">
                    <span className="text-sm font-medium text-gray-500">{item.unit}</span>
                  </td>
                  
                  {/* Added By */}
                  <td className="py-6">
                    <span className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg capitalize">
                      {item.addedBy}
                    </span>
                  </td>

                  {/* Status Badge - Uniquely Colored */}
                  <td className="py-6">
                    <span className={`text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wide border shadow-sm inline-flex items-center gap-1.5 ${
                      item.status === 'damaged' 
                        ? 'bg-red-600 text-white border-red-600' 
                        : item.status === 'baked'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-blue-600 text-white border-blue-600'
                    }`}>
                      {item.status === 'damaged' && <XCircle size={10} strokeWidth={3} />}
                      {item.status !== 'damaged' && <CheckCircle size={10} strokeWidth={3} />}
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-6 pr-4 text-right">
                    <span className={`text-xs font-bold px-4 py-2 rounded-xl capitalize ${
                      item.action === 'discarded' 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-green-50 text-green-700'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
               <div className="bg-gray-50 p-4 rounded-full mb-3">
                 <Search size={24} className="opacity-40" />
               </div>
               <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}