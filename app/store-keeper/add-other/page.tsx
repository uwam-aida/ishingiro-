'use client';

import React, { useState } from 'react';
import { 
  Send, 
  UserCircle, 
  Calendar, 
  Star, 
  Users, 
  PlusCircle, 
  ClipboardList,
  UtensilsCrossed,
  ArrowLeft 
} from 'lucide-react';

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

export default function AddOtherProduct() {
  // --- VIEW STATE: 'grid' or 'form' ---
  const [view, setView] = useState<'grid' | 'form'>('grid');
  
  const [category, setCategory] = useState('Clients');
  const [unit, setUnit] = useState('pcs'); 
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW STATE: For suggestions dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter products based on input
  const filteredProducts = MARKETING_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(productName.toLowerCase())
  );

  // Validation Check: Returns true if there is text but it doesn't match any product name exactly
  const isInvalidProduct = productName.trim().length > 0 && !MARKETING_PRODUCTS.some(p => p.name.toLowerCase() === productName.toLowerCase());

  const categories = [
    { id: 'Tiku', icon: Star },
    { id: 'Clients', icon: UserCircle },
    { id: 'Guests', icon: Users },
    { id: 'Events', icon: Calendar },
    { id: 'Ingaruka', icon: UtensilsCrossed }
  ];

  const handleCategoryClick = (id: string) => {
    setCategory(id);
    setView('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalidProduct || !productName) return;
    setIsSubmitting(true);
    
    console.log({ category, productName, quantity, unit, source: 'Store Keeper' });

    setTimeout(() => {
      alert(`Success: ${category} distribution sent to CICM.`);
      setIsSubmitting(false);
      setProductName('');
      setQuantity('');
      setView('grid'); 
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10 px-4 font-sans text-gray-700">
      
      {/* MOBILE LOGO HEADER */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 pt-2">
        <div className="w-16 h-16 bg-[#F57C00] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#F57C00] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
      </div>

      {/* --- VIEW 1: THE CLICKABLE GRID --- */}
      {view === 'grid' && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-[#F57C00] uppercase tracking-tight">Select Category</h1>
            <p className="text-gray-400 text-sm font-bold uppercase">Choose a target for distribution</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCategoryClick(item.id)}
                className="flex flex-col items-center justify-center p-8 rounded-[32px] border-2 border-gray-100 bg-white hover:border-[#F57C00] transition-all group active:scale-95 shadow-sm hover:shadow-xl"
              >
                <div className="p-4 bg-gray-300 rounded-2xl group-hover:bg-orange-50 transition-colors mb-4 text-gray-900 group-hover:text-[#F57C00]">
                  <item.icon size={32} />
                </div>
                <span className="text-xs font-black text-gray-900 group-hover:text-[#F57C00] uppercase tracking-widest transition-colors">{item.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- VIEW 2: THE FORM PAGE --- */}
      {view === 'form' && (
        <div className="animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-[#F57C00] p-8 text-white">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('grid')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tight">{category} Details</h1>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Sourced from Store Keeper</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Product Name with Suggestions logic integrated */}
              <div className="space-y-2 relative">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={productName}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {setProductName(e.target.value); setShowSuggestions(true);}}
                  placeholder="Enter product name (e.g., salted bread)"
                  className={`w-full bg-gray-50 border rounded-xl p-4 text-sm font-bold text-gray-700 focus:ring-2 outline-none transition-all ${isInvalidProduct ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:ring-[#F57C00]/20'}`}
                />
                
                {/* SUGGESTIONS LIST DROPDOWN */}
                {showSuggestions && productName && filteredProducts.length > 0 && (
                   <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-100 shadow-2xl rounded-xl max-h-48 overflow-y-auto">
                      {filteredProducts.map((p, i) => (
                        <div 
                          key={i} 
                          onClick={() => { setProductName(p.name); setShowSuggestions(false); }} 
                          className="p-4 hover:bg-orange-50 cursor-pointer text-sm font-bold text-gray-700 border-b border-gray-50 last:border-0 uppercase"
                        >
                          {p.name}
                        </div>
                      ))}
                   </div>
                )}

                {isInvalidProduct && (
                  <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-1 tracking-widest">product not found</p>
                )}
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity</label>
                  <input 
                    required
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#F57C00]/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Unit</label>
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setUnit('pcs')}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${unit === 'pcs' ? 'bg-white text-[#F57C00] shadow-sm' : 'text-gray-400'}`}
                    >
                      Pieces
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit('kg')}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${unit === 'kg' ? 'bg-white text-[#F57C00] shadow-sm' : 'text-gray-400'}`}
                    >
                      Kg
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting || isInvalidProduct || !productName}
                className="w-full bg-[#F57C00] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#E65100] transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-orange-200"
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
                   <p className="text-[10px] text-orange-700 font-black text-center uppercase tracking-widest leading-relaxed">
                     Note: Tiku distribution is recorded for Kabuga Branch only.
                   </p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}