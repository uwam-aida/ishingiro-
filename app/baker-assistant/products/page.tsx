'use client';

import React, { useState } from 'react';
import { Search, Scale, PackageX, ChefHat, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function BakerProductsPage() {
  const [activeTab, setActiveTab] = useState<'measured' | 'baked' | 'damaged'>('measured');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Mock Data (Mixed Types)
  const allItems = [
    { id: 1, name: 'Milk Bread Dough', quantity: '50', unit: 'kg', addedBy: 'baker', status: 'measured', action: 'available' },
    { id: 2, name: 'White Bread', quantity: '100', unit: 'pieces', addedBy: 'baker', status: 'baked', action: 'available' },
    { id: 3, name: 'Burnt Toast', quantity: '15', unit: 'pieces', addedBy: 'baker', status: 'damaged', action: 'discarded' },
  ];

  // 2. Filter Logic
  const filteredData = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage your products inventory by category</p>
      </div>

      {/* --- COLOR-CODED TABS --- */}
      <div className="bg-white p-2 rounded-[20px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-2 w-full">
        
        {/* Measured (Blue Theme) */}
        <button 
          onClick={() => setActiveTab('measured')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'measured' 
            ? 'bg-blue-50 text-blue-600 shadow-md ring-1 ring-blue-100 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'measured' ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
            <Scale size={18} />
          </div>
          Measured (kg)
        </button>

        {/* Baked (Orange Theme) */}
        <button 
          onClick={() => setActiveTab('baked')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'baked' 
            ? 'bg-orange-50 text-orange-600 shadow-md ring-1 ring-orange-100 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'baked' ? 'bg-orange-200 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
            <ChefHat size={18} />
          </div>
          Baked Products
        </button>

        {/* Damaged (Red Theme) */}
        <button 
          onClick={() => setActiveTab('damaged')}
          className={`flex-1 w-full md:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
            activeTab === 'damaged' 
            ? 'bg-red-50 text-red-600 shadow-md ring-1 ring-red-100 translate-y-[-2px]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-red-600'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'damaged' ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
            <PackageX size={18} />
          </div>
          Damaged Items
        </button>
      </div>

      {/* --- MAIN CARD (Dynamic Border Color) --- */}
      <div className={`bg-white rounded-[32px] p-8 shadow-xl shadow-gray-100/50 border-2 transition-colors duration-500 ${
        activeTab === 'damaged' ? 'border-red-50' : 
        activeTab === 'baked' ? 'border-orange-50' : 
        'border-blue-50'
      }`}>
         
         {/* Card Header & Search */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            
            {/* Dynamic Title */}
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl shadow-sm ${
                 activeTab === 'damaged' ? 'bg-red-100 text-red-600' : 
                 activeTab === 'baked' ? 'bg-orange-100 text-orange-600' : 
                 'bg-blue-100 text-blue-600'
               }`}>
                  {activeTab === 'measured' ? <Scale size={24} /> : activeTab === 'baked' ? <ChefHat size={24} /> : <PackageX size={24} />}
               </div>
               <div>
                 <h2 className="text-xl font-bold capitalize text-gray-900">
                   {activeTab} Products
                 </h2>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">Inventory List</p>
               </div>
            </div>

            {/* Professional Search Bar */}
            <div className="relative group w-full md:w-96">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Search className="text-gray-400 group-focus-within:text-gray-800 transition-colors" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder={`Search ${activeTab}...`}
                 className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-4 rounded-2xl border-transparent focus:bg-white focus:shadow-sm focus:outline-none font-medium text-sm transition-all"
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
                <th className="pb-5 pl-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Unit</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Added by</th>
                <th className="pb-5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="pb-5 pr-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                  <td className="py-6 pl-4 font-bold text-gray-900 text-sm">{item.name}</td>
                  <td className="py-6">
                    <span className="font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="py-6 text-sm font-medium text-gray-500">{item.unit}</td>
                  <td className="py-6">
                    <span className="text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg capitalize">
                      {item.addedBy}
                    </span>
                  </td>
                  
                  {/* Status Badge - Dynamic Colors */}
                  <td className="py-6">
                    <span className={`text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase border inline-flex items-center gap-1.5 ${
                      item.status === 'damaged' 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : item.status === 'baked'
                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                        : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {item.status === 'damaged' ? <XCircle size={10} strokeWidth={3}/> : 
                       item.status === 'baked' ? <CheckCircle size={10} strokeWidth={3}/> : 
                       <Clock size={10} strokeWidth={3}/>}
                      {item.status}
                    </span>
                  </td>

                  {/* Action Pill */}
                  <td className="py-6 pr-4 text-right">
                    <span className={`text-xs font-bold px-4 py-2 rounded-xl capitalize ${
                      item.action === 'discarded' 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
               <PackageX size={48} strokeWidth={1} className="mb-4 opacity-20" />
               <p className="text-sm font-medium">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}