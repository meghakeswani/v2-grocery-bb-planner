import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, LayoutGrid } from 'lucide-react';
import Chapter1Question from './chapters/Chapter1Question';
import Chapter2DecisionTree from './chapters/Chapter2DecisionTree';
import Chapter3PalakPaneer from './chapters/Chapter3PalakPaneer';
import Chapter4Pantry from './chapters/Chapter4Pantry';
import Chapter5Numbers from './chapters/Chapter5Numbers';
import Chapter6BrandPivot from './chapters/Chapter6BrandPivot';
import Chapter7LivePlanner from './chapters/Chapter7LivePlanner';
import Chapter8MealToCart from './chapters/Chapter8MealToCart';
import Chapter9Summary from './chapters/Chapter9Summary';
import Chapter10Ending from './chapters/Chapter10Ending';

export default function ScrollytellingContainer({ onStartPlanning }) {
  const [activeChapter, setActiveChapter] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef(null);

  const chaptersList = [
    { id: 1, label: 'The Question', subtitle: 'Khaane mein kya banaun?' },
    { id: 2, label: 'Hidden Complexity', subtitle: 'It\'s Never Just Dinner' },
    { id: 3, label: 'Ingredient Explosion', subtitle: 'The Hidden Grocery List' },
    { id: 4, label: 'Pantry Inventory', subtitle: 'Then Pantry Gets Involved' },
    { id: 5, label: 'Constraint Shift', subtitle: 'Now Numbers Fight Back' },
    { id: 6, label: 'BB Daily Vision', subtitle: 'The Opportunity' },
    { id: 7, label: 'Live Tool Controls', subtitle: 'Interactive Constraints' },
    { id: 8, label: 'Meal Card Split', subtitle: 'Hero Interaction' },
    { id: 9, label: 'Value Realization', subtitle: 'The Outcome' },
    { id: 10, label: 'Conclusion & CTA', subtitle: 'Start Planning' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const chapterEls = document.querySelectorAll('[data-chapter]');
      let current = 1;
      chapterEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.1) {
          current = Number(el.getAttribute('data-chapter'));
        }
      });
      setActiveChapter(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (chapterId) => {
    const target = document.querySelector(`[data-chapter="${chapterId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
      
      {/* MINIMALIST HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#84c225] text-slate-950 flex items-center justify-center font-extrabold font-mono text-xs shadow-sm">
              bb
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                “Khaane Mein Kya Banaun?”
              </h1>
              <p className="text-[10px] text-[#84c225] font-mono">
                0{activeChapter} / 10 &bull; {chaptersList[activeChapter - 1]?.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition text-xs"
              title="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#84c225]" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onStartPlanning}
              className="px-3 py-1.5 rounded-lg bg-[#84c225] hover:bg-[#9cd438] text-slate-950 font-bold text-xs tracking-wide transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full App Mode</span>
            </button>
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800">
          <div
            className="h-full bg-[#84c225] transition-all duration-300"
            style={{ width: `${(activeChapter / 10) * 100}%` }}
          />
        </div>
      </header>

      {/* FLOATING CHAPTER INDICATOR DOTS */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-slate-800">
        {chaptersList.map((ch) => (
          <button
            key={ch.id}
            onClick={() => scrollToChapter(ch.id)}
            className={`group relative w-2.5 h-2.5 rounded-full transition-all ${
              activeChapter === ch.id 
                ? 'bg-[#84c225] scale-125 ring-2 ring-[#84c225]/40' 
                : 'bg-slate-700 hover:bg-slate-500'
            }`}
          >
            <span className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none border border-slate-800">
              0{ch.id}. {ch.label}
            </span>
          </button>
        ))}
      </nav>

      {/* CHAPTER SECTIONS */}
      <main className="space-y-0">
        <section data-chapter="1" className="min-h-screen border-b border-slate-900">
          <Chapter1Question activeStep={activeChapter} />
        </section>

        <section data-chapter="2" className="min-h-screen border-b border-slate-900">
          <Chapter2DecisionTree activeStep={activeChapter} />
        </section>

        <section data-chapter="3" className="min-h-screen border-b border-slate-900">
          <Chapter3PalakPaneer activeStep={activeChapter} />
        </section>

        <section data-chapter="4" className="min-h-screen border-b border-slate-900">
          <Chapter4Pantry activeStep={activeChapter} />
        </section>

        <section data-chapter="5" className="min-h-screen border-b border-slate-900">
          <Chapter5Numbers activeStep={activeChapter} />
        </section>

        <section data-chapter="6" className="min-h-screen border-b border-slate-900">
          <Chapter6BrandPivot activeStep={activeChapter} />
        </section>

        <section data-chapter="7" className="min-h-screen border-b border-slate-900">
          <Chapter7LivePlanner activeStep={activeChapter} />
        </section>

        <section data-chapter="8" className="min-h-screen border-b border-slate-900">
          <Chapter8MealToCart activeStep={activeChapter} />
        </section>

        <section data-chapter="9" className="min-h-screen border-b border-slate-900">
          <Chapter9Summary activeStep={activeChapter} />
        </section>

        <section data-chapter="10" className="min-h-screen">
          <Chapter10Ending
            onStartPlanning={onStartPlanning}
            onRestartStory={() => scrollToChapter(1)}
          />
        </section>
      </main>

    </div>
  );
}
