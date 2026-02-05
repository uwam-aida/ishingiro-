'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LucideIcon, LogOut } from 'lucide-react'; 

// --- Types ---
interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  footerTitle: string;
  footerInitial: string;
}

export default function Sidebar({ menuItems, footerTitle, footerInitial }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64 font-sans">
      
      {/* 1. LOGO HEADER */}
      <div className="h-28 flex items-center justify-center border-b border-gray-50 bg-white p-6">
        <div className="relative w-full h-full flex items-center justify-center">
           {/* Ensure logo.png is in your public folder */}
           <Image 
             src="/logo.png" 
             alt="Ishingiro" 
             width={100} 
             height={100} 
             className="object-contain max-h-16" 
             priority 
           />
        </div>
      </div>

      {/* 2. DYNAMIC NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          // --- UPDATED LOGIC: Strict check ensures Dashboard doesn't stay active on sub-pages ---
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 font-bold text-sm group
                ${isActive 
                  ? 'bg-[#5D4037] text-white shadow-lg shadow-[#5D4037]/20 translate-x-1' // ACTIVE STYLE
                  : 'text-gray-400 hover:bg-[#EBE0CC]/30 hover:text-[#5D4037] hover:pl-6' // HOVER STYLE
                }`}
            >
              <item.icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={isActive ? 'text-[#EBE0CC]' : 'group-hover:text-[#5D4037]'}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* 3. DYNAMIC FOOTER */}
      <div className="p-5 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[#5D4037] text-[#EBE0CC] flex items-center justify-center font-black text-sm border-2 border-white shadow-sm">
              {footerInitial}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#5D4037] transition-colors">{footerTitle}</p>
                <Link href="/" className="text-[10px] font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                  Log Out
                </Link>
            </div>
            <LogOut size={14} className="text-gray-300 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}
