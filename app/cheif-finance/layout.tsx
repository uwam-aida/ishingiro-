'use client';

import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { cheifFinanceMenu } from '../lib/menus'; 
import { Calendar, ShieldCheck } from 'lucide-react';

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); 
  const handleBellClick = () => setUnreadCount(0);

  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  const CONFIG = {
    title: "Chief of Finance",
    initial: "CF",
    notifLink: "/finance/notifications"
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans overflow-x-hidden selection:bg-[#5D4037]/10">
      
      {/* 1. DESKTOP SIDEBAR - Changed to w-64 for standard alignment */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-200/60 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] print:hidden">
        <Sidebar 
          menuItems={cheifFinanceMenu}
          footerTitle={CONFIG.title}
          footerInitial={CONFIG.initial}
        />
      </aside>

      {/* 2. MOBILE SIDEBAR DRAWER */}
      <div className={`fixed inset-y-0 left-0 z-[101] w-72 bg-[#F6F6F6] shadow-2xl transform transition-transform duration-500 md:hidden print:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          menuItems={cheifFinanceMenu}
          footerTitle={CONFIG.title}
          footerInitial={CONFIG.initial}
        />
      </div>

      {/* 3. MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md md:hidden transition-opacity duration-500 print:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* 4. MAIN CONTENT AREA - md:ml-64 now perfectly clears the sidebar */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* HEADER */}
        <div className="sticky top-0 z-40 print:hidden">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm" />
          <div className="relative">
            <Header 
              onMenuClick={() => setIsSidebarOpen(true)} 
              title={CONFIG.title}
              notificationHref={CONFIG.notifLink}
              unreadCount={unreadCount}
              onBellClick={handleBellClick}
            />
          </div>
        </div>

        {/* 5. DASHBOARD WELCOME BAR */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-transparent print:hidden">
           <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{today}</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <ShieldCheck size={12} className="text-green-600" />
              <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter">Secure Session</span>
           </div>
        </div>

        {/* PAGE CONTENT - Added md:px-12 for better space between sidebar and dashboard */}
        <main className="flex-1 px-4 py-4 md:px-12 md:py-8 w-full max-w-7xl mx-auto overflow-y-auto print:bg-white print:p-0">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>

        <footer className="p-6 text-center print:hidden">
           <p className="text-[10px] font-medium text-gray-300 uppercase tracking-[0.4em]">
             Ishingiro Shop Financial Management System
           </p>
        </footer>
      </div>
    </div>
  );
}