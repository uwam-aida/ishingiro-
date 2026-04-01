'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Menu, User, X, Info, Cake, Package } from 'lucide-react';

// --- FIX: Define the props here ---
interface HeaderProps {
  onMenuClick?: () => void;
  title: string;            // Expects "Shop Manager" or "Baker Assistant"
  notificationHref: string; // Expects the correct notification link
  unreadCount: number;      // ✅ ADDED FROM LAYOUT
  onBellClick: () => void;  // ✅ ADDED FROM LAYOUT
}
// ----------------------------------

export default function Header({ 
  onMenuClick, 
  title, 
  notificationHref, 
  unreadCount, 
  onBellClick 
}: HeaderProps) {
  
  // 1. LOCAL NOTIFICATION LIST
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New Cake Order: KS-01", time: "Just now", type: 'cake', read: false },
    { id: 2, text: "Stock Alert: Wheat Flour is low", time: "1 hour ago", type: 'stock', read: false },
  ]);

  const [showDropdown, setShowDropdown] = useState(false);

  // 3. LOGIC: Clear badge number when clicking the bell
  const handleOpenNotifications = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      // Mark local items as read
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      // ✅ Trigger the global clear function from Layout
      onBellClick();
    }
  };

  return (
    <header className="h-20 bg-gray-100 px-8 flex items-center justify-between sticky top-0 z-30 border-b border-gray-50">
      
      {/* Left: Mobile Menu */}
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        
        {/* --- NOTIFICATION LOGIC START --- */}
        <div className="relative">
          <button 
            onClick={handleOpenNotifications}
            className={`p-2 rounded-full transition-all relative ${showDropdown ? 'bg-[#5D4037] text-white' : 'text-gray-500 hover:bg-gray-200'}`}
          >
            <Bell size={20} />
            
            {/* REAL-TIME BADGE: Controlled by unreadCount prop from Layout */}
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN MENU */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</span>
                <button onClick={() => setShowDropdown(false)}><X size={14} className="text-gray-400"/></button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3">
                      <div className={`p-2 rounded-lg h-fit ${n.type === 'cake' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {n.type === 'cake' ? <Cake size={14}/> : <Package size={14}/>}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs font-bold text-gray-800">{n.text}</p>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-xs font-bold uppercase">No alerts</div>
                )}
              </div>
              
              <Link href={notificationHref} onClick={() => setShowDropdown(false)} className="block p-3 bg-gray-50 text-center text-[10px] font-black text-[#5D4037] uppercase hover:underline">
                View All Notifications
              </Link>
            </div>
          )}
        </div>
        {/* --- NOTIFICATION LOGIC END --- */}

        {/* Dynamic User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center border border-gray-200">
            <User size={16} />
          </div>
          <span className="text-sm font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
            {title}
          </span>
        </div>
      </div>
    </header>
  );
}