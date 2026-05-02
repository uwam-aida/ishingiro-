'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Package, Clock, ShoppingBag, AlertCircle, Search, Archive, ArrowLeft, Store, Plus, MapPin, Bell, X, ShieldAlert, CheckCircle2, Trash2, Edit2, Check, History, Cake } from 'lucide-react';

// --- OFFICIAL PRODUCT LIST (KEPT EXACTLY AS PROVIDED) ---
const MARKETING_PRODUCTS = [
    { name: 'big milk', type: 'Baked' },
    { name: 'small milk', type: 'Baked' },
    { name: 'pcpn', type: 'Baked' },
    { name: 'sen', type: 'Baked' },
    { name: 'salted bread', type: 'Baked' },
    { name: 'baguette', type: 'Baked' },
    { name: 'milk slice bread', type: 'Baked' },
    { name: 'crubes', type: 'Baked' },
    { name: 'sen pieces', type: 'Baked' },
    { name: 'brown sanduich', type: 'Baked' },
    { name: 'mult graine', type: 'Baked' },
    { name: 'milk mult graine', type: 'Baked' },
    { name: 'brown bread', type: 'Baked' },
    { name: 'tea cake', type: 'Baked' },
    { name: 'marble cake', type: 'Baked' },
    { name: 'brown cake', type: 'Baked' },
    { name: 'oliver corn cake', type: 'Baked' },
    { name: 'muffin cake', type: 'Baked' },
    { name: 'ishingiro', type: 'Baked' }, 
    { name: 's.begne', type: 'Baked' },
    { name: 'dark donut', type: 'Baked' },
    { name: 'choc donuts', type: 'Baked' },
    { name: 'kk donuts', type: 'Baked' },
    { name: 'triangle', type: 'Baked' },
    { name: 'meat sambusa', type: 'Baked' },
    { name: 'biscuits', type: 'Baked' },  
    { name: 'ISH.MILK Cookie', type: 'Baked' }, 
    { name: 'butter biscuits', type: 'Baked' },
    { name: 'chocolate biscuits', type: 'Baked' }, 
    { name: 'ubunyobwa', type: 'Baked' },
    { name: 'ikinyuranyo 1kg', type: 'Unbaked' },
    { name: 'ikinyuranyo 3kg', type: 'Unbaked' },
    { name: 'ikinyuranyo 5kg', type: 'Unbaked' },
    { name: 'ikinyuranyo (0.5)kg', type: 'Unbaked' },
    { name: 'yellow c flour 1kg', type: 'Unbaked' },
    { name: 'yellow c flour 3kg', type: 'Unbaked' },
    { name: 'cashnewnuts', type: 'Unbaked' },
    { name: 'cornfresh cream', type: 'Unbaked' },
    { name: 'cake 38000', type: 'Baked' },
    { name: 'cake 20000', type: 'Baked' },
    { name: 'cakes 24000', type: 'Baked' },
    { name: 'cake 19000', type: 'Baked' },
    { name: 'cake18000', type: 'Baked' },
    { name: 'cakes 15000', type: 'Baked' },
    { name: 'cakes 14000', type: 'Baked' },
    { name: 'cakes 13000', type: 'Baked' },
    { name: 'cake 12000', type: 'Baked' },
    { name: 'cakes 10000', type: 'Baked' },
    { name: 'cakes 9000', type: 'Baked' },
    { name: 'cakes 8000', type: 'Baked' },
    { name: 'cakes 7000', type: 'Baked' },
    { name: 'cakes 6000', type: 'Baked' },
    { name: 'cake 5000', type: 'Baked' },
    { name: 'ADDCAKE', type: 'Baked' },
];

