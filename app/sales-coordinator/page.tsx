'use client';

import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, 
  Store, 
  ArrowRight,
  PackageCheck,
  ClipboardList,
  RefreshCcw // Icon for resetting view
} from 'lucide-react';
import Link from 'next/link';

export default function SalesDashboard() {
  // State for interactivity
  const [activeView, setActiveView] = useState<'all' | 'needs' | 'has'>('all');
  
  // Refs for smooth scrolling
  const needsRef = useRef<HTMLDivElement>(null);
  const hasRef = useRef<HTMLDivElement>(null);

  // Mock Data for "What they Need" (Orders) - Matches Orange Theme
  const needs = [
    { id: 1, name: 'Bread', quantity: '50 pieces' },
    { id: 2, name: 'Birthday cakes', quantity: '1 pieces' },
    { id: 3, name: 'Biscuits', quantity: '60 pieces' },
  ];

  // Mock Data for "What they Have" (Stock) - Matches Blue Theme
  const has = [
    { id: 1, name: 'Bread', quantity: '10 pieces' },
    { id: 2, name: 'Biscuits', quantity: '15 pieces' },
  ];

  // Function to handle grid clicks
  const handleCardClick = (view: 'needs' | 'has') => {
    // If clicking the same card, reset to 'all'
    if (activeView === view) {
      setActiveView('all');
      return;
    }
    
    setActiveView(view);
    
    // Smooth scroll to the relevant section
    if (view === 'needs') {
      setTimeout(() => needsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else {
      setTimeout(() => hasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sales Coordinator</h1>
          <p className="text-gray-500 mt-2 font-medium">Monitor shop requests and current inventory levels.</p>
        </div>
        {activeView !== 'all' && (
          <button 
            onClick={() => setActiveView('all')}
            className="text-sm font-bold text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <RefreshCcw size={14} /> Reset View
          </button>
        )}
      </div>

      {/* --- INTERACTIVE STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Needs (Clickable) */}
        <div 
          onClick={() => handleCardClick('needs')}
          className={`p-8 rounded-[32px] border shadow-sm flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            activeView === 'needs' 
            ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-200' 
            : 'bg-white border-gray-100 hover:border-orange-100'
          }`}
        >
           <div>
             <div className="flex items-center gap-2 mb-2">
                <ShoppingCart size={20} className="text-orange-500" />
                <h3 className={`font-bold text-sm uppercase tracking-wide ${activeView === 'needs' ? 'text-orange-800' : 'text-gray-500'}`}>
                  Shop manager needs
                </h3>
             </div>
             <p className="text-5xl font-extrabold text-gray-900">{needs.length}</p>
             <p className={`text-xs font-bold mt-2 ${activeView === 'needs' ? 'text-orange-600' : 'text-gray-400'}`}>
               Active orders
             </p>
           </div>
           <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
             activeView === 'needs' ? 'bg-orange-200 text-orange-700' : 'bg-orange-50 text-orange-600'
           }`}>
              <ClipboardList size={32} />
           </div>
        </div>

        {/* Card 2: Has (Clickable) */}
        <div 
          onClick={() => handleCardClick('has')}
          className={`p-8 rounded-[32px] border shadow-sm flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
            activeView === 'has' 
            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200' 
            : 'bg-white border-gray-100 hover:border-blue-100'
          }`}
        >
           <div>
             <div className="flex items-center gap-2 mb-2">
                <Store size={20} className="text-blue-500" />
                <h3 className={`font-bold text-sm uppercase tracking-wide ${activeView === 'has' ? 'text-blue-800' : 'text-gray-500'}`}>
                  Shop manager has
                </h3>
             </div>
             <p className="text-5xl font-extrabold text-gray-900">{has.length}</p>
             <p className={`text-xs font-bold mt-2 ${activeView === 'has' ? 'text-blue-600' : 'text-gray-400'}`}>
               In stock
             </p>
           </div>
           <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
             activeView === 'has' ? 'bg-blue-200 text-blue-700' : 'bg-blue-50 text-blue-600'
           }`}>
              <PackageCheck size={32} />
           </div>
        </div>
      </div>

      {/* --- SPLIT VIEW SECTION (Dynamic Focus) --- */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="mb-8">
           <h2 className="text-xl font-bold text-gray-900">Shop Manager Status</h2>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">Comparison of demand vs availability</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           
           {/* LEFT: What they need (Orange) */}
           <div 
             ref={needsRef}
             className={`transition-opacity duration-500 ${activeView === 'has' ? 'opacity-25 grayscale pointer-events-none' : 'opacity-100'}`}
           >
              <h3 className="text-sm font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                What they needs (Orders)
              </h3>
              <div className="space-y-4">
                 {needs.map((item) => (
                   <div key={item.id} className="flex justify-between items-center p-5 rounded-2xl bg-orange-50/50 border border-orange-100 hover:bg-orange-50 transition-colors cursor-default group">
                      <span className="font-bold text-gray-800 group-hover:text-orange-900 transition-colors">{item.name}</span>
                      <span className="font-extrabold text-orange-700 bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs border border-orange-100">
                        {item.quantity}
                      </span>
                   </div>
                 ))}
                 <Link href="/sales-coordinator/products?tab=orders" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-600 mt-4 transition-colors">
                   View all orders <ArrowRight size={14} />
                 </Link>
              </div>
           </div>

           {/* RIGHT: What they have (Blue) */}
           <div 
             ref={hasRef}
             className={`transition-opacity duration-500 ${activeView === 'needs' ? 'opacity-25 grayscale pointer-events-none' : 'opacity-100'}`}
           >
              <h3 className="text-sm font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                What they have
              </h3>
              <div className="space-y-4">
                 {has.map((item) => (
                   <div key={item.id} className="flex justify-between items-center p-5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 transition-colors cursor-default group">
                      <span className="font-bold text-gray-800 group-hover:text-blue-900 transition-colors">{item.name}</span>
                      <span className="font-extrabold text-blue-700 bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs border border-blue-100">
                        {item.quantity}
                      </span>
                   </div>
                 ))}
                 <Link href="/sales-coordinator/products?tab=stock" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-600 mt-4 transition-colors">
                   View full inventory <ArrowRight size={14} />
                 </Link>
              </div>
           </div>

        </div>
      </div>

    </div>
  );
}