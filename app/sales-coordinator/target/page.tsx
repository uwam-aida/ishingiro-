'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Plus, ArrowLeft, TrendingUp, AlertCircle, CheckCircle2, Trash2, Edit2, LogOut } from 'lucide-react';

const MARKETING_PRODUCTS = [
  { id: 1, name: 'big milk' }, { id: 2, name: 'small milk' }, { id: 3, name: 'pcpn' }, { id: 4, name: 'sen' }, 
  { id: 5, name: 'salted bread' }, { id: 6, name: 'baguette' }, { id: 7, name: 'milk slice bread' }, { id: 8, name: 'crubes' }, 
  { id: 9, name: 'sen pieces' }, { id: 10, name: 'brown sanduich' }, { id: 11, name: 'mult graine' }, { id: 12, name: 'milk mult graine' }, 
  { id: 13, name: 'brown bread' }, { id: 14, name: 'tea cake' }, { id: 15, name: 'marble cake' }, { id: 16, name: 'brown cake' }, 
  { id: 17, name: 'oliver corn cake' }, { id: 18, name: 'muffin cake' }, { id: 19, name: 'ishingiro' }, { id: 20, name: 's.begne' }, 
  { id: 21, name: 'dark donut' }, { id: 22, name: 'choc donuts' }, { id: 23, name: 'kk donuts' }, { id: 24, name: 'triangle' }, 
  { id: 25, name: 'meat sambusa' }, { id: 26, name: 'biscuits' }, { id: 27, name: 'ISH.MILK Cookie' }, { id: 28, name: 'butter biscuits' }, 
  { id: 29, name: 'chocolate biscuits' }, { id: 30, name: 'ubunyobwa' }, { id: 31, name: 'ikinyuranyo 1kg' }, { id: 32, name: 'ikinyuranyo 3kg' }, 
  { id: 33, name: 'ikinyuranyo 5kg' }, { id: 34, name: 'ikinyuranyo (0.5)kg' }, { id: 35, name: 'yellow c flour 1kg' }, { id: 36, name: 'yellow c flour 3kg' }, 
  { id: 37, name: 'cashnewnuts' }, { id: 38, name: 'cornfresh cream' }, { id: 39, name: 'cake 38000' }, { id: 40, name: 'cake 20000' }, 
  { id: 41, name: 'cakes 24000' }, { id: 42, name: 'cake 19000' }, { id: 43, name: 'cake18000' }, { id: 44, name: 'cakes 15000' }, 
  { id: 45, name: 'cakes 14000' }, { id: 46, name: 'cakes 13000' }, { id: 47, name: 'cake 12000' }, { id: 48, name: 'cakes 10000' }, 
  { id: 49, name: 'cakes 9000' }, { id: 50, name: 'cakes 8000' }, { id: 51, name: 'cakes 7000' }, { id: 52, name: 'cakes 6000' }, 
  { id: 53, name: 'cake 5000' }, { id: 54, name: 'ADDCAKE' }
];

export default function WeeklyTargetsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [weeklyTargets, setWeeklyTargets] = useState<any[]>([]);
  const [targetItem, setTargetItem] = useState('');
  const [targetQty, setTargetQty] = useState('');
  const [targetUnit, setTargetUnit] = useState('pieces'); 

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  // Fetch targets
  useEffect(() => {
    setIsMounted(true);
    
    const fetchTargets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      try {
        const response = await fetch(`${baseUrl}/sales/targets`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          setWeeklyTargets(data.map((t: any) => ({
             id: t.id,
             item: t.product_name,
             targetQty: t.target_volume,
             currentQty: t.actual_volume || 0,
             unit: t.unit,
             status: t.status || 'On Track'
          })));
        }
      } catch (error) {
        console.error("Failed to load targets:", error);
      }
    };

    fetchTargets();
  }, [router, baseUrl]);

  // Save new target
  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem || !targetQty) return;

    try {
      const token = localStorage.getItem('token');
      const selectedProduct = MARKETING_PRODUCTS.find(p => p.name === targetItem);
      const productId = selectedProduct ? selectedProduct.id : 1;

      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const payload = {
        product_id: productId,
        target_volume: Number(targetQty),
        unit: targetUnit.toLowerCase(),
        start_date: today.toISOString().split('T')[0],
        end_date: nextWeek.toISOString().split('T')[0]
      };

      const response = await fetch(`${baseUrl}/sales/targets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const newTarget = await response.json();
        setWeeklyTargets([
          { 
            id: newTarget.id || Date.now(), 
            item: targetItem, 
            targetQty: Number(targetQty), 
            currentQty: 0, 
            unit: targetUnit,
            status: 'On Track'
          },
          ...weeklyTargets
        ]);
        setTargetItem('');
        setTargetQty('');
        setTargetUnit('pieces'); 
      } else {
        alert("Failed to save target. Please check your permissions.");
      }
    } catch (error) {
      console.error("Failed to set target:", error);
      alert("Network error. Please try again.");
    }
  };

  // Edit target
  const handleEditTarget = async (id: number, currentTargetQty: number, currentUnit: string) => {
    const newQtyStr = prompt(`Enter new target volume:`, currentTargetQty.toString());
    const newQty = parseInt(newQtyStr || '');
    if (!newQty || isNaN(newQty)) return;

    const newUnit = prompt(`Enter unit (pieces or kg):`, currentUnit);
    if (!newUnit) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${baseUrl}/sales/targets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ target_volume: newQty, unit: newUnit.toLowerCase() })
      });

      if (response.ok) {
        setWeeklyTargets(prev => prev.map(t => 
          t.id === id ? { ...t, targetQty: newQty, unit: newUnit } : t
        ));
      } else {
        alert("Failed to update target.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // Delete target
  const handleDeleteTarget = async (id: number) => {
    if (!confirm("Are you sure you want to delete this target?")) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${baseUrl}/sales/targets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok || response.status === 204) {
        setWeeklyTargets(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Failed to delete target.");
      }
    } catch (error) {
      console.error("Delete error:", error);
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
      {/* Logout Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
        >
          <LogOut size={16} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-8 pt-8">
        
        {/* HEADER */}
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

        {/* ADD NEW TARGET FORM */}
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
                {MARKETING_PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.name}>{prod.name}</option>
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
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kg</option>
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

        {/* TRACKING TABLE */}
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
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {weeklyTargets.map((target) => {
                  const progress = calculateProgress(target.currentQty, target.targetQty);
                  const isComplete = progress >= 100;
                  const isWarning = progress > 0 && progress < 40;

                  return (
                    <tr key={target.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6 font-black text-[#5D4037] uppercase text-sm">{target.item}</td>
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
                      <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">
                        {target.targetQty.toLocaleString()} <span className="text-[10px] text-gray-400 font-black uppercase ml-1">{target.unit}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {isComplete || target.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 shadow-sm">
                            <CheckCircle2 size={14} /> Target Met
                          </span>
                        ) : isWarning || target.status === 'Falling Behind' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 shadow-sm">
                            <AlertCircle size={14} /> Falling Behind
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                            <TrendingUp size={14} /> On Track
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditTarget(target.id, target.targetQty, target.unit)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteTarget(target.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {weeklyTargets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
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