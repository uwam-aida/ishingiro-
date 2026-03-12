'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Package, Bell, ArrowRight, ShoppingBag, AlertCircle, Eye, FileText, Search, X, ArrowLeft, CheckCheck, ClipboardList, PenLine, Printer } from 'lucide-react';

export default function StoreKeeperDashboard() {
  const router = useRouter(); 
  const params = useParams();
  const branchId = params?.branchId as string;

  // --- SAFETY GUARD ---
  if (!branchId) return null;

const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [activeFilter, setActiveFilter] = useState<'baked_log' | 'requests' | 'my_stock' | 'delivered' | 'damaged' | 'notes' | 'sales_log'>('requests');
  const [deliveryNote, setDeliveryNote] = useState<any>(null);
  const [mushikiriNote, setMushikiriNote] = useState('');

  // --- PARTIAL DELIVERY & SEARCH STATE ---
  const [partialDeliveryItem, setPartialDeliveryItem] = useState<any>(null);
  const [deliveryQty, setDeliveryQty] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  // --- STOCK ---
  const [myStock, setMyStock] = useState([
    { id: 1, item: 'Bread', quantity: 500, unit: 'pieces', status: 'In Stock' },
    { id: 2, item: 'Donuts', quantity: 200, unit: 'pieces', status: 'In Stock' },
    { id: 3, item: 'Milk', quantity: 50, unit: 'liters', status: 'In Stock' },
  ]);

  // --- REQUESTS ---
  const [shopRequests, setShopRequests] = useState([
    { id: 101, item: 'Bread', quantity: 100, unit: 'pieces', date: getCurrentTime(), branch: 'kabuga' },
    { id: 102, item: 'Milk', quantity: 10, unit: 'liters', date: getCurrentTime(), branch: 'masaka' },
    { id: 103, item: 'Bread', quantity: 50, unit: 'pieces', date: getCurrentTime(), branch: 'rwamagana' },
    { id: 104, item: 'Donuts', quantity: 20, unit: 'pieces', date: getCurrentTime(), branch: 'kayonza' },
    { id: 105, item: 'Milk', quantity: 5, unit: 'liters', date: getCurrentTime(), branch: 'nyakarambi' },
  ]);

  // --- CORRECTED VISIBILITY LOGIC ---
  const visibleRequests = shopRequests.filter(req => {
    // Kabuga Store Keeper sees Kabuga and Masaka requests
    if (branchId === 'kabuga') {
      return req.branch === 'kabuga' || req.branch === 'masaka';
    }
    // Rwamagana Store Keeper sees Rwamagana and Kayonza requests
    if (branchId === 'rwamagana') {
      return req.branch === 'rwamagana' || req.branch === 'kayonza';
    }
    // Other store keepers only see their specific branch
    return req.branch === branchId;
  });

  const [deliveryHistory, setDeliveryHistory] = useState([
    { id: 55, noteId: 'DN-001', item: 'Donuts', quantity: 50, date: 'Yesterday', receiver: 'MASAKA' }
  ]);

  // --- SEARCH LOGIC FOR HISTORY ---
  const filteredHistory = deliveryHistory.filter(h => 
    h.receiver.toLowerCase().includes(historySearch.toLowerCase()) || 
    h.item.toLowerCase().includes(historySearch.toLowerCase())
  );

  const handlePartialSubmit = () => {
    const qty = parseInt(deliveryQty);
    if (isNaN(qty) || qty <= 0) return;
    const stockItem = myStock.find(i => i.item === partialDeliveryItem.item);
    if (!stockItem || stockItem.quantity < qty) {
      alert("Insufficient stock!");
      return;
    }

    setMyStock(prev => prev.map(item => item.item === partialDeliveryItem.item ? { ...item, quantity: item.quantity - qty } : item));

    setShopRequests(prev => {
      const existing = prev.find(r => r.id === partialDeliveryItem.id);
      if (existing && existing.quantity > qty) {
        return prev.map(r => r.id === partialDeliveryItem.id ? { ...r, quantity: r.quantity - qty } : r);
      }
      return prev.filter(r => r.id !== partialDeliveryItem.id);
    });

    const newNoteId = `DN-${Math.floor(Math.random() * 10000)}`;
    setDeliveryHistory(prev => [{
      id: Date.now(),
      noteId: newNoteId,
      item: partialDeliveryItem.item,
      quantity: qty,
      date: getCurrentTime(),
      receiver: partialDeliveryItem.branch.toUpperCase()
    }, ...prev]);

    setDeliveryNote({
      id: newNoteId,
      date: new Date().toLocaleString(),
      items: [{ name: partialDeliveryItem.item, quantity: qty, unit: partialDeliveryItem.unit }],
      receiver: `${partialDeliveryItem.branch.toUpperCase()} Manager`
    });

    setPartialDeliveryItem(null);
    setDeliveryQty('');
  };

const stats = [
    { id: 'requests', label: 'Requests', value: visibleRequests.length.toString(), icon: Bell },
    { id: 'my_stock', label: 'Stock', value: myStock.reduce((a,b)=>a+b.quantity,0).toString(), icon: ShoppingBag },
    { id: 'delivered', label: 'History', value: deliveryHistory.length.toString(), icon: CheckCheck },
    branchId === 'mushikiri' 
      ? { id: 'sales_log', label: 'Log', value: 'Write', icon: PenLine }
      : { id: 'notes', label: 'Notes', value: 'View', icon: ClipboardList },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 relative px-4">
      {/* --- POPUPS --- */}
      {partialDeliveryItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6">
            <h2 className="text-[#5D4037] font-black uppercase text-xs">Set Quantity</h2>
            <input type="number" value={deliveryQty} onChange={(e) => setDeliveryQty(e.target.value)} className="w-full border p-4 rounded-2xl outline-none font-bold" placeholder="Amount to send" />
            <div className="flex gap-3">
              <button onClick={() => setPartialDeliveryItem(null)} className="flex-1 font-bold text-gray-400">Cancel</button>
              <button onClick={handlePartialSubmit} className="flex-1 bg-[#5D4037] text-white py-3 rounded-xl font-bold uppercase text-xs">Confirm</button>
            </div>
          </div>
        </div>
      )}

    {deliveryNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#5D4037] p-6 text-center relative text-white">
              <h2 className="font-bold uppercase">Delivery Note</h2>
              <button onClick={() => setDeliveryNote(null)} className="absolute top-4 right-4"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-sm font-bold">To: {deliveryNote.receiver}</p>
              {deliveryNote.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between font-bold text-lg"><span>{item.name}</span><span>{item.quantity}</span></div>
              ))}
              <button onClick={() => setDeliveryNote(null)} className="w-full bg-[#5D4037] text-white py-3 rounded-xl font-bold uppercase">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 pt-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-white border border-gray-200 text-[#5D4037]"><ArrowLeft size={24} /></button>
        <div>
          <h1 className="text-2xl font-bold text-[#5D4037] uppercase tracking-tight">{branchId} Store Keeper</h1>
          <p className="text-[#A67C37] text-sm">Inventory & Fulfillment Control</p>
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} onClick={() => setActiveFilter(stat.id as any)} className={`p-5 rounded-2xl border text-center cursor-pointer transition-all ${activeFilter === stat.id ? 'bg-[#5D4037] text-white scale-105 shadow-lg' : 'bg-white'}`}>
             <stat.icon size={20} className="mx-auto mb-2" />
             <h3 className="font-semibold text-[10px] uppercase">{stat.label}</h3>
             <p className="text-xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- CONTENT --- */}
      <div className="bg-white rounded-2xl shadow-sm border min-h-[400px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 border-b">
           <h2 className="text-xl font-bold text-[#5D4037] capitalize">{activeFilter.replace('_', ' ')}</h2>
           
           {activeFilter === 'delivered' && (
             <div className="flex flex-1 md:justify-end gap-3">
               <div className="relative w-full md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type="text" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}
                   placeholder="Search branch or item..."
                   className="w-full bg-gray-50 border pl-10 pr-4 py-2 rounded-xl text-xs focus:border-[#5D4037] outline-none"
                 />
               </div>
               <button onClick={() => window.print()} className="bg-[#5D4037] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2"><Printer size={14} /> Print</button>
             </div>
           )}
        </div>

        {activeFilter === 'requests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold uppercase text-gray-400">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Qty Needed</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleRequests.map((req) => (
                  <tr key={req.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-[#5D4037]">{req.item}</td>
                    <td className="px-6 py-5 text-[10px] font-black text-[#A67C37] uppercase">{req.branch}</td>
                    <td className="px-6 py-5 font-bold">{req.quantity}</td>
                    <td className="px-6 py-5 text-right"><button onClick={() => setPartialDeliveryItem(req)} className="bg-[#A67C37] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase">Deliver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'delivered' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-bold uppercase text-gray-400">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Receiver</th>
                  <th className="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((h) => (
                  <tr key={h.id} className="border-b">
                    <td className="px-6 py-5 font-bold text-[#5D4037]">{h.item}</td>
                    <td className="px-6 py-5 font-bold">{h.quantity}</td>
                    <td className="px-6 py-5 text-[10px] font-black text-[#A67C37] uppercase">{h.receiver}</td>
                    <td className="px-6 py-5 text-right text-xs text-gray-400">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'my_stock' && (
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myStock.map((item) => (
              <div key={item.id} className="p-5 bg-gray-50 rounded-2xl flex justify-between items-center">
                <span className="font-bold text-[#5D4037]">{item.item}</span>
                <span className="font-black text-[#A67C37]">{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}