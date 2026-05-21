'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Clock, ArrowLeft, CheckCircle2, Loader2, ShoppingCart, Cake, Truck, Package, LogOut } from 'lucide-react';

interface Notification {
  id: number;
  role: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function SalesCoordinatorNotifications() {
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
    if (message.toLowerCase().includes('order')) return <ShoppingCart size={18} />;
    if (message.toLowerCase().includes('cake')) return <Cake size={18} />;
    if (message.toLowerCase().includes('deliver')) return <Truck size={18} />;
    if (message.toLowerCase().includes('stock')) return <Package size={18} />;
    return <Bell size={18} />;
  };

  const getNotificationColor = (message: string) => {
    if (message.toLowerCase().includes('order')) return 'bg-orange-50 text-orange-600';
    if (message.toLowerCase().includes('cake')) return 'bg-pink-50 text-pink-600';
    if (message.toLowerCase().includes('deliver')) return 'bg-blue-50 text-blue-600';
    if (message.toLowerCase().includes('stock')) return 'bg-green-50 text-green-600';
    return 'bg-purple-50 text-purple-600';
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
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      
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
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className="p-3 bg-[#F57C00] rounded-2xl text-white shadow-lg">
          <Bell size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1C1C1C]">Notifications</h1>
          <p className="text-[#F57C00] text-[10px] font-black uppercase tracking-widest">Sales Coordinator Alerts</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            <CheckCircle2 size={14} /> Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#F57C00]" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <Bell size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              onClick={() => !notification.is_read && markAsRead(notification.id)}
              className={`p-5 rounded-[2rem] border transition-all flex items-start gap-4 cursor-pointer ${
                !notification.is_read 
                  ? 'bg-white border-orange-100 shadow-sm' 
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
                <div className="w-2.5 h-2.5 bg-[#F57C00] rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}