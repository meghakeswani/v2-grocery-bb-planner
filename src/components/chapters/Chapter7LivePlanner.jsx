import React, { useState, useMemo } from 'react';
import { Sliders, IndianRupee, Dumbbell, Calendar, PackageCheck, Sparkles, Check } from 'lucide-react';
import rawData, { getRecipes } from '../../data/groceryData';

export default function Chapter7LivePlanner({ activeStep }) {
  const [budget, setBudget] = useState(800);
  const [minProtein, setMinProtein] = useState(75);
  const [numDays, setNumDays] = useState(3);
  const [hasSpinachInPantry, setHasSpinachInPantry] = useState(true);

  const allRecipes = useMemo(() => getRecipes(rawData), []);

  const filtered = useMemo(() => {
    return allRecipes.filter(r => {
      const isBudgetOk = r.totalPrice <= (budget / numDays);
      const isProteinOk = r.totalProtein >= minProtein || r.avgProteinPerIngredient >= 20;
      return isBudgetOk || isProteinOk;
    });
  }, [allRecipes, budget, numDays, minProtein]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        07 &bull; Interactive Controls
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-8 space-y-3">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Tell BB Daily <span className="text-[#84c225]">what matters this week</span>.
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto">
          Adjust controls below. Watch meal recommendations respond live to your constraints.
        </p>
      </div>

      {/* Embedded Live Tool Grid */}
      <div className="w-full max-w-4xl">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            
            {/* Control 1: Budget */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-[#84c225]" /> Budget
                </span>
                <span className="font-mono font-bold text-[#84c225]">₹{budget}</span>
              </div>
              <input
                type="range"
                min={400}
                max={2500}
                step={100}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-[#84c225] bg-slate-800 h-1.5 rounded cursor-pointer"
              />
            </div>

            {/* Control 2: Protein */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-[#84c225]" /> Protein
                </span>
                <span className="font-mono font-bold text-[#84c225]">{minProtein}g / day</span>
              </div>
              <input
                type="range"
                min={20}
                max={150}
                step={5}
                value={minProtein}
                onChange={e => setMinProtein(Number(e.target.value))}
                className="w-full accent-[#84c225] bg-slate-800 h-1.5 rounded cursor-pointer"
              />
            </div>

            {/* Control 3: Days */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#84c225]" /> Days
                </span>
                <span className="font-mono font-bold text-[#84c225]">{numDays}d</span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-lg">
                {[2, 3, 5].map(d => (
                  <button
                    key={d}
                    onClick={() => setNumDays(d)}
                    className={`py-0.5 rounded text-xs font-bold font-mono transition ${
                      numDays === d ? 'bg-[#84c225] text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Control 4: Pantry Toggle */}
            <div className="space-y-1.5 flex flex-col justify-between">
              <span className="text-slate-300 font-semibold text-xs flex items-center gap-1">
                <PackageCheck className="w-3.5 h-3.5 text-[#84c225]" /> Pantry
              </span>
              <button
                onClick={() => setHasSpinachInPantry(!hasSpinachInPantry)}
                className={`p-1.5 rounded-lg text-xs font-semibold border transition flex items-center justify-between ${
                  hasSpinachInPantry 
                    ? 'bg-slate-800 border-[#84c225] text-[#84c225]' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <span>"Have spinach"</span>
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${hasSpinachInPantry ? 'bg-[#84c225] text-slate-950' : 'border border-slate-600'}`}>
                  {hasSpinachInPantry && <Check className="w-3 h-3" />}
                </div>
              </button>
            </div>

          </div>

          {/* Recommendations output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#84c225]" />
                Live Matched Recommendations ({filtered.length} meals)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Avg. budget: ₹{Math.round(budget / numDays)}/day
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filtered.slice(0, 3).map((r, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-[#84c225] px-1.5 py-0.5 bg-slate-800 rounded">
                        Day {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">₹{r.totalPrice}</span>
                    </div>

                    <h4 className="font-bold text-white text-xs mb-1">{r.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{r.cookingTime}m</span>
                      <span>&bull;</span>
                      <span className="text-white font-bold">{r.totalProtein}g protein</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{r.ingredients.length} items</span>
                    {hasSpinachInPantry && r.name.toLowerCase().includes('palak') && (
                      <span className="text-[#84c225] font-bold">Spinach Deducted (-₹45)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
