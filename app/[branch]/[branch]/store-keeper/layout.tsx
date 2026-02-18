'use client';

import React, { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import Header from '../../../components/layout/Header';
import { storeKeeperMenu } from '../../../lib/menus'; // Using the Master Menu

export default function StoreKeeperLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white">
        <Sidebar 
          menuItems={storeKeeperMenu} 
          footerTitle="Store Keeper" 
          footerInitial="S" 
        />
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          menuItems={storeKeeperMenu} 
          footerTitle="Store Keeper" 
          footerInitial="S" 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          title="Store Keeper"
          notificationHref="/store-keeper/notifications"
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}