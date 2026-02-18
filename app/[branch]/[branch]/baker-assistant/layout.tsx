'use client';

import React, { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar'; // Check your path (usually @/components...)
import Header from '../../../components/layout/Header';  // Check your path
import { bakerMenu } from '../../../lib/menus';

export default function BakerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white">
        <Sidebar 
          menuItems={bakerMenu} 
          footerTitle="Baker Assistant" 
          footerInitial="B" 
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Mobile Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          menuItems={bakerMenu} 
          footerTitle="Baker Assistant" 
          footerInitial="B"
          // --- THE FIX IS HERE ---
          // You must pass isOpen and onClose so the sidebar can close itself
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          title="Baker Assistant"
          // Note: Ensure this path exists or remove if you deleted the notification page
          notificationHref="/baker-assistant/notifications"
        />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}