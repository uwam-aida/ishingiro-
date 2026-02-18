'use client';

import React, { useState } from 'react';
import { Search, Package, AlertTriangle, PenSquare, X, Save, Check, Store } from 'lucide-react';

export default function ProductionProducts() {
  const [activeTab, setActiveTab] = useState<'order_per_piece' | 'shop_stock' | 'damaged'>('order_per_piece');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. DATA STATE
  const [products, setProducts] = useState([
    { id: 1, name: 'Bread', quantity: '100', unit: 'piece', orderedBy: 'Shop manager', status: 'ordered', category: 'order_per_piece' },
    { id: 2, name: 'Birthday Cake', quantity: '1', unit: 'piece', orderedBy: 'Shop manager', status: 'ordered', category: 'order_per_piece' },
    { id: 3, name: 'Biscuits', quantity: '5', unit: 'pieces', orderedBy: 'Shop manager', status: 'damaged', category: 'damaged' },
  ]);

  // 2. EDIT MODAL STATE
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // --- FUNCTIONS ---
  const handleEditClick = (item: any) => {
    setEditingItem({ ...item }); 
    setIsEditOpen(true);
  };

  const handleSaveChanges = () => {
    setProducts((prev) => 
      prev.map((p) => (p.id === editingItem.id ? editingItem : p))
    );
    setIsEditOpen(false);
  };

  const filteredData = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 relative">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products Management</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">Manage your products inventory by category</p>
      </div>

      {/* --- TABS --- */}
      <div className="bg-[#EAEAEA] p-1.5 rounded-2xl flex items-center gap-6 w-full md:w-auto overflow-x-auto">
        
        {/* Order Per Piece Button */}
        <button 
          onClick={() => setActiveTab('order_per_piece')}
          className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize flex items-center justify-center gap-2 ${
            activeTab === 'order_per_piece' 
            ? 'bg-gray-100 text-gray-900 shadow-sm transform scale-[1.02] ring-1 ring-gray-200' 
            : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package size={18} />
          order per piece
        </button>

        {/* Shop Stock Button (Blue) */}
        <button 
          onClick={() => setActiveTab('shop_stock')}
          className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize flex items-center justify-center gap-2 ${
            activeTab === 'shop_stock' 
            ? 'bg-blue-50 text-blue-600 shadow-sm transform scale-[1.02] ring-1 ring-blue-100' 
            : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <Store size={18} />
          shop stock
        </button>

        {/* Damaged Button (Red) */}
        <button 
          onClick={() => setActiveTab('damaged')}
          className={`flex-1 md:flex-none px-10 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize flex items-center justify-center gap-2 ${
            activeTab === 'damaged' 
            ? 'bg-red-50 text-red-600 shadow-sm border border-red-100 transform scale-[1.02]' 
            : 'text-gray-500 hover:text-red-600'
          }`}
        >
          <AlertTriangle size={18} />
          damaged
        </button>

      </div>

      {/* --- MAIN CARD (Dynamic Border) --- */}
      <div className={`bg-white rounded-3xl p-8 shadow-sm border min-h-[600px] transition-colors duration-300 ${
        activeTab === 'damaged' ? 'border-red-50' : 
        activeTab === 'shop_stock' ? 'border-blue-50' : 
        'border-gray-100'
      }`}>
         
         <div className="space-y-6 mb-8">
            {/* Active Section Title (Dynamic Colors) */}
            <div className="flex items-center gap-3">
               <div className={`p-2.5 rounded-xl ${
                 activeTab === 'damaged' ? 'bg-red-50 text-red-600' : 
                 activeTab === 'shop_stock' ? 'bg-blue-50 text-blue-600' :
                 'bg-gray-100 text-gray-900'
               }`}>
                  {activeTab === 'damaged' ? <AlertTriangle size={20} /> : activeTab === 'shop_stock' ? <Store size={20} /> : <Package size={20} />}
               </div>
               <h2 className={`text-lg font-bold capitalize ${
                 activeTab === 'damaged' ? 'text-red-700' : 
                 activeTab === 'shop_stock' ? 'text-blue-700' :
                 'text-gray-900'
               }`}>
                 {activeTab.replace(/_/g, ' ')}
               </h2>
            </div>

            {/* Professional Search Bar */}
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <Search className="text-gray-400 group-focus-within:text-black transition-colors" size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder="Search Products..." 
                 className="w-full bg-[#EAEAEA] text-gray-900 pl-14 pr-6 py-4 rounded-2xl border-2 border-transparent focus:border-gray-200 focus:bg-white focus:outline-none transition-all font-semibold text-sm placeholder:text-gray-400 placeholder:font-medium"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>

         {/* --- TABLE --- */}
         <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-50">
                <th className="pb-4 pl-4 font-extrabold text-gray-900">Name</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">Unit</th>
                <th className="pb-4">Ordered by</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/80 transition-colors duration-200">
                  <td className="py-6 pl-4 font-bold text-gray-900 text-sm">{item.name}</td>
                  <td className="py-6 font-medium text-gray-900 text-sm">{item.quantity}</td>
                  <td className="py-6 text-sm text-gray-500 font-medium">{item.unit}</td>
                  <td className="py-6">
                    <span className="bg-[#F3F4F6] text-gray-700 text-xs font-bold px-4 py-1.5 rounded-lg capitalize border border-gray-100">
                      {item.orderedBy}
                    </span>
                  </td>
                  <td className="py-6">
                    <span className={`text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-wide border shadow-sm ${
                      item.status === 'ordered' ? 'bg-orange-500 text-white border-orange-500' :
                      item.status === 'damaged' ? 'bg-red-600 text-white border-red-600' :
                      'bg-black text-white border-black'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  
                  {/* Action Button - Precise Pencil Square */}
                  <td className="py-6 pr-4 text-right">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all duration-200 shadow-sm active:scale-95"
                    >
                      <PenSquare size={18} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Package size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- PROFESSIONAL EDIT MODAL --- */}
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsEditOpen(false)}
          />

          {/* Modal Card */}
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white/50">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Edit Product</h3>
                <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wide">ID: #{editingItem.id}</p>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              
              {/* Read Only Name */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-1">Product Name</label>
                 <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-gray-100 text-gray-500 text-sm font-bold flex items-center gap-3">
                   <Package size={18} className="text-gray-400" />
                   {editingItem.name}
                 </div>
              </div>

              {/* Editable Quantity */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-1">Update Quantity</label>
                 <input 
                   type="number"
                   value={editingItem.quantity}
                   onChange={(e) => setEditingItem({...editingItem, quantity: e.target.value})}
                   className="w-full bg-[#EAEAEA] border-transparent rounded-2xl p-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-100 outline-none transition-all placeholder:text-gray-400"
                   placeholder="0"
                 />
              </div>

              {/* Status Selector */}
              <div className="space-y-3">
                 <label className="text-xs font-bold text-gray-900 uppercase tracking-wide ml-1">Status</label>
                 <div className="grid grid-cols-3 gap-3">
                   {['ordered', 'damaged', 'available'].map((s) => (
                     <button
                       key={s}
                       onClick={() => setEditingItem({...editingItem, status: s})}
                       className={`py-3 rounded-xl text-xs font-bold uppercase border-2 transition-all flex items-center justify-center ${
                         editingItem.status === s 
                         ? 'bg-black text-white border-black shadow-md transform scale-[1.02]' 
                         : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-900'
                       }`}
                     >
                       {s}
                     </button>
                   ))}
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 pt-0 flex gap-4">
               <button 
                 onClick={() => setIsEditOpen(false)}
                 className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSaveChanges}
                 className="flex-[2] py-4 rounded-2xl font-bold bg-black text-white hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200 active:scale-[0.98]"
               >
                 <Check size={18} strokeWidth={3} /> Save Changes
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}