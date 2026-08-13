import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Leaf, CheckSquare, Square, Info, ShoppingBag, ChevronDown, ChevronUp, Shuffle } from 'lucide-react';

export default function RecipeBoard({
  recipes,
  days,
  budget,
  minProtein,
  sortBy,
  pantryItems,
  onAddMealToCart,
  cartItems,
  timeConstraint,
  usePantryFirst,
  numPeople = 2,
  trackingPreferences = {
    trackProtein: true,
    trackCarbsFat: false,
    trackCalories: true,
    trackBudget: true
  }
}) {
  const [splittingMeal, setSplittingMeal] = useState(null);
  
  // Track currently expanded recipe card per slot: { [slotKey]: boolean }
  const [expandedSlots, setExpandedSlots] = useState({});

  // Track custom shuffled recipe per slot: { [`${dayIndex}-${mealIdx}`]: recipeObject }
  const [slotAssignments, setSlotAssignments] = useState({});

  // Track animating shuffle button per slot
  const [shufflingSlot, setShufflingSlot] = useState(null);

  // Track user's custom checked ingredient IDs per recipe card: { [`${recipe.id}-day-${dayIndex}`]: ['ing-1', 'ing-2'] }
  const [selectedIngsMap, setSelectedIngsMap] = useState({});

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

  // 1. FILTER recipes based on budget, protein, and time sliders
  // 2. SORT based on sort radio selection, prioritizing pantry items if usePantryFirst is true
  const filteredAndSorted = useMemo(() => {
    const perMealBudget = budget / days / 3;

    return recipes
      .filter((rec) => {
        const fitsInBudget = rec.totalDiscountPrice <= perMealBudget;
        const meetsProtein = rec.totalProtein >= Math.floor(minProtein / 3);
        const meetsTime = timeConstraint === 'Easy cook' ? rec.cookTime <= 25 : true;
        return fitsInBudget && meetsProtein && meetsTime;
      })
      .sort((a, b) => {
        if (usePantryFirst) {
          const aHasPantry = getPantryMatches(a).length > 0;
          const bHasPantry = getPantryMatches(b).length > 0;
          if (aHasPantry && !bHasPantry) return -1;
          if (!aHasPantry && bHasPantry) return 1;
        }

        if (sortBy === 'maxOffer') return b.discountPercent - a.discountPercent;
        if (sortBy === 'lowestPrice') return a.totalDiscountPrice - b.totalDiscountPrice;
        if (sortBy === 'highestPrice') return b.totalDiscountPrice - a.totalDiscountPrice;
        if (sortBy === 'popular') return b.popularityScore - a.popularityScore;
        if (sortBy === 'new') return b.id.localeCompare(a.id);
        return 0;
      });
  }, [recipes, budget, days, minProtein, sortBy, timeConstraint, usePantryFirst, pantryItems]);

  // Get recipe assigned for a specific day and meal slot
  const getRecipeForSlot = (dayIndex, mealIdx) => {
    if (filteredAndSorted.length === 0) return null;
    const slotKey = `${dayIndex}-${mealIdx}`;
    if (slotAssignments[slotKey]) {
      // Validate that the assigned recipe is still in filtered list or fallback
      const match = filteredAndSorted.find((r) => r.id === slotAssignments[slotKey].id);
      if (match) return match;
    }
    const defaultIdx = (dayIndex * 3 + mealIdx) % filteredAndSorted.length;
    return filteredAndSorted[defaultIdx];
  };

  // Shuffle individual recipe in a slot
  const handleShuffleSlot = (dayIndex, mealIdx, e) => {
    if (e) e.stopPropagation();
    if (filteredAndSorted.length <= 1) return;

    const slotKey = `${dayIndex}-${mealIdx}`;
    setShufflingSlot(slotKey);
    setTimeout(() => setShufflingSlot(null), 500);

    const currentRecipe = getRecipeForSlot(dayIndex, mealIdx);
    const currentIndex = filteredAndSorted.findIndex((r) => r.id === currentRecipe.id);
    const nextIndex = (currentIndex + 1) % filteredAndSorted.length;
    const nextRecipe = filteredAndSorted[nextIndex];

    setSlotAssignments((prev) => ({
      ...prev,
      [slotKey]: nextRecipe
    }));
  };

  // Get selected ingredient objects for a recipe & day
  const getSelectedIngredientsList = (recipe, dayIndex) => {
    const key = `${recipe.id}-day-${dayIndex}`;
    const allIngs = recipe.essentialIngredients || recipe.ingredients;
    const selectedIds = selectedIngsMap[key];

    if (!selectedIds) {
      return allIngs;
    }
    return allIngs.filter((ing) => selectedIds.includes(ing.id));
  };

  // Toggle individual ingredient selection
  const handleToggleIngredient = (recipe, dayIndex, ingredientId, e) => {
    if (e) e.stopPropagation();
    const key = `${recipe.id}-day-${dayIndex}`;
    const allIngs = recipe.essentialIngredients || recipe.ingredients;
    const currentSelected = selectedIngsMap[key] || allIngs.map((i) => i.id);

    let updatedIds;
    if (currentSelected.includes(ingredientId)) {
      updatedIds = currentSelected.filter((id) => id !== ingredientId);
    } else {
      updatedIds = [...currentSelected, ingredientId];
    }

    setSelectedIngsMap((prev) => ({
      ...prev,
      [key]: updatedIds
    }));

    // If meal is already in cart, sync updated selection to cart immediately
    const isMealInCart = cartItems.some(
      (item) => item.recipeName === recipe.name && item.dayAssigned === dayIndex + 1
    );

    if (isMealInCart) {
      const selectedIngObjects = allIngs.filter((ing) => updatedIds.includes(ing.id));
      onAddMealToCart(recipe, dayIndex + 1, selectedIngObjects);
    }
  };

  // Toggle Select All / Deselect All
  const handleToggleSelectAll = (recipe, dayIndex, e) => {
    if (e) e.stopPropagation();
    const key = `${recipe.id}-day-${dayIndex}`;
    const allIngs = recipe.essentialIngredients || recipe.ingredients;
    const currentSelected = selectedIngsMap[key] || allIngs.map((i) => i.id);

    const isAllSelected = currentSelected.length === allIngs.length;
    const updatedIds = isAllSelected ? [] : allIngs.map((i) => i.id);

    setSelectedIngsMap((prev) => ({
      ...prev,
      [key]: updatedIds
    }));

    // Sync to cart if already in cart
    const isMealInCart = cartItems.some(
      (item) => item.recipeName === recipe.name && item.dayAssigned === dayIndex + 1
    );

    if (isMealInCart) {
      const selectedIngObjects = allIngs.filter((ing) => updatedIds.includes(ing.id));
      onAddMealToCart(recipe, dayIndex + 1, selectedIngObjects);
    }
  };

  // Toggle meal cart state
  const handleMealCartClick = (recipe, dayIndex, e) => {
    if (e) e.stopPropagation();
    const isMealInCart = cartItems.some(
      (item) => item.recipeName === recipe.name && item.dayAssigned === dayIndex + 1
    );

    const selectedIngObjects = getSelectedIngredientsList(recipe, dayIndex);

    if (isMealInCart) {
      onAddMealToCart(recipe, dayIndex + 1);
    } else {
      setSplittingMeal({ recipe, dayIndex });
      setTimeout(() => {
        onAddMealToCart(recipe, dayIndex + 1, selectedIngObjects);
        setSplittingMeal(null);
      }, 450);
    }
  };

  // Track hovered slot for automatic on-hover customize ingredients view
  const [hoveredSlot, setHoveredSlot] = useState(null);

  // Toggle expand on card click (optional manual pin)
  const toggleSlotExpand = (slotKey) => {
    setExpandedSlots((prev) => ({
      ...prev,
      [slotKey]: !prev[slotKey]
    }));
  };

  const dayList = Array.from({ length: days }, (_, i) => `DAY ${i + 1}`);
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
              : `Hover over any recipe card to view & customize ingredients, or click shuffle to swap meals.`}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          {days} Days • 3 Meals / Day
        </span>
      </div>

      {/* Day-Segmented Swimlanes */}
      <div className="space-y-4">
        {dayList.map((dayLabel, dayIndex) => {
          return (
            <div key={dayLabel} className="space-y-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
              
              {/* Day Header Badge */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xs text-gray-900 tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                    {dayLabel}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    3 Planned Meals
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  Hover to customize • Click 🔀 to swap
                </span>
              </div>

              {/* Stable 3-Column Grid */}
              {noResults ? (
                <div className="py-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-[11px] text-gray-400">
                  No recipes match your current budget & protein filters. Adjust the sliders.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
                  {[0, 1, 2].map((mealIdx) => {
                    const slotKey = `${dayIndex}-${mealIdx}`;
                    const recipe = getRecipeForSlot(dayIndex, mealIdx);
                    if (!recipe) return null;

                    // Show customize ingredients on hover OR manual click
                    const isHovered = hoveredSlot === slotKey;
                    const isExpanded = isHovered || !!expandedSlots[slotKey];
                    const isShuffling = shufflingSlot === slotKey;
                    const pantryMatches = getPantryMatches(recipe);
                    const isMealInCart = cartItems.some(
                      (item) => item.recipeName === recipe.name && item.dayAssigned === dayIndex + 1
                    );

                    const allIngs = recipe.essentialIngredients || recipe.ingredients;
                    const selectedIngs = getSelectedIngredientsList(recipe, dayIndex);
                    const selectedIngIds = selectedIngs.map((i) => i.id);

                    // Recipe portion cost & full packet cost
                    const selectedRecipeCost = selectedIngs.reduce(
                      (acc, item) => acc + (item.recipeDiscountPrice || item.discountPrice || 0),
                      0
                    );
                    const selectedPacketCost = selectedIngs.reduce(
                      (acc, item) => acc + (item.packetDiscountPrice || (item.discountPrice * 5) || 0),
                      0
                    );

                    const isAllSelected = selectedIngIds.length === allIngs.length;

                    return (
                      <div
                        key={slotKey}
                        onMouseEnter={() => setHoveredSlot(slotKey)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between relative shadow-2xs ${
                          isHovered ? 'shadow-md border-gray-300 ring-1 ring-gray-200' : 'border-gray-200'
                        } ${isMealInCart ? 'ring-2 ring-[#84c225] border-[#84c225]' : ''}`}
                      >
                        {/* 1. Fixed-Height Thumbnail Image (Never jumps or resizes on hover) */}
                        <div className="relative h-32 w-full bg-gray-50 overflow-hidden rounded-t-xl shrink-0">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                            }}
                          />

                          {/* Cook Time Badge */}
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{recipe.cookTime} min</span>
                          </div>

                          {/* Shuffle Button (Small Icon-only floating on top-right) */}
                          <button
                            type="button"
                            onClick={(e) => handleShuffleSlot(dayIndex, mealIdx, e)}
                            className="absolute top-2 right-2 z-10 p-1.5 bg-white/95 hover:bg-white text-gray-700 hover:text-[#689f38] rounded-full border border-gray-200 shadow-sm cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                            title="Shuffle recipe"
                          >
                            <Shuffle
                              className={`w-3.5 h-3.5 text-[#84c225] transition-transform duration-300 ${
                                isShuffling ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* 2. Meal Card Body */}
                        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-xs line-clamp-1" title={recipe.name}>
                              {recipe.name}
                            </h3>

                            <div className="flex items-center justify-between mt-1 text-[11px] text-gray-500 font-medium">
                              {trackingPreferences.trackProtein !== false ? (
                                <span className="text-[#84c225] font-extrabold text-xs">
                                  {recipe.totalProtein}g Protein
                                </span>
                              ) : (
                                <span className="text-gray-700 font-bold text-xs">{recipe.cookTime} mins</span>
                              )}
                              {trackingPreferences.trackCalories !== false && (
                                <span className="text-[10px] text-gray-400">
                                  ~{recipe.totalCalories || 340} kcal
                                </span>
                              )}
                            </div>

                            {/* Macro Breakdown Strip (Only shown if trackCarbsFat is enabled in Profile) */}
                            {trackingPreferences.trackCarbsFat && (
                              <div className="flex items-center space-x-1.5 mt-1 text-[9.5px] text-gray-400 font-medium">
                                <span>Carbs: {recipe.totalCarbs || 38}g</span>
                                <span>•</span>
                                <span>Fat: {recipe.totalFat || 12}g</span>
                                <span>•</span>
                                <span>{allIngs.length} items</span>
                              </div>
                            )}

                            {/* Pantry match indicator */}
                            {pantryMatches.length > 0 && (
                              <div className="mt-1.5 flex items-center space-x-1 text-[9.5px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <Leaf className="w-3 h-3 text-[#84c225]" />
                                <span>Pantry ingredient available</span>
                              </div>
                            )}
                          </div>

                          {/* Cost Breakdown with explicit people count */}
                          <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10.5px]">
                            <div>
                              <span className="text-gray-400 block text-[9px]">
                                Portion Cost ({numPeople} {numPeople === 1 ? 'person' : 'people'})
                              </span>
                              <span className="font-bold text-gray-800">₹{selectedRecipeCost * numPeople}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-gray-400 block text-[9px]">Store Pack (x5)</span>
                              <span className="font-extrabold text-[#689f38] text-xs">₹{selectedPacketCost}</span>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <div className="space-y-1.5 pt-1">
                            <button
                              type="button"
                              onClick={(e) => handleMealCartClick(recipe, dayIndex, e)}
                              className={`w-full py-2 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1 cursor-pointer ${
                                isMealInCart
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                  : 'bg-[#84c225] hover:bg-[#689f38] text-white'
                              }`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{isMealInCart ? 'Remove Meal' : `Add to Cart (₹${selectedPacketCost})`}</span>
                            </button>
                          </div>
                        </div>

                        {/* 3. Customize Ingredients Section on Hover */}
                        {isExpanded && (
                          <div className="p-3 bg-gray-50/95 border-t border-gray-200 space-y-2 text-xs transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 text-[11px]">
                                Customize Ingredients ({selectedIngs.length}/{allIngs.length})
                              </span>

                              <button
                                type="button"
                                onClick={(e) => handleToggleSelectAll(recipe, dayIndex, e)}
                                className="text-[10px] font-semibold text-[#84c225] hover:underline flex items-center space-x-1 cursor-pointer"
                              >
                                {isAllSelected ? <CheckSquare className="w-3 h-3 text-[#84c225]" /> : <Square className="w-3 h-3 text-gray-400" />}
                                <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
                              </button>
                            </div>

                            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-0.5">
                              {allIngs.map((ing) => {
                                const isChecked = selectedIngIds.includes(ing.id);
                                const portionRate = ing.recipeDiscountPrice || ing.discountPrice || Math.round((ing.packetDiscountPrice || ing.price || 0) * 0.2);
                                const packRate = ing.packetDiscountPrice || (portionRate * 5);

                                return (
                                  <div
                                    key={ing.id}
                                    onClick={(e) => handleToggleIngredient(recipe, dayIndex, ing.id, e)}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                                      isChecked
                                        ? 'bg-white border-emerald-200 text-gray-900 shadow-2xs'
                                        : 'bg-gray-100/70 border-gray-200 text-gray-400 line-through'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => handleToggleIngredient(recipe, dayIndex, ing.id, e)}
                                        className="w-3 h-3 accent-[#84c225] rounded cursor-pointer shrink-0"
                                      />
                                      <div className="min-w-0">
                                        <p className={`font-semibold text-[10.5px] truncate ${isChecked ? 'text-gray-900' : 'text-gray-400'}`}>
                                          {ing.productName}
                                        </p>
                                        <p className="text-[9px] text-gray-400 truncate">
                                          {ing.recipeQuantity || '200g'} (Pack: {ing.quantity || '1kg'} • {ing.usagesText || 'x5'})
                                        </p>
                                      </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <span className={`font-bold text-[10.5px] block ${isChecked ? 'text-[#84c225]' : 'text-gray-400'}`}>
                                        ₹{packRate}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

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
