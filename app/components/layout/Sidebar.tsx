'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react'; 

// --- FIX: Define exactly what data this component expects ---
interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

interface SidebarProps {
  menuItems: MenuItem[]; // It now expects a list of links
  footerTitle: string;   // It expects a title (e.g. "Baker Assistant")
  footerInitial: string; // It expects a letter (e.g. "B")
}
// ------------------------------------------------------------

export default function Sidebar({ menuItems, footerTitle, footerInitial }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      
      {/* 1. LOGO HEADER */}
      <div className="h-24 flex items-center justify-center border-b border-gray-50 bg-white">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
           <Image src="/logo.png" alt="Ishingiro" fill className="object-cover" priority />
        </div>
      </div>

      {/* 2. DYNAMIC NAVIGATION */}
      <nav className="flex-1 px-4 py-8 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm
                ${isActive 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* 3. DYNAMIC FOOTER */}
      <div className="p-6 border-t border-gray-50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5D4037] text-white flex items-center justify-center font-bold text-xs">
              {footerInitial}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-900">{footerTitle}</p>
                <Link href="/" className="text-[10px] text-gray-400 hover:text-red-500 transition-colors">Log Out</Link>
            </div>
        </div>
      </div>
    </div>
  );
}