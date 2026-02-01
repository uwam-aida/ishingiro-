'use client';

import React, { useState } from 'react';
import { FileText, FileBarChart, Download, Calendar } from 'lucide-react';

export default function MarketingReportsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [reportGenerated, setReportGenerated] = useState(false);

  // Mock Report Data (Only shown after clicking "Generate")
  const mockReport = [
    { id: 1, item: 'Bread', sold: 150, revenue: '75,000 Rwf', status: 'Target Met' },
    { id: 2, item: 'Cake', sold: 5, revenue: '50,000 Rwf', status: 'Below Target' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-gray-500 mt-2 font-medium">Daily and weekly business reports.</p>
      </div>

      {/* --- TOGGLE (Daily / Weekly) --- */}
      <div className="bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 flex w-full md:w-fit">
        <button 
          onClick={() => { setActiveTab('daily'); setReportGenerated(false); }}
          className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
            activeTab === 'daily' 
            ? 'bg-white border border-gray-200 text-gray-900 shadow-sm transform scale-105' 
            : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          Daily reports
        </button>
        <button 
          onClick={() => { setActiveTab('weekly'); setReportGenerated(false); }}
          className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
            activeTab === 'weekly' 
            ? 'bg-white border border-gray-200 text-gray-900 shadow-sm transform scale-105' 
            : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          Weekly reports
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="bg-white rounded-[32px] p-12 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
         <div className="mb-8 border-b border-gray-50 pb-6 flex justify-between items-end">
            <div>
              <h2 className="text-lg font-bold text-gray-900 capitalize">{activeTab} reports history</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">
                Detailed {activeTab} production and sale reports
              </p>
            </div>
            {reportGenerated && (
              <button className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-2">
                <Download size={14} /> Download PDF
              </button>
            )}
         </div>

         {/* CONDITION: Show Empty State OR Generated Report */}
         {!reportGenerated ? (
           // EMPTY STATE (Matches Image)
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
                 <FileBarChart size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No {activeTab} report yet</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 font-medium">
                Generate your {activeTab} report to see data here.
              </p>
              <button 
                onClick={() => setReportGenerated(true)}
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl text-sm shadow-xl shadow-gray-200 hover:bg-black hover:scale-105 transition-all flex items-center gap-2"
              >
                Generate Report <Calendar size={16} />
              </button>
           </div>
         ) : (
           // GENERATED REPORT TABLE
           <div className="animate-in slide-in-from-bottom-4 duration-500">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                   <th className="pb-4 pl-4">Item</th>
                   <th className="pb-4">Sold</th>
                   <th className="pb-4">Revenue</th>
                   <th className="pb-4 text-right pr-4">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {mockReport.map((row) => (
                   <tr key={row.id}>
                     <td className="py-4 pl-4 font-bold text-gray-900">{row.item}</td>
                     <td className="py-4 font-medium text-gray-600">{row.sold}</td>
                     <td className="py-4 font-bold text-gray-900">{row.revenue}</td>
                     <td className="py-4 text-right pr-4">
                       <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-md font-bold uppercase">
                         {row.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
      </div>

    </div>
  );
}