'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Scale,
  ChefHat,
  Search,
  TrendingUp,
  AlertCircle,
  Package,
  History,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function FinanceProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'measured' | 'baked'>('measured');
  const [isLoading, setIsLoading] = useState(false);

  // --- MOCK DATA (Fallback if API fails) ---
  const [measuredProducts, setMeasuredProducts] = useState<any[]>([
    { id: 1, name: 'Wheat Flour', stock: '450 kg', status: 'Healthy', branch: 'Kabuga', value: '450,000 Frw' },
    { id: 2, name: 'Sugar', stock: '12 kg', status: 'Low Stock', branch: 'Masaka', value: '18,000 Frw' },
    { id: 3, name: 'Baking Powder', stock: '5 kg', status: 'Healthy', branch: 'Kabuga', value: '25,000 Frw' },
  ]);

  const [bakedProducts, setBakedProducts] = useState<any[]>([
    { id: 1, name: 'White Bread', daily: '500 pcs', sold: '480', loss: '2', branch: 'Kabuga' },
    { id: 2, name: 'Milk Bread', daily: '200 pcs', sold: '195', loss: '5', branch: 'Masaka' },
    { id: 3, name: 'Tea Scones', daily: '300 pcs', sold: '290', loss: '0', branch: 'Kabuga' },
  ]);

  // --- BACKEND API INTEGRATION: FETCH INVENTORY ---
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    try {
      if (activeTab === 'measured') {
        const res = await fetch(`${baseUrl}/finance/inventory/measured`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const formattedData = data.map((item: any) => ({
            ...item,
            value: typeof item.value === 'number' ? `${item.value.toLocaleString()} Frw` : item.value,
          }));
          setMeasuredProducts(formattedData);
        }
      } else {
        const res = await fetch(`${baseUrl}/finance/inventory/baked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBakedProducts(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product inventory data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [activeTab, router]);

  // --- NEW: PUT /api/finance/products/{id} (EDIT) ---
  const handleEditProduct = async (id: number, currentName: string) => {
    const newPriceStr = prompt(`Enter new Selling Price for ${currentName}:`);
    if (!newPriceStr) return;
    const newCostStr = prompt(`Enter new Production Cost for ${currentName}:`);
    if (!newCostStr) return;

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    try {
      const response = await fetch(`${baseUrl}/finance/products/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: Number(newPriceStr),
          cost: Number(newCostStr),
        }),
      });

      if (response.ok) {
        alert('Product pricing updated successfully!');
        fetchData();
      } else {
        alert('Failed to update product pricing.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- NEW: DELETE /api/finance/products/{id} (DELETE) ---
  const handleDeleteProduct = async (id: number, currentName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${currentName}" from the catalog?`)) return;

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

    try {
      const response = await fetch(`${baseUrl}/finance/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 204) {
        if (activeTab === 'measured') {
          setMeasuredProducts((prev) => prev.filter((p) => p.id !== id));
        } else {
          setBakedProducts((prev) => prev.filter((p) => p.id !== id));
        }
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- FILTER OUT PRODUCTS WITH ZERO QUANTITY ---
  const filteredMeasured = measuredProducts.filter((p) => {
    const match = p.stock?.match(/^(\d+)/);
    const quantity = match ? parseInt(match[1], 10) : 0;
    return quantity > 0;
  });

  const filteredBaked = bakedProducts.filter((p) => {
    const match = p.daily?.match(/^(\d+)/);
    const quantity = match ? parseInt(match[1], 10) : 0;
    return quantity > 0;
  });

  return (
    <div className="space-y-8 pb-10 relative">
      {/* BACK BUTTON & TITLE */}
      <div className="flex items-center gap-4 md:gap-6 px-4 md:px-0 pt-6">
        <button
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#5D4037] uppercase tracking-tight">
            Product Inventory
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Chief of Finance Tracking
          </p>
        </div>
      </div>

      {/* SWITCHER TOGGLE */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-full max-w-md mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab('measured')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'measured' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-400'
          }`}
        >
          <Scale size={16} /> Measured
        </button>
        <button
          onClick={() => setActiveTab('baked')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'baked' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-400'
          }`}
        >
          <ChefHat size={16} /> Baked
        </button>
      </div>

      {/* CONTENT SECTION */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${activeTab === 'measured' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}
            >
              {activeTab === 'measured' ? <Package size={20} /> : <TrendingUp size={20} />}
            </div>
            <h2 className="font-black text-[#5D4037] uppercase text-sm tracking-widest">
              {activeTab === 'measured' ? 'Measured Items Tracking' : 'Baked Goods Performance'}
            </h2>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#5D4037] w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400">
              {activeTab === 'measured' ? (
                <tr>
                  <th className="px-8 py-4">Item Name</th>
                  <th className="px-8 py-4 text-center">In Stock</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4">Branch</th>
                  <th className="px-8 py-4 text-right">Value (Frw)</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4 text-center">Produced</th>
                  <th className="px-8 py-4 text-center">Sold</th>
                  <th className="px-8 py-4 text-center">Damages</th>
                  <th className="px-8 py-4 text-right">Location</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeTab === 'measured'
                ? filteredMeasured.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5 font-bold text-[#5D4037] uppercase text-sm">
                        {p.name}
                      </td>
                      <td className="px-8 py-5 text-center font-black text-gray-800">
                        {isLoading ? '...' : p.stock}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'Healthy' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-400 font-bold text-xs uppercase">
                        {p.branch}
                      </td>
                      <td className="px-8 py-5 text-right font-black text-[#5D4037]">
                        {p.value}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditProduct(p.id, p.name)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : filteredBaked.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5 font-bold text-[#5D4037] uppercase text-sm">
                        {p.name}
                      </td>
                      <td className="px-8 py-5 text-center font-bold text-gray-500">
                        {isLoading ? '...' : p.daily}
                      </td>
                      <td className="px-8 py-5 text-center font-black text-green-600">
                        {isLoading ? '...' : p.sold}
                      </td>
                      <td className="px-8 py-5 text-center font-black text-red-500">
                        {isLoading ? '...' : p.loss}
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-gray-400 text-xs uppercase">
                        {p.branch}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditProduct(p.id, p.name)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY FOOTER */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
          <History size={16} className="text-gray-400" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Last update: Today at 2:30 PM • Ishingiro Shop Real-time Sync
          </p>
        </div>
      </div>
    </div>
  );
}