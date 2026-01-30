'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ChefHat, ShoppingCart, ArrowRight } from 'lucide-react';

export default function BakerDashboard() {
  
  // 1. UPDATED STATS with Colors (Matching Shop Manager Style)
  const stats = [
    { 
      label: 'Measured items', 
      value: '1', 
      sub: 'Items to bake', 
      icon: Scale,
      href: '/baker-assistant/products?tab=measured',
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Baked items', 
      value: '1', 
      sub: 'Ready for shop', 
      icon: ChefHat,
      href: '/baker-assistant/products?tab=baked',
      color: 'text-green-600', 
      bg: 'bg-green-50'
    },
    { 
      label: 'Order from shop', 
      value: '2', 
      sub: 'From shop manager', 
      icon: ShoppingCart,
      href: '/baker-assistant/notifications',
      color: 'text-orange-600', 
      bg: 'bg-orange-50'
    },
  ];

  const orders = [
    { item: 'Bread', quantity: '50 piece', units: 'Piece', status: 'need to prepare' },
    { item: 'Birthday Cake', quantity: '1 piece', units: 'piece', status: 'need to prepare' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Baker Assistant</h1>
        <p className="text-gray-500 text-sm mt-1">Production overview and tasks</p>
      </div>

      {/* --- STATS CARDS (Now Colorful & Professional) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group"
          >
             {/* The Icon Container: Uses the specific color background */}
             <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
               <stat.icon size={26} strokeWidth={2} />
             </div>
             
             <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{stat.label}</h3>
             <p className="text-3xl font-extrabold text-gray-900 mt-2">{stat.value}</p>
             <p className="text-xs font-medium text-gray-400 mt-1">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* --- ORDERS TABLE --- */}
      <div className="space-y-4">
        
        <div className="flex items-center gap-2">
           <h2 className="text-lg font-bold text-red-600">Order from Shop Manager</h2>
           <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full border border-red-100">URGENT</span>
        </div>
        <p className="text-xs text-gray-400 -mt-3">Items requested by the shop that need immediate preparation</p>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Units</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-5 font-bold text-gray-900">{order.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{order.quantity}</td>
                  <td className="px-6 py-5 text-gray-500 text-sm uppercase">{order.units}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg uppercase tracking-wide shadow-sm hover:shadow transition-all active:scale-95">
                      {order.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}