'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- ADDED THIS
import { 
  Scale, 
  PlusCircle, 
  Package, 
  CheckCircle,
  ArrowLeft // <-- ADDED THIS
} from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter(); // <-- ADDED THIS

  const [productName, setProductName] = useState('');
  const [weight, setWeight] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [history, setHistory] = useState([
    { id: 1, name: 'White Flour Batch', weight: '50', unit: 'Kg', time: '10:30 AM' },
    { id: 2, name: 'Sugar Mix', weight: '25', unit: 'Kg', time: '09:15 AM' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry = {
      id: Date.now(),
      name: productName,
      weight: weight,
      unit: 'Kg',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setHistory([newEntry, ...history]);
    setProductName('');
    setWeight('');

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20 relative">
      
      {/* SUCCESS NOTIFICATION */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
            <div className="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-[#F57C00]">
                <CheckCircle className="text-[#F57C00]" size={20} />
                <span className="font-black uppercase text-xs tracking-widest">Product Successfully Added</span>
            </div>
        </div>
      )}

      {/* HEADER - UPDATED WITH BACK ARROW */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Baker assistant</h1>
          <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">Ishingiro Measurement System</p>
        </div>
      </div>

      {/* --- MEASUREMENT FORM --- */}
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[48px] border-2 border-gray-50 shadow-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-orange-50 text-[#F57C00] rounded-2xl flex items-center justify-center">
                  <Scale size={32} />
              </div>
              <div>
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">New Measured Item</h2>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Enter weight in Kilograms (Kg)</p>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Product Name</label>
                <input 
                  required
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Baking Flour"
                  className="w-full p-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[#F57C00]/10 text-sm font-bold outline-none text-black"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Weight (Kg)</label>
                <div className="relative">
                  <input 
                      required
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[#F57C00]/10 text-sm font-black outline-none text-black"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[#F57C00]">KG</span>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#F57C00] text-white py-6 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl shadow-orange-100 active:scale-[0.98]"
            >
              Confirm and Add Product
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
}