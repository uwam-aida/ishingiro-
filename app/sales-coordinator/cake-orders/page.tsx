'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Cake, 
  Check, 
  X, 
  ArrowLeft, 
  Eye,
  LogOut 
} from 'lucide-react';

// Import the step components from your components folder
import Step1Purpose from '../../components/cake-form/step1Purpose';
import Step2Design from '../../components/cake-form/Step2Design';
import Step3Details from '../../components/cake-form/Step3Details';
import Step4Contact from '../../components/cake-form/Step4Contact';
import Step5Payment from '../../components/cake-form/Step5Payment';

export default function CakeOrderForm() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [step, setStep] = useState(0); 
  const [showError, setShowError] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(''); 
  
  const [formData, setFormData] = useState({
    purpose: '', 
    size: '', 
    flavor: '', 
    needsSample: '', 
    cakeFile: null as File | null, 
    frostingCream: '', 
    frostingColor: '', 
    decorationColor: '',
    cakeMessage: '', 
    specialInstructions: '',
    customerFullName: '', 
    customerPhoneNumber: '',
    orderReceiverName: '', 
    orderDate: '', 
    orderLocation: '',
    cakeCode: '', 
    pickupDate: '', 
    receptionLocation: '',
    paymentMethod: '', 
    totalAmount: '7000', 
    paidAmount: '', 
    payerName: ''
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ishingiro-m4th.onrender.com/api';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Logout function
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

  if (!isMounted) return null;

  const steps = [
    { id: 1, label: 'Purpose' },
    { id: 2, label: 'Design' },
    { id: 3, label: 'Details' },
    { id: 4, label: 'Contact' },
    { id: 5, label: 'Payment' },
  ];

  const handleNext = () => {
    if (step === 1 && (!formData.purpose || !formData.size || !formData.flavor)) {
        setShowError(true); 
        return;
    }
    setShowError(false);
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    // Check validation before starting
    if (!formData.paymentMethod || !formData.paidAmount || !formData.payerName) {
        setShowError(true); 
        return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const submitData = new FormData();
      
      // Core Contact & Order Info
      submitData.append('customer_name', formData.customerFullName || "Guest");
      submitData.append('phone', formData.customerPhoneNumber || "N/A");
      submitData.append('cake_type', `${formData.purpose} (${formData.flavor})`);
      submitData.append('quantity', '1');
      submitData.append('price', formData.totalAmount);
      submitData.append('location', formData.orderLocation || "kabuga");
      submitData.append('delivery_date', formData.pickupDate || new Date().toISOString().split('T')[0]);
      
      // Financials
      submitData.append('payment_method', formData.paymentMethod);
      submitData.append('advance_payment', formData.paidAmount); 
      submitData.append('payer_name', formData.payerName);

      // Detailed Specs
      submitData.append('cake_size', formData.size);
      submitData.append('frosting_cream', formData.frostingCream);
      submitData.append('frosting_color', formData.frostingColor);
      submitData.append('cake_message', formData.cakeMessage);
      submitData.append('special_instructions', formData.specialInstructions);
      submitData.append('reception_location', formData.receptionLocation || "N/A");
      submitData.append('needs_sample', formData.needsSample === 'yes' ? 'true' : 'false');

      // Image
      if (formData.cakeFile) {
        submitData.append('inspo_image', formData.cakeFile);
      }

      const response = await fetch(`${baseUrl}/sales/cake-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: submitData
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedCode(result.id ? `KS-${result.id}` : `KS-${Math.floor(Math.random() * 100)}`);
        setStep(6); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Failed to submit order. Please check permissions.");
        setShowError(true);
      }
    } catch (error) {
      console.error("Failed to submit cake order:", error);
      alert("Network error. Please try again.");
    }
  };

  const handlePrev = () => {
    if (step === 1) router.back();
    else setStep(step - 1);
  };

  const remainingBalance = Number(formData.totalAmount) - Number(formData.paidAmount || 0);

  return (
    <div className="min-h-screen bg-white pb-20 relative font-sans text-gray-800">
      
      {/* Logout Button */}
      <div className="fixed top-4 right-4 z-[100] flex gap-3">
        <Link 
          href="/sales-coordinator/cake-orders/manage"
          className="flex items-center gap-2 px-4 py-2 bg-[#5D4037] text-white rounded-xl text-xs font-bold hover:bg-[#4E342E] transition-colors shadow-md"
        >
          <Eye size={16} /> View All Orders
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-md"
        >
          <LogOut size={16} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {showError && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-center">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl p-8 flex flex-col items-center border border-gray-100">
            <div className="w-20 h-20 rounded-full border-4 border-red-100 flex items-center justify-center mb-6">
              <X className="text-red-500" size={48} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Validation Error</h2>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Please check all required fields:
              {!formData.paymentMethod && <li className="text-left">Payment method is required</li>}
              {!formData.paidAmount && <li className="text-left">Payment amount is required</li>}
              {!formData.payerName && <li className="text-left">Payer name is required</li>}
            </p>
            <button onClick={() => setShowError(false)} className="bg-red-500 text-white px-8 py-2 rounded-md font-bold uppercase text-xs hover:bg-red-600 transition-colors">OK</button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center pt-8 relative max-w-3xl mx-auto px-6">
        <button 
          onClick={() => router.back()}
          className="absolute left-6 top-8 flex-shrink-0 flex items-center justify-center p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all text-[#1C1C1C]"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>

        <div className="w-48 h-24 relative mb-4">
            <img src="/cake-top.png" alt="Cake" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-black text-[#5D4037] uppercase tracking-tight text-center px-4">
          ISHINGIRO Bakery Online Cake Order Form
        </h1>
      </div>

      {step >= 1 && step <= 5 && (
        <div className="max-w-3xl mx-auto px-6 mt-10">
          <p className="text-center text-[#5D4037] font-bold mb-4 text-sm tracking-widest">Step {step} of 5</p>
          <div className="w-full h-1.5 bg-[#E6D5CC] rounded-full mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-[#5D4037] transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
          <div className="relative flex justify-between items-center px-2 mb-12">
            <div className="absolute top-5 left-0 w-full h-[2px] bg-[#E6D5CC] -z-10"></div>
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                  step === s.id 
                    ? 'bg-[#5D4037] text-white border-[#5D4037]' 
                    : step > s.id 
                      ? 'bg-[#5D4037] text-white border-[#5D4037]' 
                      : 'bg-white text-gray-300 border-[#E6D5CC]'
                }`}>
                  <div className="flex items-center gap-0.5">
                    <span>{s.id}</span>
                    {step > s.id && <Check size={10} strokeWidth={4} />}
                  </div>
                </div>
                <span className={`mt-2 text-[11px] font-bold uppercase ${step >= s.id ? 'text-[#5D4037]' : 'text-gray-300'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6">
        {step === 0 && (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
            <p className="text-[#5D4037] font-bold tracking-[0.2em] uppercase text-sm">Welcome</p>
            <div className="w-full h-px bg-[#DBC8BD]" />
            <p className="text-gray-500 max-w-md leading-relaxed font-medium">
              We specialize in creating beautiful, delicious cakes for all your special occasions. 
              From birthdays to weddings, our cakes will match your vision.
            </p>
            <div className="grid grid-cols-2 gap-8 w-full py-4">
              <div className="flex flex-col items-center space-y-3">
                <Cake className="text-[#5D4037]" size={32} />
                <h3 className="font-black text-[#5D4037] text-sm uppercase">Custom Designs</h3>
                <p className="text-xs text-gray-500 leading-tight font-bold">Personalized cakes for every occasion</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#5D4037] flex items-center justify-center">
                    <Check className="text-[#5D4037]" size={16} strokeWidth={4} />
                </div>
                <h3 className="font-black text-[#5D4037] text-sm uppercase">Quality Ingredients</h3>
                <p className="text-xs text-gray-500 leading-tight font-bold">Fresh, premium ingredients in every cake</p>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="bg-[#5D4037] text-white px-12 py-4 rounded-md font-bold uppercase text-xs shadow-xl active:scale-95 transition-all mt-4 hover:bg-[#4E342E]">
              Start Your Order
            </button>
          </div>
        )}

        {step === 1 && <Step1Purpose formData={formData} setFormData={setFormData} handleNext={handleNext} handlePrev={handlePrev} setShowError={setShowError} />}
        {step === 2 && <Step2Design formData={formData} setFormData={setFormData} handleNext={handleNext} handlePrev={handlePrev} setShowError={setShowError} />}
        {step === 3 && <Step3Details formData={formData} setFormData={setFormData} handleNext={handleNext} handlePrev={handlePrev} setShowError={setShowError} />}
        {step === 4 && <Step4Contact formData={formData} setFormData={setFormData} handleNext={handleNext} handlePrev={handlePrev} setShowError={setShowError} />}
        {step === 5 && <Step5Payment formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} handlePrev={handlePrev} remainingBalance={remainingBalance} setShowError={setShowError} />}
      </div>
      
      {step === 6 && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[200] p-6 text-center">
            <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Check size={40} className="text-white" strokeWidth={4} />
            </div>
            <h2 className="text-3xl font-black text-[#5D4037] mb-4">Order Submitted!</h2>
            <p className="text-[#A67C37] font-black text-xl mb-8 tracking-widest uppercase">Code: {generatedCode}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => { 
                  setStep(0); 
                  setFormData({
                    purpose: '', size: '', flavor: '', needsSample: '', 
                    cakeFile: null, frostingCream: '', frostingColor: '', decorationColor: '',
                    cakeMessage: '', specialInstructions: '',
                    customerFullName: '', customerPhoneNumber: '',
                    orderReceiverName: '', orderDate: '', orderLocation: '',
                    cakeCode: '', pickupDate: '', receptionLocation: '',
                    paymentMethod: '', totalAmount: '7000', paidAmount: '', payerName: ''
                  });
                }} 
                className="bg-[#5D4037] text-white px-10 py-3 rounded-md font-bold uppercase text-xs hover:bg-[#4E342E] transition-colors"
              >
                New Order
              </button>
              <button 
                onClick={() => router.push('/sales-coordinator/cake-orders/manage')} 
                className="bg-gray-200 text-gray-700 px-10 py-3 rounded-md font-bold uppercase text-xs hover:bg-gray-300 transition-colors"
              >
                View All Orders
              </button>
            </div>
        </div>
      )}
    </div>
  );
}