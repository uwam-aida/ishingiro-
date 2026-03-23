'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header'; 
import { getProductionManagerMenu } from '../lib/menus';

export default function ProductionManagerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // --- FIX: Removed the ("") argument to match your lib/menus definition ---
  const menuItems = getProductionManagerMenu(); 

  const CONFIG = {
    menu: menuItems,
    title: "Production Manager",
    initial: "P",
    notifLink: "/production-manager/notifications"
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-gray-50">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial} 
        />
      </aside>

      {/* 2. MOBILE SIDEBAR OVERLAY (Black background) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* 3. MOBILE SIDEBAR DRAWER (Slides in) */}
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
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={CONFIG.title}
          notificationHref={CONFIG.notifLink}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}