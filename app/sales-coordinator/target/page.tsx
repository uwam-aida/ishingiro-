'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Plus, ArrowLeft, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

// --- OFFICIAL PRODUCT LIST (For Dropdown) ---
const MARKETING_PRODUCTS = [
  'big milk', 'small milk', 'pcpn', 'sen', 'salted bread', 'baguette', 
  'milk slice bread', 'crubes', 'sen pieces', 'brown sanduich', 'mult graine', 
  'milk mult graine', 'brown bread', 'tea cake', 'marble cake', 'brown cake', 
  'oliver corn cake', 'muffin cake', 'ishingiro', 's.begne', 'dark donut', 
  'choc donuts', 'kk donuts', 'triangle', 'meat sambusa', 'biscuits',  
  'ISH.MILK Cookie', 'butter biscuits', 'chocolate biscuits', 'ubunyobwa', 
  'ikinyuranyo 1kg', 'ikinyuranyo 3kg', 'ikinyuranyo 5kg', 'ikinyuranyo (0.5)kg', 
  'yellow c flour 1kg', 'yellow c flour 3kg', 'cashnewnuts', 'cornfresh cream', 
  'cake 38000', 'cake 20000', 'cakes 24000', 'cake 19000', 'cake18000', 
  'cakes 15000', 'cakes 14000', 'cakes 13000', 'cake 12000', 'cakes 10000', 
  'cakes 9000', 'cakes 8000', 'cakes 7000', 'cakes 6000', 'cake 5000', 'ADDCAKE'
];

export default function WeeklyTargetsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // --- STATE FOR WEEKLY TARGETS ---
  const [weeklyTargets, setWeeklyTargets] = useState<any[]>([
    { id: 1, item: 'big milk', targetQty: 5000, currentQty: 3200, unit: 'Pieces' },
    { id: 2, item: 'yellow c flour 1kg', targetQty: 200, currentQty: 200, unit: 'Kg' },
    { id: 3, item: 'tea cake', targetQty: 1000, currentQty: 150, unit: 'Pieces' }
  ]);

  const [targetItem, setTargetItem] = useState('');
  const [targetQty, setTargetQty] = useState('');
  const [targetUnit, setTargetUnit] = useState('Pieces'); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- RESTORED: EXACT API CALL YOU PROVIDED ---
  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem || !targetQty) return;

    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

      // We send the placeholder data she expects, plus our real UI data for when she upgrades it
      const payload = {
        target_type: "weekly", // Matches your form's intent, using the placeholder structure
        target_amount: Number(targetQty),
        product_name: targetItem,
        unit: targetUnit
      };

      const response = await fetch(`${baseUrl}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Only update UI if the backend request was successful
        setWeeklyTargets([
          { 
            id: Date.now(), 
            item: targetItem, 
            targetQty: Number(targetQty), 
            currentQty: 0, 
            unit: targetUnit 
          },
          ...weeklyTargets
        ]);
        
        setTargetItem('');
        setTargetQty('');
        setTargetUnit('Pieces'); 
      } else {
        alert("Failed to save target. Please check your permissions.");
      }
    } catch (error) {
      console.error("Failed to set target:", error);
      alert("Network error. Please try again.");
    }
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    const percentage = Math.min((current / target) * 100, 100);
    return percentage;
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 pt-8">
        
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 pb-2">
          <button 
            onClick={() => router.back()}
            className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">Weekly Targets</h1>
            <p className="text-gray-500 text-sm mt-1">Set production volume goals and track live progress.</p>
          </div>
        </div>

        {/* TOP: ADD NEW TARGET FORM */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 animate-in fade-in">
          <h2 className="text-sm font-black text-[#F57C00] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Target size={18} /> Assign New Target
          </h2>
          
          <form onSubmit={handleSaveTarget} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Select Product</label>
              <select 
                value={targetItem}
                onChange={(e) => setTargetItem(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm text-[#5D4037] outline-none focus:border-[#F57C00] mt-1 transition-all uppercase"
              >
                <option value="" disabled hidden>-- Choose a Product --</option>
                {MARKETING_PRODUCTS.map((prod, i) => (
                  <option key={i} value={prod}>{prod}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Target Volume</label>
              <div className="flex mt-1">
                <input 
                  type="number" 
                  value={targetQty}
                  onChange={(e) => setTargetQty(e.target.value)}
                  placeholder="e.g. 5000" 
                  className="w-full bg-gray-50 border-2 border-r-0 border-gray-200 p-4 rounded-l-2xl font-black text-lg outline-none focus:border-[#F57C00] transition-all" 
                />
                <select 
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  className="bg-gray-100 border-2 border-gray-200 p-4 rounded-r-2xl font-bold text-sm text-gray-600 outline-none focus:border-[#F57C00] transition-all uppercase cursor-pointer"
                >
                  <option value="Pieces">Pieces</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={!targetItem || !targetQty}
              className="h-[58px] bg-[#F57C00] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 active:scale-95 transition-all"
            >
              <Plus size={18} strokeWidth={3} /> Assign
            </button>
          </form>
        </div>

        {/* BOTTOM: TRACKING TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in delay-100">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#5D4037] uppercase">Active Targets & Live Progress</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase border-b border-gray-100">Product Name</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase border-b border-gray-100 text-center">Progress</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase border-b border-gray-100 text-center">Target Volume</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase border-b border-gray-100 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {weeklyTargets.map((target) => {
                  const progress = calculateProgress(target.currentQty, target.targetQty);
                  const isComplete = progress >= 100;
                  const isWarning = progress > 0 && progress < 40;

                  return (
                    <tr key={target.id} className="hover:bg-gray-50/50 transition-colors group">
                      
                      {/* Product Name */}
                      <td className="px-8 py-6 font-black text-[#5D4037] uppercase text-sm">
                        {target.item}
                      </td>
                      
                      {/* Visual Progress Bar */}
                      <td className="px-8 py-6 w-1/3">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[10px] font-black text-gray-500">
                            <span>ACTUAL: {target.currentQty.toLocaleString()}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                                isComplete ? 'bg-green-500' : isWarning ? 'bg-red-500' : 'bg-[#F57C00]'
                              }`} 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Target Quantity & Unit */}
                      <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">
                        {target.targetQty.toLocaleString()} <span className="text-[10px] text-gray-400 font-black uppercase ml-1">{target.unit}</span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-8 py-6 text-right">
                        {isComplete ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 shadow-sm">
                            <CheckCircle2 size={14} /> Target Met
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm">
                            <AlertCircle size={14} /> Falling Behind
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                            <TrendingUp size={14} /> On Track
                          </span>
                        )}
                      </td>
                      
                    </tr>
                  );
                })}
                
                {weeklyTargets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
                      No targets set for this week yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}