export default function DynamicShopDashboard() {
  const router = useRouter(); 
  const params = useParams(); 
  const rawBranchId = params?.branchId;
  const branchIdString = rawBranchId?.toString().toLowerCase() || 'kabuga';

  // --- 1. STATE (KEPT ALL YOUR ORIGINAL STATE) ---
  const [factoryStock, setFactoryStock] = useState(MARKETING_PRODUCTS.map(p => ({ 
    item: p.name, quantity: 100, unit: p.name.includes('kg') ? 'Kg' : 'Pieces', entryTime: '06:00 AM' 
  })));
  const [requestQty, setRequestQty] = useState('');
  const [myRequests, setMyRequests] = useState<any[]>([{ id: 1, item: 'big milk', quantity: 20, status: 'Pending Dispatch', time: '08:30 AM' }]);
  const [receivedStock, setReceivedStock] = useState<any[]>([
    { id: 101, item: 'brown bread', quantity: 50, unit: 'Pieces', arrivalTime: '07:00 AM' },
    { id: 102, item: 'tea cake', quantity: 15, unit: 'Pieces', arrivalTime: '09:15 AM' },
    { id: 103, item: 'yellow c flour 1kg', quantity: 10, unit: 'Kg', arrivalTime: '10:00 AM' }
  ]);

  const [editingReceivedId, setEditingReceivedId] = useState<number | null>(null);
  const [editReceivedQty, setEditReceivedQty] = useState('');

  const [damagedReports, setDamagedReports] = useState<any[]>([]);
  const [damagedItem, setDamagedItem] = useState('');
  const [damagedQty, setDamagedQty] = useState('');
  const [damagedState, setDamagedState] = useState('Baked');
  const [damagedUnit, setDamagedUnit] = useState('Piece');
  
  const [typeError, setTypeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [showDamagedSuggestions, setShowDamagedSuggestions] = useState(false);

  const [myStock] = useState([
    { item: 'Wheat Flour', quantity: 250, unit: 'Kg' },
    { item: 'Dry Yeast', quantity: 5, unit: 'Kg' },
    { item: 'Sugar', quantity: 50, unit: 'Kg' },
    { item: 'Cooking Oil', quantity: 20, unit: 'Liters' },
  ]);

  const [productSearch, setProductSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [cakeOrders, setCakeOrders] = useState<any[]>([
    { id: 501, item: 'Chocolate Cake', code: 'KS-01', customer: 'Jean Paul', time: '10:00 AM' }
  ]);

  // --- 2. BACKEND WIRING: AUTH & INITIAL LOAD ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }
    // Logic to sync with backend could go here if you want to pull existing orders on load
  }, [router]);

  // --- 3. LOGIC CALCULATIONS (KEPT ALL YOUR ORIGINAL LOGIC) ---
  const filteredProducts = factoryStock.filter(p => p.item.toLowerCase().includes(productSearch.toLowerCase()));
  const damagedFiltered = MARKETING_PRODUCTS.filter(p => p.name.toLowerCase().includes(damagedItem.toLowerCase()));
  
  const isRequestNotFound = productSearch.length > 0 && filteredProducts.length === 0;
  const isDamagedSearchNotFound = damagedItem.length > 0 && damagedFiltered.length === 0;

  // --- DYNAMIC VALIDATION (KEPT YOURS) ---
  useEffect(() => {
    const product = MARKETING_PRODUCTS.find(p => p.name.toLowerCase() === damagedItem.toLowerCase());
    if (damagedItem.length > 0 && !product && !showDamagedSuggestions) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
    if (product) {
        if (product.type === 'Baked' && damagedState === 'Unbaked') {
            setTypeError(true);
            setErrorMessage('this is not unbaked');
        } else if (product.type === 'Unbaked' && damagedState === 'Baked') {
            setTypeError(true);
            setErrorMessage('this is not baked');
        } else {
            setTypeError(false);
            setErrorMessage('');
        }
    } else {
        setTypeError(false);
        setErrorMessage('');
    }
  }, [damagedItem, damagedState, showDamagedSuggestions]);

  const bakedItemsAvailable = selectedItem ? (factoryStock.find(s => s.item === selectedItem)?.quantity || 0) : 0;
  const isOverLimit = (parseInt(requestQty) || 0) > bakedItemsAvailable;

  // --- 4. UPDATED: BACKEND INTEGRATION FOR ADD REQUEST ---
  const handleAddRequest = async () => {
    if (!requestQty || isOverLimit || !selectedItem) return;
    
    // BACKEND CALL - Connecting to the exact endpoint from the docs
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    
    try {
        const response = await fetch(`${baseUrl}/orders/${branchIdString}`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                // Note: The API requires a product_id. Since we only have a string name in selectedItem right now, 
                // we are passing 1 as a placeholder until the frontend has full product IDs.
                items: [{ product_id: 1, quantity: parseInt(requestQty) }]
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("Order saved to backend", data);
        } else {
            console.error("Backend error saving order");
        }
    } catch (e) { console.error(e); }

    // KEEPING YOUR LOCAL UI UPDATE
    const qtyToDeduct = parseInt(requestQty);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFactoryStock(prev => prev.map(s => s.item === selectedItem ? { ...s, quantity: s.quantity - qtyToDeduct } : s));
    setMyRequests([{ id: Date.now(), item: selectedItem, quantity: qtyToDeduct, status: 'Pending Dispatch', time: currentTime }, ...myRequests]);
    setRequestQty(''); setProductSearch(''); setSelectedItem(null);
  };

  // --- 5. UPDATED: BACKEND INTEGRATION FOR REPORT DAMAGE ---
  const handleReportDamage = async () => {
    if (!damagedItem || !damagedQty || typeError || notFound) return;

    // BACKEND CALL - Connecting to the exact endpoint from the docs
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    
    try {
        const response = await fetch(`${baseUrl}/shop/damages`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                // Note: Similar to orders, we pass 1 as a placeholder product_id.
                product_id: 1,
                quantity: parseInt(damagedQty),
                reason: `Reported by Manager. State: ${damagedState}`,
                location: branchIdString
            })
        });

        if (response.ok) {
           console.log("Damage reported to backend successfully.");
        }
    } catch (e) { console.error(e); }

    // KEEPING YOUR LOCAL UI UPDATE
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDamagedReports([{ id: Date.now(), item: damagedItem, qty: damagedQty, state: damagedState, unit: damagedUnit, time: currentTime }, ...damagedReports]);
    setDamagedItem(''); setDamagedQty(''); setTypeError(false);
  };

  const saveReceivedEdit = (id: number) => {
    setReceivedStock(prev => prev.map(item => item.id === id ? { ...item, quantity: parseInt(editReceivedQty) || item.quantity } : item));
    setEditingReceivedId(null);
  };

  const branchName = branchIdString === 'kabuga' ? 'KABUGA SHOP' : branchIdString === 'masaka' ? 'MASAKA SHOP' : 'BRANCH';
  const [activeFilter, setActiveFilter] = useState<'baked' | 'orders' | 'cake_orders' | 'received' | 'stock' | 'damaged' | 'history'>('orders');

  const stats = [
    { id: 'baked', label: 'Baked Items', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: Clock },
    { id: 'cake_orders', label: 'Cake Orders', icon: Cake },
    { id: 'received', label: 'Received', icon: Archive },
    { id: 'stock', label: 'My Stock', icon: Store },
    { id: 'damaged', label: 'Damaged', icon: AlertCircle },
    { id: 'history', label: 'Full History', icon: History },
  ];

  const fullHistory = [
      ...myRequests.map(r => ({ category: 'Order', item: r.item, qty: r.quantity, time: r.time, color: 'text-blue-600' })),
      ...damagedReports.map(d => ({ category: 'Damage', item: d.item, qty: d.qty, time: d.time, color: 'text-red-600' })),
      ...cakeOrders.map(c => ({ category: 'Cake', item: `${c.item} (${c.code})`, qty: 1, time: c.time, color: 'text-[#F57C00]' }))
  ].sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 pt-6">
        <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-md py-4 border-b border-gray-200/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black text-black uppercase">{branchName} MANAGER</h1>
            </div>
        </div>

        {/* --- STATS BUTTONS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {stats.map((stat) => (
            <div 
                key={stat.id} 
                onClick={() => setActiveFilter(stat.id as any)} 
                className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                    activeFilter === stat.id 
                    ? (stat.id === 'damaged' ? 'bg-red-600 text-white shadow-lg' : stat.id === 'history' ? 'bg-gray-800 text-white shadow-lg' : 'bg-[#F57C00] text-white shadow-lg') 
                    : (stat.id === 'damaged' ? 'bg-white hover:border-red-600' : 'bg-white hover:border-[#F57C00]')
                }`}
            >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                    activeFilter === stat.id 
                    ? 'bg-white/20' 
                    : (stat.id === 'damaged' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-[#F57C00]')
                }`}>
                  <stat.icon size={20} />
                </div>
                <h3 className="font-black text-[9px] md:text-[10px] uppercase tracking-widest opacity-80">{stat.label}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          {/* TAB: STOCK */}
          {activeFilter === 'stock' && (
            <div className="overflow-x-auto animate-in fade-in">
              <table className="w-full text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200"><th className="px-8 py-4">Ingredient/Product</th><th className="px-8 py-4 text-center">In Store</th><th className="px-8 py-4 text-right">Unit</th></thead>
                <tbody className="divide-y divide-gray-100">
                  {myStock.map((s, idx) => (
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

          {/* TAB: HISTORY */}
          {activeFilter === 'history' && (
            <div className="overflow-x-auto animate-in fade-in p-8">
               <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6">Fully Added Products Log</h2>
               <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200"><th className="px-8 py-4">Type</th><th className="px-8 py-4">Product Name</th><th className="px-8 py-4 text-center">Quantity</th><th className="px-8 py-4 text-right">Time Added</th></thead>
                <tbody className="divide-y divide-gray-100">
                  {fullHistory.map((log, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors font-bold">
                      <td className={`px-8 py-6 uppercase text-[10px] font-black ${log.color}`}>{log.category}</td>
                      <td className="px-8 py-6 uppercase text-sm text-gray-900">{log.item}</td>
                      <td className="px-8 py-6 text-center text-lg text-gray-800">{log.qty}</td>
                      <td className="px-8 py-6 text-right text-xs text-gray-400">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: DAMAGED */}
          {activeFilter === 'damaged' && (
            <div className="p-8 animate-in fade-in">
              <div className="bg-red-50/30 p-6 rounded-3xl border border-red-100">
                <h2 className="text-[10px] font-black uppercase mb-4 text-red-600 tracking-[0.2em]">Report Damaged Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="relative">
                    <input type="text" placeholder="Item Name" value={damagedItem} onFocus={() => setShowDamagedSuggestions(true)} onChange={(e) => {setDamagedItem(e.target.value); setShowDamagedSuggestions(true);}} className={`w-full p-4 rounded-2xl font-bold text-sm outline-none border-2 transition-all ${typeError || isDamagedSearchNotFound ? 'border-red-500 bg-red-50 placeholder-red-600' : 'border-gray-200 bg-white focus:border-red-500'}`} />
                    {isDamagedSearchNotFound && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-2">product not found</p>}
                    {typeError && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-2">{errorMessage}</p>}
                    {showDamagedSuggestions && damagedItem && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {damagedFiltered.map((p, i) => (
                          <div key={i} onClick={() => {setDamagedItem(p.name); setShowDamagedSuggestions(false);}} className="p-4 hover:bg-red-50 cursor-pointer font-bold text-sm text-red-600 border-b border-gray-50 last:border-0">{p.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="number" placeholder="Qty" value={damagedQty} onChange={(e) => setDamagedQty(e.target.value)} className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500" />
                  <select value={damagedState} onChange={(e) => setDamagedState(e.target.value)} className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500">
                    <option value="Baked">Baked</option>
                    <option value="Unbaked">Unbaked</option>
                  </select>
                  <select value={damagedUnit} onChange={(e) => setDamagedUnit(e.target.value)} className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500">
                    <option value="Piece">Piece</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
                <button disabled={typeError || isDamagedSearchNotFound} onClick={handleReportDamage} className={`mt-4 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${typeError || isDamagedSearchNotFound ? 'bg-gray-200 text-gray-400' : 'bg-red-600 text-white shadow-lg active:scale-95'}`}>Submit Damage</button>
              </div>
              <table className="w-full mt-8 text-left font-bold">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-100"><th className="px-8 py-4">Item</th><th className="px-8 py-4 text-center">State</th><th className="px-8 py-4 text-right">Time Reported</th></thead>
                <tbody className="divide-y divide-gray-100">
                  {damagedReports.map((d) => (
                    <tr key={d.id} className="text-red-600 font-bold"><td className="px-8 py-6 uppercase text-sm">{d.item}</td><td className="px-8 py-6 text-center"><span className="bg-red-50 px-3 py-1 rounded-full text-[9px] uppercase">{d.state} ({d.qty} {d.unit})</span></td><td className="px-8 py-6 text-right text-gray-400 text-xs">{d.time}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: CAKE ORDERS */}
          {activeFilter === 'cake_orders' && (
            <div className="animate-in fade-in p-8">
               <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest mb-6">CUSTOM CAKE ORDERS</h2>
               <table className="w-full text-left font-bold border-collapse mt-2">
                 <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                   <tr>
                     <th className="px-8 py-4 text-gray-900">Cake Name</th>
                     <th className="px-8 py-4 text-center text-gray-900">Order Code</th>
                     <th className="px-8 py-4 text-center text-gray-900">Customer</th>
                     <th className="px-8 py-4 text-right text-gray-900">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {cakeOrders.map((cake) => (
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

          {/* TAB: ORDERS */}
          {activeFilter === 'orders' && (
            <div className="animate-in fade-in p-8">
                <div className="max-w-2xl">
                  <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest mb-6">REQUEST FOR PRODUCTS</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 relative" ref={suggestionRef}><label className="text-[10px] font-black text-gray-400 uppercase ml-1">Product</label>
                      <input type="text" value={productSearch} onFocus={() => setShowSuggestions(true)} onChange={(e) => { setProductSearch(e.target.value); setShowSuggestions(true); setSelectedItem(null); }} className={`w-full border-2 p-4 rounded-2xl font-bold text-[#F57C00] outline-none focus:border-[#F57C00] transition-all ${isRequestNotFound ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} placeholder="Search..." />
                      {isRequestNotFound && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-2">product not found</p>}
                      {showSuggestions && productSearch && (
                        <div className="absolute z-50 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                          {filteredProducts.map((p, i) => (
                            <div key={i} onClick={() => { setSelectedItem(p.item); setProductSearch(p.item); setShowSuggestions(false); }} className="p-4 hover:bg-orange-50 cursor-pointer font-bold text-sm border-b border-gray-50 last:border-0" >{p.item}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase">Qty</label><span className={`text-[10px] block font-black uppercase ${isOverLimit ? 'text-red-500' : 'text-emerald-600'}`}>Factory: {selectedItem ? bakedItemsAvailable : '--'}</span>
                      <input type="number" value={requestQty} onChange={(e) => setRequestQty(e.target.value)} className="w-full border-2 border-gray-200 p-4 rounded-2xl font-black text-xl outline-none" />
                    </div>
                  </div>
                  <button disabled={!requestQty || isOverLimit || !selectedItem} onClick={handleAddRequest} className="mt-6 px-8 py-4 bg-[#F57C00] text-white rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">Add Request</button>
                </div>
              <table className="w-full text-left font-bold border-collapse mt-8">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200"><th className="px-8 py-4 text-gray-900">Requested Item</th><th className="px-8 py-4 text-center text-gray-900">Qty</th><th className="px-8 py-4 text-right text-gray-900">Status</th></thead>
                <tbody className="divide-y divide-gray-100">
                  {myRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors font-bold"><td className="px-8 py-6 uppercase text-sm font-black text-[#F57C00]">{req.item}</td><td className="px-8 py-6 text-center text-lg">{req.quantity}</td><td className="px-8 py-6 text-right"><span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{req.time} • {req.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: BAKED */}
          {activeFilter === 'baked' && (
            <div className="overflow-x-auto animate-in fade-in">
              <table className="w-full text-left font-bold border-collapse">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-200"><th className="px-8 py-4">Product Name</th><th className="px-8 py-4 text-center">Global Stock</th><th className="px-8 py-4 text-right">Entry Time</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {factoryStock.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{s.item}</td>
                      <td className="px-8 py-6 text-center font-black text-lg text-gray-900">{s.quantity} <span className="text-[10px] text-gray-400 ml-1 uppercase">{s.unit}</span></td>
                      <td className="px-8 py-6 text-right font-black text-[#F57C00] text-xs uppercase">{s.entryTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: RECEIVED */}
          {activeFilter === 'received' && (
            <div className="overflow-x-auto animate-in fade-in">
              <table className="w-full text-left font-bold border-collapse">
                <thead className="bg-gray-50/50">
                  <tr className="text-[10px] font-black uppercase text-gray-400 border-b border-gray-200"><th className="px-8 py-4">Item Received</th><th className="px-8 py-4 text-center">Qty</th><th className="px-8 py-4 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {receivedStock.map((s) => (
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