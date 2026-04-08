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
        
        {/* NOTIFICATION LOGIC REMOVED FROM HERE */}

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