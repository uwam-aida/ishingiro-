'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { shopManagerMenu } from '../../lib/menus';

export default function ShopBranchLayout({
  children,
  params, 
}: {
  children: React.ReactNode;
  params: { branchId: string };
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rawBranchId = params?.branchId || 'shop';
  const branchName = rawBranchId.charAt(0).toUpperCase() + rawBranchId.slice(1);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex">
      
      {/* Desktop Sidebar (No changes needed here) */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-100 bg-white">
        <Sidebar 
          menuItems={shopManagerMenu} 
          footerTitle={`${branchName} Manager`} 
          footerInitial={branchName.charAt(0)} 
          branchId={rawBranchId} 
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          menuItems={shopManagerMenu} 
          footerTitle={`${branchName} Manager`} 
          footerInitial={branchName.charAt(0)} 
          branchId={rawBranchId}
          onLinkClick={() => setIsMobileMenuOpen(false)} // <--- ADD THIS LINE!
        />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          title={`${branchName} Branch`} 
          notificationHref={`/shop-manager/${rawBranchId}/notifications`}
        />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}