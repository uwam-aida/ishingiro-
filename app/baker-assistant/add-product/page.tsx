'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  Scale, 
  CheckCircle,
  ArrowLeft,
  Search,
  Box,
  AlertCircle
} from 'lucide-react';

// The exact product list
const STORE_PRODUCTS = [
    // BREAD (Baked)
    { name: 'big milk', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'small milk', price: 600, category: 'BREAD', type: 'baked' },
    { name: 'pcpn', price: 1100, category: 'BREAD', type: 'baked' },
    { name: 'sen', price: 1000, category: 'BREAD', type: 'baked' },
    { name: 'salted bread', price: 1100, category: 'BREAD', type: 'baked' },
    { name: 'baguette', price: 500, category: 'BREAD', type: 'baked' },
    { name: 'milk slice bread', price: 200, category: 'BREAD', type: 'baked' },
    { name: 'crubes', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'sen pieces', price: 100, category: 'BREAD', type: 'baked' },
    { name: 'brown sanduich', price: 250, category: 'BREAD', type: 'baked' },
    { name: 'mult graine', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'milk mult graine', price: 1000, category: 'BREAD', type: 'baked' },
    { name: 'brown bread', price: 800, category: 'BREAD', type: 'baked' },
 
    // CAKES (Baked)
    { name: 'tea cake', price: 1000, category: 'CAKES', type: 'baked' },
    { name: 'marble cake', price: 1200, category: 'CAKES', type: 'baked' },
    { name: 'brown cake', price: 250, category: 'CAKES', type: 'baked' },
    { name: 'oliver corn cake', price: 350, category: 'CAKES', type: 'baked' },
    { name: 'muffin cake', price: 170, category: 'CAKES', type: 'baked' },

    // AMANDAZI (Baked)
    { name: 'ishingiro', price: 150, category: 'AMANDAZI', type: 'baked' },
    { name: 's.begne', price: 70, category: 'AMANDAZI', type: 'baked' },
    { name: 'dark donut', price: 450, category: 'AMANDAZI', type: 'baked' },
    { name: 'choc donuts', price: 450, category: 'AMANDAZI', type: 'baked' },
    { name: 'kk donuts', price: 250, category: 'AMANDAZI', type: 'baked' },
    { name: 'triangle', price: 150, category: 'AMANDAZI', type: 'baked' },

    // OTHERS (Mixed)
    { name: 'meat samosa', price: 450, category: 'OTHERS', type: 'baked' },
    { name: 'biscuits', price: 85, category: 'OTHERS', type: 'baked' },
    { name: 'ISH.MILK Cookie', price: 130, category: 'OTHERS', type: 'baked' },
    { name: 'butter biscuits', price: 130, category: 'OTHERS', type: 'baked' },
    { name: 'chocolate biscuits', price: 140, category: 'OTHERS', type: 'baked' },
    { name: 'ubunyobwa', price: 1800, category: 'OTHERS', type: 'baked' },
    
    // UNBAKED OTHERS
    { name: 'ikinyuranyo 1kg', price: 1600, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 3kg', price: 4500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 5kg', price: 7500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo (0.5)kg', price: 1200, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 1kg', price: 1700, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 3kg', price: 4800, category: 'OTHERS', type: 'unbaked' },
    { name: 'cashnewnuts', price: 5500, category: 'OTHERS', type: 'unbaked' },
    { name: 'cornfresh cream', price: 500, category: 'OTHERS', type: 'unbaked' },

    // BIG CAKES (Baked)
    { name: 'cake 38000', price: 38000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 20000', price: 20000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 24000', price: 24000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 19000', price: 19000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake18000', price: 18000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 15000', price: 15000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 14000', price: 14000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 13000', price: 13000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 12000', price: 12000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 10000', price: 10000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 9000', price: 9000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 8000', price: 8000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 7000', price: 7000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 6000', price: 6000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 5000', price: 5000, category: 'BIG CAKES', type: 'baked' },
    { name: 'ADDCAKE', price: 2000, category: 'BIG CAKES', type: 'baked' },
];

export default function AddProductPage() {
  const router = useRouter(); 

  const [productName, setProductName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Kg'); // Now tracking Kg vs Piece
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredProducts = STORE_PRODUCTS.filter(prod =>
    prod.name.toLowerCase().includes(productName.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const exactMatch = STORE_PRODUCTS.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (!exactMatch) {
      setErrorMessage("Please select a valid product from the list.");
      return;
    }

    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    // Auto-routes to correct API based on product type to avoid backend errors
    let apiUrl = '';
    let payload = {};
    const simulatedProductId = STORE_PRODUCTS.indexOf(exactMatch) + 1;

    if (exactMatch.type === 'unbaked') {
      apiUrl = `${baseUrl}/baker/ingredients`;
      payload = { name: exactMatch.name, quantity: Number(quantity), unit: unit.toLowerCase() };
    } else {
      apiUrl = `${baseUrl}/baker/production`;
      payload = { product_id: simulatedProductId, quantity: Number(quantity), location: "kabuga" };
    }

    try {
      // FAKING THE BACKEND FOR TESTING PURPOSES
      console.log("Sending payload to fake backend:", payload);
      
      // Simulate a 1-second delay like a real server
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force a success response
      setProductName('');
      setQuantity('');
      // DELETE THE setStatus LINE THAT WAS HERE

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Unexpected error", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20 relative">
      
      {/* BLUE SUCCESS NOTIFICATION */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
            <div className="bg-blue-50 text-blue-800 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-blue-200">
                <CheckCircle className="text-blue-600" size={20} />
                <span className="font-black uppercase text-xs tracking-widest">Product added successfully</span>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Baker assistant</h1>
          <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">Ishingiro Measurement System</p>
        </div>
      </div>

      {/* ERROR MESSAGE DISPLAY */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100 animate-in fade-in">
          <AlertCircle size={20} />
          <span className="text-sm font-bold">{errorMessage}</span>
        </div>
      )}

      {/* --- FORM --- */}
      <div className="animate-in fade-in duration-500">
        <div className="bg-white rounded-[48px] border-2 border-gray-50 shadow-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
              <div className="w-14 h-14 bg-orange-50 text-[#F57C00] rounded-2xl flex items-center justify-center">
                  <Scale size={32} />
              </div>
              <div>
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">New Measured Item</h2>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">Enter product details</p>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Product Name Autocomplete */}
              <div className="space-y-3 relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Box size={14} /> Product Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                     <Search size={18} className="text-gray-400" />
                  </div>
                  {/* ADDED BORDERS AND WHITE BG TO MAKE IT VISIBLE */}
                  <input 
                    required
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      setIsDropdownOpen(true);
                      setErrorMessage(''); 
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setIsDropdownOpen(false)}
                    placeholder="Search product..."
                    autoComplete="off"
                    className="w-full py-5 pl-12 pr-5 bg-white border-2 border-gray-200 shadow-sm rounded-3xl focus:border-[#F57C00] text-sm font-bold outline-none text-black transition-all uppercase"
                  />
                  
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto transform animate-in fade-in slide-in-from-top-2">
                      <ul className="py-2">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((prod, idx) => (
                            <li 
                              key={idx}
                              onMouseDown={(e) => e.preventDefault()} 
                              onClick={() => {
                                setProductName(prod.name);
                                setIsDropdownOpen(false);
                              }}
                              className="px-5 py-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center text-sm font-bold text-gray-700 uppercase transition-colors"
                            >
                              <span>{prod.name}</span>
                              <span className="text-[10px] text-gray-400 px-2 py-1 bg-gray-100 rounded-lg">{prod.category}</span>
                            </li>
                          ))
                        ) : (
                          <li className="px-5 py-4 text-sm font-bold text-gray-400 text-center uppercase">No products found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity and Unit Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Quantity Added</label>
                <div className="flex shadow-sm rounded-3xl">
                  {/* ADDED BORDERS AND WHITE BG */}
                  <input 
                      required
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-5 bg-white border-2 border-r-0 border-gray-200 rounded-l-3xl focus:border-[#F57C00] text-lg font-black outline-none text-black transition-all"
                  />
                  {/* ADDED UNIT DROPDOWN */}
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="bg-gray-50 border-2 border-l-0 border-gray-200 rounded-r-3xl p-5 text-sm font-black text-gray-600 outline-none focus:border-[#F57C00] cursor-pointer uppercase transition-all"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Piece">Piece</option>
                  </select>
                </div>
              </div>

            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F57C00] text-white py-6 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 mt-8"
            >
               {isSubmitting ? 'Processing...' : 'Confirm and Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}