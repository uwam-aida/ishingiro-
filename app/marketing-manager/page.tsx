'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { 
  Users, 
  ArrowLeft, 
  Circle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  ExternalLink, 
  Activity,
  ShieldCheck,
  ArrowRight,
  Search
} from 'lucide-react';

export default function MarketingManagerAdmin() {
  const router = useRouter();
  const [view, setView] = useState<'dashboard' | 'userList' | 'userDetails'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // --- PRODUCT DATA (Maintained for Global Analytics) ---
  const [productTargets] = useState([
    { id: 1, name: 'big milk', target: 500, current: 420, category: 'BREAD' },
    { id: 2, name: 'small milk', target: 1000, current: 850, category: 'BREAD' },
    { id: 3, name: 'pcpn', target: 200, current: 150, category: 'BREAD' },
    { id: 4, name: 'sen', target: 300, current: 310, category: 'BREAD' },
    { id: 5, name: 'salted bread', target: 100, current: 90, category: 'BREAD' },
    { id: 6, name: 'baguette', target: 400, current: 380, category: 'BREAD' },
    { id: 7, name: 'milk slice bread', target: 2000, current: 1800, category: 'BREAD' },
    { id: 8, name: 'crubes', target: 50, current: 45, category: 'BREAD' },
    { id: 9, name: 'sen pieces', target: 5000, current: 4200, category: 'BREAD' },
    { id: 10, name: 'brown sanduich', target: 300, current: 280, category: 'BREAD' },
    { id: 11, name: 'mult graine', target: 50, current: 30, category: 'BREAD' },
    { id: 12, name: 'milk mult graine', target: 50, current: 55, category: 'BREAD' },
    { id: 13, name: 'brown bread', target: 200, current: 190, category: 'BREAD' },
    { id: 14, name: 'tea cake', target: 100, current: 80, category: 'CAKES' },
    { id: 15, name: 'marble cake', target: 80, current: 75, category: 'CAKES' },
    { id: 16, name: 'brown cake', target: 400, current: 410, category: 'CAKES' },
    { id: 17, name: 'oliver corn cake', target: 200, current: 150, category: 'CAKES' },
    { id: 18, name: 'muffin cake', target: 500, current: 480, category: 'CAKES' },
    { id: 19, name: 'ishingiro', target: 1000, current: 950, category: 'AMANDAZI' },
    { id: 20, name: 's.begne', target: 2000, current: 1900, category: 'AMANDAZI' },
    { id: 21, name: 'dark donut', target: 100, current: 85, category: 'AMANDAZI' },
    { id: 22, name: 'choc donuts', target: 100, current: 110, category: 'AMANDAZI' },
    { id: 23, name: 'kk donuts', target: 150, current: 140, category: 'AMANDAZI' },
    { id: 24, name: 'triangle', target: 500, current: 480, category: 'AMANDAZI' },
    { id: 25, name: 'meat samosa', target: 200, current: 190, category: 'OTHERS' },
    { id: 26, name: 'biscuits', target: 1000, current: 800, category: 'OTHERS' },
    { id: 27, name: 'ISH.MILK Cookie', target: 300, current: 250, category: 'OTHERS' },
    { id: 28, name: 'butter biscuits', target: 300, current: 310, category: 'OTHERS' },
    { id: 29, name: 'chocolate biscuits', target: 300, current: 280, category: 'OTHERS' },
    { id: 30, name: 'ubunyobwa', target: 50, current: 40, category: 'OTHERS' },
    { id: 31, name: 'ikinyuranyo 1kg', target: 50, current: 45, category: 'OTHERS' },
    { id: 32, name: 'ikinyuranyo 3kg', target: 20, current: 15, category: 'OTHERS' },
    { id: 33, name: 'ikinyuranyo 5kg', target: 10, current: 8, category: 'OTHERS' },
    { id: 34, name: 'ikinyuranyo (0.5)kg', target: 100, current: 95, category: 'OTHERS' },
    { id: 35, name: 'yellow c flour 1kg', target: 50, current: 30, category: 'OTHERS' },
    { id: 36, name: 'yellow c flour 3kg', target: 20, current: 12, category: 'OTHERS' },
    { id: 37, name: 'cashnewnuts', target: 10, current: 5, category: 'OTHERS' },
    { id: 38, name: 'cornfresh cream', target: 100, current: 80, category: 'OTHERS' },
    { id: 39, name: 'cake 38000', target: 5, current: 2, category: 'BIG CAKES' },
    { id: 40, name: 'cake 20000', target: 10, current: 8, category: 'BIG CAKES' },
    { id: 41, name: 'cakes 24000', target: 5, current: 6, category: 'BIG CAKES' },
    { id: 42, name: 'cake 19000', target: 5, current: 3, category: 'BIG CAKES' },
    { id: 43, name: 'cake 18000', target: 5, current: 4, category: 'BIG CAKES' },
    { id: 44, name: 'cakes 15000', target: 10, current: 7, category: 'BIG CAKES' },
    { id: 45, name: 'cakes 14000', target: 10, current: 9, category: 'BIG CAKES' },
    { id: 46, name: 'cakes 13000', target: 10, current: 12, category: 'BIG CAKES' },
    { id: 47, name: 'cake 12000', target: 20, current: 15, category: 'BIG CAKES' },
    { id: 48, name: 'cakes 10000', target: 20, current: 18, category: 'BIG CAKES' },
    { id: 49, name: 'cakes 9000', target: 30, current: 25, category: 'BIG CAKES' },
    { id: 50, name: 'cakes 8000', target: 30, current: 32, category: 'BIG CAKES' },
    { id: 51, name: 'cakes 7000', target: 40, current: 35, category: 'BIG CAKES' },
    { id: 52, name: 'cakes 6000', target: 50, current: 48, category: 'BIG CAKES' },
    { id: 53, name: 'cake 5000', target: 50, current: 45, category: 'BIG CAKES' },
    { id: 54, name: 'ADDCAKE', target: 100, current: 120, category: 'BIG CAKES' },
  ]);

  const totalTarget = productTargets.reduce((acc, p) => acc + p.target, 0);
  const totalCurrent = productTargets.reduce((acc, p) => acc + p.current, 0);
  const isGlobalTargetMet = totalCurrent >= totalTarget;

  // --- SYSTEM USERS ---
  const allUsers = [
    { name: "Production Manager", branch: "Global", role: "Production Manager", path: '/production-manager', status: 'Active Now', history: [{ day: 'Today', summary: 'Batch Quality Control', movements: [{ item: 'Bread Batch A1', qty: '500', time: '04:00 AM' }] }] },
    { name: "Baker Assistant", branch: "Global", role: "Baker Assistant", path: '/baker-assistant', status: 'Active Now', history: [{ day: 'Today', summary: 'Oven Maintenance', movements: [{ item: 'Daily Baking', qty: 'Standard', time: '05:00 AM' }] }] },
    { name: "Store Keeper", branch: "Kabuga", role: "Store Keeper", path: '/store-keeper', status: 'Active Now', history: [{ day: 'Today', summary: 'Inventory Audit', movements: [{ item: 'Wheat Flour', qty: '20 Bags', time: '09:00 AM' }] }] },
    { name: "Kabuga Shop Manager", branch: "Kabuga", role: "Shop Manager", path: '/kabuga-shop/shop-manager', status: 'Active Now', history: [{ day: 'Today', summary: 'Morning Sales Review', movements: [{ item: 'Cash Audit', qty: 'Verified', time: '10:00 AM' }] }] },
    { name: "Masaka Shop Manager", branch: "Masaka", role: "Shop Manager", path: '/masaka-shop/shop-manager', status: 'Active Now', history: [{ day: 'Today', summary: 'Stock Arrival', movements: [{ item: 'Daily Delivery', qty: '150 Units', time: '09:45 AM' }] }] },
    { name: "Sales Coordinator", branch: "Global", role: "Sales Coordinator", path: '/sales-coordinator', status: 'Active Now', history: [{ day: 'Today', summary: 'Wholesale Orders', movements: [{ item: 'Supermarket Order', qty: '300 Units', time: '11:00 AM' }] }] },
    { name: "Chief of Finance", branch: "Global", role: "Chief of Finance", path: '/chief-finance', status: 'Active Now', history: [{ day: 'Today', summary: 'Expense Verification', movements: [{ item: 'Supplier Payment', qty: 'RWF 500k', time: '10:30 AM' }] }] },
    { name: "CICM Admin", branch: "Global", role: "Internal Audit", path: '/cicm', status: 'Active Now', history: [{ day: 'Today', summary: 'System Log Review', movements: [{ item: 'Data Integrity', qty: 'Clean', time: '07:00 AM' }] }] },
  ];

  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-[#FAFAFB] min-h-screen font-sans text-[#1C1C1C]">
      <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12">
        {view === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2 border-l-8 border-[#F57C00] pl-6">
              <h1 className="text-4xl font-black uppercase tracking-tight italic">Executive Command</h1>
              <p className="text-[#F57C00] text-[11px] font-black uppercase tracking-[0.4em]">Marketing Manager Dashboard</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div onClick={() => setView('userList')} className="bg-[#1C1C1C] p-10 rounded-[3rem] shadow-2xl cursor-pointer group relative overflow-hidden transition-all hover:-translate-y-2">
                  <div className="absolute top-0 right-0 p-8 text-[#F57C00]/20 group-hover:text-[#F57C00]/40 transition-colors"><Users size={120} /></div>
                  <div className="relative z-10">
                    <div className="p-4 w-fit rounded-2xl bg-[#F57C00] text-white mb-6"><Users size={28} /></div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total System Users</p>
                    <h3 className="text-4xl font-black text-white italic">{allUsers.length} Active Roles</h3>
                    <p className="text-[10px] text-[#F57C00] font-black uppercase mt-6 flex items-center gap-2">Monitor all accounts <ArrowRight size={14}/></p>
                  </div>
              </div>

              {/* GLOBAL TARGET TRACKER */}
              <div className={`p-10 rounded-[3rem] shadow-xl border-2 transition-all ${isGlobalTargetMet ? 'bg-white border-green-500' : 'bg-white border-red-500'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${isGlobalTargetMet ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}><BarChart3 size={28} /></div>
                  <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${isGlobalTargetMet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isGlobalTargetMet ? 'Global Target Met' : 'Global Target Not Met'}
                  </div>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Inventory Performance</p>
                <div className="flex items-baseline gap-2">
                  <h3 className={`text-4xl font-black italic ${isGlobalTargetMet ? 'text-green-600' : 'text-red-600'}`}>
                    {((totalCurrent / totalTarget) * 100).toFixed(1)}%
                  </h3>
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Efficiency</span>
                </div>
                <div className="mt-8 space-y-4">
                   <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${isGlobalTargetMet ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min((totalCurrent / totalTarget) * 100, 100)}%` }} />
                   </div>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-gray-500">
                      <span>Live: {totalCurrent.toLocaleString()} units</span>
                      <span>Target: {totalTarget.toLocaleString()} units</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- USER LIST VIEW --- */}
        {view === 'userList' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-6">
              <button onClick={() => setView('dashboard')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-[#F57C00] hover:text-white transition-all group"><ArrowLeft size={24} /></button>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Team Directory</h2>
            </div>
            <div className="relative w-full"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search..." className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent rounded-[2rem] text-sm font-bold outline-none focus:border-[#F57C00] shadow-sm transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{filteredUsers.map((user, i) => (
              <button key={i} onClick={() => { setSelectedUser(user); setView('userDetails'); }} className="flex items-center gap-5 p-8 rounded-[2.5rem] bg-white border-2 border-transparent hover:border-[#F57C00] hover:shadow-xl transition-all text-left group"><div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1C1C1C] group-hover:bg-[#F57C00] group-hover:text-white transition-colors"><Circle size={22} strokeWidth={3} /></div><div><h4 className="font-black text-slate-800 text-sm uppercase leading-tight italic">{user.name}</h4><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{user.role}</p></div></button>
            ))}</div>
          </div>
        )}

        {/* --- USER DETAILS VIEW --- */}
        {view === 'userDetails' && selectedUser && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-200 pb-10">
              <div className="flex items-center gap-6"><button onClick={() => setView('userList')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-[#1C1C1C] hover:text-white transition-all"><ArrowLeft size={24} /></button><div><h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{selectedUser.name}</h2><p className="text-[#F57C00] text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">{selectedUser.branch} Operations</p></div></div>
              <button onClick={() => router.push(selectedUser.path)} className="flex items-center justify-center gap-3 px-10 py-5 bg-[#1C1C1C] text-[#F57C00] rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#F57C00] hover:text-[#1C1C1C] transition-all shadow-2xl shadow-black/20 italic"><ExternalLink size={18} strokeWidth={3} /> Enter {selectedUser.role} Account</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-6"><h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-2">Recent Activity Log</h3>{selectedUser.history.map((dayLog: any, idx: number) => (
              <div key={idx} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm"><button onClick={() => setExpandedDay(expandedDay === dayLog.day ? null : dayLog.day)} className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"><div className="flex items-center gap-5 text-left"><div className="w-12 h-12 rounded-2xl bg-[#F57C00]/10 flex items-center justify-center text-[#F57C00]"><Clock size={20} strokeWidth={3} /></div><div><h4 className="font-black text-slate-900 text-sm uppercase italic">{dayLog.day}</h4><p className="text-xs text-gray-400 font-bold uppercase">{dayLog.summary}</p></div></div>{expandedDay === dayLog.day ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button>
              {expandedDay === dayLog.day && (<div className="px-8 pb-8 space-y-4 animate-in fade-in duration-300"><div className="h-0.5 bg-gray-50 mb-6" />{dayLog.movements.map((move: any, mIdx: number) => (
                <div key={mIdx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 italic"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1C1C1C] shadow-sm"><Activity size={16} strokeWidth={3} /></div><div><p className="text-xs font-black uppercase">{move.item}</p><p className="text-[10px] font-bold text-gray-400">{move.time}</p></div></div><span className="text-xs font-black text-[#F57C00]">{move.qty}</span></div>
              ))}</div>)}</div>
            ))}</div><div className="space-y-6"><div className="bg-[#1C1C1C] rounded-[2.5rem] p-8 text-white space-y-8 shadow-xl"><div className="flex items-center gap-3 text-[#F57C00]"><ShieldCheck size={24} strokeWidth={3} /><h4 className="font-black uppercase text-xs tracking-widest italic">Security Profile</h4></div><div className="space-y-6"><div className="flex justify-between items-center pb-4 border-b border-white/10"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Access Mode</span><span className="text-[10px] font-black text-[#F57C00] uppercase italic tracking-widest">Administrative</span></div><div className="flex justify-between items-center"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Sync</span><span className="text-[10px] font-black text-white">4 mins ago</span></div></div></div></div></div>
          </div>
        )}
      </div>
    </div>
  );
}