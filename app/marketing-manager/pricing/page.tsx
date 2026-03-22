'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Search, ChevronDown, ChevronUp, Edit2, X, Check, ArrowDownCircle } from 'lucide-react';

export default function MarketingPricingPage() {
  
  // --- 1. FULL DATA LIST ---
  const defaultProducts = [
    // BREAD
    { name: 'big milk', price: 1300, category: 'BREAD' },
    { name: 'small milk', price: 600, category: 'BREAD' },
    { name: 'pcpn', price: 1100, category: 'BREAD' },
    { name: 'sen', price: 1000, category: 'BREAD' },
    { name: 'salted bread', price: 1100, category: 'BREAD' },
    { name: 'baguette', price: 500, category: 'BREAD' },
    { name: 'milk slice bread', price: 200, category: 'BREAD' },
    { name: 'crubes', price: 1300, category: 'BREAD' },
    { name: 'sen pieces', price: 100, category: 'BREAD' },
    { name: 'brown sanduich', price: 250, category: 'BREAD' },
    { name: 'mult graine', price: 1300, category: 'BREAD' },
    { name: 'milk mult graine', price: 1000, category: 'BREAD' },
    { name: 'brown bread', price: 800, category: 'BREAD' },
 
    // CAKES
    { name: 'tea cake', price: 1000, category: 'CAKES' },
    { name: 'marble cake', price: 1200, category: 'CAKES' },
    { name: 'brown cake', price: 250, category: 'CAKES' },
    { name: 'oliver corn cake', price: 350, category: 'CAKES' },
    { name: 'muffin cake', price: 170, category: 'CAKES' },

    // AMANDAZI
    { name: 'ishingiro', price: 150, category: 'AMANDAZI' },
    { name: 's.begne', price: 70, category: 'AMANDAZI' },
    { name: 'dark donut', price: 450, category: 'AMANDAZI' },
    { name: 'choc donuts', price: 450, category: 'AMANDAZI' },
    { name: 'kk donuts', price: 250, category: 'AMANDAZI' },
    { name: 'triangle', price: 150, category: 'AMANDAZI' },

    // OTHERS
    { name: 'meat samosa', price: 450, category: 'OTHERS' },
    { name: 'biscuits', price: 85, category: 'OTHERS' },
    { name: 'ISH.MILK Cookie', price: 130, category: 'OTHERS' },
    { name: 'butter biscuits', price: 130, category: 'OTHERS' },
    { name: 'chocolate biscuits', price: 140, category: 'OTHERS' },
    { name: 'ikinyuranyo 1kg', price: 1600, category: 'OTHERS' },
    { name: 'ikinyuranyo 3kg', price: 4500, category: 'OTHERS' },
    { name: 'ikinyuranyo 5kg', price: 7500, category: 'OTHERS' },
    { name: 'ikinyuranyo (0.5)kg', price: 1200, category: 'OTHERS' },
    { name: 'ubunyobwa', price: 1800, category: 'OTHERS' },
    { name: 'yellow c flour 1kg', price: 1700, category: 'OTHERS' },
    { name: 'yellow c flour 3kg', price: 4800, category: 'OTHERS' },
    { name: 'cashnewnuts', price: 5500, category: 'OTHERS' },
    { name: 'cornfresh cream', price: 500, category: 'OTHERS' },

    // BIG CAKES
    { name: 'cake 38000', price: 38000, category: 'BIG CAKES' },
    { name: 'cake 20000', price: 20000, category: 'BIG CAKES' },
    { name: 'cakes 24000', price: 24000, category: 'BIG CAKES' },
    { name: 'cake 19000', price: 19000, category: 'BIG CAKES' },
    { name: 'cake18000', price: 18000, category: 'BIG CAKES' },
    { name: 'cakes 15000', price: 15000, category: 'BIG CAKES' },
    { name: 'cakes 14000', price: 14000, category: 'BIG CAKES' },
    { name: 'cakes 13000', price: 13000, category: 'BIG CAKES' },
    { name: 'cake 12000', price: 12000, category: 'BIG CAKES' },
    { name: 'cakes 10000', price: 10000, category: 'BIG CAKES' },
    { name: 'cakes 9000', price: 9000, category: 'BIG CAKES' },
    { name: 'cakes 8000', price: 8000, category: 'BIG CAKES' },
    { name: 'cakes 7000', price: 7000, category: 'BIG CAKES' },
    { name: 'cakes 6000', price: 6000, category: 'BIG CAKES' },
    { name: 'cake 5000', price: 5000, category: 'BIG CAKES' },
    { name: 'ADDCAKE', price: 2000, category: 'BIG CAKES' },
  ];

  const categories = ['BREAD', 'CAKES', 'AMANDAZI', 'OTHERS', 'BIG CAKES'];

  // --- STATE ---
  const [products, setProducts] = useState(defaultProducts);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'BREAD' });
  const [search, setSearch] = useState('');
  
  // All open by default
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'BREAD': true, 'CAKES': true, 'AMANDAZI': true, 'OTHERS': true, 'BIG CAKES': true
  });

  const [editingName, setEditingName] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });

  // Load Data
  useEffect(() => {
    const saved = localStorage.getItem('sellingPrices_FINAL_FIX'); 
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) setProducts(parsed);
        else setProducts(defaultProducts);
      } catch (e) { setProducts(defaultProducts); }
    } else {
      localStorage.setItem('sellingPrices_FINAL_FIX', JSON.stringify(defaultProducts));
    }
  }, []);

  const saveToSystem = (updatedProducts: any[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('sellingPrices_FINAL_FIX', JSON.stringify(updatedProducts));
  };

  // --- QUICK NAVIGATION SCROLL ---
  const scrollToCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: true }));
    setTimeout(() => {
      const element = document.getElementById(`cat-${cat}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Toggle Logic
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // CRUD
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    // --- SPECIAL ADDCAKE LOGIC ---
    if (newItem.name.toUpperCase().includes('ADDCAKE')) {
       // Just an extra alert to remind them about the price
       alert("⚠️ Please double-check: Have you entered the correct custom price for this ADDCAKE?");
    }

    if (products.some(p => p.name.toLowerCase() === newItem.name.toLowerCase())) {
      alert('Product name already exists!'); return;
    }
    const updated = [{ 
      name: newItem.name, price: Number(newItem.price), category: newItem.category
    }, ...products];
    saveToSystem(updated);
    setNewItem({ name: '', price: '', category: 'BREAD' });
    scrollToCategory(newItem.category);
  };

  const startEdit = (item: any) => {
    setEditingName(item.name);
    setEditForm({ name: item.name, price: item.price.toString() });
  };

  const saveEdit = () => {
    if (!editForm.name || !editForm.price) return;
    const updated = products.map(p => {
      if (p.name === editingName) {
        return { ...p, name: editForm.name, price: Number(editForm.price) };
      }
      return p;
    });
    saveToSystem(updated);
    setEditingName(null);
  };

  const deleteItem = (name: string) => {
    if(confirm('Delete this item?')) {
      const updated = products.filter(p => p.name !== name);
      saveToSystem(updated);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* --- MOBILE RESPONSIVE LOGO HEADER --- */}
      
<div className="md:hidden w-full bg-white border-b border-gray-100 px-6 py-6 flex flex-col items-center bg-white/95">
        
        <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mb-4">
          <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>

        <div className="text-center mb-2">
          <h2 className="text-[#5D4037] font-black uppercase tracking-[0.25em] text-sm">Ishingiro</h2>
        </div>

      
      </div>

      {/* Desktop Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#5D4037] hidden md:block">Pricing Strategy (Admin)</h1>
          <p className="text-gray-500 text-sm hidden md:block">Manage official selling prices.</p>
        </div>
      </div>

      {/* --- QUICK NAVIGATION CHIPS --- */}
      <div className="flex flex-wrap gap-2 sticky top-16 md:top-0 z-30 bg-[#FDFDFD] py-4 border-b border-gray-100">
         <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-2">
           <ArrowDownCircle size={14} /> Jump to:
         </span>
         {categories.map(cat => (
           <button 
             key={cat}
             onClick={() => scrollToCategory(cat)}
             className="px-4 py-2 bg-[#EBE0CC] text-[#5D4037] text-xs font-black rounded-full hover:bg-[#5D4037] hover:text-white transition-all shadow-sm active:scale-95"
           >
             {cat}
           </button>
         ))}
      </div>

      {/* Add Form */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#5D4037] uppercase mb-4 flex items-center gap-2">
          <Plus size={16} /> Add New Product
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-48">
             <label className="text-xs font-bold text-gray-400 ml-1">Category</label>
             <div className="relative">
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full appearance-none bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-[#5D4037] text-sm focus:outline-[#A67C37]">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
             </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-400 ml-1">Product Name</label>
            <input type="text" placeholder="e.g. New Bread" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-[#5D4037] text-sm focus:outline-[#A67C37]" />
          </div>
          <div className="w-full md:w-32">
            <label className="text-xs font-bold text-gray-400 ml-1">Price</label>
            <input type="number" placeholder="0" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-[#5D4037] text-sm focus:outline-[#A67C37]" />
          </div>
          
          {/* --- SAVE BUTTON WITH LABEL --- */}
          <button 
            type="submit" 
            className="h-[50px] px-6 bg-[#5D4037] text-white rounded-2xl hover:bg-[#4a332a] transition-all shadow-lg shadow-[#5D4037]/20 flex items-center justify-center gap-2 active:scale-95"
            title="Save New Product"
          > 
            <Save size={20} />
            <span className="font-bold text-sm">Save</span>
          </button>

        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-[32px] shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
        
        {/* Search */}
        <div className="p-4 border-b border-gray-50 bg-white sticky top-0 z-20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#EBE0CC]/20 pl-12 pr-4 py-3 rounded-xl text-sm font-bold text-[#5D4037] placeholder:text-gray-400 focus:outline-none" />
          </div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-50">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase()));
                if (products.filter(p => p.category === category).length === 0) return null;
                const isOpen = expandedCategories[category] || search.length > 0;

                return (
                  <React.Fragment key={category}>
                    {/* CATEGORY HEADER */}
                    <tr 
                      id={`cat-${category}`}
                      onClick={() => toggleCategory(category)}
                      className="bg-[#EBE0CC]/40 cursor-pointer hover:bg-[#EBE0CC]/60 transition-colors select-none scroll-mt-32" 
                    >
                      <td colSpan={4} className="px-6 py-4 border-y border-[#EBE0CC]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#5D4037] uppercase tracking-widest flex items-center gap-2">
                             {category} 
                             <span className="bg-[#5D4037] text-white text-[10px] px-2 py-0.5 rounded-full">{categoryProducts.length}</span>
                          </span>
                          {isOpen ? <ChevronUp size={16} className="text-[#5D4037]" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                      </td>
                    </tr>
                    
                    {isOpen && categoryProducts.map((item) => {
                      const isEditing = editingName === item.name;
                      return (
                        <tr key={item.name} className={`group transition-colors ${isEditing ? 'bg-[#EBE0CC]/20' : 'hover:bg-gray-50'}`}>
                          {isEditing ? (
                            <>
                              <td className="px-6 py-4" colSpan={2}>
                                <input autoFocus type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-white border border-[#A67C37] p-2 rounded-lg text-sm font-bold text-[#5D4037] focus:outline-none" />
                              </td>
                              <td className="px-6 py-4">
                                <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} className="w-full bg-white border border-[#A67C37] p-2 rounded-lg text-sm font-bold text-[#5D4037] focus:outline-none" />
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><Check size={16} /></button>
                                <button onClick={() => setEditingName(null)} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"><X size={16} /></button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 font-bold text-[#5D4037] text-sm pl-10 border-l-4 border-transparent hover:border-[#A67C37] w-1/2 cursor-default">{item.name}</td>
                              <td className="px-6 py-4 font-black text-[#A67C37] text-sm cursor-default">{item.price.toLocaleString()} RWF</td>
                              <td className="px-1"></td> 
                              <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); startEdit(item); }} className="text-gray-400 hover:text-[#5D4037] p-2 hover:bg-[#EBE0CC]/30 rounded-lg"><Edit2 size={16} /></button>
                                <button onClick={(e) => { e.stopPropagation(); deleteItem(item.name); }} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
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