import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Leaf } from 'lucide-react';

export default function RecipeBoard({
  recipes,
  days,
  budget,
  minProtein,
  sortBy,
  pantryItems,
  onAddMealToCart,
  cartItems
}) {
  const [splittingMeal, setSplittingMeal] = useState(null);

  // 1. FILTER recipes based on budget & protein sliders
  // 2. SORT based on sort radio selection
  const filteredAndSorted = useMemo(() => {
    // Per-day budget share: total budget / number of days / 3 meals per day
    const perMealBudget = budget / days / 3;

    return recipes
      .filter((rec) => {
        // Meal cost must fit within per-meal budget allocation
        const fitsInBudget = rec.totalDiscountPrice <= perMealBudget;
        // Meal protein must meet the daily minimum threshold
        // (a single meal should contribute at least minProtein/3 towards the daily goal)
        const meetsProtein = rec.totalProtein >= Math.floor(minProtein / 3);
        return fitsInBudget && meetsProtein;
      })
      .sort((a, b) => {
        if (sortBy === 'maxOffer') return b.discountPercent - a.discountPercent;
        if (sortBy === 'lowestPrice') return a.totalDiscountPrice - b.totalDiscountPrice;
        if (sortBy === 'highestPrice') return b.totalDiscountPrice - a.totalDiscountPrice;
        if (sortBy === 'popular') return b.popularityScore - a.popularityScore;
        if (sortBy === 'new') return b.id.localeCompare(a.id);
        return 0;
      });
  }, [recipes, budget, days, minProtein, sortBy]);

  // Check pantry matches
  const getPantryMatches = (recipe) => {
    if (!pantryItems || pantryItems.length === 0) return [];
    return pantryItems.filter((p) =>
      recipe.ingredients.some((ing) =>
        ing.productName.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(ing.productName.toLowerCase())
      )
    );
  };

  // Toggle meal: animate on add, instant on deselect
  const handleMealClick = (recipe, dayIndex) => {
    const isMealInCart = cartItems.some(
      (item) => item.recipeName === recipe.name && item.dayAssigned === dayIndex + 1
    );

    if (isMealInCart) {
      // Deselect immediately, no animation
      onAddMealToCart(recipe, dayIndex + 1);
    } else {
      // Add with animation
      setSplittingMeal({ recipe, dayIndex });
      setTimeout(() => {
        onAddMealToCart(recipe, dayIndex + 1);
        setSplittingMeal(null);
      }, 500);
    }
  };

  const dayList = Array.from({ length: days }, (_, i) => `DAY ${i + 1}`);

  // No recipes match filter state
  const noResults = filteredAndSorted.length === 0;

  return (
    <div className="space-y-5 relative">
      
      {/* Splitting Fly-Out Animation Overlay */}
      <AnimatePresence>
        {splittingMeal && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0.2, x: 450, y: -200, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-[#84c225] text-white p-4 rounded-xl shadow-xl flex flex-col items-center justify-center space-y-1.5"
            >
              <Sparkles className="w-7 h-7 animate-spin" />
              <div className="text-center">
                <h3 className="text-sm font-extrabold">{splittingMeal.recipe.name}</h3>
                <p className="text-[11px] text-emerald-100">
                  +{splittingMeal.recipe.totalProtein}g Protein → Cart
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="font-bold text-gray-900 text-sm">Recipes Plan</h2>
          <p className="text-[11px] text-gray-400">
            {noResults
              ? 'No meals match your filters. Try increasing budget or lowering protein target.'
              : `Showing ${filteredAndSorted.length} meals that fit your budget & protein filters`}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          {days} Days • 3 Meals / Day
        </span>
      </div>

      {/* Day-Segmented Swimlanes: Exactly 3 meals per day */}
      <div className="space-y-4">
        {dayList.map((dayLabel, dayIndex) => {
          // Assign exactly 3 recipes per day from the filtered+sorted pool
          // Rotate through available recipes so different days get varied meals
          const dayRecipes = noResults
            ? []
            : Array.from({ length: 3 }, (_, idx) => {
                const recipeIndex = (dayIndex * 3 + idx) % filteredAndSorted.length;
                return filteredAndSorted[recipeIndex];
              });

          return (
            <div key={dayLabel} className="space-y-2.5 bg-white p-3 rounded-xl border border-gray-100">
              
              {/* Day Header Badge */}
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-gray-800 tracking-wider">
                  {dayLabel}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">3 Meals</span>
              </div>

              {/* Recipes Grid for this Day: EXACTLY 3 MEALS */}
              {dayRecipes.length === 0 ? (
                <div className="py-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-[11px] text-gray-400">
                  No recipes match your current budget & protein filters. Adjust the sliders.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dayRecipes.map((recipe, mealIdx) => {
                    const pantryMatches = getPantryMatches(recipe);
                    const isMealInCart = cartItems.some(
                      (item) => item.recipeName === recipe.name && item.dayAssigned === dayIndex + 1
                    );

                    return (
                      <div
                        key={`${recipe.id}-${dayIndex}-${mealIdx}`}
                        onClick={() => handleMealClick(recipe, dayIndex)}
                        className={`bg-white rounded-xl border overflow-hidden transition-all flex flex-col justify-between cursor-pointer group hover:border-gray-300 ${
                          isMealInCart ? 'border-[#84c225] ring-1 ring-[#84c225]' : 'border-gray-100'
                        }`}
                      >
                        {/* Thumbnail Image */}
                        <div className="relative h-28 w-full bg-gray-50 overflow-hidden">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                            }}
                          />
                        </div>

                        {/* Meal details: Title, Protein (from CSV), Cook time. NO PRICE */}
                        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-xs line-clamp-1">
                              {recipe.name}
                            </h3>

                            <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500 font-medium">
                              <span className="text-gray-900 font-bold text-xs">{recipe.totalProtein}g Protein</span>
                              <span>{recipe.cookTime} mins</span>
                            </div>
                          </div>

                          {/* Pantry match badge */}
                          {pantryMatches.length > 0 && (
                            <div className="flex items-center space-x-1 text-[10px] text-gray-600 bg-gray-50 p-1 rounded">
                              <Leaf className="w-3 h-3 text-[#84c225]" />
                              <span>Pantry item match</span>
                            </div>
                          )}

                          {/* Selection action */}
                          <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px]">
                            <span className="text-gray-400">5 key items</span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMealClick(recipe, dayIndex);
                              }}
                              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                                isMealInCart
                                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                  : 'bg-[#84c225] hover:bg-[#689f38] text-white'
                              }`}
                            >
                              {isMealInCart ? 'Remove' : 'Add Meal'}
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
