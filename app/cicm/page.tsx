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
  
  // Date filter for Revenue & Close Day views
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [allData, setAllData] = useState({
    baked_products: [],
    delivered_products: [],
    stock: [],
    damaged: [],
    orders: [],
    rest: '0'
  });
  
  // Revenue summary (total amount)
  const [revenueTotal, setRevenueTotal] = useState('0');
  
  // State for detailed table lists
  const [detailsList, setDetailsList] = useState<any[]>([]);

  // Master product list for resolving names
  const [masterProductList, setMasterProductList] = useState<any[]>([]);
  
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
        
       const queryParam = selectedBranch !== 'all' ? `?branch=${selectedBranch}` : '';
        
        // 👉 FIX: Fetch the detailed arrays instead of the pre-summed combined totals
        const [detailedRes, cakeRes] = await Promise.all([
          fetch(`${baseUrl}/reports/detailed${queryParam}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${baseUrl}/sales/cake-orders`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (detailedRes.ok) {
          const data = await detailedRes.json();
          
          let cakeOrders = [];
          if (cakeRes.ok) {
            cakeOrders = await cakeRes.json();
          }

          setAllData(prev => ({
            ...prev,
            baked_products: data.productions || [],
            delivered_products: data.deliveries || [],
            stock: data.shop_stock || [],
            damaged: data.damages || [],
            orders: cakeOrders || []
          }));
        }
// After setting allData, fetch close-day count for the card
        try {
          const branchParam = selectedBranch !== 'all' ? `&branch=${selectedBranch}` : '';
          const closeDayUrl = `${baseUrl}/reports/close-day?date=${selectedDate}${branchParam}`;
          const closeDayRes = await fetch(closeDayUrl, { headers: { 'Authorization': `Bearer ${token}` } });
          
          if (closeDayRes.ok) {
            const closeData = await closeDayRes.json();
            const productCount = (closeData.products || []).length;
            
            // 👉 FIX: Update allData, NOT apiData
            setAllData(prev => ({ ...prev, rest: productCount.toString() }));
          } else {
            setAllData(prev => ({ ...prev, rest: '0' }));
          }
        } catch (e) {
          console.error('Failed to fetch close-day count', e);
          setAllData(prev => ({ ...prev, rest: '0' }));
        }
        
        await fetchRevenueSummary();
        
      } catch (error) {
        console.error(`Failed to fetch CICM dashboard summary for ${selectedBranch}:`, error);
      }
    };

    fetchDashboardData();
  }, [router, selectedBranch, selectedDate]);

  // Fetch master product list for name resolution
  useEffect(() => {
    const fetchMasterProductList = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
        const res = await fetch(`${baseUrl}/storekeeper/available-stock`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMasterProductList(data.data || data || []);
        }
      } catch (err) {
        console.error('Failed to fetch master product list:', err);
      }
    };
    fetchMasterProductList();
  }, []);

  const resolveProductName = (row: any): string => {
    const direct = row.product?.name || row.product_name || row.name || row.item;
    if (direct) return direct;

    const productId = row.product_id || row.productId || row.product?.id || (typeof row.product !== 'object' ? row.product : null);
    if (productId) {
      const match = masterProductList.find((s: any) =>
        String(s.product_id) === String(productId) || String(s.id) === String(productId)
      );
      if (match) return match.product_name || match.name || match.product?.name || match.item;
    }
    return `Product #${productId ?? '?'}`;
  };

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
        // Revenue view – use close-day endpoint
        if (currentView === 'Revenue') {
          const branchParam = selectedBranch !== 'all' ? `&branch=${selectedBranch}` : '';
          const url = `${baseUrl}/reports/close-day?date=${selectedDate}${branchParam}`;
          const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
          
          if (response.ok) {
            const data = await response.json();
            const rows = (data.products || []).map((p: any) => ({
              id: p.product_name,
              item: p.product_name,
              soldQty: p.sold_qty || 0,
              unitPrice: p.unit_price || 0,
              totalRevenue: p.revenue || 0,
              remainingQty: p.remaining_quantity ?? p.remaining_qty ?? p.stock_remaining ?? p.end_of_day_remaining ?? p.remaining ?? null,
              unit: p.unit || 'pcs',
              status: 'Completed'
            }));
            setDetailsList(rows);
          } else {
            // Fallback
            const fallbackUrl = `${baseUrl}/reports/revenue?date=${selectedDate}${branchParam}`;
            const fallbackRes = await fetch(fallbackUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const rows: any[] = [];
              if (fallbackData.categories) {
                Object.entries(fallbackData.categories).forEach(([key, items]: [string, any]) => {
                  if (Array.isArray(items)) {
                    items.forEach((item: any) => {
                      const soldQty = item.qty ?? item.quantity ?? item.sold_qty ?? null;
                      const unitPrice = item.unit_price ?? item.price ?? (item.total && soldQty ? item.total / soldQty : null);
                      rows.push({
                        id: `${key}-${item.item}`,
                        item: item.item,
                        soldQty,
                        unitPrice,
                        totalRevenue: item.total,
                        remainingQty: item.remaining_quantity ?? item.remaining_qty ?? item.stock_remaining ?? item.remaining ?? null,
                        unit: item.unit || 'pcs',
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
        
        // For all other views, fetch from /reports/detailed
        const queryParam = selectedBranch !== 'all' ? `?branch=${selectedBranch}` : '';
        const response = await fetch(`${baseUrl}/reports/detailed${queryParam}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          const aggregateByProduct = (items: any[]) => {
            const map = new Map();
            items.forEach((item: any) => {
              const name = resolveProductName(item);
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
              item: resolveProductName(d),
              qty: `${d.quantity} pcs`,
              secondaryInfo: d.reported_by || 'Unknown',
              status: 'Loss'
            }));
            setDetailsList(damagedList);
          } 
          else if (currentView === 'Shop Stock') {
            const stockList = (data.shop_stock || [])
              .filter((s: any) => (s.quantity || 0) > 0) // 👉 ADD THIS LINE
              .map((s: any) => ({
                id: s.id,
                item: resolveProductName(s),
                qty: `${s.quantity} pcs`,
                secondaryInfo: 'Shop',
                status: 'In Stock'
              }));
            setDetailsList(stockList);
          }
         else if (currentView === 'Close Day') {
  const branchParam = selectedBranch !== 'all' ? `&branch=${selectedBranch}` : '';
  const url = `${baseUrl}/reports/close-day?date=${selectedDate}${branchParam}`;
  console.log('🔍 Fetching close-day URL:', url);
  const closeDayRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
  console.log('📡 Close-day response status:', closeDayRes.status);
  if (closeDayRes.ok) {
    const data = await closeDayRes.json();
    console.log('📦 Close-day raw data:', data);
    const rows = (data.products || []).map((p: any) => ({
      id: p.product_name || `product-${p.product_id}`,
      item: p.product_name,
      delivered: p.delivered_qty || 0,
      remaining: p.remaining_qty || 0,
      damaged: p.damaged_qty || 0,
      expired: p.expired_qty || 0,
      distributed: p.distributed_qty || 0,
      sold: p.sold_qty || 0,
      revenue: p.revenue || 0,
      unit: p.unit || 'pcs',
      status: 'Completed'
    }));
    setDetailsList(rows);
  } else {
    console.error('❌ Close-day fetch failed:', closeDayRes.status);
    setDetailsList([]);
  }
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
    return ['Delivered Products', 'Shop Stock', 'Close Day', 'Revenue'].includes(currentView);
  };

  const stats = [
    { 
      label: 'Baked Items', 
      // Add optional chaining (?.) and default to []
      value: new Set((allData.baked_products || []).map((i: any) => (i.item || 'unknown').toLowerCase().trim())).size.toString(), 
      sub: 'Completed Production', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' 
    },
    { 
      label: 'Delivered Products', 
      value: new Set((allData.delivered_products || []).map((i: any) => (i.item || 'unknown').toLowerCase().trim())).size.toString(), 
      sub: 'Dispatched to Branches', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' 
    },
    { 
      label: 'Shop Stock', 
      value: new Set((allData.stock || []).map((i: any) => (i.item || 'unknown').toLowerCase().trim())).size.toString(), 
      sub: 'Currently in Shops', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' 
    },
    { 
      label: 'Close Day', 
      value: allData.rest || '0', 
      sub: 'Storekeeper Closing Report', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' 
    },
    { 
      label: 'Damaged Items', 
      value: new Set((allData.damaged || []).map((i: any) => (i.item || 'unknown').toLowerCase().trim())).size.toString(), 
      sub: 'Total Losses', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' 
    },
    { 
      label: 'Live Cake Orders', 
      value: new Set((allData.orders || []).map((i: any) => (i.cake_type || 'unknown').toLowerCase().trim())).size.toString(), 
      sub: 'Custom Orders', icon: Cake, color: 'text-pink-600', bg: 'bg-pink-50' 
    },
    { 
      label: 'Revenue', 
      value: revenueTotal, 
      sub: 'Total Income', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' 
    },
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

             {/* Date picker for Revenue and Close Day */}
             {(currentView === 'Revenue' || currentView === 'Close Day') && (
               <div className="flex items-center gap-2">
                 <input
                   type="date"
                   value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}
                   className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                 />
               </div>
             )}
             
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
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Remaining (EOD)</th>
      </>
    ) : currentView === 'Close Day' ? (
      <>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Delivered</th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Remaining</th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Damaged</th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Expired</th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Distributed</th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Sold</th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Revenue</th>
      </>
    ) : (
      <>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Qty / Code</th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">
          {currentView === 'Damaged Items' ? 'Reported By' : 
           currentView === 'Live Cake Orders' ? 'Customer' : 
           'Branch / Location'}
        </th>
        <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
      </>
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
            <td className="px-8 py-5 text-center font-bold text-gray-800">
              {row.soldQty != null ? `${row.soldQty} ${row.unit || 'pcs'}` : '-'}
            </td>
            <td className="px-8 py-5 text-right font-bold text-gray-800">{row.unitPrice ? formatCurrency(row.unitPrice) : '-'}</td>
            <td className="px-8 py-5 text-right font-bold text-green-700">{formatCurrency(row.totalRevenue)}</td>
            <td className="px-8 py-5 text-center font-bold text-gray-800">
              {row.remainingQty != null ? `${row.remainingQty} ${row.unit || 'pcs'}` : '-'}
            </td>
          </>
        ) : currentView === 'Close Day' ? (
          <>
            <td className="px-8 py-5 text-center font-bold text-gray-800">{row.delivered}</td>
            <td className="px-8 py-5 text-center font-bold text-blue-600">{row.remaining}</td>
            <td className="px-8 py-5 text-center font-bold text-red-600">{row.damaged}</td>
            <td className="px-8 py-5 text-center font-bold text-orange-500">{row.expired}</td>
            <td className="px-8 py-5 text-center font-bold text-purple-600">{row.distributed}</td>
            <td className="px-8 py-5 text-center font-bold text-green-600">{row.sold}</td>
            <td className="px-8 py-5 text-right font-bold text-emerald-700">{formatCurrency(row.revenue)}</td>
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
      <td colSpan={currentView === 'Revenue' ? 5 : (currentView === 'Close Day' ? 8 : 4)} className="p-20 text-center text-gray-300 font-bold uppercase tracking-widest">
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