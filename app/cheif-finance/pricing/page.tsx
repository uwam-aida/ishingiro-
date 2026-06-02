'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Save, Plus, Trash2, Search, ChevronDown, ChevronUp, Edit2, X, Check, ArrowDownCircle, AlertTriangle, ArrowLeft } from 'lucide-react'; 

// --- MOVE INTERFACE AND DATA TO THE TOP (OUTSIDE THE FUNCTION) ---
interface Product {
  id?: number; 
  name: string;
  price: number;
  category: string;
  type: string;
  cost?: number; 
}

export const defaultProducts: Product[] = [ 
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
];

export default function FinancePricingPage() {
  const router = useRouter(); 

  const categories = ['BREAD', 'CAKES', 'AMANDAZI', 'OTHERS', 'BIG CAKES'];
  const unbakedItems = ['ikinyuranyo', 'flour', 'cashnewnuts', 'cornfresh'];

  // --- STATE ---
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  // ✅ ADDED `cost` to newItem state
  const [newItem, setNewItem] = useState({ name: '', price: '', cost: '', category: 'BREAD', type: 'baked' });
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'BREAD': true, 'CAKES': true, 'AMANDAZI': true, 'OTHERS': true, 'BIG CAKES': true
  });

  const [editingName, setEditingName] = useState<string | null>(null);
  // ✅ ADDED `cost` to editForm state
  const [editForm, setEditForm] = useState({ name: '', price: '', cost: '', type: 'baked' });

  // --- 1. LOAD DATA FROM API ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        router.push('/login');
        return;
    }

    const fetchProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
        const response = await fetch(`${baseUrl}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // Map backend categories to match UI uppercase categories
          const formattedData = data.map((p: any) => ({
             ...p,
             category: p.category ? p.category.toUpperCase() : 'OTHERS'
          }));
          setProducts(formattedData.length > 0 ? formattedData : defaultProducts);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };

    fetchProducts();
  }, [router]);

  const scrollToCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: true }));
    setTimeout(() => {
      const element = document.getElementById(`cat-${cat}`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // --- VALIDATION LOGIC ---
  const validateProductType = (name: string, type: string) => {
    const isActuallyUnbaked = unbakedItems.some(u => name.toLowerCase().includes(u));
    if (isActuallyUnbaked && type === 'baked') {
      alert(`❌ Error: ${name} is an UNBAKED product!`);
      return false;
    }
    return true;
  };

  // --- 2. CREATE (POST) API ---
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    if (!validateProductType(newItem.name, newItem.type)) return;
    if (products.some(p => p.name.toLowerCase() === newItem.name.toLowerCase())) {
      alert('Product name already exists!'); return;
    }

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    
    // ✅ Include the cost from the form
    const payload = {
        name: newItem.name,
        price: Number(newItem.price),
        cost: Number(newItem.cost) || 0, // Fallback to 0 if left blank
        category: newItem.category.toLowerCase(), 
        type: newItem.type
    };

    try {
        const response = await fetch(`${baseUrl}/finance/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const addedProduct = await response.json();
            addedProduct.category = addedProduct.category ? addedProduct.category.toUpperCase() : newItem.category;
            setProducts([addedProduct, ...products]);
            
            // ✅ Reset form, including cost
            setNewItem({ name: '', price: '', cost: '', category: 'BREAD', type: 'baked' });
            scrollToCategory(newItem.category);
        } else {
            alert("Failed to add product to database.");
        }
    } catch (e) {
        console.error(e);
    }
  };

  const startEdit = (item: any) => {
    setEditingName(item.name);
    // ✅ Load existing cost into edit form
    setEditForm({ name: item.name, price: item.price.toString(), cost: (item.cost || 0).toString(), type: item.type || 'baked' });
  };

  // --- 3. UPDATE (PUT) API ---
  const saveEdit = async () => {
    if (!editForm.name || !editForm.price) return;
    if (!validateProductType(editForm.name, editForm.type)) return;

    const itemToEdit = products.find(p => p.name === editingName);
    if (!itemToEdit) return;

    if (!itemToEdit.id) {
        const updated = products.map(p => p.name === editingName ? { ...p, name: editForm.name, price: Number(editForm.price), cost: Number(editForm.cost), type: editForm.type } : p);
        setProducts(updated);
        setEditingName(null);
        return;
    }

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    try {
        const response = await fetch(`${baseUrl}/finance/products/${itemToEdit.id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            // ✅ Send the updated cost
            body: JSON.stringify({ price: Number(editForm.price), cost: Number(editForm.cost), name: editForm.name, type: editForm.type })
        });

        if (response.ok) {
            const updated = products.map(p => p.id === itemToEdit.id ? { ...p, name: editForm.name, price: Number(editForm.price), cost: Number(editForm.cost), type: editForm.type } : p);
            setProducts(updated);
            setEditingName(null);
        } else {
            alert("Failed to update product in database.");
        }
    } catch (e) {
        console.error(e);
    }
  };

  // --- 4. DELETE API ---
  const deleteItem = async (name: string) => {
    if(confirm('Delete this item?')) {
      const itemToDelete = products.find(p => p.name === name);
      
      if (itemToDelete && itemToDelete.id) {
          const token = localStorage.getItem('token');
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
          try {
              await fetch(`${baseUrl}/finance/products/${itemToDelete.id}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${token}` }
              });
          } catch (e) { console.error(e); }
      }
      
      const updated = products.filter(p => p.name !== name);
      setProducts(updated);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* <-- BACK BUTTON & TITLE --> */}
      <div className="flex items-center gap-4 md:gap-6 px-4 md:px-0 pt-6">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        
        <h1 className="text-xl md:text-2xl font-black text-[#5D4037] uppercase tracking-tight">
          Pricing Strategy
        </h1>
      </div>

      {/* QUICK NAV */}
      <div className="flex flex-wrap gap-2 sticky top-16 md:top-0 z-30 bg-[#FDFDFD] py-4 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-2"><ArrowDownCircle size={14} /> Jump to:</span>
          {categories.map(cat => (
            <button key={cat} onClick={() => scrollToCategory(cat)} className="px-4 py-2 bg-[#EBE0CC] text-[#5D4037] text-xs font-black rounded-full hover:bg-[#5D4037] hover:text-white transition-all shadow-sm active:scale-95">{cat}</button>
          ))}
      </div>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#5D4037] uppercase mb-4 flex items-center gap-2"><Plus size={16} /> Add Product</h3>
        {/* ✅ Changed to md:grid-cols-6 to fit the new field */}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
              <label className="text-xs font-bold text-gray-400">Category</label>
              <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
          </div>
          <div className="md:col-span-1">
              <label className="text-xs font-bold text-gray-400">Product Name</label>
              <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm" />
          </div>
          <div>
              <label className="text-xs font-bold text-gray-400">Type</label>
              <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm">
                <option value="baked">Baked</option>
                <option value="unbaked">Unbaked</option>
              </select>
          </div>
          <div>
              <label className="text-xs font-bold text-gray-400">Price (Sell)</label>
              <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm" />
          </div>
          {/* ✅ Added Cost Input */}
          <div>
              <label className="text-xs font-bold text-gray-400">Cost (Make)</label>
              <input type="number" value={newItem.cost} onChange={e => setNewItem({...newItem, cost: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm" />
          </div>
          <button type="submit" className="h-[48px] bg-[#5D4037] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Save size={18}/> Save</button>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-white sticky top-0 z-20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#EBE0CC]/20 pl-12 pr-4 py-3 rounded-xl text-sm font-bold" />
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-50">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase()));
                if (products.filter(p => p.category === category).length === 0) return null;
                const isOpen = expandedCategories[category] || search.length > 0;

                return (
                  <React.Fragment key={category}>
                    <tr onClick={() => toggleCategory(category)} className="bg-[#EBE0CC]/40 cursor-pointer hover:bg-[#EBE0CC]/60 transition-colors" id={`cat-${category}`}>
                      <td colSpan={5} className="px-6 py-4"> {/* Increased colSpan */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#5D4037] uppercase tracking-widest">{category} ({categoryProducts.length})</span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </td>
                    </tr>
                    {isOpen && categoryProducts.map((item) => (
                      <tr key={item.name} className="hover:bg-gray-50 group">
                        {editingName === item.name ? (
                          <>
                            <td className="px-6 py-4" colSpan={2}>
                              <div className="flex gap-2">
                                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="flex-1 bg-white border border-[#A67C37] p-2 rounded-lg text-sm font-bold" />
                                <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="bg-white border border-[#A67C37] p-2 rounded-lg text-sm font-bold">
                                  <option value="baked">Baked</option>
                                  <option value="unbaked">Unbaked</option>
                                </select>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input type="number" placeholder="Price" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full bg-white border border-[#A67C37] p-2 rounded-lg text-sm font-bold" />
                            </td>
                            {/* ✅ Added Cost to Edit Row */}
                            <td className="px-6 py-4">
                              <input type="number" placeholder="Cost" value={editForm.cost} onChange={e => setEditForm({...editForm, cost: e.target.value})} className="w-full bg-white border border-[#A67C37] p-2 rounded-lg text-sm font-bold" />
                            </td>
                            <td className="px-6 py-4 text-right flex gap-2 justify-end">
                              <button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded-lg"><Check size={16}/></button>
                              <button onClick={() => setEditingName(null)} className="p-2 bg-gray-200 rounded-lg"><X size={16}/></button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 pl-10 w-1/3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#5D4037]">{item.name}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${item.type === 'unbaked' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{item.type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-black text-[#A67C37]">{item.price.toLocaleString()} RWF <span className="text-[10px] text-gray-400 font-normal ml-1">Sell</span></td>
                            {/* ✅ Display Cost next to Price */}
                            <td className="px-6 py-4 font-black text-gray-400">{(item.cost || 0).toLocaleString()} RWF <span className="text-[10px] text-gray-300 font-normal ml-1">Cost</span></td>
                            <td className="px-1"></td>
                            <td className="px-6 py-4 text-right flex gap-2 justify-end opacity-0 group-hover:opacity-100">
                              <button onClick={() => startEdit(item)} className="p-2 hover:bg-[#EBE0CC] rounded-lg text-gray-400 hover:text-[#5D4037]"><Edit2 size={16}/></button>
                              <button onClick={() => deleteItem(item.name)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}