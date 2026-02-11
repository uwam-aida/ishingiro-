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
  Users
} from 'lucide-react';

export default function CICMDashboard() {
  
  // State to toggle between Dashboard view and Details view
  const [currentView, setCurrentView] = useState('Dashboard');

  // --- 1. GRID DATA (Ordered as requested) ---
  const stats = [
    { 
      label: 'Baked Items', 
      value: '1,250', 
      sub: 'Completed Production', 
      icon: Package, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      label: 'Delivered Products', 
      value: '1,100', 
      sub: 'Dispatched to Branches', 
      icon: Truck, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Shop Stock', 
      value: '850', 
      sub: 'Currently in Shops', 
      icon: ShoppingBag, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'Rest Products', 
      value: '150', 
      sub: 'From Store Keeper', 
      icon: Store, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Damaged Items', 
      value: '12', 
      sub: 'Total Losses', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
  ];

  // --- 2. REPORTS DATA (For Dashboard Bottom Section) ---
  const branchReport = [
    { item: 'White Bread', masaka: '200 pcs', kabuga: '350 pcs', total: '550 pcs' },
    { item: 'Tea Scones',  masaka: '100 pcs', kabuga: '150 pcs', total: '250 pcs' },
    { item: 'Cakes',       masaka: '20 pcs',  kabuga: '40 pcs',  total: '60 pcs' },
  ];

  const othersReport = [
    { category: 'Guests',  item: 'Special Cake', qty: '2 pcs',  destination: 'General', source: 'Store Keeper' },
    { category: 'Clients', item: 'Bread Loaves', qty: '50 pcs', destination: 'Corporate Order', source: 'Store Keeper' },
    { category: 'Events',  item: 'Pastry Box',   qty: '10 boxes', destination: 'Wedding', source: 'Store Keeper' },
    { category: 'Tiku',    item: 'Donuts',       qty: '100 pcs', destination: 'Kabuga Only', source: 'Store Keeper' },
  ];

  // --- 3. DETAILS DATA GENERATOR (For Clicked Grid) ---
  const getDetailsData = (view: string) => {
    switch (view) {
      case 'Baked Items':
        return [
           { id: 1, item: 'White Bread', qty: '500 pcs', loc: 'Factory', time: '09:00 AM', status: 'Ready' },
           { id: 2, item: 'Tea Scones',  qty: '200 pcs', loc: 'Factory', time: '10:00 AM', status: 'Packed' },
        ];
      case 'Delivered Products':
        return [
           { id: 1, item: 'White Bread', qty: '300 pcs', loc: 'Kabuga', time: '10:30 AM', status: 'Delivered' },
           { id: 2, item: 'Cakes',       qty: '50 pcs',  loc: 'Masaka', time: '11:00 AM', status: 'Delivered' },
        ];
      case 'Shop Stock':
        return [
           { id: 1, item: 'White Bread', qty: '120 pcs', loc: 'Kabuga Shop', time: 'Updated 5m ago', status: 'Selling' },
           { id: 2, item: 'Tea Scones',  qty: '45 pcs',  loc: 'Masaka Shop', time: 'Updated 10m ago', status: 'Selling' },
        ];
      case 'Rest Products':
        return [
           { id: 1, item: 'Flour Sacks', qty: '50 pcs', loc: 'Main Store', time: '08:00 AM', status: 'Reserved' },
           { id: 2, item: 'Sugar Bags',  qty: '10 pcs', loc: 'Main Store', time: '08:30 AM', status: 'Available' },
        ];
      case 'Damaged Items':
        return [
           { id: 1, item: 'Burnt Bread', qty: '10 pcs', loc: 'Production', time: 'Yesterday', status: 'Disposed' },
           { id: 2, item: 'Stale Cake',  qty: '2 pcs',  loc: 'Shop',       time: 'Today',     status: 'Returned' },
        ];
      default: return [];
    }
  };

  const detailsList = getDetailsData(currentView);

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
      {/* --- MOBILE LOGO HEADER (Visible on Mobile) --- */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 pt-2">
        <div className="w-16 h-16 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
      </div>

      {/* =========================================================
          VIEW 1: DASHBOARD (Grids + Reports)
         ========================================================= */}
      {currentView === 'Dashboard' && (
        <div className="animate-in fade-in duration-500 space-y-10">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CICM Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Overview of internal controls and distribution.</p>
          </div>

          {/* 1. GRIDS (Line by Line on Mobile) */}
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

          {/* 2. REPORTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Report A: Branch Delivery */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="text-[#5D4037]" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Branch Delivery Report</h2>
              </div>
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-500">Item</th>
                      <th className="px-6 py-4 font-bold text-gray-500 text-center">Masaka</th>
                      <th className="px-6 py-4 font-bold text-gray-500 text-center">Kabuga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {branchReport.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-[#5D4037]">{row.item}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{row.masaka}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{row.kabuga}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report B: Special Distribution (Others) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="text-[#5D4037]" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Special Distribution (Others)</h2>
              </div>
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-500">Category</th>
                      <th className="px-6 py-4 font-bold text-gray-500">Item / Qty</th>
                      <th className="px-6 py-4 font-bold text-gray-500 text-right">Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {othersReport.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            row.category === 'Tiku' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#5D4037]">{row.item}</div>
                          <div className="text-xs text-gray-400">{row.qty}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-xs font-bold text-gray-500">{row.destination}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          VIEW 2: DETAILS LIST (Shown when Grid Clicked)
         ========================================================= */}
      {currentView !== 'Dashboard' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          
          {/* Back Button */}
          <button 
            onClick={() => setCurrentView('Dashboard')} 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5D4037] mb-6 text-sm font-bold transition-colors"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">{currentView} List</h1>
               <p className="text-gray-500 text-sm mt-1">Detailed report for {currentView}.</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50/50">
                      <tr>
                         <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Item</th>
                         <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Qty</th>
                         <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                         <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {detailsList.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50/50">
                           <td className="px-8 py-5 font-bold text-[#5D4037] text-sm">{row.item}</td>
                           <td className="px-8 py-5 text-center font-bold text-gray-800">{row.qty}</td>
                           <td className="px-8 py-5 text-sm text-gray-500">{row.loc}</td>
                           <td className="px-8 py-5 text-right">
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{row.status}</span>
                           </td>
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