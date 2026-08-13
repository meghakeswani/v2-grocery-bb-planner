import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import FilterSidebar from './components/FilterSidebar';
import PantryWidget from './components/PantryWidget';
import StatRings from './components/StatRings';
import RecipeBoard from './components/RecipeBoard';
import CartSidebar from './components/CartSidebar';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import { fetchAndParseRecipes } from './utils/csvParser';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active top navigation tab ('Shop' | 'Stats' | 'Profile')
  const [activeTab, setActiveTab] = useState('Shop');

  // Filters & Controls State
  const [budget, setBudget] = useState(3000);
  const [days, setDays] = useState(3);
  const [minProtein, setMinProtein] = useState(50);
  const [sortBy, setSortBy] = useState('popular');
  const [timeConstraint, setTimeConstraint] = useState('Flexible');
  const [numPeople, setNumPeople] = useState(2);
  const [usePantryFirst, setUsePantryFirst] = useState(false);

  // My Pantry initial state
  const [pantryItems, setPantryItems] = useState([
    { id: 'pantry-1', name: 'Spinach', quantity: '250g', daysLeft: 2 },
    { id: 'pantry-2', name: 'Tomatoes', quantity: '500g', daysLeft: 3 }
  ]);

  // Shopping Cart state: selected meal ingredients (max 5 essential items per meal)
  const [cartItems, setCartItems] = useState([]);

  // Fetch dataset on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchAndParseRecipes();
        setRecipes(data);
      } catch (err) {
        console.error('Error loading dataset recipes:', err);
        setError(err.message || 'Failed to load dataset.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Cart Telemetry from SELECTED meals only (Full buying packet rates for cart checkout)
  const { cartTotalValue, cartTotalProtein, totalSavings } = useMemo(() => {
    let totalVal = 0;
    let totalProt = 0;
    let origVal = 0;

    cartItems.forEach((item) => {
      const buyPrice = item.packetDiscountPrice ?? item.discountPrice ?? 0;
      const originalPrice = item.packetPrice ?? item.price ?? buyPrice;
      totalVal += buyPrice * item.count;
      origVal += originalPrice * item.count;
      totalProt += (item.protein || 0) * item.count;
    });

    return {
      cartTotalValue: Math.round(totalVal),
      cartTotalProtein: Math.round(totalProt),
      totalSavings: Math.max(0, Math.round(origVal - totalVal))
    };
  }, [cartItems]);

  // Toggle Meal handler: adds custom selected ingredients OR default essential items
  const handleToggleMeal = (recipe, dayAssigned, customIngredients = null) => {
    setCartItems((prevCart) => {
      const isMealInCart = prevCart.some(
        (item) => item.recipeName === recipe.name && item.dayAssigned === dayAssigned
      );

      // If user passed specific customIngredients (e.g. from expanded card checkbox selection)
      if (customIngredients && Array.isArray(customIngredients)) {
        // Remove existing items for this recipe & day first
        const filtered = prevCart.filter(
          (item) => !(item.recipeName === recipe.name && item.dayAssigned === dayAssigned)
        );

        if (customIngredients.length === 0) {
          return filtered;
        }

        const added = customIngredients.map((ing) => ({
          ...ing,
          count: 1,
          dayAssigned: dayAssigned
        }));

        return [...filtered, ...added];
      }

      if (isMealInCart) {
        // DESELECT: remove all items for this recipe+day
        return prevCart.filter(
          (item) => !(item.recipeName === recipe.name && item.dayAssigned === dayAssigned)
        );
      }

      // SELECT: add top 5 essential items by default
      const newItems = [...prevCart];
      const itemsToAdd = recipe.essentialIngredients || recipe.ingredients.slice(0, 5);

      itemsToAdd.forEach((ing) => {
        const existingIdx = newItems.findIndex(
          (item) => item.productName === ing.productName && item.dayAssigned === dayAssigned
        );

        if (existingIdx > -1) {
          newItems[existingIdx] = {
            ...newItems[existingIdx],
            count: newItems[existingIdx].count + 1
          };
        } else {
          newItems.push({
            ...ing,
            count: 1,
            dayAssigned: dayAssigned
          });
        }
      });

      return newItems;
    });
  };

  // Cart item controls
  const handleUpdateQuantity = (itemId, newCount) => {
    if (newCount <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, count: newCount } : item))
    );
  };

  // State to track completed/eaten meals across the app: { [`${day}-${recipeName}`]: boolean }
  const [completedMeals, setCompletedMeals] = useState({});

  // State for user tracking preferences (Protein, Carbs/Fat, Calories, Budget)
  const [trackingPreferences, setTrackingPreferences] = useState({
    trackProtein: true,
    trackCarbsFat: false,
    trackCalories: true,
    trackBudget: true
  });

  const handleSwapCartItem = (oldItemId, newIngredient) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === oldItemId) {
          return {
            ...newIngredient,
            count: item.count,
            dayAssigned: item.dayAssigned,
            recipeName: item.recipeName
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const resetFilters = () => {
    setBudget(3000);
    setDays(3);
    setMinProtein(50);
    setSortBy('popular');
    setTimeConstraint('Flexible');
    setNumPeople(2);
    setUsePantryFirst(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-8 h-8 text-[#84c225] animate-spin" />
        <p className="text-gray-500 font-medium text-xs">
          Loading BB Daily Household Planner...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm text-center max-w-sm space-y-2">
          <p className="text-xs text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-[#84c225] text-white font-bold rounded text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-emerald-100">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={cartItems.reduce((acc, i) => acc + i.count, 0)}
        cartItems={cartItems}
        days={days}
        recipes={recipes}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* SHOP TAB: 3-Column Layout Matching Sketch */}
        {activeTab === 'Shop' && (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            
            {/* 1. Left Column (Filters & Sort Sidebar) */}
              <FilterSidebar
                budget={budget}
                setBudget={setBudget}
                days={days}
                setDays={setDays}
                minProtein={minProtein}
                setMinProtein={setMinProtein}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resetFilters={resetFilters}
                timeConstraint={timeConstraint}
                setTimeConstraint={setTimeConstraint}
                numPeople={numPeople}
                setNumPeople={setNumPeople}
                usePantryFirst={usePantryFirst}
                setUsePantryFirst={setUsePantryFirst}
              />

            {/* 2. Middle Column (Dashboard Top + Recipes Board Bottom) */}
            <div className="flex-1 min-w-0 space-y-5">
              
              {/* Top Section (Dashboard): Pantry Widget + Circular Stat Rings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PantryWidget
                  pantryItems={pantryItems}
                  setPantryItems={setPantryItems}
                />
                <StatRings
                  cartTotalValue={cartTotalValue}
                  budgetTarget={budget}
                  cartTotalProtein={cartTotalProtein}
                  proteinTarget={minProtein * days}
                />
              </div>

              {/* Bottom Section (Recipes Board Segmented by Days) */}
              <RecipeBoard
                recipes={recipes}
                days={days}
                budget={budget}
                minProtein={minProtein}
                sortBy={sortBy}
                pantryItems={pantryItems}
                onAddMealToCart={handleToggleMeal}
                cartItems={cartItems}
                timeConstraint={timeConstraint}
                usePantryFirst={usePantryFirst}
                numPeople={numPeople}
                trackingPreferences={trackingPreferences}
              />

            </div>

            {/* 3. Right Column (Persistent Cart Sidebar) */}
            <CartSidebar
              cartItems={cartItems}
              recipes={recipes}
              days={days}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onSwapCartItem={handleSwapCartItem}
              totalCartValue={cartTotalValue}
              totalCartProtein={cartTotalProtein}
              totalSavings={totalSavings}
            />

          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'Stats' && (
          <StatsView
            cartTotalValue={cartTotalValue}
            budgetTarget={budget}
            cartTotalProtein={cartTotalProtein}
            proteinTarget={minProtein * days}
            minProteinPerDay={minProtein}
            totalSavings={totalSavings}
            cartItems={cartItems}
            recipes={recipes}
            days={days}
            completedMeals={completedMeals}
            setCompletedMeals={setCompletedMeals}
            trackingPreferences={trackingPreferences}
            onNavigateToShop={() => setActiveTab('Shop')}
          />
        )}

        {/* PROFILE TAB */}
        {activeTab === 'Profile' && (
          <ProfileView
            householdSize={numPeople}
            setHouseholdSize={setNumPeople}
            trackingPreferences={trackingPreferences}
            setTrackingPreferences={setTrackingPreferences}
          />
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-gray-100 py-3 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-[11px] text-gray-400">
          <p>© 2026 BigBasket Daily (BB Daily) • Household Planning Companion</p>
        </div>
      </footer>

    </div>
  );
}
