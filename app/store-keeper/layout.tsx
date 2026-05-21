'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { getStoreKeeperMenu } from '../lib/menus';

export default function StoreKeeperLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
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
      router.push('/store-keeper/notifications');
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      router.push('/store-keeper/notifications');
    }
  };

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    setIsMounted(true);
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isMounted) return null;

  const menuItems = getStoreKeeperMenu();

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 left-0 z-50 bg-gray-50 border-r border-gray-100">
        <Sidebar 
          isOpen={true} 
          onClose={() => {}} 
          menuItems={menuItems} 
          footerTitle="Store Keeper"
          footerInitial="S"
          onNotificationClick={handleBellClick}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen w-full transition-all duration-300 relative">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title="Store Keeper"
          notificationHref="/store-keeper/notifications"
          unreadCount={unreadCount}
          onBellClick={handleBellClick}
        />
        
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          menuItems={menuItems} 
          footerTitle="Store Keeper"
          footerInitial="S"
          onNotificationClick={handleBellClick}
        />
      </div>
      
    </div>
  );
}