'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, Package, TrendingUp } from 'lucide-react';

export default function FinanceDashboard() {
  
  // Stats Data
  const stats = [
    { 
      label: 'Measured items (kg)', 
      value: '50', 
      sub: 'Total kg measured', 
      icon: Scale,
      bg: 'bg-white',
      border: 'border-gray-100',
      text: 'text-gray-900',
      href: '/cheif-finance/products?tab=measured' // Corrected Link
    },
    { 
      label: 'Baked items', 
      value: '100', 
      sub: 'Total pieces baked', 
      icon: Package,
      bg: 'bg-white',
      border: 'border-gray-100',
      text: 'text-gray-900',
      href: '/cheif-finance/products?tab=baked_products' // Corrected Link
    },
  ];

  // Summary Data
  const summary = [
    { label: 'Raw material used', value: '50 Kg' },
    { label: 'Products baked', value: '100 pieces' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Chief of Finance</h1>
        <p className="text-gray-500 mt-2 font-medium">Monitor production costs and output metrics.</p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.href} className="block group">
            <div className={`p-8 rounded-[32px] shadow-sm border ${stat.border} ${stat.bg} flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}>
               <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
                 <stat.icon size={24} strokeWidth={2} />
               </div>
               <h3 className={`font-bold text-sm uppercase tracking-wide ${stat.text}`}>{stat.label}</h3>
               <p className={`text-5xl font-extrabold mt-4 ${stat.text}`}>{stat.value}</p>
               <p className="text-xs font-bold mt-3 text-gray-400 capitalize">{stat.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* --- PRODUCTION SUMMARY --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
             <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Production Summary</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Basic production metrics</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {summary.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-100 transition-colors">
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">{item.label}</span>
              <span className="text-xl font-extrabold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}