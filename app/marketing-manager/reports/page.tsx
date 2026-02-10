'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Printer, Calendar, ArrowDownCircle, AlertCircle } from 'lucide-react';

export default function MarketingReportsPage() {
  
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);

  // 1. LOAD PRODUCTS & GENERATE MOCK DATA
  useEffect(() => {
    // Load the pricing list you set in the Admin page
    const saved = localStorage.getItem('sellingPrices_FINAL_FIX');
    
    let loadedProducts = [];
    if (saved) {
      try {
        loadedProducts = JSON.parse(saved);
      } catch (e) { console.error("Error loading prices", e); }
    }

    setProducts(loadedProducts);

    // --- GENERATE MOCK DATA FOR DISPLAY ---
    // In a real app, this would come from your database (Production/Shop/Store APIs)
    const mockData = loadedProducts.map(product => {
      // Simulate realistic numbers for Kabuga
      const k_baked = Math.floor(Math.random() * 200) + 50; 
      const k_delivered = k_baked - Math.floor(Math.random() * 10);
      const k_shopRest = Math.floor(Math.random() * 20);
      const k_storeRest = Math.floor(Math.random() * 10);
      const k_damaged = Math.floor(Math.random() * 5);
      const k_sold = k_delivered - k_shopRest - k_storeRest - k_damaged;
      
      // Simulate realistic numbers for Masaka
      const m_baked = Math.floor(Math.random() * 200) + 50; 
      const m_delivered = m_baked - Math.floor(Math.random() * 10);
      const m_shopRest = Math.floor(Math.random() * 20);
      const m_storeRest = Math.floor(Math.random() * 10);
      const m_damaged = Math.floor(Math.random() * 5);
      const m_sold = m_delivered - m_shopRest - m_storeRest - m_damaged;

      return {
        ...product,
        kabuga: {
          baked: k_baked,
          delivered: k_delivered,
          shopRest: k_shopRest,
          storeRest: k_storeRest,
          damaged: k_damaged,
          sold: k_sold > 0 ? k_sold : 0,
          revenue: (k_sold > 0 ? k_sold : 0) * product.price
        },
        masaka: {
          baked: m_baked,
          delivered: m_delivered,
          shopRest: m_shopRest,
          storeRest: m_storeRest,
          damaged: m_damaged,
          sold: m_sold > 0 ? m_sold : 0,
          revenue: (m_sold > 0 ? m_sold : 0) * product.price
        }
      };
    });

    setReportData(mockData);

  }, []);

  // --- CALCULATE TOTALS ---
  const calculateTotals = (branch: 'kabuga' | 'masaka') => {
    return reportData.reduce((acc, item) => {
      return {
        baked: acc.baked + item[branch].baked,
        delivered: acc.delivered + item[branch].delivered,
        shopRest: acc.shopRest + item[branch].shopRest,
        storeRest: acc.storeRest + item[branch].storeRest,
        damaged: acc.damaged + item[branch].damaged,
        sold: acc.sold + item[branch].sold,
        revenue: acc.revenue + item[branch].revenue,
      };
    }, { baked: 0, delivered: 0, shopRest: 0, storeRest: 0, damaged: 0, sold: 0, revenue: 0 });
  };

  const kabugaTotals = calculateTotals('kabuga');
  const masakaTotals = calculateTotals('masaka');

  // --- RENDER TABLE HELPER ---
  const BranchTable = ({ branch, title, totals }: { branch: 'kabuga' | 'masaka', title: string, totals: any }) => (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-8 break-inside-avoid">
      <div className="bg-[#5D4037] px-6 py-4 flex justify-between items-center text-white">
        <h2 className="text-lg font-black uppercase tracking-widest">{title}</h2>
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
              <th className="px-4 py-3 border-b text-right font-black text-[#5D4037]">Revenue</th>
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
                <td className="px-4 py-2 text-right font-black text-[#5D4037]">{item[branch].revenue.toLocaleString()}</td>
              </tr>
            ))}
            
            {/* TOTALS ROW */}
            <tr className="bg-[#5D4037]/10 font-black text-[#5D4037]">
              <td className="px-4 py-3">TOTALS</td>
              <td className="px-4 py-3 text-right">{totals.baked.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{totals.delivered.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{totals.shopRest.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{totals.storeRest.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-red-600">{totals.damaged.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{totals.sold.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-lg">{totals.revenue.toLocaleString()} RWF</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 print:p-0">
      
      {/* --- HEADER (Hidden when printing) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-[#5D4037]">Consolidated Report</h1>
          <p className="text-gray-500 text-sm">
            Daily breakdown of Baking, Delivery, Stocks, and Damages.
          </p>
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
            <Printer size={16} /> Generate Report
          </button>
        </div>
      </div>

      {/* --- PRINT HEADER (Only visible when printing) --- */}
      <div className="hidden print:block mb-8 text-center border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-black text-[#5D4037] uppercase">ISHINGIRO - Daily Report</h1>
        <p className="text-gray-500">Date: {reportDate}</p>
      </div>

      {/* --- CONTENT --- */}
      {reportData.length === 0 ? (
        <div className="p-10 text-center text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
          <AlertCircle className="mx-auto mb-2 opacity-50" />
          <p>No product data found. Please add products in the Pricing page first.</p>
        </div>
      ) : (
        <>
          {/* KABUGA BRANCH */}
          <BranchTable 
            branch="kabuga" 
            title="Kabuga Branch Report" 
            totals={kabugaTotals} 
          />

          {/* PAGE BREAK FOR PRINTING */}
          <div className="print:break-before-page"></div>

          {/* MASAKA BRANCH */}
          <BranchTable 
            branch="masaka" 
            title="Masaka Branch Report" 
            totals={masakaTotals} 
          />
          
          {/* GRAND TOTAL SUMMARY CARD */}
          <div className="bg-[#EBE0CC] p-6 rounded-2xl print:break-inside-avoid">
             <h3 className="text-[#5D4037] font-black uppercase tracking-widest text-sm mb-4 border-b border-[#5D4037]/20 pb-2">
               Company Wide Summary
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                   <p className="text-xs text-[#5D4037]/70 font-bold uppercase">Total Baked</p>
                   <p className="text-2xl font-black text-[#5D4037]">{ (kabugaTotals.baked + masakaTotals.baked).toLocaleString() }</p>
                </div>
                <div>
                   <p className="text-xs text-red-600/70 font-bold uppercase">Total Damages</p>
                   <p className="text-2xl font-black text-red-600">{ (kabugaTotals.damaged + masakaTotals.damaged).toLocaleString() }</p>
                </div>
                <div>
                   <p className="text-xs text-[#5D4037]/70 font-bold uppercase">Total Sold</p>
                   <p className="text-2xl font-black text-[#5D4037]">{ (kabugaTotals.sold + masakaTotals.sold).toLocaleString() }</p>
                </div>
                <div>
                   <p className="text-xs text-[#5D4037]/70 font-bold uppercase">Total Revenue</p>
                   <p className="text-2xl font-black text-[#5D4037]">{ (kabugaTotals.revenue + masakaTotals.revenue).toLocaleString() } RWF</p>
                </div>
             </div>
          </div>
        </>
      )}

    </div>
  );
}