'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export default function ProductionNotifications() {
  return (
    // ADDED px-4 md:px-8 to give safe margins on mobile screens
    <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8 py-6 md:py-8 pb-20">
      
      <div className="border-b border-gray-100 pb-4 md:pb-6">
        {/* Adjusted text sizing to scale down smoothly on phones */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shop Management</h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Real-time updates for shop operations and inventory.</p>
      </div>

      {/* Tabs: Added flex-wrap so if you add more tabs later, they wrap to the next line instead of squishing */}
      <div className="flex flex-wrap gap-3 md:gap-4">
        
        {/* General Tab - Red Badge */}
        <button className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-bold bg-white text-red-600 border border-red-100 shadow-sm transition-colors hover:bg-red-50">
           <Bell size={18} className="w-4 h-4 md:w-5 md:h-5" />
           General <span className="ml-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-extrabold">(0)</span>
        </button>
      </div>

      {/* --- EMPTY STATE --- */}
      {/* Changed fixed h-[400px] to min-h-[300px] md:min-h-[400px] so it takes up less unnecessary screen space on mobile */}
      <div className="bg-white rounded-[24px] md:rounded-3xl border border-gray-100 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-center p-6 md:p-8 mx-1 md:mx-0">
        
        <div className="mb-4 md:mb-6 animate-pulse">
           <Bell className="w-10 h-10 md:w-12 md:h-12 text-gray-900" strokeWidth={1.5} />
        </div>

        <h3 className="text-base md:text-lg font-bold text-gray-900">No general notifications</h3>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          (commande from shop)
        </p>
      
      </div>

    </div>
  );
}