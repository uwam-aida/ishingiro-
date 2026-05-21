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
  Clock,
  CheckCircle2,
  Scale,
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  cost?: number;
  category: string;
  type: string;
}

interface GridRow {
  id: string;
  item: string;
  qty: string;
  time: string;
  status: string;
  reason?: string;
  location?: string;
}

export default function BakerDashboard() {
  const router = useRouter();

  const [currentView, setCurrentView] = useState('Dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [bakedProducts, setBakedProducts] = useState<any[]>([]);
  const [damagedItems, setDamagedItems] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [realProducts, setRealProducts] = useState<Product[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState<
    'production' | 'damage' | 'ingredient' | null
  >(null);

  // Form states
  const [formProduct, setFormProduct] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formUnit, setFormUnit] = useState('kg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Success states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://ishingiro-m4th.onrender.com/api';

  // Fetch all baker data
  const fetchBakerData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    setIsLoading(true);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // Fetch production history
      const prodRes = await fetch(`${baseUrl}/baker/production`, {
        headers,
      });

      if (prodRes.ok) {
        setBakedProducts(await prodRes.json());
      }

      // Fetch damage history
      const damRes = await fetch(`${baseUrl}/baker/damage`, {
        headers,
      });

      if (damRes.ok) {
        setDamagedItems(await damRes.json());
      }

      // Fetch ingredients
      const ingRes = await fetch(`${baseUrl}/baker/ingredients`, {
        headers,
      });

      if (ingRes.ok) {
        setIngredients(await ingRes.json());
      }

      // Fetch products
      const productsRes = await fetch(`${baseUrl}/products`, {
        headers,
      });

      if (productsRes.ok) {
        setRealProducts(await productsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch baker data:', error);
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

    fetchBakerData();

    const interval = setInterval(fetchBakerData, 30000);

    return () => clearInterval(interval);
  }, [router]);

  // Product suggestions
  const filteredProducts = realProducts.filter((p) =>
    p.name.toLowerCase().includes(formProduct.toLowerCase())
  );

  // Submit handler
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      if (showModal === 'ingredient') {
        const response = await fetch(`${baseUrl}/baker/ingredients`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: formProduct,
            quantity: parseInt(formQty),
            unit: formUnit,
          }),
        });

        if (response.ok) {
          setSuccessMessage(
            `Ingredient "${formProduct}" added successfully!`
          );

          setShowSuccess(true);

          setTimeout(() => setShowSuccess(false), 3000);

          await fetchBakerData();
        } else {
          const error = await response.json();

          alert(
            `Failed to add ingredient: ${
              error.message || 'Unknown error'
            }`
          );
        }
      } else {
        const realDbProduct = realProducts.find(
          (p) =>
            p.name.toLowerCase() === formProduct.toLowerCase()
        );

        const dbProductId = realDbProduct?.id || 1;

        if (showModal === 'production') {
          const response = await fetch(
            `${baseUrl}/baker/production`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                product_id: dbProductId,
                quantity: parseInt(formQty),
                location: 'kabuga',
              }),
            }
          );

          if (response.ok) {
            setSuccessMessage(
              `Production batch of ${formQty} units recorded!`
            );

            setShowSuccess(true);

            setTimeout(() => setShowSuccess(false), 3000);

            await fetchBakerData();
          } else {
            const error = await response.json();

            alert(
              `Failed to record production: ${
                error.message || 'Unknown error'
              }`
            );
          }
        }

        if (showModal === 'damage') {
          const response = await fetch(
            `${baseUrl}/baker/damage`,
            {
              method: 'POST',
              headers,
              body: JSON.stringify({
                product_id: dbProductId,
                quantity: parseInt(formQty),
                reason: formReason,
                location: 'kabuga',
              }),
            }
          );

          if (response.ok) {
            setSuccessMessage(
              `Damage of ${formQty} units reported!`
            );

            setShowSuccess(true);

            setTimeout(() => setShowSuccess(false), 3000);

            await fetchBakerData();
          } else {
            const error = await response.json();

            alert(
              `Failed to report damage: ${
                error.message || 'Unknown error'
              }`
            );
          }
        }
      }

      // Reset form
      setShowModal(null);
      setFormProduct('');
      setFormQty('');
      setFormReason('');
      setFormUnit('kg');
    } catch (error) {
      console.error('Submission failed', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dashboard stats
  const stats = [
    {
      label: 'Baked Products',
      value: bakedProducts.length.toString(),
      icon: ChefHat,
      color: 'bg-orange-50 text-[#F57C00]',
      onClick: () => setCurrentView('Baked Products'),
    },
    {
      label: 'Damaged Items',
      value: damagedItems.length.toString(),
      icon: Trash2,
      color: 'bg-red-50 text-red-600',
      onClick: () => setCurrentView('Damaged Items'),
    },
    {
      label: 'Ingredients',
      value: ingredients.length.toString(),
      icon: Scale,
      color: 'bg-green-50 text-green-600',
      onClick: () => setCurrentView('Ingredients'),
    },
    {
      label: 'Full History',
      value: (
        bakedProducts.length + damagedItems.length
      ).toString(),
      icon: History,
      color: 'bg-gray-100 text-black',
      onClick: () => setCurrentView('Full History'),
    },
  ];

  // Grid data
  const getGridData = (): GridRow[] => {
    switch (currentView) {
      case 'Baked Products':
        return bakedProducts.map((p) => ({
          id: `BK-${p.id}`,
          item: p.product?.name || `Product #${p.product_id}`,
          qty: `${p.quantity} pcs`,
          time: new Date(p.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'In Stock',
          location: p.location,
        }));

      case 'Damaged Items':
        return damagedItems.map((d) => ({
          id: `DM-${d.id}`,
          item: d.product?.name || `Product #${d.product_id}`,
          qty: `${d.quantity} pcs`,
          reason: d.reason,
          time: new Date(d.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'Waste',
        }));

      case 'Ingredients':
        return ingredients.map((i) => ({
          id: `IN-${i.id}`,
          item: i.name,
          qty: `${i.quantity} ${i.unit}`,
          status:
            i.quantity > 50
              ? 'Healthy'
              : i.quantity > 10
              ? 'Medium'
              : 'Low Stock',
          time: 'Current',
        }));

      case 'Full History':
        const combined = [
          ...bakedProducts,
          ...damagedItems,
        ].sort((a, b) => b.id - a.id);

        return combined.map((log) => ({
          id: `LOG-${log.id}`,
          item:
            log.product?.name ||
            `Product #${log.product_id}`,
          qty: `${log.quantity} pcs`,
          time: new Date(
            log.created_at
          ).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: log.reason ? 'Waste' : 'Verified',
        }));

      default:
        return [];
    }
  };

  const currentData = getGridData();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 px-4 pt-4 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-green-50 text-green-700 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-green-200">
            <CheckCircle2
              className="text-green-600"
              size={20}
            />

            <span className="font-black uppercase text-xs tracking-widest">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black uppercase mb-6 text-[#F57C00]">
              {showModal === 'production'
                ? 'Log Production Batch'
                : showModal === 'damage'
                ? 'Report Damage'
                : 'Add Ingredient Supply'}
            </h2>

            <form
              onSubmit={handlePostSubmit}
              className="space-y-4"
            >
              {/* Product */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {showModal === 'ingredient'
                    ? 'Ingredient Name'
                    : 'Product Name'}
                </label>

                <input
                  required
                  type="text"
                  value={formProduct}
                  onChange={(e) => {
                    setFormProduct(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]"
                />

                {showSuggestions &&
                  formProduct &&
                  filteredProducts.length > 0 &&
                  showModal !== 'ingredient' && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                      {filteredProducts.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setFormProduct(p.name);
                            setShowSuggestions(false);
                          }}
                          className="px-5 py-3 hover:bg-orange-50 cursor-pointer text-sm font-bold text-gray-700 uppercase transition-colors"
                        >
                          {p.name}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Quantity
                </label>

                <input
                  required
                  type="number"
                  value={formQty}
                  onChange={(e) =>
                    setFormQty(e.target.value)
                  }
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]"
                />
              </div>

              {/* Unit */}
              {showModal === 'ingredient' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Unit
                  </label>

                  <input
                    required
                    type="text"
                    value={formUnit}
                    onChange={(e) =>
                      setFormUnit(e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]"
                  />
                </div>
              )}

              {/* Reason */}
              {showModal === 'damage' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Reason
                  </label>

                  <input
                    required
                    type="text"
                    value={formReason}
                    onChange={(e) =>
                      setFormReason(e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold outline-none focus:border-[#F57C00]"
                  />
                </div>
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-black text-white font-black uppercase tracking-widest py-4 rounded-2xl mt-4"
              >
                {isSubmitting
                  ? 'Processing...'
                  : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {currentView === 'Dashboard' ? (
        <>
          <div className="mb-8">
            <h1 className="text-4xl font-black text-black uppercase">
              Baker Assistant
            </h1>

            <p className="text-[#F57C00] font-black uppercase text-[10px] tracking-[0.3em] mt-1">
              Ishingiro Production Management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <button
                key={index}
                onClick={stat.onClick}
                className="bg-white p-10 rounded-[48px] shadow-sm hover:shadow-xl transition-all text-left"
              >
                <div
                  className={`w-16 h-16 rounded-3xl ${stat.color} flex items-center justify-center mb-8`}
                >
                  <stat.icon size={32} />
                </div>

                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">
                  {stat.label}
                </p>

                <h3 className="text-5xl font-black text-black tracking-tighter mt-2">
                  {isLoading ? '...' : stat.value}
                </h3>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() =>
              setCurrentView('Dashboard')
            }
            className="flex items-center gap-3 text-black font-black uppercase text-[10px] tracking-[0.2em] mb-10"
          >
            <ArrowLeft size={16} />
            Back to Overview
          </button>

          <div className="bg-white rounded-[56px] border border-gray-100 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-4xl font-black text-black uppercase">
                  {currentView}
                </h2>

                <p className="text-[#F57C00] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  Current Records
                </p>
              </div>

              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="SEARCH..."
                  className="w-full pl-14 pr-8 py-4 bg-gray-50 border-none rounded-3xl outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-12 py-6">
                      Product Info
                    </th>

                    <th className="px-12 py-6 text-center">
                      Qty / Batch
                    </th>

                    <th className="px-12 py-6 text-center">
                      Time
                    </th>

                    <th className="px-12 py-6 text-right">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {currentData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-orange-50/20 transition-colors"
                    >
                      <td className="px-12 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-black">
                            <Package size={22} />
                          </div>

                          <div>
                            <p className="font-black text-black uppercase text-sm tracking-tight">
                              {row.item}
                            </p>

                            {row.reason && (
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                Reason: {row.reason}
                              </p>
                            )}

                            {row.location && (
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                Location: {row.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-12 py-8 text-center">
                        <span className="font-black text-black text-lg tracking-tighter">
                          {row.qty}
                        </span>
                      </td>

                      <td className="px-12 py-8 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Clock
                            size={12}
                            className="text-gray-400"
                          />

                          <span className="text-xs text-gray-500">
                            {row.time}
                          </span>
                        </div>
                      </td>

                      <td className="px-12 py-8 text-right">
                        <span
                          className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${
                            row.status === 'Waste'
                              ? 'bg-red-600 text-white'
                              : row.status ===
                                'Low Stock'
                              ? 'bg-red-500 text-white'
                              : row.status ===
                                'Medium'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-black text-white'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {currentData.length === 0 &&
              !isLoading && (
                <div className="p-32 text-center uppercase font-black text-gray-200 text-xl tracking-[0.5em]">
                  No Data
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}