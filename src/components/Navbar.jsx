import React, { useState } from 'react';
import { ShoppingBag, BarChart2, User, Award, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartItemCount = 0 }) {
  const [showGamificationModal, setShowGamificationModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Minimal Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('Shop')}>
            <div className="w-8 h-8 rounded-lg bg-[#84c225] flex items-center justify-center text-white font-extrabold text-sm tracking-tight">
              bb
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-gray-900 tracking-tight">bb daily</span>
              <span className="text-[10px] text-gray-400 font-medium hidden sm:inline-block">| Household Planner</span>
            </div>
          </div>

          {/* Right Aligned Navigation */}
          <div className="flex items-center space-x-4">
            
            {/* Gamification Badge Button */}
            <button
              onClick={() => setShowGamificationModal(true)}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center space-x-1 px-2.5 py-1 rounded-full border border-gray-200 cursor-pointer transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#84c225]" />
              <span>Weekly Goals</span>
            </button>

            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('Shop')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'Shop'
                    ? 'bg-[#84c225] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop</span>
                {cartItemCount > 0 && (
                  <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    activeTab === 'Shop' ? 'bg-white text-[#689f38]' : 'bg-[#84c225] text-white'
                  }`}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('Stats')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'Stats'
                    ? 'bg-[#84c225] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('Profile')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'Profile'
                    ? 'bg-[#84c225] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </nav>

          </div>
        </div>
      </div>

      {/* Gamification Modal */}
      {showGamificationModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-gray-100 shadow-xl relative space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Weekly Household Achievements</h3>
              <button onClick={() => setShowGamificationModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-800">🎯 Budget Target Kept</span>
                <CheckCircle2 className="w-4 h-4 text-[#84c225]" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-800">💪 Daily Protein Met</span>
                <CheckCircle2 className="w-4 h-4 text-[#84c225]" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-800">🌿 Food Waste Reduced</span>
                <CheckCircle2 className="w-4 h-4 text-[#84c225]" />
              </div>
            </div>

            <button
              onClick={() => setShowGamificationModal(false)}
              className="w-full py-2 bg-[#84c225] hover:bg-[#689f38] text-white font-bold rounded-lg text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
