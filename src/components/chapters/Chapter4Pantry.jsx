import React, { useState } from 'react';
import { PackageCheck, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Chapter4Pantry({ activeStep }) {
  const [pantryItems, setPantryItems] = useState([
    { id: 1, name: 'Spinach (Palak)', qty: '250g', daysLeft: 2, icon: '🥬', matchesRecipe: true, checked: true },
    { id: 2, name: 'Basmati Rice', qty: '1 kg', daysLeft: 60, icon: '🍚', matchesRecipe: false, checked: true },
    { id: 3, name: 'Fresh Milk', qty: '500ml', daysLeft: 3, icon: '🥛', matchesRecipe: false, checked: true },
    { id: 4, name: 'Farm Eggs', qty: '6 pcs', daysLeft: 7, icon: '🥚', matchesRecipe: false, checked: true }
  ]);

  const toggleItem = (id) => {
    setPantryItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const spinachInPantry = pantryItems.find(i => i.id === 1)?.checked;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        04 &bull; Pantry Inventory
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-10 space-y-3">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          But wait. <span className="text-[#84c225]">You already have spinach.</span>
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto">
          So why buy it again? Your grocery list shouldn't start from zero—it should start from what you already have.
        </p>
      </div>

      {/* Pantry Inventory Drawer */}
      <div className="w-full max-w-3xl">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#84c225]" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                MY HOUSEHOLD PANTRY
              </h3>
            </div>
            <span className="text-xs font-mono text-[#84c225] bg-[#84c225]/10 border border-[#84c225]/30 px-2.5 py-0.5 rounded-full">
              4 Items Tracked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pantryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  item.checked 
                    ? item.matchesRecipe 
                      ? 'bg-slate-900 border-[#84c225]' 
                      : 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-950/40 border-slate-900 opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      {item.matchesRecipe && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#84c225]/20 text-[#84c225] font-bold">
                          Meal Match!
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.qty} &bull; {item.daysLeft}d left</span>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                  item.checked ? 'bg-[#84c225] border-[#84c225] text-slate-950' : 'border-slate-700'
                }`}>
                  {item.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Footer */}
          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
              <span className="text-slate-400 font-mono block mb-1">Standard Delivery Apps</span>
              <span className="text-white font-semibold">Re-buys Spinach for ₹45</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-[#84c225]/50 text-xs">
              <span className="text-[#84c225] font-mono font-bold block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> BB Daily Smart Deduct
              </span>
              <span className="text-white font-bold">
                {spinachInPantry ? 'Deducts Spinach & Saves ₹45' : 'Spinach added to cart'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
