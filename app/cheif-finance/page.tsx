'use client';

import React, { useState } from 'react';
import { Banknote, TrendingUp, AlertTriangle, Printer } from 'lucide-react';

export default function ChiefFinanceDashboard() {
  
  // 1. STATE: Branch Selection
  const [selectedBranch, setSelectedBranch] = useState<'All' | 'Kabuga' | 'Masaka'>('All');

  // 2. MOCK DATA
  const allData = [
    { id: 1, item: 'White Bread', branch: 'Kabuga', baked: 200, received: 180, sold: 150, damaged: 5, stock: 25, price: 1000, cost: 600 },
    { id: 2, item: 'Vanilla Cake', branch: 'Kabuga', baked: 50, received: 45, sold: 40, damaged: 2, stock: 3, price: 5000, cost: 3000 },
    { id: 3, item: 'White Bread', branch: 'Masaka', baked: 150, received: 140, sold: 130, damaged: 0, stock: 10, price: 1000, cost: 600 },
    { id: 4, item: 'Donuts',      branch: 'Masaka', baked: 300, received: 280, sold: 250, damaged: 10, stock: 20, price: 500, cost: 200 },
  ];

  // 3. FINANCIAL CALCULATIONS
  const filteredData = selectedBranch === 'All' ? allData : allData.filter(d => d.branch === selectedBranch);
  
  const totalRevenue = filteredData.reduce((acc, curr) => acc + (curr.sold * curr.price), 0);
  const totalCost = filteredData.reduce((acc, curr) => acc + (curr.baked * curr.cost), 0);
  const totalLoss = filteredData.reduce((acc, curr) => acc + (curr.damaged * curr.cost), 0);
  const netProfit = totalRevenue - totalCost - totalLoss;

  // 4. CHART DATA
  const chartData = [
    { day: 'Mon', height: 45, amount: 450000 },
    { day: 'Tue', height: 30, amount: 300000 },
    { day: 'Wed', height: 60, amount: 600000 },
    { day: 'Thu', height: 50, amount: 500000 },
    { day: 'Fri', height: 85, amount: 850000 },
    { day: 'Sat', height: 70, amount: 700000 },
    { day: 'Sun', height: 95, amount: 950000 },
  ];

  // Formatting Helper (Custom "Frw" text)
  const formatMoney = (amount: number) => {
    return `${amount.toLocaleString()} Frw`; 
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-10 min-h-screen bg-[#FDFDFD]">
      
      {/* --- CONTROL BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-[#5D4037] tracking-tight">Financial Overview</h1>
          <p className="text-gray-500 text-sm font-medium">Track business growth and profitability.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center shadow-sm">
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
            className="bg-[#A67C37] hover:bg-[#8e6a2f] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#A67C37]/20 transition-all active:scale-95"
          >
            <Printer size={18} />
            <span className="hidden md:inline">Generate Report</span>
          </button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {/* Replaced DollarSign with Banknote */}
            <Banknote size={80} className="text-[#5D4037]" />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Revenue</p>
          <h2 className="text-3xl font-black text-[#5D4037] mt-2">{formatMoney(totalRevenue)}</h2>
          <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 w-fit px-2 py-1 rounded-lg">
            <TrendingUp size={14} /> +12.5% Growth
          </div>
        </div>

        {/* Losses */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle size={80} className="text-red-600" />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Financial Loss</p>
          <h2 className="text-3xl font-black text-red-500 mt-2">{formatMoney(totalLoss)}</h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">Cost of damaged goods</p>
        </div>

        {/* Profit */}
        <div className="bg-[#5D4037] p-6 rounded-3xl shadow-lg shadow-[#5D4037]/30 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={80} className="text-white" />
          </div>
          <p className="text-[#EBE0CC] text-xs font-bold uppercase tracking-widest">Net Profit Estimate</p>
          <h2 className="text-4xl font-black mt-2">{formatMoney(netProfit)}</h2>
          <p className="text-xs text-[#EBE0CC]/80 mt-2 font-medium">Revenue - (Costs + Losses)</p>
        </div>
      </div>

      {/* --- BUSINESS GROWTH CHART --- */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-80 flex flex-col">
         
         {/* Chart Header */}
         <div className="flex items-center justify-between mb-6">
           <div>
             <h3 className="text-lg font-bold text-[#5D4037]">Business Growth (Revenue)</h3>
             <p className="text-xs text-gray-400">Daily performance over the last 7 days</p>
           </div>
           <div className="text-xs font-bold bg-[#5D4037]/10 text-[#5D4037] px-3 py-1 rounded-full">
             +24% vs last week
           </div>
         </div>
         
         {/* The Bar Chart */}
         <div className="flex-1 flex items-end justify-between gap-3 md:gap-6 pb-2">
            {chartData.map((data, index) => (
              <div key={index} className="w-full flex flex-col items-center group relative h-full justify-end">
                
                {/* Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#5D4037] text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-xl mb-2 whitespace-nowrap z-10">
                  {formatMoney(data.amount)}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#5D4037] rotate-45"></div>
                </div>

                {/* The Bar */}
                <div 
                  style={{ height: `${data.height}%` }} 
                  className={`w-full max-w-[50px] rounded-t-xl transition-all duration-500 ease-out relative overflow-hidden ${
                    data.day === 'Sun' ? 'bg-[#5D4037]' : 'bg-[#EBE0CC]'
                  } group-hover:bg-[#A67C37]`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                </div>

                {/* Day Label */}
                <span className={`text-[10px] font-bold mt-3 ${
                  data.day === 'Sun' ? 'text-[#5D4037]' : 'text-gray-400'
                }`}>
                  {data.day}
                </span>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}