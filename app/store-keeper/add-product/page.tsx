'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  PackagePlus, 
  CheckCircle,
  ArrowLeft,
  Save,
  Box,
  Search,
  Loader2
} from 'lucide-react';

const fetchWithRetry = async (
  url: string,
  options: RequestInit & { retries?: number; timeout?: number } = {}
): Promise<Response> => {
  const { retries = 1, timeout = 0, ...fetchOptions } = options;

  const attemptFetch = async (attemptsLeft: number): Promise<Response> => {
    const controller = new AbortController();
    const timer = timeout
      ? window.setTimeout(() => controller.abort(), timeout)
      : undefined;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      if (!response.ok && attemptsLeft > 1) {
        return attemptFetch(attemptsLeft - 1);
      }

      return response;
    } catch (error) {
      if (attemptsLeft > 1) {
        return attemptFetch(attemptsLeft - 1);
      }
      throw error;
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  };

  return attemptFetch(retries);
};

// The hardcoded list acts as a fallback if the API is unreachable
const STORE_PRODUCTS = [
  // BREAD (Baked)
    { name: 'big milk Bread', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'small milk Bread', price: 600, category: 'BREAD', type: 'baked' },
    { name: 'pcpn', price: 1100, category: 'BREAD', type: 'baked' },
    { name: 'scn', price: 1000, category: 'BREAD', type: 'baked' },
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
    
    // UNBAKED OTHERS
    { name: 'ikinyuranyo 1kg', price: 1600, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 3kg', price: 4500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 5kg', price: 7500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo (0.5)kg', price: 1200, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 1kg', price: 1700, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 3kg', price: 4800, category: 'OTHERS', type: 'unbaked' },
    { name: 'cashnewnuts', price: 5500, category: 'OTHERS', type: 'unbaked' },
    { name: 'cornfresh cream', price: 500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ubunyobwa', price: 1800, category: 'OTHERS', type: 'unbaked' },
    { name: 'ADDCAKE', price: 2000, category: 'BIG CAKES', type: 'unbaked' },

];

export default function StoreKeeperAddProduct() {
  const router = useRouter(); 
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  const [productName, setProductName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [productsList, setProductsList] = useState<any[]>([]); // To store real API products
  
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Kg'); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- 1. NEW FETCH API INTEGRATION (Section 2.4) ---
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetchWithRetry('/api/products', {
          headers: { 'Authorization': `Bearer ${token}` },
          retries: 3,
          timeout: 15000,
        });
        if (response.ok) {
          const data = await response.json();
          setProductsList(data);
        }
      } catch (error) {
        console.error("Failed to fetch dynamic products:", error);
      }
    };
    fetchProducts();
  }, [baseUrl]);

  // Merge dynamic list with fallback list, preferring the API list
  const displayList = productsList.length > 0 ? productsList : STORE_PRODUCTS;

  // Filter products based on what the user types
  const filteredProducts = displayList.filter(prod =>
    prod.name.toLowerCase().includes(productName.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const exactMatch = displayList.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (!exactMatch) {
      alert("Please select a valid product from the list.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      // --- 2. UPDATED PAYLOAD (Section 5.2): Added missing 'unit' ---
      const payload = {
        product_id: exactMatch.id || (STORE_PRODUCTS.indexOf(exactMatch) + 1), 
        quantity: Number(quantity),
        location: 'factory',
        unit: unit.toLowerCase(), // Required field from documentation
        description: "Stock addition via dashboard"
      };

      const response = await fetch('/api/storekeeper/stock', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});
      if (response.ok || response.status === 201) {
        setProductName('');
        setQuantity('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const errorData = await response.text(); 
        console.error("Backend Error Response:", errorData);
        alert(`Server Error (${response.status}): ${errorData}`);
      }
    } catch (error) {
      console.error("API connection error", error);
      alert("Network error occurred. Is your backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20 relative font-sans">
      
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
            <div className="bg-green-50 text-green-700 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-green-200">
                <CheckCircle className="text-green-600" size={20} />
                <span className="font-black uppercase text-xs tracking-widest">Product added successfully</span>
            </div>
        </div>
      )}

      {/* HEADER WITH BACK ARROW */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase">Store Keeper</h1>
          <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">Stock Management System</p>
        </div>
      </div>

      {/* --- ADD PRODUCT FORM --- */}
      <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
        <div className="bg-white rounded-[48px] border-2 border-gray-50 shadow-xl p-8 md:p-12">
          
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
              <div className="w-14 h-14 bg-orange-50 text-[#F57C00] rounded-2xl flex items-center justify-center shadow-sm">
                  <PackagePlus size={32} />
              </div>
              <div>
                  <h2 className="text-xl font-black text-black uppercase tracking-tight">Receive New Stock</h2>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Add items to the main store</p>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Product Name Autocomplete / Search */}
              <div className="space-y-3 relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                  <Box size={14} /> Product Name
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                     <Search size={18} className="text-gray-400" />
                  </div>
                  <input 
                    required
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setIsDropdownOpen(false)}
                    placeholder="Search product..."
                    autoComplete="off"
                    className="w-full py-5 pl-12 pr-5 bg-gray-50 border-2 border-transparent rounded-3xl focus:border-[#F57C00] focus:bg-white text-sm font-bold outline-none text-black transition-all uppercase"
                  />
                  
                  {/* Floating Dropdown Results */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto overflow-x-hidden transform animate-in fade-in slide-in-from-top-2">
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
                          <li className="px-5 py-4 text-sm font-bold text-gray-400 text-center uppercase">
                            No products found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Quantity Added</label>
                <div className="flex">
                  <input 
                      required
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-5 bg-gray-50 border-2 border-r-0 border-transparent rounded-l-3xl focus:border-[#F57C00] focus:bg-white text-lg font-black outline-none text-black transition-all"
                  />
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="bg-gray-100 border-2 border-l-0 border-transparent rounded-r-3xl p-5 text-sm font-black text-gray-600 outline-none focus:border-[#F57C00] cursor-pointer uppercase transition-all"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Piece">Piece</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Premium Submit Button */}
            <div className="pt-4 mt-8">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[70px] bg-gradient-to-r from-[#F57C00] to-[#FF9800] text-white rounded-3xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Add product <Save size={20} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}