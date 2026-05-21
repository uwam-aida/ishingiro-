'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  LogOut,
  Save
} from 'lucide-react';

interface Employee {
  id: number;
  role: string;
  username: string;
  password: string;
  status: string;
  isSelf?: boolean;
  actualUserId?: number;
}

export default function ManagePasswordPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const users = await response.json();
          
          // Map backend users to employee format
          const mappedEmployees: Employee[] = users.map((user: any, index: number) => {
            let roleName = '';
            switch(user.role_id) {
              case 1: roleName = 'Marketing Manager'; break;
              case 2: roleName = 'Baker Assistant'; break;
              case 3: roleName = 'Shop Manager Kabuga'; break;
              case 4: roleName = 'Shop Manager Masaka'; break;
              case 5: roleName = 'Store Keeper'; break;
              case 6: roleName = 'Sales Coordinator'; break;
              case 7: roleName = 'Production Manager'; break;
              case 8: roleName = 'Chief of Finance'; break;
              case 9: roleName = 'CICM'; break;
              default: roleName = 'System User';
            }
            
            return {
              id: index + 1,
              actualUserId: user.id,
              role: roleName,
              username: user.name,
              password: '********',
              status: 'Active',
              isSelf: user.name === 'marketing_manager'
            };
          });
          
          setEmployees(mappedEmployees);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router, baseUrl]);

  // Update password on backend
  const handlePasswordChange = async (userId: number, actualUserId: number, newPass: string) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${baseUrl}/admin-reset/${actualUserId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_password: newPass })
      });
      
      return response.ok;
    } catch (error) {
      console.error("Failed to update password:", error);
      return false;
    }
  };

  const handlePasswordInputChange = async (id: number, actualUserId: number, newPass: string) => {
    if (newPass.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    setIsSaving(id);
    const success = await handlePasswordChange(id, actualUserId, newPass);
    
    if (success) {
      setEmployees(employees.map(emp => 
        emp.id === id ? { ...emp, password: newPass } : emp
      ));
      alert(`Password updated successfully for ${employees.find(e => e.id === id)?.role}`);
    } else {
      alert("Failed to update password. Please try again.");
    }
    
    setIsSaving(null);
  };

  const togglePermission = async (id: number, actualUserId: number, isSelf: boolean, currentStatus: string) => {
    if (isSelf) {
      alert("Security Alert: You cannot pause your own Administrative account!");
      return;
    }
    
    // This would require a backend endpoint to disable/enable users
    // For now, just update local state
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === "Active" ? "Paused" : "Active" } 
        : emp
    ));
  };

  // Logout
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
    return (
      <div className="bg-[#FAFAFB] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F57C00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFB] min-h-screen p-6 md:p-12 font-sans text-[#1C1C1C]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Logout Button */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
          >
            <LogOut size={16} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

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
              <p className="text-[#F57C00] text-[11px] font-black uppercase tracking-[0.3em] mt-1">{employees.length} Team Roles Detected</p>
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
                  onClick={() => togglePermission(emp.id, emp.actualUserId || emp.id, !!emp.isSelf, emp.status)}
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
                      value={emp.password === '********' ? '' : emp.password}
                      placeholder="Enter new password..."
                      disabled={emp.status !== 'Active'}
                      onChange={(e) => {
                        if (e.target.value.length >= 6) {
                          handlePasswordInputChange(emp.id, emp.actualUserId || emp.id, e.target.value);
                        }
                      }}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-[#1C1C1C] focus:border-[#F57C00] focus:bg-white outline-none transition-all disabled:opacity-20"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const newPass = prompt(`Enter new password for ${emp.role}:`);
                    if (newPass && newPass.length >= 6) {
                      handlePasswordInputChange(emp.id, emp.actualUserId || emp.id, newPass);
                    } else if (newPass) {
                      alert("Password must be at least 6 characters");
                    }
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
                    <><Save size={14} strokeWidth={3} /> Update Password</>
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