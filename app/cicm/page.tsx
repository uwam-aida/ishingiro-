'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Package, 
  Truck, 
  Store, 
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Search,
  CheckCircle,
  MapPin,
  Users,
  Cake,
  ClipboardList
} from 'lucide-react';

export default function CICMDashboard() {
  
  // State to toggle between Dashboard view and Details view
  const [currentView, setCurrentView] = useState('Dashboard');

  // --- 1. GRID DATA (Updated to include Reports as Grid Items) ---
  const stats = [
    { label: 'Baked Items', value: '1,250', sub: 'Completed Production', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Delivered Products', value: '1,100', sub: 'Dispatched to Branches', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shop Stock', value: '850', sub: 'Currently in Shops', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rest Products', value: '150', sub: 'From Store Keeper', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Damaged Items', value: '12', sub: 'Total Losses', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    // Added these to the GRID as requested
    { label: 'Branch Delivery Report', value: '2 Branches', sub: 'Masaka & Kabuga', icon: ClipboardList, color: 'text-[#5D4037]', bg: 'bg-stone-100' },
    { label: 'Live Cake Orders', value: '3 Active', sub: 'Custom Orders', icon: Cake, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  // --- 2. REPORTS DATA ---
  const branchReport = [
    { item: 'White Bread', masaka: '200 pcs', kabuga: '350 pcs', total: '550 pcs' },
    { item: 'Tea Scones',  masaka: '100 pcs', kabuga: '150 pcs', total: '250 pcs' },
    { item: 'Cakes',       masaka: '20 pcs',  kabuga: '40 pcs',  total: '60 pcs' },
  ];

  const cakeOrdersReport = [
    { category: 'BIRTHDAY', item: 'Vanilla Cake', code: 'KS-46', source: 'Kabuga', target: 'John Doe' },
    { category: 'WEDDING', item: 'Chocolate 3-Tier', code: 'KS-12', source: 'Masaka', target: 'Event Hall' },
    { category: 'BIRTHDAY', item: 'Strawberry Swirl', code: 'KS-89', source: 'Kabuga', target: 'Jane Smith' },
  ];

  // --- 3. DETAILS DATA GENERATOR ---
  const getDetailsData = (view: string) => {
    switch (view) {
      case 'Branch Delivery Report':
        return branchReport.map((r, i) => ({ id: i, item: r.item, qty: r.total, loc: `Msk: ${r.masaka} | Kbg: ${r.kabuga}`, status: 'Reported' }));
      case 'Live Cake Orders':
        return cakeOrdersReport.map((c, i) => ({ id: i, item: c.item, qty: c.code, loc: c.source, status: c.category }));
      case 'Baked Items':
        return [{ id: 1, item: 'White Bread', qty: '500 pcs', loc: 'Factory', status: 'Ready' }];
      case 'Delivered Products':
        return [{ id: 1, item: 'White Bread', qty: '300 pcs', loc: 'Kabuga', status: 'Delivered' }];
      case 'Shop Stock':
        return [{ id: 1, item: 'White Bread', qty: '120 pcs', loc: 'Kabuga Shop', status: 'Selling' }];
      default: return [];
    }
  };

  const detailsList = getDetailsData(currentView);

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
       {currentView === 'Dashboard' && (
        <div className="animate-in fade-in duration-500 space-y-10">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-sans">CICM Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Management Overview for Masaka and Kabuga branches.</p>
          </div>

          {/* 1. GRIDS (Includes Branch Delivery and Cake Orders now) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentView(stat.label)}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col text-left hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                     <stat.icon size={24} strokeWidth={2.5} />
                   </div>
                   <div className="bg-gray-50 rounded-full p-2 group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
                     <ArrowRight size={16} className="text-gray-400 group-hover:text-white" />
                   </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs font-medium mt-1 text-gray-400">{stat.sub}</p>
                </div>
              </button>
            ))}
          </div>
        
        </div>
      )}


      {currentView !== 'Dashboard' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <button onClick={() => setCurrentView('Dashboard')} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5D4037] mb-6 text-sm font-bold transition-colors"><ArrowLeft size={18} /> Back to Dashboard</button>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{currentView}</h1>
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50/50"><tr><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Item</th><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Qty / Code</th><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Branch / Loc</th><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th></tr></thead>
                   <tbody className="divide-y divide-gray-50">
                      {detailsList.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/50">
                           <td className="px-8 py-5 font-bold text-[#5D4037] text-sm">{row.item}</td>
                           <td className="px-8 py-5 text-center font-bold text-gray-800">{row.qty}</td>
                           <td className="px-8 py-5 text-sm text-gray-500">{row.loc}</td>
                           <td className="px-8 py-5 text-right"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{row.status}</span></td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
         </div>
      )}
     </div>
  );
}