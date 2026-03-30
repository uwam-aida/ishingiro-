import React, { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Step1Purpose({ formData, setFormData, handleNext, handlePrev }: any) {
  const [localError, setLocalError] = useState(false);

  const validateAndNext = () => {
    // Check if main fields are selected
    const isPurposeValid = formData.purpose === "Other" ? formData.otherPurpose?.trim() : formData.purpose;
    const isSizeValid = formData.size === "Above" ? formData.customPrice : formData.size;
    const isFlavorValid = formData.flavor === "Other" ? formData.otherFlavor?.trim() : formData.flavor;

    if (!isPurposeValid || !isSizeValid || !isFlavorValid) {
      setLocalError(true);
      // Auto-hide error after 3 seconds
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
                onChange={(e) => setFormData({...formData, purpose: e.target.value})} 
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

          {/* SIZE SELECT */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">Select Size</label>
            <div className="relative">
              <select 
                value={formData.size} 
                onChange={(e) => setFormData({...formData, size: e.target.value})} 
                className={`w-full border-2 ${localError && !formData.size ? 'border-red-400' : 'border-gray-200'} p-3 rounded-lg font-bold text-gray-800 appearance-none outline-none focus:border-[#5D4037] bg-white transition-colors`}
              >
                <option value="" className="text-gray-400">Select Size</option>
                <option value="Small - 7,000 RWF">Small - 7,000 RWF</option>
                <option value="Medium - 10,000 RWF">Medium - 10,000 RWF</option>
                <option value="Large - 12,000 RWF">Large - 12,000 RWF</option>
                <option value="Extra Large - 15,000 RWF">Extra Large - 15,000 RWF</option>
                <option value="Above">Above</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={20} />
            </div>
            {formData.size === "Above" && (
              <input
                type="number"
                placeholder="Enter custom amount (RWF)"
                className="w-full mt-2 border-2 border-gray-100 p-3 rounded-lg font-bold text-gray-800 outline-none focus:border-[#5D4037] bg-white animate-in slide-in-from-top-1 duration-300 placeholder:text-gray-400"
                onChange={(e) => setFormData({...formData, customPrice: e.target.value})}
              />
            )}
          </div>

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
              <input
                type="text"
                placeholder="Please specify the flavor"
                className="w-full mt-2 border-2 border-gray-100 p-3 rounded-lg font-bold text-gray-800 outline-none focus:border-[#5D4037] bg-white animate-in slide-in-from-top-1 duration-300 placeholder:text-gray-400"
                onChange={(e) => setFormData({...formData, otherFlavor: e.target.value})}
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-6">
        {/* INLINE VALIDATION ERROR */}
        {localError && (
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs mb-4 animate-bounce">
            <AlertCircle size={14} />
            <span>Please fill in all required fields before proceeding.</span>
          </div>
        )}

        <div className="flex justify-between">
          <button 
            onClick={handlePrev} 
            className="px-8 py-3 rounded-md font-bold uppercase text-xs bg-[#DBC8BD] text-white hover:opacity-90 transition-all"
          >
            Previous
          </button>
          <button 
            onClick={validateAndNext} 
            className="px-10 py-3 rounded-md font-bold bg-[#5D4037] text-white uppercase text-xs shadow-md active:scale-95 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}