'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { ChevronDown, Cake, Check, X, Star, Award, UploadCloud, Eraser, Calendar } from 'lucide-react';

export default function CakeOrderForm() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(0); 
  const [showError, setShowError] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(''); 
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [formData, setFormData] = useState({
    purpose: '',
    size: '',
    flavor: '',
    needsSample: '', 
    cakeFile: null as File | null, 
    cakeDrawing: '', 
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#5D4037';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setFormData(prev => ({ ...prev, cakeDrawing: dataUrl }));
    }
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setFormData(prev => ({ ...prev, cakeDrawing: '' }));
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
        setShowError(true); return;
    }
    if (step === 2 && (!formData.cakeFile && !formData.cakeDrawing)) {
        setShowError(true); return;
    }
    if (step === 3 && (!formData.frostingCream || !formData.frostingColor || !formData.decorationColor || !formData.cakeMessage || !formData.specialInstructions)) {
        setShowError(true); return;
    }
    if (step === 4 && (!formData.customerFullName || !formData.customerPhoneNumber || !formData.orderReceiverName || !formData.orderDate || !formData.orderLocation || !formData.cakeCode || !formData.pickupDate || !formData.receptionLocation)) {
        setShowError(true); return;
    }
    setShowError(false);
    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!formData.paymentMethod || !formData.paidAmount || !formData.payerName) {
        setShowError(true); return;
    }
    
    // CAPTURE ORDER TIME
    const submissionTime = new Date().toLocaleString();
    const randomNum = Math.floor(Math.random() * 100);
    const code = `KS-${randomNum}`;
    
    // LOGIC TO SEND TO SHOP-MANAGER & STORE-KEEPER
    console.log("Order submitted to Shop Manager and Store Keeper", {
        ...formData,
        cakeCode: code,
        orderMadeAt: submissionTime
    });

    setGeneratedCode(code);
    setStep(6); 
  };

  const handlePrev = () => {
    step === 0 ? router.back() : setStep(step - 1);
  };

  const remainingBalance = Number(formData.totalAmount) - Number(formData.paidAmount || 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 relative font-sans">
      
      {showError && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-center">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-2xl p-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-red-100 flex items-center justify-center mb-6">
              <X className="text-red-500" size={48} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Validation Error</h2>
            <div className="space-y-2 mb-8 text-gray-500 font-medium text-sm text-center">
              {step === 1 && <p>Please fill all Purpose selections</p>}
              {step === 2 && <p>Upload the image of cake or draw image of cake</p>}
              {step === 3 && <p>Please complete all Cake Details fields</p>}
              {step === 4 && <p>Please fill all Order Information fields</p>}
              {step === 5 && <p>Please complete payment details and payer name</p>}
            </div>
            <button onClick={() => setShowError(false)} className="bg-red-500 text-white px-8 py-2 rounded-md font-bold uppercase text-xs">OK</button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center pt-10 pb-6">
        <div className="w-32 h-32 mb-4 bg-[#F7F3F2] rounded-full flex items-center justify-center border-4 border-[#5D4037]/5">
           <Cake size={60} className="text-[#5D4037]" />
        </div>
        <h1 className="text-2xl font-black text-[#5D4037] uppercase tracking-tight text-center px-4 max-w-xl">
          ISHINGIRO Bakery Online Cake Order Form
        </h1>
      </div>

      {step === 0 && (
        <div className="max-w-2xl mx-auto px-6 text-center animate-in fade-in duration-500">
          <p className="text-[#A67C37] font-bold uppercase tracking-widest text-xs mb-4">Welcome</p>
          <div className="w-full h-px bg-[#D7CCC8] mb-8"></div>
          <p className="text-gray-500 text-sm mb-12 font-medium max-w-md mx-auto leading-relaxed">We specialize in creating beautiful, delicious cakes for all your special occasions.</p>
          <button onClick={() => setStep(1)} className="bg-[#5D4037] text-white px-12 py-4 rounded-xl font-bold uppercase text-sm shadow-lg transition-all">Start Your Order</button>
        </div>
      )}

      {step > 0 && step <= 5 && (
        <>
          <div className="max-w-3xl mx-auto px-6 mb-12">
            <p className="text-center text-[#5D4037] font-bold mb-4 text-xs tracking-widest uppercase">Step {step} of 5</p>
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-[#D7CCC8] -translate-y-1/2 rounded-full"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-[#5D4037] -translate-y-1/2 transition-all duration-500 rounded-full" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
              <div className="relative flex justify-between">
                {steps.map((s) => (
                  <div key={s.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 border-4 transition-all duration-300 ${step > s.id ? 'bg-[#5D4037] text-white border-[#5D4037]' : step === s.id ? 'bg-[#5D4037] text-white border-[#5D4037]' : 'bg-white text-gray-400 border-[#D7CCC8]'}`}>
                      {step > s.id ? <Check size={20} strokeWidth={4} /> : s.id}
                    </div>
                    <span className={`mt-2 text-[10px] font-bold uppercase ${step >= s.id ? 'text-[#5D4037]' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-6 animate-in slide-in-from-right-4 duration-500 pb-10">
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 min-h-[420px]">
              
              {step === 1 && (
                <div className="space-y-6 pt-4">
                  <h2 className="text-xl font-black text-[#5D4037] border-b pb-4">Cake Purpose</h2>
                  <select value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} className="w-full border p-3 rounded-xl font-bold text-[#5D4037] outline-none"><option value="">Select Purpose</option><option value="Birthday">Birthday Cake</option></select>
                  <select value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="w-full border p-3 rounded-xl font-bold text-[#5D4037] outline-none"><option value="">Select Stages</option><option value="1 stage">1 stage</option></select>
                  <select value={formData.flavor} onChange={(e) => setFormData({...formData, flavor: e.target.value})} className="w-full border p-3 rounded-xl font-bold text-[#5D4037] outline-none"><option value="">Select Flavor</option><option value="Vanilla">Vanilla</option></select>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 pt-4">
                  <h2 className="text-xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Cake Design</h2>
                  <div className="flex gap-12">
                    <label className="flex items-center gap-2 cursor-pointer group"><input type="radio" name="sample" value="yes" checked={formData.needsSample === 'yes'} onChange={(e) => setFormData({...formData, needsSample: e.target.value})} className="w-5 h-5 accent-[#5D4037]" /><span className="text-sm font-bold">Yes</span></label>
                    <label className="flex items-center gap-2 cursor-pointer group"><input type="radio" name="sample" value="no" checked={formData.needsSample === 'no'} onChange={handlePrev} className="w-5 h-5 accent-[#5D4037]" /><span className="text-sm font-bold">No</span></label>
                  </div>
                  {formData.needsSample === 'yes' && (
                    <div className="space-y-4 pt-4 animate-in slide-in-from-top-2">
                       <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 relative cursor-pointer group">
                         <input type="file" accept="image/*" onChange={(e) => setFormData({...formData, cakeFile: e.target.files?.[0] || null})} className="absolute inset-0 opacity-0 cursor-pointer" />
                         <UploadCloud size={32} className="text-gray-400 group-hover:text-[#5D4037]" />
                         <p className="font-bold text-[#5D4037] text-xs">Click or drag photos here to upload</p>
                      </div>
                      <div className="space-y-4 pt-4">
                         <div className="flex justify-between items-center"><h3 className="font-bold text-[#5D4037] text-sm">Draw Design</h3><button onClick={clearDrawing} className="text-gray-400 hover:text-red-500 text-xs font-bold flex items-center gap-1"><Eraser size={14} /> Clear</button></div>
                         <canvas ref={canvasRef} width={500} height={200} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-48 border rounded-xl cursor-crosshair touch-none bg-gray-50" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Cake Details</h2>
                    <select value={formData.frostingCream} onChange={(e) => setFormData({...formData, frostingCream: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none"><option value="">Select Frosting</option><option value="Buttercream">Buttercream</option></select>
                    <select value={formData.frostingColor} onChange={(e) => setFormData({...formData, frostingColor: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none"><option value="">Select Color</option><option value="White">White</option></select>
                    <select value={formData.decorationColor} onChange={(e) => setFormData({...formData, decorationColor: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none"><option value="">Select Color</option><option value="Gold">Gold</option></select>
                    <input type="text" placeholder="Cake Message..." value={formData.cakeMessage} onChange={(e) => setFormData({...formData, cakeMessage: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                    <textarea placeholder="Instructions..." value={formData.specialInstructions} onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} className="w-full border rounded-lg p-2 text-sm h-20 outline-none resize-none" />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Order Information</h2>
                  <input type="text" placeholder="Customer Name" value={formData.customerFullName} onChange={(e) => setFormData({...formData, customerFullName: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                  <input type="tel" placeholder="Phone Number" value={formData.customerPhoneNumber} onChange={(e) => setFormData({...formData, customerPhoneNumber: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                  <input type="text" placeholder="Receiver Name" value={formData.orderReceiverName} onChange={(e) => setFormData({...formData, orderReceiverName: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                  <input type="datetime-local" value={formData.orderDate} onChange={(e) => setFormData({...formData, orderDate: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                  <select value={formData.orderLocation} onChange={(e) => setFormData({...formData, orderLocation: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none"><option value="">Select Shop Location</option><option value="Main Store">Main Store</option></select>
                  <select value={formData.cakeCode} onChange={(e) => setFormData({...formData, cakeCode: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none"><option value="">Select Cake Code</option><option value="KS-46">KS-46</option></select>
                  <input type="datetime-local" value={formData.pickupDate} onChange={(e) => setFormData({...formData, pickupDate: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                  <select value={formData.receptionLocation} onChange={(e) => setFormData({...formData, receptionLocation: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none"><option value="">Select Shop Location</option><option value="Reception 1">Reception 1</option></select>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Payment Details</h2>
                  <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none"><option value="">Select Payment Method</option><option value="Cash">Cash</option><option value="Momo">Momo</option></select>
                  <input type="number" placeholder="Paid Amount..." value={formData.paidAmount} onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                  <div className="bg-[#FAF6F4] p-4 rounded-xl border border-[#E8DFD9]">
                        <h3 className="font-bold text-[#5D4037] text-xs uppercase mb-2 text-center">Payment Summary</h3>
                        <p className="text-[11px] text-gray-600 font-medium">Remaining Balance: {remainingBalance} RWF</p>
                  </div>
                  <input type="text" placeholder="Payer name" value={formData.payerName} onChange={(e) => setFormData({...formData, payerName: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
                </div>
              )}

              <div className="flex justify-between mt-12 pt-10 border-t border-gray-50">
                <button onClick={handlePrev} className="px-8 py-3 rounded-lg font-bold uppercase text-xs bg-[#E0D7D5] text-gray-400">Previous</button>
                {step < 5 ? (
                  <button onClick={handleNext} className="px-10 py-3 rounded-lg font-bold bg-[#5D4037] text-white uppercase text-xs shadow-md">Next</button>
                ) : (
                  <button onClick={handleSubmit} className="px-10 py-3 rounded-lg font-bold bg-[#5D4037] text-white uppercase text-xs shadow-md hover:bg-[#4E342E] transition-all">Submit Order</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {step === 6 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-[#5D4037] rounded-full flex items-center justify-center mx-auto shadow-lg"><Check size={40} className="text-white" strokeWidth={4} /></div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#5D4037]">Order Submitted Successfully!</h2>
                <p className="text-xs text-gray-500 font-medium text-center">Your order is now visible to the Shop Manager and Store Keeper.</p>
            </div>
            <div className="py-4 border-2 border-dashed border-[#A67C37]/30 rounded-2xl bg-[#FAF6F4]">
                <p className="text-[#A67C37] font-black text-xl tracking-widest">Cake Code: {generatedCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
                <button onClick={() => router.push('/dashboard')} className="py-4 bg-[#5D4037] text-white rounded-xl font-bold uppercase text-[9px] shadow-md">Store-Keeper</button>
                <button onClick={() => router.push('/shop-manager')} className="py-4 bg-[#A67C37] text-white rounded-xl font-bold uppercase text-[9px] shadow-md">Shop-Manager</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}