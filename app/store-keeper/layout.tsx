'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { getStoreKeeperMenu } from '../lib/menus';

export default function StoreKeeperLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(2); 
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const clearNotifications = () => {
    setUnreadCount(0);
  };

  if (!isMounted) return null;

  const menuItems = getStoreKeeperMenu();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 left-0 z-50 bg-gray-50 border-r border-gray-100">
        <Sidebar 
          isOpen={true} 
          onClose={() => {}} 
          menuItems={menuItems} 
          footerTitle="Store Keeper"
          footerInitial="S"
          onNotificationClick={clearNotifications}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen w-full transition-all duration-300 relative">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Store Keeper"
          notificationHref="/store-keeper/notifications"
          unreadCount={unreadCount}
          onBellClick={clearNotifications}
        />
        
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>

      {/* RESTORED: Your original Mobile Sidebar Logic */}
      <div className="md:hidden">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={menuItems} 
          footerTitle="Store Keeper"
          footerInitial="S"
          onNotificationClick={clearNotifications}
        />
      </div>
      
    </div>
  );
}