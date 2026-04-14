'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X, LogOut } from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
  name: string;
  icon: React.ElementType; 
  href: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  menuItems?: MenuItem[]; 
  footerTitle?: string;
  footerInitial?: string;
  branchId?: string;
  onLinkClick?: () => void;
  onNotificationClick?: () => void;
}

export default function Sidebar({ 
  isOpen = false, 
  onClose = () => {}, 
  menuItems = [], 
  footerTitle = "Store Keeper", 
  footerInitial = "S",
  branchId,
  onLinkClick,
  onNotificationClick 
}: SidebarProps) {
  
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [pathname]);

  return (
    // Changed h-screen to min-h-screen to ensure background fills full height
    <aside className="min-h-screen sticky top-0 z-[101] bg-[#F6F6F6]">
      
      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <div 
        className={`fixed inset-y-0 left-0 z-[101] w-72 bg-[#F6F6F6] shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-gray-200 flex flex-col h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none`}
      >
        
        {/* --- HEADER --- */}
        <div className="p-4 md:p-6 flex flex-col items-center border-b border-gray-200 relative shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 md:hidden"
          >
            <X size={24} />
          </button>

          <div className="relative w-full h-40 md:h-40 mb-2">
              <Image 
                src="/logo.png" 
                alt="Ishingiro" 
                fill 
                className="object-contain" 
                priority
              />
          </div>
          
        </div>

        {/* --- MENU (Flex-1 fills the gap) --- */}
        <nav className="p-4 space-y-1 md:space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon; 

            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => {
                  if ((item.name === "Notifications" || item.name === "Notification") && onNotificationClick) {
                    onNotificationClick();
                  }
                  if (onLinkClick) onLinkClick();
                  onClose();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm md:text-base ${
                  isActive 
                    ? 'bg-[#1C1C1C] text-white shadow-lg shadow-black/20' 
                    : 'text-gray-500 hover:bg-white hover:text-[#1C1C1C]'
                }`}
              >
                <Icon size={20} /> 
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- FOOTER --- */}
        {/* mt-auto ensures this pushes to the absolute bottom of the flex container */}
        <div className="mt-auto p-4 md:p-6 border-t border-gray-200 bg-[#F6F6F6] shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1C1C1C] font-bold border border-gray-200 shadow-sm">
               {footerInitial}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-[#1C1C1C] truncate">{footerTitle}</p>
               <button 
                 onClick={handleLogout}
                 className="text-xs text-red-500 flex items-center gap-1 hover:underline mt-0.5"
               >
                 <LogOut size={14} /> Log Out
               </button>
             </div>
          </div>
        </div>

      </div>
    </aside>
  ); 
}