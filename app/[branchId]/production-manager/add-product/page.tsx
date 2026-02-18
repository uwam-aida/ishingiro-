'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ProductionAddProduct() {
  const [category, setCategory] = useState<'baked' | 'damaged'>('baked');
  const [unit, setUnit] = useState<'piece' | 'kg'>('piece');

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add new product</h1>
        <p className="text-gray-500 mt-1">Enter product details to add to inventory</p>
      </div>

      {/* --- FORM CARD --- */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <form className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Column: Text Inputs */}
            <div className="space-y-6">
              
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Product Name</label>
                <input 
                  type="text" 
                  placeholder="Enter product name" 
                  className="w-full bg-[#EAEAEA] border-transparent rounded-xl p-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none placeholder:text-gray-500" 
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Quantity</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full bg-[#EAEAEA] border-transparent rounded-xl p-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none placeholder:text-gray-500" 
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Enter Product description" 
                  className="w-full bg-[#EAEAEA] border-transparent rounded-xl p-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none placeholder:text-gray-500" 
                />
              </div>

            </div>

            {/* Right Column: Blue Selectors */}
            <div className="space-y-8">
              
              {/* Category Selector */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Category</label>
                 <div className="bg-black p-2 rounded-2xl flex flex-col gap-2 shadow-lg">
                   
                   <button 
                     type="button"
                     onClick={() => setCategory('baked')}
                     className={`py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                       category === 'baked' 
                       ? 'bg-[#2979FF] text-white shadow-md transform scale-[1.02]' // Active Blue
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     Baked products
                   </button>
                   
                   <button 
                     type="button"
                     onClick={() => setCategory('damaged')}
                     className={`py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                       category === 'damaged' 
                       ? 'bg-[#2979FF] text-white shadow-md transform scale-[1.02]' 
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
                 <div className="bg-black p-2 rounded-2xl flex flex-col gap-2 shadow-lg">
                   
                   <button 
                     type="button"
                     onClick={() => setUnit('piece')}
                     className={`py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                       unit === 'piece' 
                       ? 'bg-[#2979FF] text-white shadow-md transform scale-[1.02]' 
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     piece
                   </button>
                   
                   <button 
                     type="button"
                     onClick={() => setUnit('kg')}
                     className={`py-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                       unit === 'kg' 
                       ? 'bg-[#2979FF] text-white shadow-md transform scale-[1.02]' 
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     kg
                   </button>
                 </div>
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="button"
              className="w-full bg-[#EAEAEA] hover:bg-black hover:text-white text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Plus size={20} />
              Add product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}