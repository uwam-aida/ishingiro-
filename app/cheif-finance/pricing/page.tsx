
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Save, Plus, Trash2, Search, ChevronDown, ChevronUp, Edit2, X, Check, ArrowDownCircle, ArrowLeft } from 'lucide-react'; 

// --- INTERFACE ---
interface Product {
  id?: number; 
  name: string;
  price: number;
  category: string;
  type: string;
}

const defaultProducts: Product[] = [ 
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

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'BREAD', type: 'baked' });
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    'BREAD': true, 'CAKES': true, 'AMANDAZI': true, 'OTHERS': true, 'BIG CAKES': true
  });

  const [editingName, setEditingName] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', type: 'baked' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const fetchProducts = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
        const response = await fetch(`${baseUrl}/products`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((p: any) => ({ ...p, category: p.category ? p.category.toUpperCase() : 'OTHERS' }));
          setProducts(formattedData.length > 0 ? formattedData : defaultProducts);
        }
      } catch (error) { console.error("Failed to load products", error); }
    };
    fetchProducts();
  }, [router]);

  const scrollToCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: true }));
    setTimeout(() => { const element = document.getElementById(`cat-${cat}`); if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const toggleCategory = (cat: string) => { setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] })); };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    
    try {
        const response = await fetch(`${baseUrl}/finance/products`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: newItem.name,
        price: Number(newItem.price),
        category: newItem.category, // <-- Fix 1: Removed .toLowerCase()
        type: newItem.type,
        
        cost: 0,
        stock: 0,
        quantity: 0,
        description: "New product"
    })
});

        if (response.ok) {
            const addedProduct = await response.json();
            setProducts([addedProduct, ...products]);
            setNewItem({ name: '', price: '', category: 'BREAD', type: 'baked' });
            scrollToCategory(newItem.category);
        }
    } catch (e) { console.error(e); }
  };

  const startEdit = (item: any) => {
    setEditingName(item.name);
    setEditForm({ name: item.name, price: item.price.toString(), type: item.type || 'baked' });
  };

  const saveEdit = async () => {
    const itemToEdit = products.find(p => p.name === editingName);
    if (!itemToEdit || !itemToEdit.id) return;

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    try {
        const response = await fetch(`${baseUrl}/finance/products/${itemToEdit.id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: Number(editForm.price), name: editForm.name, type: editForm.type })
        });

        if (response.ok) {
            const updated = products.map(p => p.id === itemToEdit.id ? { ...p, name: editForm.name, price: Number(editForm.price), type: editForm.type } : p);
            setProducts(updated);
            setEditingName(null);
        }
    } catch (e) { console.error(e); }
  };

  const deleteItem = async (name: string) => {
    if(confirm('Delete this item?')) {
      const itemToDelete = products.find(p => p.name === name);
      if (itemToDelete && itemToDelete.id) {
          const token = localStorage.getItem('token');
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
          await fetch(`${baseUrl}/finance/products/${itemToDelete.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      }
      setProducts(products.filter(p => p.name !== name));
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 px-4 pt-6">
        <button onClick={() => router.back()} className="p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm"><ArrowLeft size={22} /></button>
        <h1 className="text-2xl font-black text-[#5D4037] uppercase">Pricing Strategy</h1>
      </div>

      {/* ADD PRODUCT FORM */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#5D4037] uppercase mb-4 flex items-center gap-2">
            <Plus size={16} /> Add Product
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Category</label>
            <select 
              value={newItem.category} 
              onChange={e => setNewItem({...newItem, category: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm focus:border-[#5D4037] outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Product Name</label>
            <input 
              type="text" 
              placeholder="e.g. Baguette"
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm focus:border-[#5D4037] outline-none" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Price (Sell)</label>
            <input 
              type="number" 
              placeholder="0"
              value={newItem.price} 
              onChange={e => setNewItem({...newItem, price: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-bold text-sm focus:border-[#5D4037] outline-none" 
            />
          </div>
          <button 
            type="submit" 
            className="h-[48px] bg-[#5D4037] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#4a332c] transition-all active:scale-[0.98]"
          >
            <Save size={18}/> Save Product
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-white"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#EBE0CC]/20 pl-12 pr-4 py-3 rounded-xl text-sm font-bold" /></div></div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-50">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category && p.name.toLowerCase().includes(search.toLowerCase()));
                if (categoryProducts.length === 0) return null;
                const isOpen = expandedCategories[category] || search.length > 0;
                return (
                  <React.Fragment key={category}>
                    <tr onClick={() => toggleCategory(category)} className="bg-[#EBE0CC]/40 cursor-pointer" id={`cat-${category}`}>
                      <td colSpan={3} className="px-6 py-4 font-black text-[#5D4037] text-xs uppercase tracking-widest">{category}</td>
                    </tr>
                    {isOpen && categoryProducts.map((item) => (
                      <tr key={item.name} className="hover:bg-gray-50 group">
                        {editingName === item.name ? (
                          <>
                            <td className="px-6 py-4"><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-white border p-2 rounded-lg text-sm font-bold" /></td>
                            <td className="px-6 py-4"><input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="bg-white border p-2 rounded-lg text-sm font-bold" /></td>
                            <td className="px-6 py-4 text-right"><button onClick={saveEdit} className="p-2 bg-green-500 text-white rounded-lg"><Check size={16}/></button></td>
                          </>
                        ) : (
                          <>
                            <td className="px-10 py-6 font-bold text-[#5D4037]">{item.name}</td>
                            <td className="px-6 py-6 font-black text-[#A67C37]">{item.price.toLocaleString()} RWF</td>
                            <td className="px-6 py-6 text-right opacity-0 group-hover:opacity-100"><button onClick={() => startEdit(item)} className="p-2 hover:bg-[#EBE0CC] rounded-lg"><Edit2 size={16}/></button><button onClick={() => deleteItem(item.name)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16}/></button></td>
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

