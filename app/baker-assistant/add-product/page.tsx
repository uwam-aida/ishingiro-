'use client';

import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';

export default function BakerAddProduct() {
  const [category, setCategory] = useState<'measured' | 'damaged'>('measured');
  const [unit, setUnit] = useState<'piece' | 'kg'>('piece');

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 pb-20">
      
      <div className="max-w-4xl mx-auto">
      
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#5D4037] tracking-tight">Add New Product</h1>
          <p className="text-gray-500 mt-1 font-medium">Enter product details to add to production inventory</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100">
          <form className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* LEFT COLUMN: Basic Info */}
              <div className="space-y-6">
                
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter product name" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-[#5D4037]/5 focus:border-[#5D4037] transition-all outline-none font-bold text-[#5D4037]" 
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest ml-1">Quantity</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-[#5D4037]/5 focus:border-[#5D4037] transition-all outline-none font-bold text-[#5D4037]" 
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter product description..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-[#5D4037]/5 focus:border-[#5D4037] transition-all outline-none font-bold text-[#5D4037] resize-none" 
                  />
                </div>

              </div>

              {/* RIGHT COLUMN: Options */}
              <div className="space-y-8">
                
                {/* Category Selector - FIXED STYLING */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest ml-1">Category</label>
                    <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-col gap-1">
                      <button 
                        type="button"
                        onClick={() => setCategory('measured')}
                        className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all duration-300 ${
                          category === 'measured' 
                          ? 'bg-[#2979FF] text-white shadow-lg' 
                          : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        Measured to be baked
                      </button>
                    </div>
                </div>

                {/* Unit Selector - FIXED STYLING */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest ml-1">Unit</label>
                    <div className="bg-gray-100 p-1.5 rounded-2xl flex flex-col gap-1">
                      <button 
                        type="button"
                        onClick={() => setUnit('piece')}
                        className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all duration-300 ${
                          unit === 'piece' 
                          ? 'bg-[#2979FF] text-white shadow-lg' 
                          : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        Piece
                      </button>
                      <button 
                        type="button"
                        onClick={() => setUnit('kg')}
                        className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all duration-300 ${
                          unit === 'kg' 
                          ? 'bg-[#2979FF] text-white shadow-lg' 
                          : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        Kg
                      </button>
                    </div>
                </div>

              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                type="button"
                className="w-full bg-[#5D4037] hover:bg-[#4A332C] text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-[#5D4037]/20 active:scale-[0.98]"
              >
                <Plus size={20} strokeWidth={3} />
                Add Product
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}