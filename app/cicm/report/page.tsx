'use client';

import React, { useState, useMemo, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Printer, 
  Calendar, 
  TrendingUp,
  ArrowLeft,
  Download,
  Receipt,
  Store
} from 'lucide-react';

export default function CICMReportPage() {
  const router = useRouter();
  
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('All'); 
  const [isLoading, setIsLoading] = useState(false); 

  // --- 1. DATA SOURCE (Updated to match the new API 'total' structure) ---
  const [branchData, setBranchData] = useState<any>({
    Kabuga: {
      bread: [
        { item: 'big milk', total: 279500 },
        { item: 'small milk', total: 24000 },
        { item: 'pcpn', total: 34100 },
      ],
      tiku: [
        { item: 'ishingiro', total: 1800 },
        { item: 'salt big', total: 1100 },
      ]
    },
    Masaka: {
      bread: [
        { item: 'big milk', total: 195000 },
        { item: 'small milk', total: 12000 },
        { item: 'pcpn', total: 11000 },
      ],
      tiku: [
        { item: 'ishingiro', total: 750 },
        { item: 'salt big', total: 0 },
      ]
    }
  });

  const [apiGrandTotal, setApiGrandTotal] = useState<number>(0);

  // --- 2. FETCH DETAILED REVENUE API ---
  useEffect(() => {
    const fetchDetailedData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
        
        const branchParam = selectedBranch.toLowerCase();
        const response = await fetch(`${baseUrl}/reports/revenue?date=${reportDate}&branch=${branchParam}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          setApiGrandTotal(data.grand_total || 0);
          
          // Map the API categories using the new 'total' field
          const mappedData = {
            bread: data.categories?.bread_sales?.map((i: any) => ({ item: i.item, total: i.total })) || [],
            tiku: data.categories?.tiku_others?.map((i: any) => ({ item: i.item, total: i.total })) || []
          };

          if (selectedBranch === 'All') {
            setBranchData({
                Kabuga: mappedData, 
                Masaka: { bread: [], tiku: [] } 
            });
          } else {
            setBranchData((prev: any) => ({
              ...prev,
              [selectedBranch]: mappedData
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch detailed reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedData();
  }, [reportDate, selectedBranch, router]);

  // --- 3. LOGIC TO COMBINE DATA FOR "ALL" ---
  const currentData = useMemo(() => {
    if (selectedBranch === 'All') {
      const combine = (key: string) => {
        const result: any = {};
        ['Kabuga', 'Masaka'].forEach(b => {
          branchData[b][key]?.forEach((row: any) => {
            if (result[row.item]) {
              result[row.item].total += row.total;
            } else {
              result[row.item] = { ...row };
            }
          });
        });
        return Object.values(result);
      };
      return { bread: combine('bread'), tiku: combine('tiku') };
    }
    return branchData[selectedBranch] || { bread: [], tiku: [] };
  }, [selectedBranch, branchData]);

  // Updated to just sum the totals instead of multiplying qty * price
  const calculateTotal = (data: any[]) => data?.reduce((sum, row) => sum + row.total, 0) || 0;

  // --- 4. EXCEL EXPORT ---
  const handleExportExcel = () => {
    let csv = `ISHINGIRO SHOP\n`;
    csv += `REVENUE REPORT: ${selectedBranch.toUpperCase()} BRANCHES\n`;
    csv += `DATE: ${reportDate}\n\n`;
    
    const formatSection = (title: string, data: any[]) => {
      let content = `${title.toUpperCase()}\nItem,Total Revenue\n`;
      data.forEach(d => content += `${d.item},${d.total}\n`);
      content += `TOTAL, ${calculateTotal(data)}\n\n`;
      return content;
    };

    csv += formatSection("Bread Section", currentData.bread);
    csv += formatSection("Tiku (Store Keeper)", currentData.tiku);
    csv += `GRAND TOTAL, ${apiGrandTotal || (calculateTotal(currentData.bread) + calculateTotal(currentData.tiku))}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IshingiroShop_${selectedBranch}_${reportDate}.csv`;
    a.click();
  };

  // Updated Table to reflect only Item and Total Revenue
  const ReportTable = ({ title, data, colorClass = "bg-[#5D4037]" }: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit break-inside-avoid">
      <div className={`${colorClass} px-4 py-2 text-white flex justify-between items-center`}>
        <h2 className="text-xs font-black uppercase tracking-widest">{title}</h2>
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
          {data?.map((row: any, i: number) => (
            <tr key={i} className="hover:bg-gray-50/50">
              <td className="px-4 py-3 font-bold text-[#5D4037] uppercase">{row.item}</td>
              <td className="px-4 py-3 text-right font-black text-gray-700">{row.total?.toLocaleString()}</td>
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
      
      {/* --- OFFICIAL PRINT HEADER --- */}
      <div className="hidden print:block border-b-4 border-[#5D4037] pb-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
            </div>
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
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Generated</p>
            <p className="text-xl font-black text-[#5D4037]">
              {new Date(reportDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* --- UI HEADER (Hides on Print) --- */}
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
          {/* BRANCH SELECTOR */}
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
            <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="text-xs font-bold text-[#5D4037] outline-none" />
          </div>
          
          <button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-green-700 transition-all active:scale-95 shadow-sm">
            <Download size={14} /> EXCEL
          </button>
          <button onClick={() => window.print()} className="bg-[#5D4037] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 shadow-sm">
            <Printer size={14} /> PRINT
          </button>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportTable title="Bread Sales" data={currentData.bread} />
        <ReportTable title="Tiku / Others" data={currentData.tiku} colorClass="bg-blue-600" />
      </div>

      {/* --- CONSOLIDATED SUMMARY --- */}
      <div className="bg-[#F57C00] p-6 rounded-[32px] text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 print:shadow-none print:border-2 print:border-[#F57C00] print:text-[#F57C00] print:bg-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-2xl print:bg-[#F57C00]/10">
            <Receipt size={32} />
          </div>
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Grand Total Revenue ({selectedBranch})</p>
            <h2 className="text-4xl font-black">
              RWF {isLoading ? '...' : (apiGrandTotal || calculateTotal(currentData.bread) + calculateTotal(currentData.tiku)).toLocaleString()}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/10 px-6 py-3 rounded-2xl print:border print:border-[#F57C00]">
          <TrendingUp size={20} />
          <span className="font-bold text-sm uppercase tracking-tighter">Verified Revenue</span>
        </div>
      </div>

    </div>
  );
}