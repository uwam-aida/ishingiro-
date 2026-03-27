'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Package, Bell, ArrowRight, ShoppingBag, AlertCircle, Eye, FileText, Search, X, ArrowLeft, CheckCheck, ClipboardList, PenLine, Printer, Edit3, CheckSquare, Square, Clock, MapPin, Download, Trash2, ShieldAlert } from 'lucide-react';

// --- OFFICIAL PRODUCT LIST (COMPLETE LIST) ---
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

export default function StoreKeeperDashboard() {
  const router = useRouter(); 
  const params = useParams();
  
  const rawBranchId = params?.branchId;
  const branchName = rawBranchId?.toString().toLowerCase() === 'kabuga' ? 'KABUGA SHOP' : rawBranchId?.toString().toLowerCase() === 'masaka' ? 'MASAKA SHOP' : 'BRANCH';

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [activeFilter, setActiveFilter] = useState<'baked_log' | 'requests' | 'my_stock' | 'delivered' | 'damaged' | 'notes' | 'sales_log'>('requests');
  const [deliveryNote, setDeliveryNote] = useState<any>(null);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editQty, setEditQty] = useState('');

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const [myStock, setMyStock] = useState([
    { id: 1, item: 'Bread', quantity: 500, unit: 'pcs' },
    { id: 2, item: 'Donuts', quantity: 200, unit: 'pcs' },
    { id: 3, item: 'Milk', quantity: 50, unit: 'liters' },
  ]);

  const [shopRequests, setShopRequests] = useState([
    { id: 101, item: 'Bread', quantity: 100, unit: 'pcs', time: '08:30 AM', branch: 'kabuga', isEdited: false },
    { id: 102, item: 'Milk', quantity: 10, unit: 'liters', time: '09:15 AM', branch: 'masaka', isEdited: false },
    { id: 103, item: 'Bread', quantity: 600, unit: 'pcs', time: '10:45 AM', branch: 'masaka', isEdited: false },
  ]);

  const [deliveryHistory, setDeliveryHistory] = useState([
    { id: 55, item: 'Donuts', quantity: 50, date: 'Yesterday', receiver: 'MASAKA' }
  ]);

  const [issuedNotes, setIssuedNotes] = useState([
    { id: 'DN-9921', date: '2026-03-27', time: '10:30 AM', items: [{ name: 'Bread', quantity: 100, destination: 'KABUGA SHOP' }] },
  ]);

  const [damagedProducts, setDamagedProducts] = useState([
    { id: 1, item: 'Special Flour', quantity: 5, unit: 'kg', date: '2026-03-27', time: '09:00 AM' },
  ]);

  const handlePrint = () => { window.print(); };

  const toggleSelection = (id: number) => {
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const getStockForItem = (itemName: string) => {
    return myStock.find(s => s.item.toLowerCase() === itemName.toLowerCase())?.quantity || 0;
  };

  const selectedItems = shopRequests.filter(req => selectedProductIds.includes(req.id));

  const handleBulkDelivery = () => {
    if (selectedProductIds.length === 0) return;
    const newNoteId = `DN-${Math.floor(Math.random() * 10000)}`;
    const noteData = { id: newNoteId, date: new Date().toLocaleDateString(), time: getCurrentTime(), items: selectedItems.map(item => ({ name: item.item, quantity: item.quantity, destination: `${item.branch.toUpperCase()} SHOP` })) };
    setDeliveryNote(noteData);
    setIssuedNotes(prev => [noteData, ...prev]);
    setShopRequests(prev => prev.filter(req => !selectedProductIds.includes(req.id)));
    setSelectedProductIds([]);
  };

  const handleEditRequest = () => {
    const qty = parseInt(editQty);
    if (isNaN(qty) || qty < 0) return;
    setShopRequests(prev => prev.map(req => req.id === editingItem.id ? { ...req, quantity: qty, isEdited: true } : req));
    setEditingItem(null);
    setEditQty('');
  };

  const stats = [
    { id: 'requests', label: 'Requests', value: shopRequests.length.toString(), icon: Bell },
    { id: 'my_stock', label: 'Stock', value: myStock.length.toString(), icon: ShoppingBag },
    { id: 'delivered', label: 'Added Products', value: deliveryHistory.length.toString(), icon: CheckCheck },
    { id: 'damaged', label: 'Damaged', value: damagedProducts.length.toString(), icon: ShieldAlert },
    { id: 'notes', label: 'Delivery Notes', value: issuedNotes.length.toString(), icon: FileText },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 relative px-4 font-sans">
      <style jsx global>{`
        @media print { body * { visibility: hidden; } #printable-note, #printable-note * { visibility: visible; } #printable-note { position: absolute; left: 0; top: 0; width: 100%; } .no-print { display: none !important; } }
      `}</style>

      {/* --- EDIT POPUP --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 no-print">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-5 shadow-2xl border border-gray-100 text-center">
            <h2 className="font-black uppercase text-xs text-[#F57C00]">Edit Quantity</h2>
            <p className="font-bold text-gray-400 text-[10px] uppercase">{editingItem.item}</p>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase">New Quantity</label>
              <input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none font-black text-xl text-[#F57C00] focus:border-[#F57C00]" autoFocus />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingItem(null)} className="flex-1 font-bold text-gray-400">Cancel</button>
              <button onClick={handleEditRequest} className="flex-1 bg-[#F57C00] text-white py-3 rounded-xl font-bold uppercase text-xs shadow-lg">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELIVERY NOTE POPUP --- */}
      {deliveryNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div id="printable-note" className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-[#F57C00] p-6 text-center text-white relative">
              <h2 className="font-bold uppercase tracking-widest text-sm text-bold">Official Delivery Note</h2>
              <p className="text-[10px] opacity-70 mt-1">{deliveryNote.id} | {deliveryNote.date}</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 text-gray-500"><Clock size={14}/> <span className="text-xs font-bold">{deliveryNote.time}</span></div>
                <div className="flex items-center gap-2 text-[#F57C00]"><MapPin size={14}/> <span className="text-xs font-bold uppercase tracking-wider">Ishingiro Factory</span></div>
              </div>
              <div className="space-y-4">
                {deliveryNote.items.map((item: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between font-black text-lg text-[#F57C00]"><span>{item.name}</span><span>{item.quantity}</span></div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-orange-600 uppercase"><ArrowRight size={12}/> {item.destination}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 no-print mt-6">
                <button onClick={handlePrint} className="flex-1 bg-[#F57C00] text-white py-3 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2"><Printer size={16}/> Print / PDF</button>
                <button onClick={() => setDeliveryNote(null)} className="flex-1 border border-gray-300 text-gray-500 py-3 rounded-xl font-bold uppercase text-[10px]">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 pt-6 no-print">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-white border text-[#F57C00]"><ArrowLeft size={24} /></button>
        <div>
          <h1 className="text-2xl font-black text-[#F57C00] uppercase tracking-tight">{branchName} MANAGER</h1>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 no-print">
        {stats.map((stat) => (
          <div 
              key={stat.id} 
              onClick={() => setActiveFilter(stat.id as any)} 
              className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                  activeFilter === stat.id 
                  ? (stat.id === 'damaged' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#F57C00] text-white shadow-lg') 
                  : (stat.id === 'damaged' ? 'bg-white hover:border-red-600' : 'bg-white hover:border-[#F57C00]')
              }`}
          >
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                 activeFilter === stat.id 
                 ? (stat.id === 'damaged' ? 'bg-red-800' : 'bg-[#E65100]') 
                 : (stat.id === 'damaged' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-[#F57C00]')
             }`}>
               <stat.icon size={20} />
             </div>
             <h3 className="font-black text-[10px] uppercase tracking-widest opacity-80">{stat.label}</h3>
             <p className="text-xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[450px] no-print overflow-hidden">
        <div className={`flex flex-col md:flex-row md:items-center justify-between p-7 gap-4 border-b ${activeFilter === 'damaged' ? 'border-rose-100 bg-rose-50/30' : 'border-gray-200'}`}>
           <h2 className={`text-xl font-black uppercase tracking-tight ${activeFilter === 'damaged' ? 'text-rose-700' : 'text-[#F57C00]'}`}>
             {activeFilter.replace('_', ' ')}
           </h2>
        </div>

        {/* Requests View */}
        {activeFilter === 'requests' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4 w-10">Select</th><th className="px-8 py-4">Item Details</th><th className="px-8 py-4 text-center">Branch</th><th className="px-8 py-4 text-center">Requested Qty</th><th className="px-8 py-4 text-right">Time Requested</th><th className="px-8 py-4 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {shopRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6"><button onClick={() => toggleSelection(req.id)} className="text-[#F57C00]">{selectedProductIds.includes(req.id) ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-300" />}</button></td>
                    <td className="px-8 py-6"><div className="flex flex-col gap-1"><span className="font-black text-[#F57C00] uppercase text-sm">{req.item}</span>{req.isEdited && <span className="text-[9px] font-black text-rose-600 uppercase flex items-center gap-1"><AlertCircle size={10}/> Modified</span>}</div></td>
                    <td className="px-8 py-6 text-center"><span className="px-3 py-1 bg-[#FAF6F4] text-[#F57C00] rounded-lg text-[10px] font-black uppercase">{req.branch}</span></td>
                    <td className="px-8 py-6 text-center"><span className="font-black text-lg text-gray-900">{req.quantity}</span></td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{req.time}</td>
                    <td className="px-8 py-6 text-right"><button onClick={() => { setEditingItem(req); setEditQty(req.quantity.toString()); }} className="text-gray-300 hover:text-[#F57C00] p-2 bg-gray-50 rounded-xl transition-all"><Edit3 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Note: notes, damaged, my_stock, delivered views remain unchanged */}
        {activeFilter === 'notes' && (
          <div className="p-0">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4">Delivered Products & Destination</th><th className="px-8 py-4 text-right">Time Issued</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {issuedNotes.map((note) => (
                  <tr key={note.id} onClick={() => setDeliveryNote(note)} className="hover:bg-gray-50/50 cursor-pointer transition-all group">
                    <td className="px-8 py-6"><div className="flex flex-col gap-1">{note.items.map((it, i) => (<span key={i} className="text-[12px] font-black text-[#F57C00] uppercase">{it.quantity} {it.name} → {it.destination}</span>))}</div></td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400 group-hover:text-[#F57C00]">{note.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'damaged' && (
          <div className="p-0">
            <table className="w-full text-left font-bold">
              <thead><tr className="bg-rose-50 text-[10px] font-black uppercase text-rose-700 tracking-widest border-b border-rose-100"><th className="px-8 py-4">Product Item</th><th className="px-8 py-4 text-center">Quantity Lost</th><th className="px-8 py-4 text-right">Reported Time</th></tr></thead>
              <tbody className="divide-y divide-rose-100">
                {damagedProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-8 py-6 font-black text-rose-800 uppercase text-sm">{item.item}</td>
                    <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">{item.quantity}</td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400 uppercase">{item.date} • {item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'my_stock' && (
          <div className="p-0">
            <table className="w-full text-left font-bold">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4">Product Item</th><th className="px-8 py-4 text-center">Available Stock</th><th className="px-8 py-4 text-right">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-100 font-bold">
                {myStock.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors font-bold"><td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{item.item}</td><td className="px-8 py-6 text-center font-black text-gray-900 text-lg">{item.quantity}</td><td className="px-8 py-6 text-right"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{item.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'delivered' && (
          <div className="p-0">
            <table className="w-full text-left font-bold">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4">Item</th><th className="px-8 py-4">Qty</th><th className="px-8 py-4">Receiver</th><th className="px-8 py-4 text-right">Time</th></tr></thead>
              <tbody className="divide-y divide-gray-100 font-bold">
                {deliveryHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/50"><td className="px-8 py-6 font-black text-[#F57C00] text-sm uppercase">{h.item}</td><td className="px-8 py-6 font-bold text-gray-900">{h.quantity}</td><td className="px-8 py-6 text-[10px] font-black text-[#F57C00] uppercase">{h.receiver}</td><td className="px-8 py-6 text-right text-xs text-gray-400 font-bold">{h.date}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}