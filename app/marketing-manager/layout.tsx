'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { getMarketingManagerMenu } from '../lib/menus';

export default function MarketingAdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // --- MOCK NOTIFICATION COUNT ---
  // You can set this to a real number from a database later
  const unreadNotifications = 3;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex relative">
      
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- GLOBAL ADMIN SIDEBAR --- */}
      <div className={`
        fixed inset-y-0 left-0 z-[50] w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={getMarketingManagerMenu()} 
          footerTitle="System Admin"
          footerInitial="SA"
        />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* --- GLOBAL ADMIN HEADER (FIXED PROPS) --- */}
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Marketing Management Admin"
          notificationHref="/marketing-manager/notification"
          // FIX: Added the missing properties required by HeaderProps
          unreadCount={unreadNotifications}
          onBellClick={() => router.push('/marketing-manager/notification')}
        />
        
        {/* --- SCROLLABLE CONTENT --- */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}