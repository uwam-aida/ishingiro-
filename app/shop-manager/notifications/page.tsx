'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle, SlidersHorizontal, Clock } from 'lucide-react';

export default function ShopNotifications() {
  const [activeTab, setActiveTab] = useState<'general' | 'production'>('production');

  // Professional Mock Data
  const notifications = [
    { 
      id: 1, 
      type: 'production',
      title: 'Ready for Pickup', 
      message: '100 pieces of bread baked and ready for shop.', 
      meta: 'by Baker • 1hr ago',
      status: 'unread' 
    },
    { 
      id: 2, 
      type: 'general',
      title: 'System Maintenance', 
      message: 'Scheduled maintenance tonight at 12:00 PM.', 
      meta: 'System Admin • 3hrs ago',
      status: 'read' 
    }
  ];

  const filtered = notifications.filter(n => n.type === activeTab);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time updates for shop operations.</p>
        </div>
        
        <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
          <SlidersHorizontal size={16} /> Filter
        </button>
      </div>

      {/* --- PROFESSIONAL TABS --- */}
      <div className="flex gap-2">
        {/* Production Tab (Green) */}
        <button 
          onClick={() => setActiveTab('production')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${
            activeTab === 'production' 
            ? 'bg-green-50 text-green-700 border-green-100 shadow-sm' // Green when active
            : 'bg-white text-gray-500 border-gray-200 hover:border-green-200 hover:bg-green-50/50'
          }`}
        >
          <CheckCircle size={18} />
          Production <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === 'production' ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>1</span>
        </button>

        {/* General Tab (Red) */}
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 border ${
            activeTab === 'general' 
            ? 'bg-red-50 text-red-700 border-red-100 shadow-sm' // Red when active
            : 'bg-white text-gray-500 border-gray-200 hover:border-red-200 hover:bg-red-50/50'
          }`}
        >
          <Bell size={18} />
          General <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === 'general' ? 'bg-red-200 text-red-800' : 'bg-gray-100'}`}>1</span>
        </button>
      </div>

      {/* --- NOTIFICATION CARDS --- */}
      <div className="space-y-4">
        {filtered.map((note) => (
          <div 
            key={note.id} 
            className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-md flex items-start gap-5 ${
              note.type === 'production' 
              ? 'bg-[#F0FDF4] border-green-100' // Green Card
              : 'bg-red-50/30 border-red-100'   // Subtle Red Card for General
            }`}
          >
            {/* Icon Status */}
            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
               note.type === 'production' 
               ? 'bg-green-500 text-white shadow-green-200 shadow-md' 
               : 'bg-red-500 text-white shadow-red-200 shadow-md'
            }`}>
              {note.type === 'production' ? <CheckCircle size={20} strokeWidth={2.5} /> : <Bell size={20} />}
            </div>

            <div className="flex-1">
               <div className="flex items-center gap-3 mb-1">
                 <h3 className="font-bold text-gray-900 text-base">{note.title}</h3>
                 {note.status === 'unread' && (
                   <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                 )}
               </div>
               
               <p className="text-gray-600 text-sm leading-relaxed">{note.message}</p>
               
               <div className="mt-3 flex items-center gap-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
                 <span className="flex items-center gap-1.5"><Clock size={12} /> {note.meta}</span>
                 
                 {/* Badge */}
                 <span className={`px-2 py-0.5 rounded-md border ${
                   note.type === 'production' 
                   ? 'bg-green-100 text-green-700 border-green-200'
                   : 'bg-red-100 text-red-700 border-red-200'
                 }`}>
                   {note.type}
                 </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}