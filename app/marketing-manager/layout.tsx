'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { getMarketingManagerMenu } from '../lib/menus';

export default function MarketingAdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // Fetch unread notification count from backend
  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${baseUrl}/notifications/unread-count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  // Mark all notifications as read when bell is clicked
  const handleBellClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${baseUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUnreadCount(0);
      router.push('/marketing-manager/notifications');
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      router.push('/marketing-manager/notifications');
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

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
        
        {/* --- GLOBAL ADMIN HEADER --- */}
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Marketing Management Admin"
          notificationHref="/marketing-manager/notifications"
          unreadCount={unreadCount}
          onBellClick={handleBellClick}
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