import React, { useState } from 'react';
import { User, Users, Shield, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function ProfileView() {
  const [householdSize, setHouseholdSize] = useState(4);
  const [dietaryPref, setDietaryPref] = useState('Pure Veg');
  const [deliverySlot, setDeliverySlot] = useState('6:00 AM - 7:00 AM');
  const [address, setAddress] = useState('Flat 402, Green Acres Apartments, Indiranagar');
  const [city, setCity] = useState('Bengaluru - 560038');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-2xs">
        
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-[#84c225] text-white font-extrabold flex items-center justify-center text-sm">
            bb
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Household & Subscription Profile</h1>
            <p className="text-xs text-gray-500">Configure your default AI meal planner settings and delivery preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          
          {/* Household Size */}
          <div className="space-y-2">
            <label className="font-bold text-gray-800 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-[#84c225]" />
              <span>Household Size</span>
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-base transition-all cursor-pointer active:scale-95"
              >
                −
              </button>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-extrabold text-gray-900">{householdSize}</span>
                <span className="text-[10px] text-gray-400 font-medium">{householdSize === 1 ? 'Person' : 'People'}</span>
              </div>
              <button
                type="button"
                onClick={() => setHouseholdSize(Math.min(12, householdSize + 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-base transition-all cursor-pointer active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Dietary Preferences requested: Pure Veg, High Protein, Organic Focus */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <label className="font-bold text-gray-800 flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-[#84c225]" />
              <span>Dietary Preferences</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Pure Veg', 'High Protein', 'Organic Focus', 'Vegan', 'Jain'].map((diet) => (
                <button
                  type="button"
                  key={diet}
                  onClick={() => setDietaryPref(diet)}
                  className={`py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                    dietaryPref === diet
                      ? 'bg-[#84c225] text-white shadow-2xs'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Recurring Delivery Slot */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <label className="font-bold text-gray-800 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#84c225]" />
              <span>Recurring Delivery Slot</span>
            </label>
            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="w-full p-2 text-xs font-medium border border-gray-200 rounded-lg outline-none focus:border-[#84c225] bg-white"
            >
              <option value="6:00 AM - 7:00 AM">6:00 AM - 7:00 AM (Standard Morning Slot)</option>
              <option value="7:00 AM - 8:00 AM">7:00 AM - 8:00 AM</option>
              <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
            </select>
          </div>

          {/* Delivery Address & Contact */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <label className="font-bold text-gray-800 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#84c225]" />
              <span>Delivery Address & Contact</span>
            </label>

            <div className="space-y-2">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No, Street, Apartment"
                className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#84c225]"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City & Pincode"
                  className="w-1/2 p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#84c225]"
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-1/2 p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#84c225]"
                />
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {saved ? (
              <span className="text-xs font-bold text-[#689f38] flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-[#84c225]" />
                <span>Profile Settings Saved Successfully!</span>
              </span>
            ) : (
              <span></span>
            )}

            <button
              type="submit"
              className="px-5 py-2 bg-[#84c225] hover:bg-[#689f38] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Save Profile Preferences
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
