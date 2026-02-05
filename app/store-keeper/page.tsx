'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Bell, ArrowRight, ShoppingBag, AlertCircle, Eye, FileText, Search, X, ArrowLeft, CheckCheck, ClipboardList } from 'lucide-react';

export default function StoreKeeperDashboard() {
  const router = useRouter(); 

  // --- AUTOMATIC TIME HELPER ---
  // Returns current time like "10:30 AM"
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- 1. FILTER STATE ---
  const [activeFilter, setActiveFilter] = useState<'baked_log' | 'requests' | 'my_stock' | 'delivered' | 'damaged' | 'notes'>('requests');
  
  // --- 2. DELIVERY NOTE STATE ---
  const [deliveryNote, setDeliveryNote] = useState<any>(null);

  // --- MOCK DATA (Now using dynamic time) ---
  
  // A. Baked Items
  const [bakedLog, setBakedLog] = useState([
    { id: 1, item: 'Bread', quantity: 600, unit: 'pieces', date: `Today, ${getCurrentTime()}`, from: 'Production' },
    { id: 2, item: 'Donuts', quantity: 300, unit: 'pieces', date: `Today, ${getCurrentTime()}`, from: 'Production' }
  ]);

  // B. My Stock (Renamed from My Ready Stock)
  const [myStock, setMyStock] = useState([
    { id: 1, item: 'Bread', quantity: 500, unit: 'pieces', status: 'In Stock' },
    { id: 2, item: 'Donuts', quantity: 200, unit: 'pieces', status: 'In Stock' },
    { id: 3, item: 'Milk', quantity: 50, unit: 'liters', status: 'In Stock' },
  ]);

  // C. Shop Requests
  const [shopRequests, setShopRequests] = useState([
    { id: 101, item: 'Bread', quantity: 100, unit: 'pieces', date: getCurrentTime(), urgency: 'High' },
    { id: 102, item: 'Milk', quantity: 10, unit: 'liters', date: getCurrentTime(), urgency: 'Normal' },
  ]);

  // D. Delivered History
  const [deliveryHistory, setDeliveryHistory] = useState([
    { id: 55, noteId: 'DN-001', item: 'Donuts', quantity: 50, date: 'Yesterday', receiver: 'Shop Manager' }
  ]);

  // E. Damaged
  const damagedItems = [
    { id: 1, item: 'Broken Cookies', quantity: 20, unit: 'packs', reason: 'Crushed', status: 'Reported' },
  ];

  // --- DELIVER LOGIC ---
  const handleDeliver = (reqId: number) => {
    const request = shopRequests.find(r => r.id === reqId);
    if (!request) return;

    const stockItem = myStock.find(i => i.item === request.item);
    if (!stockItem || stockItem.quantity < request.quantity) {
      alert("Insufficient stock to fulfill this request!");
      return;
    }

    setMyStock(prev => prev.map(item => 
      item.item === request.item 
      ? { ...item, quantity: item.quantity - request.quantity }
      : item
    ));

    setShopRequests(prev => prev.filter(r => r.id !== reqId));

    const newNote = {
      id: `DN-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toLocaleString(),
      items: [
        { name: request.item, quantity: request.quantity, unit: request.unit }
      ],
      receiver: "Shop Manager",
      sender: "Store Keeper"
    };

    setDeliveryHistory(prev => [{ id: Date.now(), noteId: newNote.id, item: request.item, quantity: request.quantity, date: 'Just now', receiver: 'Shop Manager' }, ...prev]);
    setDeliveryNote(newNote);
  };

  // --- STATS GRID ---
  const stats = [
    { id: 'baked_log', label: 'Baked Items', value: bakedLog.reduce((a,b)=>a+b.quantity,0).toString(), sub: 'From Production', icon: Package },
    { id: 'requests', label: 'Shop Requests', value: shopRequests.length.toString(), sub: 'Pending', icon: Bell },
    { id: 'my_stock', label: 'My Stock', value: myStock.reduce((a,b)=>a+b.quantity,0).toString(), sub: 'Available', icon: ShoppingBag }, // Renamed Label
    { id: 'delivered', label: 'Delivered', value: deliveryHistory.length.toString(), sub: 'Products', icon: CheckCheck },
    { id: 'damaged', label: 'Damaged', value: damagedItems.length.toString(), sub: 'Issues', icon: AlertCircle },
    { id: 'notes', label: 'Delivery Notes', value: 'View', sub: 'Records', icon: ClipboardList },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 relative">
      
      {/* --- MOBILE LOGO --- */}
      <div className="md:hidden flex items-center justify-center mb-6">
         <img src="/logo.png" alt="Shop Logo" className="h-16 w-auto object-contain" />
      </div>

      {/* --- DELIVERY NOTE MODAL --- */}
      {deliveryNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-[#5D4037] p-6 text-center relative">
              <h2 className="text-white text-xl font-bold tracking-widest uppercase">Delivery Note</h2>
              <p className="text-[#A67C37] text-xs font-mono mt-1">#{deliveryNote.id}</p>
              <button onClick={() => setDeliveryNote(null)} className="absolute top-4 right-4 text-white/80 hover:text-white">
                <X size={24} />
              </button>
            </div>
            {/* Body */}
            <div className="p-8 space-y-6">
              <div className="flex justify-between text-sm text-gray-500 border-b border-dashed border-gray-200 pb-4">
                <span>Date: {deliveryNote.date}</span>
                <span>To: Shop</span>
              </div>
              
              <div className="space-y-3">
                {deliveryNote.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center font-bold text-gray-800 text-lg">
                    <span>{item.name}</span>
                    <span>{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  Authorized by:<br/>
                  <span className="font-bold text-gray-600">Store Keeper</span>
                </div>
                <button 
                  onClick={() => { alert("Printing..."); setDeliveryNote(null); }}
                  className="bg-[#5D4037] text-white px-6 py-2 rounded-lg text-sm font-bold uppercase hover:bg-[#4a332a]"
                >
                  Print / Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER WITH BACK ARROW --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => router.back()} 
             className="p-2 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
           >
             <ArrowLeft size={24} />
           </button>
           <div>
             <h1 className="text-2xl font-bold text-[#5D4037] tracking-tight">Store Keeper</h1>
             <p className="text-[#A67C37] text-sm mt-1">Manage delivery requests & inventory flow.</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search..." className="bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#5D4037] w-64 shadow-sm" />
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => setActiveFilter(stat.id as any)}
            className={`p-5 rounded-2xl shadow-sm border flex flex-col items-center text-center transition-all cursor-pointer group ${
              activeFilter === stat.id 
              ? 'bg-[#5D4037] text-white border-[#5D4037] scale-[1.03] shadow-lg' 
              : 'bg-white border-gray-100 hover:border-[#A67C37] hover:shadow-md'
            }`}
          >
             <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
               activeFilter === stat.id ? 'bg-[#A67C37] text-white' : 'bg-[#EBE0CC]/40 text-[#5D4037]'
             }`}>
               <stat.icon size={20} strokeWidth={2} />
             </div>
             <h3 className={`font-semibold text-xs uppercase tracking-wide truncate w-full ${activeFilter === stat.id ? 'text-[#EBE0CC]' : 'text-gray-600'}`}>{stat.label}</h3>
             <p className={`text-xl font-extrabold mt-1 ${activeFilter === stat.id ? 'text-white' : 'text-[#5D4037]'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- CONTENT TABLES --- */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-[#5D4037] capitalize pl-1">
            {activeFilter === 'my_stock' ? 'My Stock' : activeFilter.replace('_', ' ')}
        </h2>
        
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[300px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              
              {/* 1. BAKED LOG */}
              {activeFilter === 'baked_log' && (
                <>
                  <thead>
                    <tr className="bg-[#A67C37] text-white text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Item Name</th>
                      <th className="px-6 py-4">Quantity In</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4 text-right">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE0CC]/30">
                    {bakedLog.map((item) => (
                      <tr key={item.id} className="hover:bg-[#EBE0CC]/20">
                        <td className="px-6 py-5 font-bold text-[#5D4037]">{item.item}</td>
                        <td className="px-6 py-5 text-gray-700">{item.quantity} {item.unit}</td>
                        <td className="px-6 py-5 text-gray-500 text-xs">{item.date}</td>
                        <td className="px-6 py-5 text-right font-bold text-[#A67C37]">{item.from}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* 2. REQUESTS */}
              {activeFilter === 'requests' && (
                <>
                  <thead>
                    <tr className="bg-[#5D4037] text-white text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Qty Needed</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE0CC]/30">
                    {shopRequests.length > 0 ? shopRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#EBE0CC]/20">
                        <td className="px-6 py-5 font-bold text-[#5D4037]">{req.item}</td>
                        <td className="px-6 py-5 text-gray-600">{req.quantity} {req.unit}</td>
                        <td className="px-6 py-5 text-gray-500 text-xs">{req.date}</td>
                        <td className="px-6 py-5 text-right">
                          <button onClick={() => handleDeliver(req.id)} className="bg-[#A67C37] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-[#5D4037] flex items-center gap-2 ml-auto">
                            <FileText size={14} /> Deliver & Note
                          </button>
                        </td>
                      </tr>
                    )) : <tr><td colSpan={4} className="text-center py-8 text-gray-400">No pending requests.</td></tr>}
                  </tbody>
                </>
              )}

              {/* 3. MY STOCK */}
              {activeFilter === 'my_stock' && (
                <>
                  <thead>
                    <tr className="bg-[#5D4037] text-white text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Item Name</th>
                      <th className="px-6 py-4">Ready Qty</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE0CC]/30">
                    {myStock.map((item) => (
                      <tr key={item.id} className="hover:bg-[#EBE0CC]/20">
                        <td className="px-6 py-5 font-bold text-[#5D4037]">{item.item}</td>
                        <td className="px-6 py-5 text-gray-800 font-bold">{item.quantity} {item.unit}</td>
                        <td className="px-6 py-5 text-right"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* 4. DELIVERED PRODUCTS */}
              {activeFilter === 'delivered' && (
                <>
                  <thead>
                    <tr className="bg-[#A67C37] text-white text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Item Delivered</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4">Receiver</th>
                      <th className="px-6 py-4 text-right">Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE0CC]/30">
                    {deliveryHistory.map((h) => (
                      <tr key={h.id} className="hover:bg-[#EBE0CC]/20">
                        <td className="px-6 py-5 font-bold text-[#5D4037]">{h.item}</td>
                        <td className="px-6 py-5">{h.quantity} units</td>
                        <td className="px-6 py-5 text-gray-500">{h.receiver}</td>
                        <td className="px-6 py-5 text-right text-green-600"><CheckCheck size={18} className="ml-auto" /></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* 5. DAMAGED */}
              {activeFilter === 'damaged' && (
                <>
                  <thead>
                    <tr className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4 text-right">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-50">
                    {damagedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-red-50">
                        <td className="px-6 py-5 font-bold text-[#5D4037]">{item.item}</td>
                        <td className="px-6 py-5">{item.quantity} {item.unit}</td>
                        <td className="px-6 py-5 text-right text-gray-500 italic">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

              {/* 6. DELIVERY NOTES */}
              {activeFilter === 'notes' && (
                 <>
                  <thead>
                    <tr className="bg-[#5D4037] text-white text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Note ID</th>
                      <th className="px-6 py-4">Date Generated</th>
                      <th className="px-6 py-4">Items Count</th>
                      <th className="px-6 py-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE0CC]/30">
                    {deliveryHistory.map((h) => (
                      <tr key={h.id} className="hover:bg-[#EBE0CC]/20">
                        <td className="px-6 py-5 font-mono font-bold text-[#A67C37]">{h.noteId}</td>
                        <td className="px-6 py-5 text-gray-600 text-sm">{h.date}</td>
                        <td className="px-6 py-5 text-gray-800">1 Item</td>
                        <td className="px-6 py-5 text-right">
                           <button className="text-[#5D4037] font-bold hover:underline text-xs uppercase">Open PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}