'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/layout/Sidebar';
import { 
  Users, TrendingUp, ShieldCheck, Activity, 
  Search, ArrowLeft, MapPin, Circle,
  CheckCircle2, Clock, ChevronDown, ChevronUp,
  LayoutDashboard, Tag, Menu
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

  // --- TEAM STRUCTURE LOGIC (PRESERVED) ---
  const productionBranches = ['Kabuga', 'Masaka', 'Rwamagana', 'Nyakarambi', 'Mushikiri'];
  const allUsers = [...productionBranches, 'Kayonza'].flatMap(branch => {
    const isProd = productionBranches.includes(branch);
    const roles = isProd ? ['Shop Manager', 'Store Keeper', 'Production Manager', 'Baker Assistant'] : ['Shop Manager', 'Store Keeper'];
    return roles.map(role => ({
      name: `${branch} ${role}`,
      branch,
      role,
      status: 'Active Now',
      icon: Users,
      history: [{ day: 'today-thursday', summary: 'Audit Active', movements: [] }]
    }));
  });

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAFAFB] min-h-screen relative">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        menuItems={menuItems}
        footerTitle="Marketing Manager"
        footerInitial="M"
      />

      {/* --- STICKY PROFESSIONAL VERTICAL MOBILE HEADER --- */}
      <div className="md:hidden w-full bg-white border-b border-gray-100 px-6 py-8 flex flex-col items-center shadow-md sticky top-0 z-40 backdrop-blur-md bg-white/95">
        {/* 1. LOGO AT THE TOP */}
        <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mb-4">
          <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>

        {/* 2. TEXT IN THE MIDDLE */}
        <div className="text-center mb-6">
          <h2 className="text-[#5D4037] font-black uppercase tracking-[0.25em] text-sm">Ishingiro</h2>
          <p className="text-[#A67C37] text-[10px] font-black uppercase tracking-widest mt-1">Marketing Management Admin</p>
        </div>
        
        {/* 3. MENU BUTTON AT THE BOTTOM */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center justify-center gap-3 w-full max-w-[200px] py-4 bg-[#5D4037] text-white rounded-2xl shadow-lg active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest"
        >
          <Menu size={18} /> Menu
        </button>
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
          <div className="space-y-8">
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
                  <h4 className="font-bold text-slate-800 text-sm uppercase">{user.name}</h4>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}