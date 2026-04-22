'use client';

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { cicmMenu } from '../lib/menus';

export default function CICMLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(1); 
  const handleBellClick = () => {
    setUnreadCount(0); 
  };

  const CONFIG = {
    menu: cicmMenu,
    title: "(CICM)",
    initial: "C",
    notifLink: "/cicm/notifications"
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans overflow-x-hidden">
      
      {/* 1. DESKTOP SIDEBAR - Added print:hidden */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white print:hidden">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial} 
        />
      </aside>

      {/* 2. MOBILE OVERLAY - Added print:hidden */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 print:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* 3. MOBILE SIDEBAR DRAWER - Added print:hidden */}
      <div className={`fixed inset-y-0 left-0 z-[101] w-72 bg-[#F6F6F6] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden print:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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
        
        {/* ✅ FIXED: Wrapped Header in print:hidden to remove hamburger/profile from paper */}
        <div className="print:hidden">
          <Header 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
            title={CONFIG.title}
            notificationHref={CONFIG.notifLink}
            unreadCount={unreadCount}
            onBellClick={handleBellClick}
          />
        </div>
        
        {/* Added print:p-0 and print:bg-white so the report looks clean on paper */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#FDFDFD] print:bg-white print:p-0 print:m-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}