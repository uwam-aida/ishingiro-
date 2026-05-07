'use client';

// 1. Added useEffect for the auth check
import React, { useState, useEffect } from 'react';
// 2. Added useRouter for navigation
import { useRouter } from 'next/navigation';
import { 
  ChefHat, 
  Trash2, 
  History, 
  ArrowLeft,
  Search,
  Package,
  PlusCircle,
  X
} from 'lucide-react';

export default function BakerDashboard() {
  const router = useRouter(); // Initialize router
  const [currentView, setCurrentView] = useState('Dashboard');

  // --- STATE TO HOLD FETCHED API DATA ---
  const [bakedProducts, setBakedProducts] = useState<any[]>([]);
  const [damagedItems, setDamagedItems] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [realProducts, setRealProducts] = useState<any[]>([]);

  // --- MODAL STATES ---
  const [showModal, setShowModal] = useState<'production' | 'damage' | 'ingredient' | null>(null);
  
  // --- FORM STATES ---
  const [formProduct, setFormProduct] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formUnit, setFormUnit] = useState('kg');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // --- LOGOUT FUNCTION ---
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

  // --- POST APIS ---
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    try {
      if (showModal === 'ingredient') {
        await fetch(`${baseUrl}/baker/ingredients`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: formProduct, quantity: parseInt(formQty), unit: formUnit })
        });
      } else {
        // Find real DB ID
        const realDbProduct = realProducts.find(p => p.name.toLowerCase() === formProduct.toLowerCase());
        const dbProductId = realDbProduct ? realDbProduct.id : 1; 

        if (showModal === 'production') {
          await fetch(`${baseUrl}/baker/production`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ product_id: dbProductId, quantity: parseInt(formQty), location: 'kabuga' })
          });
        } else if (showModal === 'damage') {
          await fetch(`${baseUrl}/baker/damage`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ product_id: dbProductId, quantity: parseInt(formQty), reason: formReason, location: 'kabuga' })
          });
        }
      }

      // Reset and refresh
      setShowModal(null);
      setFormProduct('');
      setFormQty('');
      setFormReason('');
      setFormUnit('kg');
      fetchBakerData();

    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 1. THE THREE MAIN CATEGORIES ---
  const stats = [
    { label: 'Baked Products', value: bakedProducts.length.toString(), icon: ChefHat, color: 'bg-orange-50 text-[#F57C00]' },
    { label: 'Damaged Items', value: damagedItems.length.toString(), icon: Trash2, color: 'bg-red-50 text-red-600' },
    { label: 'Ingredient Store', value: ingredients.length.toString(), icon: Package, color: 'bg-gray-100 text-black' },
    { label: 'Full Added Products', value: (bakedProducts.length + damagedItems.length).toString(), icon: History, color: 'bg-gray-100 text-black' },
  ];

  // --- 2. LIST DATA ---
  const getGridData = (view: string) => {
    switch (view) {
      case 'Baked Products':
        return bakedProducts.map(p => ({
          id: `BK-${p.id}`, 
          item: p.product?.name || `Product #${p.product_id}`, 
          qty: `${p.quantity} pcs`, 
          time: 'Logged', 
          status: 'In Stock'
        }));
      case 'Damaged Items':
        return damagedItems.map(d => ({
          id: `DM-${d.id}`, 
          item: d.product?.name || `Product #${d.product_id}`, 
          qty: `${d.quantity} pcs`, 
          reason: d.reason, 
          status: 'Waste'
        }));
      case 'Ingredient Store':
        return ingredients.map(i => ({
          id: `ING-${i.id}`, 
          item: i.name, 
          qty: `${i.quantity} ${i.unit}`, 
          time: 'Available', 
          status: 'Stock'
        }));
      case 'Full Added Products':
        const combined = [...bakedProducts, ...damagedItems].sort((a, b) => b.id - a.id);
        return combined.map(log => ({
          id: `LOG-${log.id}`, 
          item: log.product?.name || `Product #${log.product_id}`, 
          qty: `${log.quantity} pcs`, 
          date: 'Logged', 
          status: log.reason ? 'Waste' : 'Verified'
        }));
      default: return [];
    }
  };

  const currentData = getGridData(currentView);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10 px-4 pt-4 relative">
      
      {/* --- FORMS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowModal(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                 <X size={24} />
              </button>
              <h2 className="text-2xl font-black uppercase mb-6 text-[#F57C00]">
                 {showModal === 'production' ? 'Log Production' : showModal === 'damage' ? 'Report Damage' : 'Add Ingredient'}
              </h2>
              
              <form onSubmit={handlePostSubmit} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {showModal === 'ingredient' ? 'Ingredient Name' : 'Product Name'}
                    </label>
                    <input required type="text" value={formProduct} onChange={(e) => setFormProduct(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity</label>
                    <input required type="number" value={formQty} onChange={(e) => setFormQty(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]" />
                 </div>

                 {showModal === 'ingredient' && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unit</label>
                      <input required type="text" placeholder="e.g. kg, liters" value={formUnit} onChange={(e) => setFormUnit(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]" />
                   </div>
                 )}

                 {showModal === 'damage' && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reason</label>
                      <input required type="text" placeholder="e.g. Burned, Dropped" value={formReason} onChange={(e) => setFormReason(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]" />
                   </div>
                 )}

                 <button disabled={isSubmitting} type="submit" className="w-full bg-black text-white font-black uppercase tracking-widest py-4 rounded-2xl mt-4 hover:bg-[#F57C00] transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Submit'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* --- DASHBOARD VIEW --- */}
      {currentView === 'Dashboard' ? (
        <>
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-black tracking-tighter uppercase">Baker Assistant</h1>
              <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">Ishingiro Production Management</p>
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
        /* --- PRODUCT LIST VIEW (When a Grid is Clicked) --- */
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
            {/* Header of the List */}
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-black text-black uppercase tracking-tighter">{currentView}</h2>
                <p className="text-[#F57C00] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Current Shift Records</p>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                {currentView === 'Baked Products' && <button onClick={() => setShowModal('production')} className="bg-black text-white px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-[#F57C00] transition-colors flex-shrink-0"><PlusCircle size={16}/> Log Batch</button>}
                {currentView === 'Damaged Items' && <button onClick={() => setShowModal('damage')} className="bg-red-600 text-white px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-red-700 transition-colors flex-shrink-0"><Trash2 size={16}/> Report Waste</button>}
                {currentView === 'Ingredient Store' && <button onClick={() => setShowModal('ingredient')} className="bg-black text-white px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-[#F57C00] transition-colors flex-shrink-0"><PlusCircle size={16}/> Add Supply</button>}

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                      type="text" 
                      placeholder="SEARCH..." 
                      className="w-full pl-14 pr-8 py-4 bg-gray-50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-[#F57C00]/20 font-bold text-[10px] uppercase tracking-widest text-black" 
                  />
                </div>
              </div>
            </div>

            {/* The Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Product Info</th>
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-center">Qty / Batch</th>
                    <th className="px-12 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] text-right">Status</th>
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
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Ref: {row.id} {row.reason ? `| ${row.reason}` : ''}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-12 py-8 text-center">
                        <span className="font-black text-black text-lg tracking-tighter">{row.qty}</span>
                      </td>
                      <td className="px-12 py-8 text-right">
                        <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
                            row.status === 'Waste' ? 'bg-red-600 text-white' : 'bg-black text-white'
                        }`}>
                          {row.status}
                        </span>
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

// Simple internal icon for the cards
function PlusCircleIcon({size}: {size: number}) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
        </svg>
    );
}