'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, CheckCircle, ArrowLeft, Search, Box, Loader2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  cost?: number;
  category: string;
  type: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Kg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [router, baseUrl]);

  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(productName.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const exactMatch = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (!exactMatch) {
      setErrorMessage("Please select a valid product from the list.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    let apiUrl = '';
    let payload = {};

    if (exactMatch.type === 'unbaked') {
      apiUrl = `${baseUrl}/baker/ingredients`;
      payload = { 
        name: exactMatch.name, 
        quantity: Number(quantity), 
        unit: unit.toLowerCase(),
        cost: exactMatch.cost || 0
      };
    } else {
      apiUrl = `${baseUrl}/baker/production`;
      payload = { 
        product_id: exactMatch.id, 
        quantity: Number(quantity), 
        location: "kabuga" 
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setProductName('');
        setQuantity('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Unexpected error", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20 relative">
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-green-50 text-green-700 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-green-200">
            <CheckCircle className="text-green-600" size={20} />
            <span className="font-black uppercase text-xs tracking-widest">Product added successfully</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className="flex-1">
          <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Baker Assistant</h1>
          <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">Ishingiro Measurement System</p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
          <Box size={20} />
          <span className="text-sm font-bold">{errorMessage}</span>
        </div>
      )}

      {/* Form */}
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
                  
                  {isDropdownOpen && productName && filteredProducts.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
                      <ul className="py-2">
                        {filteredProducts.map((prod, idx) => (
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
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity and Unit */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Quantity Added</label>
                <div className="flex shadow-sm rounded-3xl">
                  <input 
                    required
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-5 bg-white border-2 border-r-0 border-gray-200 rounded-l-3xl focus:border-[#F57C00] text-lg font-black outline-none text-black transition-all"
                  />
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
              className="w-full bg-[#F57C00] text-white py-6 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 mt-8 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
              {isSubmitting ? 'Processing...' : 'Confirm and Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}