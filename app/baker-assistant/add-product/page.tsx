'use client';

import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';

export default function BakerAddProduct() {
  const [category, setCategory] = useState<'measured' | 'damaged'>('measured');
  const [unit, setUnit] = useState<'piece' | 'kg'>('piece');

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Enter product details to add to production inventory</p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
        <form className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* LEFT COLUMN: Basic Info */}
            <div className="space-y-6">
              
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Product Name</label>
                <input 
                  type="text" 
                  placeholder="Enter product name" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium" 
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Quantity</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium" 
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Enter product description..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none font-medium resize-none" 
                />
              </div>

            </div>

            {/* RIGHT COLUMN: Options */}
            <div className="space-y-8">
              
              {/* Category Selector (Blue Style from your image) */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Category</label>
                 <div className="bg-black p-1.5 rounded-xl flex flex-col gap-1">
                   <button 
                     type="button"
                     onClick={() => setCategory('measured')}
                     className={`py-3 rounded-lg text-sm font-bold transition-all ${
                       category === 'measured' 
                       ? 'bg-[#2979FF] text-white shadow-md' // Bright Blue for Active
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     Measured to be baked
                   </button>
                   <button 
                     type="button"
                     onClick={() => setCategory('damaged')}
                     className={`py-3 rounded-lg text-sm font-bold transition-all ${
                       category === 'damaged' 
                       ? 'bg-[#2979FF] text-white shadow-md' 
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     Damaged Items
                   </button>
                 </div>
              </div>

              {/* Unit Selector */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Unit</label>
                 <div className="bg-black p-1.5 rounded-xl flex flex-col gap-1">
                   <button 
                     type="button"
                     onClick={() => setUnit('piece')}
                     className={`py-3 rounded-lg text-sm font-bold transition-all ${
                       unit === 'piece' 
                       ? 'bg-[#2979FF] text-white shadow-md' 
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     Piece
                   </button>
                   <button 
                     type="button"
                     onClick={() => setUnit('kg')}
                     className={`py-3 rounded-lg text-sm font-bold transition-all ${
                       unit === 'kg' 
                       ? 'bg-[#2979FF] text-white shadow-md' 
                       : 'text-gray-400 hover:text-white'
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
              className="w-full bg-gray-100 hover:bg-black hover:text-white text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}