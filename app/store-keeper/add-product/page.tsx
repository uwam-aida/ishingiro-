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
  Loader2,
  LogOut
} from 'lucide-react';

// The hardcoded list acts as a fallback if the API is unreachable
const STORE_PRODUCTS = [
    { name: 'big milk', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'small milk', price: 600, category: 'BREAD', type: 'baked' },
    // ... rest of products (keeping as is)
    { name: 'ADDCAKE', price: 2000, category: 'BIG CAKES', type: 'baked' },
];

export default function StoreKeeperAddProduct() {
  const router = useRouter(); 
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [productName, setProductName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [productsList, setProductsList] = useState<any[]>([]);
  
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Kg'); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${baseUrl}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
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

  const displayList = productsList.length > 0 ? productsList : STORE_PRODUCTS;
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
      const payload = {
        product_id: exactMatch.id || (STORE_PRODUCTS.indexOf(exactMatch) + 1), 
        quantity: Number(quantity),
        location: 'kabuga', 
        unit: unit.toLowerCase(),
        description: "Stock addition via dashboard"
      };

      const response = await fetch(`${baseUrl}/storekeeper/stock`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
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
      
      {/* Logout Button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
        >
          <LogOut size={16} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

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

      {/* ADD PRODUCT FORM */}
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
              
              {/* Product Name Autocomplete */}
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