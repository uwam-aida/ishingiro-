'use client';

import React, { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { getShopManagerMenu } from '../../lib/menus';

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(0);
  const clearNotifications = () => setUnreadCount(0);

  const params = useParams();
  const pathname = usePathname();
  
  const branchId = params?.branchId as string;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!branchId) {
    return (
      <div className="h-screen bg-white flex items-center justify-center font-bold text-[#5D4037]">
        Loading branch...
      </div>
    );
  }

  const getActiveMenu = () => {
    if (pathname.includes('/shop-manager')) return getShopManagerMenu(branchId);
    return []; 
  };

  const branchName = branchId 
    ? branchId.charAt(0).toUpperCase() + branchId.slice(1).toLowerCase() 
    : 'Shop';

  // --- FIX: Logic to force the professional title ---
  const displayTitle = `${branchName.toUpperCase()} SHOP MANAGER`;

  return (
    /* FIX: h-screen and overflow-hidden here locks the Sidebar and Header in place */
    <div className="h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={getActiveMenu()} 
        footerTitle={`${branchName} Branch`}
        branchId={branchId}
        onNotificationClick={clearNotifications}
      />

      {/* FIX: h-full ensures this container matches the screen height */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        <Header 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
            title={displayTitle}
            /* FIX: Added 's' to notification to prevent 404 */
            notificationHref={`/${branchId}/shop-manager/notifications`}
            unreadCount={unreadCount}
            onBellClick={clearNotifications}
        />

        {/* FIX: overflow-y-auto here ensures ONLY the children scroll */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}