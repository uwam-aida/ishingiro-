'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, ChevronDown, Clock, ArrowLeft } from 'lucide-react';

export default function ShopManagerAddPage() {
  const router = useRouter(); 

  // Default state - Category set to 'Shop Stock'
  const [formData, setFormData] = useState({
    category: 'Shop Stock', 
    itemName: '',
    quantity: '',
    unit: 'Pieces', // Strict default
    notes: ''
  });

  // Categories List (Nouns only)
  const categories = [
    'Shop Stock', 
    'Orders',
    'Received',
    'Damaged'
  ];

  // --- STRICT UNIT OPTIONS: ONLY PIECES AND KG ---
  const units = ['Pieces', 'Kg'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const autoTime = new Date().toLocaleString(); 
    
    const newRecord = {
      ...formData,
      timestamp: autoTime 
    };

    console.log("Submitting Record:", newRecord);
    alert(`Successfully added: ${formData.quantity} ${formData.unit} of ${formData.itemName}\nCategory: ${formData.category}\nTime: ${autoTime}`);
    
    // Reset form
    setFormData({ category: 'Shop Stock', itemName: '', quantity: '', unit: 'Pieces', notes: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Container */}
      <div className="max-w-2xl mx-auto space-y-8 px-4 pt-6">
        
        {/* --- MOBILE LOGO --- */}
        <div className="md:hidden flex items-center justify-center mb-6">
           <img 
             src="/logo.png" 
             alt="Shop Logo" 
             className="h-16 w-auto object-contain" 
           />
        </div>

        {/* --- HEADER WITH BACK ARROW --- */}
        <div className="flex items-center gap-4">
           <button 
             onClick={() => router.back()} 
             className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#5D4037] hover:bg-[#EBE0CC]/30 transition-all shadow-sm"
           >
             <ArrowLeft size={24} />
           </button>
           <div>
             <h1 className="text-3xl font-bold text-[#5D4037] tracking-tight">Add Record</h1>
             <p className="text-[#A67C37] mt-1 font-medium text-sm flex items-center gap-2">
               <Clock size={14} /> Time will be recorded automatically.
             </p>
           </div>
        </div>

        {/* --- FORM AREA --- */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-lg shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* 1. CATEGORY SELECTION */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[#A67C37] tracking-wider ml-1">
                Select Category
              </label>
              <div className="relative group">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full appearance-none bg-[#EBE0CC]/30 border-2 border-transparent text-[#5D4037] text-sm font-bold rounded-2xl px-5 py-4 focus:outline-none focus:border-[#A67C37] focus:bg-white transition-all cursor-pointer shadow-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#A67C37] group-hover:text-[#5D4037] transition-colors">
                   <ChevronDown size={20} strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* 2. ITEM NAME */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[#A67C37] tracking-wider ml-1">
                Item Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. White Bread"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 text-[#5D4037] text-sm font-bold rounded-2xl px-5 py-4 focus:outline-none focus:border-[#A67C37]/50 focus:bg-white transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* 3. QUANTITY & UNIT ROW */}
            <div className="flex gap-4">
              
              {/* Quantity Input */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-[#A67C37] tracking-wider ml-1">
                  Quantity
                </label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-100 text-[#5D4037] text-sm font-bold rounded-2xl px-5 py-4 focus:outline-none focus:border-[#A67C37]/50 focus:bg-white transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Unit Select - STRICTLY PIECES & KG */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-[#A67C37] tracking-wider ml-1">
                  Unit Type
                </label>
                <div className="relative group">
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full appearance-none bg-gray-50 border-2 border-gray-100 text-[#5D4037] text-sm font-bold rounded-2xl px-5 py-4 focus:outline-none focus:border-[#A67C37]/50 focus:bg-white transition-all cursor-pointer"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#5D4037]">
                     <ChevronDown size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>

            </div>

            {/* 4. NOTES */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-[#A67C37] tracking-wider ml-1">
                {formData.category === 'Damaged' ? 'Reason for Damage' : 
                 formData.category === 'Orders' ? 'Due Time / Specifics' : 
                 'Additional Notes'}
              </label>
              <textarea 
                rows={3}
                placeholder={formData.category === 'Damaged' ? 'e.g. Burnt, Fell on floor...' : 'Any extra details...'}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 text-[#5D4037] text-sm font-medium rounded-2xl px-5 py-4 focus:outline-none focus:border-[#A67C37]/50 focus:bg-white transition-all placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              className="mt-4 w-full bg-[#5D4037] text-white font-bold text-sm uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-[#5D4037]/20 hover:bg-[#4a332a] hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} />
              Add Product
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}