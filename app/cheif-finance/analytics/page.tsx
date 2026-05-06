'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ShoppingCart,
  ArrowUpRight, 
  Minus,
  ChefHat,
  Store,
  ArrowDownRight,
  ArrowLeft 
} from 'lucide-react';

export default function FinanceAnalytics() {
  const router = useRouter(); 
  
  const [activeCategory, setActiveCategory] = useState<'sales' | 'production' | 'inventory' | 'damage'>('sales');
  
  // --- NEW: STATE FOR API DATA ---
  const [summary, setSummary] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for smooth scrolling
  const performanceRef = useRef<HTMLDivElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAnalytics = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        // 1. Fetch Summary Stats
        const summaryRes = await fetch(`${baseUrl}/finance/analytics/summary`, { headers });
        if (summaryRes.ok) setSummary(await summaryRes.json());

        // 2. Fetch Product Performance
        const perfRes = await fetch(`${baseUrl}/finance/analytics/performance`, { headers });
        if (perfRes.ok) setAllProducts(await perfRes.json());

        // 3. Fetch Recent Activities
        const actRes = await fetch(`${baseUrl}/finance/analytics/activities`, { headers });
        if (actRes.ok) setActivities(await actRes.json());

      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  // Function to handle grid clicks
  const handleCardClick = (category: 'sales' | 'production' | 'inventory' | 'damage') => {
    setActiveCategory(category);
    
    if (category === 'production' || category === 'damage') {
      setTimeout(() => activitiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      setTimeout(() => performanceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  // 2. TOP STATS (Wired to Summary API)
  const stats = [
    { 
      id: 'sales',
      label: 'Weekly Sales Volume', 
      value: summary?.sales?.value?.toLocaleString() || '0', 
      unit: 'Units sold',
      icon: TrendingUp, 
      trend: summary?.sales?.trend || '0%', 
      trendColor: 'text-emerald-600',
      bg: 'bg-emerald-50', 
      iconColor: 'text-emerald-600'
    },
    { 
      id: 'production',
      label: 'Currently Baking', 
      value: summary?.production?.value?.toLocaleString() || '0', 
      unit: 'Active products',
      icon: ChefHat, 
      trend: summary?.production?.trend || 'Stable', 
      trendColor: 'text-gray-500',
      bg: 'bg-orange-50', 
      iconColor: 'text-orange-600'
    },
    { 
      id: 'inventory',
      label: 'In the Shop', 
      value: summary?.inventory?.value?.toLocaleString() || '0', 
      unit: 'Items ready',
      icon: Store, 
      trend: summary?.inventory?.trend || '+0', 
      trendColor: 'text-emerald-600',
      bg: 'bg-blue-50', 
      iconColor: 'text-blue-600'
    },
    { 
      id: 'damage',
      label: 'Damaged / Waste', 
      value: summary?.damage?.value?.toLocaleString() || '0', 
      unit: 'Items lost',
      icon: AlertTriangle, 
      trend: summary?.damage?.trend || '+0', 
      trendColor: 'text-red-600',
      bg: 'bg-red-50', 
      iconColor: 'text-red-600'
    },
  ];

  // FILTER LOGIC
  const filteredActivities = activeCategory === 'sales' || activeCategory === 'inventory'
    ? activities 
    : activities.filter(a => a.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Business Analytics</h1>
          <p className="text-gray-500 mt-2 font-medium">Business growth and performance analysis</p>
        </div>
      </div>

      {/* --- INTERACTIVE STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => handleCardClick(stat.id as any)}
            className={`p-6 rounded-[24px] shadow-sm border transition-all cursor-pointer group hover:shadow-lg hover:-translate-y-1 ${
              activeCategory === stat.id 
              ? 'bg-gray-900 border-gray-900 ring-2 ring-offset-2 ring-gray-900' 
              : 'bg-white border-gray-100'
            }`}
          >
             <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl transition-colors ${
                  activeCategory === stat.id ? 'bg-gray-800 text-white' : `${stat.bg} ${stat.iconColor}`
                }`}>
                   <stat.icon size={20} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                  activeCategory === stat.id ? 'bg-gray-800 text-white' : `bg-gray-50 ${stat.trendColor}`
                }`}>
                   {stat.trend.includes('+') || stat.trend === 'Increasing' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.trend}
                </div>
             </div>
             <h3 className={`text-xs font-bold uppercase tracking-wide ${
               activeCategory === stat.id ? 'text-gray-400' : 'text-gray-500'
             }`}>
               {stat.label}
             </h3>
             <div className="mt-1 flex items-baseline gap-2">
                <span className={`text-3xl font-extrabold ${
                  activeCategory === stat.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {isLoading ? '...' : stat.value}
                </span>
                <span className={`text-xs font-medium ${
                  activeCategory === stat.id ? 'text-gray-400' : 'text-gray-400'
                }`}>
                  {stat.unit}
                </span>
             </div>
          </div>
        ))}
      </div>

      {/* --- PRODUCTS PERFORMANCE --- */}
      <div ref={performanceRef} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 scroll-mt-6">
         <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Products Performance</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">
                {activeCategory === 'inventory' ? 'Current stock levels' : 
                 activeCategory === 'damage' ? 'Reported waste/loss' : 'Sales volume & Popularity'}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
              activeCategory === 'damage' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              Viewing: {activeCategory}
            </span>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                     <th className="pb-5 pl-4">Products</th>
                     <th className="pb-5 text-center">
                       {activeCategory === 'inventory' ? 'In Stock' : 
                        activeCategory === 'damage' ? 'Damaged Qty' : 'Total Sold'}
                     </th>
                     <th className="pb-5 w-1/4">Popularity</th>
                     <th className="pb-5">Trend</th>
                     <th className="pb-5 text-right pr-4">Recommendation</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {allProducts.map((product) => (
                     <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 pl-4 font-bold text-gray-900">{product.name}</td>
                        <td className="py-5 text-center">
                           <span className={`font-bold px-3 py-1 rounded-lg text-sm ${
                             activeCategory === 'inventory' ? 'bg-blue-50 text-blue-700' : 
                             activeCategory === 'damage' ? 'bg-red-50 text-red-700' :
                             'bg-gray-100 text-gray-700'
                           }`}>
                             {activeCategory === 'inventory' ? product.stock : 
                              activeCategory === 'damage' ? product.damaged : product.totalSold}
                           </span>
                        </td>
                        <td className="py-5">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${product.popularity > 70 ? 'bg-blue-600' : product.popularity > 40 ? 'bg-orange-500' : 'bg-red-500'}`} 
                                    style={{ width: `${product.popularity}%` }}
                                 />
                              </div>
                              <span className="text-xs font-bold text-gray-500">{product.popularity}%</span>
                           </div>
                        </td>
                        <td className="py-5">
                           <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border inline-flex items-center gap-1 ${
                              product.trend === 'Increasing' ? 'bg-green-50 text-green-600 border-green-200' : 
                              product.trend === 'Declining' ? 'bg-red-50 text-red-600 border-red-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'
                           }`}>
                              {product.trend === 'Increasing' ? <ArrowUpRight size={10} strokeWidth={3} /> : <Minus size={10} strokeWidth={3} />}
                              {product.trend}
                           </span>
                        </td>
                        <td className="py-5 text-right pr-4">
                           <span className="text-xs font-medium text-gray-500 italic">{product.recommendation}</span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- RECENT USER ACTIVITIES --- */}
      <div ref={activitiesRef} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 scroll-mt-6">
         <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mt-1">
              Filtered by: <span className={`text-gray-900 font-bold capitalize ${activeCategory === 'damage' ? 'text-red-600' : ''}`}>{activeCategory}</span>
            </p>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-gray-100 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                     <th className="pb-5 pl-4">User</th>
                     <th className="pb-5">Action</th>
                     <th className="pb-5">Items</th>
                     <th className="pb-5 text-center">Quantity</th>
                     <th className="pb-5 text-right pr-4">Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                       <tr key={activity.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-5 pl-4">
                             <div className="font-bold text-gray-900 text-sm">{activity.user}</div>
                             <div className="text-[10px] font-bold text-gray-400 uppercase">{activity.role}</div>
                          </td>
                          <td className="py-5 text-sm font-medium text-gray-600">{activity.action}</td>
                          <td className="py-5 text-sm font-bold text-gray-800">{activity.item}</td>
                          <td className="py-5 text-center">
                             <span className={`font-bold px-3 py-1 rounded-lg text-xs ${
                               activity.category === 'damage' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'
                             }`}>{activity.quantity}</span>
                          </td>
                          <td className="py-5 text-right pr-4 text-sm font-medium text-emerald-600 font-mono tracking-tight">
                             {activity.time}
                          </td>
                       </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400 text-sm font-medium">
                        No recent activities found...
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}