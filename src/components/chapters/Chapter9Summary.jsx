import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export default function Chapter9Summary({ activeStep }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        09 &bull; The Outcome
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-10 space-y-3">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          What started as <span className="text-[#84c225]">“What should I make tonight?”</span>
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto">
          became an optimized, zero-waste plan for the next <span className="text-white font-bold underline decoration-[#84c225]">three days</span>.
        </p>
      </div>

      {/* Grand Score Summary Card */}
      <div className="w-full max-w-4xl">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#84c225]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                HOUSEHOLD OPTIMIZATION REPORT
              </h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 bg-[#84c225]/20 text-[#84c225] rounded-full border border-[#84c225]/30">
              Score: 98/100 Optimal
            </span>
          </div>

          {/* 6 Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-slate-400 text-[9px] uppercase font-mono mb-1">Horizon</div>
              <div className="text-xl font-extrabold text-white font-heading">3 DAYS</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Stress-free</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-slate-400 text-[9px] uppercase font-mono mb-1">Meals</div>
              <div className="text-xl font-extrabold text-[#84c225] font-heading">6 MEALS</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Full variety</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-slate-400 text-[9px] uppercase font-mono mb-1">Total Spend</div>
              <div className="text-xl font-extrabold text-[#84c225] font-mono">₹947</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Under budget</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-slate-400 text-[9px] uppercase font-mono mb-1">Daily Macro</div>
              <div className="text-xl font-extrabold text-white font-mono">82g</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Protein / day</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-slate-400 text-[9px] uppercase font-mono mb-1">Pantry Used</div>
              <div className="text-xl font-extrabold text-white">4 ITEMS</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Deducted</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-slate-400 text-[9px] uppercase font-mono mb-1">Food Waste</div>
              <div className="text-xl font-extrabold text-[#84c225]">2 SAVED</div>
              <div className="text-[9px] text-slate-400 mt-0.5">Zero spoilage</div>
            </div>

          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <h4 className="text-lg font-bold text-white">
              One place to decide what to eat, what to buy, and how much to spend.
            </h4>
            <p className="text-slate-400 text-xs font-light max-w-md mx-auto">
              No more mental math at 8 PM. No more buying duplicate items or throwing out wilted spinach.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
