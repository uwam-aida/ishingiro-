'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
// ONLY import the global Store Keeper menu
import { getStoreKeeperMenu } from '../lib/menus';

export default function StoreKeeperLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // --- CLEAN GLOBAL LOGIC ---
  const menuItems = getStoreKeeperMenu();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-gray-50">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={menuItems} 
          footerTitle="Store Keeper"
          footerInitial="S"
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Store Keeper"
          notificationHref="/store-keeper/notifications"
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
          footerTitle="Store Keeper"
          footerInitial="S"
        />
      </div>
    </div>
  );
}