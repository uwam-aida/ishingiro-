'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Clock, Search, ArrowLeft, CheckCheck, Smile } from 'lucide-react';

export default function ShopNotifications() {
  const router = useRouter();
  
  // 1. Dynamic Greeting Logic
  const [greeting, setGreeting] = useState('Hello');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // 2. Mock Data
  const [notifications, setNotifications] = useState([
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
      message: 'Scheduled maintenance tonight at 12:00 PM. Please save your work.', 
      meta: 'System Admin • 3hrs ago', 
      status: 'unread'
    },
    { 
      id: 3, 
      type: 'general', 
      title: 'New Policy Update', 
      message: 'All shop managers must submit daily reports by 5 PM.', 
      meta: 'Management • 1 day ago', 
      status: 'read' 
    }
  ]);

  // Filter & Mark Read Logic
  const generalNotifications = notifications.filter(n => n.type === 'general');
  const unreadCount = generalNotifications.filter(n => n.status === 'unread').length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* --- MOBILE LOGO --- */}
      <div className="md:hidden flex items-center justify-center mb-6">
         <img src="/logo.png" alt="Shop Logo" className="h-16 w-auto object-contain" />
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EBE0CC] pb-8">
        
        <div className="flex items-start gap-4">
          
          {/* --- BACK BUTTON WITH LABEL ABOVE --- */}
          <div className="flex flex-col items-center">
            {/* The Text Above */}
            <span className="text-[10px] font-bold text-[#A67C37] uppercase tracking-wider mb-1">
              Back
            </span>
            {/* The Button */}
            <button 
              onClick={() => router.back()} 
              className="p-3 rounded-xl bg-white border border-gray-100 text-[#5D4037] hover:bg-[#EBE0CC]/30 hover:scale-105 transition-all shadow-sm group"
            >
              <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Title Text */}
          <div className="mt-2">
            <span className="text-[#A67C37] font-bold text-xs uppercase tracking-widest mb-1 block">
              Notifications
            </span>
            <h1 className="text-3xl font-bold text-[#5D4037] tracking-tight">
              {greeting}, Shop Manager
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium max-w-md">
              Stay updated with the latest announcements. You have <span className="text-[#5D4037] font-bold">{unreadCount} unread</span> alerts.
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
           {unreadCount > 0 && (
             <button 
               onClick={handleMarkAllRead}
               className="flex items-center gap-2 text-xs font-bold text-[#5D4037] bg-[#EBE0CC]/30 hover:bg-[#EBE0CC]/50 px-4 py-2.5 rounded-full transition-colors"
             >
               <CheckCheck size={14} /> Mark all read
             </button>
           )}
           <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#5D4037] w-48 transition-all"
              />
           </div>
        </div>
      </div>

      {/* --- LIST SECTION --- */}
      <div className="space-y-4">
        {generalNotifications.length > 0 ? (
          generalNotifications.map((note) => (
            <div 
              key={note.id} 
              className={`group relative p-6 rounded-[20px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-start gap-5 ${
                note.status === 'unread' 
                ? 'bg-white border-[#A67C37]/40 shadow-md shadow-[#A67C37]/5' 
                : 'bg-gray-50/50 border-gray-100 opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100'
              }`}
            >
              {/* Icon Container */}
              <div className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                 note.status === 'unread'
                 ? 'bg-[#5D4037] text-white shadow-lg shadow-[#5D4037]/20 rotate-3' 
                 : 'bg-gray-200 text-gray-500'
              }`}>
                <Bell size={20} strokeWidth={note.status === 'unread' ? 2.5 : 2} />
              </div>

              {/* Content */}
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-bold text-lg ${note.status === 'unread' ? 'text-[#5D4037]' : 'text-gray-700'}`}>
                     {note.title}
                   </h3>
                   
                   {/* Date Badge */}
                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                     <Clock size={10} /> {note.meta.split('•')[1] || 'Just now'}
                   </span>
                 </div>
                 
                 <p className="text-gray-600 text-sm leading-relaxed mb-4">
                   {note.message}
                 </p>
                 
                 {/* Footer Meta */}
                 <div className="flex items-center gap-3">
                   <span className="text-[10px] font-bold text-[#A67C37] bg-[#EBE0CC]/20 px-3 py-1 rounded-full">
                     General Update
                   </span>
                   <span className="text-[10px] font-medium text-gray-400">
                     From: {note.meta.split('•')[0]}
                   </span>
                 </div>
              </div>

              {/* Unread Indicator Dot */}
              {note.status === 'unread' && (
                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#A67C37] rounded-full ring-4 ring-[#A67C37]/10 animate-pulse"></div>
              )}
            </div>
          ))
        ) : (
          // --- FRIENDLY EMPTY STATE ---
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="w-20 h-20 bg-[#EBE0CC]/30 rounded-full flex items-center justify-center mb-6 text-[#5D4037]">
               <Smile size={32} />
             </div>
             <h3 className="text-xl font-bold text-[#5D4037]">All caught up!</h3>
             <p className="text-gray-500 max-w-xs mt-2 text-sm">
               You have no new general notifications. Have a productive day!
             </p>
          </div>
        )}
      </div>

    </div>
  );
}