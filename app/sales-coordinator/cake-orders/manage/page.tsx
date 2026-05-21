'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Cake,
  ArrowLeft,
  Search,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Eye,
  X,
  Receipt,
  TrendingUp,
  Package
} from 'lucide-react';

interface CakeOrder {
  id: number;
  customer_name: string;
  phone: string;
  cake_type: string;
  quantity: number;
  price: number;
  advance_payment: number;
  remaining_payment: number;
  total_paid: number;
  location: string;
  delivery_date: string;
  status: string;
  cake_message?: string;
  cake_size?: string;
  frosting_cream?: string;
  frosting_color?: string;
  special_instructions?: string;
  reception_location?: string;
  needs_sample: boolean;
  inspo_image_url?: string;
  created_at: string;
  payment_method?: string;
  payer_name?: string;
}

export default function ManageCakeOrdersPage() {
  const router = useRouter();
  const [cakeOrders, setCakeOrders] = useState<CakeOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CakeOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [payerName, setPayerName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

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

  // Fetch cake orders
  const fetchCakeOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/sales/cake-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCakeOrders(data);
      } else {
        console.error("Failed to fetch cake orders");
      }
    } catch (error) {
      console.error("Error fetching cake orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Record additional payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("Please enter a valid payment amount");
      return;
    }

    if (amount > selectedOrder.remaining_payment) {
      setErrorMessage(`Amount exceeds remaining balance of ${selectedOrder.remaining_payment.toLocaleString()} RWF`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/sales/cake-order/${selectedOrder.id}/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_amount: amount,
          payment_method: paymentMethod,
          payer_name: payerName || selectedOrder.customer_name
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Payment of ${amount.toLocaleString()} RWF recorded successfully! Remaining: ${result.remaining_balance.toLocaleString()} RWF`);
        
        // Update the order in the list
        setCakeOrders(prev => prev.map(order => 
          order.id === selectedOrder.id 
            ? { 
                ...order, 
                total_paid: result.total_paid,
                remaining_payment: result.remaining_balance
              }
            : order
        ));
        
        // Reset form
        setPaymentAmount('');
        setPaymentMethod('cash');
        setPayerName('');
        setShowPaymentModal(false);
        setSelectedOrder(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const error = await response.json();
        setErrorMessage(error.error || error.message || "Failed to record payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchCakeOrders();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchCakeOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = cakeOrders.filter(order =>
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.cake_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toString().includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  const getPaymentStatusColor = (remaining: number, total: number) => {
    if (remaining === 0) return 'bg-green-100 text-green-700';
    if (remaining < total) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getPaymentStatusText = (remaining: number, total: number) => {
    if (remaining === 0) return 'Fully Paid';
    if (remaining < total) return 'Partial Payment';
    return 'Unpaid';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 pb-20">
      
      {/* Logout Button */}
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

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-green-200">
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <div className="p-3 bg-[#5D4037] rounded-2xl text-white shadow-lg">
          <Cake size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#5D4037]">Cake Order Management</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Track orders & record payments</p>
        </div>
        <button 
          onClick={() => router.push('/sales-coordinator/cake-orders')}
          className="flex items-center gap-2 px-4 py-2 bg-[#F57C00] text-white rounded-xl text-xs font-bold hover:bg-[#E67000] transition-colors"
        >
          <Cake size={16} /> New Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Orders</p>
          <p className="text-2xl font-black text-[#5D4037]">{cakeOrders.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Pending Orders</p>
          <p className="text-2xl font-black text-orange-600">{cakeOrders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Fully Paid</p>
          <p className="text-2xl font-black text-green-600">{cakeOrders.filter(o => o.remaining_payment === 0).length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Revenue</p>
          <p className="text-2xl font-black text-[#5D4037]">
            {cakeOrders.reduce((sum, o) => sum + o.total_paid, 0).toLocaleString()} RWF
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by customer name, cake type, or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5D4037]/20 focus:border-[#5D4037]"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#5D4037]" size={32} />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <Cake size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No cake orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#5D4037]/10 text-[#5D4037]">
                        #{order.id}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getPaymentStatusColor(order.remaining_payment, order.price)}`}>
                        {getPaymentStatusText(order.remaining_payment, order.price)}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-[#5D4037] uppercase">{order.cake_type}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User size={14} className="text-[#5D4037]" />
                        <span>{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={14} className="text-[#5D4037]" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={14} className="text-[#5D4037]" />
                        <span>{order.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} className="text-[#5D4037]" />
                        <span>{formatDate(order.delivery_date)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 p-4 rounded-xl min-w-[200px]">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment Summary</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Total:</span>
                      <span className="font-bold text-[#5D4037]">{order.price.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Paid:</span>
                      <span className="font-bold text-green-600">{order.total_paid.toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 border-t border-gray-200 mt-1">
                      <span className="text-gray-500">Remaining:</span>
                      <span className={`font-bold ${order.remaining_payment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {order.remaining_payment.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      <Eye size={14} /> View Details
                    </button>
                    {order.remaining_payment > 0 && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setPaymentAmount('');
                          setPaymentMethod('cash');
                          setPayerName('');
                          setErrorMessage('');
                          setShowPaymentModal(true);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors"
                      >
                        <DollarSign size={14} /> Record Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Receipt size={24} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Record Payment</h2>
                  <p className="text-gray-500 text-sm">Order #{selectedOrder.id} - {selectedOrder.customer_name}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Total Amount:</span>
                  <span className="font-bold text-[#5D4037]">{selectedOrder.price.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Already Paid:</span>
                  <span className="font-bold text-green-600">{selectedOrder.total_paid.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-bold text-gray-700">Remaining Balance:</span>
                  <span className="font-bold text-red-600 text-lg">{selectedOrder.remaining_payment.toLocaleString()} RWF</span>
                </div>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Payment Amount (RWF)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-lg outline-none focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-green-500 transition-all"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Payer Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Name of person paying"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-green-500 transition-all"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <p className="text-xs text-red-600">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <DollarSign size={18} /> Record Payment
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#5D4037] rounded-2xl">
                  <Cake size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Order Details</h2>
                  <p className="text-gray-500 text-sm">#{selectedOrder.id} • {selectedOrder.customer_name}</p>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                  Status: {selectedOrder.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getPaymentStatusColor(selectedOrder.remaining_payment, selectedOrder.price)}`}>
                  Payment: {getPaymentStatusText(selectedOrder.remaining_payment, selectedOrder.price)}
                </span>
                {selectedOrder.needs_sample && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                    Sample Requested
                  </span>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Customer Info */}
                <div>
                  <h3 className="text-xs font-black text-[#5D4037] uppercase tracking-widest mb-3">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="text-gray-400" />
                      <span className="font-medium">{selectedOrder.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-medium">{selectedOrder.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Info */}
                <div>
                  <h3 className="text-xs font-black text-[#5D4037] uppercase tracking-widest mb-3">Order Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Cake size={16} className="text-gray-400" />
                      <span className="font-medium">{selectedOrder.cake_type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Package size={16} className="text-gray-400" />
                      <span className="font-medium">Quantity: {selectedOrder.quantity}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="font-medium">Delivery: {formatDate(selectedOrder.delivery_date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cake Specifications */}
              {(selectedOrder.cake_size || selectedOrder.frosting_cream || selectedOrder.cake_message) && (
                <div className="mt-6">
                  <h3 className="text-xs font-black text-[#5D4037] uppercase tracking-widest mb-3">Cake Specifications</h3>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    {selectedOrder.cake_size && (
                      <p className="text-sm"><span className="font-bold">Size:</span> {selectedOrder.cake_size}</p>
                    )}
                    {selectedOrder.frosting_cream && (
                      <p className="text-sm"><span className="font-bold">Frosting:</span> {selectedOrder.frosting_cream}</p>
                    )}
                    {selectedOrder.frosting_color && (
                      <p className="text-sm"><span className="font-bold">Color:</span> {selectedOrder.frosting_color}</p>
                    )}
                    {selectedOrder.cake_message && (
                      <p className="text-sm"><span className="font-bold">Message:</span> "{selectedOrder.cake_message}"</p>
                    )}
                    {selectedOrder.special_instructions && (
                      <p className="text-sm"><span className="font-bold">Special Instructions:</span> {selectedOrder.special_instructions}</p>
                    )}
                    {selectedOrder.reception_location && (
                      <p className="text-sm"><span className="font-bold">Reception Location:</span> {selectedOrder.reception_location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="mt-6">
                <h3 className="text-xs font-black text-[#5D4037] uppercase tracking-widest mb-3">Payment Details</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Total Price:</span>
                    <span className="font-bold text-[#5D4037]">{selectedOrder.price.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Advance Payment:</span>
                    <span className="font-bold text-blue-600">{selectedOrder.advance_payment.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Total Paid:</span>
                    <span className="font-bold text-green-600">{selectedOrder.total_paid.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between py-2 pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-700">Remaining Balance:</span>
                    <span className={`font-bold text-lg ${selectedOrder.remaining_payment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedOrder.remaining_payment.toLocaleString()} RWF
                    </span>
                  </div>
                  {selectedOrder.payment_method && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="font-medium capitalize">{selectedOrder.payment_method}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Preview */}
              {selectedOrder.inspo_image_url && (
                <div className="mt-6">
                  <h3 className="text-xs font-black text-[#5D4037] uppercase tracking-widest mb-3">Inspiration Image</h3>
                  <img 
                    src={selectedOrder.inspo_image_url} 
                    alt="Cake inspiration"
                    className="w-full max-h-64 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}

              {/* Action Buttons */}
              {selectedOrder.remaining_payment > 0 && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setPaymentAmount('');
                    setPaymentMethod('cash');
                    setPayerName('');
                    setErrorMessage('');
                    setShowPaymentModal(true);
                  }}
                  className="w-full mt-6 py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
                >
                  <DollarSign size={18} /> Record Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}