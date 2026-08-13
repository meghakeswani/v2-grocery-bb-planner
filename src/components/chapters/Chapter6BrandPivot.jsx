import React from 'react';
import { ShoppingBag, CheckCircle2, Zap } from 'lucide-react';

export default function Chapter6BrandPivot({ activeStep }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        06 &bull; The Opportunity
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-8 space-y-4">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          What if <span className="text-[#84c225]">BB Daily</span> could answer that question for you?
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto leading-relaxed">
          BB Daily already helps you get your everyday groceries.
          <br />
          <span className="text-white font-semibold">What if it helped you decide what those groceries should be in the first place?</span>
        </p>
      </div>

      {/* Concept Card */}
      <div className="w-full max-w-2xl">
        <div className="glass-panel rounded-2xl p-8 border border-[#84c225]/40 shadow-xl space-y-6">
          
          <div className="w-12 h-12 rounded-xl bg-[#84c225]/20 text-[#84c225] flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
              Introducing Concept
            </span>
            <h3 className="text-3xl font-extrabold text-white">
              BB Daily Smart Planner
            </h3>
            <p className="text-[#84c225] text-sm font-medium mt-1 font-serif-italic">
              From “What should I make?” to “Here’s what you need.”
            </p>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-left">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <strong className="text-white block mb-0.5">1. Dynamic Meals</strong>
              <span className="text-slate-400">Budget & protein matched</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <strong className="text-white block mb-0.5">2. Pantry Deduct</strong>
              <span className="text-slate-400">Subtracts what you own</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <strong className="text-white block mb-0.5">3. Smart Cart</strong>
              <span className="text-slate-400">1-click ingredient breakdown</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
