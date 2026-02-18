'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export default function ProductionNotifications() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shop Management</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time updates for shop operations and inventory.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        
        {/* General Tab - Red Badge */}
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-red-600 border border-red-100 shadow-sm">
           <Bell size={18} />
           General <span className="ml-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-extrabold">(0)</span>
        </button>
      </div>

      {/* --- EMPTY STATE --- */}
      <div className="bg-white rounded-3xl border border-gray-100 h-[400px] flex flex-col items-center justify-center text-center p-8">
        
        <div className="mb-6 animate-pulse">
           <Bell size={48} className="text-gray-900" strokeWidth={1.5} />
        </div>

        <h3 className="text-lg font-bold text-gray-900">No general notifications</h3>
        <p className="text-gray-400 text-sm mt-1">
          (commande from shop)
        </p>
      
      </div>

    </div>
  );
}