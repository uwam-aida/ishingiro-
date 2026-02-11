'use client';

import React, { useState } from 'react';
import { 
  Scale, 
  ChefHat, 
  ShoppingCart, 
  AlertTriangle, 
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
  Search,
  Clock,
  Package,
  CheckCircle
} from 'lucide-react';

export default function ProductionManagerDashboard() {
  
  // State to track current view ('Dashboard' or specific category)
  const [currentView, setCurrentView] = useState('Dashboard');

  // --- 1. DASHBOARD GRID CONFIGURATION ---
  const stats = [
    { 
      label: 'Measured', 
      fullLabel: 'Measured Products',
      value: '5', 
      sub: 'Batches ready to bake', 
      icon: Scale, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      editable: false
    },
    { 
      label: 'Baked', 
      fullLabel: 'Baked Products',
      value: '1,250', 
      sub: 'Completed today', 
      icon: ChefHat, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      editable: false
    },
    { 
      label: 'Orders', 
      fullLabel: 'Shop Orders',
      value: '8', 
      sub: 'Incoming requests', 
      icon: ShoppingCart, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      editable: true // Shows this is editable
    },
    { 
      label: 'Damaged', 
      fullLabel: 'Total Damaged',
      value: '12', 
      sub: 'Recorded losses', 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      editable: true // Shows this is editable
    },
  ];

  // --- 2. DATA GENERATOR (Returns Data + Editable Flag) ---
  const getDataForView = (view: string) => {
    switch (view) {
      case 'Measured':
        return {
          desc: 'Batches prepared by Baker Assistant ready for oven.',
          editable: false,
          data: [
            { id: 1, item: 'White Bread Dough', qty: '50 kg', time: '08:00 AM', status: 'Ready to Bake' },
            { id: 2, item: 'Cake Batter',       qty: '20 kg', time: '08:30 AM', status: 'Ready to Bake' },
          ]
        };
      case 'Baked':
        return {
          desc: 'Finished goods ready for packaging or distribution.',
          editable: false,
          data: [
            { id: 1, item: 'White Bread', qty: '500 pcs', time: '09:45 AM', status: 'Cooling' },
            { id: 2, item: 'Tea Scones',  qty: '200 pcs', time: '10:00 AM', status: 'Packed' },
          ]
        };
      case 'Orders':
        return {
          desc: 'Incoming requests from shop managers.',
          editable: true, // Enable Edit Buttons
          data: [
            { id: 1, item: 'Kabuga Order #101', qty: '300 Bread', time: '10 min ago', status: 'Pending' },
            { id: 2, item: 'Masaka Order #102', qty: '50 Cakes',  time: '1 hour ago', status: 'Approved' },
          ]
        };
      case 'Damaged':
        return {
          desc: 'Reported waste and damaged goods.',
          editable: true, // Enable Edit Buttons
          data: [
            { id: 1, item: 'Burnt Bread',    qty: '12 pcs', time: 'Yesterday', status: 'Reported' },
            { id: 2, item: 'Expired Yeast',  qty: '2 kg',   time: 'Today',     status: 'Disposed' },
          ]
        };
      default:
        return { desc: '', editable: false, data: [] };
    }
  };

  const pageInfo = getDataForView(currentView);

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
      {/* --- MOBILE LOGO HEADER --- */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 pt-2">
        <div className="w-16 h-16 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
      </div>

      {/* =========================================================
          VIEW 1: DASHBOARD GRID
         ========================================================= */}
      {currentView === 'Dashboard' && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Production Manager</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor production flow and manage orders.</p>
          </div>

          {/* Grid (Line by Line on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentView(stat.label)}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col text-left hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                    <stat.icon size={24} strokeWidth={2.5} />
                  </div>
                  
                  {/* Icon Indicator: Edit or Arrow */}
                  <div className={`rounded-full p-2 transition-colors ${
                    stat.editable 
                    ? 'bg-gray-50 text-gray-400 group-hover:bg-[#5D4037] group-hover:text-white' 
                    : 'bg-gray-50 text-gray-400 group-hover:bg-[#5D4037] group-hover:text-white'
                  }`}>
                    {stat.editable ? <Edit2 size={16} /> : <ArrowRight size={16} />}
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

      {/* =========================================================
          VIEW 2: DETAILS LIST (With Edit Functionality)
         ========================================================= */}
      {currentView !== 'Dashboard' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          
          {/* Header & Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => setCurrentView('Dashboard')} 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5D4037] mb-2 text-sm font-bold transition-colors"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{currentView} List</h1>
            <p className="text-gray-500 text-sm mt-1">{pageInfo.desc}</p>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#5D4037]">
                {currentView} Items {pageInfo.editable && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full ml-2">Editable</span>}
              </h2>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                />
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Item Name</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Quantity</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Time / Date</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    {/* Only show Actions column if editable */}
                    {pageInfo.editable && <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageInfo.data.map((row: any) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-[#5D4037] text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                            <Package size={16} />
                          </div>
                          {row.item}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center font-black text-gray-800 text-base">
                        {row.qty}
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#A67C37]" />
                          {row.time}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          row.status === 'Ready to Bake' || row.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          row.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>

                      {/* ACTION BUTTONS (Only for Orders & Damaged) */}
                      {pageInfo.editable && (
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit Item">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete Item">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {pageInfo.data.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm font-medium">
                  No data found for this category.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}