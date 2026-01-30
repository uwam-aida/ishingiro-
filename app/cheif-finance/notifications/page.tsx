'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export default function FinanceNotifications() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Alerts</h1>
        <p className="text-gray-500 mt-2 font-medium">Updates on budget thresholds and production costs.</p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 h-[500px] flex flex-col items-center justify-center text-center p-8 shadow-sm">
        <div className="mb-6 p-6 bg-gray-50 rounded-full">
           <Bell size={48} className="text-gray-300" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">No new alerts</h3>
        <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto font-medium">
          You are all set! Important financial notifications will appear here.
        </p>
      </div>

    </div>
  );
}