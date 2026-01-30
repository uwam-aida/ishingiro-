'use client';

import React from 'react';
import { Bell, Inbox } from 'lucide-react';

export default function BakerNotifications() {
  
  // Empty array to simulate "No Notifications"
  const notifications: any[] = []; 

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Updates on orders and inventory.</p>
      </div>

      {/* --- SINGLE TAB (General - Now Professional Red) --- */}
      <div className="flex gap-2">
        <button 
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-red-50 text-red-700 border border-red-100 shadow-sm transition-all hover:bg-red-100"
        >
          <Bell size={18} />
          General <span className="ml-1 bg-red-200 text-red-800 px-2 py-0.5 rounded-full text-xs">0</span>
        </button>
      </div>

      {/* --- PROFESSIONAL EMPTY STATE --- */}
      <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 h-[450px] flex flex-col items-center justify-center text-center p-8 transition-colors hover:border-gray-300">
        
        {/* Icon Circle */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
          <Inbox size={32} className="text-gray-300" strokeWidth={1.5} />
        </div>

        <h3 className="text-xl font-bold text-gray-900">No general notifications</h3>
        <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
          You are all caught up! Orders from the shop manager will appear here when they are sent.
        </p>

        {/* Optional: 'Check Again' button */}
        <button className="mt-8 text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
            Refresh List
        </button>
      
      </div>

    </div>
  );
}