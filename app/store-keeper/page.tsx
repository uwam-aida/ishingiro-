'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Package, Bell, ShoppingBag, AlertCircle, FileText, X, ArrowLeft, 
  CheckCheck, ClipboardList, Edit3, CheckSquare, Square, Printer, 
  ChefHat, ShieldAlert, PackageCheck, Download, Eye
} from 'lucide-react';

interface Product {
  name: string;
  price: number;
  category: string;
  type: string;
}

// --- OFFICIAL PRODUCT LIST (KEPT EXACTLY AS PROVIDED) ---
const FINANCE_PRODUCTS: Product[] = [
    { name: 'big milk', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'small milk', price: 600, category: 'BREAD', type: 'baked' },
    { name: 'pcpn', price: 1100, category: 'BREAD', type: 'baked' },
    { name: 'sen', price: 1000, category: 'BREAD', type: 'baked' },
    { name: 'salted bread', price: 1100, category: 'BREAD', type: 'baked' },
    { name: 'baguette', price: 500, category: 'BREAD', type: 'baked' },
    { name: 'milk slice bread', price: 200, category: 'BREAD', type: 'baked' },
    { name: 'crubes', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'sen pieces', price: 100, category: 'BREAD', type: 'baked' },
    { name: 'brown sanduich', price: 250, category: 'BREAD', type: 'baked' },
    { name: 'mult graine', price: 1300, category: 'BREAD', type: 'baked' },
    { name: 'milk mult graine', price: 1000, category: 'BREAD', type: 'baked' },
    { name: 'brown bread', price: 800, category: 'BREAD', type: 'baked' },
    { name: 'tea cake', price: 1000, category: 'CAKES', type: 'baked' },
    { name: 'marble cake', price: 1200, category: 'CAKES', type: 'baked' },
    { name: 'brown cake', price: 250, category: 'CAKES', type: 'baked' },
    { name: 'oliver corn cake', price: 350, category: 'CAKES', type: 'baked' },
    { name: 'muffin cake', price: 170, category: 'CAKES', type: 'baked' },
    { name: 'ishingiro', price: 150, category: 'AMANDAZI', type: 'baked' },
    { name: 's.begne', price: 70, category: 'AMANDAZI', type: 'baked' },
    { name: 'dark donut', price: 450, category: 'AMANDAZI', type: 'baked' },
    { name: 'choc donuts', price: 450, category: 'AMANDAZI', type: 'baked' },
    { name: 'kk donuts', price: 250, category: 'AMANDAZI', type: 'baked' },
    { name: 'triangle', price: 150, category: 'AMANDAZI', type: 'baked' },
    { name: 'meat samosa', price: 450, category: 'OTHERS', type: 'baked' },
    { name: 'biscuits', price: 85, category: 'OTHERS', type: 'baked' },
    { name: 'ISH.MILK Cookie', price: 130, category: 'OTHERS', type: 'baked' },
    { name: 'butter biscuits', price: 130, category: 'OTHERS', type: 'baked' },
    { name: 'chocolate biscuits', price: 140, category: 'OTHERS', type: 'baked' },
    { name: 'ubunyobwa', price: 1800, category: 'OTHERS', type: 'baked' },
    { name: 'ikinyuranyo 1kg', price: 1600, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 3kg', price: 4500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo 5kg', price: 7500, category: 'OTHERS', type: 'unbaked' },
    { name: 'ikinyuranyo (0.5)kg', price: 1200, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 1kg', price: 1700, category: 'OTHERS', type: 'unbaked' },
    { name: 'yellow c flour 3kg', price: 4800, category: 'OTHERS', type: 'unbaked' },
    { name: 'cashnewnuts', price: 5500, category: 'OTHERS', type: 'unbaked' },
    { name: 'cornfresh cream', price: 500, category: 'OTHERS', type: 'unbaked' },
    { name: 'cake 38000', price: 38000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 20000', price: 20000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 24000', price: 24000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 19000', price: 19000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake18000', price: 18000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 15000', price: 15000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 14000', price: 14000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 13000', price: 13000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 12000', price: 12000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 10000', price: 10000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 9000', price: 9000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 8000', price: 8000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 7000', price: 7000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cakes 6000', price: 6000, category: 'BIG CAKES', type: 'baked' },
    { name: 'cake 5000', price: 5000, category: 'BIG CAKES', type: 'baked' },
    { name: 'ADDCAKE', price: 2000, category: 'BIG CAKES', type: 'baked' },
];

export default function StoreKeeperDashboard() {
  const router = useRouter(); 
  const params = useParams();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // --- STATE INITIALIZATION ---
  const [activeFilter, setActiveFilter] = useState<'baked_log' | 'requests' | 'my_stock' | 'delivered' | 'damaged' | 'notes' | 'cake_orders' | 'cake_requests' | 'full_history'>('requests');  
  const [deliveryNote, setDeliveryNote] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editQty, setEditQty] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // Live API States
  const [myStock, setMyStock] = useState<any[]>([]);
  const [shopRequests, setShopRequests] = useState<any[]>([]);
  const [cakeOrders, setCakeOrders] = useState<any[]>([]);
  const [cakeRequests, setCakeRequests] = useState<any[]>([]);
  const [deliveryHistory, setDeliveryHistory] = useState<any[]>([]);
  const [damagedProducts, setDamagedProducts] = useState<any[]>([]);
  const [bakedProducts, setBakedProducts] = useState<any[]>([]);
  const [issuedNotes, setIssuedNotes] = useState<any[]>([]);
  
  // NEW STATE FOR DELIVERY NOTES API
  const [deliveryNotesList, setDeliveryNotesList] = useState<any[]>([]);
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState<any>(null);
  const [showDeliveryNoteModal, setShowDeliveryNoteModal] = useState(false);

  // --- NEW FUNCTIONS FOR DELIVERY NOTES APIS ---

  // GET /storekeeper/delivery-notes - Fetch all delivery notes
  const fetchAllDeliveryNotes = async () => {
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json' 
    };

    try {
      const response = await fetch(`${baseUrl}/storekeeper/delivery-notes`, { headers });
      if (response.ok) {
        const data = await response.json();
        setDeliveryNotesList(data);
        return data;
      }
    } catch (err) {
      console.error("Failed to fetch delivery notes", err);
    }
    return [];
  };

  // GET /storekeeper/delivery-notes/{id} - Fetch single delivery note by ID
  const fetchDeliveryNoteById = async (noteId: number) => {
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json' 
    };

    try {
      const response = await fetch(`${baseUrl}/storekeeper/delivery-notes/${noteId}`, { headers });
      if (response.ok) {
        const data = await response.json();
        setSelectedDeliveryNote(data);
        setShowDeliveryNoteModal(true);
        return data;
      }
    } catch (err) {
      console.error("Failed to fetch delivery note", err);
    }
    return null;
  };

  // GET /storekeeper/delivery-notes/{id}/pdf - Download PDF
  const downloadDeliveryNotePDF = async (noteId: number) => {
    const token = localStorage.getItem('token');
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/pdf' 
    };

    try {
      const response = await fetch(`${baseUrl}/storekeeper/delivery-notes/${noteId}/pdf`, { headers });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `delivery-note-${noteId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Failed to download PDF");
      }
    } catch (err) {
      console.error("Failed to download PDF", err);
    }
  };

  // --- 1. INITIAL FETCH LOGIC ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAllData = async () => {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
      };

      try {
        // Fetch 1: My Stock
        const stockRes = await fetch(`${baseUrl}/storekeeper`, { headers });
        if (stockRes.ok) {
          const data = await stockRes.json();
          const mappedStock = data.map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            item: item.product?.name || 'Unknown',
            quantity: item.quantity,
            unit: item.unit || 'pcs'
          }));
          mappedStock.sort((a: any, b: any) => Number(b.id) - Number(a.id));
          setMyStock(mappedStock);
        }

        // Fetch 2: Shop Requests - GET /api/storekeeper/requests
      const reqRes = await fetch(`${baseUrl}/orders`, { headers });
        if (reqRes.ok) {
          const data = await reqRes.json();
          const flattenedRequests: any[] = [];
          data.forEach((order: any) => {
             order.items?.forEach((item: any) => {
                flattenedRequests.push({
                   id: order.id, 
                   request_item_id: item.id, 
                   product_id: item.product_id,
                   item: item.product?.name || 'Unknown Product',
                   quantity: item.quantity,
                   unit: 'pcs',
                   time: order.time || (order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'), 
                   branch: order.location,
                   isEdited: false,
                   type: 'request'
                });
             });
          });
          flattenedRequests.sort((a: any, b: any) => Number(b.id) - Number(a.id));
          setShopRequests(flattenedRequests);
        }

        // Fetch 3: Delivery History
        const histRes = await fetch(`${baseUrl}/storekeeper/history`, { headers });
        if (histRes.ok) {
          const data = await histRes.json();
          const mappedHistory = data.map((h: any) => ({
             id: h.id,
             item: h.product?.name || 'Unknown',
             quantity: h.quantity,
             date: h.date || (h.created_at ? new Date(h.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'No Date'), 
             receiver: h.to_location
          }));
          mappedHistory.sort((a: any, b: any) => Number(b.id) - Number(a.id));
          setDeliveryHistory(mappedHistory);
        }

        // Fetch 4: Cake Orders - GET /shop/cake-orders
        const cakeOrderRes = await fetch(`${baseUrl}/shop/cake-orders`, { headers });
        if (cakeOrderRes.ok) {
          const data = await cakeOrderRes.json();
          const mappedCakes = data.map((c: any) => ({
             id: c.id,
             customer: c.customer_name,
             details: c.cake_type,
             pickupTime: c.location,
             status: c.status,
             totalPrice: c.price,
             paid: c.total_paid,
             remaining: c.remaining_payment,
             imageUrl: c.inspo_image_url
          }));
          mappedCakes.sort((a: any, b: any) => Number(b.id) - Number(a.id));
          setCakeOrders(mappedCakes);
        }

        // Fetch 5: Cake Requests - GET /shop/cake-requests
        const cakeReqRes = await fetch(`${baseUrl}/shop/cake-requests`, { headers });
        if (cakeReqRes.ok) {
          const data = await cakeReqRes.json();
          const mappedCakeReqs = data.map((c: any) => ({
             id: c.id,
             branch: c.location || 'Branch',
             details: c.cake_type,
             pickupTime: 'Pending'
          }));
          mappedCakeReqs.sort((a: any, b: any) => Number(b.id) - Number(a.id));
          setCakeRequests(mappedCakeReqs);
        }

        // Fetch 6: Baked Products (Production Log)
        const bakedRes = await fetch(`${baseUrl}/storekeeper/production`, { headers });
        if (bakedRes.ok) {
          const data = await bakedRes.json();
          const mappedBaked = data.map((b: any) => ({
            id: b.id,
            item: b.product?.name || 'Baked Item',
            quantity: b.quantity,
            time: b.time || 'Logged'
          }));
          mappedBaked.sort((a: any, b: any) => Number(b.id) - Number(a.id));
          setBakedProducts(mappedBaked);
        }

        // Fetch 7: Damaged Products Log
        const damagedRes = await fetch(`${baseUrl}/storekeeper/damage`, { headers });
        if (damagedRes.ok) {
          const data = await damagedRes.json();
          const mappedDamaged = data.map((d: any) => ({
            id: d.id,
            item: d.product?.name || 'Damaged Item',
            quantity: d.quantity,
            reason: d.reason || 'N/A',
            date: d.date || 'N/A',
            time: d.time || ''
          }));
          mappedDamaged.sort((a: any, b: any) => Number(b.id) - Number(a.id));
          setDamagedProducts(mappedDamaged);
        }

        // Fetch 8: Delivery Notes - GET /storekeeper/delivery-notes
        await fetchAllDeliveryNotes();

      } catch (err) {
        console.error("Failed to fetch storekeeper data", err);
      }
    };

    fetchAllData();
  }, [router, baseUrl]);

  const rawBranchId = params?.branchId || 'store';
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- FULL HISTORY COMBINED DATA ---
  const fullHistory = [
    ...shopRequests.map(r => ({ type: 'REQUEST', item: r.item, qty: r.quantity, time: r.time, color: 'text-blue-600' })),
    ...damagedProducts.map(d => ({ type: 'DAMAGE', item: d.item, qty: d.quantity, time: d.date, color: 'text-red-600' })),
    ...cakeOrders.map(c => ({ type: 'CAKE ORDER', item: c.details, qty: 1, time: c.pickupTime, color: 'text-[#F57C00]' })),
    ...deliveryHistory.map(h => ({ type: 'DELIVERED', item: h.item, qty: h.quantity, time: h.date, color: 'text-green-600' })),
    ...bakedProducts.map(b => ({ type: 'PRODUCTION', item: b.item, qty: b.quantity, time: b.time, color: 'text-purple-600' })),
  ].sort((a, b) => (b.time || '').localeCompare(a.time || ''));

  const handlePrint = () => { window.print(); };

  const toggleSelection = (id: number) => {
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const selectedItems = shopRequests.filter(req => selectedProductIds.includes(req.id));

  // --- 2. BULK DELIVERY (POST /storekeeper/deliver) ---
  const handleBulkDelivery = async () => {
    if (selectedProductIds.length === 0) return;
    const token = localStorage.getItem('token');

    const uniqueOrderIds = Array.from(new Set(selectedItems.map(item => item.id)));
    const destinationBranch = selectedItems[0]?.branch 
        ? `${selectedItems[0].branch} Shop` 
        : 'Unknown Shop';

    try {
      const response = await fetch(`${baseUrl}/storekeeper/deliver`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          order_ids: uniqueOrderIds,
          cake_order_ids: [], 
          recipient_name: destinationBranch,
          payment_received: true
        })
      });

      if (response.ok) {
        const newNoteId = `DN-${Math.floor(Math.random() * 10000)}`;
        const noteData = { 
            id: newNoteId, 
            date: new Date().toLocaleDateString(), 
            time: getCurrentTime(), 
            items: selectedItems.map(item => ({ 
                name: item.item, 
                quantity: item.quantity, 
                destination: `${item.branch.toUpperCase()} SHOP` 
            })) 
        };
        setDeliveryNote(noteData);
        setIssuedNotes(prev => [noteData, ...prev]);
        setShopRequests(prev => prev.filter(req => !selectedProductIds.includes(req.id)));
        setSelectedProductIds([]);
        
        // Refresh delivery notes list after successful delivery
        await fetchAllDeliveryNotes();
      }
    } catch (err) {
      console.error("Delivery recording failed", err);
    }
  };

  // --- 3. CORRECTED EDIT REQUEST (PUT /storekeeper/requests/{id} or /stock/{id}) ---
  const handleEditRequest = async () => {
    const qty = parseInt(editQty);
    if (isNaN(qty) || qty < 0 || !editingItem) return;

    const token = localStorage.getItem('token');
    
    const editUrl = editingItem.type === 'request' 
      ? `${baseUrl}/storekeeper/requests/${editingItem.id}` 
      : `${baseUrl}/storekeeper/stock/${editingItem.id}`; 

    try {
      const response = await fetch(editUrl, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(editingItem.type === 'request' 
          ? { items: [{ id: editingItem.request_item_id, quantity: qty }] }
          : { quantity: qty }
        )
      });

      if (response.ok) {
        if (editingItem.type === 'request') {
          setShopRequests(prev => prev.map(req => req.request_item_id === editingItem.request_item_id ? { ...req, quantity: qty, isEdited: true } : req));
        } else {
          setMyStock(prev => prev.map(s => s.id === editingItem.id ? { ...s, quantity: qty } : s));
        }
        setEditingItem(null);
        setEditQty('');
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // --- 4. NEW: RECORD CAKE PAYMENT (POST /sales/cake-order/{id}/payment) ---
  const handleRecordCakePayment = async (cakeId: number, amount: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${baseUrl}/sales/cake-order/${cakeId}/payment`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          payment_amount: amount,
          payment_method: 'cash',
          payer_name: 'Collected at Shop'
        })
      });

      if (response.ok) {
        alert("Payment recorded successfully!");
        setCakeOrders(prev => prev.map(cake => 
          cake.id === cakeId ? { ...cake, remaining: 0, paid: cake.paid + amount } : cake
        ));
      } else {
        alert("Failed to record payment. Please try again.");
      }
    } catch (err) {
      console.error("Payment failed", err);
    }
  };

  const stats = [
    { id: 'requests', label: 'Requests', value: (shopRequests?.length || 0).toString(), icon: Bell },
    { id: 'baked_log', label: 'Baked Products', value: (bakedProducts?.length || 0).toString(), icon: ChefHat },
    { id: 'my_stock', label: 'Stock', value: (myStock?.length || 0).toString(), icon: ShoppingBag },
    { id: 'cake_orders', label: 'Cake Orders', value: (cakeOrders?.length || 0).toString(), icon: ClipboardList }, 
    { id: 'cake_requests', label: 'Cake Requests', value: (cakeRequests?.length || 0).toString(), icon: Package }, 
    { id: 'full_history', label: 'Full History', value: (fullHistory?.length || 0).toString(), icon: CheckCheck },
    { id: 'damaged', label: 'Damaged', value: (damagedProducts?.length || 0).toString(), icon: ShieldAlert },
    { id: 'notes', label: 'Delivery Notes', value: (deliveryNotesList?.length || 0).toString(), icon: FileText },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 relative px-4 font-sans text-gray-700">
      <style jsx global>{`
        @media print { body * { visibility: hidden; } #printable-note, #printable-note * { visibility: visible; } #printable-note { position: absolute; left: 0; top: 0; width: 100%; border: none !important; } .no-print { display: none !important; } }
      `}</style>

      {/* --- DELIVERY NOTE DETAIL MODAL --- */}
      {showDeliveryNoteModal && selectedDeliveryNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 no-print">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#F57C00] text-white p-4 flex justify-between items-center">
              <h3 className="font-black uppercase text-sm">Delivery Note Details</h3>
              <button onClick={() => setShowDeliveryNoteModal(false)} className="text-white hover:opacity-80">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-xl overflow-auto max-h-[500px]">
                {JSON.stringify(selectedDeliveryNote, null, 2)}
              </pre>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => downloadDeliveryNotePDF(selectedDeliveryNote.id)}
                  className="px-6 py-2 bg-[#F57C00] text-white rounded-xl font-black uppercase text-xs flex items-center gap-2"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button 
                  onClick={() => setShowDeliveryNoteModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-xl font-black uppercase text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT POPUP --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 no-print">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-5 shadow-2xl border border-gray-100 text-center text-black">
            <h2 className="font-black uppercase text-xs text-[#F57C00]">Edit Quantity</h2>
            <p className="font-bold text-gray-400 text-[10px] uppercase">{editingItem.item}</p>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase">New Quantity</label>
              <input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none font-black text-xl text-[#F57C00] focus:border-[#F57C00]" autoFocus />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingItem(null)} className="flex-1 font-bold text-gray-400">Cancel</button>
              <button onClick={handleEditRequest} className="flex-1 bg-[#F57C00] text-white py-3 rounded-xl font-bold uppercase text-xs shadow-lg">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELIVERY NOTE POPUP --- */}
      {deliveryNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 no-print">
          <div id="printable-note" className="bg-white w-full max-w-md shadow-2xl overflow-hidden text-black p-8 font-serif border border-gray-200">
            <div className="text-center mb-6">
               <div className="flex justify-center mb-2">
                  <img src="/logo.png" alt="Ishingiro Logo" className="w-16 h-16 object-contain" />
               </div>
               <h2 className="font-bold text-lg uppercase leading-tight">BINYA LTD</h2>
               <p className="text-[10px] font-bold uppercase">B.P:2558 KIGALI-RWANDA</p>
               <p className="text-[10px] font-bold">TEL:(+250)786766202/072577025</p>
               <p className="text-[10px] font-bold uppercase">TIN: 102806807</p>
               <p className="text-[10px] font-bold">email:ishingiro. naphtal@gmail</p>
            </div>

            <div className="border-t border-b border-black py-2 mb-4 text-center">
                <h3 className="font-bold uppercase text-xs tracking-widest">DELIVERY NOTE / PACKING LIST</h3>
                <p className="text-[10px] font-bold mt-1 uppercase">
                  DATE : <span className="underline ml-1 mr-4">{deliveryNote.date}</span> 
                  TIME : <span className="underline ml-1">{deliveryNote.time}</span>
                </p>
            </div>

            <div className="mb-4 space-y-2">
                <p className="text-[10px] font-bold uppercase">
                  Custom Name: <span className="underline ml-2">{deliveryNote.items[0]?.destination || "BRANCH"}</span>
                </p>
            </div>

            <table className="w-full border-collapse border border-black text-[10px]">
                <thead>
                    <tr className="border-b border-black font-bold">
                        <th className="border-r border-black p-1 text-left uppercase">ITEM NAME</th>
                        <th className="border-r border-black p-1 text-center uppercase">QTY</th>
                        <th className="border-r border-black p-1 text-center uppercase">UNIT PRICE</th>
                        <th className="p-1 text-right uppercase">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveryNote.items.map((item: any, idx: number) => {
                        const productData = FINANCE_PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                        const price = productData?.price || 0;
                        const total = price * item.quantity;
                        return (
                          <tr key={idx} className="border-b border-black font-bold uppercase">
                              <td className="border-r border-black p-1">{item.name}</td>
                              <td className="border-r border-black p-1 text-center">{item.quantity}</td>
                              <td className="border-r border-black p-1 text-center">{price.toLocaleString()}</td>
                              <td className="p-1 text-right">{total.toLocaleString()}</td>
                           </tr>
                        );
                    })}
                    <tr className="font-black uppercase border-t border-black">
                        <td colSpan={3} className="border-r border-black p-1 text-right">TOTAL AMOUNT</td>
                        <td className="p-1 text-right">
                          {deliveryNote.items.reduce((acc: number, item: any) => {
                            const productData = FINANCE_PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
                            return acc + ((productData?.price || 0) * item.quantity);
                          }, 0).toLocaleString()}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-8">
                <div className="flex justify-between text-[10px] font-bold uppercase mb-8">
                    <span>Receiver Signature</span>
                    <span>Authorized Signature</span>
                </div>
                <p className="text-[9px] font-bold italic mb-4">goods Received in good condition</p>
                <div className="text-center mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-tight">
                        GUTEKEREZA NEZA NO GUKORA NEZA NIBWO BUTWARI.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 no-print mt-8 border-t pt-4">
                <button onClick={handlePrint} className="flex-1 bg-[#F57C00] text-white py-3 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2">
                  <Printer size={16}/> Print / PDF
                </button>
                <button onClick={() => setDeliveryNote(null)} className="flex-1 border border-gray-300 text-gray-500 py-3 rounded-xl font-bold uppercase text-[10px]">
                  Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 pt-6 no-print text-black">
        <h1 className="text-2xl font-black text-black uppercase tracking-tight">STORE KEEPER</h1>
        
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 no-print text-black">
        {stats.map((stat) => (
          <div 
              key={stat.id} 
              onClick={() => setActiveFilter(stat.id as any)} 
              className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                  activeFilter === stat.id 
                  ? (stat.id === 'damaged' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#F57C00] text-white shadow-lg') 
                  : (stat.id === 'damaged' ? 'bg-white hover:border-red-600' : 'bg-white hover:border-[#F57C00]')
              }`}
          >
             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                 activeFilter === stat.id 
                 ? (stat.id === 'damaged' ? 'bg-red-800' : 'bg-[#E65100]') 
                 : (stat.id === 'damaged' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-[#F57C00]')
             }`}>
               <stat.icon size={20} />
             </div>
             <h3 className="font-black text-[10px] uppercase tracking-widest opacity-80">{stat.label}</h3>
             <p className="text-xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[450px] no-print overflow-hidden text-black">
        <div className={`flex flex-col md:flex-row md:items-center justify-between p-7 gap-4 border-b ${activeFilter === 'damaged' ? 'border-rose-100 bg-rose-50/30' : 'border-gray-200'}`}>
           <h2 className={`text-xl font-black uppercase tracking-tight ${activeFilter === 'damaged' ? 'text-rose-700' : 'text-[#F57C00]'}`}>
             {activeFilter.replace('_', ' ')}
           </h2>

           {activeFilter === 'requests' && selectedProductIds.length > 0 && (
             <button onClick={handleBulkDelivery} className="bg-black text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-[#F57C00] transition-all"><PackageCheck size={16} /> Generate Delivery Note ({selectedProductIds.length})</button>
           )}
           
          
        </div>

        {activeFilter === 'requests' && (
          <div className="overflow-x-auto text-black">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4 w-10">Select</th><th className="px-8 py-4">Item Details</th><th className="px-8 py-4 text-center">Branch</th><th className="px-8 py-4 text-center">Requested Qty</th><th className="px-8 py-4 text-right">Time Requested</th><th className="px-8 py-4 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-200 text-black">
                {shopRequests.map((req) => (
                  <tr key={req.request_item_id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6"><button onClick={() => toggleSelection(req.id)} className="text-[#F57C00]">{selectedProductIds.includes(req.id) ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-300" />}</button></td>
                    <td className="px-8 py-6"><div className="flex flex-col gap-1"><span className="font-black text-[#F57C00] uppercase text-sm">{req.item}</span>{req.isEdited && <span className="text-[9px] font-black text-rose-600 uppercase flex items-center gap-1"><AlertCircle size={10}/> Modified</span>}</div></td>
                    <td className="px-8 py-6 text-center"><span className="px-3 py-1 bg-[#FAF6F4] text-[#F57C00] rounded-lg text-[10px] font-black uppercase">{req.branch}</span></td>
                    <td className="px-8 py-6 text-center"><span className="font-black text-lg text-gray-900">{req.quantity}</span></td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{req.time}</td>
                    <td className="px-8 py-6 text-right"><button onClick={() => { setEditingItem(req); setEditQty(req.quantity.toString()); }} className="text-gray-300 hover:text-[#F57C00] p-2 bg-gray-50 rounded-xl transition-all"><Edit3 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'my_stock' && (
          <div className="overflow-x-auto text-black">
            <table className="w-full text-left font-bold">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4">Item Name</th><th className="px-8 py-4 text-center">Qty In Store</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {myStock.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{s.item}</td>
                    <td className="px-8 py-6 text-center font-black text-lg text-gray-900">{s.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'baked_log' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4">Product Item</th><th className="px-8 py-4 text-center">Batch Qty</th><th className="px-8 py-4 text-right">Recorded Time</th></tr></thead>
              <tbody className="divide-y divide-gray-100 font-bold">
                {bakedProducts.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{b.item}</td>
                    <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">{b.quantity}</td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

                {activeFilter === 'damaged' && (
          <div className="p-8 animate-in fade-in">
            {/* --- DAMAGE REPORT FORM WITH PRODUCT SUGGESTIONS --- */}
            <div className="bg-red-50/30 p-6 rounded-3xl border border-red-100 mb-8">
              <h3 className="text-[10px] font-black uppercase mb-4 text-red-600 tracking-[0.2em]">Report New Damage</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Product input with suggestions - styles unchanged */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Product Name" 
                    id="damageProductName"
                    className="w-full bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500"
                    autoComplete="off"
                    onKeyUp={(e) => {
                      const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
                      const suggestionsDiv = document.getElementById('damageSuggestions');
                      if (!suggestionsDiv) return;
                      
                      if (searchTerm.length > 0) {
                        const products = FINANCE_PRODUCTS.filter(p => 
                          p.name.toLowerCase().includes(searchTerm)
                        ).slice(0, 8);
                        
                        if (products.length > 0) {
                          suggestionsDiv.innerHTML = products.map(p => 
                            `<div class="p-3 hover:bg-red-50 cursor-pointer border-b border-gray-100 text-sm font-bold text-gray-700" data-product="${p.name}">${p.name}</div>`
                          ).join('');
                          suggestionsDiv.classList.remove('hidden');
                          
                          suggestionsDiv.querySelectorAll('[data-product]').forEach(el => {
                            el.addEventListener('click', () => {
                              const productName = el.getAttribute('data-product');
                              (document.getElementById('damageProductName') as HTMLInputElement).value = productName || '';
                              suggestionsDiv.classList.add('hidden');
                            });
                          });
                        } else {
                          suggestionsDiv.innerHTML = '<div class="p-3 text-gray-400 text-sm">No products found</div>';
                          suggestionsDiv.classList.remove('hidden');
                        }
                      } else {
                        suggestionsDiv.classList.add('hidden');
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        document.getElementById('damageSuggestions')?.classList.add('hidden');
                      }, 200);
                    }}
                    onFocus={(e) => {
                      const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
                      if (searchTerm.length > 0) {
                        document.getElementById('damageSuggestions')?.classList.remove('hidden');
                      }
                    }}
                  />
                  <div id="damageSuggestions" className="absolute z-50 w-full bg-white border border-gray-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto hidden mt-1">
                  </div>
                </div>
                
                <input 
                  type="number" 
                  placeholder="Qty" 
                  id="damageQty"
                  className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500"
                />
                <input 
                  type="text" 
                  placeholder="Reason (Optional)" 
                  id="damageReason"
                  className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500"
                />
                <button 
                  onClick={async () => {
                    const productName = (document.getElementById('damageProductName') as HTMLInputElement)?.value;
                    const quantity = (document.getElementById('damageQty') as HTMLInputElement)?.value;
                    const reason = (document.getElementById('damageReason') as HTMLInputElement)?.value;
                    
                    if (!productName || !quantity) {
                      alert("Please enter product name and quantity");
                      return;
                    }
                    
                    const productExists = FINANCE_PRODUCTS.find(p => p.name.toLowerCase() === productName.toLowerCase());
                    if (!productExists) {
                      alert("Product not found. Please select from the suggestions.");
                      return;
                    }
                    
                    const token = localStorage.getItem('token');
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';
                    
                    const dbProductId = 1;
                    
                    try {
                      const response = await fetch(`${baseUrl}/storekeeper/damage`, {
                        method: 'POST',
                        headers: { 
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          product_id: dbProductId,
                          quantity: parseInt(quantity),
                          reason: reason || 'Reported by Store Keeper',
                          location: 'store'
                        })
                      });
                      
                      if (response.ok) {
                        const newDamage = {
                          id: Date.now(),
                          item: productName,
                          quantity: parseInt(quantity),
                          reason: reason || 'Reported by Store Keeper',
                          date: new Date().toLocaleDateString(),
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        
                        setDamagedProducts(prev => [newDamage, ...prev]);
                        
                        (document.getElementById('damageProductName') as HTMLInputElement).value = '';
                        (document.getElementById('damageQty') as HTMLInputElement).value = '';
                        (document.getElementById('damageReason') as HTMLInputElement).value = '';
                        
                        alert("Damage reported successfully!");
                      } else {
                        alert("Failed to report damage. Please try again.");
                      }
                    } catch (err) {
                      console.error("Failed to report damage", err);
                      alert("Error reporting damage");
                    }
                  }}
                  className="bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all"
                >
                  Submit Damage
                </button>
              </div>
            </div>
            
            {/* --- DAMAGED PRODUCTS LIST - STYLES UNCHANGED --- */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-bold">
                <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200">
                  <th className="px-8 py-4">Damaged Item</th>
                  <th className="px-8 py-4 text-center">Qty</th>
                  <th className="px-8 py-4 text-center">Reason</th>
                  <th className="px-8 py-4 text-right">Date Recorded</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100 font-bold">
                  {damagedProducts.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-black text-rose-700 uppercase text-sm">{d.item}</td>
                      <td className="px-8 py-6 text-center font-black text-gray-900 text-lg">{d.quantity}</td>
                      <td className="px-8 py-6 text-center font-black text-gray-400 text-xs">{d.reason}</td>
                      <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{d.date} {d.time}</td>
                    </tr>
                  ))}
                  {damagedProducts.length === 0 && (
                    <tr><td colSpan={4} className="px-8 py-32 text-center font-black text-gray-200 uppercase tracking-[0.5em]">No Damaged Items Reported</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- DELIVERY NOTES SECTION - GET /storekeeper/delivery-notes --- */}
        {activeFilter === 'notes' && (
          <div className="overflow-x-auto p-8">
            <div className="mb-6">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">All Delivery Notes</h3>
              <div className="grid gap-4">
                {deliveryNotesList.map((note: any) => (
                  <div key={note.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <p className="font-black text-[#F57C00] text-lg">DN-{note.id}</p>
                        <p className="text-xs text-gray-500 mt-1">{note.date || note.created_at}</p>
                        <p className="text-xs font-bold mt-2">Recipient: {note.recipient || note.to_location}</p>
                        {note.items && (
                          <p className="text-xs text-gray-500 mt-1">Items: {note.items.length} product(s)</p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => fetchDeliveryNoteById(note.id)}
                          className="px-4 py-2 bg-[#F57C00] text-white rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:bg-[#E65100] transition-all"
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button 
                          onClick={() => downloadDeliveryNotePDF(note.id)}
                          className="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2 hover:bg-gray-900 transition-all"
                        >
                          <Download size={14} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {deliveryNotesList.length === 0 && (
                  <div className="p-32 text-center font-black text-gray-200 uppercase tracking-[0.5em]">No Delivery Notes Found</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- CAKE ORDERS WITH PAYMENT API LOGIC --- */}
        {activeFilter === 'cake_orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold">
              <thead><tr className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-900 border-b border-gray-200"><th className="px-8 py-4">Customer / Item</th><th className="px-8 py-4 text-center">Payment Status</th><th className="px-8 py-4 text-right">Pickup</th><th className="px-8 py-4 text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-100 font-bold">
                {cakeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-[#F57C00] uppercase text-sm">{order.customer}</span>
                        <span className="text-[10px] text-gray-400">{order.details}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex flex-col items-center">
                         <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black ${
                           order.remaining === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                         }`}>
                           {order.remaining === 0 ? 'Fully Paid' : `Debt: ${order.remaining?.toLocaleString() || 0} RWF`}
                         </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{order.pickupTime}</td>
                    <td className="px-8 py-6 text-right">
                       {order.remaining > 0 && (
                          <button onClick={() => handleRecordCakePayment(order.id, order.remaining)} className="text-[9px] bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors uppercase font-black shadow-md active:scale-95">
                            Record Pay
                          </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- FULL HISTORY SECTION --- */}
        {activeFilter === 'full_history' && (
          <div className="overflow-x-auto p-8">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Complete Activity Log</h3>
            <table className="w-full min-w-[800px] whitespace-nowrap text-left border-collapse">
              <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Product/Item</th>
                  <th className="px-8 py-4 text-center">Quantity</th>
                  <th className="px-8 py-4 text-right">Date/Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fullHistory.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors font-bold">
                    <td className={`px-8 py-6 uppercase text-[10px] font-black ${log.color}`}>{log.type}</td>
                    <td className="px-8 py-6 uppercase text-sm text-gray-900">{log.item}</td>
                    <td className="px-8 py-6 text-center text-lg text-gray-800">{log.qty}</td>
                    <td className="px-8 py-6 text-right text-xs text-gray-400">{log.time || 'N/A'}</td>
                  </tr>
                ))}
                {fullHistory.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center font-black text-gray-200 uppercase tracking-[0.5em]">No History Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeFilter === 'delivered' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold border-collapse">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] font-black uppercase text-gray-900 border-b border-gray-200">
                   <th className="px-8 py-4">Item Details</th>
                   <th className="px-8 py-4 text-center">To Branch</th>
                   <th className="px-8 py-4 text-center">Qty Added</th>
                   <th className="px-8 py-4 text-right">Status Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deliveryHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-[#F57C00] uppercase text-sm">{h.item}</span>
                        <span className="text-[9px] text-gray-400">ID: {h.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-black uppercase">{h.receiver}</span>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-lg text-gray-900">{h.quantity}</td>
                    <td className="px-8 py-6 text-right text-xs font-black text-gray-400">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deliveryHistory.length === 0 && (
              <div className="p-32 text-center font-black text-gray-200 uppercase tracking-[0.5em]">No Data Found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}