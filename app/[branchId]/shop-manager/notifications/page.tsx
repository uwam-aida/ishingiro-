'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Bell, ArrowLeft, MapPin, Truck, AlertCircle } from 'lucide-react';

export default function ShopNotifications() {
  const params = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Use a fallback to prevent "undefined" errors
  const branchId = params?.branchId || 'kabuga';
  const branchName = String(branchId).toUpperCase();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 border rounded-xl"><ArrowLeft /></button>
        <h1 className="text-2xl font-bold">{branchName} Notifications</h1>
      </div>
      
      <div className="p-6 border rounded-3xl bg-gray-50 flex gap-4">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertCircle /></div>
        <div>
          <h3 className="font-bold text-gray-900">System Online</h3>
          <p className="text-sm text-gray-500">Notifications for {branchId} are now working.</p>
        </div>
      </div>
    </div>
  );
}