'use client';

import React, { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { getShopManagerMenu } from '../../lib/menus';
import { getStoreKeeperMenu } from '../../lib/menus';
import { getBakerMenu } from '../../lib/menus';
import { getProductionManagerMenu } from '../../lib/menus';

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  
  const branchId = params?.branchId as string;

  // --- SAFETY GUARD ---
  // This prevents the page from crashing if branchId is missing for a split second
  if (!branchId) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading branch...</div>;
  }

  const getActiveMenu = () => {
    if (pathname.includes('/shop-manager')) return getShopManagerMenu(branchId);
    if (pathname.includes('/store-keeper')) return getStoreKeeperMenu(branchId);
    if (pathname.includes('/baker-assistant')) return getBakerMenu(branchId);
    if (pathname.includes('/production-manager')) return getProductionManagerMenu(branchId);
    return []; 
  };

  const branchName = branchId 
    ? branchId.charAt(0).toUpperCase() + branchId.slice(1) 
    : 'Shop';

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      

      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={getActiveMenu()} 
        footerTitle={`${branchName} Branch`}
        branchId={branchId}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={`${branchName} Management`}
          notificationHref={`/${branchId}/notifications`}
        />
        

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}