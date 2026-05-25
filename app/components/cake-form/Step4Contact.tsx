import React, { useState, useEffect } from 'react';
import { AlertCircle, User, Phone, Calendar, PlusCircle, MapPin, Store } from 'lucide-react';

export default function Step4Contact({ formData, setFormData, handleNext, handlePrev }: any) {
  const [localError, setLocalError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // SAFEGUARD: Prevent white screen if formData is missing
  if (!formData) return null;

  // AUTOMATIC DATE/TIME: Sets current local time if orderDate is empty
  useEffect(() => {
    if (!formData.orderDate) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      setFormData({ ...formData, orderDate: currentDateTime });
    }
  }, []);

  const validateAndNext = () => {
    const errors = [];
    
    // Check individual fields
    if (!formData.customerFullName) errors.push("Full Name");
    if (formData.customerPhoneNumber?.length !== 10) errors.push("10-digit Phone");
    if (!formData.orderLocation) errors.push("Order Location");  // CHANGED: orderPlace -> orderLocation
    if (!formData.receptionLocation) errors.push("Reception Location");
    if (!formData.pickupDate) errors.push("Pickup Date");  // CHANGED: orderDate -> pickupDate
    if (!formData.orderReceiverName) errors.push("Receiver Name");

    // Date Validation: Check if the selected date is in the past
    const selectedDate = new Date(formData.pickupDate);  // CHANGED: orderDate -> pickupDate
    const today = new Date();
    today.setSeconds(0, 0);
    const isDateExpired = selectedDate < today;

    if (errors.length > 0 || isDateExpired) {
      setMissingFields(errors);
      setLocalError(true);
      if (isDateExpired) setDateError(true);
      
      setTimeout(() => {
        setLocalError(false);
        setDateError(false);
        setMissingFields([]);
      }, 5000);
      return;
    }

    setLocalError(false);
    setDateError(false);
    handleNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-[#5D4037] border-b pb-4 uppercase tracking-tighter">Order Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* COLUMN 1 */}
        <div className="space-y-6">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
              <User size={12} /> Full Name
            </label>
            <input 
              type="text" 
              placeholder="Enter your name"
              value={formData.customerFullName || ''} 
              onChange={(e) => setFormData({...formData, customerFullName: e.target.value})} 
              className={`w-full border-2 ${localError && !formData.customerFullName ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`} 
            />
          </div>

          {/* Primary Phone Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
              <Phone size={12} /> Phone Number
            </label>
            <input 
              type="tel" 
              placeholder="0788000000"
              maxLength={10}
              value={formData.customerPhoneNumber || ''} 
              onChange={(e) => setFormData({...formData, customerPhoneNumber: e.target.value.replace(/\D/g, '')})} 
              className={`w-full border-2 ${localError && formData.customerPhoneNumber?.length !== 10 ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`} 
            />
            <p className={`text-[10px] font-bold ${formData.customerPhoneNumber?.length === 10 ? 'text-green-600' : 'text-gray-500'}`}>
              Current length: {formData.customerPhoneNumber?.length || 0}/10
            </p>
          </div>

          {/* Alternative Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
              <PlusCircle size={12} className="text-[#5D4037]" /> Alternative Number (Optional)
            </label>
            <input 
              type="tel" 
              placeholder="Add another number if needed"
              value={formData.secondaryPhoneNumber || ''} 
              onChange={(e) => setFormData({...formData, secondaryPhoneNumber: e.target.value.replace(/\D/g, '')})} 
              className="w-full border-2 border-gray-300 rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm" 
            />
          </div>

          {/* Place of Order - CHANGED: orderPlace -> orderLocation */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
              <Store size={12} /> Order Location
            </label>
            <select 
              value={formData.orderLocation || ''} 
              onChange={(e) => setFormData({...formData, orderLocation: e.target.value})} 
              className={`w-full border-2 ${localError && !formData.orderLocation ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`}
            >
              <option value="">Select Order Location</option>
              <option value="kabuga">Kabuga</option>
              <option value="masaka">Masaka</option>
            </select>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="space-y-6">
          {/* Place of Reception */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
              <MapPin size={12} /> Place of Reception
            </label>
            <select 
              value={formData.receptionLocation || ''} 
              onChange={(e) => setFormData({...formData, receptionLocation: e.target.value})} 
              className={`w-full border-2 ${localError && !formData.receptionLocation ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`}
            >
              <option value="">Select Reception Location</option>
              <option value="kabuga factory">Kabuga Factory</option>
              <option value="kabuga shop">Kabuga shop</option>
              <option value="masaka shop">Masaka shop</option>
              <option value="rwamagana shop">Rwamagana shop</option>
              <option value="kayonza shop">Kayonza shop</option>
              <option value="nyakarambi shop">Nyakarambi shop</option>
              <option value="mushikiri shop">Mushikiri shop</option>
              <option value="Other">Other</option>
            </select>
            
            {formData.receptionLocation === "Other" && (
              <input 
                type="text"
                placeholder="Type your reception location here..."
                value={formData.otherReceptionLocation || ''}
                onChange={(e) => setFormData({...formData, otherReceptionLocation: e.target.value})}
                className="w-full mt-2 border-2 border-gray-300 rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white animate-in slide-in-from-top-1 duration-300"
              />
            )}
          </div>

          {/* Pickup Date & Time - CHANGED: orderDate -> pickupDate */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
              <Calendar size={12} /> Pickup Date & Time
            </label>
            <input 
              type="datetime-local" 
              value={formData.pickupDate || ''} 
              onChange={(e) => setFormData({...formData, pickupDate: e.target.value})} 
              className={`w-full border-2 ${dateError || (localError && !formData.pickupDate) ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`} 
            />
            {dateError && <p className="text-[10px] font-bold text-red-500">Error: Date cannot be in the past.</p>}
          </div>

          {/* Receiver Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Receiver Name</label>
            <input 
              type="text" 
              placeholder="Who will collect the cake?"
              value={formData.orderReceiverName || ''} 
              onChange={(e) => setFormData({...formData, orderReceiverName: e.target.value})} 
              className={`w-full border-2 ${localError && !formData.orderReceiverName ? 'border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-gray-300'} rounded-lg p-3 text-sm font-black outline-none focus:border-[#5D4037] text-gray-900 bg-white shadow-sm transition-all`} 
            />
          </div>
        </div>
      </div>

      <div className="pt-10">
        {/* INLINE VALIDATION ERROR */}
        {localError && (
          <div className="flex items-center gap-2 text-red-600 font-black text-xs mb-4 animate-pulse">
            <AlertCircle size={14} strokeWidth={3} />
            <span>
              {dateError 
                ? "The pickup date is expired. Please select a future date." 
                : `Missing fields: ${missingFields.join(", ")}.`}
            </span>
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