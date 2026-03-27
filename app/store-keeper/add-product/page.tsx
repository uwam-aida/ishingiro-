'use client';

import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';

// --- OFFICIAL PRODUCT LIST ---
const MARKETING_PRODUCTS = [
    { name: 'big milk', type: 'Baked' },
    { name: 'small milk', type: 'Baked' },
    { name: 'pcpn', type: 'Baked' },
    { name: 'sen', type: 'Baked' },
    { name: 'salted bread', type: 'Baked' },
    { name: 'baguette', type: 'Baked' },
    { name: 'milk slice bread', type: 'Baked' },
    { name: 'crubes', type: 'Baked' },
    { name: 'sen pieces', type: 'Baked' },
    { name: 'brown sanduich', type: 'Baked' },
    { name: 'mult graine', type: 'Baked' },
    { name: 'milk mult graine', type: 'Baked' },
    { name: 'brown bread', type: 'Baked' },
    { name: 'tea cake', type: 'Baked' },
    { name: 'marble cake', type: 'Baked' },
    { name: 'brown cake', type: 'Baked' },
    { name: 'oliver corn cake', type: 'Baked' },
    { name: 'muffin cake', type: 'Baked' },
    { name: 'ishingiro', type: 'Baked' }, 
    { name: 's.begne', type: 'Baked' },
    { name: 'dark donut', type: 'Baked' },
    { name: 'choc donuts', type: 'Baked' },
    { name: 'kk donuts', type: 'Baked' },
    { name: 'triangle', type: 'Baked' },
    { name: 'meat sambusa', type: 'Baked' },
    { name: 'biscuits', type: 'Baked' },  
    { name: 'ISH.MILK Cookie', type: 'Baked' }, 
    { name: 'butter biscuits', type: 'Baked' },
    { name: 'chocolate biscuits', type: 'Baked' }, 
    { name: 'ubunyobwa', type: 'Baked' },
    { name: 'ikinyuranyo 1kg', type: 'Unbaked' },
    { name: 'ikinyuranyo 3kg', type: 'Unbaked' },
    { name: 'ikinyuranyo 5kg', type: 'Unbaked' },
    { name: 'ikinyuranyo (0.5)kg', type: 'Unbaked' },
    { name: 'yellow c flour 1kg', type: 'Unbaked' },
    { name: 'yellow c flour 3kg', type: 'Unbaked' },
    { name: 'cashnewnuts', type: 'Unbaked' },
    { name: 'cornfresh cream', type: 'Unbaked' },
    { name: 'cake 38000', type: 'Baked' },
    { name: 'cake 20000', type: 'Baked' },
    { name: 'cakes 24000', type: 'Baked' },
    { name: 'cake 19000', type: 'Baked' },
    { name: 'cake18000', type: 'Baked' },
    { name: 'cakes 15000', type: 'Baked' },
    { name: 'cakes 14000', type: 'Baked' },
    { name: 'cakes 13000', type: 'Baked' },
    { name: 'cake 12000', type: 'Baked' },
    { name: 'cakes 10000', type: 'Baked' },
    { name: 'cakes 9000', type: 'Baked' },
    { name: 'cakes 8000', type: 'Baked' },
    { name: 'cakes 7000', type: 'Baked' },
    { name: 'cakes 6000', type: 'Baked' },
    { name: 'cake 5000', type: 'Baked' },
    { name: 'ADDCAKE', type: 'Baked' },
];

export default function StoreKeeperAddProduct() {
  const [category, setCategory] = useState<'baked' | 'unbaked' | 'damaged'>('baked');
  const [unit, setUnit] = useState<'piece' | 'kg'>('piece');
  const [productName, setProductName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // New States for "Added" feedback
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const filteredSuggestions = MARKETING_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(productName.toLowerCase())
  );

  const matchedProduct = MARKETING_PRODUCTS.find(p => p.name.toLowerCase() === productName.toLowerCase());
  const isNotFound = productName.length > 0 && !matchedProduct;

  let logicError = "";
  if (matchedProduct) {
    if (matchedProduct.type === 'Baked' && category === 'unbaked') logicError = "THIS PRODUCT IS BAKED";
    if (matchedProduct.type === 'Unbaked' && category === 'baked') logicError = "THIS PRODUCT IS UNBAKED";
  }

  // Handle Add Product Click
  const handleAddProduct = () => {
    if (!!logicError || isNotFound || !productName) return;
    
    setIsAdding(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      
      // Reset form after success
      setProductName('');
      
      // Hide success message after 3 seconds
      setTimeout(() => setIsAdded(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Enter product details to add to inventory.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 relative">
        
        {/* Success Feedback Overlay */}
        {isAdded && (
          <div className="absolute inset-x-0 top-4 flex justify-center z-50 animate-in slide-in-from-top duration-300">
             <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold uppercase text-xs">
                <CheckCircle2 size={16} /> Product Successfully Added!
             </div>
          </div>
        )}

        <form className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-gray-900 uppercase">Product Name</label>
                <input 
                  type="text" 
                  value={productName}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onChange={(e) => {setProductName(e.target.value); setShowSuggestions(true);}}
                  placeholder="Enter product name" 
                  className={`w-full bg-gray-50 border rounded-xl p-4 text-sm transition-all outline-none ${isNotFound || logicError ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`} 
                />
                
                {isNotFound && !logicError && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-1">PRODUCT NOT FOUND</p>}
                {logicError && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-1">{logicError}</p>}

                {showSuggestions && productName && filteredSuggestions.length > 0 && (
                   <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-100 shadow-xl rounded-xl max-h-48 overflow-y-auto">
                      {filteredSuggestions.map((p, i) => (
                        <div key={i} onClick={() => { setProductName(p.name); setShowSuggestions(false); }} className="p-3 hover:bg-orange-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0">{p.name}</div>
                      ))}
                   </div>
                )}
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

            {/* Right Column: Selectors */}
            <div className="space-y-8">
              
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase">Category</label>
                 <div className="bg-black p-2 rounded-2xl flex flex-col gap-2">
                   <button 
                     type="button"
                     onClick={() => setCategory('baked')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${category === 'baked' ? 'bg-[#CC5500] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                   >
                     Baked products
                   </button>
                   <button 
                     type="button"
                     onClick={() => setCategory('unbaked')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${category === 'unbaked' ? 'bg-[#CC5500] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                   >
                     Unbaked products
                   </button>
                   <button 
                     type="button"
                     onClick={() => setCategory('damaged')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${category === 'damaged' ? 'bg-[#CC5500] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                   >
                     Damaged Items
                   </button>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase">Unit</label>
                 <div className="bg-black p-2 rounded-2xl flex flex-col gap-2">
                   <button 
                     type="button"
                     onClick={() => setUnit('piece')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${unit === 'piece' ? 'bg-[#CC5500] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                   >
                     piece
                   </button>
                   <button 
                     type="button"
                     onClick={() => setUnit('kg')}
                     className={`py-3.5 rounded-xl text-sm font-bold transition-all ${unit === 'kg' ? 'bg-[#CC5500] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
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
              onClick={handleAddProduct}
              disabled={!!logicError || isNotFound || isAdding}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${!!logicError || isNotFound || isAdding ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-black hover:text-white text-gray-900'}`}
            >
              {isAdding ? (
                 <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Plus size={20} />
                  Add Product
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}