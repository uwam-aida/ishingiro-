import React, { useState, useEffect } from 'react';
import { AlertCircle, CreditCard, Wallet, UserCheck, CheckCircle2, Info, MapPin, User, LogOut } from 'lucide-react';

export default function Step5Payment({ formData, setFormData, handlePrev }: any) {
  const [localError, setLocalError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cakeCode, setCakeCode] = useState('');

  if (!formData) return null;

  const total = Number(formData?.totalAmount || 0);
  const instructionCost = Number(formData?.instructionCost || 0); 
  const paid = Number(formData?.paidAmount || 0);
  
  // Corrected calculation to include service amount
  const balance = (total + instructionCost) - paid;

  // INFINITY COUNTER LOGIC
  useEffect(() => {
    if (isSubmitted && !cakeCode) {
      // 1. Get the current count from permanent storage
      const savedCount = localStorage.getItem('ishingiro_cake_counter');

      // 2. If no count exists, start at 1. Otherwise, add 1.
      const nextCount = savedCount ? parseInt(savedCount, 10) + 1 : 1;

      // 3. Format with leading zero if less than 10 (01, 02... 99, 100...)
      const formattedNumber = nextCount < 10 ? `0${nextCount}` : `${nextCount}`;
      const generatedCode = `KS-${formattedNumber}`;
      
      setCakeCode(generatedCode);

      // 4. Save the new number back to storage so it continues forever
      localStorage.setItem('ishingiro_cake_counter', nextCount.toString());
    }
  }, [isSubmitted, cakeCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentMethod || paid <= 0 || !formData.payerName) {
      setLocalError(true);
      setTimeout(() => setLocalError(false), 3000);
      return;
    }
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    // This will take the user back to Step 1 for a new order
    window.location.reload(); 
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="bg-[#5D4037] p-4 rounded-full shadow-lg">
          <CheckCircle2 size={48} className="text-white" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[#5D4037] tracking-tighter uppercase leading-tight">Order Submitted Successfully!</h2>
          <p className="text-sm font-bold text-gray-500">Thank you for choosing ISHINGIRO Bakery.</p>
        </div>

        {/* PERSISTENT SEQUENTIAL CODE */}
        <div className="w-full border-2 border-dashed border-[#5D4037] p-5 rounded-xl bg-[#FDF8F5]">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Permanent Cake Code</p>
          <p className="text-4xl font-black text-[#5D4037] uppercase tracking-widest">
            {cakeCode}
          </p>
        </div>

        <div className="w-full text-left bg-white p-5 rounded-xl space-y-3 border-2 border-gray-100 shadow-sm">
           <p className="text-[10px] font-black text-[#5D4037] uppercase border-b border-gray-100 pb-2 flex items-center gap-2">
             <Info size={12}/> Order Summary
           </p>
           <div className="grid grid-cols-2 gap-y-3 text-xs font-bold text-gray-800">
              <span className="text-gray-500 uppercase text-[9px]">Service Amount:</span>
              <span className="text-right text-[#5D4037]">{instructionCost.toLocaleString()} RWF</span>

              <span className="text-gray-500 uppercase text-[9px]">Amount Paid:</span>
              <span className="text-right text-green-600 font-black">{paid.toLocaleString()} RWF</span>
              
              <span className="text-gray-500 uppercase text-[9px]">Remaining Balance:</span>
              <span className="text-right text-red-500 font-black">{balance.toLocaleString()} RWF</span>
              
              <span className="text-gray-500 uppercase text-[9px]">Received at:</span>
              <span className="text-right truncate font-bold">{formData.receptionLocation === 'Other' ? formData.otherReceptionLocation : formData.receptionLocation}</span>
              
              <span className="text-gray-500 uppercase text-[9px]">Receiver Name:</span>
              <span className="text-right truncate font-black uppercase">{formData.orderReceiverName}</span>
           </div>
           
           {formData.specialInstructions && (
             <div className="pt-3 border-t border-gray-100 mt-2">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Additional Info:</p>
                <p className="text-[11px] font-bold text-gray-600 italic">"{formData.specialInstructions}"</p>
             </div>
           )}
        </div>

        <button 
          onClick={handleFinish}
          className="w-full py-4 rounded-xl font-black bg-[#5D4037] text-white uppercase text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          OK, New Order <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Payment Details</h2>

      <div className="space-y-5 pt-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
            <CreditCard size={12} /> Payment Method
          </label>
          <select
            value={formData?.paymentMethod || ''}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className={`w-full border-2 ${localError && !formData.paymentMethod ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white transition-all`}
          >
            <option value="">Select Payment Method</option>
            <option value="Momo">MTN Mobile Money (046817)</option>
            <option value="Cash">CASH</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
            <Wallet size={12} /> Paid Amount (Rwf):
          </label>
          <input
            type="number"
            placeholder="0"
            value={formData?.paidAmount || ''}
            onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
            className={`w-full border-2 ${localError && paid <= 0 ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`}
          />
        </div>

        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase px-1">
          <span>Service Amount:</span>
          <span>{instructionCost.toLocaleString()} RWF</span>
        </div>

        <div className="bg-[#FDF8F5] border-2 border-[#EADCCF] rounded-xl p-5 shadow-sm">
           <div className="flex justify-between text-base font-black text-[#5D4037]">
              <span className="uppercase tracking-tighter">Remaining Balance:</span>
              <span>{(balance).toLocaleString()} RWF</span>
            </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
            <UserCheck size={12} /> Payer Name:
          </label>
          <input
            type="text"
            placeholder="Enter Payer Name"
            value={formData?.payerName || ''}
            onChange={(e) => setFormData({ ...formData, payerName: e.target.value })}
            className={`w-full border-2 ${localError && !formData.payerName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`}
          />
        </div>
      </div>

      <div className="pt-6">
        {localError && (
          <div className="flex items-center gap-2 text-red-600 font-black text-[10px] mb-4 animate-pulse uppercase">
            <AlertCircle size={14} />
            <span>Missing: Method, Paid Amount, or Payer Name.</span>
          </div>
        )}

        <div className="flex justify-between items-center">
            <button type="button" onClick={handlePrev} className="px-8 py-3 rounded-md font-bold uppercase text-xs bg-[#DBC8BD] text-white hover:opacity-90 transition-all shadow-sm">
              Previous
            </button>
            <button type="button" onClick={handleSubmit} className="px-10 py-3 rounded-md font-bold bg-[#5D4037] text-white uppercase text-xs shadow-md active:scale-95 transition-all">
              Submit Order
            </button>
        </div>
      </div>
    </div>
  );
}