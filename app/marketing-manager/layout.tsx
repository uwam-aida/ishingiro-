'use client';

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { marketingManagerMenu } from '../lib/menus'; // Ensure this matches your export
import { Menu } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden md:block w-64 fixed inset-y-0 z-50">
        <Sidebar 
          menuItems={marketingManagerMenu}
          footerTitle="Marketing Manager"
          footerInitial="MM"
        />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          menuItems={marketingManagerMenu}
          footerTitle="Marketing Manager"
          footerInitial="MM"
        />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#5D4037]">
             <Menu size={24} />
           </button>
           <div className="flex items-center gap-2">
             <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
             <span className="font-black text-[#5D4037] text-sm tracking-widest uppercase">Ishingiro</span>
           </div>
           <div className="w-10"></div>
        </div>

        <main className="p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}