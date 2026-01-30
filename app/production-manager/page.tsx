'use client';

import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { Store, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function ProductionDashboard() {
  
  // Stats Data with 'href' added for navigation
  const stats = [
    { 
      label: 'Shop stock', 
      value: '2', 
      sub: 'Items in Stock', 
      icon: Store,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      valueColor: 'text-gray-900',
      subColor: 'text-gray-400',
      href: '/production-manager/products?tab=shop_stock' // Link to Shop Stock
    },
    { 
      label: 'Orders to Edit', 
      value: '1', 
      sub: 'Shop manager order', 
      icon: ShoppingCart,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      valueColor: 'text-gray-900',
      subColor: 'text-gray-400',
      href: '/production-manager/products?tab=order_per_piece' // Link to Orders
    },
    { 
      label: 'Total Damaged', 
      value: '5', 
      sub: 'Damaged items', 
      icon: AlertTriangle,
      iconBg: 'bg-red-50', 
      iconColor: 'text-red-500', 
      valueColor: 'text-red-500', 
      subColor: 'text-red-300',
      href: '/production-manager/products?tab=damaged' // Link to Damaged
    },
  ];

  const damagedReports = [
    { item: 'Biscuits', quantity: '5 pieces', reportedBy: 'shop manager', date: '08.10.2025' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Production manager</h1>
      </div>

      {/* --- STATS CARDS (Now Clickable) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href}
            className="block group" // 'block' makes the whole Link clickable
          >
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center py-10 transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-gray-200 cursor-pointer">
               {/* Icon */}
               <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${stat.iconBg} ${stat.iconColor}`}>
                 <stat.icon size={22} />
               </div>
               
               {/* Label */}
               <h3 className="font-bold text-gray-900 text-sm">{stat.label}</h3>
               
               {/* Value */}
               <p className={`text-4xl font-extrabold mt-3 ${stat.valueColor}`}>
                  {stat.value}
               </p>
               
               {/* Subtitle */}
               <p className={`text-xs font-bold mt-2 ${stat.subColor}`}>
                  {stat.sub}
               </p>
            </div>
          </Link>
        ))}
      </div>

      {/* --- DAMAGED REPORTS TABLE --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Damaged Reports Overview</h2>
            <p className="text-gray-400 text-sm mt-1">Damaged items from baker and shop manager</p>
          </div>
          <Link href="/production-manager/products?tab=damaged" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
            View All
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-900 text-xs font-bold uppercase border-b border-gray-100">
                  <th className="px-8 py-5">Items</th>
                  <th className="px-8 py-5">Quantity</th>
                  <th className="px-8 py-5">Reported by</th>
                  <th className="px-8 py-5 text-right">date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {damagedReports.map((report, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6 font-bold text-gray-900 text-sm">{report.item}</td>
                    <td className="px-8 py-6 text-gray-900 font-medium text-sm">{report.quantity}</td>
                    <td className="px-8 py-6">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase shadow-sm shadow-red-200">
                        {report.reportedBy}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-gray-900 text-sm font-bold">
                      {report.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}