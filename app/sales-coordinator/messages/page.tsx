'use client';

import React, { useState } from 'react';
import { Send, Users, CheckCircle2, AlertCircle, Loader2, MessageSquare, Megaphone, UserCircle2 } from 'lucide-react';

export default function SalesBroadcastPage() {
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- THE TARGET ROLES ---
  const targetRoles = [
    { id: 'all', label: 'All Staff (Allowed Roles)' },
    { id: 'kabuga-shop-manager', label: 'Kabuga Shop Manager' },
    { id: 'masaka-shop-manager', label: 'Masaka Shop Manager' },
    { id: 'store-keeper', label: 'Store Keeper' },
    { id: 'baker-assistant', label: 'Baker Assistant' },
    { id: 'production-manager', label: 'Production Manager' },
    { id: 'cicm', label: 'CICM (Audit)' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    
    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);
      setMessage('');
      
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
          <Megaphone size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1C1C1C]">Sales Dispatch</h1>
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Broadcast Center</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: FORM */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSendMessage} className="space-y-6">
            
            {/* RADIO BUTTON SELECTION */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Recipient Group</label>
              <div className="grid grid-cols-1 gap-2">
                {targetRoles.map((role) => (
                  <label 
                    key={role.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                      selectedRole === role.id 
                      ? 'border-blue-600 bg-blue-50/50' 
                      : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedRole === role.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
                        <UserCircle2 size={18} />
                      </div>
                      <span className={`text-sm font-bold ${selectedRole === role.id ? 'text-blue-900' : 'text-gray-600'}`}>
                        {role.label}
                      </span>
                    </div>
                    
                    <input 
                      type="radio"
                      name="role-selection"
                      value={role.id}
                      checked={selectedRole === role.id}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
              <textarea 
                placeholder="Type your announcement here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-[2rem] font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition-all resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSending || !message.trim()}
              className="w-full py-5 bg-[#1C1C1C] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 transition-all shadow-xl hover:bg-blue-600"
            >
              {isSending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Send Announcement <Send size={16} /></>
              )}
            </button>
          </form>

          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 font-bold text-sm animate-bounce">
              <CheckCircle2 size={20} /> Message dispatched to {selectedRole.replace(/-/g, ' ')}!
            </div>
          )}
        </div>

        {/* RIGHT: GUIDELINES */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
            <h3 className="text-blue-900 font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
              <AlertCircle size={14} /> Coordinator Rules
            </h3>
            <ul className="text-[11px] text-blue-700 space-y-3 font-bold leading-relaxed">
              <li>• Access restricted to Operations staff.</li>
              <li className="line-through opacity-50">• Marketing Manager (Hidden)</li>
              <li className="line-through opacity-50">• Chief of Finance (Hidden)</li>
              <li>• Announcements are logged for CICM audit.</li>
            </ul>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-[2rem] text-white">
            <MessageSquare className="mb-3 text-blue-400" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Note</p>
            <p className="text-xs font-bold leading-relaxed mt-1">Messages sent here will appear in the recipient's notification tray instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}