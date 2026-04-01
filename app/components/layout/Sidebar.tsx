'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut } from 'lucide-react';

// Define the Menu Item structure
interface MenuItem {
  name: string;
  icon: React.ElementType; 
  href: string;
}

// Define the Props
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  menuItems?: MenuItem[]; 
  footerTitle?: string;
  footerInitial?: string;
  branchId?: string;
  onLinkClick?: () => void;
  onNotificationClick?: () => void; // ✅ ADDED THIS PROP
}

export default function Sidebar({ 
  isOpen = false, 
  onClose = () => {}, 
  menuItems = [], 
  footerTitle = "Store Keeper", 
  footerInitial = "S",
  branchId,
  onLinkClick,
  onNotificationClick // ✅ ADDED THIS PROP
}: SidebarProps) {
  
  const pathname = usePathname();

  // --- AUTO-CLOSE ON NAVIGATION ---
  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [pathname]);

  return (
    <div>
      
      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* --- SIDEBAR --- */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-gray-100 flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none`}
      >
        
        {/* --- HEADER --- */}
        <div className="p-6 flex flex-col items-center border-b border-gray-100 relative shrink-0 bg-gray-100">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-red-500"
          >
            <X size={24} />
          </button>

          <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-3">
              <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">
            Ishingiro
          </h2>
          
          {branchId && (
            <span className="mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase">
              {branchId} Branch
            </span>
          )}
        </div>

        {/* --- MENU --- */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto bg-gray-100">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon; 

            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => {
                  // ✅ LOGIC: If clicking Notifications, clear the badge
                  if (item.name === "Notifications" && onNotificationClick) {
                    onNotificationClick();
                  }
                  if (onLinkClick) onLinkClick();
                  onClose();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive 
                    ? 'bg-[#5D4037] text-white shadow-lg shadow-[#5D4037]/30' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#5D4037]'
                }`}
              >
                <Icon size={20} /> 
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
    </div>
  ); 
}