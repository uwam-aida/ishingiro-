'use client';

import React, { useState } from 'react';
import { 
  Send, 
  UserCircle, 
  Calendar, 
  Star, 
  Users, // Added this to fix your error
  PlusCircle, 
  ClipboardList 
} from 'lucide-react';

export default function AddOtherProduct() {
  const [category, setCategory] = useState('Clients');
  const [unit, setUnit] = useState('pcs'); 
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Logic: Tiku is Kabuga only, others are general
    console.log({ category, productName, quantity, unit, source: 'Store Keeper' });

    setTimeout(() => {
      alert(`Success: ${category} distribution sent to CICM.`);
      setIsSubmitting(false);
      setProductName('');
      setQuantity('');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      
      {/* MOBILE LOGO HEADER */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 pt-2">
        <div className="w-16 h-16 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#5D4037] p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl">
              <ClipboardList size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Add Other Distribution</h1>
              <p className="text-white/70 text-sm">Sourced from Store Keeper</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* 1. Category Selection */}
          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'Tiku', icon: Star },
                { id: 'Clients', icon: UserCircle },
                { id: 'Guests', icon: Users },
                { id: 'Events', icon: Calendar }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                    category === item.id 
                    ? 'border-[#5D4037] bg-orange-50 text-[#5D4037]' 
                    : 'border-gray-50 text-gray-400 hover:border-gray-100'
                  }`}
                >
                  <item.icon size={24} className="mb-2" />
                  <span className="text-xs font-bold">{item.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Product Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
            <input 
              required
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#5D4037]/20 outline-none"
            />
          </div>

          {/* 3. Quantity & Unit Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity</label>
              <input 
                required
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#5D4037]/20 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Unit of Measure</label>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setUnit('pcs')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${unit === 'pcs' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-400'}`}
                >
                  Pieces
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('kg')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${unit === 'kg' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-400'}`}
                >
                  Kilograms
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#5D4037] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : (
              <>
                <Send size={18} />
                Submit to CICM Report
              </>
            )}
          </button>

          {category === 'Tiku' && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
               <p className="text-[10px] text-orange-700 font-black text-center uppercase tracking-widest">
                 Note: Tiku distribution is recorded for Kabuga Branch only.
               </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}