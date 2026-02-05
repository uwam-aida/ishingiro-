'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Scale, PackageX, ChefHat, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

export default function BakerProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'measured' | 'baked' | 'damaged'>('measured');
  const [searchQuery, setSearchQuery] = useState('');

  // --- AUTOMATIC TIME HELPER ---
  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Mock Data
  const allItems = [
    { id: 1, name: 'Milk Bread Dough', quantity: '50', unit: 'kg', time: getCurrentTime(), addedBy: 'baker', status: 'measured', action: 'available' },
    { id: 2, name: 'White Bread', quantity: '100', unit: 'pieces', time: getCurrentTime(), addedBy: 'baker', status: 'baked', action: 'available' },
    { id: 3, name: 'Burnt Toast', quantity: '15', unit: 'pieces', time: getCurrentTime(), addedBy: 'baker', status: 'damaged', action: 'discarded' },
  ];

  // 2. Filter Logic
  const filteredData = allItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    // ADDED: min-h-screen & bg-gray-50 to create the gray page background
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Container with top padding */}
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 md:px-8 pt-6">
        
        {/* --- MOBILE LOGO --- */}
        <div className="md:hidden flex items-center justify-center mb-6">
          <img src="/logo.png" alt="Shop Logo" className="h-14 w-auto object-contain" />
        </div>

        {/* --- HEADER --- */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 md:p-2.5 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-[#5D4037] tracking-tight">Products Management</h1>
            <p className="text-[#A67C37] text-xs md:text-base mt-1 font-medium">Manage your products inventory by category</p>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="bg-white p-2 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-2 w-full overflow-x-auto no-scrollbar">
          
          {/* Measured */}
          <button 
            onClick={() => setActiveTab('measured')}
            className={`flex-1 min-w-[140px] px-4 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${
              activeTab === 'measured' 
              ? 'bg-[#5D4037] text-white shadow-md ring-1 ring-[#5D4037] translate-y-[-2px]' 
              : 'text-gray-500 hover:bg-[#EBE0CC]/20 hover:text-[#5D4037]'
            }`}
          >
            <div className={`p-1 md:p-1.5 rounded-full ${activeTab === 'measured' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Scale size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            Measured (kg)
          </button>

          {/* Baked */}
          <button 
            onClick={() => setActiveTab('baked')}
            className={`flex-1 min-w-[140px] px-4 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${
              activeTab === 'baked' 
              ? 'bg-[#A67C37] text-white shadow-md ring-1 ring-[#A67C37] translate-y-[-2px]' 
              : 'text-gray-500 hover:bg-[#EBE0CC]/20 hover:text-[#A67C37]'
            }`}
          >
            <div className={`p-1 md:p-1.5 rounded-full ${activeTab === 'baked' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <ChefHat size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            Baked Products
          </button>

          {/* Damaged */}
          <button 
            onClick={() => setActiveTab('damaged')}
            className={`flex-1 min-w-[140px] px-4 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${
              activeTab === 'damaged' 
              ? 'bg-red-50 text-red-600 shadow-md ring-1 ring-red-100 translate-y-[-2px]' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-red-600'
            }`}
          >
            <div className={`p-1 md:p-1.5 rounded-full ${activeTab === 'damaged' ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
              <PackageX size={16} className="md:w-[18px] md:h-[18px]" />
            </div>
            Damaged Items
          </button>
        </div>

        {/* --- MAIN CARD --- */}
        <div className={`bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-8 shadow-xl shadow-gray-200/50 border-2 transition-colors duration-500 ${
          activeTab === 'damaged' ? 'border-red-50' : 
          activeTab === 'baked' ? 'border-[#A67C37]/30' : 
          'border-[#5D4037]/30'
        }`}>
          
          {/* Card Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2 md:p-3 rounded-2xl shadow-sm ${
                  activeTab === 'damaged' ? 'bg-red-100 text-red-600' : 
                  activeTab === 'baked' ? 'bg-[#EBE0CC] text-[#A67C37]' : 
                  'bg-[#EBE0CC] text-[#5D4037]'
                }`}>
                    {activeTab === 'measured' ? <Scale size={20} className="md:w-6 md:h-6" /> : activeTab === 'baked' ? <ChefHat size={20} className="md:w-6 md:h-6" /> : <PackageX size={20} className="md:w-6 md:h-6" />}
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold capitalize text-[#5D4037]">
                    {activeTab} Products
                  </h2>
                  <p className="text-[10px] md:text-xs font-bold text-[#A67C37] uppercase tracking-wider mt-0.5">Inventory List</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-gray-400 group-focus-within:text-[#5D4037] transition-colors" size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="w-full bg-gray-50 text-[#5D4037] pl-12 pr-4 py-3 md:py-4 rounded-2xl border-transparent focus:bg-white focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A67C37]/20 font-medium text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
          </div>

          {/* Table Wrapper */}
          <div className="overflow-x-auto rounded-xl -mx-2 px-2 md:mx-0 md:px-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#EBE0CC]">
                  <th className="pb-4 md:pb-5 pl-2 md:pl-4 text-xs font-extrabold text-[#A67C37] uppercase tracking-wider">Name</th>
                  <th className="pb-4 md:pb-5 text-xs font-extrabold text-[#A67C37] uppercase tracking-wider">Quantity</th>
                  <th className="pb-4 md:pb-5 text-xs font-extrabold text-[#A67C37] uppercase tracking-wider">Unit</th>
                  <th className="pb-4 md:pb-5 text-xs font-extrabold text-[#A67C37] uppercase tracking-wider">Time</th>
                  <th className="pb-4 md:pb-5 text-xs font-extrabold text-[#A67C37] uppercase tracking-wider">Added by</th>
                  <th className="pb-4 md:pb-5 text-xs font-extrabold text-[#A67C37] uppercase tracking-wider">Status</th>
                  <th className="pb-4 md:pb-5 pr-2 md:pr-4 text-right text-xs font-extrabold text-[#A67C37] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE0CC]/30">
                {filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-[#EBE0CC]/10 transition-colors duration-200">
                    <td className="py-4 md:py-6 pl-2 md:pl-4 font-bold text-[#5D4037] text-sm">{item.name}</td>
                    <td className="py-4 md:py-6">
                      <span className="font-medium text-[#5D4037] bg-[#EBE0CC]/30 px-3 py-1 rounded-lg text-sm">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 md:py-6 text-sm font-medium text-gray-500">{item.unit}</td>
                    
                    <td className="py-4 md:py-6 text-sm font-medium text-gray-400 font-mono whitespace-nowrap">{item.time}</td>

                    <td className="py-4 md:py-6">
                      <span className="text-xs font-bold text-[#A67C37] bg-[#EBE0CC]/20 border border-[#EBE0CC] px-3 py-1.5 rounded-lg capitalize whitespace-nowrap">
                        {item.addedBy}
                      </span>
                    </td>
                    
                    <td className="py-4 md:py-6">
                      <span className={`text-[10px] font-extrabold px-3 md:px-4 py-1.5 rounded-full uppercase border inline-flex items-center gap-1.5 whitespace-nowrap ${
                        item.status === 'damaged' 
                          ? 'bg-red-50 text-red-600 border-red-200' 
                          : item.status === 'baked'
                          ? 'bg-[#A67C37] text-white border-[#A67C37]'
                          : 'bg-[#5D4037] text-white border-[#5D4037]'
                      }`}>
                        {item.status === 'damaged' ? <XCircle size={10} strokeWidth={3}/> : 
                        item.status === 'baked' ? <CheckCircle size={10} strokeWidth={3}/> : 
                        <Clock size={10} strokeWidth={3}/>}
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 md:py-6 pr-2 md:pr-4 text-right">
                      <span className={`text-xs font-bold px-3 md:px-4 py-2 rounded-xl capitalize whitespace-nowrap ${
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
              <div className="flex flex-col items-center justify-center py-16 md:py-24 text-gray-400">
                <PackageX size={48} strokeWidth={1} className="mb-4 opacity-20 text-[#5D4037]" />
                <p className="text-sm font-medium">No items found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}