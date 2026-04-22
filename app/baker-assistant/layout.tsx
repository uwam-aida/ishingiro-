'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { getBakerMenu } from '../lib/menus';

export default function BakerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- NOTIFICATION STATE (Added to fix the error) ---
  const [unreadCount, setUnreadCount] = useState(0); 
  const clearNotifications = () => setUnreadCount(0);

  // --- FIX: Prevent empty screen/Hydration crash ---
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Call your new function that has no parameters
  const menuItems = getBakerMenu();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-gray-50">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={menuItems} 
          footerTitle="Baker Assistant" 
          footerInitial="B" 
          // ✅ Added missing prop
          onNotificationClick={clearNotifications}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Baker Assistant"
          notificationHref="/baker-assistant/notifications"
          // ✅ Added missing props to fix the TS error
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
          footerTitle="Baker Assistant" 
          footerInitial="B"
          // ✅ Added missing prop
          onNotificationClick={clearNotifications}
        />
      </div>
    </div>
  );
}