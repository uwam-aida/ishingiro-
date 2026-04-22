'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Scale, 
  ChefHat, 
  Search, 
  TrendingUp, 
  AlertCircle,
  Package,
  History
} from 'lucide-react';

export default function FinanceProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'measured' | 'baked'>('measured');

  // --- MOCK DATA ---
  const measuredProducts = [
    { id: 1, name: 'Wheat Flour', stock: '450 kg', status: 'Healthy', branch: 'Kabuga', value: '450,000 Frw' },
    { id: 2, name: 'Sugar', stock: '12 kg', status: 'Low Stock', branch: 'Masaka', value: '18,000 Frw' },
    { id: 3, name: 'Baking Powder', stock: '5 kg', status: 'Healthy', branch: 'Kabuga', value: '25,000 Frw' },
  ];

  const bakedProducts = [
    { id: 1, name: 'White Bread', daily: '500 pcs', sold: '480', loss: '2', branch: 'Kabuga' },
    { id: 2, name: 'Milk Bread', daily: '200 pcs', sold: '195', loss: '5', branch: 'Masaka' },
    { id: 3, name: 'Tea Scones', daily: '300 pcs', sold: '290', loss: '0', branch: 'Kabuga' },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* <-- BACK BUTTON & TITLE (With requested spacing) --> */}
      <div className="flex items-center gap-4 md:gap-6 px-4 md:px-0 pt-6">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#5D4037] uppercase tracking-tight">
            Product Inventory
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chief of Finance Tracking</p>
        </div>
      </div>

      {/* --- SWITCHER TOGGLE --- */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-full max-w-md mx-auto md:mx-0">
        <button 
          onClick={() => setActiveTab('measured')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'measured' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-400'
          }`}
        >
          <Scale size={16} /> Measured
        </button>
        <button 
          onClick={() => setActiveTab('baked')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'baked' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-400'
          }`}
        >
          <ChefHat size={16} /> Baked
        </button>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activeTab === 'measured' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
              {activeTab === 'measured' ? <Package size={20}/> : <TrendingUp size={20}/>}
            </div>
            <h2 className="font-black text-[#5D4037] uppercase text-sm tracking-widest">
              {activeTab === 'measured' ? 'Measured Items Tracking' : 'Baked Goods Performance'}
            </h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#5D4037] w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400">
              {activeTab === 'measured' ? (
                <tr>
                  <th className="px-8 py-4">Item Name</th>
                  <th className="px-8 py-4 text-center">In Stock</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4">Branch</th>
                  <th className="px-8 py-4 text-right">Value (Frw)</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4 text-center">Produced</th>
                  <th className="px-8 py-4 text-center">Sold</th>
                  <th className="px-8 py-4 text-center">Damages</th>
                  <th className="px-8 py-4 text-right">Location</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeTab === 'measured' ? (
                measuredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-[#5D4037] uppercase text-sm">{p.name}</td>
                    <td className="px-8 py-5 text-center font-black text-gray-800">{p.stock}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'Healthy' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-gray-400 font-bold text-xs uppercase">{p.branch}</td>
                    <td className="px-8 py-5 text-right font-black text-[#5D4037]">{p.value}</td>
                  </tr>
                ))
              ) : (
                bakedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-[#5D4037] uppercase text-sm">{p.name}</td>
                    <td className="px-8 py-5 text-center font-bold text-gray-500">{p.daily}</td>
                    <td className="px-8 py-5 text-center font-black text-green-600">{p.sold}</td>
                    <td className="px-8 py-5 text-center font-black text-red-500">{p.loss}</td>
                    <td className="px-8 py-5 text-right font-bold text-gray-400 text-xs uppercase">{p.branch}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* --- SUMMARY FOOTER --- */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
          <History size={16} className="text-gray-400" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Last update: Today at 2:30 PM • Ishingiro Shop Real-time Sync
          </p>
        </div>
      </div>

    </div>
  );
}