
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Scale, 
  Package, 
  Printer, 
  Search, 
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Download,
  Store
} from 'lucide-react';

export default function MeasuredProductsReport() {
  const router = useRouter();

  const [selectedBranch, setSelectedBranch] = useState<'All' | 'Kabuga' | 'Masaka'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const reportDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const isoDate = new Date().toISOString().split('T')[0];

  // ✅ ADDED: State to hold the authenticated user profile
  const [userProfile, setUserProfile] = useState<any>(null);

  // --- STATE WITH MOCK DATA FALLBACK (Will be overwritten by API) ---
  const [productData, setProductData] = useState<any[]>([
    { id: 1, branch: 'Kabuga', name: 'White Bread', unit: 'Piece', price: 1000, sold: 500, damaged: 10 },
    { id: 2, branch: 'Kabuga', name: 'Brown Bread', unit: 'Piece', price: 1200, sold: 300, damaged: 5 },
    { id: 3, branch: 'Kabuga', name: 'Tea Scones', unit: 'Kg', price: 3000, sold: 50, damaged: 2 },
    { id: 4, branch: 'Masaka', name: 'White Bread', unit: 'Piece', price: 1000, sold: 450, damaged: 8 },
    { id: 5, branch: 'Masaka', name: 'Cakes', unit: 'Piece', price: 5000, sold: 20, damaged: 1 },
    { id: 6, branch: 'Masaka', name: 'Donuts', unit: 'Piece', price: 500, sold: 400, damaged: 15 },
  ]);

  // --- BACKEND API INTEGRATION ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchReportData = async () => {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      try {
        // ✅ FIXED: Fetch both the User Profile (/me) and the Measured Products simultaneously
        const [meResponse, reportResponse] = await Promise.all([
          fetch(`${baseUrl}/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${baseUrl}/finance/measured-products`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        // Save user profile state
        if (meResponse.ok) {
          const userData = await meResponse.json();
          setUserProfile(userData);
        }

        if (reportResponse.ok) {
          const data = await reportResponse.json();
          // Map backend response to match the exact structure expected by your UI
          const formattedData = data.map((item: any) => ({
             id: item.id,
             branch: item.branch.charAt(0).toUpperCase() + item.branch.slice(1), // e.g., 'kabuga' -> 'Kabuga'
             name: item.name,
             unit: item.unit || (item.name.toLowerCase().includes('flour') || item.name.toLowerCase().includes('sugar') ? 'Kg' : 'Piece'), // API fallback
             price: item.price,
             sold: item.sold || 0,
             damaged: item.damaged || 0
          }));
          setProductData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [router]);


  const filteredData = selectedBranch === 'All' 
    ? productData 
    : productData.filter(item => item.branch.toLowerCase() === selectedBranch.toLowerCase() || item.branch === 'All');

  const totalRevenue = filteredData.reduce((acc, curr) => acc + (curr.sold * curr.price), 0);
  const totalLoss = filteredData.reduce((acc, curr) => acc + (curr.damaged * curr.price), 0);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF' }).format(amount);
  };

  // --- EXCEL EXPORT LOGIC ---
  const handleExportExcel = () => {
    let csv = `ISHINGIRO SHOP\nBRANCH: ${selectedBranch.toUpperCase()}\nDATE: ${isoDate}\nREPORT: MEASURED PRODUCTS\n\n`;
    csv += `Item Name,Branch,Unit Price,Sold Qty,Damaged Qty,Total Revenue\n`;
    
    filteredData.forEach(item => {
      csv += `${item.name},${item.branch},${item.price},${item.sold},${item.damaged},${item.sold * item.price}\n`;
    });
    
    csv += `\nTOTAL REVENUE,,, , ,${totalRevenue}\n`;
    csv += `TOTAL LOSS,,, , ,${totalLoss}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Ishingiro_Measured_${selectedBranch}_${isoDate}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-6 pb-10">
      
      {/* ✅ CSS TO HIDE BROWSER HEADERS/FOOTERS */}
      <style jsx global>{`
        @media print {
          @page { margin: 10mm; }
          body { margin: 0; }
        }
      `}</style>

      {/* --- 1. OFFICIAL PRINT HEADER (Visible only on paper) --- */}
      <div className="hidden print:flex flex-col items-center border-b-4 border-[#5D4037] pb-6 mb-8 text-center">
        <h1 className="text-4xl font-black text-[#5D4037] uppercase tracking-tighter">ISHINGIRO SHOP</h1>
        <div className="flex items-center gap-4 mt-2">
           <div className="flex items-center gap-2 bg-[#5D4037] text-white px-4 py-1 rounded-lg">
              <Store size={16} />
              <span className="text-sm font-bold uppercase tracking-widest">
                {selectedBranch === 'All' ? 'Combined Report' : `${selectedBranch} Branch`}
              </span>
           </div>
           <span className="text-lg font-black text-[#5D4037]">{reportDate}</span>
        </div>
      </div>

      {/* --- 2. TOP NAVIGATION (Hidden on Print) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link 
            href="/cheif-finance" 
            className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 text-[#5D4037] transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-[#5D4037] uppercase tracking-tight">Measured Products</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Branch Switcher (Mobile Responsive) */}
          <div className="bg-white border border-gray-200 p-1 rounded-2xl flex items-center shadow-sm w-full md:w-auto">
             {['All', 'Kabuga', 'Masaka'].map((branch) => (
               <button
                 key={branch}
                 onClick={() => setSelectedBranch(branch as any)}
                 className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   selectedBranch === branch ? 'bg-[#5D4037] text-white shadow-md' : 'text-gray-400 hover:text-[#5D4037]'
                 }`}
               >
                 {branch}
               </button>
             ))}
          </div>

          <button 
            onClick={handleExportExcel}
            className="p-2.5 bg-green-600 text-white rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all"
          >
            <Download size={20} />
          </button>

          <button 
            onClick={() => window.print()}
            className="p-2.5 bg-[#5D4037] text-white rounded-xl shadow-lg active:scale-95 transition-all"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* --- 3. SUMMARY CARDS (Hidden on Print) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
             <Package size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Branch Revenue</p>
             <h3 className="text-2xl font-black text-[#5D4037]">{isLoading ? '...' : formatMoney(totalRevenue)}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
             <AlertTriangle size={24} />
           </div>
           <div>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Branch Losses</p>
             <h3 className="text-2xl font-black text-red-600">{isLoading ? '...' : formatMoney(totalLoss)}</h3>
           </div>
        </div>
      </div>

      {/* --- 4. MAIN TABLE --- */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden print:border-none print:shadow-none">
        
        {/* Table Header UI */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 print:bg-transparent print:px-0">
           <h3 className="font-black text-[#5D4037] uppercase text-xs">Production & Sales Audit</h3>
           <div className="relative print:hidden">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
             <input 
               type="text" 
               placeholder="Search product..." 
               className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
             />
           </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 print:bg-gray-100">
                <th className="px-8 py-4">Product Details</th>
                <th className="px-6 py-4 text-right">Sold</th>
                <th className="px-6 py-4 text-right text-red-400 bg-red-50/30">Damaged</th>
                <th className="px-8 py-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 print:divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="text-sm font-bold">
                  <td className="px-8 py-4 uppercase">
                    <div className="text-[#5D4037]">{item.name}</div>
                    <div className="text-[10px] text-gray-400 font-normal">
                      {item.branch} • {formatMoney(item.price)}/{item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.sold} <span className="text-[10px] text-gray-400">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-right bg-red-50/10 text-red-600">
                    {item.damaged} <span className="text-[10px] text-red-400">{item.unit}</span>
                  </td>
                  <td className="px-8 py-4 text-right font-black text-[#5D4037]">
                    {formatMoney(item.sold * item.price)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50/80 font-black print:bg-gray-100">
                 <td colSpan={3} className="px-8 py-6 text-right uppercase text-[#5D4037]">Grand Total:</td>
                 <td className="px-8 py-6 text-right text-xl text-[#5D4037] border-t-2 border-[#5D4037]">
                   {formatMoney(totalRevenue)}
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer for print only */}
      <div className="hidden print:block mt-12 text-center border-t border-dashed border-gray-200 pt-6">
         <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.5em]">Ishingiro Shop Management System • Official Record</p>
      </div>

    </div>
  );
}
