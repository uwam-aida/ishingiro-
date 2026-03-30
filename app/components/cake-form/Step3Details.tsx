import React, { useState } from 'react';
import { AlertCircle, Banknote } from 'lucide-react';

export default function Step3Details({ formData, setFormData, handleNext, handlePrev }: any) {
  const [localError, setLocalError] = useState(false);

  // SAFEGUARD: If formData itself is missing, don't render anything
  if (!formData) return null;

  const validateAndNext = () => {
    // Required fields: Frosting Cream, Frosting Color, Decoration Color, Cake Message
    // If "Other" is selected for cream, ensure the specific cream is typed
    const isCreamValid = formData.frostingCream === "Other" ? formData.otherFrostingCream?.trim() : formData.frostingCream;

    if (!isCreamValid || !formData.frostingColor || !formData.decorationColor || !formData.cakeMessage) {
      setLocalError(true);
      setTimeout(() => setLocalError(false), 3000);
      return;
    }
    setLocalError(false);
    handleNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Cake Details</h2>
      
      <div className="space-y-4 pt-4">
        {/* Frosting Cream */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Select Frosting cream</label>
          <div className="relative">
            <select 
              value={formData.frostingCream || ''} 
              onChange={(e) => setFormData({...formData, frostingCream: e.target.value})} 
              className={`w-full border-2 ${localError && !formData.frostingCream ? 'border-red-400' : 'border-gray-200'} rounded-lg p-3 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm`}
            >
              <option value="">Select Frosting</option>
              <option value="Butter cream">Butter cream</option>
              <option value="Loyal Cream">Loyal Cream</option>
              <option value="Fondant Cream">Fondant Cream</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Conditional Input for Other Cream */}
          {formData.frostingCream === "Other" && (
            <input
              type="text"
              placeholder="Specify your frosting cream type"
              value={formData.otherFrostingCream || ''}
              onChange={(e) => setFormData({...formData, otherFrostingCream: e.target.value})}
              className="w-full mt-2 border-2 border-gray-100 p-3 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-[#5D4037] bg-white animate-in slide-in-from-top-1 duration-300"
            />
          )}
        </div>

        {/* Frosting Color */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Frosting Color</label>
          <select 
            value={formData.frostingColor || ''} 
            onChange={(e) => setFormData({...formData, frostingColor: e.target.value})} 
            className={`w-full border-2 ${localError && !formData.frostingColor ? 'border-red-400' : 'border-gray-200'} rounded-lg p-3 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm`}
          >
            <option value="">Select Color</option>
            <option value="White">White</option>
            <option value="Pink">Pink</option>
            <option value="Blue">Blue</option>
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
            <option value="Purple">Purple</option>
            <option value="See picture">See picture</option>
          </select>
        </div>

        {/* Decoration Color */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Decoration Color</label>
          <select 
            value={formData.decorationColor || ''} 
            onChange={(e) => setFormData({...formData, decorationColor: e.target.value})} 
            className={`w-full border-2 ${localError && !formData.decorationColor ? 'border-red-400' : 'border-gray-200'} rounded-lg p-3 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm`}
          >
            <option value="">Select Color</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="White">White</option>
            <option value="Pink">Pink</option>
            <option value="Blue">Blue</option>
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
            <option value="Purple">Purple</option>
            <option value="See picture">See picture</option>
          </select>
        </div>

        {/* Cake Message */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Cake Message</label>
          <input 
            type="text" 
            placeholder="Happy Birthday..." 
            value={formData.cakeMessage || ''} 
            onChange={(e) => setFormData({...formData, cakeMessage: e.target.value})} 
            className={`w-full border-2 ${localError && !formData.cakeMessage ? 'border-red-400' : 'border-gray-200'} rounded-lg p-3 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 shadow-sm`} 
          />
        </div>

        {/* Special Instructions - Optional */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Additional Instructions (Optional)</label>
          <textarea 
            placeholder="Any specific details..." 
            value={formData.specialInstructions || ''} 
            onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} 
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm font-bold h-24 outline-none resize-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm" 
          />
        </div>

        {/* Instruction Cost - Optional & Professional */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
            <Banknote size={14} className="text-[#5D4037]" /> Extra Cost for Instructions (Optional)
          </label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="0" 
              value={formData.instructionCost || ''} 
              onChange={(e) => setFormData({...formData, instructionCost: e.target.value})} 
              className="w-full border-2 border-gray-200 rounded-lg p-3 pl-12 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 bg-gray-50 shadow-inner" 
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 border-r pr-2 border-gray-200">
              RWF
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        {/* INLINE VALIDATION ERROR */}
        {localError && (
          <div className="flex items-center gap-2 text-red-600 font-black text-xs mb-4 animate-pulse">
            <AlertCircle size={14} strokeWidth={3} />
            <span>Please complete all required fields (Frosting, Colors, and Message).</span>
          </div>
        )}

        <div className="flex justify-between">
          <button 
            onClick={handlePrev} 
            className="px-8 py-3 rounded-md font-bold uppercase text-xs bg-[#DBC8BD] text-white hover:opacity-90 transition-all shadow-sm"
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