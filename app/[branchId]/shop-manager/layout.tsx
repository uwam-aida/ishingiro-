'use client';

import React, { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { 
  getShopManagerMenu, 
  getStoreKeeperMenu, 
  getBakerMenu, 
  getProductionManagerMenu 
} from '@/lib/menus';

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  
  const branchId = params.branchId as string;

  // 1. DYNAMIC ROLE DETECTION
  // This looks at the URL (e.g., /rwamagana/store-keeper) to decide which menu to show
  const getActiveMenu = () => {
    if (pathname.includes('/shop-manager')) return getShopManagerMenu(branchId);
    if (pathname.includes('/store-keeper')) return getStoreKeeperMenu(branchId);
    if (pathname.includes('/baker-assistant')) return getBakerMenu(branchId);
    if (pathname.includes('/production-manager')) return getProductionManagerMenu(branchId);
    return []; // Fallback
  };

  // 2. BRANCH NAME FORMATTING
  const branchName = branchId.charAt(0).toUpperCase() + branchId.slice(1);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* SHARED SIDEBAR */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={getActiveMenu()} 
        footerTitle={`${branchName} Branch`}
        branchId={branchId}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* SHARED HEADER */}
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={`${branchName} Management`}
          notificationHref={`/${branchId}/notifications`}
        />
        
        {/* DYNAMIC CONTENT (Your page.tsx files) */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}