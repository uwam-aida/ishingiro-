'use client';

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { productionManagerMenu } from '../lib/menus';

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
      
      {/* FORCE VISIBLE: I removed 'hidden md:flex' so it always shows for now */}
      <aside className="w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white flex">
        <Sidebar 
          menuItems={CONFIG.menu} 
          footerTitle={CONFIG.title} 
          footerInitial={CONFIG.initial} 
        />
      </aside>

      {/* Main Content - Added margin-left (ml-64) so it doesn't hide behind sidebar */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          title={CONFIG.title}
          notificationHref={CONFIG.notifLink}
        />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}