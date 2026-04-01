'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { 
  Users, TrendingUp, ShieldCheck, Activity, 
  Search, ArrowLeft, Circle, Clock, ChevronDown, 
  ChevronUp, LayoutDashboard, Tag, PackagePlus, 
  PackageMinus, PackageCheck, ExternalLink, Eye, ArrowRight
} from 'lucide-react';

export default function MarketingManagerAdmin() {
  const router = useRouter();
  const [view, setView] = useState<'dashboard' | 'userList' | 'userDetails'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // --- THE FULL 8+1 TEAM STRUCTURE ---
  const allUsers = (() => {
    const users: any[] = [];
    
    // 1. Production Manager
    users.push({
      name: "Production Manager",
      branch: "Global",
      role: "Production Manager",
      path: '/production-manager',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'Batch Quality Control', movements: [{ item: 'Bread Batch A1', qty: '500', time: '04:00 AM' }] }]
    });

    // 2. Baker Assistant
    users.push({
      name: "Baker Assistant",
      branch: "Global",
      role: "Baker Assistant",
      path: '/baker-assistant',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'Oven Maintenance', movements: [{ item: 'Daily Baking', qty: 'Standard', time: '05:00 AM' }] }]
    });

    // 3. Store Keeper
    users.push({
      name: "Store Keeper",
      branch: "Kabuga",
      role: "Store Keeper",
      path: '/store-keeper',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'Inventory Audit', movements: [{ item: 'Wheat Flour', qty: '20 Bags', time: '09:00 AM' }] }]
    });

    // 4. Kabuga Shop Manager
    users.push({
      name: "Kabuga Shop Manager",
      branch: "Kabuga",
      role: "Shop Manager",
      path: '/kabuga-shop/shop-manager',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'Morning Sales Review', movements: [{ item: 'Cash Audit', qty: 'Verified', time: '10:00 AM' }] }]
    });

    // 5. Masaka Shop Manager
    users.push({
      name: "Masaka Shop Manager",
      branch: "Masaka",
      role: "Shop Manager",
      path: '/masaka-shop/shop-manager',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'Stock Arrival', movements: [{ item: 'Daily Delivery', qty: '150 Units', time: '09:45 AM' }] }]
    });

    // 6. Sales Coordinator
    users.push({
      name: "Sales Coordinator",
      branch: "Global",
      role: "Sales Coordinator",
      path: '/sales-coordinator',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'Wholesale Orders', movements: [{ item: 'Supermarket Order', qty: '300 Units', time: '11:00 AM' }] }]
    });

    // 7. Chief of Finance
    users.push({
      name: "Chief of Finance",
      branch: "Global",
      role: "Chief of Finance",
      path: '/chief-finance',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'Expense Verification', movements: [{ item: 'Supplier Payment', qty: 'RWF 500k', time: '10:30 AM' }] }]
    });

    // 8. CICM (Internal Audit)
    users.push({
      name: "CICM Admin",
      branch: "Global",
      role: "Internal Audit",
      path: '/cicm',
      status: 'Active Now',
      history: [{ day: 'Today', summary: 'System Log Review', movements: [{ item: 'Data Integrity', qty: 'Clean', time: '07:00 AM' }] }]
    });

    return users;
  })();

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAFAFB] min-h-screen font-sans text-[#1C1C1C]">
      
      {/* --- MAIN DASHBOARD VIEW --- */}
      <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12">
        {view === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2 border-l-8 border-[#F57C00] pl-6">
              <h1 className="text-4xl font-black uppercase tracking-tight italic">Executive Command</h1>
              <p className="text-[#F57C00] text-[11px] font-black uppercase tracking-[0.4em]">Marketing Manager Dashboard</p>
            </div>
            
            <div onClick={() => setView('userList')} className="bg-[#1C1C1C] p-10 rounded-[3rem] shadow-2xl cursor-pointer max-w-md group relative overflow-hidden transition-all hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-8 text-[#F57C00]/20 group-hover:text-[#F57C00]/40 transition-colors">
                  <Users size={120} />
                </div>
                <div className="relative z-10">
                  <div className="p-4 w-fit rounded-2xl bg-[#F57C00] text-white mb-6">
                    <Users size={28} />
                  </div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total System Users</p>
                  <h3 className="text-4xl font-black text-white italic">{allUsers.length} Active Roles</h3>
                  <p className="text-[10px] text-[#F57C00] font-black uppercase mt-6 flex items-center gap-2">Monitor all accounts <ArrowRight size={14}/></p>
                </div>
            </div>
          </div>
        )}

        {/* --- USER LIST VIEW --- */}
        {view === 'userList' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-6">
              <button onClick={() => setView('dashboard')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-[#F57C00] hover:text-white transition-all group">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Team Directory</h2>
            </div>

            <div className="relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or role..." 
                className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent rounded-[2rem] text-sm font-bold outline-none focus:border-[#F57C00] shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, i) => (
                <button key={i} onClick={() => { setSelectedUser(user); setView('userDetails'); }} className="flex items-center gap-5 p-8 rounded-[2.5rem] bg-white border-2 border-transparent hover:border-[#F57C00] hover:shadow-xl transition-all text-left group">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1C1C1C] group-hover:bg-[#F57C00] group-hover:text-white transition-colors">
                    <Circle size={22} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase leading-tight italic">{user.name}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- USER DETAILS VIEW (IMPERSONATION) --- */}
        {view === 'userDetails' && selectedUser && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-200 pb-10">
              <div className="flex items-center gap-6">
                <button onClick={() => setView('userList')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-[#1C1C1C] hover:text-white transition-all">
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{selectedUser.name}</h2>
                  <p className="text-[#F57C00] text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">{selectedUser.branch} Operations</p>
                </div>
              </div>

              <button 
                onClick={() => router.push(selectedUser.path)}
                className="flex items-center justify-center gap-3 px-10 py-5 bg-[#1C1C1C] text-[#F57C00] rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#F57C00] hover:text-[#1C1C1C] transition-all shadow-2xl shadow-black/20 italic"
              >
                <ExternalLink size={18} strokeWidth={3} /> Enter {selectedUser.role} Account
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-2">Recent Activity Log</h3>
                {selectedUser.history.map((dayLog: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setExpandedDay(expandedDay === dayLog.day ? null : dayLog.day)}
                      className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-5 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-[#F57C00]/10 flex items-center justify-center text-[#F57C00]">
                          <Clock size={20} strokeWidth={3} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-sm uppercase italic">{dayLog.day}</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase">{dayLog.summary}</p>
                        </div>
                      </div>
                      {expandedDay === dayLog.day ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>

                    {expandedDay === dayLog.day && (
                      <div className="px-8 pb-8 space-y-4 animate-in fade-in duration-300">
                        <div className="h-0.5 bg-gray-50 mb-6" />
                        {dayLog.movements.map((move: any, mIdx: number) => (
                          <div key={mIdx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 italic">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1C1C1C] shadow-sm">
                                <Activity size={16} strokeWidth={3} />
                              </div>
                              <div>
                                <p className="text-xs font-black uppercase">{move.item}</p>
                                <p className="text-[10px] font-bold text-gray-400">{move.time}</p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-[#F57C00]">{move.qty}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="bg-[#1C1C1C] rounded-[2.5rem] p-8 text-white space-y-8 shadow-xl">
                  <div className="flex items-center gap-3 text-[#F57C00]">
                    <ShieldCheck size={24} strokeWidth={3} />
                    <h4 className="font-black uppercase text-xs tracking-widest italic">Security Profile</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Access Mode</span>
                      <span className="text-[10px] font-black text-[#F57C00] uppercase italic tracking-widest">Administrative</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Sync</span>
                      <span className="text-[10px] font-black text-white">4 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}