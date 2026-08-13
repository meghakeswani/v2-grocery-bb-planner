import React, { useState } from 'react';
import { IndianRupee, Dumbbell, Clock, PackageCheck, Trash2 } from 'lucide-react';

export default function Chapter2DecisionTree({ activeStep }) {
  const [activeBranch, setActiveBranch] = useState(null);

  const branches = [
    { id: 'budget', title: 'Budget', detail: 'Can I afford this meal plan?', stat: '₹500 / day', icon: IndianRupee },
    { id: 'protein', title: 'Protein', detail: 'Will I hit daily macro targets?', stat: '70g / day', icon: Dumbbell },
    { id: 'time', title: 'Time', detail: 'How long will cooking take?', stat: '30 min max', icon: Clock },
    { id: 'pantry', title: 'Pantry', detail: 'What do I already own in fridge?', stat: 'Check fridge', icon: PackageCheck },
    { id: 'waste', title: 'Waste', detail: 'What happens to unused items?', stat: 'Zero spoil', icon: Trash2 }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        02 &bull; Hidden Complexity
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-12 space-y-3">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Because dinner isn't <span className="text-[#84c225]">just dinner</span>.
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto">
          One decision branches outward into five distinct household variables.
        </p>
      </div>

      {/* Minimalist Exploding Graph */}
      <div className="w-full max-w-4xl">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-8">
          
          {/* Central Root Node */}
          <div className="flex justify-center">
            <div className="px-6 py-3 bg-slate-900 rounded-xl border border-[#84c225]/40 text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Primary Question</span>
              <span className="text-xl sm:text-2xl font-extrabold text-white">WHAT SHOULD I MAKE?</span>
            </div>
          </div>

          {/* Connecting visual divider */}
          <div className="w-px h-8 bg-[#84c225]/40 mx-auto" />

          {/* 5 Pillar Branch Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {branches.map((b) => {
              const IconComp = b.icon;
              const isActive = activeBranch === b.id;

              return (
                <div
                  key={b.id}
                  onMouseEnter={() => setActiveBranch(b.id)}
                  onMouseLeave={() => setActiveBranch(null)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                    isActive 
                      ? 'bg-slate-900 border-[#84c225] scale-105 shadow-lg' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <IconComp className="w-4 h-4 text-[#84c225]" />
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-[#84c225]">
                      {b.stat}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{b.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">{b.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Takeaway Summary */}
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
            <span>01. What do I have?</span>
            <span>02. Can I afford it?</span>
            <span>03. Will I hit 70g protein?</span>
            <span className="text-[#84c225] font-bold">BB Daily unifies all 3</span>
          </div>

        </div>
      </div>
    </div>
  );
}
