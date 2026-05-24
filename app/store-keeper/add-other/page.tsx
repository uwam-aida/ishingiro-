'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface Product {
  id?: number;
  name: string;
  price?: number;
  category?: string;
  type?: string;
}

// --- OFFICIAL PRODUCT LIST (FALLBACK) ---
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

export default function AddOtherProduct() {
  const router = useRouter(); 
  
  // --- VIEW STATE: 'grid' or 'form' ---
  const [view, setView] = useState<'grid' | 'form'>('grid');
  
  const [category, setCategory] = useState('Clients');
  const [unit, setUnit] = useState('pcs'); 
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // NEW STATE: For live products and dynamic categories
  const [liveProducts, setLiveProducts] = useState<Product[]>(STORE_PRODUCTS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Fallback categories if API fails
  const [dynamicCategories, setDynamicCategories] = useState([
    { id: 'Tiku', icon: Star },
    { id: 'Clients', icon: UserCircle },
    { id: 'Guests', icon: Users },
    { id: 'Events', icon: Calendar },
    { id: 'Ingaruka', icon: UtensilsCrossed }
  ]);

  // --- 1. FETCH LIVE PRODUCTS & CATEGORIES ON MOUNT ---
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        // Fetch 1: Products
        const prodRes = await fetch(`${baseUrl}/products`, { headers });
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data && data.length > 0) setLiveProducts(data);
        }

        // Fetch 2: Categories (New from API Documentation)
        const catRes = await fetch(`${baseUrl}/distribution/categories`, { headers });
        if (catRes.ok) {
           const data: string[] = await catRes.json();
           
           // Map the plain text strings from the backend to your UI icons
           const mappedCategories = data.map((catName) => {
              let IconToUse = PlusCircle; // Default icon
              if (catName.toLowerCase() === 'tiku') IconToUse = Star;
              else if (catName.toLowerCase() === 'events') IconToUse = Calendar;
              else if (catName.toLowerCase() === 'guests') IconToUse = Users;
              else if (catName.toLowerCase() === 'clients') IconToUse = UserCircle;
              else if (catName.toLowerCase() === 'ingaruka') IconToUse = UtensilsCrossed;
              
              return { id: catName, icon: IconToUse };
           });
           
           if(mappedCategories.length > 0) {
             setDynamicCategories(mappedCategories);
           }
        }
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    };

    fetchData();
  }, [router]);

  // Filter products based on input (using live data if available)
  const filteredProducts = liveProducts.filter(p => 
    p.name.toLowerCase().includes(productName.toLowerCase())
  );

  // Validation Check
  const isInvalidProduct = productName.trim().length > 0 && !liveProducts.some(p => p.name.toLowerCase() === productName.toLowerCase());

  const handleCategoryClick = (id: string) => {
    setCategory(id);
    setView('form');
  };

  // --- 2. SUBMIT TO DISTRIBUTION API ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalidProduct || !productName) return;
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    // Find the actual database ID of the selected product
    const selectedProd = liveProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
    const productId = selectedProd?.id;

    if (!productId) {
      alert("Product ID not found. Please select a valid product.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/distribution`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: Number(quantity),
          category: category,
          location: 'kabuga', // Defaulting to kabuga based on UI note for Tiku
          notes: `Unit: ${unit}` 
        })
      });

      if (response.ok) {
        alert(`Success: ${category} distribution sent to CICM.`);
        setProductName('');
        setQuantity('');
        setView('grid'); 
      } else {
        alert("Failed to record distribution.");
      }
    } catch (error) {
      console.error("Distribution API error:", error);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10 px-4 font-sans text-gray-700">
      
      {/* --- VIEW 1: THE CLICKABLE GRID --- */}
      {view === 'grid' && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          
          {/* <-- NEW HEADER DESIGN WITH BOX ARROW --> */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => router.back()}
              className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
            >
              <ArrowLeft size={22} strokeWidth={2} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-[#F57C00] uppercase tracking-tight">Select Category</h1>
              <p className="text-gray-400 text-sm font-bold uppercase">Choose a target for distribution</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {dynamicCategories.map((item) => (
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