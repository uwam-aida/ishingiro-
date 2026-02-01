'use client';

import React, { useState } from 'react';
import { 
  Factory, 
  Store, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCcw // Reset icon
} from 'lucide-react';

export default function MarketingDashboard() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'production' | 'stock' | 'damaged' | 'growth'>('all');

  // 1. Stats Data
  const stats = [
    { 
      id: 'production',
      label: 'Production', 
      value: '2', 
      sub: 'Total items', 
      icon: Factory, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      id: 'stock',
      label: 'Shop Stock', 
      value: '2', 
      sub: 'Available', 
      icon: Store, 
      color: 'text-gray-900', 
      bg: 'bg-white border border-gray-200' 
    },
    { 
      id: 'damaged',
      label: 'Damaged', 
      value: '1', 
      sub: 'Total loss', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
    { 
      id: 'growth',
      label: 'Growth', 
      value: '20%', 
      sub: 'This week', 
      icon: TrendingUp, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
  ];

  // 2. Market Data
  const marketData = [
    { id: 1, product: 'Bread', production: '1', stock: '1', performance: 'Normal', status: 'stock' },
    { id: 2, product: 'Birthday Cake', production: '0', stock: '1', performance: 'High demand', status: 'growth' },
    { id: 3, product: 'Biscuits', production: '50', stock: '20', performance: 'Low demand', status: 'stock' },
    { id: 4, product: 'Burnt Bread', production: '0', stock: '0', performance: 'Damaged', status: 'damaged' },
    { id: 5, product: 'Dough', production: '20', stock: '0', performance: 'In Production', status: 'production' },
  ];

  // 3. Filter Logic
  const filteredData = activeFilter === 'all' 
    ? marketData 
    : marketData.filter(item => item.status === activeFilter || (activeFilter === 'growth' && item.performance === 'High demand'));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marketing Manager</h1>
          <p className="text-gray-500 mt-2 font-medium">Analyze market trends and product performance.</p>
        </div>
        {activeFilter !== 'all' && (
          <button 
            onClick={() => setActiveFilter('all')}
            className="text-sm font-bold text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <RefreshCcw size={14} /> Reset View
          </button>
        )}
      </div>

      {/* --- INTERACTIVE STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => setActiveFilter(stat.id as any)}
            className={`p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group cursor-pointer transition-all duration-300 ${
              activeFilter === stat.id 
              ? 'bg-gray-900 text-white transform -translate-y-1 shadow-md' 
              : `${stat.bg} ${stat.color} hover:shadow-md hover:-translate-y-1`
            } ${activeFilter !== 'all' && activeFilter !== stat.id ? 'opacity-50 grayscale' : 'opacity-100'}`}
          >
             <div className="flex justify-between items-start">
               <div>
                 <p className={`text-xs font-bold uppercase tracking-wide ${activeFilter === stat.id ? 'opacity-70' : 'opacity-70'}`}>{stat.label}</p>
                 <h3 className="text-3xl font-extrabold mt-1">{stat.value}</h3>
               </div>
               <stat.icon size={20} className="opacity-80" />
             </div>
             <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* --- "WHAT CUSTOMERS LIKE" SECTION --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[400px]">
        <div className="mb-8">
           <h2 className="text-xl font-bold text-gray-900">What customers like</h2>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">
             {activeFilter === 'all' ? 'Which products are selling best' : `Filtered by: ${activeFilter}`}
           </p>
        </div>

        {/* --- TABLE --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                <th className="pb-4 pl-4">Products</th>
                <th className="pb-4">Production</th>
                <th className="pb-4">Shop Stock</th>
                <th className="pb-4 text-right pr-4">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors animate-in slide-in-from-bottom-2 duration-300">
                    <td className="py-5 pl-4 font-bold text-gray-900">{item.product}</td>
                    <td className="py-5 font-medium text-gray-500">{item.production}</td>
                    <td className="py-5 font-medium text-gray-500">{item.stock}</td>
                    <td className="py-5 text-right pr-4">
                      <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm ${
                        item.performance === 'High demand' ? 'bg-black text-white' : 
                        item.performance === 'Low demand' ? 'bg-red-50 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.performance}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={4} className="py-12 text-center text-gray-400">
                     <p className="text-sm font-medium">No products match this category.</p>
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