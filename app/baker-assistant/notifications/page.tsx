'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Clock, ArrowLeft, Loader2 } from 'lucide-react';

export default function BakerNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    // Fetching ALL notifications from /api/notifications
    fetch(`${baseUrl}/notifications`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        // Based on your documentation, the API returns a direct array, not { data: [] }
        const list = Array.isArray(data) ? data : [];
        
        // Sort by created_at newest first
        list.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setNotifications(list);
      })
      .catch(err => console.error('Failed to load notifications', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>

        <div className="p-3 bg-[#1C1C1C] rounded-2xl text-white shadow-lg">
          <Bell size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1C1C1C]">Notifications</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Live System Alerts</p>
        </div>
      </div>

      {/* NOTIFICATION LIST */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={28} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <Bell size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No notifications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-5 rounded-[2.5rem] border shadow-sm flex items-center justify-between ${msg.is_read ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-100'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${msg.is_read ? 'bg-gray-200 text-gray-500' : 'bg-blue-50 text-blue-600'}`}>
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{msg.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}