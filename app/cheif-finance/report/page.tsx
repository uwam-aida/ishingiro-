'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Package, 
  Printer, 
  Search, 
  ArrowLeft,
  AlertTriangle,
  MapPin
} from 'lucide-react';

export default function MeasuredProductsReport() {

  // 1. STATE: Branch Selection
  const [selectedBranch, setSelectedBranch] = useState<'All' | 'Kabuga' | 'Masaka'>('All');

  // 2. MOCK DATA: Now includes 'branch'
  const productData = [
    // --- KABUGA DATA ---
    { id: 1, branch: 'Kabuga', name: 'White Bread', unit: 'Piece', price: 1000, sold: 500, damaged: 10 },
    { id: 2, branch: 'Kabuga', name: 'Brown Bread', unit: 'Piece', price: 1200, sold: 300, damaged: 5 },
    { id: 3, branch: 'Kabuga', name: 'Tea Scones',  unit: 'Kg',    price: 3000, sold: 50,  damaged: 2 },
    
    // --- MASAKA DATA ---
    { id: 4, branch: 'Masaka', name: 'White Bread', unit: 'Piece', price: 1000, sold: 450, damaged: 8 },
    { id: 5, branch: 'Masaka', name: 'Cakes',       unit: 'Piece', price: 5000, sold: 20,  damaged: 1 },
    { id: 6, branch: 'Masaka', name: 'Donuts',      unit: 'Piece', price: 500,  sold: 400, damaged: 15 },
  ];

  // 3. FILTER DATA
  const filteredData = selectedBranch === 'All' 
    ? productData 
    : productData.filter(item => item.branch === selectedBranch);

  // 4. CALCULATIONS (Based on filtered data)
  const totalRevenue = filteredData.reduce((acc, curr) => acc + (curr.sold * curr.price), 0);
  const totalLoss = filteredData.reduce((acc, curr) => acc + (curr.damaged * curr.price), 0);

  // Formatting Helper
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-6 md:space-y-8 pb-10">
      
      {/* --- TOP NAVIGATION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <Link 
          href="/cheif-finance" 
          className="w-fit flex items-center gap-2 text-gray-500 hover:text-[#5D4037] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Branch Switcher (Desktop) */}
        <div className="hidden md:flex bg-white border border-gray-200 p-1 rounded-xl items-center shadow-sm">
           {['All', 'Kabuga', 'Masaka'].map((branch) => (
             <button
               key={branch}
               onClick={() => setSelectedBranch(branch as any)}
               className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                 selectedBranch === branch 
                 ? 'bg-[#5D4037] text-white shadow-md' 
                 : 'text-gray-400 hover:text-[#5D4037]'
               }`}
             >
               {branch}
             </button>
           ))}
        </div>

        <button 
          onClick={handlePrint}
          className="hidden md:flex bg-[#5D4037] text-white px-6 py-2.5 rounded-xl font-bold items-center gap-2 hover:bg-[#4a332a] transition-colors shadow-lg shadow-[#5D4037]/20"
        >
          <Printer size={18} /> Print Report
        </button>
      </div>

      {/* --- MOBILE BRANCH SWITCHER --- */}
      <div className="md:hidden flex bg-white border border-gray-200 p-1 rounded-xl items-center shadow-sm justify-between">
         {['All', 'Kabuga', 'Masaka'].map((branch) => (
           <button
             key={branch}
             onClick={() => setSelectedBranch(branch as any)}
             className={`flex-1 px-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all text-center ${
               selectedBranch === branch 
               ? 'bg-[#5D4037] text-white shadow-md' 
               : 'text-gray-400'
             }`}
           >
             {branch}
           </button>
         ))}
      </div>

      {/* --- TITLE SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-[#A67C37] mb-1">
             <Scale size={20} />
             <span className="text-xs font-bold uppercase tracking-widest">Financial Report</span>
           </div>
           <h1 className="text-2xl md:text-3xl font-extrabold text-[#5D4037]">
             {selectedBranch === 'All' ? 'Combined' : selectedBranch} Sales Report
           </h1>
           <p className="text-gray-500 text-sm mt-1">Revenue and damages for {selectedBranch} branch.</p>
        </div>
        
        {/* Mobile Print Button */}
        <button 
          onClick={handlePrint}
          className="md:hidden w-full bg-[#5D4037] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Printer size={18} /> Print Report
        </button>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
             <Package size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-xs font-bold uppercase">Revenue ({selectedBranch})</p>
             <h3 className="text-2xl font-black text-[#5D4037]">{formatMoney(totalRevenue)}</h3>
           </div>
        </div>

        {/* Total Damages */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
             <AlertTriangle size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-xs font-bold uppercase">Losses ({selectedBranch})</p>
             <h3 className="text-2xl font-black text-red-600">{formatMoney(totalLoss)}</h3>
           </div>
        </div>
      </div>

      {/* --- MAIN TABLE --- */}
      <div className="bg-white rounded-[32px] shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h3 className="font-bold text-[#5D4037] text-lg">Product Details</h3>
           <div className="relative print:hidden w-full md:w-auto">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search product..." 
               className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A67C37]/50"
             />
           </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#5D4037] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4 text-right">Sold Qty</th>
                <th className="px-6 py-4 text-right text-red-100 bg-red-500/10">Damaged (Loss)</th>
                <th className="px-6 py-4 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors text-sm text-[#5D4037] font-medium">
                  
                  {/* Name */}
                  <td className="px-6 py-4 font-bold text-base">
                    {item.name}
                  </td>

                  {/* Branch */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded-full">
                       <MapPin size={10} /> {item.branch}
                    </span>
                  </td>

                  {/* Unit Price */}
                  <td className="px-6 py-4 text-gray-500">
                    {formatMoney(item.price)} <span className="text-xs">/ {item.unit}</span>
                  </td>
                  
                  {/* Sold Qty */}
                  <td className="px-6 py-4 text-right font-bold">
                    {item.sold} <span className="text-xs text-gray-400 font-normal">{item.unit}</span>
                  </td>
                  
                  {/* Damaged & Loss Value */}
                  <td className="px-6 py-4 text-right bg-red-50">
                     <div className="font-bold text-red-600">{item.damaged} {item.unit}</div>
                     <div className="text-[10px] text-red-400 opacity-80">
                       Loss: {formatMoney(item.damaged * item.price)}
                     </div>
                  </td>

                  {/* Total Revenue */}
                  <td className="px-6 py-4 text-right font-black text-[#5D4037] text-base">
                    {formatMoney(item.sold * item.price)}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-6 bg-[#FDFDFD] border-t border-gray-100 text-xs text-gray-400">
           <p><strong>Note:</strong> Showing data for <strong>{selectedBranch}</strong>. Revenue is calculated based on sold quantity.</p>
        </div>
      </div>

    </div>
  );
}