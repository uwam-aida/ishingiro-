'use client';

import React, { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
// Note: Adjusted paths to @/ or correct depth if relative
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { getShopManagerMenu } from '../../lib/menus';
import { getStoreKeeperMenu } from '../../lib/menus';
import { getBakerMenu } from '../../lib/menus';
import { getProductionManagerMenu } from '../../lib/menus';

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  
  const branchId = params?.branchId as string;

  // --- FIX: Wait for client-side mounting to prevent hydration errors ---
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // --- SAFETY GUARD ---
  if (!branchId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-bold text-[#5D4037]">
        Loading branch...
      </div>
    );
  }

  const getActiveMenu = () => {
    if (pathname.includes('/shop-manager')) return getShopManagerMenu(branchId);
    if (pathname.includes('/store-keeper')) return getStoreKeeperMenu(branchId);
    if (pathname.includes('/baker-assistant')) return getBakerMenu(branchId);
    if (pathname.includes('/production-manager')) return getProductionManagerMenu(branchId);
    return []; 
  };

  const getRolePath = () => {
    if (pathname.includes('/shop-manager')) return 'shop-manager';
    if (pathname.includes('/store-keeper')) return 'store-keeper';
    if (pathname.includes('/baker-assistant')) return 'baker-assistant';
    if (pathname.includes('/production-manager')) return 'production-manager';
    return '';
  };

  const branchName = branchId 
    ? branchId.charAt(0).toUpperCase() + branchId.slice(1).toLowerCase() 
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
           notificationHref={`/${branchId}/shop-manager/notification`}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}