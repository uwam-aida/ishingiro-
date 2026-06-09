
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Bell, SlidersHorizontal, Clock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function StoreKeeperNotifications() {
  const router = useRouter(); 

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH NOTIFICATIONS (WITH AUTO-REFRESH) ---
  const fetchNotifications = async (showLoader = false) => {
    if (showLoader) setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      const response = await fetch(`${baseUrl}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      if (response.ok) {
        const rawData = await response.json();
        console.log("Real Notifications from API:", rawData);
        
        const notificationsArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

        // --- FILTER OUT ORDER-RELATED, CAKE ORDER, AND ANY AUTOMATIC ALERTS ---
        const broadcastOnly = notificationsArray.filter((n: any) => {
          const msg = (n.message || '').toLowerCase();
          // Exclude messages that contain these patterns
          return !msg.includes('new order') && 
                 !msg.includes('order received') &&
                 !msg.includes('delivered') &&     // Added: Just looks for 'delivered'
                 !msg.includes('order #') &&       // Added: Catches "Order #15", etc.
                 !msg.includes('cake order') && 
                 !msg.includes('cake-order') &&
                 !msg.includes('new cake');
        });

        const formattedData = broadcastOnly.map((n: any) => ({
          id: n.id,
          type: 'general', 
          title: 'System Announcement', 
          message: n.message,
          meta: new Date(n.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          status: n.is_read ? 'read' : 'unread'
        }));
        
        setNotifications(formattedData);
      } else {
        console.error("Backend rejected the request. Status:", response.status);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);

    // AUTO-POLLING every 10 seconds
    const intervalId = setInterval(() => {
      fetchNotifications(false);
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  // --- MARK SINGLE AS READ ---
  const handleMarkAsRead = async (id: number, currentStatus: string) => {
    if (currentStatus === 'read') return;

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));

    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      await fetch(`${baseUrl}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // --- MARK ALL AS READ ---
  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));

    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      await fetch(`${baseUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const filtered = notifications;   // already filtered from fetch
  const unreadCount = filtered.filter(n => n.status === 'unread').length;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8 py-6 md:py-10 pb-20 relative font-sans">
      
      <div className="md:hidden flex items-center justify-center mb-2">
         <img src="/logo.png" alt="Shop Logo" className="h-14 w-auto object-contain" />
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => router.back()} 
             className="flex-shrink-0 p-2.5 md:p-3 rounded-xl bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
           >
             <ArrowLeft size={22} />
           </button>
           
           <div>
             <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">General Notifications</h1>
             <p className="text-gray-500 text-xs md:text-sm mt-1">
                System updates and announcements. 
                {unreadCount > 0 && <span className="ml-2 text-red-500 font-bold">({unreadCount} Unread)</span>}
             </p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto ml-14 md:ml-0">
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 text-xs md:text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
              >
                  <CheckCircle2 size={16} /> Mark All Read
              </button>
            )}
            <button className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                <SlidersHorizontal size={16} /> Filter
            </button>
        </div>
      </div>

      {/* --- NOTIFICATION CARDS --- */}
      <div className="space-y-3 md:space-y-4">
        {isLoading ? (
            <div className="flex justify-center items-center py-20 text-gray-400">
                <Loader2 className="animate-spin" size={32} />
            </div>
        ) : filtered.length > 0 ? filtered.map((note) => (
          <div 
            key={note.id} 
            onClick={() => handleMarkAsRead(note.id, note.status)}
            className={`group relative p-4 md:p-6 rounded-2xl border transition-all duration-300 flex items-start gap-3 md:gap-5 cursor-pointer ${
              note.status === 'unread' 
                ? 'bg-red-50/30 border-red-200 shadow-sm hover:shadow-md' 
                : 'bg-white border-gray-100 hover:bg-gray-50'
            }`}
          >
            <div className={`mt-0.5 md:mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md ${
              note.status === 'unread' ? 'bg-red-500 text-white shadow-red-200' : 'bg-gray-200 text-gray-500 shadow-gray-100'
            }`}>
               <Bell size={18} className="md:w-5 md:h-5" />
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between gap-3 mb-1">
                 <h3 className={`text-sm md:text-base truncate ${note.status === 'unread' ? 'font-black text-gray-900' : 'font-bold text-gray-600'}`}>
                   {note.title}
                 </h3>
                 
                 {note.status === 'unread' && (
                   <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                 )}
               </div>
               
               <p className={`text-xs md:text-sm leading-relaxed pr-2 ${note.status === 'unread' ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                 {note.message}
               </p>
               
               <div className="mt-3 flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wide">
                 <span className="flex items-center gap-1.5"><Clock size={12} /> {note.meta}</span>
                 
                 <span className={`px-2 py-0.5 rounded-md border ${
                   note.status === 'unread' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                 }`}>
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
