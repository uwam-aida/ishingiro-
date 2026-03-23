'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Package, Clock, ShoppingBag, AlertCircle, Search, Archive, ArrowLeft, Store, Plus, MapPin, Bell, X } from 'lucide-react';

export default function DynamicShopDashboard() {
  const router = useRouter(); 
  const params = useParams(); 

  const rawBranchId = params?.branchId;

  // --- NOTIFICATION STATE ---
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    { id: 1, text: 'New batch of White Loaf ready', time: '5m ago' },
    { id: 2, text: 'Stock request for Masaka approved', time: '1h ago' },
  ];

  // --- BRANCH VALIDATION ---
  const allowedBranches = ['kabuga', 'masaka'];
  const isBranchValid = typeof rawBranchId === 'string' && allowedBranches.includes(rawBranchId.toLowerCase());

  // Handle Invalid Branch
  if (!rawBranchId || !isBranchValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-black text-[#5D4037]">Branch Not Found</h2>
          <p className="text-gray-500 text-sm mt-2">Access restricted. Only Kabuga and Masaka branches are active.</p>
          <button 
            onClick={() => router.back()}
            className="mt-6 w-full py-3 bg-[#5D4037] text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-transform active:scale-95 shadow-md shadow-[#5D4037]/20 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>
    );
  }

  // Proper Title Formatting
  const branchName = rawBranchId.charAt(0).toUpperCase() + rawBranchId.slice(1).toLowerCase();

  const [activeFilter, setActiveFilter] = useState<'baked' | 'orders' | 'received' | 'stock' | 'damaged'>('baked');
  const [searchQuery, setSearchQuery] = useState('');

  const [shopStock] = useState([
    { id: 1, item: 'White Loaf', quantity: 45, unit: 'Pieces', from: 'Inventory', time: 'Updated Now', status: 'Available', action: 'sell' },
  ]);

  const stats = [
    { id: 'baked', label: 'Baked Items', value: '0', sub: 'Incoming', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', value: '0', sub: 'My Requests', icon: Clock },
    { id: 'received', label: 'Received', value: '0', sub: 'History', icon: Archive },
    { id: 'stock', label: 'Rest Products', value: '45', sub: 'In Stock', icon: Store },
    { id: 'damaged', label: 'Damaged', value: '0', sub: 'Reported', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12 relative overflow-x-hidden">
      
      {/* --- NOTIFICATION DRAWER --- */}
      <div className={`fixed inset-y-0 right-0 z-[100] w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-100 ${showNotifications ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[#5D4037] font-black uppercase text-sm tracking-widest">Notifications</h3>
          <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto h-full pb-20">
          {notifications.map(n => (
            <div key={n.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#A67C37] transition-colors">
              <p className="text-xs font-bold text-[#5D4037]">{n.text}</p>
              <span className="text-[10px] text-gray-400 font-medium">{n.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 md:px-8 pt-6">
        
        {/* LOGO IN CENTER */}
        <div className="md:hidden flex items-center justify-center mb-6">
            <img src="/logo.png" alt="Shop Logo" className="h-14 w-auto object-contain" />
        </div>

        {/* 🔥 STICKY TOP BAR */}
        <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-md py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => router.back()} 
                  className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold text-[#5D4037] tracking-tight">
                    {branchName} Shop Manager
                  </h1>
                  <p className="text-[#A67C37] text-[10px] md:text-sm font-medium flex items-center gap-2">
                    <MapPin size={12} className="md:w-3.5" /> Location: {branchName} Branch
                  </p>
                </div>
              </div>

              {/* BELL ICON WITH BADGE */}
              <button 
                onClick={() => router.push(`/${rawBranchId}/shop-manager/notification`)}
                className="relative p-2.5 rounded-xl bg-white border border-gray-200 text-[#5D4037] shadow-sm md:hidden hover:bg-gray-50 transition-all"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>              </button>
            </div>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5D4037]" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] transition-all shadow-sm text-[#5D4037]" 
              />
            </div>
          </div>
        </div>

        {/* 🔥 MOBILE RESPONSIVE GRID (Centered, Line-by-Line) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              onClick={() => setActiveFilter(stat.id as any)}
              className={`p-6 rounded-2xl shadow-sm border flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                activeFilter === stat.id 
                ? 'bg-[#5D4037] text-white border-[#5D4037] scale-[1.02] shadow-lg' 
                : 'bg-white border-gray-100 hover:border-[#A67C37] hover:shadow-md'
              }`}
            >
               <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                 activeFilter === stat.id ? 'bg-[#A67C37] text-white' : 'bg-[#EBE0CC]/40 text-[#5D4037]'
               }`}>
                 <stat.icon size={26} strokeWidth={2} />
               </div>
               <h3 className={`font-bold text-xs uppercase tracking-widest leading-tight ${activeFilter === stat.id ? 'text-[#EBE0CC]' : 'text-gray-500'}`}>{stat.label}</h3>
               <p className={`text-3xl font-black mt-2 ${activeFilter === stat.id ? 'text-white' : 'text-[#5D4037]'}`}>{stat.value}</p>
               <p className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${activeFilter === stat.id ? 'text-white/60' : 'text-gray-400'}`}>{stat.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}