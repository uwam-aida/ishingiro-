'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Store, 
  Package, 
  TrendingUp, 
  ClipboardList, 
  PieChart
} from 'lucide-react';

export default function CICMReportPage() {
  const [activeTab, setActiveTab] = useState<'inventory_status' | 'baking_details' | 'stock_shop'>('inventory_status');
  const [currentDate, setCurrentDate] = useState('');

  // Ref for Smooth Scrolling
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize Real-time Date on Mount
  useEffect(() => {
    const now = new Date();
    // Format: "Oct 29, 2025, 10:30 AM"
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setCurrentDate(formattedDate);
  }, []);

  // Function to switch tab and scroll
  const handleCardClick = (tab: 'inventory_status' | 'baking_details' | 'stock_shop') => {
    setActiveTab(tab);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // --- BRAND COLORS ---
  const BRAND_COLOR = "bg-[#5D4037]"; 
  const BRAND_TEXT = "text-[#5D4037]";
  const LIGHT_BG = "bg-[#F5F3F0]"; 

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className={`text-3xl font-extrabold ${BRAND_TEXT} tracking-tight`}>Inventory & Stock report</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">View inventory, production and shop stock status</p>
        </div>
        <div className="flex items-center gap-3">
           {/* DYNAMIC DATE HERE */}
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
             Last updated: {currentDate || 'Loading...'}
           </span>
           <button className={`${BRAND_COLOR} text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center gap-2`}>
             <FileText size={16} /> Export PDF
           </button>
        </div>
      </div>

      {/* --- TOP STATS CARDS (INTERACTIVE & SCROLLING) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1: Damage Items -> Inventory Status */}
        <div 
          onClick={() => handleCardClick('inventory_status')}
          className={`bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group ${activeTab === 'inventory_status' ? 'ring-2 ring-[#5D4037] ring-offset-2' : ''}`}
        >
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:scale-110 transition-transform"><AlertTriangle size={18} /></div>
             <span className="text-xs font-bold text-gray-400 uppercase group-hover:text-red-600 transition-colors">Damage items</span>
           </div>
           <h3 className="text-3xl font-extrabold text-gray-900">50</h3>
           <p className="text-xs font-bold text-gray-400 mt-1">1 type in kg</p>
        </div>

        {/* Card 2: Baked Products -> Baking Details */}
        <div 
          onClick={() => handleCardClick('baking_details')}
          className={`bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group ${activeTab === 'baking_details' ? 'ring-2 ring-[#5D4037] ring-offset-2' : ''}`}
        >
           <div className="flex items-center gap-3 mb-2">
             <div className={`p-2 rounded-lg ${LIGHT_BG} ${BRAND_TEXT} group-hover:scale-110 transition-transform`}><Package size={18} /></div>
             <span className={`text-xs font-bold text-gray-400 uppercase group-hover:${BRAND_TEXT} transition-colors`}>Baked products</span>
           </div>
           <h3 className="text-3xl font-extrabold text-gray-900">100</h3>
           <p className="text-xs font-bold text-gray-400 mt-1">1 item ready</p>
        </div>

        {/* Card 3: Shop Stock -> Stock Shop */}
        <div 
          onClick={() => handleCardClick('stock_shop')}
          className={`bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group ${activeTab === 'stock_shop' ? 'ring-2 ring-[#5D4037] ring-offset-2' : ''}`}
        >
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform"><Store size={18} /></div>
             <span className="text-xs font-bold text-gray-400 uppercase group-hover:text-blue-600 transition-colors">Shop stock</span>
           </div>
           <h3 className="text-3xl font-extrabold text-gray-900">15</h3>
           <p className="text-xs font-bold text-gray-400 mt-1">2 items in shop</p>
        </div>

        {/* Card 4: Remaining Items -> Inventory Status */}
        <div 
          onClick={() => handleCardClick('inventory_status')}
          className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
        >
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform"><TrendingUp size={18} /></div>
             <span className="text-xs font-bold text-gray-400 uppercase group-hover:text-green-600 transition-colors">Remaining items</span>
           </div>
           <h3 className="text-3xl font-extrabold text-gray-900">150</h3>
           <p className="text-xs font-bold text-gray-400 mt-1">total inventory</p>
        </div>
      </div>

      {/* --- STATUS OVERVIEW PANELS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Bakery Status */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
           <h3 className={`text-lg font-bold ${BRAND_TEXT} flex items-center gap-2 mb-6`}>
             <ClipboardList size={20} /> Bakery status
           </h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50">
               <span className="text-sm font-bold text-gray-500">Raw material in (kg) :</span>
               <span className="text-lg font-extrabold text-gray-900">50 kg</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50">
               <span className="text-sm font-bold text-gray-500">Finished products :</span>
               <span className="text-lg font-extrabold text-gray-900">1 items</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50">
               <span className="text-sm font-bold text-gray-500">Product types :</span>
               <span className="text-lg font-extrabold text-gray-900">1 type</span>
             </div>
           </div>
        </div>

        {/* Stock Status */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
           <h3 className={`text-lg font-bold ${BRAND_TEXT} flex items-center gap-2 mb-6`}>
             <PieChart size={20} /> Stock status
           </h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50">
               <span className="text-sm font-bold text-gray-500">Total in shop</span>
               <span className="text-lg font-extrabold text-gray-900 bg-gray-200 px-3 py-1 rounded-lg text-sm">15 pieces</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50">
               <span className="text-sm font-bold text-gray-500">Low stock items</span>
               <span className="text-lg font-extrabold text-white bg-red-500 px-3 py-1 rounded-lg text-xs shadow-red-200 shadow-md">1 items</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-[#FAFAFA] rounded-2xl border border-gray-50">
               <span className="text-sm font-bold text-gray-500">Good stock items</span>
               <span className="text-lg font-extrabold text-gray-900 bg-gray-200 px-3 py-1 rounded-lg text-sm">1 items</span>
             </div>
           </div>
        </div>
      </div>

      {/* --- TABS (Ref Target) --- */}
      <div ref={contentRef} className={`p-1.5 rounded-2xl flex items-center gap-2 w-full md:w-auto overflow-x-auto ${LIGHT_BG} scroll-mt-6`}>
        {[
          { id: 'inventory_status', label: 'Inventory status' },
          { id: 'baking_details', label: 'Baking details' },
          { id: 'stock_shop', label: 'Stock shop' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize ${
              activeTab === tab.id 
              ? `bg-white ${BRAND_TEXT} shadow-sm transform scale-[1.02] ring-1 ring-gray-200` 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- CONTENT SECTIONS --- */}
      
      {/* 1. INVENTORY STATUS CONTENT */}
      {activeTab === 'inventory_status' && (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Inventory status Report</h2>
          <p className="text-gray-400 text-sm font-medium mb-8">Complete overview of raw material and finished products</p>
          
          <div className="space-y-10">
            {/* Damage Items Table */}
            <div>
              <h3 className="text-sm font-extrabold text-red-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                <AlertTriangle size={16} /> Damage Items
              </h3>
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase">
                      <th className="px-6 py-4">Items Name</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Added At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">Bread flour</td>
                      <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-xs">50</span></td>
                      <td className="px-6 py-4"><span className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-lg text-xs border border-red-100">Damage items</span></td>
                      <td className="px-6 py-4 text-right text-gray-500 text-sm font-medium">9-30-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Finished Products Table */}
            <div>
              <h3 className={`text-sm font-extrabold ${BRAND_TEXT} uppercase tracking-wide mb-4 flex items-center gap-2`}>
                <CheckCircle size={16} /> Finished products (Baked items)
              </h3>
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase">
                      <th className="px-6 py-4">Products Name</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Units</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Baked At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">Bread</td>
                      <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-xs">100</span></td>
                      <td className="px-6 py-4 text-gray-500 text-sm font-medium">Piece</td>
                      <td className="px-6 py-4"><span className={`bg-[#F5F3F0] ${BRAND_TEXT} font-bold px-3 py-1 rounded-lg text-xs border border-[#EBE8E4]`}>Baked products</span></td>
                      <td className="px-6 py-4 text-right text-gray-500 text-sm font-medium">9-30-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BAKING DETAILS CONTENT */}
      {activeTab === 'baking_details' && (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Baking details</h2>
          <p className="text-gray-400 text-sm font-medium mb-8">What is being prepared, Baked , and delivery</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Baker Activities */}
            <div className="p-6 rounded-3xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><div className={`w-2 h-6 ${BRAND_COLOR} rounded-full`}></div> Baker activities</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Ingredients measured :</span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-xs">50 kg</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">products taked :</span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-xs">100 pieces</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">products type :</span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-xs">1 type</span>
                 </div>
              </div>
            </div>

            {/* Store Keeper Activities */}
            <div className="p-6 rounded-3xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><div className="w-2 h-6 bg-gray-800 rounded-full"></div> Store keeper activities</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">items added</span>
                    <span className="font-bold text-white bg-black px-3 py-1 rounded-lg text-xs">0 pieces</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Products type</span>
                    <span className="font-bold text-white bg-black px-3 py-1 rounded-lg text-xs">0 types</span>
                 </div>
              </div>
            </div>
          </div>
          
          {/* All Baked Products Table */}
          <div className="mt-10">
             <h3 className="font-bold text-gray-900 mb-4">All Baked products</h3>
             <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase">
                      <th className="px-6 py-4">Products Name</th>
                      <th className="px-6 py-4 text-center">Quantity</th>
                      <th className="px-6 py-4 text-center">Units</th>
                      <th className="px-6 py-4 text-center">Added by</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">Bread</td>
                      <td className="px-6 py-4 text-center"><span className="bg-black text-white font-bold px-3 py-1 rounded-lg text-xs">100</span></td>
                      <td className="px-6 py-4 text-center text-gray-500 text-sm font-medium">pieces</td>
                      <td className="px-6 py-4 text-center text-gray-500 text-sm font-bold">Baker</td>
                      <td className="px-6 py-4 text-right text-gray-500 text-sm font-medium">9-30-2024</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {/* 3. STOCK SHOP CONTENT */}
      {activeTab === 'stock_shop' && (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Shop stock report</h2>
          <p className="text-gray-400 text-sm font-medium mb-8">Current shop inventory and stock levels</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
             {/* High Stock Box */}
             <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
                <h3 className="font-extrabold text-green-800 flex items-center gap-2 mb-4">
                  <CheckCircle size={18} /> High stock
                </h3>
                <span className="text-4xl font-extrabold text-green-600 block mb-2">1</span>
                <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Items above 10</span>
             </div>

             {/* Low Stock Box */}
             <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl">
                <h3 className="font-extrabold text-orange-800 flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} /> Low stock
                </h3>
                <span className="text-4xl font-extrabold text-orange-600 block mb-2">0</span>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Items less 10</span>
             </div>
          </div>

          {/* Detailed Stock Table */}
          <div>
             <h3 className="font-bold text-gray-900 mb-4">Detailed stock inventory</h3>
             <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase">
                      <th className="px-6 py-4">Products Name</th>
                      <th className="px-6 py-4 text-center">Quantity</th>
                      <th className="px-6 py-4 text-center">Units</th>
                      <th className="px-6 py-4 text-center">Added by</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">Bread</td>
                      <td className="px-6 py-4 text-center"><span className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-md shadow-red-200">3</span></td>
                      <td className="px-6 py-4 text-center text-gray-500 text-sm font-medium">pieces</td>
                      <td className="px-6 py-4 text-center text-gray-500 text-sm font-bold">Shop manager</td>
                      <td className="px-6 py-4 text-right text-gray-500 text-sm font-medium">9-30-2024</td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}