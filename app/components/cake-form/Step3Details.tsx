import React, { useState } from 'react';
import { AlertCircle, Banknote } from 'lucide-react';

export default function Step3Details({ formData, setFormData, handleNext, handlePrev }: any) {
  const [localError, setLocalError] = useState(false);
  const [isTypingOther, setIsTypingOther] = useState({ cream: false, fColor: false, dColor: false });

  if (!formData) return null;

  const standardCreams = ["Butter cream", "Loyal Cream", "Fondant Cream"];
  const standardColors = ["White", "Pink", "Blue", "Yellow", "Green", "Red", "Purple"];
  const standardDecorColors = ["Gold", "Silver", "White", "Pink", "Blue", "Yellow", "Green", "Red", "Purple"];

  const validateAndNext = () => {
    if (!formData.frostingCream || !formData.frostingColor || !formData.decorationColor || !formData.cakeMessage) {
      setLocalError(true);
      setTimeout(() => setLocalError(false), 3000);
      return;
    }
    handleNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Cake Details</h2>
      
      <div className="space-y-4 pt-4">
        {/* Frosting Cream Section */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Select Frosting cream</label>
          <select 
            value={formData.frostingCream || ''} 
            onChange={(e) => {
              if (e.target.value === "Other") {
                setIsTypingOther({ ...isTypingOther, cream: true });
                setFormData({ ...formData, frostingCream: "" });
              } else {
                setIsTypingOther({ ...isTypingOther, cream: false });
                setFormData({ ...formData, frostingCream: e.target.value });
              }
            }} 
            className={`w-full border-2 ${localError && !formData.frostingCream ? 'border-red-400' : 'border-gray-200'} rounded-lg p-3 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm`}
          >
            <option value="">Select Frosting</option>
            {standardCreams.map(c => <option key={c} value={c}>{c}</option>)}
            {/* THIS IS THE MAGIC: If it's not a standard option, show the custom text here */}
            {formData.frostingCream && !standardCreams.includes(formData.frostingCream) && (
              <option value={formData.frostingCream}>{formData.frostingCream}</option>
            )}
            <option value="Other">Other...</option>
          </select>
          
          {isTypingOther.cream && (
            <input
              type="text"
              autoFocus
              placeholder="Type and press enter..."
              onKeyDown={(e) => e.key === 'Enter' && setIsTypingOther({ ...isTypingOther, cream: false })}
              onChange={(e) => setFormData({...formData, frostingCream: e.target.value})}
              className="w-full mt-2 border-2 border-[#5D4037] p-3 rounded-lg text-sm font-bold text-gray-900 outline-none bg-white animate-in slide-in-from-top-1"
            />
          )}
        </div>

        {/* Frosting Color Section */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Frosting Color</label>
          <select 
            value={formData.frostingColor || ''} 
            onChange={(e) => {
              if (e.target.value === "Other") {
                setIsTypingOther({ ...isTypingOther, fColor: true });
                setFormData({ ...formData, frostingColor: "" });
              } else {
                setIsTypingOther({ ...isTypingOther, fColor: false });
                setFormData({ ...formData, frostingColor: e.target.value });
              }
            }} 
            className={`w-full border-2 ${localError && !formData.frostingColor ? 'border-red-400' : 'border-gray-200'} rounded-lg p-3 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm`}
          >
            <option value="">Select Color</option>
            {standardColors.map(c => <option key={c} value={c}>{c}</option>)}
            {formData.frostingColor && !standardColors.includes(formData.frostingColor) && (
              <option value={formData.frostingColor}>{formData.frostingColor}</option>
            )}
            <option value="Other">Other...</option>
          </select>

          {isTypingOther.fColor && (
            <input
              type="text"
              autoFocus
              placeholder="Type color and press enter..."
              onKeyDown={(e) => e.key === 'Enter' && setIsTypingOther({ ...isTypingOther, fColor: false })}
              onChange={(e) => setFormData({...formData, frostingColor: e.target.value})}
              className="w-full mt-2 border-2 border-[#5D4037] p-3 rounded-lg text-sm font-bold text-gray-900 outline-none bg-white animate-in slide-in-from-top-1"
            />
          )}
        </div>

        {/* Decoration Color Section */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Decoration Color</label>
          <select 
            value={formData.decorationColor || ''} 
            onChange={(e) => {
              if (e.target.value === "Other") {
                setIsTypingOther({ ...isTypingOther, dColor: true });
                setFormData({ ...formData, decorationColor: "" });
              } else {
                setIsTypingOther({ ...isTypingOther, dColor: false });
                setFormData({ ...formData, decorationColor: e.target.value });
              }
            }} 
            className={`w-full border-2 ${localError && !formData.decorationColor ? 'border-red-400' : 'border-gray-200'} rounded-lg p-3 text-sm font-bold outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm`}
          >
            <option value="">Select Color</option>
            {standardDecorColors.map(c => <option key={c} value={c}>{c}</option>)}
            {formData.decorationColor && !standardDecorColors.includes(formData.decorationColor) && (
              <option value={formData.decorationColor}>{formData.decorationColor}</option>
            )}
            <option value="Other">Other...</option>
          </select>

          {isTypingOther.dColor && (
            <input
              type="text"
              autoFocus
              placeholder="Type decoration color and press enter..."
              onKeyDown={(e) => e.key === 'Enter' && setIsTypingOther({ ...isTypingOther, dColor: false })}
              onChange={(e) => setFormData({...formData, decorationColor: e.target.value})}
              className="w-full mt-2 border-2 border-[#5D4037] p-3 rounded-lg text-sm font-bold text-gray-900 outline-none bg-white animate-in slide-in-from-top-1"
            />
          )}
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

        {/* Special Instructions */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Additional Instructions (Optional)</label>
          <textarea 
            placeholder="Any specific details..." 
            value={formData.specialInstructions || ''} 
            onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} 
            className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm font-bold h-24 outline-none resize-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm" 
          />
        </div>

        {/* Cost Section */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
            <Banknote size={14} className="text-[#5D4037]" /> Extra Cost for Instructions
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
        {localError && (
          <div className="flex items-center gap-2 text-red-600 font-black text-xs mb-4 animate-pulse">
            <AlertCircle size={14} strokeWidth={3} />
            <span>Please complete all required fields.</span>
          </div>
        )}

        <div className="flex justify-between">
          <button onClick={handlePrev} className="px-8 py-3 rounded-md font-bold uppercase text-xs bg-[#DBC8BD] text-white hover:opacity-90 transition-all shadow-sm">
            Previous
          </button>
          <button onClick={validateAndNext} className="px-10 py-3 rounded-md font-bold bg-[#5D4037] text-white uppercase text-xs shadow-md active:scale-95 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}