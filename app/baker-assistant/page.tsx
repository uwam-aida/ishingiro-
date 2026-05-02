'use client';

// 1. Added useEffect for the auth check
import React, { useState, useEffect } from 'react';
// 2. Added useRouter for navigation
import { useRouter } from 'next/navigation';
import { 
  ChefHat, 
  Trash2, 
  History, 
  ArrowLeft,
  Search,
  Package
  
} from 'lucide-react';

export default function BakerDashboard() {
  const router = useRouter(); // Initialize router
  const [currentView, setCurrentView] = useState('Dashboard');

  // --- NEW: AUTHENTICATION CHECK ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Kick them out if not logged in
    }
  }, [router]);

  // --- NEW: LOGOUT FUNCTION ---
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      if (token) {
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  // --- 1. THE THREE MAIN CATEGORIES ---
  const stats = [
    { label: 'Baked Products', value: '850', icon: ChefHat, color: 'bg-orange-50 text-[#F57C00]' },
    { label: 'Damaged Items', value: '14', icon: Trash2, color: 'bg-red-50 text-red-600' },
    { label: 'Full Added Products', value: '24', icon: History, color: 'bg-gray-100 text-black' },
  ];

  // --- 2. LIST DATA (Products inside each grid) ---
  const getGridData = (view: string) => {
    switch (view) {
      case 'Baked Products':
        return [
          { id: 'BK-001', item: 'Milk Bread', qty: '200 pcs', time: '08:30 AM', status: 'In Stock' },
          { id: 'BK-002', item: 'Tea Cake', qty: '50 pcs', time: '09:15 AM', status: 'In Stock' },
          { id: 'BK-003', item: 'Baguette', qty: '120 pcs', time: '10:00 AM', status: 'In Stock' },
        ];
      case 'Damaged Items':
        return [
          { id: 'DM-05', item: 'Burnt Baguette', qty: '8 pcs', reason: 'Oven Overheat', status: 'Waste' },
          { id: 'DM-06', item: 'Broken Cookies', qty: '2 kg', reason: 'Handling', status: 'Waste' },
        ];
      case 'Full Added Products':
        return [
          { id: 'LOG-1', item: 'Standard Loaf', qty: '300 pcs', date: 'Today', status: 'Verified' },
          { id: 'LOG-2', item: 'Small Milk', qty: '150 pcs', date: 'Today', status: 'Verified' },
          { id: 'LOG-3', item: 'Meat Sambusa', qty: '80 pcs', date: 'Today', status: 'Verified' },
        ];
      default: return [];
    }
  };

  const currentData = getGridData(currentView);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10 px-4 pt-4">
      
      {/* --- DASHBOARD VIEW --- */}
      {currentView === 'Dashboard' ? (
        <>
          {/* UPDATED HEADER: Now includes the Log Out button */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Baker Assistant</h1>
              <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">Ishingiro Production Management</p>
            </div>
           
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentView(stat.label)}
                className="bg-white p-10 rounded-[48px] border-2 border-transparent shadow-sm hover:border-[#F57C00] hover:shadow-xl transition-all text-left group active:scale-95 flex flex-col"
              >
                <div className={`w-16 h-16 rounded-3xl ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={32} />
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                    <h3 className="text-5xl font-black text-black tracking-tighter">{stat.value}</h3>
                    <div className="mb-2 p-2 bg-gray-50 rounded-full text-gray-300 group-hover:text-[#F57C00] transition-colors">
                        <PlusCircleIcon size={20} />
                    </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* --- PRODUCT LIST VIEW (When a Grid is Clicked) --- */
        <div className="animate-in slide-in-from-right-4 duration-400">
          <button 
            onClick={() => setCurrentView('Dashboard')}
            className="flex items-center gap-3 text-black font-black uppercase text-[10px] tracking-[0.2em] hover:text-[#F57C00] mb-10 transition-colors group"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-100 transition-colors">
                <ArrowLeft size={16} /> 
            </div>
            Back to Overview
          </button>

          <div className="bg-white rounded-[56px] border border-gray-100 shadow-2xl overflow-hidden mb-10">
            {/* Header of the List */}
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-black text-black uppercase tracking-tighter">{currentView}</h2>
                <p className="text-[#F57C00] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Current Shift Records</p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="SEARCH PRODUCTS..." 
                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-[#F57C00]/20 font-bold text-[10px] uppercase tracking-widest text-black" 
                />
              </div>
            </div>

            {/* The Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Product Info</th>
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-center">Qty / Batch</th>
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentData.map((row) => (
                    <tr key={row.id} className="hover:bg-orange-50/20 transition-colors">
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-black">
                                <Package size={22} />
                            </div>
                            <div>
                                <p className="font-black text-black uppercase text-sm tracking-tight">{row.item}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Ref: {row.id}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-center">
                        <span className="font-black text-black text-lg tracking-tighter">{row.qty}</span>
                      </td>
                      <td className="px-12 py-8 text-right">
                        <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
                            currentView === 'Damaged Items' ? 'bg-red-600 text-white' : 'bg-black text-white'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {currentData.length === 0 && (
                <div className="p-32 text-center uppercase font-black text-gray-200 text-xl tracking-[0.5em]">No Data</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple internal icon for the cards
function PlusCircleIcon({size}: {size: number}) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
        </svg>
    );
}