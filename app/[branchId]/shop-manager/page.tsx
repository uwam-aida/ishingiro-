'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Package, Clock, ShoppingBag, AlertCircle, Search, Archive, ArrowLeft, Store, Plus, MapPin } from 'lucide-react';

export default function DynamicShopDashboard() {
  const router = useRouter(); 
  const params = useParams(); 

  const rawBranchId = params?.branchId;

  // --- STRICT BRANCH LIMITATION ---
  const allowedBranches = ['kabuga', 'masaka'];
  const isBranchValid = typeof rawBranchId === 'string' && allowedBranches.includes(rawBranchId.toLowerCase());

  // Safety Guard: If no ID or invalid branch, show error
  if (!rawBranchId || !isBranchValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-black text-[#5D4037]">Branch Not Found</h2>
          <p className="text-gray-500 text-sm mt-2">Access restricted. Only Kabuga and Masaka branches are active.</p>
          
          {/* UPDATED BUTTON: Says "Back" and uses router.back() */}
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

  const branchName = rawBranchId.charAt(0).toUpperCase() + rawBranchId.slice(1);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [activeFilter, setActiveFilter] = useState<'baked' | 'orders' | 'received' | 'stock' | 'damaged'>('baked');
  const [searchQuery, setSearchQuery] = useState('');

  const [shopStock, setShopStock] = useState([
    { id: 1, item: 'White Loaf', quantity: 45, unit: 'Pieces', from: 'Inventory', time: 'Updated Now', status: 'Available', action: 'sell' },
  ]);

  const [bakedItems] = useState([]); 
  const [orders] = useState([]); 
  const [receivedLog] = useState([]); 
  const [damagedItems] = useState([]); 

  const stats = [
    { id: 'baked', label: 'Baked Items', value: bakedItems.length.toString(), sub: 'Incoming', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', value: orders.length.toString(), sub: 'My Requests', icon: Clock },
    { id: 'received', label: 'Received', value: receivedLog.length.toString(), sub: 'History', icon: Archive },
    { id: 'stock', label: 'Rest Products', value: shopStock.reduce((a,b)=>a+b.quantity,0).toString(), sub: 'In Stock', icon: Store },
    { id: 'damaged', label: 'Damaged', value: damagedItems.length.toString(), sub: 'Reported', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 px-4 md:px-8 pt-6">
        
        <div className="md:hidden flex items-center justify-center mb-6">
            <img src="/logo.png" alt="Shop Logo" className="h-14 w-auto object-contain" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => router.back()} 
               className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
             >
               <ArrowLeft size={20} />
             </button>
             <div>
               <h1 className="text-2xl font-extrabold text-[#5D4037] tracking-tight">
                 {branchName} Dashboard
               </h1>
               <p className="text-[#A67C37] text-sm font-medium flex items-center gap-2">
                 <MapPin size={14} /> Location: {branchName} Branch
               </p>
             </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              onClick={() => setActiveFilter(stat.id as any)}
              className={`p-5 rounded-2xl shadow-sm border flex flex-col items-center text-center transition-all cursor-pointer group ${
                activeFilter === stat.id 
                ? 'bg-[#5D4037] text-white border-[#5D4037] scale-[1.02] shadow-lg' 
                : 'bg-white border-gray-100 hover:border-[#A67C37] hover:shadow-md'
              }`}
            >
               <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                 activeFilter === stat.id ? 'bg-[#A67C37] text-white' : 'bg-[#EBE0CC]/40 text-[#5D4037]'
               }`}>
                 <stat.icon size={22} strokeWidth={2} />
               </div>
               <h3 className={`font-bold text-xs uppercase tracking-wide ${activeFilter === stat.id ? 'text-[#EBE0CC]' : 'text-gray-500'}`}>{stat.label}</h3>
               <p className={`text-2xl font-extrabold mt-1 ${activeFilter === stat.id ? 'text-white' : 'text-[#5D4037]'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-lg font-bold text-[#5D4037] capitalize flex items-center gap-2">
               {activeFilter === 'stock' ? 'Rest Products' : activeFilter} List
            </h2>
             {activeFilter === 'stock' && (
               <button 
                 onClick={() => router.push(`/shop-manager/${rawBranchId}/add`)} 
                 className="bg-[#A67C37] hover:bg-[#8c672d] text-white text-xs font-bold uppercase px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
               >
                 <Plus size={16} strokeWidth={3} /> Add Product
               </button>
             )}
          </div>
          
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[300px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#A67C37] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Item Name</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE0CC]/30">
                  {shopStock.map((item) => (
                    <tr key={item.id} className="hover:bg-[#EBE0CC]/10 transition-colors">
                      <td className="px-6 py-5 font-bold text-[#5D4037]">{item.item}</td>
                      <td className="px-6 py-5 text-gray-700 font-bold">{item.quantity} {item.unit}</td>
                      <td className="px-6 py-5">
                        <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}