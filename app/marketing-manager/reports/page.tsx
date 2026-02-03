'use client';

import React, { useState } from 'react';
import { 
  Factory, 
  Store, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCcw 
} from 'lucide-react';

export default function MarketingDashboard() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'growth' | 'production' | 'stock' | 'orders'>('all');

  // --- MOCK REAL-TIME DATA ---
  // We need 'produced' and 'sold' to calculate your formula
  const marketData = [
    // Case 1: Produced 200, Sold 190 (95%) -> MET (>90%)
    { id: 1, product: 'Bread', produced: 200, sold: 190, stock: 10, category: 'production' },
    
    // Case 2: Produced 100, Sold 80 (80%) -> BELOW (<90%)
    { id: 2, product: 'Biscuits', produced: 100, sold: 80, stock: 20, category: 'stock' },
    
    // Case 3: Produced 10, Sold 10 (100%) -> MET (>90%)
    { id: 3, product: 'Birthday Cake', produced: 10, sold: 10, stock: 0, category: 'orders' },
  ];

  // --- YOUR NEW FORMULA LOGIC ---
  const getStatus = (produced: number, sold: number) => {
    if (produced === 0) return { label: 'No Production', color: 'bg-gray-100 text-gray-500', percent: 0 };
    
    // Calculate Percentage
    const percentage = (sold / produced) * 100;
    
    // Rule: Greater than 90% = Target Met
    if (percentage > 90) {
      return { label: 'Target Met', color: 'bg-green-100 text-green-700', percent: percentage };
    }
    
    return { label: 'Below Target', color: 'bg-orange-100 text-orange-700', percent: percentage };
  };

  // Stats Data
  const stats = [
    { id: 'growth', label: 'Weekly Growth', value: '+15%', sub: 'Volume increase', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'production', label: 'In Production', value: '3', sub: 'Active products', icon: Factory, color: 'text-gray-900', bg: 'bg-gray-50' },
    { id: 'stock', label: 'Shop Stock', value: '30', sub: 'Items available', icon: Store, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'orders', label: 'Orders', value: '5', sub: 'Pending', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  // Filter Logic
  const filteredData = activeFilter === 'all' ? marketData : marketData.filter(item => item.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marketing Manager</h1>
          <p className="text-gray-500 mt-2 font-medium">Analyze efficiency: Sales vs Production.</p>
        </div>
        {activeFilter !== 'all' && (
          <button 
            onClick={() => setActiveFilter('all')}
            className="text-sm font-bold text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors px-4 py-2"
          >
            <RefreshCcw size={14} /> Reset View
          </button>
        )}
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => setActiveFilter(stat.id as any)}
            className={`p-6 rounded-[24px] shadow-sm flex flex-col justify-between h-32 cursor-pointer transition-all duration-300 border ${
              activeFilter === stat.id 
              ? 'bg-gray-900 text-white border-gray-900 transform -translate-y-1 shadow-lg' 
              : `${stat.bg} ${stat.color} border-transparent hover:-translate-y-1`
            } ${activeFilter !== 'all' && activeFilter !== stat.id ? 'opacity-50 grayscale' : 'opacity-100'}`}
          >
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-xs font-bold uppercase opacity-70">{stat.label}</p>
                 <h3 className="text-3xl font-extrabold mt-1">{stat.value}</h3>
               </div>
               <stat.icon size={20} className="opacity-80" />
             </div>
             <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* --- PERFORMANCE TABLE (Uses >90% Formula) --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[400px]">
        <div className="mb-8">
           <h2 className="text-xl font-bold text-gray-900">Efficiency Performance</h2>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">
             Target Met if Sales {'>'} 90% of Production
           </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                <th className="pb-4 pl-4">Products</th>
                <th className="pb-4">Produced</th>
                <th className="pb-4">Sold</th>
                <th className="pb-4">Efficiency</th>
                <th className="pb-4 text-right pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => {
                 const status = getStatus(item.produced, item.sold);

                 return (
                  <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors">
                    <td className="py-5 pl-4 font-bold text-gray-900">{item.product}</td>
                    <td className="py-5 font-medium text-gray-500">{item.produced}</td>
                    <td className="py-5 font-bold text-gray-900">{item.sold}</td>
                    <td className="py-5 text-xs font-bold text-gray-400">
                      {status.percent.toFixed(1)}%
                    </td>
                    <td className="py-5 text-right pr-4">
                      <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
             <div className="py-12 text-center text-gray-400">
               <p className="text-sm font-medium">No data found.</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
}