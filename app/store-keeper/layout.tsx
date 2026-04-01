'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
// ONLY import the global Store Keeper menu
import { getStoreKeeperMenu } from '../lib/menus';

export default function StoreKeeperLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // --- NOTIFICATION STATE SHARED BETWEEN HEADER & SIDEBAR ---
  const [unreadCount, setUnreadCount] = useState(2); 
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to clear notifications
  const clearNotifications = () => {
    setUnreadCount(0);
  };

  if (!isMounted) return null;

  // --- CLEAN GLOBAL LOGIC ---
  const menuItems = getStoreKeeperMenu();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-gray-50">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={menuItems} 
          footerTitle="Store Keeper"
          footerInitial="S"
          // ✅ This now works because Sidebar interface is updated
          onNotificationClick={clearNotifications}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Store Keeper"
          notificationHref="/store-keeper/notifications"
          // ✅ These now work because Header interface is updated
          unreadCount={unreadCount}
          onBellClick={clearNotifications}
        />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Logic */}
      <div className="md:hidden">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={menuItems} 
          footerTitle="Store Keeper"
          footerInitial="S"
          // ✅ This now works because Sidebar interface is updated
          onNotificationClick={clearNotifications}
        />
      </div>
    </div>
  );
}