// app/cicm/notifications/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Clock, ArrowLeft, Loader2, CheckCircle2, AlertTriangle, Package, Truck, Cake, Users } from 'lucide-react';

export default function CICMNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    try {
      const res = await fetch(`${baseUrl}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const rawData = await res.json();
        let notificationsArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

        // For CICM, we want to show all notifications (no aggressive filtering)
        // but you may optionally filter out very low‑priority ones if needed.
        // Here we keep everything – the CICM needs full oversight.
        notificationsArray.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setNotifications(notificationsArray);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Mark single as read ---
  const handleMarkAsRead = async (id: number, currentStatus: boolean) => {
    if (currentStatus) return;
    
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    
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

  // --- Mark all as read ---
  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
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

  // Helper to choose icon based on message content (optional)
  const getIcon = (message: string) => {
    const msg = message.toLowerCase();
    if (msg.includes('damage') || msg.includes('loss')) return AlertTriangle;
    if (msg.includes('delivered') || msg.includes('delivery')) return Truck;
    if (msg.includes('cake') || msg.includes('order')) return Cake;
    if (msg.includes('stock') || msg.includes('product')) return Package;
    return Bell;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-8 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
            <ArrowLeft size={22} />
          </button>
          <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-gray-900">CICM Notifications</h1>
            <p className="text-gray-400 text-xs font-bold mt-1">
              System alerts & updates
              {unreadCount > 0 && <span className="ml-2 text-emerald-500 font-bold">({unreadCount} Unread)</span>}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 text-xs md:text-sm font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
          >
            <CheckCircle2 size={16} /> Mark All Read
          </button>
        )}
      </div>

      {/* NOTIFICATIONS LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={28} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <Bell size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const IconComponent = getIcon(n.message);
            return (
              <div
                key={n.id}
                onClick={() => handleMarkAsRead(n.id, n.is_read)}
                className={`p-5 rounded-[2rem] border bg-white flex items-center justify-between cursor-pointer transition-all ${
                  n.is_read ? 'border-gray-100 opacity-70 hover:bg-gray-50' : 'border-emerald-100 bg-emerald-50/10 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${n.is_read ? 'bg-gray-100 text-gray-500' : 'bg-emerald-100 text-emerald-600'}`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <p className={`text-sm ${!n.is_read ? 'font-black text-gray-900' : 'font-bold text-gray-600'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {!n.is_read && (
                  <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-pulse mr-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}