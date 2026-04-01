'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, Loader2, ArrowRight, HelpCircle, X, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

// --- HELPER: TYPO DETECTION (Levenshtein Distance) ---
function getEditDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}

export default function LoginPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // --- MANAGER OVERRIDE STATE ---
  const [managerKey, setManagerKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const MASTER_KEY = "ishingiro-admin-2026"; // The key the Marketing Manager will type

  // --- THE 9 ROLES CONFIGURATION ---
  const rolesMap: { [key: string]: string } = {
    "kabuga-shop-manager": "/kabuga-shop",
    "masaka-shop-manager": "/masaka-shop",
    "store-keeper": "/store-keeper",
    "baker-assistant": "/baker-assistant",
    "sales-coordinator": "/sales",
    "marketing-manager": "/marketing",
    "chief-of-finance": "/finance",
    "production-manager": "/production",
    "cicm": "/cicm"
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsShaking(false);

    const cleanUser = username.trim().toLowerCase().replace(/\s+/g, '-');
    const cleanPass = password.trim();

    setTimeout(() => {
      // Allow login if perfect match OR if Manager has Unlocked the field
      if (rolesMap[cleanUser]) {
        // --- CUSTOM PASSWORD LOGIC ---
        // Marketing Manager gets 'mrkt manager 2026', everyone else gets 'password'
        const isMarketing = cleanUser === "marketing-manager";
        const correctPassword = isMarketing ? "mrkt manager 2026" : "password";

        if (cleanPass === correctPassword || isUnlocked) {
          router.push(rolesMap[cleanUser]);
          return;
        }
      } 
      
      // 2. Check for Typos (Fuzzy Matching)
      const validUsernames = Object.keys(rolesMap);
      const typoMatch = validUsernames.find(role => getEditDistance(cleanUser, role) <= 4);

      if (typoMatch) {
        triggerError(`User not found. Did you mean '${typoMatch.replace(/-/g, ' ')}'?`);
      } else {
        triggerError("Invalid credentials. Please check your spelling.");
      }
    }, 1200);
  };

  const handleManagerOverride = () => {
    if (managerKey === MASTER_KEY) {
      setIsUnlocked(true);
      setShowForgotModal(false);
      setError("");
      // No alert needed, the UI will change to green
    } else {
      alert("Invalid Manager Key! Please try again.");
    }
  };

  const triggerError = (message: string) => {
    setError(message);
    setIsLoading(false);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#5D4037]"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#5D4037] rounded-[2rem] shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500 cursor-pointer">
             <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#5D4037] uppercase tracking-tighter">Ishingiro</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Bakery Management System</p>
          </div>
        </div>

        <div className={`bg-white p-8 rounded-[3rem] border border-gray-100 shadow-2xl transition-all duration-300 ${isShaking ? 'translate-x-2 border-red-200' : ''}`}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D4037]" size={18} />
                <input 
                  type="text" required placeholder="e.g. baker assistant" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-800 outline-none focus:border-[#5D4037] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#5D4037]" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder={isUnlocked ? "UNLOCKED BY MANAGER" : "••••••••"} 
                  value={password}
                  disabled={isUnlocked}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-800 outline-none focus:border-[#5D4037] focus:bg-white transition-all ${isUnlocked ? 'text-green-600 bg-green-50 border-green-200' : ''}`}
                />
                {!isUnlocked ? (
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#5D4037]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                ) : (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[10px] font-black uppercase">
                <AlertCircle size={14} /> <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#5D4037] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-[#5D4037]/20 transition-all">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={16}/></>}
            </button>
          </form>

          {!isUnlocked && (
            <button onClick={() => setShowForgotModal(true)} className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase flex items-center justify-center gap-2 hover:text-[#5D4037] transition-colors">
              <ShieldCheck size={14} /> Forgot details? (Manager Access)
            </button>
          )}
        </div>
      </div>

      {/* MODAL: MANAGER OVERRIDE */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full p-8 rounded-[2.5rem] relative shadow-2xl border-4 border-[#5D4037]">
            <button onClick={() => setShowForgotModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={20}/></button>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-[#5D4037] text-white rounded-xl flex items-center justify-center mx-auto mb-2">
                <ShieldCheck size={24}/>
              </div>
              <h3 className="text-xl font-black text-[#5D4037] uppercase tracking-tight">Manager Auth</h3>
              <p className="text-gray-500 font-bold text-xs leading-relaxed">
                Manager, please enter your <span className="text-[#5D4037] font-black underline">Master Key</span> to unlock this login session.
              </p>
              
              <input 
                type="password" 
                placeholder="Enter Master Key" 
                value={managerKey}
                onChange={(e) => setManagerKey(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-slate-100 rounded-xl font-bold text-center outline-none focus:border-[#5D4037]"
              />

              <button 
                onClick={handleManagerOverride}
                className="w-full py-4 bg-[#5D4037] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95"
              >
                Authorize This Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}