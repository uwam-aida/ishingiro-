'use client';

import React, { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { getShopManagerMenu } from '../../lib/menus';

export default function BranchLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const params = useParams();
  const pathname = usePathname();
  const branchId = params?.branchId as string;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // Fetch unread notification count
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

  // Mark all notifications as read
  const clearNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${baseUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  if (!branchId) {
    return (
      <div className="h-screen bg-white flex items-center justify-center font-bold text-[#5D4037]">
        Loading branch...
      </div>
    );
  }

  const branchName = branchId.charAt(0).toUpperCase() + branchId.slice(1).toLowerCase();

  return (
    <div className="h-screen bg-[#FDFDFD] flex overflow-hidden">
      
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={getShopManagerMenu(branchId)} 
        footerTitle={`${branchName} Branch`}
        branchId={branchId}
        onNotificationClick={clearNotifications}
      />

      <div className="flex-1 flex flex-col h-full min-w-0">
        
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          title={`${branchName.toUpperCase()} SHOP MANAGER`}
          notificationHref={`/${branchId}/shop-manager/notifications`}
          unreadCount={unreadCount}
          onBellClick={clearNotifications}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}