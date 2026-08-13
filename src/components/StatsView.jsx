import React, { useState, useMemo } from 'react';
import {
  Award,
  TrendingUp,
  BarChart2,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  Flame,
  Utensils,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StatsView({
  cartTotalValue = 0,
  budgetTarget = 3000,
  cartTotalProtein = 0,
  proteinTarget = 150,
  minProteinPerDay = 50,
  totalSavings = 0,
  cartItems = [],
  recipes = [],
  days = 3,
  completedMeals = {},
  setCompletedMeals,
  onNavigateToShop
}) {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' | 'monthly'

  // Derive the active meal plan from cartItems, or fallback to first recipes for configured days
  const daywiseMealPlan = useMemo(() => {
    // 1. Group bought cart items by (dayAssigned, recipeName)
    const dayGroups = {};
    for (let d = 1; d <= days; d++) {
      dayGroups[d] = [];
    }

    if (cartItems.length > 0) {
      const seenMeals = new Set();
      cartItems.forEach((item) => {
        const d = item.dayAssigned || 1;
        const rName = item.recipeName || 'Custom Recipe';
        const mealKey = `${d}-${rName}`;
        if (!seenMeals.has(mealKey)) {
          seenMeals.add(mealKey);
          const meta = recipes.find(
            (r) => r.name.toLowerCase() === rName.toLowerCase()
          ) || {
            id: `custom-${mealKey}`,
            name: rName,
            image: item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            cookTime: 20,
            totalProtein: item.protein ? item.protein * 2 : 22,
            ingredients: []
          };

          if (!dayGroups[d]) dayGroups[d] = [];
          dayGroups[d].push({
            id: mealKey,
            day: d,
            recipeName: rName,
            image: meta.image,
            cookTime: meta.cookTime || 20,
            protein: meta.totalProtein || 20,
            ingredients: meta.ingredients || []
          });
        }
      });
    }

    // 2. If any day has no bought meals yet, populate from recipes plan as upcoming schedule
    for (let d = 1; d <= days; d++) {
      if (!dayGroups[d] || dayGroups[d].length === 0) {
        dayGroups[d] = [0, 1, 2].map((idx) => {
          const recIdx = ((d - 1) * 3 + idx) % (recipes.length || 1);
          const rec = recipes[recIdx] || {
            id: `rec-${d}-${idx}`,
            name: `Planned Meal ${idx + 1}`,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            cookTime: 20,
            totalProtein: 24,
            ingredients: []
          };
          return {
            id: `${d}-${rec.name}`,
            day: d,
            recipeName: rec.name,
            image: rec.image,
            cookTime: rec.cookTime || 20,
            protein: rec.totalProtein || 20,
            ingredients: rec.ingredients || []
          };
        });
      }
    }

    return dayGroups;
  }, [cartItems, recipes, days]);

  // Calculate dynamic consumed protein from checked meals
  const { trackedConsumedProtein, completedCount, totalPlannedMealsCount } = useMemo(() => {
    let consumed = 0;
    let completed = 0;
    let totalMeals = 0;

    Object.entries(daywiseMealPlan).forEach(([day, meals]) => {
      meals.forEach((meal) => {
        totalMeals += 1;
        if (completedMeals[meal.id]) {
          consumed += meal.protein;
          completed += 1;
        }
      });
    });

    return {
      trackedConsumedProtein: consumed,
      completedCount: completed,
      totalPlannedMealsCount: totalMeals
    };
  }, [daywiseMealPlan, completedMeals]);

  // Toggle meal completion (Made & Eaten)
  const toggleMealComplete = (mealId, proteinAmount) => {
    const isNowComplete = !completedMeals[mealId];
    
    if (setCompletedMeals) {
      setCompletedMeals((prev) => ({
        ...prev,
        [mealId]: isNowComplete
      }));
    }

    if (isNowComplete) {
      // Gentle celebratory confetti
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.7 }
      });
    }
  };

  const planProteinTarget = minProteinPerDay * days;
  const progressPercent = Math.min(100, Math.round((trackedConsumedProtein / (planProteinTarget || 1)) * 100));

  // Mock daywise protein intake data for week
  const daywiseProteinWeek = [
    { day: 'Day 1', protein: trackedConsumedProtein > 0 ? Math.min(trackedConsumedProtein, minProteinPerDay) : 0, target: minProteinPerDay },
    { day: 'Day 2', protein: trackedConsumedProtein > minProteinPerDay ? Math.min(trackedConsumedProtein - minProteinPerDay, minProteinPerDay) : 0, target: minProteinPerDay },
    { day: 'Day 3', protein: trackedConsumedProtein > minProteinPerDay * 2 ? trackedConsumedProtein - minProteinPerDay * 2 : 0, target: minProteinPerDay }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Timeframe Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Meal Plan & Protein Tracker</h1>
          <p className="text-xs text-gray-500">
            Handy daily meal schedule based on your cart. Check off meals as you cook & eat to track live protein intake.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              timeframe === 'weekly' ? 'bg-[#84c225] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {days} Days Plan
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              timeframe === 'monthly' ? 'bg-[#84c225] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            30 Days Trend
          </button>
        </div>
      </div>

      {/* 2. Minimalist Infographic Live Protein Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left: Circular Infographic Gauge */}
        <div className="md:col-span-4 flex items-center space-x-4 border-r-0 md:border-r border-gray-100 pr-0 md:pr-4">
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#84c225] transition-all duration-700 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-gray-900 leading-none">{progressPercent}%</span>
              <span className="text-[9px] text-gray-400 font-semibold uppercase">Protein Met</span>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-1 text-[#84c225] font-bold text-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>Live Consumed</span>
            </div>
            <div className="text-xl font-extrabold text-gray-900">
              {trackedConsumedProtein}g <span className="text-xs text-gray-400 font-normal">/ {planProteinTarget}g Target</span>
            </div>
            <p className="text-[10.5px] text-gray-500">
              {completedCount} of {totalPlannedMealsCount} meals checked as made & eaten
            </p>
          </div>
        </div>

        {/* Center: Infographic Daily Milestone Pills */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800">Daily Intake Achievements</span>
            <span className="text-[10px] text-gray-400">Target: {minProteinPerDay}g/day</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: days }, (_, i) => {
              const dayNum = i + 1;
              const mealsForDay = daywiseMealPlan[dayNum] || [];
              const dayConsumedProtein = mealsForDay.reduce(
                (sum, m) => sum + (completedMeals[m.id] ? m.protein : 0),
                0
              );
              const isGoalAchieved = dayConsumedProtein >= minProteinPerDay;
              const dayPct = Math.min(100, Math.round((dayConsumedProtein / minProteinPerDay) * 100));

              return (
                <div
                  key={`day-pill-${dayNum}`}
                  className={`p-2.5 rounded-xl border text-center space-y-1 transition-all ${
                    isGoalAchieved
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs'
                      : 'bg-gray-50/80 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 text-[11px] font-bold">
                    <span>Day {dayNum}</span>
                    {isGoalAchieved && <CheckCircle2 className="w-3 h-3 text-[#84c225]" />}
                  </div>
                  <div className="text-xs font-black text-gray-900">
                    {dayConsumedProtein}g
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#84c225] h-full rounded-full transition-all duration-500"
                      style={{ width: `${dayPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Action Banner */}
        <div className="md:col-span-3 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1.5 flex flex-col justify-between h-full">
          <div className="flex items-center space-x-1.5 font-bold text-gray-900 text-[11px]">
            <Utensils className="w-3.5 h-3.5 text-[#84c225]" />
            <span>Interactive Tracking</span>
          </div>
          <p className="text-[10.5px] text-gray-500 leading-tight">
            Click any meal card below when you prepare it to mark it <strong>Made & Had</strong> and update your daily protein.
          </p>
          {cartItems.length === 0 && (
            <button
              onClick={onNavigateToShop}
              className="text-[10.5px] font-bold text-[#84c225] hover:underline flex items-center space-x-1 cursor-pointer pt-1"
            >
              <span>Add more meals from Shop</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

      {/* 3. Infographic Meal Schedule (Minimalist Daywise Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#84c225]" />
            <h2 className="font-bold text-gray-900 text-sm">Schedule: What to Cook & When</h2>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            {cartItems.length > 0 ? '✓ Synced with your Bought Cart' : 'Planned Template (Ready to Cook)'}
          </span>
        </div>

        {/* Day-by-Day Infographic Lanes */}
        <div className="space-y-4">
          {Array.from({ length: days }, (_, i) => {
            const dayNum = i + 1;
            const meals = daywiseMealPlan[dayNum] || [];
            const dayConsumed = meals.reduce(
              (sum, m) => sum + (completedMeals[m.id] ? m.protein : 0),
              0
            );

            return (
              <div
                key={`lane-day-${dayNum}`}
                className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 shadow-2xs hover:border-gray-300 transition-colors"
              >
                {/* Lane Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="bg-gray-900 text-white text-xs font-black px-2.5 py-0.5 rounded-lg tracking-wider">
                      DAY {dayNum}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {meals.length} Meals Scheduled
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-400 text-[11px]">Day Protein:</span>
                    <span className={`font-bold text-xs ${dayConsumed >= minProteinPerDay ? 'text-[#689f38]' : 'text-gray-800'}`}>
                      {dayConsumed}g / {minProteinPerDay}g
                    </span>
                    {dayConsumed >= minProteinPerDay && (
                      <span className="bg-emerald-50 text-[#689f38] text-[9.5px] font-bold px-1.5 py-0.2 rounded border border-emerald-100">
                        Target Hit!
                      </span>
                    )}
                  </div>
                </div>

                {/* Meals 3-Column Minimalist Infographic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {meals.map((meal, mIdx) => {
                    const isDone = !!completedMeals[meal.id];
                    const mealLabel = mIdx === 0 ? 'Breakfast' : mIdx === 1 ? 'Lunch' : 'Dinner';

                    return (
                      <div
                        key={meal.id}
                        onClick={() => toggleMealComplete(meal.id, meal.protein)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                          isDone
                            ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200 shadow-2xs'
                            : 'bg-gray-50/50 hover:bg-white border-gray-200 hover:border-gray-300 shadow-2xs'
                        }`}
                      >
                        {/* Top: Thumbnail, Slot Tag, Cook Time */}
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={meal.image}
                            alt={meal.recipeName}
                            className={`w-11 h-11 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0 transition-opacity ${
                              isDone ? 'opacity-80' : 'opacity-100'
                            }`}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400">
                                {mealLabel}
                              </span>
                              <span className="text-[9.5px] text-gray-400 flex items-center space-x-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{meal.cookTime}m</span>
                              </span>
                            </div>

                            <h3 className={`font-bold text-xs truncate mt-0.5 ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {meal.recipeName}
                            </h3>
                          </div>
                        </div>

                        {/* Middle: Protein & Specs */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100/80">
                          <span className={`font-extrabold ${isDone ? 'text-[#689f38]' : 'text-gray-900'}`}>
                            +{meal.protein}g Protein
                          </span>

                          <span className="text-[10px] text-gray-400">
                            {meal.ingredients.length > 0 ? `${meal.ingredients.length} items` : '1 portion'}
                          </span>
                        </div>

                        {/* Bottom: Interactive "Made & Eaten" Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMealComplete(meal.id, meal.protein);
                          }}
                          className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                            isDone
                              ? 'bg-[#84c225] text-white shadow-2xs'
                              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>Made & Had (+{meal.protein}g)</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#84c225]" />
                              <span>Mark Made & Eaten</span>
                            </>
                          )}
                        </button>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Weekly Challenges & BB Cash Rewards */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#84c225]" />
            <h2 className="font-bold text-gray-900 text-sm">Active Challenges & BB Cash Rewards</h2>
          </div>
          <div className="flex items-center space-x-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs">
            <span className="font-extrabold text-[#689f38]">450 BB Cash Points</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Challenge 1 */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800">🎯 Budget Master</span>
              <span className="font-bold text-[#84c225]">+150 pts</span>
            </div>
            <p className="text-[11px] text-gray-500">Stay under ₹{budgetTarget} weekly budget allowance</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#84c225] rounded-full w-[85%]"></div>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold block text-right">85% Completed</span>
          </div>

          {/* Challenge 2 */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800">💪 Protein Powerhouse</span>
              <span className="font-bold text-[#84c225]">+200 pts</span>
            </div>
            <p className="text-[11px] text-gray-500">Hit &gt;{minProteinPerDay}g protein/day goal</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#84c225] rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="text-[10px] text-[#689f38] font-bold block text-right flex items-center justify-end space-x-1">
              {progressPercent >= 100 ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Goal Achieved!</span>
                </>
              ) : (
                <span>{progressPercent}% Tracked</span>
              )}
            </span>
          </div>

          {/* Challenge 3 */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800">🌿 Zero Food Waste Warrior</span>
              <span className="font-bold text-[#84c225]">+100 pts</span>
            </div>
            <p className="text-[11px] text-gray-500">Cook planned meals without spoilage</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#84c225] rounded-full" style={{ width: `${Math.min(100, Math.round((completedCount / (totalPlannedMealsCount || 1)) * 100))}%` }}></div>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold block text-right">{completedCount}/{totalPlannedMealsCount} Cooked</span>
          </div>

        </div>
      </div>

    </div>
  );
}
