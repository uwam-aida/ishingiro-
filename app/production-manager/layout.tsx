'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header'; 
import { getProductionManagerMenu } from '../lib/menus';

export default function ProductionManagerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // --- ADDED: Notification State ---
  const [unreadCount, setUnreadCount] = useState(1); 
  const handleBellClick = () => setUnreadCount(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const menuItems = getProductionManagerMenu(); 

  const CONFIG = {
    menu: menuItems,
    title: "Production Manager",
    initial: "P",
    notifLink: "/production-manager/notifications"
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-gray-50">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial} 
        />
      </aside>

      {/* 2. MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* 3. MOBILE SIDEBAR DRAWER */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-50 shadow-2xl transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* 4. MAIN CONTENT */}
      {/* md:ml-64 ensures it clears the fixed sidebar on desktop */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={CONFIG.title}
          notificationHref={CONFIG.notifLink}
          // ✅ FIXED: Passing these props makes the bell work
          unreadCount={unreadCount}
          onBellClick={handleBellClick}
        />

        {/* ✅ FIXED: Added max-w-7xl and padding to fix desktop spacing */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}