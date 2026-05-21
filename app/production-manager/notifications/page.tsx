'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Clock, ArrowLeft, CheckCircle2, Loader2, Package, Truck, AlertTriangle, LogOut } from 'lucide-react';

interface Notification {
  id: number;
  role: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ProductionNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // Fetch all notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${baseUrl}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${baseUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (message: string) => {
    if (message.toLowerCase().includes('production') || message.toLowerCase().includes('baked')) 
      return <Package size={18} />;
    if (message.toLowerCase().includes('delivery') || message.toLowerCase().includes('delivered')) 
      return <Truck size={18} />;
    if (message.toLowerCase().includes('damage')) 
      return <AlertTriangle size={18} />;
    return <Bell size={18} />;
  };

  const getNotificationColor = (message: string) => {
    if (message.toLowerCase().includes('production')) return 'bg-orange-50 text-orange-600';
    if (message.toLowerCase().includes('delivery')) return 'bg-blue-50 text-blue-600';
    if (message.toLowerCase().includes('damage')) return 'bg-red-50 text-red-600';
    return 'bg-green-50 text-green-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8 py-6 md:py-8 pb-20">
      
      {/* Logout Button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
        >
          <LogOut size={16} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-gray-100 pb-4 md:pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Real-time updates for production operations.</p>
          </div>
        </div>
      </div>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            <CheckCircle2 size={14} /> Mark all read ({unreadCount})
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#F57C00]" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-[24px] md:rounded-3xl border border-gray-100 min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-center p-6 md:p-8 mx-1 md:mx-0">
          <div className="mb-4 md:mb-6 animate-pulse">
            <Bell className="w-10 h-10 md:w-12 md:h-12 text-gray-300" strokeWidth={1.5} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-gray-900">No notifications</h3>
          <p className="text-gray-400 text-xs md:text-sm mt-1">All caught up! Check back later for updates.</p>
        </div>
      ) : (
        /* Notifications List */
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              onClick={() => !notification.is_read && markAsRead(notification.id)}
              className={`p-5 rounded-[2rem] border transition-all flex items-start gap-4 cursor-pointer ${
                !notification.is_read 
                  ? 'bg-white border-blue-100 shadow-sm' 
                  : 'bg-gray-50/50 border-transparent opacity-70'
              }`}
            >
              <div className={`p-3 rounded-2xl ${getNotificationColor(notification.message)}`}>
                {getNotificationIcon(notification.message)}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${!notification.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
              </div>
              {!notification.is_read && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}