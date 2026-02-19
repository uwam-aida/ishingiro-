'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Bell, 
  ArrowLeft, 
  Clock, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Truck
} from 'lucide-react';

export default function ShopNotifications() {
  const params = useParams();
  const router = useRouter();
  const branchId = params.branchId as string;

  // Format the branch name for the header
  const branchName = typeof branchId === 'string' 
    ? branchId.charAt(0).toUpperCase() + branchId.slice(1) 
    : 'Shop';

  // --- MOCK NOTIFICATION DATA ---
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'delivery',
      title: 'Delivery on the way',
      message: '300 White Loaves have been dispatched from the Hub.',
      time: '5 mins ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'stock',
      title: 'Low Stock Alert',
      message: 'Brown Bread inventory is below 20 pieces.',
      time: '2 hours ago',
      read: true,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'system',
      title: 'Report Reminder',
      message: 'Please submit your daily sales report by 6:00 PM.',
      time: '4 hours ago',
      read: true,
      priority: 'low'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-gray-50 shadow-sm transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{branchName} Alerts</h1>
          <p className="text-[#A67C37] text-[10px] font-black uppercase flex items-center gap-2 mt-1 tracking-widest">
            <MapPin size={12} /> Branch ID: {branchId}
          </p>
        </div>
      </div>

      {/* --- NOTIFICATION LIST --- */}
      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((notif) => (
          <div 
            key={notif.id}
            onClick={() => markAsRead(notif.id)}
            className={`relative p-6 rounded-[32px] border transition-all cursor-pointer flex items-start gap-4 ${
              notif.read ? 'bg-white border-gray-100 opacity-75' : 'bg-white border-[#EBE0CC] shadow-md border-l-4 border-l-[#A67C37]'
            }`}
          >
            {/* Icon Based on Type */}
            <div className={`p-3 rounded-2xl ${
              notif.type === 'delivery' ? 'bg-green-50 text-green-600' : 
              notif.type === 'stock' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {notif.type === 'delivery' ? <Truck size={20} /> : 
               notif.type === 'stock' ? <AlertCircle size={20} /> : <Bell size={20} />}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-bold text-sm ${notif.read ? 'text-gray-700' : 'text-[#5D4037]'}`}>
                  {notif.title}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <Clock size={10} /> {notif.time}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{notif.message}</p>
              
              {!notif.read && (
                <div className="mt-3 flex items-center gap-1 text-[9px] font-black text-[#A67C37] uppercase">
                  <CheckCircle2 size={10} /> New Notification
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <Bell size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 font-bold text-sm">No new alerts for this branch.</p>
          </div>
        )}
      </div>
    </div>
  );
}