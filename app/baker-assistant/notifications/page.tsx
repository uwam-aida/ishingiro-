'use client';

import React from 'react';
import { Bell, Clock, Package, Scale, ChefHat, ArrowLeft } from 'lucide-react';

export default function BakerNotificationsPage() {
  const notifications = [
    { id: 1, text: "Production Order: 300 White Loaves requested", time: "Just now", type: 'order', status: 'unread' },
    { id: 2, text: "Inventory Alert: Wheat Flour below 50kg", time: "2 hours ago", type: 'stock', status: 'unread' },
    { id: 3, text: "Batch #104 Quality Check Passed", time: "5 hours ago", type: 'quality', status: 'read' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-[#1C1C1C] rounded-2xl text-white shadow-lg shadow-black/20">
          <Bell size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1C1C1C]">Baker Notifications</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Live Production Alerts</p>
        </div>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-5 rounded-[2.5rem] border transition-all flex items-center justify-between ${
              n.status === 'unread' ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-50/50 border-transparent opacity-70'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${
                n.type === 'order' ? 'bg-blue-50 text-blue-600' : 
                n.type === 'stock' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}>
                {n.type === 'order' ? <ChefHat size={20}/> : 
                 n.type === 'stock' ? <Scale size={20}/> : <Package size={20}/>}
              </div>
              <div>
                <p className={`text-sm font-bold ${n.status === 'unread' ? 'text-gray-900' : 'text-gray-500'}`}>
                  {n.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{n.time}</span>
                </div>
              </div>
            </div>
            
            {n.status === 'unread' && (
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse mr-2" />
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <Bell size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No new alerts for today</p>
          </div>
        )}
      </div>
    </div>
  );
}