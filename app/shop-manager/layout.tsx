'use client';

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { shopManagerMenu } from '../lib/menus'; // <--- 1. Import the menu data

export default function ShopManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      
      {/* 2. Desktop Sidebar: Pass the props! */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white">
        <Sidebar 
          menuItems={shopManagerMenu} 
          footerTitle="Shop Manager" 
          footerInitial="M" 
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* 3. Mobile Sidebar: Pass the props here too! */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          menuItems={shopManagerMenu} 
          footerTitle="Shop Manager" 
          footerInitial="M" 
        />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* 4. Update Header as well (it also expects props now) */}
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          title="Shop Manager"
          notificationHref="/shop-manager/notifications"
        />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}