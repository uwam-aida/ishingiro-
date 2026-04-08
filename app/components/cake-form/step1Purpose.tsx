import React, { useState, useMemo } from 'react';
import { ChevronDown, AlertCircle, Truck, Layers, Banknote } from 'lucide-react';

export default function Step1Purpose({ formData, setFormData, handleNext, handlePrev }: any) {
  const [localError, setLocalError] = useState(false);

  const weddingStages = [
    { label: "Stage 1", price: "7,000 RWF" },
    { label: "Stage 2", price: "8,000 RWF" },
    { label: "Stage 3", price: "14,000 RWF" },
    { label: "Stage 4", price: "19,000 RWF" },
    { label: "Stage 5", price: "24,000 RWF" },
    { label: "Stage 6", price: "38,000 RWF" },
  ];

  // NEW: Stages for non-wedding cakes
  const standardStages = [
    { label: "Stage 1", price: "8,000 RWF" },
    { label: "Stage 2", price: "10,000 RWF" },
    { label: "Stage 3", price: "12,000 RWF" },
    { label: "Stage 4", price: "15,000 RWF" },
  ];

  // --- CALCULATION LOGIC (FIXED TO IGNORE STAGE NUMBERS) ---
  const totalAmount = useMemo(() => {
    let total = 0;

    // 1. Calculate Base Size Price (if NO stages)
    if (formData.hasStages === "NO") {
      if (formData.size === "Above") {
        total += Number(formData.customPrice || 0);
      } else if (formData.size) {
        // Split by the dash to only get the price part
        const pricePart = formData.size.split(' - ')[1] || formData.size;
        const price = parseInt(pricePart.replace(/[^0-9]/g, ''));
        if (!isNaN(price)) total += price;
      }
    }

    // 2. Calculate Stages Price (Wedding or YES stages)
    if (formData.purpose === "Wedding" || formData.hasStages === "YES") {
      if (formData.weddingStage) {
        const selected = formData.weddingStage.split(', ');
        selected.forEach((s: string) => {
          // Split by the dash to ignore "Stage 1", "Stage 2", etc.
          const pricePart = s.split(' - ')[1]; 
          if (pricePart) {
            const price = parseInt(pricePart.replace(/[^0-9]/g, ''));
            if (!isNaN(price)) total += price;
          }
        });
      }
    }

    return total;
  }, [formData]);

  // Helper to handle multiple checkbox selections
  const handleStageToggle = (value: string) => {
    const currentStages = formData.weddingStage ? formData.weddingStage.split(', ') : [];
    let newStages;
    
    if (currentStages.includes(value)) {
      newStages = currentStages.filter((s: string) => s !== value);
    } else {
      newStages = [...currentStages, value];
    }
    
    const finalString = newStages.join(', ');
    setFormData({ ...formData, weddingStage: finalString, size: finalString });
  };

  const validateAndNext = () => {
    // Check if main fields are selected
    const isPurposeValid = formData.purpose === "Other" ? formData.otherPurpose?.trim() : formData.purpose;
    const isFlavorValid = formData.flavor === "Other" ? formData.otherFlavor?.trim() : formData.flavor;
    
    let isSizeOrStageValid = false;

    if (formData.purpose === "Wedding") {
        isSizeOrStageValid = !!formData.weddingStage && formData.weddingStage.length > 0;
    } else if (formData.purpose) {
        // Validation for other cakes: must choose YES/NO, and if YES, must choose stages
        if (formData.hasStages === "YES") {
            isSizeOrStageValid = !!formData.weddingStage && formData.weddingStage.length > 0;
        } else if (formData.hasStages === "NO") {
            isSizeOrStageValid = formData.size === "Above" ? !!formData.customPrice : !!formData.size;
        } else {
            isSizeOrStageValid = false; // User didn't pick YES or NO
        }
    }

    if (!isPurposeValid || !isSizeOrStageValid || !isFlavorValid) {
      setLocalError(true);
      setTimeout(() => setLocalError(false), 3000);
      return;
    }

    setLocalError(false);
    handleNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#5D4037] mb-6">Cake Purpose</h2>
        
        <div className="space-y-6">
          {/* PURPOSE SELECT */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">What is the purpose of your cake?</label>
            <div className="relative">
              <select 
                value={formData.purpose} 
                onChange={(e) => setFormData({...formData, purpose: e.target.value, hasStages: '', weddingStage: '', size: ''})} 
                className={`w-full border-2 ${localError && !formData.purpose ? 'border-red-400' : 'border-gray-200'} p-3 rounded-lg font-bold text-gray-800 appearance-none outline-none focus:border-[#5D4037] bg-white transition-colors`}
              >
                <option value="" className="text-gray-400">Select Purpose</option>
                <option value="Birthday">Birthday</option>
                <option value="Wedding">Wedding</option>
                <option value="Graduation">Graduation</option>
                <option value="Bridal Shower">Bridal Shower</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={20} />
            </div>
            {formData.purpose === "Other" && (
              <input
                type="text"
                placeholder="Please specify the purpose"
                className="w-full mt-2 border-2 border-gray-100 p-3 rounded-lg font-bold text-gray-800 outline-none focus:border-[#5D4037] bg-white animate-in slide-in-from-top-1 duration-300 placeholder:text-gray-400"
                onChange={(e) => setFormData({...formData, otherPurpose: e.target.value})}
              />
            )}
          </div>

          {/* STAGE CHOICE (YES/NO) - Visible for all except Wedding */}
          {formData.purpose && formData.purpose !== "Wedding" && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="text-sm font-bold text-[#5D4037] uppercase tracking-wide flex items-center gap-2">
                    <Layers size={16}/> Does this cake have stages?
                </label>
                <div className="flex gap-4">
                    {["YES", "NO"].map((choice) => (
                        <label key={choice} className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all font-black text-xs ${formData.hasStages === choice ? 'border-[#5D4037] bg-[#5D4037] text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                            <input 
                                type="radio" 
                                name="hasStages" 
                                value={choice} 
                                checked={formData.hasStages === choice}
                                onChange={(e) => setFormData({...formData, hasStages: e.target.value, weddingStage: '', size: ''})}
                                className="hidden"
                            />
                            {choice}
                        </label>
                    ))}
                </div>
            </div>
          )}

          {/* DYNAMIC STAGES OR SIZE SELECT */}
          {formData.purpose && (
             <>
                {/* Show Stages if Wedding OR if other cake + YES stages */}
                {(formData.purpose === "Wedding" || formData.hasStages === "YES") ? (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
                        <label className="text-sm font-bold text-[#5D4037] uppercase tracking-wide">Select Stages (Multiple selection)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(formData.purpose === "Wedding" ? weddingStages : standardStages).map((stage) => {
                                const value = `${stage.label} - ${stage.price}`;
                                const isChecked = formData.weddingStage?.split(', ').includes(value);
                                return (
                                    <label key={stage.label} className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${isChecked ? 'border-[#5D4037] bg-[#5D4037]/5' : 'border-gray-100 bg-white'}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" checked={isChecked} onChange={() => handleStageToggle(value)} className="w-4 h-4 rounded accent-[#5D4037]" />
                                            <span className="font-bold text-gray-800 text-sm">{stage.label}</span>
                                        </div>
                                        <span className="font-black text-[#5D4037] text-xs">{stage.price}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Show Size only if user selected NO to stages */
                    formData.hasStages === "NO" && (
                        <div className="space-y-2 animate-in fade-in">
                            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Select Size</label>
                            <div className="relative">
                                <select 
                                    value={formData.size} 
                                    onChange={(e) => setFormData({...formData, size: e.target.value})} 
                                    className={`w-full border-2 ${localError && !formData.size ? 'border-red-400' : 'border-gray-200'} p-3 rounded-lg font-bold text-gray-800 appearance-none outline-none focus:border-[#5D4037] bg-white transition-colors`}
                                >
                                    <option value="" className="text-gray-400">Select Size</option>
                                    <option value="Small - 8,000 RWF">Small - 8,000 RWF</option>
                                    <option value="Medium - 10,000 RWF">Medium - 10,000 RWF</option>
                                    <option value="Large - 12,000 RWF">Large - 12,000 RWF</option>
                                    <option value="Extra Large - 15,000 RWF">Extra Large - 15,000 RWF</option>
                                    <option value="Above">Above</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={20} />
                            </div>
                            {formData.size === "Above" && (
                                <input type="number" placeholder="Enter custom amount (RWF)" className="w-full mt-2 border-2 border-gray-100 p-3 rounded-lg font-bold text-gray-800 outline-none focus:border-[#5D4037] bg-white" onChange={(e) => setFormData({...formData, customPrice: e.target.value})} />
                            )}
                        </div>
                    )
                )}
             </>
          )}

          {/* WEDDING SERVICE COMMENT (Only for Wedding) */}
          {formData.purpose === "Wedding" && (
                <div className="space-y-2 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <label className="text-[10px] font-black text-orange-800 uppercase tracking-widest flex items-center gap-1">
                        <Truck size={12} /> Service (Transport, etc. - Comment only)
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Transport: 5000 RWF"
                        className="w-full border-2 border-orange-200 p-3 rounded-lg font-bold text-gray-800 outline-none focus:border-orange-500 bg-white placeholder:text-gray-300 text-sm"
                        value={formData.weddingServiceComment || ''}
                        onChange={(e) => setFormData({...formData, weddingServiceComment: e.target.value})}
                    />
                </div>
          )}

          {/* FLAVOR SELECT */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Select Flavor</label>
            <div className="relative">
              <select 
                value={formData.flavor} 
                onChange={(e) => setFormData({...formData, flavor: e.target.value})} 
                className={`w-full border-2 ${localError && !formData.flavor ? 'border-red-400' : 'border-gray-200'} p-3 rounded-lg font-bold text-gray-800 appearance-none outline-none focus:border-[#5D4037] bg-white transition-colors`}
              >
                <option value="" className="text-gray-400">Select Flavor</option>
                <option value="Vanilla">Vanilla</option>
                <option value="Lemon">Lemon</option>
                <option value="Sponge">Sponge</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={20} />
            </div>
            {formData.flavor === "Other" && (
              <input type="text" placeholder="Please specify the flavor" className="w-full mt-2 border-2 border-gray-100 p-3 rounded-lg font-bold text-gray-800 outline-none focus:border-[#5D4037] bg-white animate-in slide-in-from-top-1" onChange={(e) => setFormData({...formData, otherFlavor: e.target.value})} />
            )}
          </div>
        </div>
      </div>

      {/* --- LIVE TOTAL AMOUNT DISPLAY --- */}
      <div className="p-4 bg-[#5D4037] rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 text-white/80">
              <Banknote size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Amount to be Paid</span>
          </div>
          <div className="text-right">
              <span className="text-xl font-black text-white">{totalAmount.toLocaleString()}</span>
              <span className="ml-1 text-[10px] font-bold text-white/60">RWF</span>
          </div>
      </div>

      <div className="pt-6">
        {localError && (
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs mb-4 animate-bounce">
            <AlertCircle size={14} />
            <span>Please complete all choices (Yes/No, Stages, or Size).</span>
          </div>
        )}

        <div className="flex justify-between">
          <button onClick={handlePrev} className="px-8 py-3 rounded-md font-bold uppercase text-xs bg-[#DBC8BD] text-white hover:opacity-90">Previous</button>
          <button onClick={validateAndNext} className="px-10 py-3 rounded-md font-bold bg-[#5D4037] text-white uppercase text-xs shadow-md active:scale-95 transition-all">Next</button>
        </div>
      </div>
    </div>
  );
}