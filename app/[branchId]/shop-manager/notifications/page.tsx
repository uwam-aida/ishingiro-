'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Bell, ArrowLeft, MapPin, Truck, AlertCircle, Loader2 } from 'lucide-react';

export default function ShopNotifications() {
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !isMounted) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    fetch(`${baseUrl}/sales/messages/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // data = { total, data: [...] }
        const allMessages = data.data || [];
        const branch = params?.branchId || 'kabuga';
        const roleId = `shop_manager_${branch}`; // 'shop_manager_kabuga' or 'shop_manager_masaka'

        // Show only messages sent to 'all' or the shop's specific role
        const filtered = allMessages.filter((msg: any) =>
          msg.recipient_roles.includes(roleId) ||
          msg.recipient_roles.includes('all')
        );
        // Sort newest first
        filtered.sort((a: any, b: any) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
        setMessages(filtered);
      })
      .catch(err => console.error('Failed to load notifications', err))
      .finally(() => setLoading(false));
  }, [isMounted, params?.branchId]);

  if (!isMounted) return null;

  const branchId = params?.branchId || 'kabuga';
  const branchName = String(branchId).toUpperCase();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 border rounded-xl"><ArrowLeft /></button>
        <h1 className="text-2xl font-bold">{branchName} Notifications</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : messages.length === 0 ? (
        <div className="p-6 border rounded-3xl bg-gray-50 flex gap-4">
          <div className="p-3 bg-gray-100 text-gray-500 rounded-xl"><AlertCircle /></div>
          <div>
            <h3 className="font-bold text-gray-900">No notifications yet</h3>
            <p className="text-sm text-gray-500">Messages from the Sales Coordinator will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-6 border rounded-3xl bg-blue-50/50 flex gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Bell /></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">{msg.recipient_roles.join(', ')}</h3>
                  <span className="text-[10px] text-gray-500">
                    {msg.date} at {msg.time}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}