import React from 'react';
import { IndianRupee, Calendar, Dumbbell } from 'lucide-react';

export default function Chapter5Numbers({ activeStep }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        05 &bull; Constraint Shift
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-10 space-y-3">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Let's say you're <span className="text-[#84c225]">cooking for two</span>.
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto">
          You have fixed financial limits and nutritional targets for the upcoming days:
        </p>
      </div>

      {/* BIG NUMBERS DISPLAY */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        
        {/* Box 1 */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-[#84c225] font-mono font-bold text-xs uppercase tracking-wider">
            <IndianRupee className="w-3.5 h-3.5" /> Budget Limit
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white font-heading">
            ₹1,000
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Max grocery budget</span>
        </div>

        {/* Box 2 */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-[#84c225] font-mono font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" /> Planning Horizon
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white font-heading">
            3 DAYS
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">6 meals planned</span>
        </div>

        {/* Box 3 */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-[#84c225] font-mono font-bold text-xs uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5" /> Daily Target
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white font-heading">
            75g
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Protein per day</span>
        </div>

      </div>

      {/* Paradigm Shift Reveal */}
      <div className="w-full max-w-3xl">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Suddenly, the question changes.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Old Question</span>
              <p className="text-slate-300 font-semibold text-xs">"What groceries should I buy today?"</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-[#84c225]/50">
              <span className="text-[10px] text-[#84c225] font-mono uppercase font-bold block mb-1">New Smart Question</span>
              <p className="text-white font-bold text-xs">
                "What can I make with what I have, what I need, and what I can afford?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
