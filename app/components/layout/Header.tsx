'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Menu, User } from 'lucide-react';

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
  
  const router = useRouter();

  // --- LOGIC: Clear badge and Navigate directly to the notifications page ---
  const handleBellClick = () => {
    onBellClick();
    
    // FIX: Ensuring the URL is always "notifications" to prevent 404
    const correctPath = notificationHref.endsWith('s') ? notificationHref : `${notificationHref}s`;
    router.push(correctPath);
  };

  return (
    /* FIX: Changed z-index to 100 to ensure it stays above all body content.
       Added 'w-full' and 'sticky top-0' to lock it to the top.
    */
    <header className="h-20 bg-[#F6F6F6] px-8 flex items-center justify-between sticky top-0 z-[100] border-b border-gray-200 w-full shadow-sm">
      
      {/* Left: Mobile Menu */}
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        
        {/* --- NOTIFICATION BELL ICON (DIRECT LINK) --- */}
        <div className="relative">
          <button 
            onClick={handleBellClick}
            className="p-2.5 text-gray-500 hover:bg-white hover:shadow-sm rounded-xl transition-all relative"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-[#F57C00] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#F6F6F6] px-1">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Dynamic User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 bg-white text-gray-500 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
            <User size={16} />
          </div>
          <span className="text-sm font-bold text-gray-900 group-hover:text-[#F57C00] transition-colors uppercase tracking-tight">
            {/* FIX: Force KABUGA MANAGEMENT to display as KABUGA SHOP MANAGER */}
            {title === "KABUGA MANAGEMENT" ? "KABUGA SHOP MANAGER" : title}
          </span>
        </div>
      </div>
    </header>
  );
}