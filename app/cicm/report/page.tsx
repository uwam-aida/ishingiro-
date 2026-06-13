'use client';

import React, { useState, useMemo, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import { 
  Printer, 
  Calendar, 
  TrendingUp,
  ArrowLeft,
  Download,
  Receipt,
  Store,
  Info
} from 'lucide-react';

// --- PRODUCT PRICE LIST (same as in StoreKeeperDashboard) ---
const FINANCE_PRODUCTS = [
  { name: 'big milk', price: 1300, category: 'BREAD', type: 'baked' },
  { name: 'small milk', price: 600, category: 'BREAD', type: 'baked' },
  { name: 'pcpn', price: 1100, category: 'BREAD', type: 'baked' },
  { name: 'sen', price: 1000, category: 'BREAD', type: 'baked' },
  { name: 'salted bread', price: 1100, category: 'BREAD', type: 'baked' },
  { name: 'baguette', price: 500, category: 'BREAD', type: 'baked' },
  { name: 'milk slice bread', price: 200, category: 'BREAD', type: 'baked' },
  { name: 'crubes', price: 1300, category: 'BREAD', type: 'baked' },
  { name: 'sen pieces', price: 100, category: 'BREAD', type: 'baked' },
  { name: 'brown sanduich', price: 250, category: 'BREAD', type: 'baked' },
  { name: 'mult graine', price: 1300, category: 'BREAD', type: 'baked' },
  { name: 'milk mult graine', price: 1000, category: 'BREAD', type: 'baked' },
  { name: 'brown bread', price: 800, category: 'BREAD', type: 'baked' },
  { name: 'tea cake', price: 1000, category: 'CAKES', type: 'baked' },
  { name: 'marble cake', price: 1200, category: 'CAKES', type: 'baked' },
  { name: 'brown cake', price: 250, category: 'CAKES', type: 'baked' },
  { name: 'oliver corn cake', price: 350, category: 'CAKES', type: 'baked' },
  { name: 'muffin cake', price: 170, category: 'CAKES', type: 'baked' },
  { name: 'ishingiro', price: 150, category: 'AMANDAZI', type: 'baked' },
  { name: 's.begne', price: 70, category: 'AMANDAZI', type: 'baked' },
  { name: 'dark donut', price: 450, category: 'AMANDAZI', type: 'baked' },
  { name: 'choc donuts', price: 450, category: 'AMANDAZI', type: 'baked' },
  { name: 'kk donuts', price: 250, category: 'AMANDAZI', type: 'baked' },
  { name: 'triangle', price: 150, category: 'AMANDAZI', type: 'baked' },
  { name: 'meat samosa', price: 450, category: 'OTHERS', type: 'baked' },
  { name: 'biscuits', price: 85, category: 'OTHERS', type: 'baked' },
  { name: 'ISH.MILK Cookie', price: 130, category: 'OTHERS', type: 'baked' },
  { name: 'butter biscuits', price: 130, category: 'OTHERS', type: 'baked' },
  { name: 'chocolate biscuits', price: 140, category: 'OTHERS', type: 'baked' },
  { name: 'ubunyobwa', price: 1800, category: 'OTHERS', type: 'baked' },
  { name: 'ikinyuranyo 1kg', price: 1600, category: 'OTHERS', type: 'unbaked' },
  { name: 'ikinyuranyo 3kg', price: 4500, category: 'OTHERS', type: 'unbaked' },
  { name: 'ikinyuranyo 5kg', price: 7500, category: 'OTHERS', type: 'unbaked' },
  { name: 'ikinyuranyo (0.5)kg', price: 1200, category: 'OTHERS', type: 'unbaked' },
  { name: 'yellow c flour 1kg', price: 1700, category: 'OTHERS', type: 'unbaked' },
  { name: 'yellow c flour 3kg', price: 4800, category: 'OTHERS', type: 'unbaked' },
  { name: 'cashnewnuts', price: 5500, category: 'OTHERS', type: 'unbaked' },
  { name: 'cornfresh cream', price: 500, category: 'OTHERS', type: 'unbaked' },
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
  { name: 'ADDCAKE', price: 2000, category: 'BIG CAKES', type: 'baked' },
];

// Helper to get product price by name
const getProductPrice = (productName: string): number => {
  const product = FINANCE_PRODUCTS.find(p => 
    p.name.toLowerCase() === productName.toLowerCase()
  );
  return product?.price || 0;
};

export default function CICMReportPage() {
  const router = useRouter();
  
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('All'); 
  const [isLoading, setIsLoading] = useState(false); 

  // Revenue data per branch (from /reports/revenue)
  const [branchData, setBranchData] = useState<any>({
    Kabuga: { bread: [], tiku: [] },
    Masaka: { bread: [], tiku: [] }
  });

  // Total distribution value (RWF) per branch
  const [distributionTotals, setDistributionTotals] = useState<Record<string, number>>({
    Kabuga: 0,
    Masaka: 0
  });

  // --- Helper: Fetch distribution value for a given branch ---
  const fetchDistributionsForBranch = async (branch: string): Promise<number> => {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    const branchParam = branch !== 'all' ? `?branch=${branch.toLowerCase()}` : '';
    const url = `${baseUrl}/reports/detailed${branchParam}`;

    try {
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        const distributions = data.distributions || [];
        let totalValue = 0;
        for (const dist of distributions) {
          const productName = dist.product?.name;
          const qty = dist.quantity || 0;
          // Use unit_price from API if available, otherwise look up from FINANCE_PRODUCTS
          let unitPrice = dist.unit_price;
          if (!unitPrice && productName) {
            unitPrice = getProductPrice(productName);
          }
          totalValue += qty * (unitPrice || 0);
        }
        return totalValue;
      }
    } catch (err) {
      console.error(`Failed to fetch distributions for ${branch}:`, err);
    }
    return 0;
  };

  // --- Main data fetch: revenue + distributions ---
  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
        const branchParam = selectedBranch.toLowerCase();

        // 1. Fetch revenue (sales) data
        const revenueRes = await fetch(`${baseUrl}/reports/revenue?date=${reportDate}&branch=${branchParam}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (revenueRes.ok) {
          const revenueData = await revenueRes.json();
          
          if (selectedBranch === 'All') {
            // For "All", fetch per‑branch revenue individually
            const kabugaRes = await fetch(`${baseUrl}/reports/revenue?date=${reportDate}&branch=kabuga`, { headers: { 'Authorization': `Bearer ${token}` } });
            const masakaRes = await fetch(`${baseUrl}/reports/revenue?date=${reportDate}&branch=masaka`, { headers: { 'Authorization': `Bearer ${token}` } });
            const kabugaData = kabugaRes.ok ? await kabugaRes.json() : { categories: { bread_sales: [], tiku_others: [] } };
            const masakaData = masakaRes.ok ? await masakaRes.json() : { categories: { bread_sales: [], tiku_others: [] } };
            
            setBranchData({
              Kabuga: {
                bread: kabugaData.categories?.bread_sales?.map((i: any) => ({ item: i.item, total: i.total })) || [],
                tiku: kabugaData.categories?.tiku_others?.map((i: any) => ({ item: i.item, total: i.total })) || []
              },
              Masaka: {
                bread: masakaData.categories?.bread_sales?.map((i: any) => ({ item: i.item, total: i.total })) || [],
                tiku: masakaData.categories?.tiku_others?.map((i: any) => ({ item: i.item, total: i.total })) || []
              }
            });
          } else {
            const mappedData = {
              bread: revenueData.categories?.bread_sales?.map((i: any) => ({ item: i.item, total: i.total })) || [],
              tiku: revenueData.categories?.tiku_others?.map((i: any) => ({ item: i.item, total: i.total })) || []
            };
            setBranchData((prev: any) => ({
              ...prev,
              [selectedBranch]: mappedData
            }));
          }
        }

        // 2. Fetch distribution values for each branch
        const branchesToFetch = selectedBranch === 'All' ? ['Kabuga', 'Masaka'] : [selectedBranch];
        const distTotals: Record<string, number> = { Kabuga: 0, Masaka: 0 };
        for (const br of branchesToFetch) {
          const total = await fetchDistributionsForBranch(br.toLowerCase());
          distTotals[br] = total;
        }
        setDistributionTotals(distTotals);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [reportDate, selectedBranch, router]);

  // --- Compute adjusted revenue after subtracting distributions ---
  const adjustedData = useMemo(() => {
    const processBranch = (branchName: string) => {
      const revenueBread = branchData[branchName]?.bread || [];
      const revenueTiku = branchData[branchName]?.tiku || [];
      const distributionValue = distributionTotals[branchName] || 0;

      if (distributionValue === 0) {
        return { bread: revenueBread, tiku: revenueTiku };
      }

      // Subtract distribution value from the total revenue (proportionally from both categories)
      const totalRevenue = calculateTotal(revenueBread) + calculateTotal(revenueTiku);
      if (totalRevenue <= 0) return { bread: revenueBread, tiku: revenueTiku };

      const reductionFactor = (totalRevenue - distributionValue) / totalRevenue;
      if (reductionFactor <= 0) return { bread: [], tiku: [] }; // all revenue is wiped

      const scaleArray = (arr: any[]) => arr.map(item => ({
        ...item,
        total: Math.max(0, item.total * reductionFactor)
      }));

      return {
        bread: scaleArray(revenueBread),
        tiku: scaleArray(revenueTiku)
      };
    };

    if (selectedBranch === 'All') {
      const kabugaAdj = processBranch('Kabuga');
      const masakaAdj = processBranch('Masaka');
      // Combine both branches
      const combine = (arr1: any[], arr2: any[]) => {
        const map = new Map();
        [...arr1, ...arr2].forEach(item => {
          if (map.has(item.item)) {
            map.get(item.item).total += item.total;
          } else {
            map.set(item.item, { ...item });
          }
        });
        return Array.from(map.values());
      };
      return {
        bread: combine(kabugaAdj.bread, masakaAdj.bread),
        tiku: combine(kabugaAdj.tiku, masakaAdj.tiku)
      };
    } else {
      return processBranch(selectedBranch);
    }
  }, [selectedBranch, branchData, distributionTotals]);

  const calculateTotal = (data: any[]) => data?.reduce((sum, row) => sum + (row.total || 0), 0) || 0;

  const grandTotalAfterSubtraction = useMemo(() => {
    return calculateTotal(adjustedData.bread) + calculateTotal(adjustedData.tiku);
  }, [adjustedData]);

  // --- Export to CSV (with adjusted values) ---
  const handleExportExcel = () => {
    let csv = `ISHINGIRO SHOP\n`;
    csv += `REVENUE REPORT (after subtracting storekeeper distributions): ${selectedBranch.toUpperCase()} BRANCHES\n`;
    csv += `DATE: ${reportDate}\n`;
    csv += `Note: Revenue excludes non‑sales distributions (events, clients, tiku giveaways) recorded by storekeeper.\n\n`;
    
    const formatSection = (title: string, data: any[]) => {
      let content = `${title.toUpperCase()}\nItem,Total Revenue (RWF)\n`;
      data.forEach(d => content += `${d.item},${d.total.toLocaleString()}\n`);
      content += `TOTAL,${calculateTotal(data).toLocaleString()}\n\n`;
      return content;
    };

    csv += formatSection("Bread Section", adjustedData.bread);
    csv += formatSection("Tiku / Others (Paid Only)", adjustedData.tiku);
    csv += `GRAND TOTAL (after distribution deduction), ${grandTotalAfterSubtraction.toLocaleString()}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IshingiroShop_${selectedBranch}_${reportDate}.csv`;
    a.click();
  };

  // --- Table component ---
  const ReportTable = ({ title, data, colorClass = "bg-[#5D4037]", tooltip = "" }: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit break-inside-avoid">
      <div className={`${colorClass} px-4 py-2 text-white flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-black uppercase tracking-widest">{title}</h2>
          {tooltip && (
            <div className="relative group cursor-help">
              <Info size={12} className="opacity-70" />
              <span className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-black text-white text-[9px] rounded px-2 py-1 whitespace-nowrap z-10">
                {tooltip}
              </span>
            </div>
          )}
        </div>
        <span className="text-[9px] font-bold opacity-70 uppercase">{selectedBranch} View</span>
      </div>
      <table className="w-full text-left text-[11px]">
        <thead className="bg-gray-50 text-gray-400 font-bold uppercase">
          <tr>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2 text-right">Total Revenue (RWF)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data?.map((row: any, i: number) => row.total > 0 && (
            <tr key={i} className="hover:bg-gray-50/50">
              <td className="px-4 py-3 font-bold text-[#5D4037] uppercase">{row.item}</td>
              <td className="px-4 py-3 text-right font-black text-gray-700">{row.total.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="bg-gray-50/80 font-black">
            <td className="px-4 py-3 text-[#5D4037] text-right uppercase">Total:</td>
            <td className="px-4 py-3 text-right text-[#5D4037]">
              {calculateTotal(data).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      
      {/* --- Print header with footnote --- */}
      <div className="hidden print:block border-b-4 border-[#5D4037] pb-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#5D4037]">ISHINGIRO SHOP</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em]">Official Revenue Report</p>
            <div className="flex items-center gap-2 mt-2 bg-[#5D4037] text-white px-3 py-1 rounded-lg w-fit">
              <Store size={14} />
              <span className="text-xs font-black uppercase tracking-widest">
                {selectedBranch === 'All' ? 'ALL Branches' : `${selectedBranch} Branch`}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Generated</p>
            <p className="text-xl font-black text-[#5D4037]">
              {new Date(reportDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="mt-4 text-[9px] text-gray-500 italic border-t pt-2">
          * Revenue excludes non‑sales distributions (events, clients, tiku) recorded by storekeeper.
        </div>
      </div>

      {/* --- Screen header with controls --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#5D4037] uppercase tracking-tight">CICM Revenue Report</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ishingiro Shop</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="bg-white border-2 border-[#5D4037]/10 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
            <Store size={14} className="text-[#5D4037]" />
            <select 
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs font-black text-[#5D4037] outline-none bg-transparent uppercase cursor-pointer"
            >
              <option value="All">All Branches</option>
              <option value="Kabuga">Kabuga</option>
              <option value="Masaka">Masaka</option>
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <input 
              type="date" 
              value={reportDate} 
              onChange={(e) => setReportDate(e.target.value)} 
              className="text-xs font-bold text-[#5D4037] outline-none" 
            />
          </div>
          
          <button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-green-700 transition-all active:scale-95 shadow-sm">
            <Download size={14} /> EXCEL
          </button>
          <button onClick={() => window.print()} className="bg-[#5D4037] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm">
            <Printer size={14} /> PRINT
          </button>
        </div>
      </div>

      {/* --- Footnote (screen) --- */}
      <div className="print:hidden flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg">
        <Info size={12} />
        <span>
          Revenue shown excludes non‑sales distributions (events, clients, tiku giveaways) entered by storekeeper. 
          Distribution monetary values are subtracted proportionally from all revenue items.
        </span>
      </div>

      {/* --- Tables (adjusted) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportTable 
          title="Bread Sales" 
          data={adjustedData.bread} 
          tooltip="Revenue from bread products sold (distributions subtracted proportionally)"
        />
        <ReportTable 
          title="Tiku / Others (Paid Only)" 
          data={adjustedData.tiku} 
          colorClass="bg-blue-600" 
          tooltip="Only paid tiku/other sales – giveaways have been removed"
        />
      </div>

      {/* --- Grand Total Summary --- */}
      <div className="bg-[#F57C00] p-6 rounded-[32px] text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 print:shadow-none print:border-2 print:border-[#F57C00] print:text-[#F57C00] print:bg-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-2xl print:bg-[#F57C00]/10">
            <Receipt size={32} />
          </div>
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Grand Total Revenue (after distribution deduction)</p>
            <h2 className="text-4xl font-black">
              RWF {isLoading ? '...' : grandTotalAfterSubtraction.toLocaleString()}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/10 px-6 py-3 rounded-2xl print:border print:border-[#F57C00]">
          <TrendingUp size={20} />
          <span className="font-bold text-sm uppercase tracking-tighter">Verified Revenue</span>
        </div>
      </div>

      {/* --- Print footer --- */}
      <div className="hidden print:block text-[8px] text-gray-400 text-center mt-8 border-t pt-2">
        Report generated on {new Date().toLocaleString()} – Revenue excludes non‑sales distributions recorded by storekeeper.
      </div>

    </div>
  );
}