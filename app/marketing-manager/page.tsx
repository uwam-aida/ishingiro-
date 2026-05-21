'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  Search,
  Key,
  RefreshCw,
  ChevronRight,
  Activity,      
  ExternalLink,
  UserCog,
  Bell,
  LogOut
} from 'lucide-react';

interface SystemUser {
  id: number;
  name: string;
  role_id: number;
  displayName: string;
  displayRole: string;
}

export default function MarketingManagerAdmin() {
  const router = useRouter();
  const [view, setView] = useState<'dashboard' | 'userList' | 'userDetails'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<SystemUser[]>([]);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // 1. FETCH USERS API (GET /api/users)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${baseUrl}/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          const mappedUsers = data
            .filter((user: any) => user.id.toString() !== currentUserId) 
            .map((user: any) => {
               const formattedName = user.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
               
               let displayRole = 'System Role';
               if(user.role_id === 2) displayRole = 'Baker Assistant';
               if(user.role_id === 3) displayRole = 'Shop Manager Kabuga';
               if(user.role_id === 4) displayRole = 'Shop Manager Masaka';
               if(user.role_id === 5) displayRole = 'Store Keeper';
               if(user.role_id === 6) displayRole = 'Sales Coordinator';
               if(user.role_id === 7) displayRole = 'Production Manager';
               if(user.role_id === 8) displayRole = 'Chief of Finance';
               if(user.role_id === 9) displayRole = 'CICM';

               return {
                  ...user,
                  displayName: formattedName,
                  displayRole: displayRole
               };
            });
          
          setAllUsers(mappedUsers);
        } else {
          const savedManagerToken = localStorage.getItem('manager_token');
          
          if (savedManagerToken) {
             localStorage.setItem('token', savedManagerToken);
             localStorage.removeItem('manager_token');
             window.location.reload();
             return;
          }
          
          setError('Failed to load users. Please check permissions.');
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError('Network error while loading users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router, baseUrl]);

  const filteredUsers = allUsers.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.displayRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showMessage = (text: string, type: 'success' | 'error') => {
      setActionMessage({ text, type });
      setTimeout(() => setActionMessage({ text: '', type: '' }), 5000);
  };

  // 2. GENERATE CODE API (POST /api/generate-code/{userId})
  const handleGenerateCode = async (userId: number) => {
    setGeneratedCode(null);
    showMessage('Generating code...', 'success');
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/generate-code/${userId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setGeneratedCode(data.code);
        showMessage(`Code Generated: ${data.code}`, 'success');
      } else {
        showMessage(`Error: ${data.message || 'Failed to generate code'}`, 'error');
      }
    } catch (err) {
      showMessage('Network error while generating code.', 'error');
    }
  };

  // 3. ADMIN RESET PASSWORD (POST /api/admin-reset/{userId})
  const handleAdminReset = async (userId: number) => {
    const newPass = prompt("Enter the new password for this user:");
    if (!newPass || newPass.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    showMessage('Resetting password...', 'success');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/admin-reset/${userId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({ new_password: newPass })
      });
      
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message || 'Password successfully updated.', 'success');
      } else {
        showMessage(`Error: ${data.message || 'Failed to reset password'}`, 'error');
      }
    } catch (err) {
       showMessage('Network error while resetting password.', 'error');
    }
  };

  // 4. IMPERSONATE USER (POST /api/impersonate/{userId})
  const handleImpersonate = async (userId: number, userName: string) => {
    showMessage(`Switching to ${userName}'s account...`, 'success');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/impersonate/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('manager_token', token || '');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        
        let redirectPath = '/';
        const nameLower = data.user.name.toLowerCase();

        if (nameLower.includes('baker')) {
            redirectPath = '/baker-assistant';
        } 
        else if (nameLower.includes('kabuga')) {
            redirectPath = `/kabuga/shop-manager`;
        } 
        else if (nameLower.includes('masaka')) {
            redirectPath = `/masaka/shop-manager`;
        } 
        else if (nameLower.includes('store')) {
            redirectPath = '/store-keeper';
        }
        else if (nameLower.includes('sales')) {
            redirectPath = '/sales-coordinator';
        }
        else if (nameLower.includes('finance')) {
            redirectPath = '/chief-finance';
        }
        else if (nameLower.includes('production')) {
            redirectPath = '/production-manager';
        }
        else if (nameLower.includes('cicm')) {
            redirectPath = '/cicm';
        }

        window.location.href = redirectPath;

      } else {
         const errorData = await response.json();
         showMessage(`Impersonation failed: ${errorData.message || 'Unauthorized'}`, 'error');
      }
    } catch (err) {
      showMessage('Network error while trying to impersonate.', 'error');
    }
  };

  // 5. LOGOUT (POST /api/logout)
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Loading Executive Workspace...</div>;
  }

  if (error) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md">
                 <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
                 <h2 className="text-xl font-bold text-gray-900 mb-2">Access Error</h2>
                 <p className="text-gray-600 mb-6">{error}</p>
                 <button onClick={() => router.push('/login')} className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600">Return to Login</button>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-[#FAFAFB] min-h-screen font-sans text-[#1C1C1C]">
      <div className="p-6 md:p-12 max-w-6xl mx-auto">
        
        {/* Logout Button in Top Right */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
          >
            <LogOut size={16} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {view === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 border-l-8 border-[#F57C00] pl-6">
              <h2 className="text-4xl font-black uppercase tracking-tight italic">Executive Command</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">System Overview</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div onClick={() => setView('userList')} className="bg-[#1C1C1C] p-8 rounded-[2rem] shadow-xl cursor-pointer group relative overflow-hidden transition-all hover:-translate-y-1">
                    <div className="absolute -top-4 -right-4 p-8 text-[#F57C00]/10 group-hover:text-[#F57C00]/20 transition-colors"><Users size={140} /></div>
                    <div className="relative z-10">
                        <div className="p-3 w-fit rounded-xl bg-[#F57C00] text-white mb-6 shadow-lg shadow-[#F57C00]/30"><Users size={24} /></div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">System Access</p>
                        <h3 className="text-4xl font-black text-white italic">{allUsers.length} Users</h3>
                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[#F57C00] font-bold text-sm uppercase tracking-wider group-hover:text-white transition-colors">
                            Manage Accounts <ArrowRight size={18}/>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {view === 'userList' && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
               <div className="flex items-center gap-4">
                  <button onClick={() => setView('dashboard')} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"><ArrowRight size={20} className="rotate-180 text-gray-700" /></button>
                  <h2 className="text-xl font-black uppercase italic tracking-tight">User Directory</h2>
               </div>
               <div className="relative w-full sm:w-72">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input type="text" placeholder="Search users or roles..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F57C00] focus:border-transparent transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest px-6">
                    <div className="col-span-5 sm:col-span-4">User Details</div>
                    <div className="col-span-5 sm:col-span-4 hidden sm:block">System Role</div>
                    <div className="col-span-7 sm:col-span-4 text-right">Actions</div>
                </div>
                <div className="divide-y divide-gray-100">
                    {filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 font-medium">No users found matching "{searchQuery}"</div>
                    ) : (
                        filteredUsers.map((user) => (
                        <div key={user.id} className="grid grid-cols-12 gap-4 p-4 px-6 items-center hover:bg-orange-50/30 transition-colors">
                            <div className="col-span-8 sm:col-span-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1C1C1C] text-[#F57C00] flex items-center justify-center font-bold text-sm shadow-sm">
                                    {user.displayName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{user.displayName}</p>
                                    <p className="text-xs text-gray-500 font-medium sm:hidden">{user.displayRole}</p>
                                </div>
                            </div>
                            <div className="col-span-4 hidden sm:flex items-center">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold tracking-wide">{user.displayRole}</span>
                            </div>
                            <div className="col-span-4 sm:col-span-4 flex justify-end">
                                <button 
                                    onClick={() => { setSelectedUser(user); setView('userDetails'); setActionMessage({text:'', type:''}); }} 
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F57C00] text-white rounded-lg text-xs font-bold hover:bg-[#E67000] transition-colors shadow-md shadow-orange-500/20"
                                >
                                    Manage <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )))}
                </div>
            </div>
          </div>
        )}

        {view === 'userDetails' && selectedUser && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-400 max-w-4xl mx-auto">
            <button onClick={() => setView('userList')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-4">
                <ArrowRight size={16} className="rotate-180" /> Back to Directory
            </button>

            <div className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] text-[#F57C00] flex items-center justify-center shadow-lg shadow-black/10">
                        <UserCog size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedUser.displayName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded">ID: {selectedUser.id}</span>
                            <span className="text-sm font-bold text-gray-500">{selectedUser.displayRole}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">System Username: {selectedUser.name}</p>
                    </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 sm:max-w-[200px]">
                    <p className="text-xs text-orange-800 font-medium leading-relaxed">
                        You are viewing management controls for <span className="font-bold">{selectedUser.displayName}</span>. All actions are logged.
                    </p>
                </div>
            </div>

            {/* Generated Code Display */}
            {generatedCode && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Reset Code</p>
                <p className="text-2xl font-black text-blue-800 font-mono tracking-wider">{generatedCode}</p>
                <p className="text-[9px] text-blue-500 mt-1">Share this code with the user. It expires in 10 minutes.</p>
              </div>
            )}

            {actionMessage.text && (
                <div className={`p-4 rounded-xl border font-bold text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 ${actionMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {actionMessage.type === 'success' ? <ShieldCheck size={18} /> : <RefreshCw size={18} />}
                    {actionMessage.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 text-gray-900 mb-6">
                        <Key size={20} className="text-[#F57C00]" />
                        <h3 className="font-black uppercase text-sm tracking-widest">Security Controls</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="border border-gray-100 rounded-xl p-4">
                            <h4 className="font-bold text-sm text-gray-900 mb-1">Generate Reset Code</h4>
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Generate a temporary 6-digit code so the user can reset their own password via the login screen.</p>
                            <button onClick={() => handleGenerateCode(selectedUser.id)} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-md">
                                Get Reset Code
                            </button>
                        </div>

                        <div className="border border-red-100 bg-red-50/30 rounded-xl p-4">
                            <h4 className="font-bold text-sm text-red-900 mb-1">Force Password Reset</h4>
                            <p className="text-xs text-red-700/70 mb-4 leading-relaxed">Directly set a new password for this user. They will be logged out immediately.</p>
                            <button onClick={() => handleAdminReset(selectedUser.id)} className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:border-red-300 transition-colors">
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1C1C1C] rounded-[2rem] p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-6 text-white/5 pointer-events-none">
                        <Activity size={180} />
                    </div>
                    
                    <div className="relative z-10 space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-white mb-6">
                            <ExternalLink size={20} className="text-[#F57C00]" />
                            <h3 className="font-black uppercase text-sm tracking-widest">Impersonation</h3>
                        </div>
                        <h4 className="font-bold text-lg text-white">Enter Account</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Log into the system exactly as <strong className="text-white">{selectedUser.displayName}</strong>. You will see their exact dashboard and permissions.
                        </p>
                        <p className="text-xs text-[#F57C00] font-medium bg-[#F57C00]/10 px-3 py-2 rounded-lg border border-[#F57C00]/20 inline-block">
                            Warning: Actions taken while impersonating will be logged under their name.
                        </p>
                    </div>

                    <button onClick={() => handleImpersonate(selectedUser.id, selectedUser.displayName)} className="relative z-10 w-full py-4 bg-[#F57C00] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#E67000] transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                        Impersonate User <ArrowRight size={18} />
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}