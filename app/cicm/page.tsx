'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Cake,
  DollarSign,
  X
} from 'lucide-react';

export default function CICMDashboard() {
  const router = useRouter();
  
  // State to toggle between Dashboard view and Details view
  const [currentView, setCurrentView] = useState('Dashboard');
  
  // Branch filter – used inside detailed views for applicable categories
  const [selectedBranch, setSelectedBranch] = useState<'all' | 'kabuga' | 'masaka'>('all');
  
  // Date filter for Revenue view
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // --- STATE FOR BACKEND API DATA ---
  const [apiData, setApiData] = useState({
    baked: '0',
    delivered: '0',
    stock: '0', 
    rest: '0',
    damaged: '0',
    orders: '0 Active'
  });
  
  // Revenue summary (total amount)
  const [revenueTotal, setRevenueTotal] = useState('0');
  
  // State for detailed table lists
  const [detailsList, setDetailsList] = useState<any[]>([]);
  
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(amount);
  };

  // Helper to aggregate by product name (sum quantities)
  const aggregateByProduct = (items: any[]) => {
    const map = new Map();
    items.forEach((item: any) => {
      const name = item.product?.name || `Product #${item.product_id}`;
      const qty = item.quantity || 0;
      if (map.has(name)) {
        map.set(name, map.get(name) + qty);
      } else {
        map.set(name, qty);
      }
    });
    return Array.from(map.entries()).map(([name, totalQty]) => ({
      id: name,
      item: name,
      qty: `${totalQty} pcs`,
      secondaryInfo: items[0]?.location || items[0]?.to_location || 'Unknown',
      status: currentView === 'Baked Items' ? 'Baked' : 
              currentView === 'Delivered Products' ? 'Delivered' : 
              currentView === 'Damaged Items' ? 'Loss' : 'In Stock'
    }));
  };

  // --- 1. FETCH SUMMARY ON LOAD & WHEN BRANCH OR DATE CHANGES ---
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
        
        // Fetch revenue summary using the new close-day endpoint
        await fetchRevenueSummary();
        
      } catch (error) {
        console.error(`Failed to fetch CICM dashboard summary for ${selectedBranch}:`, error);
      }
    };

    fetchDashboardData();
  }, [router, selectedBranch, selectedDate]);

  // Fetch revenue summary from the new /reports/close-day endpoint
  const fetchRevenueSummary = async () => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    try {
      const branchParam = selectedBranch !== 'all' ? `&branch=${selectedBranch}` : '';
      const url = `${baseUrl}/reports/close-day?date=${selectedDate}${branchParam}`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (response.ok) {
        const data = await response.json();
        setRevenueTotal(data.grand_total ? formatCurrency(data.grand_total) : '0 RWF');
      } else {
        // Fallback to old revenue endpoint if new one not ready (optional)
        console.warn("New /reports/close-day endpoint not available, falling back to /reports/revenue");
        const fallbackUrl = `${baseUrl}/reports/revenue?date=${selectedDate}${branchParam}`;
        const fallbackRes = await fetch(fallbackUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setRevenueTotal(fallbackData.grand_total ? formatCurrency(fallbackData.grand_total) : '0 RWF');
        } else {
          setRevenueTotal('0 RWF');
        }
      }
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
      setRevenueTotal('0 RWF');
    }
  };

  // --- 2. FETCH DETAILED DATA WHEN A CARD IS CLICKED ---
  useEffect(() => {
    if (currentView === 'Dashboard') return;

    const fetchDetails = async () => {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      try {
        // Revenue view – use new close-day endpoint
        if (currentView === 'Revenue') {
          const branchParam = selectedBranch !== 'all' ? `&branch=${selectedBranch}` : '';
          const url = `${baseUrl}/reports/close-day?date=${selectedDate}${branchParam}`;
          const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
          
          if (response.ok) {
            const data = await response.json();
            // Expecting { products: [{ product_name, sold_qty, unit_price, revenue }] }
            const rows = (data.products || []).map((p: any) => ({
              id: p.product_name,
              item: p.product_name,
              soldQty: p.sold_qty || 0,
              unitPrice: p.unit_price || 0,
              totalRevenue: p.revenue || 0,
              status: 'Completed'
            }));
            setDetailsList(rows);
          } else {
            // Fallback to old revenue endpoint (aggregated by category)
            const fallbackUrl = `${baseUrl}/reports/revenue?date=${selectedDate}${branchParam}`;
            const fallbackRes = await fetch(fallbackUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const rows: any[] = [];
              if (fallbackData.categories) {
                Object.entries(fallbackData.categories).forEach(([key, items]: [string, any]) => {
                  if (Array.isArray(items)) {
                    items.forEach((item: any) => {
                      rows.push({
                        id: `${key}-${item.item}`,
                        item: item.item,
                        soldQty: null,
                        unitPrice: null,
                        totalRevenue: item.total,
                        status: 'Completed'
                      });
                    });
                  }
                });
              }
              setDetailsList(rows);
            } else {
              setDetailsList([]);
            }
          }
          return;
        }
        
        // For all other views, fetch from /reports/detailed (unchanged)
        const queryParam = selectedBranch !== 'all' ? `?branch=${selectedBranch}` : '';
        const response = await fetch(`${baseUrl}/reports/detailed${queryParam}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Helper to aggregate by product name (sum quantities)
          const aggregateByProduct = (items: any[]) => {
            const map = new Map();
            items.forEach((item: any) => {
              const name = item.product?.name || `Product #${item.product_id}`;
              const qty = item.quantity || 0;
              if (map.has(name)) {
                map.set(name, map.get(name) + qty);
              } else {
                map.set(name, qty);
              }
            });
            return Array.from(map.entries()).map(([name, totalQty]) => ({
              id: name,
              item: name,
              qty: `${totalQty} pcs`,
              secondaryInfo: items[0]?.location || items[0]?.to_location || 'Unknown',
              status: currentView === 'Baked Items' ? 'Baked' : 
                      currentView === 'Delivered Products' ? 'Delivered' : 
                      currentView === 'Damaged Items' ? 'Loss' : 'In Stock'
            }));
          };

          if (currentView === 'Baked Items') {
            setDetailsList(aggregateByProduct(data.productions || []));
          } 
          else if (currentView === 'Delivered Products') {
            setDetailsList(aggregateByProduct(data.deliveries || []));
          } 
          else if (currentView === 'Damaged Items') {
            const damagedList = (data.damages || []).map((d: any) => ({
              id: d.id,
              item: d.product?.name || `Product #${d.product_id}`,
              qty: `${d.quantity} pcs`,
              secondaryInfo: d.reported_by || 'Unknown',
              status: 'Loss'
            }));
            setDetailsList(damagedList);
          } 
          else if (currentView === 'Shop Stock') {
            const stockList = (data.shop_stock || []).map((s: any) => ({
              id: s.id,
              item: s.product?.name || `Product #${s.product_id}`,
              qty: `${s.quantity} pcs`,
              secondaryInfo: 'Shop',
              status: 'In Stock'
            }));
            setDetailsList(stockList);
          } 
      else if (currentView === 'Rest Products') {
  const branches = selectedBranch === 'all' ? ['kabuga', 'masaka'] : [selectedBranch];
  let allRows: any[] = [];

  for (const branch of branches) {
const url = `/api/sales/global-available-stock/${branch}`;
 const stockRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    if (stockRes.ok) {
      const data = await stockRes.json();
      const rows = (data.data || []).map((item: any) => ({
        id: item.product_id,
        item: item.product_name,
        physical: item.physical_quantity || 0,
        requested: item.requested_quantity || 0,
        available: item.available_quantity || 0,
        unit: item.unit || 'pcs',
        branch: branch // optional, for display
      }));
      allRows = allRows.concat(rows);
    }
  }

  // If "all", merge products by summing quantities (same product in both branches)
  if (selectedBranch === 'all') {
    const merged = new Map();
    allRows.forEach(row => {
      if (merged.has(row.id)) {
        const existing = merged.get(row.id);
        existing.physical += row.physical;
        existing.requested += row.requested;
        existing.available += row.available;
        // keep unit from first occurrence
      } else {
        merged.set(row.id, { ...row });
      }
    });
    allRows = Array.from(merged.values());
  }

  setDetailsList(allRows);

          } 
          else if (currentView === 'Live Cake Orders') {
            const cakeRes = await fetch(`${baseUrl}/sales/cake-orders`, { 
              headers: { 'Authorization': `Bearer ${token}` } 
            });
            if (cakeRes.ok) {
              const cakes = await cakeRes.json();
              const mapped = cakes.map((c: any) => ({
                id: c.id,
                item: c.cake_type || 'Unknown Cake',
                qty: `Code: KS-${c.id}`,
                secondaryInfo: c.customer_name || 'Unknown Customer',
                status: c.status || 'Pending'
              }));
              setDetailsList(mapped);
            } else {
              setDetailsList([]);
            }
          }
        }
      } catch (e) {
        console.error("Detail fetch error", e);
      }
    };

    fetchDetails();
  }, [currentView, selectedBranch, selectedDate]);

  // --- Determine if branch filter should be shown for current view ---
  const showBranchFilterInDetails = () => {
    return ['Delivered Products', 'Shop Stock', 'Rest Products', 'Revenue'].includes(currentView);
  };

  // --- GRID DATA (includes Revenue card) ---
  const stats = [
    { label: 'Baked Items', value: apiData.baked, sub: 'Completed Production', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Delivered Products', value: apiData.delivered, sub: 'Dispatched to Branches', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shop Stock', value: apiData.stock, sub: 'Currently in Shops', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rest Products', value: apiData.rest, sub: 'From Store Keeper', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Damaged Items', value: apiData.damaged, sub: 'Total Losses', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Live Cake Orders', value: apiData.orders, sub: 'Custom Orders', icon: Cake, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Revenue', value: revenueTotal, sub: 'Total Income', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
      {currentView === 'Dashboard' && (
        <div className="animate-in fade-in duration-500 space-y-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-sans">CICM Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Management Overview and Real-time Auditing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <button onClick={() => setCurrentView('Dashboard')} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5D4037] mb-6 text-sm font-bold transition-colors">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <h1 className="text-3xl font-bold text-gray-900">{currentView}</h1>
             
             {/* Branch Switcher – only shown for views that need it */}
             {showBranchFilterInDetails() && (
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
             )}
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">
                          {currentView === 'Revenue' ? 'Product' : 'Item'}
                        </th>
                        {currentView === 'Revenue' ? (
                          <>
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Sold Qty</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Unit Price</th>
                            <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Total Revenue</th>
                          </>
                        ) : (
                          <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Qty / Code</th>
                        )}
                        {currentView !== 'Revenue' && (
                          <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">
                            {currentView === 'Damaged Items' ? 'Reported By' : 
                             currentView === 'Live Cake Orders' ? 'Customer' : 
                             'Branch / Location'}
                          </th>
                        )}
                        {currentView !== 'Revenue' && (
                          <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {detailsList.length > 0 ? (
                        detailsList.map((row, index) => (
                          <tr key={`${row.id}-${index}`} className="hover:bg-gray-50/50">
                            <td className="px-8 py-5 font-bold text-[#5D4037] text-sm uppercase">{row.item}</td>
                            {currentView === 'Revenue' ? (
                              <>
                                <td className="px-8 py-5 text-center font-bold text-gray-800">{row.soldQty ?? '-'}</td>
                                <td className="px-8 py-5 text-right font-bold text-gray-800">{row.unitPrice ? formatCurrency(row.unitPrice) : '-'}</td>
                                <td className="px-8 py-5 text-right font-bold text-green-700">{formatCurrency(row.totalRevenue)}</td>
                              </>
                            ) : (
                              <>
                                <td className="px-8 py-5 text-center font-bold text-gray-800">{row.qty}</td>
                                <td className="px-8 py-5 text-sm text-gray-500 uppercase">{row.secondaryInfo || '—'}</td>
                                <td className="px-8 py-5 text-right">
                                  <span className={`${
                                    row.status === 'Loss' ? 'bg-red-100 text-red-700' : 
                                    row.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                                    'bg-green-100 text-green-700'
                                  } px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                                    {row.status}
                                  </span>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={currentView === 'Revenue' ? 4 : 4} className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest">
                            No detailed records found
                          </td>
                        </tr>
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