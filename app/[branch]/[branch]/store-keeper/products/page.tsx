'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, AlertTriangle, ShoppingBag, Bell, CheckCheck, ArrowLeft, ClipboardList } from 'lucide-react';

export default function StoreKeeperProducts() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('baked');
  const [searchQuery, setSearchQuery] = useState('');

  // --- AUTOMATIC TIME GENERATOR ---
  // This function returns the current time in "HH:MM AM/PM" format
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- DATA FROM DASHBOARD (With Auto Time) ---
  // In a real app, 'time' would come from the database. Here we simulate it.
  const [allProducts, setAllProducts] = useState([
    // 1. BAKED (Incoming)
    { id: 1, category: 'baked', name: 'Bread Flour', quantity: '600', unit: 'pieces', time: getCurrentTime(), addedBy: 'Production', status: 'baked', action: 'receive' },
    
    // 2. REQUESTS
    { id: 2, category: 'requests', name: 'Donuts', quantity: '100', unit: 'pieces', time: getCurrentTime(), addedBy: 'Shop Manager', status: 'pending', action: 'deliver' },
    
    // 3. MY STOCK
    { id: 3, category: 'stock', name: 'Bread', quantity: '500', unit: 'pieces', time: getCurrentTime(), addedBy: 'Store Keeper', status: 'ready', action: 'available' },

    // 4. DELIVERED
    { id: 4, category: 'delivered', name: 'Cake', quantity: '5', unit: 'pieces', time: getCurrentTime(), addedBy: 'Store Keeper', status: 'delivered', action: 'view note' },

    // 5. DAMAGED
    { id: 5, category: 'damaged', name: 'Burnt Toast', quantity: '20', unit: 'pieces', time: getCurrentTime(), addedBy: 'Production', status: 'damaged', action: 'discard' },
    
    // 6. NOTES
    { id: 6, category: 'notes', name: 'DN-005', quantity: '1', unit: 'note', time: getCurrentTime(), addedBy: 'System', status: 'saved', action: 'print' },
  ]);

  const currentData = allProducts.filter(item => 
    item.category === activeTab && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tabs Configuration
  const tabs = [
    { id: 'baked', label: 'Baked', icon: Package },
    { id: 'requests', label: 'Requests', icon: Bell },
    { id: 'stock', label: 'My Stock', icon: ShoppingBag },
    { id: 'delivered', label: 'Delivered', icon: CheckCheck },
    { id: 'damaged', label: 'Damaged', icon: AlertTriangle },
    { id: 'notes', label: 'Notes', icon: ClipboardList },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 relative">
      
      {/* --- MOBILE LOGO --- */}
      <div className="md:hidden flex items-center justify-center mb-6">
         <img src="/logo.png" alt="Shop Logo" className="h-16 w-auto object-contain" />
      </div>

      {/* --- HEADER WITH BACK ARROW --- */}
      <div className="flex items-center gap-4">
        <button 
           onClick={() => router.back()} 
           className="p-2 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
        >
           <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="text-3xl font-bold text-[#5D4037]">Products Management</h1>
           <p className="text-[#A67C37] mt-1 font-medium">Manage your products inventory by category</p>
        </div>
      </div>

      {/* --- TAB CONTAINER --- */}
      <div className="bg-[#EAEAEA] p-1.5 rounded-2xl flex w-full items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
              ? activeTab === 'damaged' 
                ? 'bg-white text-red-600 shadow-sm border border-red-100' 
                : 'bg-white text-[#5D4037] shadow-sm' // Brand Color Text
              : 'text-gray-500 hover:text-[#5D4037]'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* --- MAIN CARD --- */}
      <div className={`bg-white rounded-3xl p-8 shadow-sm border min-h-[500px] transition-colors ${
        activeTab === 'damaged' ? 'border-red-100' : 'border-gray-100'
      }`}>
         
         {/* Card Header & Search */}
         <div className="space-y-6 mb-8">
            
            <div className="flex items-center gap-3">
               <div className={`p-2.5 rounded-xl ${
                 activeTab === 'damaged' ? 'bg-red-50 text-red-600' : 'bg-[#EBE0CC]/40 text-[#5D4037]'
               }`}>
                  {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 20 })}
               </div>
               <h2 className={`text-lg font-bold capitalize ${
                 activeTab === 'damaged' ? 'text-red-700' : 'text-[#5D4037]'
               }`}>
                 {activeTab.replace('_', ' ')} products
               </h2>
            </div>

            {/* Search Bar */}
            <div className="relative">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                 <Search size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder="Search Products..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#EAEAEA] border-transparent text-[#5D4037] rounded-2xl py-4 pl-12 pr-4 focus:bg-gray-100 outline-none transition-all font-medium text-sm placeholder:text-gray-500"
               />
            </div>
         </div>

         {/* --- TABLE --- */}
         <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-[#A67C37] text-sm font-bold capitalize border-b border-gray-100">
                <th className="pb-4 pl-2">Name</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">Unit</th>
                <th className="pb-4">Time</th> {/* Added Time Column Header */}
                <th className="pb-4">Added by</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-5 pl-2 font-medium text-[#5D4037] text-sm">{item.name}</td>
                  <td className="py-5 font-medium text-gray-700 text-sm">{item.quantity}</td>
                  <td className="py-5 text-sm text-gray-500">{item.unit}</td>
                  
                  {/* TIME COLUMN */}
                  <td className="py-5 text-sm text-gray-400 font-mono">{item.time}</td>
                  
                  {/* Added By Pill */}
                  <td className="py-5">
                    <span className="bg-[#EAEAEA] text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg capitalize">
                      {item.addedBy}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-5">
                    <span className={`text-[11px] font-bold px-5 py-2 rounded-full uppercase tracking-wide border ${
                      item.status === 'damaged' 
                        ? 'bg-red-600 text-white border-red-600'
                        : item.status === 'delivered'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-[#5D4037] text-white border-[#5D4037]' // Brand Color for Status
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Action Pill */}
                  <td className="py-5 pr-2 text-right">
                    <span className="bg-[#EAEAEA] text-gray-500 text-xs font-bold px-4 py-1.5 rounded-full capitalize">
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