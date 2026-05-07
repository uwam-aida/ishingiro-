'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  AlertTriangle, 
  Printer, 
  ArrowLeft, 
  Calendar, 
  ShoppingCart, 
  MapPin,
  Trash2,
  PackageX
} from 'lucide-react';

export default function ChiefFinanceDashboard() {
  const router = useRouter();

  // 1. STATE MANAGEMENT
  const [selectedBranch, setSelectedBranch] = useState<'All' | 'Kabuga' | 'Masaka'>('All');
  const [activeView, setActiveView] = useState<'Overview' | 'Transactions' | 'Losses'>('Overview');
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: MISSING API STATES ---
  const [financeSummary, setFinanceSummary] = useState<any>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [measuredProducts, setMeasuredProducts] = useState<any[]>([]);

  // 2. DATA STATE (Initialized with Mock Data as a fallback)
  const [allData, setAllData] = useState<any[]>([
    { id: 1, item: 'White Bread', branch: 'Kabuga', baked: 200, sold: 150, damaged: 5, price: 1000, cost: 600, day: 'Mon', reason: 'Overbaked' },
    { id: 2, item: 'Vanilla Cake', branch: 'Kabuga', baked: 50, sold: 40, damaged: 2, price: 5000, cost: 3000, day: 'Fri', reason: 'Icing Smudged' },
    { id: 3, item: 'White Bread', branch: 'Masaka', baked: 150, sold: 130, damaged: 0, price: 1000, cost: 600, day: 'Fri', reason: 'None' },
    { id: 4, item: 'Donuts', branch: 'Masaka', baked: 300, sold: 250, damaged: 10, price: 500, cost: 200, day: 'Wed', reason: 'Stale' },
    { id: 5, item: 'Tea Scones', branch: 'Kabuga', baked: 100, sold: 90, damaged: 1, price: 200, cost: 100, day: 'Sun', reason: 'Dropped' },
  ]);

  const [chartData, setChartData] = useState<any[]>([
    { day: 'Mon', height: 45, amount: 450000 },
    { day: 'Tue', height: 30, amount: 300000 },
    { day: 'Wed', height: 60, amount: 600000 },
    { day: 'Thu', height: 50, amount: 500000 },
    { day: 'Fri', height: 85, amount: 850000 },
    { day: 'Sat', height: 70, amount: 700000 },
    { day: 'Sun', height: 95, amount: 950000 },
  ]);

  // --- 3. BACKEND API INTEGRATION ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchFinanceData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      try {
        // Fetch Ledger Data
        const ledgerRes = await fetch(`${baseUrl}/finance/ledger`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (ledgerRes.ok) {
          const fetchedData = await ledgerRes.json();
          if (fetchedData && fetchedData.length > 0) {
            // Map backend data to fit the frontend table structure
            const mappedLedger = fetchedData.map((d: any) => {
              
              // --- FIX: Using the newly added date fields from API to get the Day of the Week ---
              const dateObj = new Date(d.date || d.created_at);
              const dayStr = isNaN(dateObj.getTime()) ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];

              return {
                id: d.id,
                item: d.product?.name || `Product #${d.product_id}`,
                branch: d.location ? d.location.charAt(0).toUpperCase() + d.location.slice(1) : 'Kabuga',
                baked: d.baked || 0, 
                sold: d.reason ? 0 : d.quantity, 
                damaged: d.reason ? d.quantity : 0,
                price: d.product?.price || 0,
                cost: d.product?.cost || 0,
                day: dayStr, // Automatically formatted day
                reason: d.reason || 'None'
              };
            });
            setAllData(mappedLedger);
          }
        }

        // Fetch Chart Data
        const chartRes = await fetch(`${baseUrl}/finance/chart`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (chartRes.ok) {
          const fetchedChart = await chartRes.json();
          if (fetchedChart && fetchedChart.length > 0) {
            // Find max total to calculate dynamic bar heights
            const maxTotal = Math.max(...fetchedChart.map((c: any) => c.total));
            
            const mappedChart = fetchedChart.map((c: any) => {
              // Convert "2026-05-01" to "Fri"
              const dateObj = new Date(c.day);
              const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const dayName = isNaN(dateObj.getTime()) ? c.day : days[dateObj.getDay()];

              return {
                day: dayName,
                height: maxTotal > 0 ? (c.total / maxTotal) * 100 : 0,
                amount: c.total
              };
            });
            setChartData(mappedChart);
          }
        }

        // --- NEW: FETCH MISSING APIs ---
        try {
          const [summaryRes, analyticsRes, measuredRes] = await Promise.all([
            fetch(`${baseUrl}/finance`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${baseUrl}/finance/analytics/summary`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${baseUrl}/finance/measured-products`, { headers: { 'Authorization': `Bearer ${token}` } })
          ]);

          if (summaryRes.ok) setFinanceSummary(await summaryRes.json());
          if (analyticsRes.ok) setAnalyticsSummary(await analyticsRes.json());
          if (measuredRes.ok) setMeasuredProducts(await measuredRes.json());
        } catch (e) {
          console.error("Failed to fetch additional finance APIs", e);
        }

      } catch (error) {
        console.error("Failed to load live finance data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinanceData();
  }, [router]);

  // 4. CALCULATIONS
  const formatMoney = (amount: number) => `${amount.toLocaleString()} Frw`;

  const filteredData = useMemo(() => {
    let data = allData;
    if (selectedBranch !== 'All') data = data.filter(d => d.branch === selectedBranch);
    if (activeDay) data = data.filter(d => d.day === activeDay);
    return data;
  }, [selectedBranch, activeDay, allData]);

  const totalRevenue = filteredData.reduce((acc, curr) => acc + (curr.sold * curr.price), 0);
  const totalLoss = filteredData.reduce((acc, curr) => acc + (curr.damaged * curr.cost), 0);
  const netProfit = totalRevenue - (filteredData.reduce((acc, curr) => acc + (curr.baked * curr.cost), 0)) - totalLoss;

  const damagedItems = filteredData.filter(d => d.damaged > 0);

  return (
    <div className="space-y-8 pb-10 min-h-screen bg-[#FDFDFD]">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {(activeView !== 'Overview' || activeDay) && (
            <button 
              onClick={() => { setActiveView('Overview'); setActiveDay(null); }}
              className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 shadow-sm transition-all text-[#5D4037]"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-[#5D4037] tracking-tight uppercase">
              {activeView === 'Losses' ? 'Damage & Loss Report' : activeDay ? `${activeDay} Sales` : 'Financial Hub'}
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              {selectedBranch} Branch Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center shadow-sm">
             {['All', 'Kabuga', 'Masaka'].map((branch) => (
               <button
                 key={branch}
                 onClick={() => setSelectedBranch(branch as any)}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                   selectedBranch === branch ? 'bg-[#5D4037] text-white shadow-md' : 'text-gray-400 hover:text-[#5D4037]'
                 }`}
               >
                 {branch}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
        {/* Revenue Card */}
        <button 
          onClick={() => setActiveView('Overview')}
          className={`p-6 rounded-[32px] border transition-all text-left group ${activeView === 'Overview' && !activeDay ? 'bg-white border-[#5D4037] shadow-lg ring-4 ring-[#5D4037]/5' : 'bg-white border-gray-100 shadow-sm hover:border-[#5D4037]'}`}
        >
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Revenue</p>
          <h2 className="text-3xl font-black text-[#5D4037] mt-1">{formatMoney(totalRevenue)}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
             <TrendingUp size={12} /> Live Performance
          </div>
        </button>

        {/* ✅ LOSS CARD (CLICKABLE) */}
        <button 
          onClick={() => setActiveView('Losses')}
          className={`p-6 rounded-[32px] border transition-all text-left group relative overflow-hidden ${activeView === 'Losses' ? 'bg-white border-red-500 shadow-lg ring-4 ring-red-500/5' : 'bg-white border-gray-100 shadow-sm hover:border-red-200'}`}
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle size={100} className="text-red-600" />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Financial Loss</p>
          <h2 className="text-3xl font-black text-red-500 mt-1">{formatMoney(totalLoss)}</h2>
          <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 w-fit px-2 py-1 rounded-lg">
             <PackageX size={12} /> Click for Details
          </div>
        </button>

        {/* Profit Card */}
        <div className="bg-[#5D4037] p-6 rounded-[32px] shadow-xl text-white relative overflow-hidden">
          <p className="text-[#EBE0CC] text-[10px] font-black uppercase tracking-widest">Net Profit</p>
          <h2 className="text-3xl font-black mt-1">{formatMoney(netProfit)}</h2>
          <p className="text-[10px] font-medium text-[#EBE0CC]/60 mt-4 italic">Post-production & damage deductions</p>
        </div>
      </div>

      {/* --- CONDITIONAL VIEW LOGIC --- */}
      
      {activeView === 'Overview' && !activeDay && (
        /* WEEKLY CHART */
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-96 flex flex-col animate-in slide-in-from-bottom-4">
          <h3 className="text-lg font-black text-[#5D4037] uppercase tracking-tighter">Revenue Growth</h3>
          <div className="flex-1 flex items-end justify-between gap-2 md:gap-6 mt-6 pb-2">
            {chartData.map((data, index) => (
              <div key={index} onClick={() => { setActiveDay(data.day); setActiveView('Transactions'); }} className="w-full flex flex-col items-center group cursor-pointer h-full justify-end">
                <div style={{ height: `${data.height}%` }} className="w-full max-w-[50px] rounded-t-2xl transition-all duration-300 bg-[#EBE0CC] group-hover:bg-[#5D4037]" />
                <span className="text-[10px] font-black mt-3 text-gray-400 group-hover:text-[#5D4037]">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'Transactions' && (
        /* SALES TRANSACTIONS TABLE */
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
           <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <h3 className="font-black text-[#5D4037] uppercase text-xs">Sales Record: {activeDay || 'All Time'}</h3>
           </div>
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400">
                 <tr>
                    <th className="px-8 py-4">Item</th>
                    <th className="px-8 py-4">Branch</th>
                    <th className="px-8 py-4 text-center">Sold</th>
                    <th className="px-8 py-4 text-right">Revenue</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredData.map((row) => (
                   <tr key={row.id} className="text-sm font-bold">
                      <td className="px-8 py-4 text-[#5D4037] uppercase">{row.item}</td>
                      <td className="px-8 py-4 text-gray-400 text-xs"><MapPin size={12} className="inline mr-1"/> {row.branch}</td>
                      <td className="px-8 py-4 text-center">{row.sold}</td>
                      <td className="px-8 py-4 text-right">{formatMoney(row.sold * row.price)}</td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeView === 'Losses' && (
        /* ✅ DAMAGES/LOSSES TABLE */
        <div className="bg-white rounded-[40px] border-2 border-red-50 shadow-xl overflow-hidden animate-in slide-in-from-right-4">
           <div className="p-6 border-b border-red-50 flex items-center justify-between bg-red-50/20">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                    <Trash2 size={24} />
                 </div>
                 <div>
                    <h3 className="font-black text-red-600 uppercase tracking-widest text-sm">Damage Audit Log</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Non-recoverable financial losses</p>
                 </div>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-red-50/10 text-red-400 text-[10px] uppercase font-black tracking-widest border-b border-red-50">
                    <tr>
                       <th className="px-8 py-5">Product Name</th>
                       <th className="px-8 py-5">Location</th>
                       <th className="px-8 py-5 text-center">Qty Damaged</th>
                       <th className="px-8 py-5">Reason / Note</th>
                       <th className="px-8 py-5 text-right font-black">Financial Loss</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-red-50/50">
                    {damagedItems.map((row) => (
                      <tr key={row.id} className="hover:bg-red-50/10 transition-colors">
                         <td className="px-8 py-5 font-black text-gray-900 text-sm uppercase">{row.item}</td>
                         <td className="px-8 py-5">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded-md">
                               {row.day} | {row.branch}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-center font-black text-red-600 text-lg">{row.damaged}</td>
                         <td className="px-8 py-5">
                            <span className="text-[11px] font-bold italic text-gray-400">{row.reason}</span>
                         </td>
                         <td className="px-8 py-5 text-right font-black text-red-600 bg-red-50/20">
                            {formatMoney(row.damaged * row.cost)}
                         </td>
                      </tr>
                    ))}
                    {damagedItems.length === 0 && (
                      <tr>
                         <td colSpan={5} className="px-8 py-24 text-center text-gray-400 font-bold italic">
                            Excellent! No damages recorded for this selection.
                         </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

    </div>
  );
}