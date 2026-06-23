'use client';

import React, { useState, useEffect } from 'react';
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
  History,
  Cake,
  Target,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SalesCoordinatorDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('Dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE FOR BACKEND API DATA ---
  const [apiData, setApiData] = useState({
    shop_requests: 0,
    cake_orders: 0,
    baked_products: 0,
    delivered_products: 0,
    stock: 0,
    damaged_products: 0,
    history: 0,
    targets: 0
  });

  // --- STATE FOR DETAILED LISTS ---
  const [detailedLists, setDetailedLists] = useState({
    Requests: [] as any[],
    CakeOrders: [] as any[],
    Baked: [] as any[],
    Delivered: [] as any[],
    Stock: [] as any[],
    Damaged: [] as any[],
    History: [] as any[],
    Targets: [] as any[]
  });

  // --- BRANCH FILTER STATE (used for Requests, Cake Orders, Stock, Damaged) ---
  const [branchFilter, setBranchFilter] = useState<'all' | 'kabuga' | 'masaka'>('all');

  // --- ZOOM IMAGE MODAL STATE ---
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [selectedCakeOrderDetail, setSelectedCakeOrderDetail] = useState<any>(null);
  const [showCakeDetailModal, setShowCakeDetailModal] = useState(false);

  // --- FETCH WITH RETRY HELPER ---
  const fetchWithRetry = async (
    url: string,
    options: { headers: any; retries?: number; timeout?: number } = { headers: {} }
  ): Promise<Response> => {
    const { headers, retries = 3, timeout = 15000 } = options;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(fullUrl, {
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        if (attempt === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    throw new Error(`Failed to fetch ${url} after ${retries} retries`);
  };

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchSalesData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
        const headers = { 'Authorization': `Bearer ${token}` };

 // 1. Fetch Dashboard Summary
const summaryResponse = await fetchWithRetry(
  '/sales/dashboard', // 👉 FIX: Removed /api
  { headers, retries: 3, timeout: 15000 }
);

console.log("Summary Response:", summaryResponse);

if (summaryResponse.ok) {
  const summary = await summaryResponse.json();

  console.log("Dashboard Summary Data:", summary);

  setApiData(prev => ({
            ...prev,
            shop_requests: summary.shop_requests || 0,
            cake_orders: summary.cake_orders || 0,
            baked_products: summary.baked_products || 0,
            delivered_products: summary.delivered_products || 0,
            stock: summary.shop_stock || 0,
            damaged_products: summary.damaged_products || 0,
            history: summary.cake_orders || 0,
          }));
        }

        // 2. Fetch all detailed data from the correct endpoints
        // 👉 FIX: Removed /api from all 8 of these URLs!
        const [requestsRes, cakeRes, bakedRes, deliveredRes, stockRes, damagedRes, historyRes, targetsRes] = await Promise.all([
  fetchWithRetry('/sales/requests', { headers, retries: 3, timeout: 15000 }),
  fetchWithRetry('/sales/cake-orders', { headers, retries: 3, timeout: 15000 }),
  fetchWithRetry('/sales/baked', { headers, retries: 3, timeout: 15000 }),
  fetchWithRetry('/sales/delivered', { headers, retries: 3, timeout: 15000 }),
  fetchWithRetry('/sales/stock', { headers, retries: 3, timeout: 15000 }),
  fetchWithRetry('/sales/damaged', { headers, retries: 3, timeout: 15000 }),
  fetchWithRetry('/sales/history', { headers, retries: 3, timeout: 15000 }),
  fetchWithRetry('/sales/targets', { headers, retries: 3, timeout: 15000 })
]);

        // 👉 THE BULLETPROOF FIX: Automatically finds the array no matter how the backend wrapped it!
        const safeArray = async (res: any) => {
          if (!res.ok) return [];
          try {
            const json = await res.json();
            if (Array.isArray(json)) return json;
            if (json.data && Array.isArray(json.data)) return json.data;
            
            // If the backend wrapped it in something weird like { cake_orders: [...] }, find it:
            const foundArray = Object.values(json).find(val => Array.isArray(val));
            return foundArray || [];
          } catch (e) {
            return [];
          }
        };

        const requestsData = await safeArray(requestsRes);
        const cakeData = await safeArray(cakeRes);
        const bakedData = await safeArray(bakedRes);
        const deliveredData = await safeArray(deliveredRes);
        const stockData = await safeArray(stockRes);
        const damagedData = await safeArray(damagedRes);
        const historyData = await safeArray(historyRes);
        const targetsData = await safeArray(targetsRes);

        setApiData(prev => ({ ...prev, targets: targetsData.length }));
        setDetailedLists({
          Requests: requestsData.flatMap((r: any) =>
            (r.items || []).map((item: any) => ({
              id: item.id,
              orderId: r.id,
              item: item.product?.name || item.product_name || 'Unknown Product',
              qty: `${item.quantity || 0} pcs`,
              stock: `${r.location || 'Branch'} Request`,
              location: r.location,
              time: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
              status: r.status || 'pending'
            }))
          ),
          CakeOrders: cakeData.map((c: any) => ({
            id: c.id,
            item: c.cake_type,
            qty: `Code: CK-${c.id}`,
            stock: `Customer: ${c.customer_name}`,
            location: c.location,
            time: c.delivery_date || 'N/A',
            status: c.status || 'pending',
            // NEW FIELDS for image and pickup details
            imageUrl: c.inspo_image_url || null,
            payerName: c.payer_name || c.customer_name || '—',
            pickupPerson: c.pickup_person || c.customer_name || '—'
          })),
          Baked: bakedData.map((b: any) => ({
            id: b.id,
            item: b.product?.name || 'Baked Item',
            qty: `${b.quantity} pcs`,
            time: b.created_at ? new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Latest'
          })),
          Delivered: deliveredData.map((d: any) => ({
            id: d.id,
            item: d.product?.name || 'Product',
            qty: `${d.quantity} pcs`,
            stock: `To: ${d.to_location || 'branch'}`,
            time: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Latest',
            status: 'Delivered'
          })),
          Stock: (() => {
  // Create a map from product name to total stock quantity
  const stockMap = new Map<string, number>();
  stockData.forEach((s: any) => {
    const name = s.product?.name || 'Unknown';
    stockMap.set(name, (stockMap.get(name) || 0) + (s.quantity || 0));
  });

  return Array.from(stockMap.entries())
    .map(([name, qty]) => ({
      id: name,
      item: name,
      qty: `${qty} pcs`,
      location: 'Shop',
      time: qty > 0 ? 'In Stock' : 'No Stock',
    }))
    .filter(item => parseInt(item.qty) > 0);
})(),
          Damaged: damagedData.map((d: any) => ({
            id: d.id,
            item: d.product?.name || 'Unknown',
            qty: `${d.quantity} pcs`,
            location: d.location || 'Reported',
            time: d.created_at ? new Date(d.created_at).toLocaleString() : 'Latest',
            reason: d.reason || 'N/A',
          })),
         // 👉 THE FIX: Filters out regular products so ONLY Cake Orders show in History!
          History: historyData
            .filter((h: any) => h.cake_type || h.customer_name) // If it doesn't have a customer or cake type, ignore it!
            .map((h: any) => ({
              id: h.id,
              item: h.cake_type || 'Custom Cake',
              qty: `Code: CK-${h.id}`,
              stock: `Customer: ${h.customer_name || 'Unknown'}`,
              time: h.delivery_date || h.date || h.created_at || 'N/A',
              status: h.status || 'Delivered'
            })),
          Targets: targetsData.map((t: any) => ({
            id: t.id,
            item: t.product_name || 'Product',
            qty: `${t.actual_volume || 0} / ${t.target_volume || 0}`,
            stock: 'Target Volume',
            time: 'Active Tracker',
            status: t.status || 'Pending'
          }))
        });
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [router]);

  // --- 1. DATA CONFIGURATION ---
  const stats = [
    {
      label: 'Requests',
      fullLabel: 'Shop Requests',
      value: apiData.shop_requests.toString(),
      sub: 'Pending branch orders',
      icon: ClipboardList,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Cake Orders',
      fullLabel: 'Customers Cake Orders',
      value: apiData.cake_orders.toString(),
      sub: 'Pending cake orders',
      icon: Cake,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Baked',
      fullLabel: 'Baked Products',
      value: apiData.baked_products.toString(),
      sub: 'Ready from production',
      icon: ChefHat,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Delivered',
      fullLabel: 'Delivered Products',
      value: apiData.delivered_products.toString(),
      sub: 'Sent to branches',
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Stock',
      fullLabel: 'Shop Stock',
      value: apiData.stock.toString(),
      sub: 'Available in branches',
      icon: Store,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Damaged',
      fullLabel: 'Damaged Products',
      value: apiData.damaged_products.toString(),
      sub: 'Recorded losses',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'History',
      fullLabel: 'Cake Orders History',
      value: apiData.history.toString(),
      sub: 'Coordinator cake orders',
      icon: History,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Targets',
      fullLabel: 'Sales Targets',
      value: apiData.targets.toString(),
      sub: 'Monitored quotas',
      icon: Target,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  // --- 2. TABLE DATA GENERATOR (with branch filtering) ---
  const getDataForView = (view: string) => {
    switch (view) {
      case 'Requests':
        return detailedLists.Requests.filter(
          req => branchFilter === 'all' || req.location === branchFilter
        );
      case 'Cake Orders':
        return detailedLists.CakeOrders.filter(
          cake => branchFilter === 'all' || 
                  (cake.location && cake.location.toLowerCase() === branchFilter.toLowerCase())
        );
      case 'Baked':
        return detailedLists.Baked;
      case 'Delivered':
        return detailedLists.Delivered;
      case 'Stock':
        return detailedLists.Stock.filter(
          stock => branchFilter === 'all' || stock.location === branchFilter
        );
      case 'Damaged':
        return detailedLists.Damaged.filter(
          damaged => branchFilter === 'all' || damaged.location === branchFilter
        );
      case 'History':
        return detailedLists.History;
      case 'Targets':
        return detailedLists.Targets;
      default:
        return [];
    }
  };

  // --- 3. TABLE COLUMN DEFINITIONS (based on currentView) ---
  const getTableColumns = (view: string) => {
    const baseColumns = [
      { label: 'Item Name', key: 'item', align: 'text-left' },
      { label: 'Quantity', key: 'qty', align: 'text-center' },
    ];

    switch (view) {
      case 'Baked':
        return [
          ...baseColumns,
          { label: 'Timestamp', key: 'time', align: 'text-right' },
        ];
      case 'Damaged':
        return [
          ...baseColumns,
          { label: 'Date/Time', key: 'time', align: 'text-center' },
          { label: 'Reason', key: 'reason', align: 'text-right' },
        ];
      case 'Stock':
        return [
          ...baseColumns,
          { label: 'Date/Time', key: 'time', align: 'text-right' },
        ];
      case 'History':
        return [
          ...baseColumns,
          { label: 'Customer', key: 'stock', align: 'text-left' },
          { label: 'Date/Time', key: 'time', align: 'text-center' },
          { label: 'Status', key: 'status', align: 'text-right' },
        ];
      case 'Cake Orders':
        // NEW: Custom columns for Cake Orders including image, payer, pickup
        return [
          { label: 'Item Name', key: 'item', align: 'text-left' },
          { label: 'Quantity', key: 'qty', align: 'text-center' },
          { label: 'Customer', key: 'stock', align: 'text-left' },
          { label: 'Image', key: 'image', align: 'text-center' },
          { label: 'Payer Name', key: 'payerName', align: 'text-left' },
          { label: 'Pickup By', key: 'pickupPerson', align: 'text-left' },
          { label: 'Pickup Location', key: 'location', align: 'text-left' },
          { label: 'Delivery Date', key: 'time', align: 'text-center' },
          { label: 'Status', key: 'status', align: 'text-right' },
        ];
      default:
        return [
          ...baseColumns,
          { label: 'Source / Location', key: 'stock', align: 'text-left' },
          { label: 'Timestamp', key: 'time', align: 'text-center' },
          { label: 'Status', key: 'status', align: 'text-right' },
        ];
    }
  };

  // --- FETCH SINGLE CAKE ORDER DETAIL ---
  const fetchCakeOrderDetail = async (id: number | string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await fetchWithRetry(`/api/sales/cake-orders/${id}`, { headers, retries: 3, timeout: 15000 });
      if (res.ok) {
        const data = await res.json();
        setSelectedCakeOrderDetail(data);
        setShowCakeDetailModal(true);
      } else {
        // fallback: try to locate in loaded list
        const found = detailedLists.CakeOrders.find(c => String(c.id) === String(id));
        if (found) {
          setSelectedCakeOrderDetail(found);
          setShowCakeDetailModal(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cake order detail', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      {/* --- CAKE ORDER DETAIL MODAL (standalone) --- */}
{showCakeDetailModal && selectedCakeOrderDetail && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 no-print">
    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-[#F57C00] text-white p-4 flex justify-between items-center">
        <h3 className="font-black uppercase text-sm">Cake Order #{selectedCakeOrderDetail.id}</h3>
        <button onClick={() => setShowCakeDetailModal(false)} className="text-white hover:opacity-80">
          <X size={20} />
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><strong>Customer:</strong> {selectedCakeOrderDetail.customer_name}</div>
        <div><strong>Phone:</strong> {selectedCakeOrderDetail.phone}</div>
        <div><strong>Cake Type:</strong> {selectedCakeOrderDetail.cake_type}</div>
        <div><strong>Quantity:</strong> {selectedCakeOrderDetail.quantity}</div>
        <div><strong>Price:</strong> {selectedCakeOrderDetail.price} RWF</div>
        <div><strong>Advance Payment:</strong> {selectedCakeOrderDetail.advance_payment} RWF</div>
        <div><strong>Remaining:</strong> {selectedCakeOrderDetail.remaining_payment} RWF</div>
        <div><strong>Total Paid:</strong> {selectedCakeOrderDetail.total_paid} RWF</div>
        <div><strong>Location:</strong> {selectedCakeOrderDetail.location}</div>
        <div><strong>Delivery Date:</strong> {selectedCakeOrderDetail.delivery_date}</div>
        <div><strong>Status:</strong> {selectedCakeOrderDetail.status}</div>
        <div><strong>Cake Message:</strong> {selectedCakeOrderDetail.cake_message}</div>
        <div><strong>Cake Size:</strong> {selectedCakeOrderDetail.cake_size}</div>
        <div><strong>Frosting Cream:</strong> {selectedCakeOrderDetail.frosting_cream}</div>
        <div><strong>Frosting Color:</strong> {selectedCakeOrderDetail.frosting_color}</div>
        <div><strong>Special Instructions:</strong> {selectedCakeOrderDetail.special_instructions}</div>
        <div><strong>Reception Location:</strong> {selectedCakeOrderDetail.reception_location}</div>
        <div><strong>Needs Sample:</strong> {selectedCakeOrderDetail.needs_sample ? 'Yes' : 'No'}</div>
        {selectedCakeOrderDetail.inspo_image_url && (
          <div className="col-span-2">
            <strong>Inspiration Image:</strong><br />
            <img src={selectedCakeOrderDetail.inspo_image_url} alt="Cake inspo" className="max-h-48 rounded-xl mt-2" />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 p-4">
        <button onClick={() => setShowCakeDetailModal(false)} className="px-6 py-2 border border-gray-300 rounded-xl font-black uppercase text-xs">Close</button>
      </div>
    </div>
  </div>
)}
       {/* --- IMAGE ZOOM MODAL --- */}
{showZoomModal && zoomImageUrl && (
  <div 
    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[250] p-4 no-print"
    onClick={() => setShowZoomModal(false)}
  >
    <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setShowZoomModal(false)}
        className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} />
      </button>
      <img 
        src={zoomImageUrl} 
        alt="Zoomed cake" 
        className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
      />
    </div>
  </div>
)}
      {currentView === 'Dashboard' && (
        <>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Coordinator</h1>
            <p className="text-gray-500 text-sm mt-1">Track requests, stock, and product flow across branches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <p className="text-3xl font-black text-gray-900 mt-1">
                    {isLoading ? '...' : stat.value}
                  </p>
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

              {(currentView === 'Requests' || currentView === 'Cake Orders' || currentView === 'Stock' || currentView === 'Damaged') && (
                <div className="flex gap-2">
                  {(['all', 'kabuga', 'masaka'] as const).map(branch => (
                    <button
                      key={branch}
                      onClick={() => setBranchFilter(branch)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                        branchFilter === branch
                          ? 'bg-[#5D4037] text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}

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
                    {getTableColumns(currentView).map((col) => (
                      <th
                        key={col.key}
                        className={`px-8 py-4 text-xs font-bold text-gray-500 uppercase ${
                          col.align === 'text-center' ? 'text-center' : col.align === 'text-right' ? 'text-right' : ''
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {getDataForView(currentView).map((row) => (
                    <tr
  key={row.id}
  className="hover:bg-gray-50/50 transition-colors"
  onClick={() => {
    if (currentView === 'Cake Orders') {
      fetchCakeOrderDetail(row.id);
    }
  }}
  style={currentView === 'Cake Orders' ? { cursor: 'pointer' } : {}}
>
                      {getTableColumns(currentView).map((col) => {
                        // Special rendering for 'image' column in Cake Orders
                        if (currentView === 'Cake Orders' && col.key === 'image') {
                          return (
                            <td key={col.key} className="px-8 py-5 text-center">
                              {row.imageUrl ? (
                                <img 
                                  src={row.imageUrl} 
                                  alt="cake" 
                                  className="w-12 h-12 object-cover rounded-lg cursor-zoom-in hover:opacity-80 transition-opacity mx-auto"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setZoomImageUrl(row.imageUrl);
                                    setShowZoomModal(true);
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto" />
                              )}
                            </td>
                          );
                        }
                        
                        // Default cell rendering
                        return (
                          <td
                            key={col.key}
                            className={`px-8 py-5 ${
                              col.key === 'item' ? 'font-bold text-[#5D4037] text-sm' :
                              col.key === 'qty' ? 'text-center font-black text-gray-800 text-base' :
                              col.key === 'stock' || col.key === 'reason' || col.key === 'payerName' || col.key === 'pickupPerson' ? 'text-sm text-gray-500 font-medium' :
                              'text-sm text-gray-500 font-medium'
                            } ${
                              col.align === 'text-center' ? 'text-center' : col.align === 'text-right' ? 'text-right' : ''
                            }`}
                          >
                            {col.key === 'stock' && currentView !== 'Cake Orders' ? (
                              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                                <MapPin size={10} /> {row[col.key]}
                              </span>
                            ) : col.key === 'status' ? (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                row[col.key] === 'Ready' || row[col.key] === 'Approved' || row[col.key] === 'Selling' || row[col.key] === 'In Stock' || row[col.key] === 'Completed' ? 'bg-green-100 text-green-700' :
                                row[col.key] === 'Delivered' || row[col.key] === 'Archived' || row[col.key] === 'pending' ? 'bg-blue-100 text-blue-700' :
                                row[col.key] === 'Disposed' || row[col.key] === 'Returned' || row[col.key] === 'Waste' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {row[col.key]}
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                {col.key === 'time' && <Clock size={14} className="text-[#A67C37]" />}
                                {row[col.key]}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {getDataForView(currentView).length === 0 && !isLoading && (
              <div className="p-20 text-center uppercase font-black text-gray-300 tracking-widest">
                No records found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}