'use client';

import React, { useState } from 'react';
import { PlusCircle, ChevronDown, Clock } from 'lucide-react';

export default function ShopManagerAddPage() {
  const [formData, setFormData] = useState({
    category: 'Shop Stock',
    itemName: '',
    quantity: '',
    notes: ''
  });

  const categories = [
    'Shop Stock',
    'Orders',
    'Received',
    'Damaged'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- AUTOMATIC TIME GENERATION ---
    const autoTime = new Date().toLocaleString(); // Gets current date and time
    
    // Create the full record
    const newRecord = {
      ...formData,
      timestamp: autoTime // Time is added automatically here
    };

    console.log("Submitting Record:", newRecord);
    alert(`Successfully added to ${formData.category}\nTime Logged: ${autoTime}`);
    
    // Reset form
    setFormData({ category: 'Shop Stock', itemName: '', quantity: '', notes: '' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      
      {/* --- MOBILE LOGO (VISIBLE ONLY ON PHONE) --- */}
      <div className="md:hidden flex items-center justify-center mb-6">
         {/* 🔴 Make sure your logo file is in public folder named logo.png 🔴 */}
         <img 
           src="/logo.png" 
           alt="Shop Logo" 
           className="h-16 w-auto object-contain" 
         />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#5D4037] tracking-tight">Add New Record</h1>
        <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
          <Clock size={16} /> Time will be recorded automatically.
        </p>
      </div>

      {/* --- FORM AREA --- */}
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* 1. CATEGORY SELECTION */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#A67C37] tracking-wider ml-1">
              Select Category
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full appearance-none bg-[#EBE0CC]/30 border border-[#EBE0CC] text-[#5D4037] text-sm font-bold rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A67C37]" size={20} />
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
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-semibold rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#A67C37]/50 focus:bg-white transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* 3. QUANTITY */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#A67C37] tracking-wider ml-1">
              Quantity
            </label>
            <input 
              type="number" 
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-semibold rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#A67C37]/50 focus:bg-white transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* 4. NOTES / DETAILS */}
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
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-medium rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#A67C37]/50 focus:bg-white transition-all placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            className="mt-4 w-full bg-[#5D4037] text-white font-bold text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#5D4037]/20 hover:bg-[#4a332a] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle size={20} />
            Add to {formData.category}
          </button>

        </form>
      </div>

    </div>
  );
}