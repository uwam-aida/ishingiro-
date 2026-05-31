'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChefHat, 
  Trash2, 
  History, 
  ArrowLeft,
  Search,
  Package,
  PlusCircle,
  X,
  Scale,
  Box,
  AlertCircle
} from 'lucide-react';

export default function BakerDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('Dashboard');

  // --- STATE TO HOLD FETCHED API DATA ---
  const [bakedProducts, setBakedProducts] = useState<any[]>([]);
  const [damagedItems, setDamagedItems] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]); // measured products
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- MODAL STATES (for adding measured product) ---
  const [showMeasuredModal, setShowMeasuredModal] = useState(false);
  const [formProduct, setFormProduct] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formUnit, setFormUnit] = useState('kg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // --- MODAL STATES for production/damage (existing) ---
  const [showModal, setShowModal] = useState<'production' | 'damage' | null>(null);
  const [prodFormProduct, setProdFormProduct] = useState('');
  const [prodFormQty, setProdFormQty] = useState('');
  const [prodFormReason, setProdFormReason] = useState('');

  // --- AUTHENTICATION CHECK & API FETCH ---
  const fetchBakerData = async () => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    try {
      const prodRes = await fetch(`${baseUrl}/baker/production`, { headers });
      if (prodRes.ok) setBakedProducts(await prodRes.json());

      const damRes = await fetch(`${baseUrl}/baker/damage`, { headers });
      if (damRes.ok) setDamagedItems(await damRes.json());

      const ingRes = await fetch(`${baseUrl}/baker/ingredients`, { headers });
      if (ingRes.ok) setIngredients(await ingRes.json());

      const productsRes = await fetch(`${baseUrl}/products`, { headers });
      if (productsRes.ok) setRealProducts(await productsRes.json());

    } catch (error) {
      console.error("Failed to fetch baker data", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchBakerData();
  }, [router]);

  // --- LOGOUT ---
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      if (token) {
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  // --- POST API for measured product (new modal) ---
  const handleAddMeasuredProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formProduct || !formQty) {
      setErrorMessage("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const response = await fetch(`${baseUrl}/baker/ingredients`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: formProduct, quantity: parseInt(formQty), unit: formUnit })
      });
      if (response.ok) {
        setShowMeasuredModal(false);
        setFormProduct('');
        setFormQty('');
        setFormUnit('kg');
        fetchBakerData(); // refresh all data
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to add measured product");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- POST API for production and damage (existing, kept unchanged) ---
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      const realDbProduct = realProducts.find(p => p.name.toLowerCase() === prodFormProduct.toLowerCase());
      const dbProductId = realDbProduct ? realDbProduct.id : 1;

      if (showModal === 'production') {
        await fetch(`${baseUrl}/baker/production`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ product_id: dbProductId, quantity: parseInt(prodFormQty), location: 'kabuga' })
        });
      } else if (showModal === 'damage') {
        await fetch(`${baseUrl}/baker/damage`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ product_id: dbProductId, quantity: parseInt(prodFormQty), reason: prodFormReason, location: 'kabuga' })
        });
      }
      setShowModal(null);
      setProdFormProduct('');
      setProdFormQty('');
      setProdFormReason('');
      fetchBakerData();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STATS CARDS (new card for Measured Products) ---
  const stats = [
    { label: 'Measured Products', value: ingredients.length.toString(), icon: Scale, color: 'bg-orange-50 text-[#F57C00]' },    { label: 'Baked Products', value: bakedProducts.length.toString(), icon: ChefHat, color: 'bg-orange-50 text-[#F57C00]' },
    { label: 'Damaged Items', value: damagedItems.length.toString(), icon: Trash2, color: 'bg-red-50 text-red-600' },
    { label: 'Full Added Products', value: (damagedItems.length + ingredients.length).toString(), icon: History, color: 'bg-gray-100 text-black' },  ];
  const filteredProducts = realProducts.filter(p =>
     p.name.toLowerCase().includes(productSearch.toLowerCase())
      );
  // --- LIST DATA with real timestamps and sorting ---
  const getGridData = (view: string) => {
    const filteredProducts = realProducts.filter(p =>
  p.name.toLowerCase().includes(productSearch.toLowerCase())
);
    let items: any[] = [];

    switch (view) {
      case 'Measured Products':
        items = ingredients.map(i => ({
          id: `ING-${i.id}`,
          item: i.name || 'Ingredient',
          qty: `${i.quantity} ${i.unit || ''}`,
          dateTime: i.created_at ? new Date(i.created_at).toLocaleString() : 'Logged',
          status: 'Measured',
          rawDate: i.created_at
        }));
        items.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
        break;
      case 'Baked Products':
        items = bakedProducts.map(p => ({
          id: `BK-${p.id}`,
          item: p.product?.name || `Product #${p.product_id}`,
          qty: `${p.quantity} pcs`,
          dateTime: p.created_at ? new Date(p.created_at).toLocaleString() : 'Logged',
          status: 'In Stock',
          rawDate: p.created_at
        }));
        items.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
        break;
      case 'Damaged Items':
        items = damagedItems.map(d => ({
          id: `DM-${d.id}`,
          item: d.product?.name || `Product #${d.product_id}`,
          qty: `${d.quantity} pcs`,
          dateTime: d.created_at ? new Date(d.created_at).toLocaleString() : 'Logged',
          status: 'Waste',
          rawDate: d.created_at
        }));
        items.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
        break;
      case 'Full Added Products':
  const damageEntries = damagedItems.map(d => ({
    id: `DM-${d.id}`,
    item: d.product?.name || `Product #${d.product_id}`,
    qty: `${d.quantity} pcs`,
    dateTime: d.created_at ? new Date(d.created_at).toLocaleString() : 'Logged',
    status: 'Damage',
    rawDate: d.created_at
  }));
  const ingredientEntries = ingredients.map(i => ({
    id: `ING-${i.id}`,
    item: i.name || 'Ingredient',
    qty: `${i.quantity} ${i.unit || ''}`,
    dateTime: i.created_at ? new Date(i.created_at).toLocaleString() : 'Logged',
    status: 'Measured',
    rawDate: i.created_at
  }));
  items = [...damageEntries, ...ingredientEntries];
  items.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
  break;
      default: return [];
    }
    return items;
  };

  let currentData = getGridData(currentView);
  if (searchTerm) {
    currentData = currentData.filter(row => row.item.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10 px-4 pt-4 relative">
      
      {/* --- MODAL FOR ADDING MEASURED PRODUCT (NEW) --- */}
      {showMeasuredModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowMeasuredModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-50 text-[#F57C00] rounded-2xl flex items-center justify-center">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-black uppercase text-black">Add Measured Item</h2>
            </div>
            <form onSubmit={handleAddMeasuredProduct} className="space-y-5">
              <div className="relative">
  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1 mb-1">
    <Box size={12} /> Product Name
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
      <Search size={16} className="text-gray-400" />
    </div>
    <input
      type="text"
      value={productSearch}
      onChange={(e) => {
        setProductSearch(e.target.value);
        setShowProductDropdown(true);
      }}
      onFocus={() => setShowProductDropdown(true)}
      onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}
      placeholder="Search product..."
      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-[#F57C00]"
    />
  </div>
  {showProductDropdown && productSearch && (
    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setFormProduct(prod.name);
              setProductSearch(prod.name);
              setShowProductDropdown(false);
            }}
            className="px-5 py-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center text-sm font-bold text-gray-700 uppercase transition-colors"
          >
            <span>{prod.name}</span>
            <span className="text-[10px] text-gray-400 px-2 py-1 bg-gray-100 rounded-lg">{prod.category}</span>
          </div>
        ))
      ) : (
        <div className="px-5 py-4 text-sm font-bold text-gray-400 text-center uppercase">No products found</div>
      )}
    </div>
  )}
