'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Menu, ChevronRight, User } from 'lucide-react';

// --- FIX: Define the props here ---
interface HeaderProps {
  onMenuClick?: () => void;
  title: string;            // Expects "Shop Manager" or "Baker Assistant"
  notificationHref: string; // Expects the correct notification link
}
// ----------------------------------

export default function Header({ onMenuClick, title, notificationHref }: HeaderProps) {
  return (
    <header className="h-20 bg-gray-100 px-8 flex items-center justify-between sticky top-0 z-30 border-b border-gray-50">
      
      {/* Left: Mobile Menu + Mobile Title */}
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
        
        {/* Dynamic User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center">
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