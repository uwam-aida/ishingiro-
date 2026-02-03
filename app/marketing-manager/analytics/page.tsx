'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Layers, 
  ShoppingCart, 
  ArrowUpRight, 
  Minus,
  RefreshCcw 
} from 'lucide-react';

export default function MarketingAnalyticsPage() {
  // State for interactivity
  const [activeFilter, setActiveFilter] = useState<'all' | 'growth' | 'production' | 'stock' | 'orders'>('all');

  // 1. Top Cards Data (Restored to 4 Items)
  const stats = [
    { 
      id: 'growth',
      label: 'Weekly Growth', 
      value: '+15%', // Quantity/Volume based
      sub: 'Volume increase', 
      icon: TrendingUp, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      id: 'production',
      label: 'Products in production', 
      value: '2', 
      sub: 'Active products', 
      icon: Package, 
      color: 'text-gray-900', 
      bg: 'bg-gray-50' 
    },
    { 
      id: 'stock',
      label: 'Shop Stock Level', 
      value: '125', 
      sub: 'Items available', 
      icon: Layers, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      id: 'orders',
      label: 'Pending Orders', 
      value: '3', 
      sub: 'Orders to fill', 
      icon: ShoppingCart, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  // 2. Performance Data
  const allPerformance = [
    { id: 1, product: 'Bread', sold: 150, stock: '10', popularity: 80, trend: 'Increasing', rec: 'Increase production', category: 'production' },
    { id: 2, product: 'Birthday Cake', sold: 1, stock: '1', popularity: 70, trend: 'Stable', rec: 'Maintain current level', category: 'orders' },
    { id: 3, product: 'Biscuits', sold: 50, stock: '20', popularity: 40, trend: 'Decreasing', rec: 'Reduce stock', category: 'stock' },
    { id: 4, product: 'New Pastry', sold: 200, stock: '5', popularity: 90, trend: 'Increasing', rec: 'High Priority', category: 'growth' },
  ];

  // 3. Activity Log Data
  const allActivities = [
    { id: 1, user: 'Baker assistant', action: 'Added measured ingredients', item: 'Bread flour', qty: '50', time: '9-30-2025', category: 'production' },
    { id: 2, user: 'Baker assistant', action: 'Baked products', item: 'Bread', qty: '100', time: '9-30-2025', category: 'production' },
    { id: 3, user: 'Shop manager', action: 'Created order', item: 'Bread Order', qty: '50', time: '9-30-2025', category: 'orders' },
    { id: 4, user: 'Shop manager', action: 'Created order', item: 'Birthday cake', qty: '1', time: '9-30-2025', category: 'orders' },
    { id: 5, user: 'Shop manager', action: 'Stock update', item: 'Biscuits', qty: '15', time: '9-30-2025', category: 'stock' },
  ];

  // --- FILTER LOGIC ---
  const filteredPerformance = activeFilter === 'all' 
    ? allPerformance 
    : allPerformance.filter(item => item.category === activeFilter || (activeFilter === 'production' && item.trend === 'Increasing'));

  const filteredActivities = activeFilter === 'all'
    ? allActivities
    : allActivities.filter(item => item.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Business Analytics</h1>
          <p className="text-gray-500 mt-2 font-medium">Track production volume and inventory movement.</p>
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

      {/* --- INTERACTIVE STATS GRID (4 COLUMNS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => setActiveFilter(stat.id as any)}
            className={`p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-32 cursor-pointer transition-all duration-300 border ${
              activeFilter === stat.id 
              ? 'bg-gray-900 text-white border-gray-900 ring-2 ring-offset-2 ring-gray-100 transform -translate-y-1 shadow-lg' 
              : `bg-white border-gray-100 hover:border-gray-200 hover:-translate-y-1 hover:shadow-md`
            } ${activeFilter !== 'all' && activeFilter !== stat.id ? 'opacity-50 grayscale' : 'opacity-100'}`}
          >
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${
                  activeFilter === stat.id ? 'bg-gray-800 text-white' : `${stat.bg} ${stat.color}`
                }`}>
                   <stat.icon size={20} />
                </div>
             </div>
             <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${activeFilter === stat.id ? 'text-gray-400' : 'text-gray-400'}`}>{stat.label}</p>
                <h3 className={`text-xl font-extrabold mt-1 ${activeFilter === stat.id ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </h3>
                <p className={`text-[10px] font-bold uppercase mt-1 ${activeFilter === stat.id ? 'text-gray-500' : 'text-gray-400'}`}>{stat.sub}</p>
             </div>
          </div>
        ))}
      </div>

      {/* --- PRODUCTS PERFORMANCE TABLE --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[300px]">
         <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Products performance</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">
              {activeFilter === 'all' ? 'Volume analysis: Sales vs Current Stock' : `Filtered by: ${activeFilter}`}
            </p>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                     <th className="pb-4 pl-4">Products</th>
                     <th className="pb-4">Total Sold (Qty)</th>
                     <th className="pb-4">Current Stock (Qty)</th>
                     <th className="pb-4 w-1/4">Popularity</th>
                     <th className="pb-4">Trend</th>
                     <th className="pb-4 text-right pr-4">Recommendation</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredPerformance.length > 0 ? (
                    filteredPerformance.map((row) => (
                       <tr key={row.id} className="group hover:bg-gray-50 transition-colors animate-in slide-in-from-bottom-2 duration-300">
                          <td className="py-5 pl-4 font-bold text-gray-900 text-sm">{row.product}</td>
                          <td className="py-5 font-bold text-gray-900">{row.sold}</td>
                          <td className="py-5 font-medium text-gray-500">{row.stock}</td>
                          <td className="py-5 pr-8">
                             {/* Progress Bar */}
                             <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.popularity}%` }}></div>
                             </div>
                             <span className="text-[10px] font-bold text-blue-600 mt-1 block">{row.popularity}% volume</span>
                          </td>
                          <td className="py-5">
                             <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                row.trend === 'Increasing' 
                                ? 'bg-green-50 text-green-700 border-green-100' 
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                             }`}>
                                {row.trend === 'Increasing' ? <ArrowUpRight size={12} /> : <Minus size={12} />}
                                {row.trend}
                             </span>
                          </td>
                          <td className="py-5 text-right pr-4 text-xs font-bold text-gray-500">{row.rec}</td>
                       </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        <p className="text-sm font-medium">No performance data for this category.</p>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- RECENT USER ACTIVITIES TABLE --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[300px]">
         <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent User Activities</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">
              Track operational inputs
            </p>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                     <th className="pb-4 pl-4">User</th>
                     <th className="pb-4">Action</th>
                     <th className="pb-4">Items</th>
                     <th className="pb-4">Quantity</th>
                     <th className="pb-4 text-right pr-4">Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((act) => (
                       <tr key={act.id} className="group hover:bg-gray-50 transition-colors animate-in slide-in-from-bottom-2 duration-300">
                          <td className="py-5 pl-4 font-bold text-gray-900 text-sm">{act.user}</td>
                          <td className="py-5 text-xs font-bold text-gray-500 uppercase tracking-wide">{act.action}</td>
                          <td className="py-5 font-medium text-gray-700 text-sm">{act.item}</td>
                          <td className="py-5 font-bold text-gray-900">{act.qty}</td>
                          <td className="py-5 text-right pr-4 text-xs font-medium text-gray-400 font-mono">
                             {act.time}
                          </td>
                       </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        <p className="text-sm font-medium">No recent activities found for {activeFilter}.</p>
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