import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Leaf, CheckSquare, Square, Info, ShoppingBag, Maximize2, ChevronDown, ChevronUp } from 'lucide-react';

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
  usePantryFirst
}) {
  const [splittingMeal, setSplittingMeal] = useState(null);
  
  // Track currently expanded recipe card per day row (e.g. "0-1" -> dayIndex 0, mealIdx 1)
  const [hoveredCard, setHoveredCard] = useState(null);

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

  // Toggle expand on card click
  const handleCardClick = (cardKey) => {
    setHoveredCard((prev) => (prev === cardKey ? null : cardKey));
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
              : `Hover or click any meal to expand ingredients, customize items, and see recipe rates.`}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          {days} Days • 3 Meals / Day
        </span>
      </div>

      {/* Day-Segmented Swimlanes */}
      <div className="space-y-4">
        {dayList.map((dayLabel, dayIndex) => {
          const dayRecipes = noResults
            ? []
            : Array.from({ length: 3 }, (_, idx) => {
                const recipeIndex = (dayIndex * 3 + idx) % filteredAndSorted.length;
                return filteredAndSorted[recipeIndex];
              });

          const isAnyHoveredInDay = hoveredCard && hoveredCard.startsWith(`${dayIndex}-`);

          return (
            <div key={dayLabel} className="space-y-2.5 bg-white p-3 rounded-xl border border-gray-100">
              
              {/* Day Header Badge */}
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-gray-800 tracking-wider">
                  {dayLabel}
                </span>
                <span className="text-[10px] text-gray-400 font-medium flex items-center space-x-1">
                  <Maximize2 className="w-3 h-3 text-[#84c225]" />
                  <span>3 Meals • Hover or click card to expand</span>
                </span>
              </div>

              {/* Recipes Row: Netflix / Prime Video Style Hover Expansion */}
              {dayRecipes.length === 0 ? (
                <div className="py-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-[11px] text-gray-400">
                  No recipes match your current budget & protein filters. Adjust the sliders.
                </div>
              ) : (
                <div
                  className="flex flex-col md:flex-row gap-3 relative items-stretch transition-all duration-300 ease-in-out min-h-[275px]"
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {dayRecipes.map((recipe, mealIdx) => {
                    const cardKey = `${dayIndex}-${mealIdx}`;
                    const isHovered = hoveredCard === cardKey;
                    const isCompressed = isAnyHoveredInDay && !isHovered;

                    const pantryMatches = getPantryMatches(recipe);
                    const isMealInCart = cartItems.some(
                      (item) => item.recipeName === recipe.name && item.dayAssigned === dayIndex + 1
                    );

                    const allIngs = recipe.essentialIngredients || recipe.ingredients;
                    const selectedIngs = getSelectedIngredientsList(recipe, dayIndex);
                    const selectedIngIds = selectedIngs.map((i) => i.id);

                    // Compute recipe portion subtotal of selected ingredients
                    const selectedRecipeCost = selectedIngs.reduce(
                      (acc, item) => acc + (item.recipeDiscountPrice || item.discountPrice || 0),
                      0
                    );

                    const isAllSelected = selectedIngIds.length === allIngs.length;

                    // Flex style calculation: expands hovered card to 3.6x width (~76%), shrinks compressed to 0.55x (~12%)
                    const flexStyle = isHovered
                      ? { flex: '3.6 1 0%', minWidth: '0px' }
                      : isCompressed
                      ? { flex: '0.55 1 0%', minWidth: '0px' }
                      : { flex: '1 1 0%', minWidth: '0px' };

                    return (
                      <div
                        key={`${recipe.id}-${dayIndex}-${mealIdx}`}
                        style={flexStyle}
                        onMouseEnter={() => setHoveredCard(cardKey)}
                        onClick={() => handleCardClick(cardKey)}
                        className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 ease-in-out flex flex-col justify-between cursor-pointer group ${
                          isHovered
                            ? 'shadow-2xl ring-2 ring-[#84c225] border-[#84c225] z-30'
                            : isCompressed
                            ? 'opacity-85 border-gray-200 bg-gray-50/60 z-10 scale-[0.98]'
                            : 'border-gray-100 hover:border-gray-300 shadow-2xs'
                        } ${isMealInCart && !isHovered ? 'border-[#84c225] ring-1 ring-[#84c225]' : ''}`}
                      >

                        {/* HOVERED EXPANDED STATE (Right Side Ingredients Details) */}
                        {isHovered ? (
                          <div className="p-3 flex flex-col md:flex-row gap-3 h-full bg-white">
                            
                            {/* Left Side: Recipe Summary & Media */}
                            <div className="w-full md:w-5/12 flex flex-col justify-between space-y-2 border-r-0 md:border-r border-gray-100 pr-0 md:pr-2.5">
                              <div className="space-y-1.5">
                                <div className="relative aspect-square max-h-28 w-full rounded-lg overflow-hidden bg-gray-100 shadow-2xs">
                                  <img
                                    src={recipe.image}
                                    alt={recipe.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                                    }}
                                  />
                                  <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                    {recipe.cookTime} mins
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-extrabold text-gray-900 text-xs leading-snug truncate" title={recipe.name}>
                                    {recipe.name}
                                  </h3>
                                  <div className="flex items-center space-x-1.5 mt-0.5">
                                    <span className="text-[#84c225] font-extrabold text-xs">
                                      {recipe.totalProtein}g Protein
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500 text-[10px]">
                                      {allIngs.length} Ingredients
                                    </span>
                                  </div>
                                </div>

                                {pantryMatches.length > 0 && (
                                  <div className="flex items-center space-x-1 text-[10px] text-emerald-800 bg-emerald-50 p-1 rounded border border-emerald-100">
                                    <Leaf className="w-3 h-3 text-[#84c225] shrink-0" />
                                    <span>Pantry item available!</span>
                                  </div>
                                )}
                              </div>

                              <div className="pt-1.5 border-t border-gray-100 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-gray-500 font-medium">Recipe Cost:</span>
                                  <span className="font-extrabold text-gray-900 text-xs">₹{selectedRecipeCost}</span>
                                </div>

                                <button
                                  onClick={(e) => handleMealCartClick(recipe, dayIndex, e)}
                                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1 cursor-pointer ${
                                    isMealInCart
                                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                      : 'bg-[#84c225] hover:bg-[#689f38] text-white'
                                  }`}
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>{isMealInCart ? 'Remove from Cart' : `Add ${selectedIngs.length} Items (₹${selectedRecipeCost})`}</span>
                                </button>
                              </div>
                            </div>

                            {/* Right Side: Expanded Ingredients Checklist & Portion Pricing */}
                            <div className="w-full md:w-7/12 flex flex-col justify-between space-y-1.5 min-w-0" onClick={(e) => e.stopPropagation()}>
                              
                              {/* Header & Select All Toggle */}
                              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                                <div>
                                  <h4 className="font-bold text-gray-900 text-xs flex items-center space-x-1">
                                    <span>Recipe Ingredients</span>
                                    <span className="text-[10px] font-normal text-gray-400">({selectedIngs.length}/{allIngs.length})</span>
                                  </h4>
                                </div>

                                <button
                                  onClick={(e) => handleToggleSelectAll(recipe, dayIndex, e)}
                                  className="text-[10px] font-semibold text-[#84c225] hover:underline flex items-center space-x-1 cursor-pointer bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100"
                                >
                                  {isAllSelected ? <CheckSquare className="w-3 h-3 text-[#84c225]" /> : <Square className="w-3 h-3 text-gray-400" />}
                                  <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
                                </button>
                              </div>

                              {/* Helpful Rate Note */}
                              <div className="bg-amber-50/80 border border-amber-200/70 p-1 rounded text-[9.5px] text-amber-900 flex items-start space-x-1">
                                <Info className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                                <p className="leading-tight">
                                  <strong>Recipe Portion Rate:</strong> 1 portion cost. Store pack is reusable 3-4x.
                                </p>
                              </div>

                              {/* Scrollable Ingredient Items List */}
                              <div className="flex-1 overflow-y-auto max-h-[145px] space-y-1 pr-1 text-xs">
                                {allIngs.map((ing) => {
                                  const isChecked = selectedIngIds.includes(ing.id);
                                  const portionRate = ing.recipeDiscountPrice || ing.discountPrice || Math.round((ing.packetDiscountPrice || ing.price || 0) * 0.2);
                                  const portionQty = ing.recipeQuantity || '200g';
                                  const packQty = ing.quantity || '1 kg';

                                  return (
                                    <div
                                      key={ing.id}
                                      onClick={(e) => handleToggleIngredient(recipe, dayIndex, ing.id, e)}
                                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                                        isChecked
                                          ? 'bg-emerald-50/40 border-emerald-200 text-gray-900'
                                          : 'bg-gray-50/40 border-gray-100 text-gray-400 line-through'
                                      }`}
                                    >
                                      {/* Checkbox & Item Info */}
                                      <div className="flex items-center space-x-1.5 min-w-0 pr-1.5">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={(e) => handleToggleIngredient(recipe, dayIndex, ing.id, e)}
                                          className="w-3 h-3 accent-[#84c225] rounded cursor-pointer shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <p className={`font-bold text-[10.5px] truncate ${isChecked ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {ing.productName}
                                          </p>
                                          <p className="text-[9.5px] text-gray-400 truncate">
                                            Req: <span className="font-semibold text-gray-700">{portionQty}</span> ({packQty})
                                          </p>
                                        </div>
                                      </div>

                                      {/* Portion Rate vs Store Pack Price */}
                                      <div className="text-right shrink-0">
                                        <span className={`font-extrabold text-[11px] block ${isChecked ? 'text-[#84c225]' : 'text-gray-400'}`}>
                                          ₹{portionRate}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                            </div>

                          </div>
                        ) : isCompressed ? (
                          /* COMPRESSED NON-HOVERED STATE (Adjacent cards when another card is hovered) */
                          <div className="p-2 h-full flex flex-col justify-between space-y-1.5 min-w-0 overflow-hidden">
                            <div className="space-y-1 min-w-0">
                              <div className="relative aspect-square w-full bg-gray-100 rounded overflow-hidden shrink-0">
                                <img
                                  src={recipe.image}
                                  alt={recipe.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                                  }}
                                />
                              </div>

                              <div className="min-w-0">
                                <h3 className="font-bold text-gray-800 text-[10px] truncate" title={recipe.name}>
                                  {recipe.name}
                                </h3>
                                <div className="text-[9.5px] text-gray-500 font-semibold truncate">
                                  {recipe.totalProtein}g Protein
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleMealCartClick(recipe, dayIndex, e)}
                              className={`w-full py-1 rounded text-[10px] font-bold transition-all cursor-pointer truncate ${
                                isMealInCart
                                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                  : 'bg-[#84c225] hover:bg-[#689f38] text-white'
                              }`}
                            >
                              {isMealInCart ? 'Remove' : '+ Add'}
                            </button>
                          </div>
                        ) : (
                          /* NORMAL STANDARD STATE (No hover active in row) */
                          <div className="flex flex-col h-full justify-between">
                            {/* Square Thumbnail Image */}
                            <div className="relative aspect-square w-full bg-gray-50 overflow-hidden rounded-t-xl">
                              <img
                                src={recipe.image}
                                alt={recipe.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                                }}
                              />
                            </div>

                            {/* Meal details */}
                            <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
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
                                <div className="flex items-center space-x-1 text-[10px] text-emerald-800 bg-emerald-50 p-1 rounded border border-emerald-100">
                                  <Leaf className="w-3 h-3 text-[#84c225]" />
                                  <span>Pantry item match</span>
                                </div>
                              )}

                              {/* Selection action */}
                              <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10.5px]">
                                <span className="text-gray-400">{allIngs.length} items</span>

                                <button
                                  onClick={(e) => handleMealCartClick(recipe, dayIndex, e)}
                                  className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
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
