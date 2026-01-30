'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Bell, ArrowRight } from 'lucide-react';

export default function StoreKeeperDashboard() {
  
  // Stats Data
  const stats = [
    { 
      label: 'Baked items entered', 
      value: '0', 
      sub: 'Finished baked items', 
      icon: Package,
      href: '/store-keeper/products',
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Shop manager requests', 
      value: '3', 
      sub: 'Active requests', 
      icon: Bell,
      href: '/store-keeper/notifications',
      color: 'text-red-600', 
      bg: 'bg-red-50'
    },
  ];

  // Requests Table Data
  const requests = [
    { item: 'Bread', quantity: '50 piece', units: 'Piece', status: 'pending' },
    { item: 'Birthday Cake', quantity: '1 piece', units: 'piece', status: 'pending' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Store Keeper</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of inventory and incoming requests.</p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:scale-[1.01] hover:shadow-md group cursor-pointer"
          >
             <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
               <stat.icon size={26} strokeWidth={2} />
             </div>
             <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{stat.label}</h3>
             <p className="text-4xl font-extrabold text-gray-900 mt-2">{stat.value}</p>
             <p className="text-xs font-medium text-gray-400 mt-1">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* --- REQUESTS TABLE --- */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-bold text-gray-900">Shop manager requests</h2>
           <Link href="/store-keeper/notifications" className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1">
             View All <ArrowRight size={14} />
           </Link>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-900 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Units</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((req, i) => (
                  <tr key={i} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-gray-900">{req.item}</td>
                    <td className="px-6 py-5 text-gray-600 font-medium">{req.quantity}</td>
                    <td className="px-6 py-5 text-gray-500 text-sm uppercase">{req.units}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase shadow-sm">
                        {req.status}
                      </span>
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