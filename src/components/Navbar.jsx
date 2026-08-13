import React, { useState } from 'react';
import { ShoppingBag, BarChart2, User, Award, CheckCircle2, Share2, Copy, Check } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartItemCount = 0,
  cartItems = [],
  days = 3,
  recipes = []
}) {
  const [showGamificationModal, setShowGamificationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate plain-text formatted list for WhatsApp / sharing
  const generateExportText = () => {
    let text = `🛒 *BB Daily Household Meal Plan & Grocery List* (${days} Days)\n\n`;
    text += `📅 *MEAL SCHEDULE:*\n`;

    const mealsByDay = {};
    for (let d = 1; d <= days; d++) mealsByDay[d] = [];

    if (cartItems.length > 0) {
      const seen = new Set();
      cartItems.forEach((item) => {
        const d = item.dayAssigned || 1;
        const key = `${d}-${item.recipeName}`;
        if (!seen.has(key)) {
          seen.add(key);
          if (!mealsByDay[d]) mealsByDay[d] = [];
          mealsByDay[d].push(item.recipeName);
        }
      });
    }

    for (let d = 1; d <= days; d++) {
      text += `• Day ${d}: ${mealsByDay[d]?.length ? mealsByDay[d].join(', ') : 'Standard Planned Meals'}\n`;
    }

    text += `\n📦 *GROCERY ITEMS TO BUY:*\n`;
    if (cartItems.length === 0) {
      text += `(Cart is currently empty - add meals to populate)\n`;
    } else {
      cartItems.forEach((item, idx) => {
        text += `${idx + 1}. ${item.productName} - ${item.quantity || '1 pack'} (₹${(item.packetDiscountPrice || item.discountPrice || 0) * item.count})\n`;
      });
    }

    text += `\n✨ Generated via BigBasket Daily Household Planner`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Export Plan Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center space-x-1 px-2.5 py-1 rounded-full border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50"
              title="Export meal schedule & shopping list"
            >
              <Share2 className="w-3.5 h-3.5 text-[#84c225]" />
              <span className="hidden sm:inline-block">Export List</span>
            </button>

            {/* Gamification Badge Button */}
            <button
              onClick={() => setShowGamificationModal(true)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center space-x-1 px-2.5 py-1 rounded-full border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50"
            >
              <Award className="w-3.5 h-3.5 text-[#84c225]" />
              <span className="hidden sm:inline-block">Goals</span>
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

      {/* Export Plan Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-gray-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#84c225]" />
                <h3 className="text-sm font-bold text-gray-900">Export Household Plan & Grocery List</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer">✕</button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                Copy this formatted summary to share on WhatsApp or print for your kitchen:
              </p>
              <pre className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-800 font-mono whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                {generateExportText()}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-400 font-medium">
                {cartItems.length} items • {days} days covered
              </span>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 bg-[#84c225] hover:bg-[#689f38] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy for WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gamification Modal */}
      {showGamificationModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Weekly Household Achievements</h3>
              <button onClick={() => setShowGamificationModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-800">🎯 Budget Target Kept</span>
                <CheckCircle2 className="w-4 h-4 text-[#84c225]" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-800">💪 Daily Protein Met</span>
                <CheckCircle2 className="w-4 h-4 text-[#84c225]" />
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-semibold text-gray-800">🌿 Zero Food Waste Goal</span>
                <CheckCircle2 className="w-4 h-4 text-[#84c225]" />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Earned this week:</span>
              <span className="font-extrabold text-[#689f38] text-sm">450 BB Cash Pts</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
