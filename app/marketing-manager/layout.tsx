'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
// Changed to ../../ because it is no longer inside a [branchId] folder
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { getMarketingManagerMenu } from '../lib/menus';

export default function MarketingAdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* --- GLOBAL ADMIN SIDEBAR --- */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        // FIX: Removed the branchId argument to solve ts(2554)
        menuItems={getMarketingManagerMenu()} 
        footerTitle="System Admin"
        footerInitial="SA"
      />

      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* --- GLOBAL ADMIN HEADER --- */}
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Marketing Management Admin"
          // Points to the global notification folder
          notificationHref="/marketing-manager/notification"
        />
        
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 md:p-8">
          {/* This renders your analytics, products, pricing, etc. */}
          {children}
        </main>
      </div>
    </div>
  );
}