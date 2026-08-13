import React from 'react';
import { ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Chapter10Ending({ onStartPlanning, onRestartStory }) {
  const handleLaunchApp = () => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
    if (onStartPlanning) onStartPlanning();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
      
      <div className="max-w-4xl space-y-6">
        <div className="text-slate-400 text-xs font-mono uppercase tracking-widest border-b border-slate-800 pb-3 max-w-sm mx-auto">
          From "Khaane mein kya banaun?" to "Here's what you need."
        </div>

        {/* Hierarchy Level 1 */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight">
          Now, you don't have to figure it all out <span className="text-[#84c225]">yourself</span>.
        </h1>

        {/* Hierarchy Level 2 */}
        <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
          Because planning what to eat shouldn't mean planning everything else too.
        </p>

        {/* Final Product Hero Card */}
        <div className="pt-4">
          <div className="glass-panel max-w-xl mx-auto rounded-2xl p-8 border border-[#84c225]/40 shadow-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84c225]/20 text-[#84c225] font-mono text-xs font-bold uppercase">
              <ShoppingBag className="w-3.5 h-3.5" /> BB Daily Smart Planner
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              What to eat. What to buy. What to spend.
            </h3>

            <p className="text-xs text-slate-400 font-mono">
              Dynamic Meal Matcher &bull; Automated Pantry Deductions &bull; 1-Click Cart
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleLaunchApp}
                className="px-6 py-3.5 rounded-xl bg-[#84c225] hover:bg-[#9cd438] text-slate-950 font-extrabold text-sm tracking-wide transition flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onRestartStory}
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Replay Story
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
