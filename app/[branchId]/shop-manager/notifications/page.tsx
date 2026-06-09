
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Bell, ArrowLeft, Loader2, CheckCircle2, Clock } from 'lucide-react';

export default function ShopNotifications() {
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !isMounted) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (res.ok) {
          const rawData = await res.json();
          const notificationsArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

          // --- KEEP ONLY MANUAL BROADCASTS FROM THE SALES COORDINATOR ---
          const onlyBroadcasts = notificationsArray.filter((n: any) => {
            const msg = (n.message || '').toLowerCase();
            // Exclude any message that contains these automatic-alert phrases
            return !msg.includes('new order') &&
                   !msg.includes('order received') &&
                   !msg.includes('delivered') &&     // Fixed: Just looks for 'delivered'
                   !msg.includes('order #') &&       // Added: Catches "Order #15", etc.
                   !msg.includes('cake order') &&
                   !msg.includes('cake-order') &&
                   !msg.includes('new cake');
          });

          // Map to UI format
          const formatted = onlyBroadcasts.map((n: any) => ({
            id: n.id,
            message: n.message,
            is_read: n.is_read,
            date: new Date(n.created_at).toLocaleDateString(),
            time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            created_at: n.created_at,
          }));

          // Newest first
          formatted.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setNotifications(formatted);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // optional auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isMounted]);

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

  if (!isMounted) return null;

  const branchId = params?.branchId || 'kabuga';
  const branchName = String(branchId).toUpperCase();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 border rounded-xl hover:bg-gray-50 transition">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{branchName} Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-red-500 font-bold mt-1">{unreadCount} unread</p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="ml-auto flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg transition"
          >
            <CheckCircle2 size={14} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-6 border rounded-3xl bg-gray-50 flex gap-4">
          <div className="p-3 bg-gray-100 text-gray-500 rounded-xl"><Bell /></div>
          <div>
            <h3 className="font-bold text-gray-900">No notifications yet</h3>
            <p className="text-sm text-gray-500">Messages from the Sales Coordinator will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id, n.is_read)}
              className={`p-5 border rounded-3xl flex gap-4 cursor-pointer transition ${
                !n.is_read
                  ? 'bg-red-50/30 border-red-200 shadow-sm hover:shadow-md'
                  : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div
                className={`p-3 rounded-xl ${
                  !n.is_read ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                    System Announcement
                  </h3>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock size={10} /> {n.date} at {n.time}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${!n.is_read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {n.message}
                </p>
              </div>
              {!n.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 mr-1"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
