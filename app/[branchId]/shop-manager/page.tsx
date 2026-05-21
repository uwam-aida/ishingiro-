'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Package, Clock, ShoppingBag, AlertCircle, Search, Archive, 
  ArrowLeft, Store, Plus, MapPin, Bell, X, ShieldAlert, 
  CheckCircle2, Trash2, Edit2, Check, History, Cake, 
  Star, User, Calendar, Users, UtensilsCrossed, Send 
} from 'lucide-react';

// Product list for suggestions
const MARKETING_PRODUCTS = [
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

export default function DynamicShopDashboard() {
  const router = useRouter();
  const params = useParams();
  const branchIdString = params?.branchId?.toString().toLowerCase() || 'kabuga';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  // State
  const [factoryStock, setFactoryStock] = useState<any[]>([]);
  const [myStock, setMyStock] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [receivedStock, setReceivedStock] = useState<any[]>([]);
  const [damagedReports, setDamagedReports] = useState<any[]>([]);
  const [cakeOrders, setCakeOrders] = useState<any[]>([]);
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('orders');
  
  // Form states
  const [productSearch, setProductSearch] = useState('');
  const [requestQty, setRequestQty] = useState('');
  const [restQty, setRestQty] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Damage form states
  const [damagedItem, setDamagedItem] = useState('');
  const [damagedQty, setDamagedQty] = useState('');
  const [damagedState, setDamagedState] = useState('Baked');
  const [damagedUnit, setDamagedUnit] = useState('Piece');
  const [showDamagedSuggestions, setShowDamagedSuggestions] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  
  // Feedback form states
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackCustomer, setFeedbackCustomer] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  
  // Success/Error states
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);
  const [showDamageSuccess, setShowDamageSuccess] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing states
  const [editingReceivedId, setEditingReceivedId] = useState<number | null>(null);
  const [editReceivedQty, setEditReceivedQty] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Fetch all data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAllData = async () => {
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        // Fetch products
        const prodRes = await fetch(`${baseUrl}/products`, { headers });
        if (prodRes.ok) setRealProducts(await prodRes.json());

        // Fetch factory stock
        const factRes = await fetch(`${baseUrl}/factory/stock`, { headers });
        if (factRes.ok) {
          const data = await factRes.json();
          setFactoryStock(data.map((s: any) => ({ 
            id: s.id,
            item: s.product?.name || 'Unknown', 
            quantity: s.quantity, 
            unit: s.product?.type === 'unbaked' ? 'Kg' : 'Pieces'
          })));
        }

        // Fetch shop stock by location
        const stockRes = await fetch(`${baseUrl}/stock/${branchIdString}`, { headers });
        if (stockRes.ok) {
          const data = await stockRes.json();
          setMyStock(data.map((s: any) => ({ 
            id: s.id,
            item: s.product?.name || 'Unknown', 
            quantity: s.quantity, 
            unit: 'Pieces'
          })));
        }

        // Fetch orders
        const ordRes = await fetch(`${baseUrl}/orders/${branchIdString}`, { headers });
        if (ordRes.ok) {
          const data = await ordRes.json();
          const pendingOrders: any[] = [];
          const dispatchedOrders: any[] = [];
          
          data.forEach((o: any) => {
            o.items?.forEach((i: any) => {
              const mappedItem = {
                id: o.id,
                item: i.product?.name || `Order #${o.id}`,
                quantity: i.quantity,
                status: o.status,
                time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              if (o.status === 'pending' || o.status === 'dispatched') {
                pendingOrders.push(mappedItem);
              } else {
                dispatchedOrders.push(mappedItem);
              }
            });
          });
          setMyRequests(pendingOrders);
          setReceivedStock(dispatchedOrders);
        }

        // Fetch damages
        const damRes = await fetch(`${baseUrl}/shop/damages/${branchIdString}`, { headers });
        if (damRes.ok) {
          const data = await damRes.json();
          setDamagedReports(data.map((d: any) => ({ 
            id: d.id, 
            item: d.product?.name || 'Unknown', 
            qty: d.quantity, 
            reason: d.reason,
            time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }

        // Fetch cake orders
        const cakeRes = await fetch(`${baseUrl}/shop/cake-orders/${branchIdString}`, { headers });
        if (cakeRes.ok) {
          const data = await cakeRes.json();
          setCakeOrders(data.map((c: any) => ({ 
            id: c.id, 
            item: c.cake_type, 
            code: `CK-${c.id}`, 
            customer: c.customer_name, 
            status: c.status,
            deliveryDate: c.delivery_date,
            advancePayment: c.advance_payment,
            remainingPayment: c.remaining_payment
          })));
        }

        // Fetch feedback
        const fbRes = await fetch(`${baseUrl}/shop/feedback`, { headers });
        if (fbRes.ok) {
          const data = await fbRes.json();
          setFeedbackList(data.data || []);
        }

      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      }
    };

    fetchAllData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [router, branchIdString, baseUrl]);

  // Filter products for suggestions
  const filteredProducts = factoryStock.filter(p => 
    p.item.toLowerCase().includes(productSearch.toLowerCase())
  );
  const isRequestNotFound = productSearch.length > 0 && filteredProducts.length === 0;

  const damagedFiltered = MARKETING_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(damagedItem.toLowerCase())
  );
  const isDamagedSearchNotFound = damagedItem.length > 0 && damagedFiltered.length === 0;

  // Validate damaged product type
  useEffect(() => {
    const product = MARKETING_PRODUCTS.find(p => p.name.toLowerCase() === damagedItem.toLowerCase());
    if (damagedItem.length > 0 && !product && !showDamagedSuggestions) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
    if (product) {
      if (product.type === 'baked' && damagedState === 'Unbaked') {
        setTypeError(true);
        setErrorMessage('This is a baked product, not unbaked');
      } else if (product.type === 'unbaked' && damagedState === 'Baked') {
        setTypeError(true);
        setErrorMessage('This is an unbaked product, not baked');
      } else {
        setTypeError(false);
        setErrorMessage('');
      }
    }
  }, [damagedItem, damagedState, showDamagedSuggestions]);

  const bakedItemsAvailable = selectedItem 
    ? (factoryStock.find(s => s.item === selectedItem)?.quantity || 0) 
    : 0;
  const isOverLimit = (parseInt(requestQty) || 0) > bakedItemsAvailable;

  // Submit new order request
  const handleAddRequest = async () => {
    if (!requestQty || isOverLimit || !selectedItem) return;
    
    const token = localStorage.getItem('token');
    const realDbProduct = realProducts.find(p => p.name.toLowerCase() === selectedItem.toLowerCase());
    const dbProductId = realDbProduct?.id || 1;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseUrl}/orders/${branchIdString}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          items: [{ product_id: dbProductId, quantity: parseInt(requestQty) }]
        })
      });
      
      if (response.ok) {
        setShowRequestSuccess(true);
        setTimeout(() => setShowRequestSuccess(false), 3000);
        
        // Update local state
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setFactoryStock(prev => prev.map(s => 
          s.item === selectedItem ? { ...s, quantity: s.quantity - parseInt(requestQty) } : s
        ));
        setMyRequests([{ 
          id: Date.now(), 
          item: selectedItem, 
          quantity: parseInt(requestQty), 
          status: 'pending', 
          time: currentTime 
        }, ...myRequests]);
        
        setRequestQty('');
        setRestQty('');
        setProductSearch('');
        setSelectedItem(null);
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark order as received
  const handleMarkAsReceived = async (orderId: number) => {
    const token = localStorage.getItem('token');
    setUpdatingStatus(orderId);
    
    try {
      const response = await fetch(`${baseUrl}/orders/${orderId}/receive`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Move order from requests to received
        const orderToMove = myRequests.find(r => r.id === orderId);
        if (orderToMove) {
          setMyRequests(prev => prev.filter(r => r.id !== orderId));
          setReceivedStock(prev => [{
            ...orderToMove,
            status: 'received',
            arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }, ...prev]);
          
          // Refresh stock
          const stockRes = await fetch(`${baseUrl}/stock/${branchIdString}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (stockRes.ok) {
            const data = await stockRes.json();
            setMyStock(data.map((s: any) => ({ 
              id: s.id, item: s.product?.name, quantity: s.quantity, unit: 'Pieces' 
            })));
          }
        }
      } else {
        alert("Failed to mark order as received");
      }
    } catch (error) {
      console.error("Failed to mark as received:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Report damage
  const handleReportDamage = async () => {
    if (!damagedItem || !damagedQty || typeError || notFound) return;

    const token = localStorage.getItem('token');
    const realDbProduct = realProducts.find(p => p.name.toLowerCase() === damagedItem.toLowerCase());
    const dbProductId = realDbProduct?.id || 1;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${baseUrl}/shop/damages`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          product_id: dbProductId,
          quantity: parseInt(damagedQty),
          reason: `${damagedState} - ${damagedUnit}`,
          location: branchIdString
        })
      });

      if (response.ok) {
        setShowDamageSuccess(true);
        setTimeout(() => setShowDamageSuccess(false), 3000);
        
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setDamagedReports([{ 
          id: Date.now(), 
          item: damagedItem, 
          qty: damagedQty, 
          reason: `${damagedState} - ${damagedUnit}`,
          time: currentTime 
        }, ...damagedReports]);
        
        setDamagedItem('');
        setDamagedQty('');
        setTypeError(false);
      } else {
        alert("Failed to report damage");
      }
    } catch (error) {
      console.error("Damage report failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (!feedbackMessage.trim()) return;

    const token = localStorage.getItem('token');
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${baseUrl}/shop/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: feedbackCustomer || 'Anonymous',
          message: feedbackMessage,
          rating: feedbackRating,
          location: branchIdString
        })
      });

      if (response.ok) {
        setShowFeedbackSuccess(true);
        setTimeout(() => setShowFeedbackSuccess(false), 3000);
        setFeedbackCustomer('');
        setFeedbackMessage('');
        setFeedbackRating(5);
        setShowFeedbackForm(false);
        
        // Refresh feedback list
        const fbRes = await fetch(`${baseUrl}/shop/feedback`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (fbRes.ok) {
          const data = await fbRes.json();
          setFeedbackList(data.data || []);
        }
      } else {
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Feedback submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update received stock quantity
  const saveReceivedEdit = async (id: number) => {
    const token = localStorage.getItem('token');
    const stockItem = myStock.find(s => s.id === id);
    
    if (stockItem) {
      try {
        const response = await fetch(`${baseUrl}/shop/stock/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: parseInt(editReceivedQty) })
        });
        
        if (response.ok) {
          setMyStock(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: parseInt(editReceivedQty) } : item
          ));
        }
      } catch (error) {
        console.error("Failed to update stock:", error);
      }
    }
    setEditingReceivedId(null);
  };

  // Stats for dashboard
  const stats = [
    { id: 'baked', label: 'Baked Items', icon: ShoppingBag, count: factoryStock.length },
    { id: 'orders', label: 'Orders', icon: Clock, count: myRequests.length },
    { id: 'cake_orders', label: 'Cake Orders', icon: Cake, count: cakeOrders.length },
    { id: 'received', label: 'Received', icon: Archive, count: receivedStock.length },
    { id: 'stock', label: 'My Stock', icon: Store, count: myStock.length },
    { id: 'damaged', label: 'Damaged', icon: AlertCircle, count: damagedReports.length },
    { id: 'feedback', label: 'Feedback', icon: Star, count: feedbackList.length },
  ];

  const branchName = branchIdString === 'kabuga' ? 'KABUGA SHOP' : 'MASAKA SHOP';

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans w-full overflow-x-hidden">
      
      {/* Success Notifications */}
      {showRequestSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-green-50 text-green-700 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-green-200">
            <CheckCircle2 className="text-green-600" size={20} />
            <span className="font-black uppercase text-xs tracking-widest">Order Request Added</span>
          </div>
        </div>
      )}
      
      {showDamageSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-red-50 text-red-700 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-red-200">
            <AlertCircle className="text-red-600" size={20} />
            <span className="font-black uppercase text-xs tracking-widest">Damage Reported</span>
          </div>
        </div>
      )}
      
      {showFeedbackSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-blue-50 text-blue-700 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-blue-200">
            <Star className="text-blue-600" size={20} />
            <span className="font-black uppercase text-xs tracking-widest">Feedback Submitted</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-full md:max-w-7xl mx-auto space-y-8 px-4 md:px-8 pt-6">
        
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gray-50/95 backdrop-blur-md py-4 border-b border-gray-200/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-black uppercase">{branchName} MANAGER</h1>
          </div>
          <button 
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5D4037] text-white rounded-xl text-xs font-bold hover:bg-[#4E342E] transition-colors"
          >
            <Star size={16} /> Leave Feedback
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              onClick={() => setActiveFilter(stat.id as any)} 
              className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                activeFilter === stat.id 
                  ? (stat.id === 'damaged' ? 'bg-red-600 text-white shadow-lg' : 
                     stat.id === 'feedback' ? 'bg-blue-600 text-white shadow-lg' :
                     'bg-[#F57C00] text-white shadow-lg') 
                  : (stat.id === 'damaged' ? 'bg-white hover:border-red-600' : 
                     stat.id === 'feedback' ? 'bg-white hover:border-blue-600' :
                     'bg-white hover:border-[#F57C00]')
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                activeFilter === stat.id ? 'bg-white/20' : 
                (stat.id === 'damaged' ? 'bg-red-50 text-red-600' : 
                 stat.id === 'feedback' ? 'bg-blue-50 text-blue-600' :
                 'bg-gray-50 text-[#F57C00]')
              }`}>
                <stat.icon size={24} />
              </div>
              <h3 className="font-black text-[9px] md:text-[10px] uppercase tracking-widest opacity-80 leading-none mb-2">
                {stat.label}
              </h3>
              <span className="text-2xl font-black leading-none text-inherit">
                {stat.count}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] w-full max-w-full">
          
          {/* Orders View */}
          {activeFilter === 'orders' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <div className="max-w-2xl">
                <h2 className="text-xs font-black text-[#F57C00] uppercase tracking-widest mb-6">REQUEST FOR PRODUCTS</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 
                  <div className="space-y-1 relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Product</label>
                    <input 
                      type="text" 
                      value={productSearch} 
                      onFocus={() => setShowSuggestions(true)} 
                      onChange={(e) => { 
                        setProductSearch(e.target.value); 
                        setShowSuggestions(true); 
                        setSelectedItem(null); 
                      }} 
                      className={`w-full border-2 p-4 rounded-2xl font-bold text-[#F57C00] outline-none focus:border-[#F57C00] transition-all ${isRequestNotFound ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="Search..." 
                    />
                    {isRequestNotFound && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-2">Product not found</p>}
                    {showSuggestions && productSearch && filteredProducts.length > 0 && (
                      <div className="absolute z-50 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                        {filteredProducts.map((p, i) => (
                          <div key={i} onClick={() => { 
                            setSelectedItem(p.item); 
                            setProductSearch(p.item); 
                            setShowSuggestions(false); 
                          }} className="p-4 hover:bg-orange-50 cursor-pointer font-bold text-sm border-b border-gray-50 last:border-0">
                            {p.item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Qty</label>
                    <span className={`text-[10px] block font-black uppercase ${isOverLimit ? 'text-red-500' : 'text-emerald-600'}`}>
                      Factory: {selectedItem ? bakedItemsAvailable : '--'}
                    </span>
                    <input 
                      type="number" 
                      value={requestQty} 
                      onChange={(e) => setRequestQty(e.target.value)} 
                      className="w-full border-2 border-gray-200 p-4 rounded-2xl font-black text-xl outline-none focus:border-[#F57C00]" 
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      disabled={!requestQty || isOverLimit || !selectedItem || isSubmitting} 
                      onClick={handleAddRequest} 
                      className="w-full px-8 py-4 bg-[#F57C00] text-white rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Add Request'}
                    </button>
                  </div>
                </div>
              </div>
              
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse mt-8">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr><th className="px-8 py-4">Item</th><th className="px-8 py-4 text-center">Qty</th><th className="px-8 py-4 text-center">Status</th><th className="px-8 py-4 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 uppercase text-sm font-black text-[#F57C00]">{req.item}</td>
                      <td className="px-8 py-6 text-center text-lg">{req.quantity}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                          {req.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {req.status === 'pending' && (
                          <button 
                            onClick={() => handleMarkAsReceived(req.id)}
                            disabled={updatingStatus === req.id}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                          >
                            {updatingStatus === req.id ? '...' : 'Mark Received'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stock View */}
          {activeFilter === 'stock' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr><th className="px-8 py-4">Product</th><th className="px-8 py-4 text-center">In Stock</th><th className="px-8 py-4 text-right">Unit</th><th className="px-8 py-4 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myStock.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{s.item}</td>
                      <td className="px-8 py-6 text-center">
                        {editingReceivedId === s.id ? (
                          <input 
                            type="number" 
                            value={editReceivedQty} 
                            onChange={(e) => setEditReceivedQty(e.target.value)} 
                            className="w-24 border-2 border-[#F57C00] rounded-lg px-2 py-1 outline-none font-black text-lg text-center" 
                            autoFocus 
                          />
                        ) : (
                          <span className="font-black text-lg text-gray-900">{s.quantity}</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right font-black text-[#F57C00] text-xs uppercase">{s.unit}</td>
                      <td className="px-8 py-6 text-right">
                        {editingReceivedId === s.id ? (
                          <button onClick={() => saveReceivedEdit(s.id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <Check size={18} />
                          </button>
                        ) : (
                          <button onClick={() => { setEditingReceivedId(s.id); setEditReceivedQty(s.quantity.toString()); }} className="p-2 text-gray-400 hover:text-[#F57C00] transition-colors">
                            <Edit2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Damaged View */}
          {activeFilter === 'damaged' && (
            <div className="p-8 animate-in fade-in">
              <div className="bg-red-50/30 p-6 rounded-3xl border border-red-100">
                <h2 className="text-[10px] font-black uppercase mb-4 text-red-600 tracking-[0.2em]">Report Damaged Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Item Name" 
                      value={damagedItem} 
                      onFocus={() => setShowDamagedSuggestions(true)} 
                      onChange={(e) => { setDamagedItem(e.target.value); setShowDamagedSuggestions(true); }} 
                      className={`w-full p-4 rounded-2xl font-bold text-sm outline-none border-2 transition-all ${typeError || isDamagedSearchNotFound ? 'border-red-500 bg-red-50 placeholder-red-600' : 'border-gray-200 bg-white focus:border-red-500'}`} 
                    />
                    {isDamagedSearchNotFound && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-2">Product not found</p>}
                    {typeError && <p className="text-[10px] text-red-600 font-black uppercase mt-1 ml-2">{errorMessage}</p>}
                    {showDamagedSuggestions && damagedItem && damagedFiltered.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {damagedFiltered.map((p, i) => (
                          <div key={i} onClick={() => { setDamagedItem(p.name); setShowDamagedSuggestions(false); }} className="p-4 hover:bg-red-50 cursor-pointer font-bold text-sm text-red-600 border-b border-gray-50 last:border-0">
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="number" placeholder="Qty" value={damagedQty} onChange={(e) => setDamagedQty(e.target.value)} className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500" />
                  <select value={damagedState} onChange={(e) => setDamagedState(e.target.value)} className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500">
                    <option value="Baked">Baked</option>
                    <option value="Unbaked">Unbaked</option>
                  </select>
                  <select value={damagedUnit} onChange={(e) => setDamagedUnit(e.target.value)} className="bg-white border-2 border-gray-200 p-4 rounded-2xl font-bold text-sm outline-none focus:border-red-500">
                    <option value="Piece">Piece</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
                <button 
                  disabled={typeError || isDamagedSearchNotFound || !damagedQty || isSubmitting} 
                  onClick={handleReportDamage} 
                  className={`mt-4 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${typeError || isDamagedSearchNotFound || !damagedQty ? 'bg-gray-200 text-gray-400' : 'bg-red-600 text-white shadow-lg active:scale-95'}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Damage'}
                </button>
              </div>
              
              <table className="w-full min-w-[800px] whitespace-nowrap mt-8 text-left font-bold">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-100">
                  <tr><th className="px-8 py-4">Item</th><th className="px-8 py-4 text-center">Qty</th><th className="px-8 py-4 text-right">Time</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {damagedReports.map((d) => (
                    <tr key={d.id} className="text-red-600 font-bold">
                      <td className="px-8 py-6 uppercase text-sm">{d.item}</td>
                      <td className="px-8 py-6 text-center"><span className="bg-red-50 px-3 py-1 rounded-full text-[9px] uppercase">{d.qty}</span></td>
                      <td className="px-8 py-6 text-right text-gray-400 text-xs">{d.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Feedback View */}
          {activeFilter === 'feedback' && (
            <div className="p-8 animate-in fade-in">
              {showFeedbackForm && (
                <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-100 mb-8">
                  <h2 className="text-[10px] font-black uppercase mb-4 text-blue-600 tracking-[0.2em]">Leave Customer Feedback</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Customer Name (optional)" 
                      value={feedbackCustomer} 
                      onChange={(e) => setFeedbackCustomer(e.target.value)} 
                      className="p-4 rounded-2xl border border-gray-200 bg-white text-sm font-bold outline-none focus:border-blue-500" 
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">Rating:</span>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackRating(rating)}
                          className={`p-2 rounded-lg ${feedbackRating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <div className="md:col-span-2">
                      <textarea 
                        placeholder="Feedback message..." 
                        value={feedbackMessage} 
                        onChange={(e) => setFeedbackMessage(e.target.value)} 
                        rows={3} 
                        className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-sm font-bold outline-none focus:border-blue-500 resize-none" 
                      />
                    </div>
                  </div>
                  <button 
                    disabled={!feedbackMessage.trim() || isSubmitting} 
                    onClick={handleSubmitFeedback} 
                    className="mt-4 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-bold text-sm">{fb.customer_name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={fb.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{fb.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{fb.date} at {fb.time}</p>
                  </div>
                ))}
                {feedbackList.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">No feedback yet. Be the first to leave a review!</div>
                )}
              </div>
            </div>
          )}

          {/* Baked Items View */}
          {activeFilter === 'baked' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr><th className="px-8 py-4">Product</th><th className="px-8 py-4 text-center">Factory Stock</th><th className="px-8 py-4 text-right">Unit</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {factoryStock.map((s, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{s.item}</td>
                      <td className="px-8 py-6 text-center font-black text-lg text-gray-900">{s.quantity}</td>
                      <td className="px-8 py-6 text-right font-black text-[#F57C00] text-xs uppercase">{s.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cake Orders View */}
          {activeFilter === 'cake_orders' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr><th className="px-8 py-4">Cake</th><th className="px-8 py-4 text-center">Code</th><th className="px-8 py-4 text-center">Customer</th><th className="px-8 py-4 text-center">Payment</th><th className="px-8 py-4 text-right">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cakeOrders.map((cake) => (
                    <tr key={cake.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-black text-[#F57C00] uppercase text-sm">{cake.item}</td>
                      <td className="px-8 py-6 text-center text-lg text-gray-900">{cake.code}</td>
                      <td className="px-8 py-6 text-center text-sm text-gray-900">{cake.customer}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-xs font-black">
                          {cake.advancePayment ? `${cake.advancePayment.toLocaleString()} RWF` : 'No payment'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          cake.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                          cake.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {cake.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Received View */}
          {activeFilter === 'received' && (
            <div className="w-full max-w-full overflow-x-auto animate-in fade-in p-8 scrollbar-hide">
              <table className="w-full min-w-[800px] whitespace-nowrap text-left font-bold border-collapse">
                <thead className="bg-gray-50/50 font-black uppercase text-[10px] text-gray-400 border-b border-gray-200">
                  <tr><th className="px-8 py-4">Item</th><th className="px-8 py-4 text-center">Qty</th><th className="px-8 py-4 text-right">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {receivedStock.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 uppercase text-sm font-black text-[#F57C00]">{s.item}</td>
                      <td className="px-8 py-6 text-center text-lg">{s.quantity}</td>
                      <td className="px-8 py-6 text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                          {s.status || 'Received'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}