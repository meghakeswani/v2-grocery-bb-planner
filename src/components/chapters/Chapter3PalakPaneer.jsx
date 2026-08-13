import React, { useState } from 'react';
import { Layers, Flame, Dumbbell, IndianRupee, Sparkles } from 'lucide-react';

export default function Chapter3PalakPaneer({ activeStep }) {
  const [isExploded, setIsExploded] = useState(true);

  const ingredients = [
    { name: 'Fresh Spinach (Palak)', qty: '250g', price: 45, protein: '6g', icon: '🥬', keyItem: true },
    { name: 'Fresh Cottage Cheese (Paneer)', qty: '200g', price: 85, protein: '36g', icon: '🧀', keyItem: true },
    { name: 'Ripe Tomatoes', qty: '2 pcs', price: 12, protein: '1g', icon: '🍅' },
    { name: 'Red Onions', qty: '2 pcs', price: 10, protein: '1g', icon: '🧅' },
    { name: 'Ginger & Garlic Paste', qty: '50g', price: 15, protein: '0.5g', icon: '🧄' },
    { name: 'Ghee & Indian Spices', qty: '50g', price: 20, protein: '0g', icon: '🧈' },
    { name: 'Fresh Cooking Cream', qty: '50ml', price: 25, protein: '1.5g', icon: '🥛' }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        03 &bull; Ingredient Explosion
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-8 space-y-3">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Let's say tonight is... <span className="text-[#84c225]">Palak Paneer</span>.
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto">
          One decision created <span className="text-white font-bold underline decoration-[#84c225]">7 hidden ingredient decisions</span>.
        </p>
      </div>

      {/* Main Ingredient Explosive Grid */}
      <div className="w-full max-w-4xl">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          
          {/* Header Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-4 text-xs font-mono font-semibold">
              <span className="text-[#84c225] flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" /> ₹212 Total Meal
              </span>
              <span className="text-slate-300 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-[#84c225]" /> 46g Protein
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-slate-400" /> 30 min
              </span>
            </div>

            <button
              onClick={() => setIsExploded(!isExploded)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-[#84c225] transition border border-slate-700"
            >
              {isExploded ? 'Collapse into Dish' : 'Explode Ingredients'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Dish Photo */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-xs rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-3">
                <img src="/saag.png" alt="Palak Paneer" className="w-full h-48 object-cover rounded-xl" />
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Palak Paneer</h3>
                    <p className="text-xs text-slate-400">7 ingredients required</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#84c225]/20 text-[#84c225] text-xs font-bold font-mono">
                    ₹212
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients Grid */}
            <div className="md:col-span-7">
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 transition-all duration-500 ${isExploded ? 'opacity-100' : 'opacity-20'}`}>
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      ing.keyItem 
                        ? 'bg-slate-900 border-[#84c225]/50' 
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{ing.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{ing.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{ing.qty}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-[#84c225]">₹{ing.price}</div>
                      <div className="text-[10px] text-slate-400">{ing.protein}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
