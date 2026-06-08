
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Package, Clock, ShoppingBag, AlertCircle, Search, Archive, ArrowLeft, Store, Plus, MapPin, Bell, X, ShieldAlert, CheckCircle2, Trash2, Edit2, Check, History, Cake, ClipboardCheck } from 'lucide-react';

// --- OFFICIAL PRODUCT LIST (unchanged) ---
const MARKETING_PRODUCTS = [
     // BREAD (Baked)
    { name: 'big milk', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'small milk', price: 600, category: 'BREAD', type: 'baked' },
    { name: 'pcpn', price: 1100, category: 'BREAD', type: 'baked' },
    { name: 'sen', price: 1000, category: 'BREAD', type: 'baked' },
    { name: 'salted bread', price: 1100, category: 'BREAD', type: 'baked' },
    { name: 'baguette', price: 500, category: 'BREAD', type: 'baked' },
    { name: 'milk slice bread', price: 200, category: 'BREAD', type: 'baked' },
    { name: 'crubes', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'sen pieces', price: 100, category: 'BREAD', type: 'baked' },
    { name: 'brown sanduich', price: 250, category: 'BREAD', type: 'baked' },
    { name: 'mult graine', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'milk mult graine', price: 1000, category: 'BREAD', type: 'baked' },
    { name: 'brown bread', price: 800, category: 'BREAD', type: 'baked' },
 
    // CAKES (Baked)
    { name: 'tea cake', price: 1000, category: 'CAKES', type: 'baked' },
    { name: 'marble cake', price: 1200, category: 'CAKES', type: 'baked' },
    { name: 'brown cake', price: 250, category: 'CAKES', type: 'baked' },
    { name: 'oliver corn cake', price: 350, category: 'CAKES', type: 'baked' },
    { name: 'muffin cake', price: 170, category: 'CAKES', type: 'baked' },

    // AMANDAZI (Baked)
    { name: 'ishingiro', price: 150, category: 'AMANDAZI', type: 'baked' },
    { name: 's.begne', price: 70, category: 'AMANDAZI', type: 'baked' },
    { name: 'dark donut', price: 450, category: 'AMANDAZI', type: 'baked' },
    { name: 'choc donuts', price: 450, category: 'AMANDAZI', type: 'baked' },
    { name: 'kk donuts', price: 250, category: 'AMANDAZI', type: 'baked' },
    { name: 'triangle', price: 150, category: 'AMANDAZI', type: 'baked' },

    // OTHERS (Mixed)
    { name: 'meat samosa', price: 450, category: 'OTHERS', type: 'baked' },
    { name: 'biscuits', price: 85, category: 'OTHERS', type: 'baked' },
    { name: 'ISH.MILK Cookie', price: 130, category: 'OTHERS', type: 'baked' },
    { name: 'butter biscuits', price: 130, category: 'OTHERS', type: 'baked' },
    { name: 'chocolate biscuits', price: 140, category: 'OTHERS', type: 'baked' },
    { name: 'ubunyobwa', price: 1800, category: 'OTHERS', type: 'baked' },
    
    // UNBAKED OTHERS
    { name: 'ikinyuranyo 1kg', price: 1600, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 3kg', price: 4500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 5kg', price: 7500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo (0.5)kg', price: 1200, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 1kg', price: 1700, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 3kg', price: 4800, category: 'OTHERS', type: 'unbaked' },
    { name: 'cashnewnuts', price: 5500, category: 'OTHERS', type: 'unbaked' },
    { name: 'cornfresh cream', price: 500, category: 'OTHERS', type: 'unbaked' },

    // BIG CAKES (Baked)
    { name: 'cake 38000', price: 38000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 20000', price: 20000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 24000', price: 24000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 19000', price: 19000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake18000', price: 18000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 15000', price: 15000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 14000', price: 14000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 13000', price: 13000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 12000', price: 12000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 10000', price: 10000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 9000', price: 9000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 8000', price: 8000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 7000', price: 7000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 6000', price: 6000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 5000', price: 5000, category: 'BIG CAKES', type: 'baked' },
    { name: 'ADDCAKE', price: 2000, category: 'BIG CAKES', type: 'baked' },
];

export default function DynamicShopDashboard() {
  const router = useRouter(); 
  const params = useParams(); 
  const rawBranchId = params?.branchId;
  const branchIdString = rawBranchId?.toString().toLowerCase() || 'kabuga';

  // --- STATE (damage states removed, close day added) ---
  const [factoryStock, setFactoryStock] = useState(MARKETING_PRODUCTS.map(p => ({ 
    item: p.name, quantity: 100, unit: p.name.includes('kg') ? 'Kg' : 'Pieces', entryTime: '06:00 AM' 
  })));
  const [requestQty, setRequestQty] = useState('');
  // restQty removed

  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [receivedStock, setReceivedStock] = useState<any[]>([]);
  const [bakedProductsLog, setBakedProductsLog] = useState<any[]>([]);

  const [editingReceivedId, setEditingReceivedId] = useState<number | null>(null);
  const [editReceivedQty, setEditReceivedQty] = useState('');

  // Damage states removed completely

  const [myStock, setMyStock] = useState<any[]>([]);

  const [productSearch, setProductSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [cakeOrders, setCakeOrders] = useState<any[]>([]);
  const [realProducts, setRealProducts] = useState<any[]>([]);

  const [showRequestSuccess, setShowRequestSuccess] = useState(false);

  // --- Close Day state ---
  const [closeDayEntries, setCloseDayEntries] = useState<any[]>([]);
  const [isCloseDaySubmitting, setIsCloseDaySubmitting] = useState(false);

  // Search states
  const [orderSearch, setOrderSearch] = useState('');
  const [receivedSearch, setReceivedSearch] = useState('');
  const [cakeOrderSearch, setCakeOrderSearch] = useState('');
  const [bakedSearch, setBakedSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  // close day search
  const [closeDaySearch, setCloseDaySearch] = useState('');

  // --- 2. BACKEND WIRING (updated stock endpoint & mapping) ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    const fetchAllData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

            const productionRes = await fetch(`${baseUrl}/shop/baked-items`, { headers });
            if (productionRes.ok) {
                const prodData = await productionRes.json();
                if (prodData.length > 0) {
                    setBakedProductsLog(prodData.map((b: any) => ({
                        id: b.id,
                        item: b.product_name || 'Baked Item',
                        quantity: b.quantity,
                        time: b.time || (b.baked_at
                            ? new Date(b.baked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Logged'),
                    })));
                }
            }
                          const stockRes = await fetch(`${baseUrl}/stock/${branchIdString}`, { headers });
            if (stockRes.ok) {
                const stockData = await stockRes.json();
                if (stockData.length > 0) {
                    setMyStock(stockData.map((s: any) => ({
                        id: s.id,
                        product_id: s.product_id,
                        item: s.product?.name || 'Unknown',
                        quantity: s.quantity,
                        unit: s.unit || 'Pieces'
                    })));
                }
            }
            const ordRes = await fetch(`${baseUrl}/orders/${branchIdString}`, { headers });
            if (ordRes.ok) {
                const ordData = await ordRes.json();
                if(ordData.length > 0) {
                   const pendingOrders: any[] = [];
                   const dispatchedOrders: any[] = [];
                   
                  ordData.forEach((o: any) => {
                    o.items?.forEach((i: any) => {
                      const mappedItem = {
                        id: o.id, 
                        item: i.product?.name || `Order #${o.id}`,
                        quantity: i.quantity,
                        status: o.status,
                        time: o.created_at ? new Date(o.created_at).toLocaleString() : 'Unknown',
                        unit: 'Pieces',
                        arrivalTime: o.updated_at ? new Date(o.updated_at).toLocaleString() : 'Unknown'
                      };
                      if (o.status === 'pending') {
                        pendingOrders.push(mappedItem);
                      } else {
                        dispatchedOrders.push(mappedItem);
                      }
                    });
                  });

                   pendingOrders.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                   setMyRequests(pendingOrders);
                   setReceivedStock(dispatchedOrders);
                }
            }

            // Damage fetch removed

            const cakeRes = await fetch(`${baseUrl}/shop/cake-orders/${branchIdString}`, { headers });
            if (cakeRes.ok) {
                const cakeData = await cakeRes.json();
                if(cakeData.length > 0) {
                   const mappedCakes = cakeData.map((c:any) => ({ 
                     id: c.id, 
                     item: c.cake_type, 
                     code: `CK-${c.id}`, 
                     customer: c.customer_name,   
                     time: c.created_at ? new Date(c.created_at).toLocaleString() : (c.delivery_date || 'Pending')
                   }));
                   mappedCakes.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                   setCakeOrders(mappedCakes);
                }
            }

        } catch(e) { console.error("Failed to fetch shop data", e); }
    };

    fetchAllData();
  }, [router, branchIdString]);

  // --- LOGIC (damage removed) ---
  const filteredProducts = factoryStock.filter(p => p.item.toLowerCase().includes(productSearch.toLowerCase()));
  const isRequestNotFound = productSearch.length > 0 && filteredProducts.length === 0;

  const bakedItemsAvailable = selectedItem ? (factoryStock.find(s => s.item === selectedItem)?.quantity || 0) : 0;
  const isOverLimit = (parseInt(requestQty) || 0) > bakedItemsAvailable;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRequest = async () => {
    if (!requestQty || isOverLimit || !selectedItem) return;
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    
    const realDbProduct = realProducts.find(p => p.name.toLowerCase() === selectedItem.toLowerCase());
    const dbProductId = realDbProduct ? realDbProduct.id : 1;

    try {
      const response = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: branchIdString, 
          items: [{ product_id: dbProductId, quantity: parseInt(requestQty) }]
        })
      });
      if (response.ok) {
        setShowRequestSuccess(true);
        setTimeout(() => setShowRequestSuccess(false), 3000);
      } else {
        const error = await response.json();
        console.error("API Error:", error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }

    const qtyToDeduct = parseInt(requestQty);
    const currentTime = new Date().toLocaleString();
    setFactoryStock(prev => prev.map(s => s.item === selectedItem ? { ...s, quantity: s.quantity - qtyToDeduct } : s));
    setMyRequests([{ id: Date.now(), item: selectedItem, quantity: qtyToDeduct, status: 'Pending Dispatch', time: currentTime }, ...myRequests]);
    setRequestQty('');
    setProductSearch('');
    setSelectedItem(null);
  };

  // --- CLOSE DAY HANDLERS (payload updated to match API) ---
  const closeDayInitialised = useRef(false);

  useEffect(() => {
    if (myStock.length > 0 && !closeDayInitialised.current) {
      setCloseDayEntries(myStock.map(item => ({
        product_id: item.product_id,
        product_name: item.item,
        opening_stock: item.quantity,       // for display only
        remaining: '',
        damaged: '',
        expired: ''
      })));
      closeDayInitialised.current = true;
    }
  }, [myStock]);

  const handleCloseDaySubmit = async () => {
    setIsCloseDaySubmitting(true);
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    // Build payload according to the documented POST /api/shop/close-day
    const payload = {
      closing_date: new Date().toISOString().split('T')[0], // today's date
      products: closeDayEntries.map(entry => ({
        product_id: entry.product_id,
        remaining: parseInt(entry.remaining) || 0,
        damaged: parseInt(entry.damaged) || 0,
        expired: parseInt(entry.expired) || 0
      }))
    };

    try {
      const response = await fetch(`${baseUrl}/shop/close-day`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Close Day submitted successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Failed to submit Close Day. Please try again.");
      }
    } catch (error) {
      console.error("Close Day error", error);
      alert("Network error during Close Day submission.");
    } finally {
      setIsCloseDaySubmitting(false);
    }
  };

  const updateCloseDayEntry = (index: number, field: string, value: string) => {
    setCloseDayEntries(prev => prev.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const saveReceivedEdit = (id: number) => {
    setReceivedStock(prev => prev.map(item => item.id === id ? { ...item, quantity: parseInt(editReceivedQty) || item.quantity } : item));
    setEditingReceivedId(null);
  };

  const branchName = branchIdString === 'kabuga' ? 'KABUGA SHOP' : branchIdString === 'masaka' ? 'MASAKA SHOP' : 'BRANCH';

  // Active filter: removed 'damaged', added 'close_day'
  const [activeFilter, setActiveFilter] = useState<'baked' | 'orders' | 'cake_orders' | 'received' | 'stock' | 'close_day' | 'history'>('orders');

  const fullHistory = [
    ...myRequests.map(r => ({ category: 'Order', item: r.item, qty: r.quantity, time: r.time, color: 'text-blue-600' })),
    ...cakeOrders.map(c => ({ category: 'Cake', item: `${c.item} (${c.code})`, qty: 1, time: c.time, color: 'text-[#F57C00]' }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const stats = [
    { id: 'baked', label: 'Baked Items', icon: ShoppingBag, count: factoryStock.length },
    { id: 'orders', label: 'Orders', icon: Clock, count: myRequests.length },
    { id: 'cake_orders', label: 'Cake Orders', icon: Cake, count: cakeOrders.length },
    { id: 'received', label: 'Received', icon: Archive, count: receivedStock.length },
    { id: 'stock', label: 'My Stock', icon: Store, count: myStock.length },
    { id: 'close_day', label: 'Close Day', icon: ClipboardCheck, count: closeDayEntries.length },
    { id: 'history', label: 'Full History', icon: History, count: fullHistory.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans w-full overflow-x-hidden">
      
      {showRequestSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
            <div className="bg-green-50 text-green-700 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-green-200">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="font-black uppercase text-xs tracking-widest">Added Request</span>
            </div>
        </div>
      )}

      <div className="w-full max-w-full md:max-w-7xl mx-auto space-y-8 px-4 md:px-8 pt-6">
        <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-md py-4 border-b border-gray-200/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black text-black uppercase">{branchName} MANAGER</h1>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
          {stats.map((stat) => (
            <div 
                key={stat.id} 
                onClick={() => setActiveFilter(stat.id as any)} 
                className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                    activeFilter === stat.id 
                    ? (stat.id === 'history' ? 'bg-gray-800 text-white shadow-lg' : 'bg-[#F57C00] text-white shadow-lg') 
                    : (stat.id === 'history' ? 'bg-white hover:border-gray-800' : 'bg-white hover:border-[#F57C00]')
                }`}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                    activeFilter === stat.id 
                    ? 'bg-white/20' 
                    : (stat.id === 'history' ? 'bg-gray-50 text-gray-800' : 'bg-gray-50 text-[#F57C00]')
                }`}>
                  <stat.icon size={24} />
                </div>
                <h3 className="font-black text-[9px] md:text-[10px] uppercase tracking-widest opacity-80 leading-none mb-2">
                  {stat.label}
                </h3>
                <span className="text-2xl font-black leading-none text-inherit">
                  {stat.count}
                </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] w-full max-w-full">
          {/* STOCK TAB (unchanged) */}
          {activeFilter === 'stock' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest">MY STOCK</h2>
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  className="border-2 border-gray-200 p-2 rounded-xl text-sm outline-none focus:border-[#F57C00] w-64"
                />
              </div>
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4">Ingredient/Product</th>
                    <th className="px-8 py-4 text-center">In Store</th>
                    <th className="px-8 py-4 text-right">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myStock
                    .filter(s => s.item.toLowerCase().includes(stockSearch.toLowerCase()))
                    .map((s, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{s.item}</td>
                        <td className="px-8 py-6 text-center font-black text-lg text-gray-900">{s.quantity}</td>
                        <td className="px-8 py-6 text-right font-black text-[#F57C00] text-xs uppercase">{s.unit}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* HISTORY TAB (unchanged) */}
          {activeFilter === 'history' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Fully Added Products Log</h2>
                <input
                  type="text"
                  placeholder="Search history..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="border-2 border-gray-200 p-2 rounded-xl text-sm outline-none focus:border-gray-500 w-64"
                />
              </div>
              <table className="w-full min-w-[800px] whitespace-nowrap text-left border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4">Product Name</th>
                    <th className="px-8 py-4 text-center">Quantity</th>
                    <th className="px-8 py-4 text-right">Time Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fullHistory
                    .filter(log => log.item.toLowerCase().includes(historySearch.toLowerCase()))
                    .map((log, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors font-bold">
                        <td className={`px-8 py-6 uppercase text-[10px] font-black ${log.color}`}>{log.category}</td>
                        <td className="px-8 py-6 uppercase text-sm text-gray-900">{log.item}</td>
                        <td className="px-8 py-6 text-center text-lg text-gray-800">{log.qty}</td>
                        <td className="px-8 py-6 text-right text-xs text-gray-400">{log.time}</td>
                      </tr>
                    ))}
                  {fullHistory.filter(log => log.item.toLowerCase().includes(historySearch.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center font-black text-gray-200 uppercase tracking-[0.5em]">No matching records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* NEW CLOSE DAY TAB – now uses updated API */}
          {activeFilter === 'close_day' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest">Close Day</h2>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={closeDaySearch}
                  onChange={(e) => setCloseDaySearch(e.target.value)}
                  className="border-2 border-gray-200 p-2 rounded-xl text-sm outline-none focus:border-[#F57C00] w-64"
                />
              </div>
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4">Product</th>
                    <th className="px-8 py-4 text-center">Opening Stock</th>
                    <th className="px-8 py-4 text-center">Remaining</th>
                    <th className="px-8 py-4 text-center">Damaged</th>
                    <th className="px-8 py-4 text-center">Expired</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {closeDayEntries
                    .filter(entry => entry.product_name.toLowerCase().includes(closeDaySearch.toLowerCase()))
                    .map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{entry.product_name}</td>
                        <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">{entry.opening_stock}</td>
                        <td className="px-8 py-6 text-center">
                          <input
                            type="number"
                            value={entry.remaining}
                            onChange={(e) => updateCloseDayEntry(idx, 'remaining', e.target.value)}
                            className="w-24 border-2 border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#F57C00] font-black text-center"
                            min="0"
                          />
                        </td>
                        <td className="px-8 py-6 text-center">
                          <input
                            type="number"
                            value={entry.damaged}
                            onChange={(e) => updateCloseDayEntry(idx, 'damaged', e.target.value)}
                            className="w-24 border-2 border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#F57C00] font-black text-center"
                            min="0"
                          />
                        </td>
                        <td className="px-8 py-6 text-center">
                          <input
                            type="number"
                            value={entry.expired}
                            onChange={(e) => updateCloseDayEntry(idx, 'expired', e.target.value)}
                            className="w-24 border-2 border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#F57C00] font-black text-center"
                            min="0"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleCloseDaySubmit}
                  disabled={isCloseDaySubmitting}
                  className="bg-[#F57C00] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {isCloseDaySubmitting ? 'Submitting...' : 'Close Day'}
                </button>
              </div>
            </div>
          )}

          {/* CAKE ORDERS TAB (unchanged) */}
          {activeFilter === 'cake_orders' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest">CUSTOM CAKE ORDERS</h2>
                <input
                  type="text"
                  placeholder="Search cake orders..."
                  value={cakeOrderSearch}
                  onChange={(e) => setCakeOrderSearch(e.target.value)}
                  className="border-2 border-gray-200 p-2 rounded-xl text-sm outline-none focus:border-[#F57C00] w-64"
                />
              </div>
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-gray-900">Cake Name</th>
                    <th className="px-8 py-4 text-center text-gray-900">Order Code</th>
                    <th className="px-8 py-4 text-center text-gray-900">Customer</th>
                    <th className="px-8 py-4 text-right text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cakeOrders
                    .filter(cake => cake.item.toLowerCase().includes(cakeOrderSearch.toLowerCase()) || cake.customer.toLowerCase().includes(cakeOrderSearch.toLowerCase()))
                    .map((cake) => (
                      <tr key={cake.id} className="hover:bg-gray-50 transition-colors font-bold">
                        <td className="px-8 py-6 uppercase text-sm font-black text-[#F57C00]">{cake.item}</td>
                        <td className="px-8 py-6 text-center text-lg text-gray-900">{cake.code}</td>
                        <td className="px-8 py-6 text-center text-sm text-gray-900">{cake.customer}</td>
                        <td className="px-8 py-6 text-right">
                          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{cake.time} • PENDING</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ORDERS TAB – removed Rest Product */}
          {activeFilter === 'orders' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest">REQUEST FOR PRODUCTS</h2>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="border-2 border-gray-200 p-2 rounded-xl text-sm outline-none focus:border-[#F57C00] w-64"
                />
              </div>

              <div className="max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                  <div className="space-y-1 relative" ref={suggestionRef}>
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Product</label>
                    <input 
                      type="text" 
                      value={productSearch} 
                      onFocus={() => setShowSuggestions(true)} 
                      onChange={(e) => { setProductSearch(e.target.value); setShowSuggestions(true); setSelectedItem(null); }} 
                      className={`w-full border-2 p-4 rounded-2xl font-bold text-[#F57C00] outline-none focus:border-[#F57C00] transition-all ${isRequestNotFound ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="Search..." 
                    />
                    {isRequestNotFound && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-2">product not found</p>}
                    {showSuggestions && productSearch && (
                      <div className="absolute z-50 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                        {filteredProducts.map((p, i) => (
                          <div key={i} onClick={() => { setSelectedItem(p.item); setProductSearch(p.item); setShowSuggestions(false); }} className="p-4 hover:bg-orange-50 cursor-pointer font-bold text-sm border-b border-gray-50 last:border-0" >{p.item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Qty</label>
                    <span className={`text-[10px] block font-black uppercase ${isOverLimit ? 'text-red-500' : 'text-emerald-600'}`}>
                      Available: {selectedItem ? bakedItemsAvailable : '--'}
                    </span>
                    <input type="number" value={requestQty} onChange={(e) => setRequestQty(e.target.value)} className="w-full border-2 border-gray-200 p-4 rounded-2xl font-black text-xl outline-none focus:border-[#F57C00]" />
                  </div>
                </div>
                <button disabled={isSubmitting || !requestQty || isOverLimit || !selectedItem} onClick={handleAddRequest} className="mt-6 px-8 py-4 bg-[#F57C00] text-white rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">
                  {isSubmitting ? 'Submitting...' : 'Add Request'}
                </button>
              </div>

              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse mt-8">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-gray-900">Requested Item</th>
                    <th className="px-8 py-4 text-center text-gray-900">Qty</th>
                    <th className="px-8 py-4 text-right text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myRequests
                    .filter(req => req.item.toLowerCase().includes(orderSearch.toLowerCase()))
                    .map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors font-bold">
                        <td className="px-8 py-6 uppercase text-sm font-black text-[#F57C00]">{req.item}</td>
                        <td className="px-8 py-6 text-center text-lg">{req.quantity}</td>
                        <td className="px-8 py-6 text-right">
                          <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{req.time} • {req.status}</span>
                        </td>
                      </tr>
                    ))}
                  {myRequests.filter(req => req.item.toLowerCase().includes(orderSearch.toLowerCase())).length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-8 py-32 text-center font-black text-gray-200 uppercase tracking-[0.5em]">No matching orders</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* BAKED TAB (unchanged) */}
          {activeFilter === 'baked' && (
            
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest">BAKED PRODUCTS</h2>
                <input
                  type="text"
                  placeholder="Search baked products..."
                  value={bakedSearch}
                  onChange={(e) => setBakedSearch(e.target.value)}
                  className="border-2 border-gray-200 p-2 rounded-xl text-sm outline-none focus:border-[#F57C00] w-64"
                />
              </div>
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-200">
                    <th className="px-8 py-4">Product Name</th>
                    <th className="px-8 py-4 text-center">Global Stock</th>
                    <th className="px-8 py-4 text-right">Entry Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
  {bakedProductsLog
    .filter(s => s.item.toLowerCase().includes(bakedSearch.toLowerCase()))
    .map((s) => (
      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{s.item}</td>
        <td className="px-8 py-6 text-center font-black text-lg text-gray-900">{s.quantity}</td>
        <td className="px-8 py-6 text-right font-black text-[#F57C00] text-xs uppercase">{s.time}</td>
      </tr>
    ))}
  {bakedProductsLog.filter(s => s.item.toLowerCase().includes(bakedSearch.toLowerCase())).length === 0 && (
    <tr><td colSpan={3} className="px-8 py-32 text-center font-black text-gray-200 uppercase tracking-[0.5em]">No baked products recorded</td></tr>
  )}
</tbody>
              </table>
            </div>
          )}

          {/* RECEIVED TAB (unchanged) */}
          {activeFilter === 'received' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest">RECEIVED ITEMS</h2>
                <input
                  type="text"
                  placeholder="Search received..."
                  value={receivedSearch}
                  onChange={(e) => setReceivedSearch(e.target.value)}
                  className="border-2 border-gray-200 p-2 rounded-xl text-sm outline-none focus:border-[#F57C00] w-64"
                />
              </div>
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-200">
                    <th className="px-8 py-4">Item Received</th>
                    <th className="px-8 py-4 text-center">Qty</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {receivedStock
                    .filter(item => item.item.toLowerCase().includes(receivedSearch.toLowerCase()))
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6 uppercase text-sm font-black text-[#F57C00]">{s.item}</td>
                        <td className="px-8 py-6 text-center text-lg">
                          {editingReceivedId === s.id ? (
                            <input type="number" value={editReceivedQty} onChange={(e) => setEditReceivedQty(e.target.value)} className="w-20 border-2 border-[#F57C00] rounded-lg px-2 py-1 outline-none font-black text-lg" autoFocus />
                          ) : (
                            <span>{s.quantity} <small className="text-[10px] text-gray-400">{s.unit}</small></span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right font-black">
                          {editingReceivedId === s.id ? (
                            <button onClick={() => saveReceivedEdit(s.id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"><Check size={18}/></button>
                          ) : (
                            <div className="flex justify-end items-center gap-4">
                              <span className="text-green-600 text-[10px] uppercase">{s.arrivalTime} • RECEIVED</span>
                              <button onClick={() => { setEditingReceivedId(s.id); setEditReceivedQty(s.quantity.toString()); }} className="text-gray-400 hover:text-[#F57C00] transition-colors"><Edit2 size={16}/></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}