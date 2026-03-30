import React, { useState } from 'react';
import { UploadCloud, Check, MessageSquare, AlertCircle } from 'lucide-react';

export default function Step2Design({ formData, setFormData, handleNext, handlePrev }: any) {
  const [localError, setLocalError] = useState(false);

  const validateAndNext = () => {
    // If they want a sample picture (Yes), they MUST upload a file
    if (formData.needsSample === 'Yes' && !formData.cakeFile) {
      setLocalError(true);
      setTimeout(() => setLocalError(false), 3000);
      return;
    }
    setLocalError(false);
    handleNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Cake Design</h2>
      
      <div className="space-y-6 pt-4">
        {/* YES/NO TOGGLE */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">Do you need a sample picture?</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="sampleToggle" 
                value="Yes" 
                checked={formData.needsSample === 'Yes'}
                onChange={(e) => setFormData({...formData, needsSample: e.target.value})}
                className="w-4 h-4 accent-[#5D4037]"
              />
              <span className="font-bold text-gray-700 group-hover:text-[#5D4037]">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="radio" 
                name="sampleToggle" 
                value="No" 
                checked={formData.needsSample === 'No'}
                onChange={(e) => setFormData({...formData, needsSample: e.target.value})}
                className="w-4 h-4 accent-[#5D4037]"
              />
              <span className="font-bold text-gray-700 group-hover:text-[#5D4037]">No</span>
            </label>
          </div>
        </div>

        {/* UPLOAD AREA (Visible if Yes) */}
        {formData.needsSample === 'Yes' && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-[11px] font-bold text-yellow-800">
              Please provide a sample by uploading a picture of your design.
            </div>
            <div className={`border-2 border-dashed ${localError ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-2xl p-10 flex flex-col items-center justify-center relative cursor-pointer group hover:border-[#5D4037] transition-all`}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFormData({...formData, cakeFile: e.target.files?.[0] || null})} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <UploadCloud size={40} className={`${localError ? 'text-red-400' : 'text-gray-400'} group-hover:text-[#5D4037] transition-colors`} />
              <p className="mt-3 font-extrabold text-[#5D4037] text-sm text-center">
                {formData.cakeFile ? formData.cakeFile.name : "Click or drag photos here to upload"}
              </p>
              <p className="text-[10px] font-bold text-gray-500 mt-1">( 1 photo of 10MB maximum )</p>
            </div>
            
            {formData.cakeFile && (
              <div className="bg-green-50 text-green-700 p-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-green-200">
                <Check size={14} strokeWidth={3} /> Image ready for upload
              </div>
            )}
          </div>
        )}

        {/* DESCRIPTION AREA (Visible if No) */}
        {formData.needsSample === 'No' && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-bold text-gray-800 uppercase flex items-center gap-2 tracking-wide">
              <MessageSquare size={16} className="text-[#5D4037]" /> Describe your cake design
            </label>
            <textarea
              value={formData.specialInstructions || ''}
              onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
              placeholder="Tell us about the colors, theme, or specific decorations you want..."
              className="w-full border-2 border-gray-300 p-4 rounded-xl font-bold text-gray-800 outline-none focus:border-[#5D4037] bg-white min-h-[140px] resize-none shadow-sm transition-all"
            />
          </div>
        )}
      </div>

      <div className="pt-6">
        {/* INLINE VALIDATION ERROR */}
        {localError && (
          <div className="flex items-center gap-2 text-red-600 font-black text-xs mb-4 animate-bounce">
            <AlertCircle size={14} strokeWidth={3} />
            <span>Please upload an image to proceed.</span>
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