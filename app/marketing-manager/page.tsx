'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { 
  Users, TrendingUp, ShieldCheck, Activity, 
  Search, ArrowLeft, MapPin, Circle,
  CheckCircle2, Clock, ChevronDown, ChevronUp,
  LayoutDashboard, Tag, PackagePlus, PackageMinus, PackageCheck, PlusCircle
} from 'lucide-react';


export default function MarketingManagerAdmin() {
  const router = useRouter();
  const [view, setView] = useState<'dashboard' | 'userList' | 'userDetails'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Admin Dashboard', icon: LayoutDashboard, href: '/marketing-manager' },
    { name: 'Pricing Strategy', icon: Tag, href: '/marketing-manager/pricing' },
  ];

  // --- TEAM STRUCTURE LOGIC (CORRECTED HUB & SPOKE) ---
  const productionBranches = ['Kabuga', 'Masaka', 'Rwamagana', 'Nyakarambi', 'Mushikiri'];
  const allUsers = [...productionBranches, 'Kayonza'].flatMap(branch => {
    const isProd = productionBranches.includes(branch);
    
    // Initial roles based on branch type
    let roles = isProd 
      ? ['Shop Manager', 'Store Keeper', 'Production Manager', 'Baker Assistant'] 
      : ['Shop Manager'];

    // REMOVAL: Masaka and Kayonza do not have Store Keepers
    if (branch === 'Masaka' || branch === 'Kayonza') {
      roles = roles.filter(role => role !== 'Store Keeper');
    }

    return roles.map(role => {
      // Logic for Hub vs Local Store Keepers
      let hubSummary = 'Audit Active';
      let movements = [
        { type: 'entered', item: 'Morning Stock Count', qty: 'Standard', time: '08:00 AM', status: 'Verified' },
        { type: 'received', item: 'Daily Batch', qty: '120 Units', time: '09:30 AM', source: 'Production' }
      ];

      if (role === 'Store Keeper' && branch === 'Kabuga') {
        hubSummary = 'Managing Kabuga & Masaka requests';
        movements.push({ type: 'sent', item: 'Support Stock', qty: '50 Units', time: '11:00 AM', destination: 'Masaka' } as any);
      } else if (role === 'Store Keeper' && branch === 'Rwamagana') {
        hubSummary = 'Managing Rwamagana & Kayonza requests';
        movements.push({ type: 'sent', item: 'Support Stock', qty: '50 Units', time: '11:15 AM', destination: 'Kayonza' } as any);
      }

      return {
        name: `${branch} ${role}`,
        branch,
        role,
        status: 'Active Now',
        icon: Users,
        history: [{ 
          day: 'Today - Thursday', 
          summary: hubSummary, 
          movements: movements 
        }]
      };
    });
  });

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAFAFB] min-h-screen relative">
  
      {/* --- MOBILE HEADER (LOGO ONLY) --- */}
      <div className="md:hidden w-full bg-white border-b border-gray-100 px-6 py-6 flex flex-col items-center bg-white/95">
        
        <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mb-4">
          <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <div className="text-center mb-2">
          <h2 className="text-[#5D4037] font-black uppercase tracking-[0.25em] text-sm">Ishingiro</h2>
          
        </div>
      
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="p-6 md:p-10 space-y-10 max-w-6xl mx-auto">
        {view === 'dashboard' && (
          <div className="space-y-10">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Executive Command</h1>
              <div className="h-1.5 w-24 bg-[#A67C37]/30 rounded-full"></div>
            </div>
            
            <div onClick={() => setView('userList')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl cursor-pointer max-w-sm transition-all group">
                <div className="p-5 w-fit rounded-2xl bg-[#5D4037] text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-[#5D4037]/20">
                  <Users size={24} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1 tracking-widest">Total System Team</p>
                <h3 className="text-3xl font-black text-slate-900">{allUsers.length} People</h3>
            </div>
          </div>
        )}

        {view === 'userList' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('dashboard')} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-900 uppercase">Team Directory</h2>
            </div>

            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search teammate..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#5D4037]/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, i) => (
                <button key={i} onClick={() => { setSelectedUser(user); setView('userDetails'); }} className="flex items-center gap-5 p-6 rounded-[2.5rem] bg-white border border-slate-100 hover:border-[#A67C37] transition-all text-left">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#5D4037]"><Circle size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase">{user.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'userDetails' && selectedUser && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('userList')} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase leading-none">{selectedUser.name}</h2>
                <p className="text-[#A67C37] text-[10px] font-black uppercase tracking-widest mt-1">{selectedUser.branch} • Activity Tracking</p>
              </div>
            </div>

            <div className="space-y-4">
              {selectedUser.history.map((dayLog: any, idx: number) => (
                <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setExpandedDay(expandedDay === dayLog.day ? null : dayLog.day)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-full bg-[#5D4037]/5 flex items-center justify-center text-[#5D4037]">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm uppercase">{dayLog.day}</h4>
                        <p className="text-xs text-slate-400 font-bold">{dayLog.summary}</p>
                      </div>
                    </div>
                    {expandedDay === dayLog.day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {expandedDay === dayLog.day && (
                    <div className="px-6 pb-6 space-y-3 animate-in fade-in duration-300">
                      <div className="h-px bg-slate-100 mb-4" />
                      {dayLog.movements.map((move: any, mIdx: number) => (
                        <div key={mIdx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${
                              move.type === 'entered' ? 'bg-emerald-100 text-emerald-600' : 
                              move.type === 'sent' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {move.type === 'entered' && <PackageCheck size={16} />}
                              {move.type === 'sent' && <PackageMinus size={16} />}
                              {move.type === 'received' && <PackagePlus size={16} />}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 uppercase">{move.item}</p>
                              <p className="text-[10px] font-bold text-slate-400">
                                {move.time} • {move.type === 'sent' ? `To: ${move.destination}` : move.type === 'received' ? `From: ${move.source}` : `Status: ${move.status}`}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-700">{move.qty}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}