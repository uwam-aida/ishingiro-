'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut } from 'lucide-react';

// Define the Menu Item structure
interface MenuItem {
  name: string;
  icon: any;
  href: string;
}

// Define the Props the Sidebar accepts
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  menuItems?: MenuItem[]; // Made optional to prevent crashes
  footerTitle?: string;
  footerInitial?: string;
  branchId?: string;
  onLinkClick?: () => void;
}

export default function Sidebar({ 
  isOpen = false, 
  onClose = () => {}, 
  menuItems = [], // Default to empty array if missing
  footerTitle = "Manager", 
  footerInitial = "M",
  branchId,
  onLinkClick
}: SidebarProps) {
  
  const pathname = usePathname();

  // Safe handler that won't crash if functions are missing
  const handleLinkClick = () => {
    if (onClose) onClose();
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      
      {/* --- HEADER --- */}
      <div className="p-6 flex flex-col items-center border-b border-gray-100 relative shrink-0">
        {/* Mobile Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-red-500"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-3">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
        
        {branchId && (
          <span className="mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase">
            {branchId} Branch
          </span>
        )}
      </div>

      {/* --- MENU LINKS --- */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={handleLinkClick} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive 
                  ? 'bg-[#5D4037] text-white shadow-lg shadow-[#5D4037]/30' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#5D4037]'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- FOOTER --- */}
      <div className="p-6 border-t border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#5D4037] font-bold border border-gray-200">
             {footerInitial}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-[#5D4037] truncate">{footerTitle}</p>
             <button className="text-xs text-red-500 flex items-center gap-1 hover:underline mt-0.5">
               <LogOut size={12} /> Log Out
             </button>
           </div>
        </div>
      </div>

    </div>
  );
}