</div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</label>
                <input
                  required
                  type="number"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold outline-none focus:border-blue-500 mt-1"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unit</label>
                <select
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl font-bold outline-none focus:border-blue-500 mt-1"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="liters">liters</option>
                  <option value="pieces">pieces</option>
                </select>
              </div>
              {errorMessage && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                  <AlertCircle size={14} /> {errorMessage}
                </div>
              )}
              <button
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-[#F57C00] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition disabled:opacity-50"
              >
                    {isSubmitting ? 'Saving...' : 'Confirm and Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FOR PRODUCTION / DAMAGE (unchanged) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black uppercase mb-6 text-[#F57C00]">
              {showModal === 'production' ? 'Log Production' : 'Report Damage'}
            </h2>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Name</label>
                <input required type="text" value={prodFormProduct} onChange={(e) => setProdFormProduct(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00] mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</label>
                <input required type="number" value={prodFormQty} onChange={(e) => setProdFormQty(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00] mt-1" />
              </div>
              {showModal === 'damage' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reason</label>
                  <input required type="text" placeholder="e.g. Burned, Dropped" value={prodFormReason} onChange={(e) => setProdFormReason(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00] mt-1" />
                </div>
              )}
              <button disabled={isSubmitting} type="submit" className="w-full bg-black text-white font-black uppercase tracking-widest py-4 rounded-2xl mt-4 hover:bg-[#F57C00] transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DASHBOARD VIEW (stat cards) --- */}
      {currentView === 'Dashboard' ? (
        <>
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Baker Assistant</h1>
              <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">Ishingiro Measurement System</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentView(stat.label)}
                className="bg-white p-10 rounded-[48px] border-2 border-transparent shadow-sm hover:border-[#F57C00] hover:shadow-xl transition-all text-left group active:scale-95 flex flex-col"
              >
                <div className={`w-16 h-16 rounded-3xl ${stat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={32} />
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-5xl font-black text-black tracking-tighter">{stat.value}</h3>
                  <div className="mb-2 p-2 bg-gray-50 rounded-full text-gray-300 group-hover:text-[#F57C00] transition-colors">
                    <PlusCircleIcon size={20} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* --- LIST VIEWS (Measured Products, Baked Products, Damaged Items, Full Added Products) --- */
        <div className="animate-in slide-in-from-right-4 duration-400">
          <button 
            onClick={() => setCurrentView('Dashboard')}
            className="flex items-center gap-3 text-black font-black uppercase text-[10px] tracking-[0.2em] hover:text-[#F57C00] mb-10 transition-colors group"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-100 transition-colors">
              <ArrowLeft size={16} /> 
            </div>
            Back to Overview
          </button>

          <div className="bg-white rounded-[56px] border border-gray-100 shadow-2xl overflow-hidden mb-10">
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-black text-black uppercase tracking-tighter">{currentView}</h2>
                <p className="text-[#F57C00] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  {currentView === 'Measured Products' ? 'Ingredients ready for baking' : 
                   currentView === 'Full Added Products' ? 'Complete production log' : 'Current shift records'}
                </p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                {currentView === 'Measured Products' && (
                  <button onClick={() => setShowMeasuredModal(true)} className="bg-[#F57C00] text-white px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-black transition-colors flex-shrink-0">
                    <PlusCircle size={16}/> Add Measured Item
                  </button>
                )}
                
                {currentView === 'Damaged Items' && (
                  <button onClick={() => setShowModal('damage')} className="bg-red-600 text-white px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-red-700 transition-colors flex-shrink-0">
                    <Trash2 size={16}/> Report Waste
                  </button>
                )}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="SEARCH..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-8 py-4 bg-gray-50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-[#F57C00]/20 font-bold text-[10px] uppercase tracking-widest text-black" 
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Product Info</th>
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-center">Qty / Batch</th>
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Status / Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentData.map((row) => (
                    <tr key={row.id} className="hover:bg-orange-50/20 transition-colors">
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-black">
                            <Package size={22} />
                          </div>
                          <div>
                            <p className="font-black text-black uppercase text-sm tracking-tight">{row.item}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{row.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-center">
                        <span className="font-black text-black text-lg tracking-tighter">{row.qty}</span>
                      </td>
                      <td className="px-12 py-8 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
                            row.status === 'Measured' ? 'bg-blue-600 text-white' :
                            row.status === 'Waste' || row.status === 'Damage' ? 'bg-red-600 text-white' : 
                            'bg-black text-white'
                          }`}>
                            {row.status}
                          </span>
                          <span className="text-[9px] text-gray-400 font-black">{row.dateTime}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {currentData.length === 0 && (
              <div className="p-32 text-center uppercase font-black text-gray-200 text-xl tracking-[0.5em]">No Data</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// PlusCircleIcon helper (unchanged)
function PlusCircleIcon({size}: {size: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
    </svg>
  );
}