import React, { useState } from 'react';
import { ShoppingCart, MousePointerClick, Sparkles } from 'lucide-react';

export default function Chapter8MealToCart({ activeStep }) {
  const [isSplit, setIsSplit] = useState(false);
  const [inCart, setInCart] = useState([]);
  const [flyingIngredient, setFlyingIngredient] = useState(null);

  const meal = {
    name: 'Palak Paneer',
    time: '30 min',
    protein: '24g protein',
    price: 120,
    image: `${import.meta.env.BASE_URL || '/'}saag.png`.replace('//', '/')
  };

  const ingredients = [
    { id: 1, name: 'Spinach (Palak)', qty: '250g', price: 45, status: 'In Pantry (-₹45)', inPantry: true, icon: '🥬' },
    { id: 2, name: 'Fresh Paneer', qty: '250g', price: 75, status: 'Added to Cart', inPantry: false, icon: '🧀' },
    { id: 3, name: 'Cooking Cream', qty: '100ml', price: 30, status: 'Added to Cart', inPantry: false, icon: '🥛' },
    { id: 4, name: 'Tomatoes & Spices', qty: '150g', price: 20, status: 'Added to Cart', inPantry: false, icon: '🍅' }
  ];

  const handleMealClick = () => {
    setIsSplit(true);
    const missing = ingredients.filter(i => !i.inPantry);
    missing.forEach((item, index) => {
      setTimeout(() => {
        setFlyingIngredient(item.name);
        setInCart(prev => [...new Set([...prev, item.name])]);
      }, (index + 1) * 450);
    });
  };

  const cartTotal = ingredients.filter(i => inCart.includes(i.name)).reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
      
      {/* Chapter Indicator */}
      <span className="text-[11px] font-mono tracking-widest text-[#84c225] uppercase font-bold mb-4 px-3 py-1 rounded-full bg-[#84c225]/10 border border-[#84c225]/20">
        08 &bull; Hero Interaction
      </span>

      {/* Hierarchy Level 1 */}
      <div className="max-w-3xl text-center mb-8 space-y-3">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          The <span className="text-[#84c225]">Meal Card Split</span> Moment.
        </h2>

        {/* Hierarchy Level 2 */}
        <p className="text-slate-300 text-lg sm:text-xl font-light max-w-xl mx-auto">
          "You don't buy a meal—you buy its ingredients." Click the meal card to watch missing items fly into your cart.
        </p>
      </div>

      {/* Split Physics Simulator */}
      <div className="w-full max-w-4xl">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Meal Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div
                onClick={handleMealClick}
                className={`w-full max-w-xs rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden relative ${
                  isSplit 
                    ? 'bg-slate-900 border-slate-800 opacity-70 scale-95' 
                    : 'bg-slate-900 border-[#84c225] shadow-lg hover:scale-102'
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-[#84c225] text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded font-mono uppercase">
                    DAY 1 MEAL
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{meal.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">{meal.time} &bull; {meal.protein}</span>
                  </div>
                  <span className="text-base font-bold font-mono text-[#84c225]">₹{meal.price}</span>
                </div>

                {!isSplit && (
                  <div className="p-2.5 bg-[#84c225]/20 border-t border-[#84c225]/40 text-center text-xs font-bold text-[#84c225] flex items-center justify-center gap-1.5">
                    <MousePointerClick className="w-3.5 h-3.5" /> Click to split into cart
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients & Cart Output */}
            <div className="md:col-span-7 space-y-4">
              
              <div>
                <h4 className="text-xs uppercase font-mono font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>Constituent Ingredients</span>
                  {isSplit && <span className="text-[#84c225]">Deducting Pantry...</span>}
                </h4>

                <div className="space-y-2">
                  {ingredients.map((ing) => {
                    const isAdded = inCart.includes(ing.name);
                    const isFlying = flyingIngredient === ing.name;

                    return (
                      <div
                        key={ing.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between ${
                          ing.inPantry 
                            ? 'bg-slate-900/40 border-slate-800 text-slate-400 opacity-60' 
                            : isAdded 
                              ? 'bg-slate-900 border-[#84c225]/60' 
                              : 'bg-slate-900/60 border-slate-800'
                        } ${isFlying ? 'animate-fly-cart' : ''}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{ing.icon}</span>
                          <div>
                            <h5 className="text-xs font-bold text-white">{ing.name}</h5>
                            <span className="text-[10px] text-slate-400 font-mono">{ing.qty}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-white">₹{ing.price}</span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            ing.inPantry 
                              ? 'bg-slate-800 text-slate-400' 
                              : isAdded 
                                ? 'bg-[#84c225]/20 text-[#84c225] border border-[#84c225]/30' 
                                : 'bg-slate-800 text-slate-400'
                          }`}>
                            {ing.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="p-4 rounded-xl bg-slate-900 border border-[#84c225]/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#84c225]/20 text-[#84c225] relative">
                    <ShoppingCart className="w-5 h-5" />
                    {inCart.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#84c225] text-slate-950 rounded-full font-bold text-[9px] flex items-center justify-center">
                        {inCart.length}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">BB DAILY SMART CART</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Pantry items excluded</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-lg font-extrabold text-[#84c225]">₹{cartTotal}</div>
                  <div className="text-[9px] text-slate-400">Saved ₹45 from pantry</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
