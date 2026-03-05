'use client';

import React, { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
// Using ../../../ to reach root folders from inside [branchId]/store-keeper/
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { getShopManagerMenu } from '../../lib/menus';
import { getStoreKeeperMenu } from '../../lib/menus';
import { getBakerMenu } from '../../lib/menus';
import { getProductionManagerMenu } from '../../lib/menus';

export default function StoreKeeperLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  
  // Extract branchId from URL
  const branchId = params?.branchId as string;

  // --- SAFETY GUARD ---
  if (!branchId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-bold text-[#5D4037]">
        Loading branch data...
      </div>
    );
  }

  // --- MENU ROUTING LOGIC ---
  // Fixes ts(2322) by executing the function with branchId
  const getActiveMenu = () => {
    if (pathname.includes('/shop-manager')) return getShopManagerMenu(branchId);
    if (pathname.includes('/store-keeper')) return getStoreKeeperMenu(branchId);
    if (pathname.includes('/baker-assistant')) return getBakerMenu(branchId);
    if (pathname.includes('/production-manager')) return getProductionManagerMenu(branchId);
    return []; 
  };

  const branchName = branchId 
    ? branchId.charAt(0).toUpperCase() + branchId.slice(1) 
    : 'Branch';

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={getActiveMenu()} 
        footerTitle="Store Keeper"
        footerInitial="S"
        branchId={branchId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={`${branchName} Store Keeper`}
          notificationHref={`/${branchId}/store-keeper/notifications`}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}