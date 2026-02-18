'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar'; // Ensure path uses @
import Header from '../../components/layout/Header';   // Ensure path uses @
import { productionManagerMenu } from '../../lib/menus';

export default function ProductionManagerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CONFIG = {
    menu: productionManagerMenu,
    title: "Production Manager",
    initial: "P",
    notifLink: "/production-manager/notifications"
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      
      {/* 1. DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white">
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
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial}
          // IMPORTANT: This enables the mobile behavior (close button + logo)
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* 4. MAIN CONTENT */}
      {/* ml-0 on mobile, ml-64 on desktop */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={CONFIG.title}
          notificationHref={CONFIG.notifLink}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}