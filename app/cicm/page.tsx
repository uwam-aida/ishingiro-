'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Cake
} from 'lucide-react';

export default function CICMDashboard() {
  const router = useRouter();
  
  // State to toggle between Dashboard view and Details view
  const [currentView, setCurrentView] = useState('Dashboard');
  
  // --- NEW: STATE FOR BRANCH FILTERING ---
  const [selectedBranch, setSelectedBranch] = useState<'all' | 'kabuga' | 'masaka'>('all');

  // --- STATE FOR BACKEND API DATA ---
  const [apiData, setApiData] = useState({
    baked: '0',
    delivered: '0',
    stock: '0', 
    rest: '0',
    damaged: '0',
    orders: '0 Active'
  });

  // State for detailed table lists
  const [detailsList, setDetailsList] = useState<any[]>([]);

  // --- 1. FETCH SUMMARY ON LOAD & WHEN BRANCH CHANGES ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
        
        // Dynamically choose endpoint based on selected branch
        let endpoint = `${baseUrl}/reports/combined`;
        if (selectedBranch === 'kabuga') endpoint = `${baseUrl}/reports/kabuga`;
        if (selectedBranch === 'masaka') endpoint = `${baseUrl}/reports/masaka`;

        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setApiData({
            baked: data.baked ? data.baked.toLocaleString() : '0',
            delivered: data.delivered ? data.delivered.toLocaleString() : '0',
            stock: data.shop_stock ? data.shop_stock.toLocaleString() : '0', 
            rest: data.rest_products ? data.rest_products.toLocaleString() : '0',
            damaged: data.damage ? data.damage.toLocaleString() : '0',
            orders: data.orders ? `${data.orders} Active` : '0 Active'
          });
        }
      } catch (error) {
        console.error(`Failed to fetch CICM dashboard summary for ${selectedBranch}:`, error);
      }
    };

    fetchDashboardData();
  }, [router, selectedBranch]);

  // --- 2. FETCH DETAILED DATA WHEN A CARD OR BRANCH IS CLICKED ---
  useEffect(() => {
    if (currentView === 'Dashboard') return;

    const fetchDetails = async () => {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      try {
        // Append branch query if a specific branch is selected
        const queryParam = selectedBranch !== 'all' ? `?branch=${selectedBranch}` : '';
        const response = await fetch(`${baseUrl}/reports/detailed${queryParam}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Map backend detailed categories to the UI list
          if (currentView === 'Baked Items') {
            setDetailsList(data.productions?.map((p:any) => ({ id: p.id, item: p.product?.name || `Product #${p.product_id}`, qty: `${p.quantity} pcs`, loc: p.location, status: 'Baked' })) || []);
          } else if (currentView === 'Delivered Products') {
            setDetailsList(data.deliveries?.map((d:any) => ({ id: d.id, item: d.product?.name || `Product #${d.product_id}`, qty: `${d.quantity} pcs`, loc: d.to_location || 'Branch', status: 'Delivered' })) || []);
          } else if (currentView === 'Damaged Items') {
            setDetailsList(data.damages?.map((d:any) => ({ id: d.id, item: d.product?.name || `Product #${d.product_id}`, qty: `${d.quantity} pcs`, loc: d.location || 'Unknown', status: 'Loss' })) || []);
          } else if (currentView === 'Shop Stock') {
            setDetailsList(data.shop_stock?.map((s:any) => ({ id: s.id, item: s.product?.name || `Product #${s.product_id}`, qty: `${s.quantity} pcs`, loc: 'Shop', status: 'In Stock' })) || []);
          } else if (currentView === 'Live Cake Orders') {
             // Fetching from a different endpoint for cakes if available
             const cakeRes = await fetch(`${baseUrl}/sales/cake-orders`, { headers: { 'Authorization': `Bearer ${token}` }});
             if (cakeRes.ok) {
               const cakes = await cakeRes.json();
               // Filter cakes locally if branch is selected (assuming backend doesn't filter this endpoint by branch natively)
               let filteredCakes = cakes;
               if (selectedBranch !== 'all') {
                  filteredCakes = cakes.filter((c: any) => c.location === selectedBranch);
               }
               setDetailsList(filteredCakes.map((c:any) => ({ id: c.id, item: c.cake_type, qty: `Code: KS-${c.id}`, loc: c.location || 'Unknown', status: c.status })));
             }
          }
        }
      } catch (e) {
        console.error("Detail fetch error", e);
      }
    };

    fetchDetails();
  }, [currentView, selectedBranch]);

  // --- GRID DATA ---
  const stats = [
    { label: 'Baked Items', value: apiData.baked, sub: 'Completed Production', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Delivered Products', value: apiData.delivered, sub: 'Dispatched to Branches', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shop Stock', value: apiData.stock, sub: 'Currently in Shops', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rest Products', value: apiData.rest, sub: 'From Store Keeper', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Damaged Items', value: apiData.damaged, sub: 'Total Losses', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Live Cake Orders', value: apiData.orders, sub: 'Custom Orders', icon: Cake, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
       {currentView === 'Dashboard' && (
        <div className="animate-in fade-in duration-500 space-y-10">
          
          {/* Header & Branch Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-sans">CICM Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Management Overview and Real-time Auditing.</p>
            </div>
            
            {/* --- NEW: BRANCH SWITCHER UI --- */}
            <div className="bg-white border border-gray-200 p-1 rounded-2xl flex items-center shadow-sm w-full md:w-auto">
               {['all', 'kabuga', 'masaka'].map((branch) => (
                 <button
                   key={branch}
                   onClick={() => setSelectedBranch(branch as any)}
                   className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     selectedBranch === branch ? 'bg-[#5D4037] text-white shadow-md' : 'text-gray-400 hover:text-[#5D4037]'
                   }`}
                 >
                   {branch}
                 </button>
               ))}
            </div>
          </div>

          {/* 1. GRIDS */}
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
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <h1 className="text-3xl font-bold text-gray-900">{currentView}</h1>
             
             {/* --- DETAILS VIEW BRANCH SWITCHER --- */}
             <div className="bg-white border border-gray-200 p-1 rounded-2xl flex items-center shadow-sm w-full md:w-auto">
               {['all', 'kabuga', 'masaka'].map((branch) => (
                 <button
                   key={branch}
                   onClick={() => setSelectedBranch(branch as any)}
                   className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     selectedBranch === branch ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-900'
                   }`}
                 >
                   {branch}
                 </button>
               ))}
             </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50"><tr><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Item</th><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Qty / Code</th><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Branch / Loc</th><th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {detailsList.length > 0 ? (
                        detailsList.map((row, index) => (
                          <tr key={`${row.id}-${index}`} className="hover:bg-gray-50/50">
                             <td className="px-8 py-5 font-bold text-[#5D4037] text-sm uppercase">{row.item}</td>
                             <td className="px-8 py-5 text-center font-bold text-gray-800">{row.qty}</td>
                             <td className="px-8 py-5 text-sm text-gray-500 uppercase">{row.loc}</td>
                             <td className="px-8 py-5 text-right"><span className={`${row.status === 'Loss' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} px-3 py-1 rounded-full text-xs font-bold uppercase`}>{row.status}</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest">No detailed records found for {selectedBranch.toUpperCase()}</td></tr>
                      )}
                    </tbody>
                </table>
             </div>
          </div>
          </div>
      )}
     </div>
  );
}