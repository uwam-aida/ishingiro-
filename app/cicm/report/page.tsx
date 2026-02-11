'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Calendar, 
  AlertCircle, 
  Store, 
  MapPin, 
  Users,
  TrendingUp 
} from 'lucide-react';

export default function CICMReportPage() {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  
  // --- MOCK DATA ---
  const reportData = [
    { name: 'White Bread', 
      kabuga: { baked: 500, delivered: 490, shopRest: 20, storeRest: 10, damaged: 5, sold: 455 },
      masaka: { baked: 300, delivered: 295, shopRest: 15, storeRest: 5, damaged: 2, sold: 273 }
    },
    { name: 'Tea Scones', 
      kabuga: { baked: 200, delivered: 200, shopRest: 10, storeRest: 5, damaged: 0, sold: 185 },
      masaka: { baked: 150, delivered: 148, shopRest: 8, storeRest: 2, damaged: 1, sold: 137 }
    }
  ];

  const othersData = [
    { category: 'Guests', item: 'Special Bread', qty: 5 },
    { category: 'Clients', item: 'Bulk Donuts', qty: 50 },
    { category: 'Events', item: 'Wedding Cake', qty: 1 },
    { category: 'Tiku', item: 'Kabuga Donuts', qty: 100 }, 
  ];

  // --- RENDER TABLE HELPER ---
  const BranchTable = ({ branch, title }: { branch: 'kabuga' | 'masaka', title: string }) => (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-8 break-inside-avoid">
      <div className="bg-[#5D4037] px-6 py-4 flex justify-between items-center text-white">
        <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
          <MapPin size={20} /> {title}
        </h2>
        <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold">
          {new Date(reportDate).toLocaleDateString()}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-[#5D4037] font-bold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border-b">Product</th>
              <th className="px-4 py-3 border-b text-right bg-blue-50/50">Baked</th>
              <th className="px-4 py-3 border-b text-right">Delivered</th>
              <th className="px-4 py-3 border-b text-right text-orange-600 bg-orange-50/30">Shop Rest</th>
              <th className="px-4 py-3 border-b text-right text-purple-600 bg-purple-50/30">Store Rest</th>
              <th className="px-4 py-3 border-b text-right text-red-600 bg-red-50/30">Damaged</th>
              <th className="px-4 py-3 border-b text-right font-black bg-gray-100/50">Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reportData.map((item) => (
              <tr key={item.name} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 font-bold text-[#5D4037]">{item.name}</td>
                <td className="px-4 py-2 text-right bg-blue-50/20">{item[branch].baked}</td>
                <td className="px-4 py-2 text-right">{item[branch].delivered}</td>
                <td className="px-4 py-2 text-right text-orange-600 bg-orange-50/10 font-medium">{item[branch].shopRest}</td>
                <td className="px-4 py-2 text-right text-purple-600 bg-purple-50/10 font-medium">{item[branch].storeRest}</td>
                <td className="px-4 py-2 text-right text-red-600 bg-red-50/10 font-bold">{item[branch].damaged}</td>
                <td className="px-4 py-2 text-right font-black bg-gray-100/30">{item[branch].sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 print:p-0">
      
      {/* --- MOBILE LOGO HEADER --- */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 pt-2 print:hidden">
        <div className="w-16 h-16 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-[#5D4037]">Inventory & Stock Report</h1>
          <p className="text-gray-500 text-sm">Separated branch analysis and Store-Keeper distribution.</p>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <input 
              type="date" 
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="text-sm font-bold text-[#5D4037] outline-none"
            />
          </div>
          <button 
            onClick={() => window.print()}
            className="bg-[#5D4037] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#4a332a] transition-colors"
          >
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* --- CONTENT --- */}
      
      {/* 1. KABUGA TABLE */}
      <BranchTable branch="kabuga" title="Kabuga Branch" />

      {/* 2. OTHERS TABLE (Kabuga Only / Store-Keeper) */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-8 break-inside-avoid">
        <div className="bg-orange-600 px-6 py-4 flex justify-between items-center text-white font-bold">
          <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <Users size={20} /> Others (Store-Keeper / Kabuga Only)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-orange-50 text-orange-800 font-bold uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border-b">Category</th>
                <th className="px-4 py-3 border-b">Item</th>
                <th className="px-4 py-3 border-b text-right">Quantity</th>
                <th className="px-4 py-3 border-b text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {othersData.map((row, i) => (
                <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-orange-700">{row.category}</td>
                  <td className="px-4 py-3 text-gray-700">{row.item}</td>
                  <td className="px-4 py-3 text-right font-black text-gray-900">{row.qty} pcs</td>
                  <td className="px-4 py-3 text-right text-gray-400 italic">Store Keeper</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MASAKA TABLE */}
      <div className="print:break-before-page"></div>
      <BranchTable branch="masaka" title="Masaka Branch" />

      {/* --- SUMMARY --- */}
      <div className="bg-[#EBE0CC] p-6 rounded-2xl print:break-inside-avoid">
        <h3 className="text-[#5D4037] font-black uppercase tracking-widest text-sm mb-4 border-b border-[#5D4037]/20 pb-2 flex items-center gap-2">
          <TrendingUp size={16} className="text-[#5D4037]"/> Consolidated Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-[#5D4037]/70 font-bold uppercase">Total Baked</p>
            <p className="text-2xl font-black text-[#5D4037]">800 pcs</p>
          </div>
          <div>
            <p className="text-xs text-red-600 font-bold uppercase">Total Damaged</p>
            <p className="text-2xl font-black text-red-600">7 pcs</p>
          </div>
          <div>
            <p className="text-xs text-[#5D4037]/70 font-bold uppercase">Consolidated Sold</p>
            <p className="text-2xl font-black text-[#5D4037]">728 pcs</p>
          </div>
        </div>
      </div>
    </div>
  );
}