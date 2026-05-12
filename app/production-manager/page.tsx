'use client';

// 1. ADDED useEffect for fetching data
import React, { useState, useEffect } from 'react';
// 2. ADDED useRouter for security redirect
import { useRouter } from 'next/navigation'; 
import { 
  Scale, ChefHat, ShoppingCart, AlertTriangle, ArrowRight,
  ArrowLeft, Edit2, Trash2, Search, Clock, Package, Truck,
  Users, UserCircle, Star, Calendar, UtensilsCrossed 
} from 'lucide-react';

// --- NEW: INTERFACE TO FIX TYPESCRIPT ts(2339) ERROR ---
interface DashboardItem {
  id: number;
  item: string;
  qty: string;
  time: string;
  status: string;
  target?: string; // The '?' makes this optional, fixing the TS error!
}

export default function ProductionManagerDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('Dashboard');
  
  // --- STATE TO MANAGE ALL DATA (Now strongly typed!) ---
  const [allData, setAllData] = useState<Record<string, DashboardItem[]>>({
    Measured: [
      { id: 1, item: 'White Bread Dough', qty: '50 kg', time: '08:00 AM', status: 'Ready to Bake' },
    ],
    Delivered: [
      { id: 1, item: 'Brown Bread', qty: '100 pcs', time: '09:00 AM', status: 'In Transit' },
    ],
    Baked: [
      { id: 1, item: 'White Bread', qty: '500 pcs', time: '09:45 AM', status: 'Cooling' },
    ],
    Orders: [
      { id: 1, item: 'Kabuga Order #101', qty: '300 Bread', time: '10 min ago', status: 'Pending' },
    ],
    Distribution: [
      { id: 1, item: 'big milk', qty: '10 pcs', target: 'Clients', time: '07:00 AM', status: 'Sent' },
    ],
    Damaged: [
      { id: 1, item: 'Burnt Bread', qty: '12 pcs', time: 'Yesterday', status: 'Reported' },
    ]
  });

  // --- FETCH DATA FROM API ON LOAD ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProductionData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      try {
        const response = await fetch(`${baseUrl}/production/details`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Map the backend data into your exact UI structure
          setAllData({
            Measured: data.measured?.map((m: any) => ({ id: m.id, item: m.name, qty: `${m.quantity} ${m.unit}`, time: 'Today', status: 'Ready' })) || [],
            Baked: data.baked?.map((b: any) => ({ id: b.id, item: b.product?.name || `Product #${b.product_id}`, qty: `${b.quantity} pcs`, time: 'Today', status: 'Baked' })) || [],
            Distribution: data.distribution?.map((d: any) => ({ id: d.id, item: d.product?.name || `Product #${d.product_id}`, qty: `${d.quantity} pcs`, target: d.category, time: 'Today', status: 'Sent' })) || [],
            Delivered: data.delivered?.map((d: any) => ({ id: d.id, item: `Product #${d.product_id}`, qty: `${d.quantity} pcs`, time: 'Today', status: 'Delivered' })) || [],
            Orders: data.orders?.map((o: any) => ({ id: o.id, item: `${o.location} Order`, qty: '-', time: 'Today', status: o.status })) || [],
            Damaged: data.damaged?.map((d: any) => ({ id: d.id, item: `Product #${d.product_id}`, qty: `${d.quantity} pcs`, time: 'Today', status: 'Reported' })) || []
          });
        }
      } catch (err) {
        console.error("Failed to fetch production details", err);
      }
    };

    fetchProductionData();
  }, [router]);

  // --- HANDLE EDIT WITH API (PUT) ---
  const handleEdit = async (category: string, id: number) => {
    const currentItems = allData[category];
    const itemToEdit = currentItems.find(i => i.id === id);
    
    if (itemToEdit) {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
      
      let endpoint = '';
      let payload = {};

      if (category === 'Orders') {
         // Orders edit status, not quantity
         const newStatus = prompt(`Edit status for ${itemToEdit.item}:`, itemToEdit.status);
         if (!newStatus) return;
         endpoint = `${baseUrl}/production/orders/${id}`;
         payload = { status: newStatus };
      } else if (category === 'Distribution') {
         // Distribution edits quantity and category
         const currentQtyMatch = itemToEdit.qty.toString().match(/\d+/);
         const currentQtyNum = currentQtyMatch ? currentQtyMatch[0] : itemToEdit.qty;
         const newQtyStr = prompt(`Edit quantity for ${itemToEdit.item}:`, currentQtyNum);
         const newQty = parseInt(newQtyStr || '');
         if (!newQty || isNaN(newQty)) return;
         
         const newTarget = prompt(`Edit Target Category (e.g. Events, Tiku) for ${itemToEdit.item}:`, itemToEdit.target || '');
         if (!newTarget) return;

         endpoint = `${baseUrl}/production/distribution/${id}`;
         payload = { quantity: newQty, category: newTarget };
      } else {
         // Everything else (Measured, Baked, Delivered) edits quantity
         const currentQtyMatch = itemToEdit.qty.toString().match(/\d+/);
         const currentQtyNum = currentQtyMatch ? currentQtyMatch[0] : itemToEdit.qty;
         const newQtyStr = prompt(`Edit quantity for ${itemToEdit.item}:`, currentQtyNum);
         const newQty = parseInt(newQtyStr || '');
         if (!newQty || isNaN(newQty)) return;

         payload = { quantity: newQty };
         
         if (category === 'Measured') endpoint = `${baseUrl}/production/stock/${id}`;
         else if (category === 'Baked') endpoint = `${baseUrl}/production/production/${id}`;
         else if (category === 'Delivered') endpoint = `${baseUrl}/production/delivery/${id}`;
      }

      try {
        if (endpoint) {
           const response = await fetch(endpoint, {
               method: 'PUT',
               headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(payload)
           });
           if (!response.ok) {
               alert("Failed to update on server");
               return;
           }
        }

        // Update local UI state
        const updatedItems = currentItems.map(i => {
           if (i.id === id) {
              let updatedI = { ...i };
              if (category === 'Orders') {
                 updatedI.status = (payload as any).status;
              } else if (category === 'Distribution') {
                 updatedI.qty = i.qty.toString().replace(/\d+/, (payload as any).quantity.toString());
                 updatedI.target = (payload as any).category;
              } else {
                 updatedI.qty = i.qty.toString().replace(/\d+/, (payload as any).quantity.toString());
              }
              return updatedI;
           }
           return i;
        });
        
        setAllData({ ...allData, [category]: updatedItems });

      } catch (e) { console.error(e); }
    }
  };

  // --- HANDLE DELETE WITH API (DELETE) ---
  const handleDelete = async (category: string, id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
    
    // Use the exact DELETE endpoints provided in the documentation
    let endpoint = '';
    if (category === 'Measured') endpoint = `${baseUrl}/production/stock/${id}`;
    else if (category === 'Baked') endpoint = `${baseUrl}/production/production/${id}`;
    else if (category === 'Distribution') endpoint = `${baseUrl}/production/distribution/${id}`;
    else if (category === 'Delivered') endpoint = `${baseUrl}/production/delivery/${id}`;
    else if (category === 'Orders') endpoint = `${baseUrl}/production/orders/${id}`;
    else if (category === 'Damaged') endpoint = `${baseUrl}/production/damage/${id}`;

    try {
        if (endpoint) {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok && response.status !== 204) {
                alert("Failed to delete from server");
                return;
            }
        }
        
        // Remove from local UI state
        const updatedItems = allData[category].filter(i => i.id !== id);
        setAllData({ ...allData, [category]: updatedItems });
    } catch (e) { console.error(e); }
  };

  const stats = [
    { label: 'Measured', fullLabel: 'Measured Products', value: allData.Measured.length.toString(), sub: 'Batches ready to bake', icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50', editable: true },
    { label: 'Baked', fullLabel: 'Baked Products', value: allData.Baked.length.toString(), sub: 'Completed today', icon: ChefHat, color: 'text-green-600', bg: 'bg-green-50', editable: true },
    { label: 'Distribution', fullLabel: 'Other Distributions', value: allData.Distribution.length.toString(), sub: 'Clients, Tiku, Guests', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', editable: true },
    { label: 'Delivered', fullLabel: 'Delivered Products', value: allData.Delivered.length.toString(), sub: 'Sent to shops', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50', editable: true },
    { label: 'Orders', fullLabel: 'Shop Orders', value: allData.Orders.length.toString(), sub: 'Incoming requests', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50', editable: true },
    { label: 'Damaged', fullLabel: 'Total Damaged', value: allData.Damaged.length.toString(), sub: 'Recorded losses', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', editable: true },
  ];

  const getDataForView = (view: string) => {
    const descriptions: any = {
      Measured: 'Batches prepared by Baker Assistant ready for oven.',
      Delivered: 'Products dispatched to various branch locations.',
      Baked: 'Finished goods ready for packaging or distribution.',
      Orders: 'Incoming requests from shop managers.',
      Distribution: 'Products sent to Clients, Tiku, Guests, and Events.',
      Damaged: 'Reported waste and damaged goods.'
    };

    return {
      desc: descriptions[view] || '',
      editable: true,
      data: allData[view] || []
    };
  };

  const pageInfo = getDataForView(currentView);

  return (
    // ONLY THIS LINE CHANGED: Added max-w-7xl mx-auto and adjusted padding so it doesn't hug the sidebar line
    <div className="max-w-7xl mx-auto min-h-screen bg-[#FDFDFD] p-4 md:p-8 lg:p-10 space-y-8 pb-10">
      
      {currentView === 'Dashboard' && (
        <>
        <div className="flex items-center gap-4 pt-6 no-print text-black">
        <h1 className="text-2xl font-black text-black uppercase tracking-tight">PRODUCTION MANAGER</h1>
      </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <button key={index} onClick={() => setCurrentView(stat.label)} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col text-left hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                    <stat.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="bg-gray-50 text-gray-400 group-hover:bg-[#5D4037] group-hover:text-white rounded-full p-2 transition-colors">
                    <Edit2 size={16} />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.fullLabel}</h3>
                  <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs font-medium mt-1 text-gray-400 group-hover:text-gray-600 transition-colors">{stat.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {currentView !== 'Dashboard' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-6">
            <button onClick={() => setCurrentView('Dashboard')} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#5D4037] mb-2 text-sm font-bold transition-colors">
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{currentView} List</h1>
            <p className="text-gray-500 text-sm mt-1">{pageInfo.desc}</p>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#5D4037] flex items-center">
                {currentView} Items <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full ml-2 uppercase font-black tracking-widest">Editable</span>
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Search..." className="bg-gray-50 border border-gray-200 text-sm rounded-xl pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Item Name</th>
                    {currentView === 'Distribution' && <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Target</th>}
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-center">Quantity</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Time</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageInfo.data.map((row: any) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-[#5D4037] text-sm uppercase">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                            <Package size={16} />
                          </div>
                          {row.item}
                        </div>
                      </td>
                      {currentView === 'Distribution' && (
                        <td className="px-8 py-5 text-xs font-black text-orange-600 uppercase tracking-widest">
                          {row.target}
                        </td>
                      )}
                      <td className="px-8 py-5 text-center font-black text-gray-800 text-base">{row.qty}</td>
                      <td className="px-8 py-5 text-sm text-gray-500 font-medium">{row.time}</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(currentView, row.id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit2 size={16} /></button>
                          {/* UPDATED: Added onClick to the Trash button */}
                          <button onClick={() => handleDelete(currentView, row.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}