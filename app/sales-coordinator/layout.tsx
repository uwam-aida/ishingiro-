'use client';

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { salesCoordinatorMenu } from '../lib/menus';

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CONFIG = {
    menu: salesCoordinatorMenu,  
    title: "Sales Coordinator", 
    initial: "SC",
    notifLink: "/sales-coordinator/notifications"
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial} 
        />
      </aside>

      {/* 2. MOBILE SIDEBAR 
          We pass 'isOpen' directly to the Sidebar so it handles the sliding animation 
      */}
      <div className="md:hidden">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial}
          // IMPORTANT: Pass these props for mobile to work
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={CONFIG.title} 
          notificationHref={CONFIG.notifLink}
          // --- FIXING ts(2739) BY ADDING MISSING PROPS ---
          unreadCount={0}
          onBellClick={() => {}}
          // ----------------------------------------------
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}