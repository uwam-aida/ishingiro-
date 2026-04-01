'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  RefreshCw, 
  ArrowLeft, 
  UserCog,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

export default function ManagePasswordPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<number | null>(null);

  // --- THE FULL 9 ROLES ---
  const [employees, setEmployees] = useState([
    { id: 1, role: "Kabuga Shop Manager", username: "kabuga-mgr", password: "password", status: "Active" },
    { id: 2, role: "Masaka Shop Manager", username: "masaka-mgr", password: "password", status: "Active" },
    { id: 3, role: "Store Keeper", username: "store-keeper", password: "password", status: "Active" },
    { id: 4, role: "Baker Assistant", username: "baker-assistant", password: "password", status: "Active" },
    { id: 5, role: "Sales Coordinator", username: "sales-coord", password: "password", status: "Active" },
    { id: 6, role: "Marketing Manager", username: "marketing-mgr", password: "mrkt manager 2026", status: "Active", isSelf: true }, 
    { id: 7, role: "Chief of Finance", username: "finance-chief", password: "password", status: "Active" },
    { id: 8, role: "Production Manager", username: "prod-mgr", password: "password", status: "Active" },
    { id: 9, role: "CICM", username: "cicm-admin", password: "password", status: "Active" },
  ]);

  const handlePasswordChange = (id: number, newPass: string) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, password: newPass } : emp));
  };

  const togglePermission = (id: number, isSelf: boolean) => {
    if (isSelf) {
      alert("Security Alert: You cannot pause your own Administrative account!");
      return;
    }
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === "Active" ? "Paused" : "Active" } 
        : emp
    ));
  };

  return (
    <div className="bg-[#FAFAFB] min-h-screen p-6 md:p-12 font-sans text-[#1C1C1C]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => router.back()} 
              className="p-4 bg-[#F57C00] rounded-2xl text-white shadow-lg shadow-[#F57C00]/20"
            >
              <ArrowLeft size={24} strokeWidth={3} />
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight italic text-[#1C1C1C]">Global Credentials</h1>
              <p className="text-[#F57C00] text-[11px] font-black uppercase tracking-[0.3em] mt-1">9 Team Roles Detected</p>
            </div>
          </div>
        </header>

        {/* ROLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((emp) => (
            <div key={emp.id} className={`bg-white rounded-[3rem] p-8 transition-all border-2 ${
              emp.status === 'Active' 
              ? 'border-gray-50 shadow-sm' 
              : 'border-gray-100 bg-gray-50/50 opacity-60 grayscale'
            }`}>
              
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${emp.status === 'Active' ? 'bg-[#F57C00]/10 text-[#F57C00]' : 'bg-gray-200 text-gray-400'}`}>
                  {emp.isSelf ? <ShieldCheck size={20} strokeWidth={3} /> : <Lock size={20} strokeWidth={3} />}
                </div>
                
                <button 
                  onClick={() => togglePermission(emp.id, !!emp.isSelf)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase px-5 py-2.5 rounded-xl transition-all active:scale-95 border-2 ${
                    emp.isSelf 
                    ? 'border-blue-100 text-blue-400 cursor-default' 
                    : emp.status === 'Active' 
                      ? 'border-gray-100 text-gray-400 hover:border-[#F57C00] hover:text-[#F57C00]' 
                      : 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                  }`}
                >
                  {emp.status === 'Active' ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                  {emp.isSelf ? 'Master Admin' : emp.status === 'Active' ? 'Pause Access' : 'Resume Access'}
                </button>
              </div>
              
              <div className="mb-8">
                <h4 className="font-black text-lg uppercase tracking-tighter leading-tight italic text-[#1C1C1C]">
                  {emp.role} {emp.isSelf && <span className="text-[#F57C00] text-[10px] ml-2">(YOU)</span>}
                </h4>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Username: {emp.username}</p>
              </div>
              
              <div className="space-y-4">
                {/* SPECIAL SECTION FOR MANAGER'S MASTER KEY */}
                {emp.isSelf && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-2">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <ShieldAlert size={12} /> System Master Key
                    </p>
                    <p className="text-xs font-mono font-bold text-blue-700">ishingiro-admin-2026</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Secret Code</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F57C00]" size={16} />
                    <input 
                      type="text" 
                      value={emp.password}
                      disabled={emp.status !== 'Active'}
                      onChange={(e) => handlePasswordChange(emp.id, e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-[#1C1C1C] focus:border-[#F57C00] focus:bg-white outline-none transition-all disabled:opacity-20"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setIsSaving(emp.id);
                    setTimeout(() => {
                      setIsSaving(null);
                      alert(`All set! ${emp.role}'s password updated.`);
                    }, 800);
                  }}
                  disabled={isSaving === emp.id || emp.status !== 'Active'}
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm ${
                    isSaving === emp.id 
                      ? 'bg-blue-500 text-white animate-pulse' 
                      : emp.status === 'Active' 
                        ? 'bg-[#1C1C1C] text-white hover:bg-[#F57C00] transition-all' 
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isSaving === emp.id ? (
                    <><RefreshCw size={14} className="animate-spin" /> Updating...</>
                  ) : (
                    <><CheckCircle2 size={14} strokeWidth={3} /> Finish & Sync</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}