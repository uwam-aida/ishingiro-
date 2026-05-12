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
  Cake
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
    history: 0
  });

  // --- STATE FOR DETAILED LISTS ---
  const [detailedLists, setDetailedLists] = useState({
    Requests: [] as any[],
    CakeOrders: [] as any[],
    Baked: [] as any[],
    Delivered: [] as any[],
    Stock: [] as any[],
    Damaged: [] as any[],
    History: [] as any[]
  });

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
        
        // 1. Fetch Dashboard Summary (Section 7: Sales Coordinator)
        const summaryResponse = await fetch(`${baseUrl}/sales/dashboard`, { headers });
        if (summaryResponse.ok) {
          const summary = await summaryResponse.json();
          setApiData({
            shop_requests: summary.shop_requests || 0,
            cake_orders: summary.cake_orders || 0,
            baked_products: summary.baked_products || 0,
            delivered_products: summary.delivered_products || 0,
            stock: summary.shop_stock || 0, 
            damaged_products: summary.damaged_products || 0,
            history: summary.delivered_products || 0 // Using delivered count as history proxy
          });
        }

        // 2. Fetch Detailed Logs from Production, Stock, and Sales Endpoints
        const [prodDetailsRes, stockRes, cakeRes] = await Promise.all([
          fetch(`${baseUrl}/production/details`, { headers }), // For Requests, Baked, Delivered, Damaged
          fetch(`${baseUrl}/factory/stock`, { headers }),      // For Stock
          fetch(`${baseUrl}/sales/cake-orders`, { headers })   // For Cake Orders
        ]);

        const prodData = prodDetailsRes.ok ? await prodDetailsRes.json() : { productions: [], damages: [], deliveries: [], orders: [] };
        const stockData = stockRes.ok ? await stockRes.json() : [];
        const cakeData = cakeRes.ok ? await cakeRes.json() : [];

        setDetailedLists({
          // Requests mapped from production orders
          Requests: prodData.orders.map((r: any) => ({
            id: r.id, 
            item: r.location ? `${r.location.toUpperCase()} Order` : 'Order Batch', 
            qty: 'View Items', 
            stock: `${r.location} Request`, 
            time: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending', 
            status: r.status
          })),
          // Cake Orders from Sales section
          CakeOrders: cakeData.map((c: any) => ({
             id: c.id, 
             item: c.cake_type, 
             qty: `Code: CK-${c.id}`, 
             stock: `Customer: ${c.customer_name}`, 
             time: c.delivery_date || 'N/A', 
             status: c.status 
          })),
          // Baked products from production logs
          Baked: prodData.baked.map((b: any) => ({
             id: b.id, 
             item: b.product?.name || 'Baked Item', 
             qty: `${b.quantity} pcs`, 
             stock: `Factory - ${b.location}`, 
             time: b.created_at ? new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Latest', 
             status: 'Ready'
          })),
          // Delivered products from distribution logs
          Delivered: prodData.delivered.map((d: any) => ({
             id: d.id, 
             item: d.product?.name || 'Product', 
             qty: `${d.quantity} pcs`, 
             stock: `To: ${d.to_location}`, 
             time: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Latest', 
             status: 'Delivered'
          })),
          // Stock from Factory Stock endpoint
          Stock: stockData.map((s: any) => ({
             id: s.id, 
             item: s.product?.name || 'Unknown', 
             qty: `${s.quantity} pcs`, 
             stock: `${s.location} Inventory`, 
             time: 'In Store', 
             status: 'In Stock'
          })),
          // Damaged products from production logs
          Damaged: prodData.damaged.map((d: any) => ({
             id: d.id, 
             item: d.product?.name || 'Unknown', 
             qty: `${d.quantity} pcs`, 
             stock: d.location || 'Reported', 
             time: d.created_at ? new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Latest', 
             status: 'Waste'
          })),
          // History mapped from deliveries
          History: prodData.delivered.map((h: any) => ({
             id: h.id, 
             item: h.product?.name || 'Product', 
             qty: `${h.quantity} pcs`, 
             stock: `DELIVERY - ${h.to_location}`, 
             time: h.created_at ? new Date(h.created_at).toLocaleDateString() : 'Logged', 
             status: 'Archived'
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
      fullLabel: 'Full Added Products',
      value: apiData.history.toString(), 
      sub: 'Total lifetime logs', 
      icon: History, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
    },
  ];

  // --- 2. TABLE DATA GENERATOR ---
  const getDataForView = (view: string) => {
    switch (view) {
      case 'Requests': return detailedLists.Requests;
      case 'Cake Orders': return detailedLists.CakeOrders;
      case 'Baked': return detailedLists.Baked;
      case 'Delivered': return detailedLists.Delivered;
      case 'Stock': return detailedLists.Stock;
      case 'Damaged': return detailedLists.Damaged;
      case 'History': return detailedLists.History;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
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
                          row.status === 'Ready' || row.status === 'Approved' || row.status === 'Selling' || row.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                          row.status === 'Delivered' || row.status === 'Archived' ? 'bg-blue-100 text-blue-700' :
                          row.status === 'Disposed' || row.status === 'Returned' || row.status === 'Waste' ? 'bg-red-100 text-red-700' :
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