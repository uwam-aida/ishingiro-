'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Package, ArrowRightLeft, Search } from 'lucide-react';

export default function CICMDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. Stats Data (Cards at the top)
  const stats = [
    { 
      label: 'Damage items', 
      value: '1', 
      sub: 'In production', 
      icon: AlertTriangle,
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-600',
      subText: 'text-red-400',
      iconColor: 'text-red-600',
      href: '/cicm/products?tab=damage_items'
    },
    { 
      label: 'Baked items', 
      value: '1', 
      sub: 'Completed', 
      icon: Package,
      bg: 'bg-white',
      border: 'border-gray-100',
      text: 'text-gray-900',
      subText: 'text-gray-400',
      iconColor: 'text-gray-900',
      href: '/cicm/products?tab=baked_products'
    },
    { 
      label: 'shop transfers', 
      value: '3', 
      sub: 'From baker to shop', 
      icon: ArrowRightLeft,
      bg: 'bg-white',
      border: 'border-gray-100',
      text: 'text-gray-900',
      subText: 'text-gray-400',
      iconColor: 'text-gray-900',
      href: '/cicm/products?tab=shop_stock'
    },
  ];

  // 2. Bakery Work Progress Data
  // This tracks the full lifecycle: Raw -> Baked -> Ready to Sell (In Shop)
  const workProgress = [
    { stage: 'Measured (kg)', count: '1', quantity: '50 Kg', status: 'preparing' },
    { stage: 'Baked', count: '1', quantity: '100 pieces', status: 'processing' },
    { stage: 'In shop', count: '2', quantity: '15 pieces', status: 'ready_to_sell' }, // This tracks items ready for sale
  ];

  // 3. Filter Logic (Search functionality)
  const filteredProgress = workProgress.filter(row => 
    row.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1 font-medium">Overview of internal controls and production status</p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.href} className="block group">
            <div className={`p-8 rounded-[32px] shadow-sm border ${stat.border} ${stat.bg} flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
               <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm ${
                 stat.label === 'Damage items' ? 'bg-white' : 'bg-gray-50'
               } ${stat.iconColor}`}>
                 <stat.icon size={24} strokeWidth={2} />
               </div>
               <h3 className={`font-bold text-sm uppercase tracking-wide ${stat.text}`}>{stat.label}</h3>
               <p className={`text-5xl font-extrabold mt-4 ${stat.text}`}>{stat.value}</p>
               <p className={`text-xs font-bold mt-3 capitalize ${stat.subText}`}>{stat.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* --- BAKERY WORK PROGRESS SECTION --- */}
      <div className="space-y-6">
        
        {/* Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bakery work progress</h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">Track what is being prepared, baked, and ready to sell</p>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full md:w-72">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search className="text-gray-400 group-focus-within:text-black transition-colors" size={18} />
             </div>
             <input 
               type="text" 
               placeholder="Search progress..." 
               className="w-full bg-white border border-gray-200 text-gray-900 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all font-medium text-sm placeholder:text-gray-400"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
        
        {/* Progress Table */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400 text-xs font-extrabold uppercase tracking-wider">
                <th className="px-8 py-6">Stage</th>
                <th className="px-8 py-6 text-center">Count</th>
                <th className="px-8 py-6 text-right">Volume / Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProgress.map((row, i) => (
                <tr key={i} className="group hover:bg-gray-50/80 transition-colors duration-200">
                  
                  {/* Stage Name */}
                  <td className="px-8 py-6 font-bold text-gray-900 text-sm capitalize flex items-center gap-3">
                    {/* Visual Status Indicator */}
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      row.status === 'ready_to_sell' ? 'bg-green-500 shadow-green-200 shadow-sm' : 
                      row.status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></span>
                    {row.stage}
                  </td>

                  {/* Count Pill */}
                  <td className="px-8 py-6 text-center text-gray-900 font-bold text-sm">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg border border-gray-200">
                      {row.count}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="px-8 py-6 text-right text-gray-900 text-sm font-bold">
                    {row.quantity}
                  </td>
                </tr>
              ))}
              
              {/* Empty State */}
              {filteredProgress.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-10 text-center text-gray-400 text-sm font-medium">
                    No progress found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}