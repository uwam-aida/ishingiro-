'use client';

import React from 'react';
import Link from 'next/link'; // Ensure Link is imported
import { Package, Clock, ShoppingBag, AlertCircle, ArrowRight, Search, Plus } from 'lucide-react';

export default function DashboardHome() {
  
  // Stats Data
  const stats = [
    { 
      label: 'Shop Stock', 
      value: '0', 
      sub: 'Items available', 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      href: '/shop-manager/products'
    },
    { 
      label: 'Pending Order', 
      value: '1', 
      sub: 'Waiting for baker', 
      icon: Clock, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      href: '/shop-manager/notifications'
    },
    { 
      label: 'Baked Items', 
      value: '1', 
      sub: 'From baker', 
      icon: ShoppingBag, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      href: '/shop-manager/products' 
    },
    { 
      label: 'Damaged Items', 
      value: '0', 
      sub: 'Reported today', 
      icon: AlertCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      href: '/shop-manager/products'
    },
  ];

  const myOrders = [
    { item: 'Bread', quantity: '50 pieces', time: '10:30 PM', status: 'pending' },
    { item: 'Birthday Cake', quantity: '1 piece', time: '12:00 PM', status: 'pending' },
  ];

  const availableItems = [
    { item: 'Fresh Bread', quantity: '100 pieces', addedBy: 'Baker Assistant', status: 'Available' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shop Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, here is what's happening today.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5D4037] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/10 focus:border-[#5D4037] w-64 transition-all shadow-sm"
            />
          </div>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer group"
          >
             <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
               <stat.icon size={26} strokeWidth={2} />
             </div>
             <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{stat.label}</h3>
             <p className="text-3xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
             <p className="text-xs font-medium text-gray-400 mt-1">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* My Orders Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
          
          {/* --- FIXED VIEW ALL BUTTON --- */}
          <Link 
            href="/shop-manager/products" 
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors hover:underline"
          >
            View All <ArrowRight size={16} />
          </Link>
          {/* ----------------------------- */}

        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EBE0CC] text-gray-800 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Due Time</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myOrders.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-5 font-semibold text-gray-900">{order.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{order.quantity}</td>
                  <td className="px-6 py-5 text-gray-500 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" /> {order.time}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-gray-200">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Baked Items Section */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900">Available Baked Items</h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#A67C37] text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Added By</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {availableItems.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-5 font-semibold text-gray-900">{item.item}</td>
                  <td className="px-6 py-5 text-gray-600 font-medium">{item.quantity}</td>
                  <td className="px-6 py-5 text-gray-600 text-sm">{item.addedBy}</td>
                  <td className="px-6 py-5 text-right">
                    <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-green-100">
                      {item.status}
                    </span>
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