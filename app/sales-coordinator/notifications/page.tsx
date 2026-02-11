'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  ShoppingCart, 
  CheckCircle, 
  MessageSquare,
  AlertCircle,
  Users
} from 'lucide-react';

export default function SalesNotifications() {
  
  // State to switch between "Inbox" and "Compose"
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');

  // FORM STATES
  const [recipient, setRecipient] = useState('All Branches (General)');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // MOCK DATA: Shop Orders
  const shopOrders = [
    { id: 1, branch: 'Kabuga Shop', type: 'Order', message: 'Urgent: Requesting 500 pcs of White Bread.', time: '10 min ago', status: 'Pending' },
    { id: 2, branch: 'Masaka Shop', type: 'Stock Alert', message: 'Low stock warning: Cakes remaining 5 pcs.', time: '1 hour ago', status: 'Reviewed' },
  ];

  // HANDLE SEND
  const handleSend = () => {
    if (!subject || !message) return; // Simple validation

    // Simulate sending logic
    setShowSuccess(true);
    
    // Hide success message after 3 seconds and reset form
    setTimeout(() => {
      setShowSuccess(false);
      setSubject('');
      setMessage('');
      setRecipient('All Branches (General)');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 space-y-8 pb-10">
      
      {/* --- MOBILE LOGO HEADER (New) --- */}
      <div className="md:hidden flex flex-col items-center justify-center mb-6 pt-2">
        <div className="w-16 h-16 bg-[#5D4037] rounded-full flex items-center justify-center overflow-hidden shadow-md mb-2">
           <img src="/logo.png" alt="Ishingiro" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-[#5D4037] font-black uppercase tracking-widest text-xs">Ishingiro</h2>
      </div>

      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications Center</h1>
        <p className="text-gray-500 text-sm mt-1">Manage incoming orders and broadcast announcements.</p>
      </div>

      {/* --- TABS --- */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'inbox' 
            ? 'bg-white text-[#5D4037] shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ShoppingCart size={16} /> Shop Orders
          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'compose' 
            ? 'bg-white text-[#5D4037] shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Send size={16} /> Send General
        </button>
      </div>

      {/* =========================================================
          TAB 1: SHOP ORDERS (INBOX)
         ========================================================= */}
      {activeTab === 'inbox' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {shopOrders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#5D4037]/30 transition-colors">
              
              <div className="flex items-start gap-4">
                {/* Icon based on Type */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  order.type === 'Order' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                }`}>
                  {order.type === 'Order' ? <ShoppingCart size={20} /> : <AlertCircle size={20} />}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{order.branch}</h3>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                      {order.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">{order.message}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{order.time}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                 <button className="px-4 py-2 bg-[#5D4037] text-white text-xs font-bold rounded-xl hover:bg-[#4a332a] transition-colors">
                   Approve
                 </button>
                 <button className="px-4 py-2 bg-gray-50 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors">
                   Details
                 </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          TAB 2: SEND GENERAL NOTIFICATION
         ========================================================= */}
      {activeTab === 'compose' && (
        <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
          
          {/* Success Message Alert */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 animate-in zoom-in duration-300">
              <CheckCircle size={20} className="fill-green-100 text-green-600" />
              <div>
                <p className="text-sm font-bold">Notification Sent Successfully!</p>
                <p className="text-xs opacity-90">Recipient: <span className="font-bold">{recipient}</span></p>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#5D4037]">Broadcast Message</h2>
                <p className="text-xs text-gray-400">This will appear in the recipient's notification inbox.</p>
              </div>
            </div>

            <form className="space-y-6">
              
              {/* Target Audience Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Users size={14} /> Send To
                </label>
                <div className="relative">
                  <select 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#5D4037]/20 outline-none appearance-none"
                  >
                    <optgroup label="General Groups">
                      <option>All Branches (General)</option>
                      <option>All Shop Managers</option>
                      <option>Production Team</option>
                    </optgroup>
                    <optgroup label="Specific Branches">
                      <option>Kabuga Shop Manager</option>
                      <option>Masaka Shop Manager</option>
                      <option>Kicukiro Shop Manager</option>
                    </optgroup>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Delivery Delay, New Stock Arrival..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#5D4037]/20 outline-none"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Message</label>
                <textarea 
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your notification here..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#5D4037]/20 outline-none resize-none"
                />
              </div>

              {/* Send Button */}
              <button 
                type="button" 
                onClick={handleSend}
                className="w-full bg-[#5D4037] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4a332a] transition-all active:scale-[0.98]"
              >
                <Send size={18} />
                Send to {recipient.includes('General') ? 'Everyone' : 'Selected'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}