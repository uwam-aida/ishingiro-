'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For Report Button
import { 
  Factory, 
  Store, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Package,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function OperationDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'production' | 'shop' | 'damaged'>('production');
  const [activeFilter, setActiveFilter] = useState<string>('all'); // To filter flow stages specifically
  const [activities, setActivities] = useState<any[]>([]);
  
  // Scroll Ref
  const detailsRef = useRef<HTMLDivElement>(null);

  // --- 1. DYNAMIC TIME & DATA ---
  useEffect(() => {
    const getTimeAgo = (minutes: number) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - minutes);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const data = [
      { id: 1, user: 'Baker assistant', role: 'Production', action: 'Measured flour', item: 'Bread flour', qty: '50kg', category: 'production', stage: 'measured', time: 'Just now' },
      { id: 2, user: 'Baker assistant', role: 'Production', action: 'Baked products', item: 'Bread', qty: '100 pcs', category: 'production', stage: 'baked', time: getTimeAgo(15) },
      { id: 3, user: 'Shop manager', role: 'Sales', action: 'Stock update', item: 'Received Bread', qty: '100 pcs', category: 'shop', stage: 'shop', time: getTimeAgo(30) },
      { id: 4, user: 'Store keeper', role: 'Inventory', action: 'Reported damage', item: 'Burnt Bread', qty: '2 pcs', category: 'damaged', stage: 'damaged', time: getTimeAgo(45) },
      { id: 5, user: 'Shop manager', role: 'Sales', action: 'Sold item', item: 'Cake', qty: '1 pcs', category: 'shop', stage: 'shop', time: getTimeAgo(60) },
    ];
    setActivities(data);
  }, []);

  // --- 2. DYNAMIC COUNTS CALCULATION ---
  // Calculates real numbers from the activities array
  const counts = {
    measured: activities.filter(a => a.stage === 'measured').length,
    baked: activities.filter(a => a.stage === 'baked').length,
    shop: activities.filter(a => a.category === 'shop').length,
    damaged: activities.filter(a => a.category === 'damaged').length,
    productionTotal: activities.filter(a => a.category === 'production').length
  };

  // Handle Grid Click
  const handleCardClick = (tab: 'production' | 'shop' | 'damaged') => {
    setActiveTab(tab);
    setActiveFilter('all'); // Reset specific filter when changing main tab
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle Flow Item Click (Deep Filtering)
  const handleFlowClick = (stage: string) => {
    setActiveFilter(stage);
  };

  // Filter Logic (Combines Main Tab + Specific Flow Stage)
  const filteredActivities = activities.filter(a => {
    if (activeTab === 'production' && activeFilter !== 'all') return a.stage === activeFilter;
    return a.category === activeTab;
  });

  // Stats Data
  const stats = [
    { 
      id: 'production',
      label: 'Production', 
      value: counts.productionTotal, // Dynamic
      sub: 'Total items', 
      icon: Factory, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    { 
      id: 'shop',
      label: 'Shop stock', 
      value: counts.shop, // Dynamic
      sub: 'Available items', 
      icon: Store, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    { 
      id: 'damaged',
      label: 'Damaged total', 
      value: counts.damaged, // Dynamic
      sub: 'Total loss', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      border: 'border-red-100'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Operation Manager</h1>
        <p className="text-gray-500 mt-2 font-medium">Overview of production flow and stock operations.</p>
      </div>

      {/* --- INTERACTIVE GRID CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id}
            onClick={() => handleCardClick(stat.id as any)}
            className={`p-8 rounded-[32px] border transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-lg relative overflow-hidden ${
              activeTab === stat.id 
              ? `bg-gray-900 border-gray-900 ring-4 ring-gray-100` 
              : `bg-white border-gray-100`
            }`}
          >
             <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${
                  activeTab === stat.id ? 'bg-gray-800 text-white' : `${stat.bg} ${stat.color}`
                }`}>
                   <stat.icon size={24} strokeWidth={2} />
                </div>
                {activeTab === stat.id && (
                  <div className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full">
                    <CheckCircle size={16} />
                  </div>
                )}
             </div>
             
             <div>
               <h3 className={`font-bold text-sm uppercase tracking-wide mb-2 ${
                 activeTab === stat.id ? 'text-gray-400' : 'text-gray-500'
               }`}>
                 {stat.label}
               </h3>
               <p className={`text-5xl font-extrabold ${
                 activeTab === stat.id ? 'text-white' : 'text-gray-900'
               }`}>
                 {stat.value}
               </p>
               <p className={`text-xs font-bold mt-2 ${
                 activeTab === stat.id ? 'text-gray-500' : 'text-gray-400'
               }`}>
                 {stat.sub}
               </p>
             </div>
          </div>
        ))}
      </div>

      {/* --- DETAILED SECTIONS (Scroll Target) --- */}
      <div ref={detailsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* LEFT: Production Flow (NOW DYNAMIC & CLICKABLE) */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
           <div className="flex items-center gap-3 mb-8">
             <div className="p-2.5 bg-gray-50 text-gray-900 rounded-xl">
               <Package size={20} />
             </div>
             <div>
               <h2 className="text-xl font-bold text-gray-900">Production Flow</h2>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                 {activeFilter !== 'all' ? `Filtering: ${activeFilter}` : 'Live stage status'}
               </p>
             </div>
           </div>

           <div className="space-y-4">
             {/* Flow Item 1: Measured */}
             <div 
               onClick={() => { handleCardClick('production'); handleFlowClick('measured'); }}
               className={`flex justify-between items-center p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                 activeFilter === 'measured' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-gray-50 border-gray-50 hover:bg-gray-100'
               }`}
             >
               <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${activeFilter === 'measured' ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
                 <span className="font-bold text-gray-700">Measured to bake</span>
               </div>
               <span className="font-extrabold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm min-w-[40px] text-center">
                 {counts.measured}
               </span>
             </div>

             {/* Flow Item 2: Baked */}
             <div 
               onClick={() => { handleCardClick('production'); handleFlowClick('baked'); }}
               className={`flex justify-between items-center p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                 activeFilter === 'baked' ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100' : 'bg-gray-50 border-gray-50 hover:bg-gray-100'
               }`}
             >
               <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${activeFilter === 'baked' ? 'bg-indigo-600' : 'bg-indigo-400'}`}></div>
                 <span className="font-bold text-gray-700">Baked and ready</span>
               </div>
               <span className="font-extrabold text-white bg-black px-3 py-1 rounded-lg shadow-sm min-w-[40px] text-center">
                 {counts.baked}
               </span>
             </div>

             {/* Flow Item 3: Shop */}
             <div 
               onClick={() => handleCardClick('shop')}
               className={`flex justify-between items-center p-5 rounded-2xl border transition-colors cursor-pointer ${
                 activeTab === 'shop' ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-50 hover:bg-gray-100'
               }`}
             >
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 <span className="font-bold text-gray-700">In shop stock</span>
               </div>
               <span className="font-extrabold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm min-w-[40px] text-center">
                 {counts.shop}
               </span>
             </div>

             {/* Flow Item 4: Damaged */}
             <div 
               onClick={() => handleCardClick('damaged')}
               className={`flex justify-between items-center p-5 rounded-2xl border transition-colors cursor-pointer ${
                 activeTab === 'damaged' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-50 hover:bg-gray-100'
               }`}
             >
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <span className="font-bold text-gray-700">Damaged</span>
               </div>
               <span className="font-extrabold text-red-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-red-100 min-w-[40px] text-center">
                 {counts.damaged}
               </span>
             </div>
           </div>
        </div>

        {/* RIGHT: User Activities */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2.5 bg-gray-50 text-gray-900 rounded-xl">
               <Users size={20} />
             </div>
             <div>
               <h2 className="text-xl font-bold text-gray-900">User Activities</h2>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                 Filter: <span className="text-black capitalize">{activeFilter !== 'all' ? activeFilter : activeTab}</span>
               </p>
             </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar max-h-[400px]">
             {filteredActivities.length > 0 ? (
               filteredActivities.map((activity) => (
                 <div key={activity.id} className="relative pl-6 border-l-2 border-gray-100 hover:border-gray-300 transition-colors group animate-in slide-in-from-right-2 duration-300">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-gray-100 group-hover:border-gray-900 transition-colors"></div>
                    
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{activity.role}</span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={10} /> {activity.time}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-900">{activity.action}</h4>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      {activity.qty} of <span className="text-gray-700">{activity.item}</span>
                    </p>
                 </div>
               ))
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                 <div className="p-4 bg-gray-50 rounded-full mb-3">
                   <Filter size={24} className="opacity-20" />
                 </div>
                 <p className="text-sm font-medium">No recent activities for this stage.</p>
                 <button onClick={() => { setActiveTab('production'); setActiveFilter('all'); }} className="text-xs font-bold text-blue-600 mt-2 underline">Reset Filters</button>
               </div>
             )}
           </div>
           
           <div className="mt-6 pt-6 border-t border-gray-50">
             <button 
               onClick={() => router.push('/operation-manager/report')}
               className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
             >
               View Full Report <ArrowRight size={16} />
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}