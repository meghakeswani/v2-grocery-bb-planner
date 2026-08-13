import React, { useState, useEffect } from 'react';
import { Refrigerator, Smartphone, Clock, ChevronDown } from 'lucide-react';

export default function Chapter1Question({ activeStep }) {
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const [currentThought, setCurrentThought] = useState(0);

  const thoughts = [
    "Hmm... dal again?",
    "Do we have paneer left?",
    "Too late to order in...",
    "Why does deciding take 40 mins?",
    "Spinach is wilting in the back..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFridgeOpen(prev => !prev);
      setCurrentThought(t => (t + 1) % thoughts.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        01 &bull; The Question
      </span>

      {/* Main Title - Hierarchy Level 1 */}
      <div className="max-w-4xl space-y-4">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
          “Khaane mein <span className="text-[#84c225]">kya banaun?</span>”
        </h1>

        {/* Hierarchy Level 2 */}
        <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
          A question we've heard at home a hundred times.
        </p>

        {/* Hierarchy Level 3 (Storyline Reveal) */}
        <div className="pt-6 min-h-[80px] flex flex-col items-center justify-center">
          <p className="text-base sm:text-lg text-slate-400 font-serif-italic">
            We thought it was just a question about dinner...
          </p>
          <p className="text-2xl sm:text-3xl text-white font-extrabold mt-2">
            Until you're the one who has to answer it.
          </p>
        </div>
      </div>

      {/* Minimalist Kitchen Simulator */}
      <div className="mt-12 w-full max-w-lg">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#84c225]" /> 7:45 PM &bull; Daily Routine
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Simulating friction</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fridge Box */}
            <div 
              onClick={() => setFridgeOpen(!fridgeOpen)}
              className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative flex flex-col items-center justify-center gap-3 h-40 ${
                fridgeOpen 
                  ? 'bg-slate-900 border-[#84c225]/60' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl transition ${fridgeOpen ? 'bg-[#84c225]/20 text-[#84c225]' : 'bg-slate-800 text-slate-400'}`}>
                <Refrigerator className="w-8 h-8" />
              </div>

              <div className="text-xs font-medium">
                {fridgeOpen ? (
                  <span className="text-white font-semibold">Cold light, empty shelves</span>
                ) : (
                  <span className="text-slate-400">Click to open fridge</span>
                )}
              </div>

              {fridgeOpen && (
                <div className="absolute -top-3 right-2 bg-[#84c225] text-slate-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow">
                  "{thoughts[currentThought]}"
                </div>
              )}
            </div>

            {/* App Scroll Box */}
            <div 
              onClick={() => setAppOpen(!appOpen)}
              className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative flex flex-col items-center justify-center gap-3 h-40 ${
                appOpen 
                  ? 'bg-slate-900 border-[#84c225]/60' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-xl transition ${appOpen ? 'bg-[#84c225]/20 text-[#84c225]' : 'bg-slate-800 text-slate-400'}`}>
                <Smartphone className="w-8 h-8" />
              </div>

              <div className="text-xs font-medium">
                {appOpen ? (
                  <span className="text-white font-semibold">Endless scrolling... 0 decision</span>
                ) : (
                  <span className="text-slate-400">Click to scroll delivery app</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 animate-bounce text-slate-500 text-xs flex flex-col items-center gap-1 font-mono">
        <span>Scroll to see hidden decisions</span>
        <ChevronDown className="w-4 h-4 text-[#84c225]" />
      </div>
    </div>
  );
}
