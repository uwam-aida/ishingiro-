'use client';

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
// 1. Change this to the function name from your lib
import { getSalesCoordinatorMenu } from '../lib/menus';

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CONFIG = {
    // 2. Call the function here with () to get the menu items
    menu: getSalesCoordinatorMenu(),  
    title: "Sales Coordinator", 
    initial: "SC",
    notifLink: "/sales-coordinator/notifications"
  };

  return (
    /* h-screen and overflow-hidden here stops the sidebar from scrolling away */
    <div className="h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial} 
        />
      </aside>

      {/* 2. MOBILE SIDEBAR */}
      <div className="md:hidden">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* 3. MAIN CONTENT */}
      {/* Added h-full and overflow-hidden to the wrapper to keep Header pinned */}
      <div className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={CONFIG.title} 
          notificationHref={CONFIG.notifLink}
          unreadCount={0}
          onBellClick={() => {}}
        />
        
        {/* overflow-y-auto ensures ONLY the page content scrolls */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}