'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight, Award, Activity, Lightbulb } from 'lucide-react';

export default function BusinessAnalyticsPage() {
  
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    // 1. Load Prices
    const savedPrices = localStorage.getItem('sellingPrices_FINAL_FIX');
    const products = savedPrices ? JSON.parse(savedPrices) : [];

    if (products.length === 0) return;

    // 2. SIMULATE DATA 
    let todayRevenue = 0;
    let yesterdayRevenue = 0;
    
    // We create a "Performance Score" for every product
    const productPerformance = products.map((p: any) => {
      // Random sales for "Today"
      const soldToday = Math.floor(Math.random() * 150) + 10; 
      // Random sales for "Yesterday" (to calculate growth)
      const soldYesterday = Math.floor(Math.random() * 150) + 10;
      
      const revenueToday = soldToday * p.price;
      const revenueYesterday = soldYesterday * p.price;

      todayRevenue += revenueToday;
      yesterdayRevenue += revenueYesterday;

      return {
        name: p.name,
        category: p.category,
        price: p.price,
        sold: soldToday,
        revenue: revenueToday
      };
    });

    // 3. SORT DATA
    // Winners: High Sales
    const crowdFavorites = [...productPerformance].sort((a, b) => b.sold - a.sold).slice(0, 5);
    // Losers: Low Sales
    const coldProducts = [...productPerformance].sort((a, b) => a.sold - b.sold).slice(0, 5);

    // 4. CALCULATE GROWTH
    const growthPercent = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    const isGrowing = growthPercent > 0;

    // 5. GENERATE ADVICE
    let advice = "";
    if (isGrowing) {
      advice = `Business is booming! Your "${crowdFavorites[0].name}" is the star. Consider running a bundle deal: Buy "${crowdFavorites[0].name}" and get 50% off "${coldProducts[0].name}" to clear old stock.`;
    } else {
      // Changed "Revenue is down" to "It's a slower day"
      advice = `It's a slower day today. People are ignoring "${coldProducts[0].name}". Stop production on it for 2 days and run a flash sale on "${crowdFavorites[0].category}" to bring customers back.`;
    }

    setAnalyticsData({
      todayRevenue,
      yesterdayRevenue,
      growthPercent: Math.round(growthPercent),
      isGrowing,
      crowdFavorites,
      coldProducts,
      advice
    });

  }, []);

  if (!analyticsData) return <div className="p-10 text-center text-gray-500">Analysing Business Data...</div>;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#5D4037]">Market Intelligence</h1>
        <p className="text-gray-500 text-sm">Real-time analysis of growth and product demand.</p>
      </div>

      {/* --- 1. GROWTH INDICATOR (Old Style: Red/Green Gradients) --- */}
      <div className={`rounded-3xl p-8 text-white shadow-xl relative overflow-hidden transition-all ${analyticsData.isGrowing ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-red-600 to-red-800'}`}>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Business Health Status</p>
               <h2 className="text-5xl font-black flex items-center gap-4">
                 {/* CHANGED HERE: 'low' -> 'SLOWER DAY' */}
                 {analyticsData.isGrowing ? 'GROWING' : 'SLOWER DAY'}
                 <span className="text-2xl bg-white/20 px-3 py-1 rounded-xl">
                   {analyticsData.isGrowing ? '+' : ''}{analyticsData.growthPercent}%
                 </span>
               </h2>
               <p className="mt-2 text-white/90 text-sm font-medium max-w-lg">
                 Current Revenue: <strong>{analyticsData.todayRevenue.toLocaleString()} RWF</strong> <span className="opacity-70">(Yesterday: {analyticsData.yesterdayRevenue.toLocaleString()} RWF)</span>
               </p>
            </div>
            {analyticsData.isGrowing ? <TrendingUp size={100} className="text-white opacity-20" /> : <TrendingDown size={100} className="text-white opacity-20" />}
         </div>
      </div>

      {/* --- 2. STRATEGIC ADVICE --- */}
      <div className="bg-[#EBE0CC] p-6 rounded-[32px] border border-[#d6c7a8] flex items-start gap-4 shadow-sm">
         <div className="bg-[#5D4037] text-white p-3 rounded-full shrink-0">
           <Lightbulb size={24} />
         </div>
         <div>
           <h3 className="text-[#5D4037] font-black uppercase text-sm tracking-widest mb-1">AI Recommendation: Where to put effort?</h3>
           <p className="text-[#5D4037] font-medium leading-relaxed">
             {analyticsData.advice}
           </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- 3. CROWD FAVORITES --- */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Award className="text-green-600" />
            <div>
              <h3 className="text-lg font-black text-[#5D4037]">Favorite products</h3>
              <p className="text-xs text-gray-400">Products with highest demand.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.crowdFavorites.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-2xl border border-green-100">
                <div className="flex items-center gap-3">
                  <span className="font-black text-green-700 text-lg">#{index + 1}</span>
                  <div>
                    <p className="font-bold text-[#5D4037] text-sm">{item.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-[#5D4037]">{item.sold} Sold</p>
                   <p className="text-[10px] text-green-600 font-bold">High Demand</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. COLD PRODUCTS (Kept as Cold Products per your code) --- */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-red-500" />
            <div>
              <h3 className="text-lg font-black text-[#5D4037]">Cold Products</h3>
              <p className="text-xs text-gray-400">Products with lowest demand</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.coldProducts.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-2xl border border-red-100">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-400"></div>
                   <div>
                     <p className="font-bold text-[#5D4037] text-sm">{item.name}</p>
                     <p className="text-[10px] text-gray-500 uppercase">{item.category}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-red-600">{item.sold} Sold</p>
                    <p className="text-[10px] text-gray-400">Low Interest</p>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}