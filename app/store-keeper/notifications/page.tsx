'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; 
import { Bell, CheckCircle, SlidersHorizontal, Clock, ArrowLeft, Search } from 'lucide-react';

export default function StoreKeeperNotifications() {
  const router = useRouter(); 

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
    },
    { 
      id: 3, 
      type: 'general',
      title: 'New Policy', 
      message: 'Please review the new inventory safety guidelines.', 
      meta: 'Management • 1 day ago',
      status: 'unread' 
    }
  ];

  // STRICT FILTER: Show ONLY 'general'
  const filtered = notifications.filter(n => n.type === 'general');

  return (
    // ADDED px-4 md:px-8 so content doesn't touch the screen edges on mobile
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8 py-6 md:py-10 pb-20 relative font-sans">
      
      {/* --- MOBILE LOGO --- */}
      <div className="md:hidden flex items-center justify-center mb-2">
         <img src="/logo.png" alt="Shop Logo" className="h-14 w-auto object-contain" />
      </div>

      {/* Page Header with Back Arrow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
           {/* Back Button */}
           <button 
             onClick={() => router.back()} 
             className="flex-shrink-0 p-2.5 md:p-3 rounded-xl bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
           >
             <ArrowLeft size={22} />
           </button>
           
           <div>
             {/* Responsive text sizing */}
             <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">General Notifications</h1>
             <p className="text-gray-500 text-xs md:text-sm mt-1">System updates and announcements.</p>
           </div>
        </div>
        
        {/* Search/Filter (Visual Only) */}
        <div className="flex items-center gap-2 self-start md:self-auto ml-14 md:ml-0">
            <button className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                <SlidersHorizontal size={16} /> Filter
            </button>
        </div>
      </div>

      {/* --- NOTIFICATION CARDS --- */}
      <div className="space-y-3 md:space-y-4">
        {filtered.length > 0 ? filtered.map((note) => (
          <div 
            key={note.id} 
            // Scaled padding and gap for mobile
            className="group relative p-4 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-md flex items-start gap-3 md:gap-5 bg-red-50/30 border-red-100"
          >
            {/* Icon Status */}
            <div className="mt-0.5 md:mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-500 text-white shadow-red-200 shadow-md">
               <Bell size={18} className="md:w-5 md:h-5" />
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between gap-3 mb-1">
                 {/* Truncate text just in case it gets too long on narrow phones */}
                 <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{note.title}</h3>
                 
                 {/* Unread indicator */}
                 {note.status === 'unread' && (
                   <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                 )}
               </div>
               
               <p className="text-gray-600 text-xs md:text-sm leading-relaxed pr-2">{note.message}</p>
               
               {/* Added flex-wrap so the badge drops to the next line on tiny screens instead of squishing */}
               <div className="mt-3 flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">
                 <span className="flex items-center gap-1.5"><Clock size={12} /> {note.meta}</span>
                 
                 {/* Badge */}
                 <span className="px-2 py-0.5 rounded-md border bg-red-100 text-red-700 border-red-200">
                   {note.type}
                 </span>
               </div>
            </div>
          </div>
        )) : (
            <div className="text-center py-20 text-sm font-bold text-gray-400 uppercase tracking-widest">
              No general notifications found.
            </div>
        )}
      </div>
    </div>
  );
}