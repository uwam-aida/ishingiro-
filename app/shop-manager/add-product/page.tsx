'use client';

import React, { useState } from 'react';
import { Plus, Tag, Scale } from 'lucide-react';

export default function AddProductPage() {
  // Default selections based on your design
  const [category, setCategory] = useState('Order per piece');
  const [unit, setUnit] = useState('piece');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Enter product details to add to inventory</p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT COLUMN: Input Fields (Span 7) --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Product Name */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Product Name
              </label>
              <input 
                type="text" 
                placeholder="Enter product name" 
                className="w-full bg-gray-100/50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Quantity
              </label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-gray-100/50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Description
              </label>
              <textarea 
                rows={5}
                placeholder="Enter product description" 
                className="w-full bg-gray-100/50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 resize-none transition-all placeholder:text-gray-400"
              ></textarea>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Selectors (Span 5) --- */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Category Section */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Tag size={18} /> Category
              </label>
              <div className="flex flex-col gap-3">
                {['Order per piece', 'Shop stock', 'Damaged Items'].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`group relative px-6 py-5 rounded-2xl text-left font-bold text-sm transition-all duration-200 flex items-center justify-between shadow-sm overflow-hidden
                      ${category === cat 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-[1.02]' // Active Blue Style
                        : 'bg-black text-gray-400 hover:bg-gray-900 hover:text-white' // Inactive Black Style
                      }`}
                  >
                    <span className="relative z-10">{cat}</span>
                    
                    {/* Active Indicator Dot */}
                    {category === cat && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm relative z-10 animate-pulse" />
                    )}

                    {/* Subtle Glow Effect behind active button */}
                    {category === cat && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Unit Section */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Scale size={18} /> Unit
              </label>
              <div className="grid grid-cols-1 gap-3">
                {['piece', 'kg'].map((u) => (
                  <button
                    type="button"
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-6 py-4 rounded-xl font-bold text-sm uppercase transition-all duration-200 text-center
                      ${unit === u 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md transform scale-[1.02]' 
                        : 'bg-black text-gray-400 hover:bg-gray-900'
                      }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- BOTTOM: Action Bar --- */}
          <div className="lg:col-span-12 pt-6 border-t border-gray-100">
            <button className="w-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-gray-900 font-bold text-lg py-5 rounded-2xl shadow-sm hover:shadow flex items-center justify-center gap-3 transition-all active:scale-[0.99]">
              <Plus size={24} className="text-gray-900" />
              Add product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}