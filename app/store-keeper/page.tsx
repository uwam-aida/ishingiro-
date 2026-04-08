'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Package, Bell, ArrowRight, ShoppingBag, AlertCircle, Eye, FileText, Search, X, ArrowLeft, CheckCheck, ClipboardList, PenLine, Printer, Edit3, CheckSquare, Square, Clock, MapPin, Download, Trash2, ShieldAlert, ChefHat, PackageCheck } from 'lucide-react';
interface Product {
  name: string;
  price: number;
  category: string;
  type: string;
}

// --- OFFICIAL PRODUCT LIST (COMPLETE LIST) ---
const FINANCE_PRODUCTS: Product[] = [
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


export default function StoreKeeperDashboard() {
  const router = useRouter(); 
  const params = useParams();
  
  const rawBranchId = params?.branchId;
  const branchName = rawBranchId?.toString().toLowerCase() === 'kabuga' ? 'KABUGA SHOP' : rawBranchId?.toString().toLowerCase() === 'masaka' ? 'MASAKA SHOP' : 'BRANCH';

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [activeFilter, setActiveFilter] = useState<'baked_log' | 'requests' | 'my_stock' | 'delivered' | 'damaged' | 'notes' | 'sales_log' | 'cake_orders' | 'cake_requests'>('requests');  const [deliveryNote, setDeliveryNote] = useState<any>(null);
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
  const [cakeOrders, setCakeOrders] = useState([
    { id: 1, customer: "John Doe", details: "Vanilla - Stage 1", pickupTime: "10:30 AM", status: "Ready" },
    { id: 2, customer: "Mary Smith", details: "Chocolate - 10kg", pickupTime: "08:00 AM", status: "Pending" },
 ]);
 const [cakeRequests, setCakeRequests] = useState([
    { id: 10, branch: "KABUGA", details: "Birthday Cake", pickupTime: "02:00 PM" },
    { id: 11, branch: "MASAKA", details: "Wedding Cake", pickupTime: "09:00 AM" },
  ]);

  const [deliveryHistory, setDeliveryHistory] = useState([
    { id: 55, item: 'Donuts', quantity: 50, date: 'Yesterday', receiver: 'MASAKA' }
  ]);

  const [issuedNotes, setIssuedNotes] = useState([
    { id: 'DN-9921', date: '02.04.2026', time: '10:30 AM', items: [{ name: 'Bread', quantity: 100, destination: 'KABUGA SHOP' }] },
  ]);

  const [damagedProducts, setDamagedProducts] = useState([
    { id: 1, item: 'Special Flour', quantity: 5, unit: 'kg', date: '2026-03-27', time: '09:00 AM' },
  ]);

  const [bakedProducts, setBakedProducts] = useState([
    { id: 1, item: 'Milk Bread', quantity: 300, time: '07:00 AM' },
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
    const noteData = { id: newNoteId, date: '02.04.2026', time: getCurrentTime(), items: selectedItems.map(item => ({ name: item.item, quantity: item.quantity, destination: `${item.branch.toUpperCase()} SHOP` })) };
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
    { id: 'baked_log', label: 'Baked Products', value: bakedProducts.length.toString(), icon: ChefHat },
    { id: 'my_stock', label: 'Stock', value: myStock.length.toString(), icon: ShoppingBag },
    { id: 'cake_orders', label: 'Cake Orders', value: cakeOrders.length.toString(), icon: ClipboardList }, // Added
    { id: 'cake_requests', label: 'Cake Requests', value: cakeRequests.length.toString(), icon: Package }, // Added
    { id: 'delivered', label: 'Added Products', value: deliveryHistory.length.toString(), icon: CheckCheck },
    { id: 'damaged', label: 'Damaged', value: damagedProducts.length.toString(), icon: ShieldAlert },
    { id: 'notes', label: 'Delivery Notes', value: issuedNotes.length.toString(), icon: FileText },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 relative px-4 font-sans text-gray-700">
      <style jsx global>{`
        @media print { body * { visibility: hidden; } #printable-note, #printable-note * { visibility: visible; } #printable-note { position: absolute; left: 0; top: 0; width: 100%; border: none !important; } .no-print { display: none !important; } }
      `}</style>

      {/* --- EDIT POPUP --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 no-print">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-5 shadow-2xl border border-gray-100 text-center text-black">
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

  {/* --- DELIVERY NOTE POPUP (UPDATED TO MATCH IMAGE) --- */}
{deliveryNote && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 no-print">
    <div id="printable-note" className="bg-white w-full max-w-md shadow-2xl overflow-hidden text-black p-8 font-serif border border-gray-200">
      
      {/* HEADER SECTION */}
      <div className="text-center mb-6">
         <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Ishingiro Logo" className="w-16 h-16 object-contain" />
         </div>
         <h2 className="font-bold text-lg uppercase leading-tight">BINYA LTD</h2>
         <p className="text-[10px] font-bold uppercase">B.P:2558 KIGALI-RWANDA</p>
         <p className="text-[10px] font-bold">TEL:(+250)786766202/072577025</p>
         <p className="text-[10px] font-bold uppercase">TIN: 102806807</p>
         <p className="text-[10px] font-bold">email:ishingiro. naphtal@gmail</p>
      </div>

      <div className="border-t border-b border-black py-2 mb-4 text-center">
          <h3 className="font-bold uppercase text-xs tracking-widest">DELIVERY NOTE / PACKING LIST</h3>
          {/* AUTOMATIC DATE & TIME TRACKING */}
          <p className="text-[10px] font-bold mt-1 uppercase">
            DATE : <span className="underline ml-1 mr-4">{deliveryNote.date}</span> 
            TIME : <span className="underline ml-1">{deliveryNote.time}</span>
          </p>
      </div>

      <div className="mb-4 space-y-2">
          {/* AUTOMATIC BRANCH NAME TRACKING */}
          <p className="text-[10px] font-bold uppercase">
            Custom Name: <span className="underline ml-2">{deliveryNote.items[0]?.destination || "BRANCH"}</span>
          </p>
      </div>

      {/* TABLE SECTION WITH PRICE TRACKING */}
      <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
              <tr className="border-b border-black font-bold">
                  <th className="border-r border-black p-1 text-left uppercase">ITEM NAME</th>
                  <th className="border-r border-black p-1 text-center uppercase">QTY</th>
                  <th className="border-r border-black p-1 text-center uppercase">UNIT PRICE</th>
                  <th className="p-1 text-right uppercase">TOTAL</th>
              </tr>
          </thead>
          <tbody>
              {deliveryNote.items.map((item: any, idx: number) => {
                  // Track the price from MARKETING_PRODUCTS
                  const productData = FINANCE_PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                  const price = productData?.price || 0;
                  const total = price * item.quantity;

                  return (
                    <tr key={idx} className="border-b border-black font-bold uppercase">
                        <td className="border-r border-black p-1">
                           <div>{item.name}</div>
                           {/* This description will only show on the screen, not the paper */}
                           {item.description && (
                            <div className="text-[8px] leading-tight text-gray-500 lowercase italic font-normal no-print">
                             {item.description}
                            </div>
                            )}
                          </td>
                        <td className="border-r border-black p-1 text-center">{item.quantity}</td>
                        <td className="border-r border-black p-1 text-center">{price.toLocaleString()}</td>
                        <td className="p-1 text-right">{total.toLocaleString()}</td>
                    </tr>
                  );
              })}
              {/* TOTAL AMOUNT ROW */}
              <tr className="font-black uppercase border-t border-black">
                  <td colSpan={3} className="border-r border-black p-1 text-right">TOTAL AMOUNT</td>
                  <td className="p-1 text-right">
                    {deliveryNote.items.reduce((acc: number, item: any) => {
                      const productData = FINANCE_PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                      return acc + ((productData?.price || 0) * item.quantity);
                    }, 0).toLocaleString()}
                  </td>
              </tr>
          </tbody>
      </table>

      {/* SIGNATURE & STAMP AREA */}
      <div className="mt-8">
          <div className="flex justify-between text-[10px] font-bold uppercase mb-8">
              <span>Receiver Signature</span>
              <span>Authorized Signature</span>
          </div>
          
          <p className="text-[9px] font-bold italic mb-4">goods Received in good condition</p>

          {/* CLEAN STAMP BOX */}
          <div className=" mx-auto h-24 flex justify-center relative">
            {/* Stamp space */}
          </div>

          {/* KINYARWANDA TEXT */}
          <div className="text-center mt-6">
              <p className="text-[10px] font-bold uppercase tracking-tight">
                  GUTEKEREZA NEZA NO GUKORA NEZA NIBWO BUTWARI.
              </p>
          </div>
      </div>

      {/* ACTIONS (HIDDEN DURING PRINT) */}
      <div className="grid grid-cols-2 gap-3 no-print mt-8 border-t pt-4">
          <button onClick={handlePrint} className="flex-1 bg-[#F57C00] text-white py-3 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2">
            <Printer size={16}/> Print / PDF
          </button>
          <button onClick={() => setDeliveryNote(null)} className="flex-1 border border-gray-300 text-gray-500 py-3 rounded-xl font-bold uppercase text-[10px]">
            Close
          </button>
      </div>
    </div>
  </div>
)}
      

      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 pt-6 no-print text-black">
  <div>
    <h1 className="text-2xl font-black text-black uppercase tracking-tight">STORE KEEPER</h1>
  </div>
</div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 no-print text-black">
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
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[450px] no-print overflow-hidden text-black">
        <div className={`flex flex-col md:flex-row md:items-center justify-between p-7 gap-4 border-b ${activeFilter === 'damaged' ? 'border-rose-100 bg-rose-50/30' : 'border-gray-200'}`}>
           <h2 className={`text-xl font-black uppercase tracking-tight ${activeFilter === 'damaged' ? 'text-rose-700' : 'text-[#F57C00]'}`}>
             {activeFilter.replace('_', ' ')}
           </h2>

           {activeFilter === 'requests' && selectedProductIds.length > 0 && (
             <button onClick={handleBulkDelivery} className="bg-black text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-[#F57C00] transition-all"><PackageCheck size={16} /> Generate Delivery Note ({selectedProductIds.length})</button>
           )}
        </div>

        {activeFilter === 'requests' && (
          <div className="overflow-x-auto text-black">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4 w-10">Select</th><th className="px-8 py-4">Item Details</th><th className="px-8 py-4 text-center">Branch</th><th className="px-8 py-4 text-center">Requested Qty</th><th className="px-8 py-4 text-right">Time Requested</th><th className="px-8 py-4 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-200 text-black">
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

        {/* Baked Products Log View */}
        {activeFilter === 'baked_log' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4">Product Item</th><th className="px-8 py-4 text-center">Batch Qty</th><th className="px-8 py-4 text-right">Recorded Time</th></tr></thead>
              <tbody className="divide-y divide-gray-100 font-bold">
                {bakedProducts.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{b.item}</td>
                    <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">{b.quantity}</td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* --- FULL CAKE ORDERS GRID --- */}
{activeFilter === 'cake_orders' && (
  <div className="overflow-x-auto">
    <table className="w-full text-left font-bold">
      <thead>
        <tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200">
          <th className="px-8 py-4">Customer & Cake Details</th>
          <th className="px-8 py-4 text-center">Status</th>
          <th className="px-8 py-4 text-right">Pickup Time</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 font-bold">
        {cakeOrders
          .sort((a, b) => a.pickupTime.localeCompare(b.pickupTime)) // Sort line by line by time
          .map((order) => (
          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-8 py-6">
              <div className="flex flex-col">
                <span className="font-black text-[#F57C00] uppercase text-sm">{order.customer}</span>
                <span className="text-[10px] text-gray-400 lowercase italic">{order.details}</span>
              </div>
            </td>
            <td className="px-8 py-6 text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black ${order.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.status}
                </span>
            </td>
            <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{order.pickupTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{/* --- CAKE REQUESTS GRID --- */}
{activeFilter === 'cake_requests' && (
  <div className="overflow-x-auto">
    <table className="w-full text-left font-bold">
      <thead>
        <tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200">
          <th className="px-8 py-4">Requesting Branch</th>
          <th className="px-8 py-4 text-center">Cake Details</th>
          <th className="px-8 py-4 text-right">Required Time</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 font-bold">
        {cakeRequests
          .sort((a, b) => a.pickupTime.localeCompare(b.pickupTime)) // Sort line by line by time
          .map((req) => (
          <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{req.branch} SHOP</td>
            <td className="px-8 py-6 text-center font-bold text-gray-900 text-sm">{req.details}</td>
            <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{req.pickupTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        {/* Other filters... */}
        {activeFilter === 'notes' && (
          <div className="p-0 text-black">
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
      </div>
    </div>
  );
}