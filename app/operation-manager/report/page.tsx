'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Filter, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function OperationReportPage() {
  const [reportData, setReportData] = useState<any[]>([]);

  // --- Generate Real-time Data ---
  useEffect(() => {
    const getTimeAgo = (minutes: number) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - minutes);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + 
             `, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    const data = [
      { id: 1, action: 'Measured flour', item: 'Bread flour', qty: '50kg', status: 'Completed', user: 'Baker assistant', time: getTimeAgo(5), type: 'Production' },
      { id: 2, action: 'Baked products', item: 'Bread', qty: '100 pcs', status: 'Completed', user: 'Baker assistant', time: getTimeAgo(25), type: 'Production' },
      { id: 3, action: 'Stock update', item: 'Received Bread', qty: '100 pcs', status: 'Verified', user: 'Shop manager', time: getTimeAgo(60), type: 'Shop' },
      { id: 4, action: 'Reported damage', item: 'Burnt Bread', qty: '2 pcs', status: 'Review', user: 'Store keeper', time: getTimeAgo(120), type: 'Damaged' },
      { id: 5, action: 'Sold item', item: 'Cake', qty: '1 pcs', status: 'Completed', user: 'Shop manager', time: getTimeAgo(180), type: 'Shop' },
      { id: 6, action: 'Measured sugar', item: 'Sugar', qty: '10kg', status: 'Completed', user: 'Baker assistant', time: getTimeAgo(200), type: 'Production' },
    ];
    setReportData(data);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
           <Link href="/operation-manager" className="text-gray-400 hover:text-gray-600 flex items-center gap-2 mb-2 text-sm font-bold transition-colors">
             <ArrowLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Full Operation Report</h1>
           <p className="text-gray-500 mt-2 font-medium">Detailed log of production, stock movements, and waste.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
             <Printer size={16} /> Print
           </button>
           <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center gap-2">
             <Download size={16} /> Export CSV
           </button>
        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={24} /></div>
           <div>
             <span className="block text-2xl font-extrabold text-gray-900">{reportData.length}</span>
             <span className="text-xs font-bold text-gray-400 uppercase">Total Actions</span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24} /></div>
           <div>
             <span className="block text-2xl font-extrabold text-gray-900">98%</span>
             <span className="text-xs font-bold text-gray-400 uppercase">Success Rate</span>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
           <div>
             <span className="block text-2xl font-extrabold text-gray-900">1</span>
             <span className="text-xs font-bold text-gray-400 uppercase">Issues Found</span>
           </div>
        </div>
      </div>

      {/* --- REPORT TABLE --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={20} className="text-gray-400" /> Activity Log
            </h2>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><Filter size={20} /></button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                     <th className="pb-5 pl-4">Type</th>
                     <th className="pb-5">Action Details</th>
                     <th className="pb-5">Quantity</th>
                     <th className="pb-5">User</th>
                     <th className="pb-5">Status</th>
                     <th className="pb-5 text-right pr-4">Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {reportData.map((row) => (
                     <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 pl-4">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                              row.type === 'Damaged' ? 'bg-red-50 text-red-600' : 
                              row.type === 'Production' ? 'bg-blue-50 text-blue-600' :
                              'bg-green-50 text-green-600'
                           }`}>{row.type}</span>
                        </td>
                        <td className="py-5">
                           <div className="font-bold text-gray-900 text-sm">{row.action}</div>
                           <div className="text-xs text-gray-500 font-medium">{row.item}</div>
                        </td>
                        <td className="py-5">
                           <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-xs">{row.qty}</span>
                        </td>
                        <td className="py-5 text-sm font-medium text-gray-500">{row.user}</td>
                        <td className="py-5">
                           <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                              {row.status === 'Review' ? <AlertTriangle size={12} className="text-orange-500" /> : <CheckCircle size={12} className="text-green-500" />}
                              {row.status}
                           </span>
                        </td>
                        <td className="py-5 text-right pr-4 text-xs font-medium text-gray-400 tabular-nums">
                           {row.time}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}