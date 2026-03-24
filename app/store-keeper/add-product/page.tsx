'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function StoreKeeperAddProduct() {
  const [category, setCategory] = useState<'baked' | 'damaged'>('baked');
  const [unit, setUnit] = useState<'piece' | 'kg'>('piece');

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Enter product details to add to inventory.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
        <form className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase">Product Name</label>
                <input 
                  type="text" 
                  placeholder="Enter product name" 
                  className="w-full bg-gray-50 border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase">Quantity</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full bg-gray-50 border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Enter product description..." 
                  className="w-full bg-gray-50 border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none" 
                />
              </div>

            </div>

            {/* Right Column: Blue Selectors */}
            <div className="space-y-8">
              
              {/* Category Selector */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase">Category</label>
                 <div className="bg-black p-2 rounded-2xl flex flex-col gap-2">
                   <button 
                     type="button"
                     onClick={() => setCategory('baked')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${
                       category === 'baked' 
                       ? 'bg-[#CC5500] text-white shadow-md' 
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     Baked products
                   </button>
                   <button 
                     type="button"
                     onClick={() => setCategory('damaged')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${
                       category === 'damaged' 
                       ? 'bg-[#CC5500] text-white shadow-md' 
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     Damaged Items
                   </button>
                 </div>
              </div>

              {/* Unit Selector */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase">Unit</label>
                 <div className="bg-black p-2 rounded-2xl flex flex-col gap-2">
                   <button 
                     type="button"
                     onClick={() => setUnit('piece')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${
                       unit === 'piece' 
                       ? 'bg-[#CC5500] text-white shadow-md' 
                       : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     piece
                   </button>
                   <button 
                     type="button"
                     onClick={() => setUnit('kg')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${
                       unit === 'kg' 
                       ? 'bg-[#CC5500] text-white shadow-md' 
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
          <div className="pt-4">
            <button 
              type="button"
              className="w-full bg-gray-100 hover:bg-black hover:text-white text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm"
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