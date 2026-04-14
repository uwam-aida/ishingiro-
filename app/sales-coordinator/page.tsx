'use client';

import React, { useState } from 'react';
import { 
  ChefHat, 
  AlertTriangle, 
  Truck, 
  PackageOpen, 
  Store, 
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  Search,
  ClipboardList,
  History
} from 'lucide-react';

export default function SalesCoordinatorDashboard() {
  
  const [currentView, setCurrentView] = useState('Dashboard');

  // --- 1. DATA CONFIGURATION (Updated with your requested categories) ---
  const stats = [
    { 
      label: 'Requests', 
      fullLabel: 'Shop Requests',
      value: '24', 
      sub: 'Pending branch orders', 
      icon: ClipboardList, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
    },
    { 
      label: 'Baked', 
      fullLabel: 'Baked Products',
      value: '1,250', 
      sub: 'Ready from production', 
      icon: ChefHat, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
    },
    { 
      label: 'Delivered', 
      fullLabel: 'Delivered Products',
      value: '1,100', 
      sub: 'Sent to branches', 
      icon: Truck, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
    },
    { 
      label: 'Stock', 
      fullLabel: 'Shop Stock',
      value: '850', 
      sub: 'Available in branches', 
      icon: Store, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
    },
    { 
      label: 'Damaged', 
      fullLabel: 'Damaged Products',
      value: '12', 
      sub: 'Recorded losses', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
    },
    { 
      label: 'History', 
      fullLabel: 'Full Added Products',
      value: '3,420', 
      sub: 'Total lifetime logs', 
      icon: History, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
    },
  ];

  // --- 2. TABLE DATA GENERATOR (Updated with your requested tracking) ---
  const getDataForView = (view: string) => {
    switch (view) {
      case 'Requests':
        return [
          { id: 1, item: 'Milk Bread', qty: '50 pcs', stock: 'Kabuga Request', time: '09:00 AM', status: 'Pending' },
          { id: 2, item: 'Tea Cake', qty: '10 pcs', stock: 'Masaka Request', time: '09:15 AM', status: 'Approved' },
        ];
      case 'Baked':
        return [
          { id: 1, item: 'White Bread', qty: '500 pcs', stock: 'Factory', time: '06:30 AM', status: 'Ready' },
          { id: 2, item: 'Brown Bread', qty: '200 pcs', stock: 'Factory', time: '07:15 AM', status: 'Ready' },
        ];
      case 'Delivered':
        return [
          { id: 1, item: 'White Bread', qty: '300 pcs', stock: 'Kabuga Branch', time: '10:00 AM', status: 'Delivered' },
          { id: 2, item: 'Donuts', qty: '600 pcs', stock: 'Kicukiro', time: '11:15 AM', status: 'In Transit' },
        ];
      case 'Stock':
        return [
          { id: 1, item: 'White Bread', qty: '120 pcs', stock: 'Kabuga Shop', time: 'Updated 5m ago', status: 'Selling' },
          { id: 2, item: 'Cakes', qty: '15 pcs', stock: 'Masaka Shop', time: 'Updated 10m ago', status: 'Selling' },
        ];
      case 'Damaged':
        return [
          { id: 1, item: 'Burnt Bread', qty: '10 pcs', stock: 'Production', time: '06:45 AM', status: 'Disposed' },
          { id: 2, item: 'Smashed Cake', qty: '2 pcs', stock: 'Transport', time: '11:20 AM', status: 'Returned' },
        ];
      case 'History':
        return [
          { id: 1, item: 'Full Batch - Bread', qty: '2000 pcs', stock: 'System Log', time: 'Yesterday', status: 'Archived' },
          { id: 2, item: 'New Flour Entry', qty: '500 kg', stock: 'Store Entry', time: '2 days ago', status: 'Archived' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
      {/* --- MOBILE LOGO HEADER --- */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 pt-2">
        <div className="w-16 h-16 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
      </div>

      {currentView === 'Dashboard' && (
        <>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Coordinator</h1>
            <p className="text-gray-500 text-sm mt-1">Track requests, stock, and product flow across branches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentView(stat.label)}
                className="text-left p-6 rounded-3xl shadow-sm border flex flex-col transition-all group relative overflow-hidden bg-white border-gray-100 hover:shadow-md hover:border-gray-200"
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                    <stat.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="bg-[#5D4037] rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} />
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.fullLabel}</h3>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs font-medium mt-1 text-gray-400 group-hover:text-gray-600 transition-colors">
                    {stat.sub}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {currentView !== 'Dashboard' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-8">
            <button 
              onClick={() => setCurrentView('Dashboard')} 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5D4037] mb-2 text-sm font-bold transition-colors"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{currentView} Tracking</h1>
            <p className="text-gray-500 text-sm mt-1">Detailed data for {currentView.toLowerCase()}.</p>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#5D4037]">{currentView} List</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search item..." 
                  className="bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Item Name</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Quantity</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Source / Location</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {getDataForView(currentView).map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-[#5D4037] text-sm">{row.item}</td>
                      <td className="px-8 py-5 text-center font-black text-gray-800 text-base">{row.qty}</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                          <MapPin size={10} /> {row.stock}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#A67C37]" />
                          {row.time}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          row.status === 'Ready' || row.status === 'Approved' || row.status === 'Selling' ? 'bg-green-100 text-green-700' :
                          row.status === 'Delivered' || row.status === 'Archived' ? 'bg-blue-100 text-blue-700' :
                          row.status === 'Disposed' || row.status === 'Returned' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {row.status}
                        </span>
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