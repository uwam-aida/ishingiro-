'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. Added Router Import
import { Package, Clock, ShoppingBag, AlertCircle, ArrowRight, Search, CheckCircle, Archive, ArrowLeft } from 'lucide-react'; // 2. Added ArrowLeft

export default function DashboardHome() {
  const router = useRouter(); // 3. Initialize Router
  
  // 1. Added 'received' to the filter type
  const [activeFilter, setActiveFilter] = useState<'baked' | 'orders' | 'received' | 'stock' | 'damaged'>('baked');

  // --- MOCK DATA ---
  const [bakedItems, setBakedItems] = useState([
    { id: 1, item: 'Fresh Bread', quantity: 100, unit: 'pieces', from: 'Baker Assistant', status: 'Sent' },
    { id: 2, item: 'Donuts', quantity: 50, unit: 'pieces', from: 'Head Baker', status: 'Sent' },
  ]);

  const orders = [
    { id: 1, item: 'Wedding Cake', quantity: '1', unit: 'piece', time: '10:30 PM', status: 'Pending' },
    { id: 2, item: 'Chocolate Cookies', quantity: '20', unit: 'packets', time: '12:00 PM', status: 'Baking' },
  ];

  // 2. New State for Received History
  const [receivedLog, setReceivedLog] = useState([
    { id: 101, item: 'Samosa', quantity: 30, unit: 'pieces', time: '08:00 AM', from: 'Kitchen' }
  ]);

  const [shopStock, setShopStock] = useState([
    { id: 1, item: 'White Loaf', quantity: 45, unit: 'pieces', status: 'Available' },
    { id: 2, item: 'Milk (1L)', quantity: 2, unit: 'bottles', status: 'Low Stock' },
  ]);

  const damagedItems = [
    { id: 1, item: 'Burnt Toast', quantity: 5, unit: 'pieces', reason: 'Burnt', status: 'Reported' },
  ];

  // --- RECEIVE LOGIC (Updated to track history) ---
  const handleReceive = (id: number) => {
    const itemToReceive = bakedItems.find(item => item.id === id);
    if (!itemToReceive) return;

    // A. Update Stock
    setShopStock(prevStock => {
      const existingItemIndex = prevStock.findIndex(stock => stock.item === itemToReceive.item);
      if (existingItemIndex >= 0) {
        const newStock = [...prevStock];
        newStock[existingItemIndex] = {
          ...newStock[existingItemIndex],
          quantity: newStock[existingItemIndex].quantity + itemToReceive.quantity,
          status: 'Available'
        };
        return newStock;
      } else {
        return [...prevStock, {
          id: Date.now(),
          item: itemToReceive.item,
          quantity: itemToReceive.quantity,
          unit: itemToReceive.unit,
          status: 'Available'
        }];
      }
    });

    // B. Add to Received Log (History)
    setReceivedLog(prev => [{
      id: Date.now(),
      item: itemToReceive.item,
      quantity: itemToReceive.quantity,
      unit: itemToReceive.unit,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      from: itemToReceive.from
    }, ...prev]);

    // C. Remove from Incoming
    setBakedItems(prev => prev.filter(item => item.id !== id));
  };

  const totalStockCount = shopStock.reduce((acc, item) => acc + item.quantity, 0);

  // --- UPDATED STATS GRID (Added Received Product) ---
  const stats = [
    { id: 'baked', label: 'Baked Items', value: bakedItems.length.toString(), sub: 'Ready to receive', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', value: orders.length.toString(), sub: 'My requests', icon: Clock },
    { id: 'received', label: 'Received Product', value: receivedLog.length.toString(), sub: 'History log', icon: Archive }, // NEW GRID
    { id: 'stock', label: 'Rest Product', value: totalStockCount.toString(), sub: 'In shop', icon: Package },
    { id: 'damaged', label: 'Damaged', value: damagedItems.length.toString(), sub: 'Reported', icon: AlertCircle },
  ];

  const getViewAllLink = () => {
    switch (activeFilter) {
      case 'orders': return '/shop-manager/notifications';
      case 'damaged': return '/shop-manager/products';
      default: return '/shop-manager/products';
    }
  };

  const renderTableContent = () => {
    switch (activeFilter) {
      case 'baked': 
        return (
          <>
             <thead>
              <tr className="bg-[#A67C37] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bakedItems.length > 0 ? bakedItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#EBE0CC]/20 transition-colors">
                  <td className="px-6 py-5 font-semibold text-[#5D4037]">{item.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-5 text-gray-500">{item.from}</td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleReceive(item.id)}
                      className="bg-[#5D4037] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-[#4a332a] transition-colors flex items-center gap-2 ml-auto"
                    >
                      <CheckCircle size={14} /> Receive
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No new baked items.</td></tr>
              )}
            </tbody>
          </>
        );

      case 'orders': 
        return (
          <>
            <thead>
              <tr className="bg-[#5D4037] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Due Time</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((item) => (
                <tr key={item.id} className="hover:bg-[#EBE0CC]/20 transition-colors">
                  <td className="px-6 py-5 font-semibold text-[#5D4037]">{item.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-5 text-gray-500">{item.time}</td>
                  <td className="px-6 py-5 text-right">
                    <span className="bg-[#EBE0CC] text-[#5D4037] px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-[#d4c5ad]">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        );

      case 'received': 
        return (
          <>
            <thead>
              <tr className="bg-[#5D4037] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Quantity Received</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-right">From</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {receivedLog.map((item) => (
                <tr key={item.id} className="hover:bg-[#EBE0CC]/20 transition-colors">
                  <td className="px-6 py-5 font-semibold text-[#5D4037]">{item.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-5 text-gray-500 font-mono text-xs">{item.time}</td>
                  <td className="px-6 py-5 text-right text-sm text-[#A67C37] font-bold">
                    {item.from}
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        );

      case 'stock': 
        return (
          <>
            <thead>
              <tr className="bg-[#A67C37] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shopStock.map((item) => (
                <tr key={item.id} className="hover:bg-[#EBE0CC]/20 transition-colors">
                  <td className="px-6 py-5 font-semibold text-[#5D4037]">{item.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border ${
                      item.status === 'Low Stock' 
                      ? 'bg-[#5D4037] text-white border-[#5D4037]' 
                      : 'bg-white text-[#5D4037] border-[#A67C37]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        );

      case 'damaged': 
        return (
          <>
            <thead>
              <tr className="bg-[#5D4037] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {damagedItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#EBE0CC]/20 transition-colors">
                  <td className="px-6 py-5 font-semibold text-[#5D4037]">{item.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-5 text-right text-gray-500 italic">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* --- MOBILE LOGO --- */}
      <div className="md:hidden flex items-center justify-center mb-6">
         <img src="/logo.png" alt="Shop Logo" className="h-16 w-auto object-contain" />
      </div>

      {/* Page Header (Updated with Back Arrow) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* --- ADDED BACK BUTTON SECTION --- */}
        <div className="flex items-center gap-4">
           <button 
             onClick={() => router.back()} 
             className="p-2 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
           >
             <ArrowLeft size={24} />
           </button>
           
           <div>
             <h1 className="text-2xl font-bold text-[#5D4037] tracking-tight">Shop Overview</h1>
             <p className="text-gray-500 text-sm mt-1">Daily operations and stock management.</p>
           </div>
        </div>
        {/* -------------------------------- */}

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5D4037] transition-colors" size={18} />
            <input type="text" placeholder="Search items..." className="bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037] w-64 transition-all shadow-sm" />
          </div>
        </div>
      </div>

      {/* Stats Cards (Now 5 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => setActiveFilter(stat.id as any)}
            className={`p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center transition-all cursor-pointer group ${
              activeFilter === stat.id 
              ? 'bg-[#5D4037] text-white border-[#5D4037] scale-[1.03] shadow-lg' 
              : 'bg-white border-gray-100 hover:border-[#A67C37] hover:shadow-md'
            }`}
          >
             <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
               activeFilter === stat.id ? 'bg-[#A67C37] text-white' : 'bg-[#EBE0CC]/40 text-[#5D4037]'
             }`}>
               <stat.icon size={26} strokeWidth={2} />
             </div>
             <h3 className={`font-semibold text-xs uppercase tracking-wide ${activeFilter === stat.id ? 'text-[#EBE0CC]' : 'text-gray-600'}`}>{stat.label}</h3>
             <p className={`text-2xl font-extrabold mt-1 ${activeFilter === stat.id ? 'text-white' : 'text-[#5D4037]'}`}>{stat.value}</p>
             <p className={`text-[10px] font-medium mt-1 ${activeFilter === stat.id ? 'text-gray-300' : 'text-gray-400'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Interactive List Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#5D4037] capitalize">
            {activeFilter === 'baked' ? 'Incoming Baked Items' : 
             activeFilter === 'orders' ? 'My Order History' : 
             activeFilter === 'received' ? 'Received History' : 
             activeFilter === 'stock' ? 'Current Shop Inventory' : 'Damaged Reports'}
          </h2>
          
          <Link 
            href={getViewAllLink()}
            className="text-sm font-semibold text-[#A67C37] hover:text-[#5D4037] flex items-center gap-1 transition-colors hover:underline"
          >
            View All <ArrowRight size={16} />
          </Link>
          
        </div>
        
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[300px]">
          <table className="w-full text-left border-collapse">
            {renderTableContent()}
          </table>
        </div>
      </div>

    </div>
  );
}