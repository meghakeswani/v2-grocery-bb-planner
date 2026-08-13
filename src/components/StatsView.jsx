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
  Flame,
  Utensils,
  ChevronRight
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
  const [selectedDayTab, setSelectedDayTab] = useState(1); // Day tab for compact meal schedule

  // Derive the active meal plan from cartItems, or fallback to first recipes for configured days
  const daywiseMealPlan = useMemo(() => {
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

    // If any day has no bought meals yet, populate from recipes plan
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
      confetti({
        particleCount: 35,
        spread: 40,
        origin: { y: 0.7 }
      });
    }
  };

  const planProteinTarget = minProteinPerDay * days;
  const progressPercent = Math.min(100, Math.round((trackedConsumedProtein / (planProteinTarget || 1)) * 100));

  // Daywise protein data for the bar chart
  const daywiseProteinWeek = useMemo(() => {
    return [
      { day: 'Mon', protein: 55, target: 50 },
      { day: 'Tue', protein: 62, target: 50 },
      { day: 'Wed', protein: 48, target: 50 },
      { day: 'Thu', protein: 70, target: 50 },
      { day: 'Fri', protein: 65, target: 50 },
      { day: 'Sat', protein: 80, target: 50 },
      { day: 'Sun', protein: 58, target: 50 }
    ];
  }, []);

  // Top common household dishes
  const topDishes = [
    { name: 'Dal Tadka', count: 14, percent: 85, protein: '24g' },
    { name: 'Palak Paneer', count: 11, percent: 70, protein: '22g' },
    { name: 'Chana Masala', count: 9, percent: 55, protein: '28g' },
    { name: 'Poha', count: 8, percent: 50, protein: '14g' },
    { name: 'Rajma Curry', count: 7, percent: 45, protein: '22g' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-in fade-in duration-300">
      
      {/* 1. Header & Timeframe Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Household Intelligence & Nutrition Stats</h1>
          <p className="text-xs text-gray-500">Live meal schedule, protein tracking, budget trends, and household analytics</p>
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              timeframe === 'weekly' ? 'bg-[#84c225] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              timeframe === 'monthly' ? 'bg-[#84c225] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* 2. Compact Infographic Live Meal & Protein Tracker */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
        
        {/* Top Info Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#84c225]" />
            <h2 className="font-bold text-gray-900 text-xs">Interactive Meal Plan & Live Protein Tracker</h2>
            <span className="text-[10px] text-gray-400 font-medium">
              (Click any meal to mark as Made & Had)
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 font-bold">
              <Flame className="w-3.5 h-3.5 text-[#84c225]" />
              <span className="text-gray-900">{trackedConsumedProtein}g</span>
              <span className="text-gray-400 font-normal">/ {planProteinTarget}g Target ({progressPercent}%)</span>
            </div>
            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="bg-[#84c225] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Compact Daywise Infographic Meal Chips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: days }, (_, i) => {
            const dayNum = i + 1;
            const meals = daywiseMealPlan[dayNum] || [];
            const dayConsumed = meals.reduce(
              (sum, m) => sum + (completedMeals[m.id] ? m.protein : 0),
              0
            );
            const isDayGoalMet = dayConsumed >= minProteinPerDay;

            return (
              <div
                key={`compact-day-${dayNum}`}
                className="bg-gray-50/70 border border-gray-200 rounded-xl p-2.5 space-y-2"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-[11px] text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
                      DAY {dayNum}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500">
                      {dayConsumed}g / {minProteinPerDay}g
                    </span>
                  </div>

                  {isDayGoalMet ? (
                    <span className="bg-emerald-100 text-[#689f38] text-[9.5px] font-extrabold px-1.5 py-0.2 rounded flex items-center space-x-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Hit!</span>
                    </span>
                  ) : (
                    <span className="text-[9.5px] text-gray-400">
                      {meals.filter((m) => completedMeals[m.id]).length}/{meals.length} Had
                    </span>
                  )}
                </div>

                {/* Compact Interactive Meal Chips */}
                <div className="space-y-1.5">
                  {meals.map((meal, mIdx) => {
                    const isDone = !!completedMeals[meal.id];
                    const mealType = mIdx === 0 ? 'Breakfast' : mIdx === 1 ? 'Lunch' : 'Dinner';

                    return (
                      <div
                        key={meal.id}
                        onClick={() => toggleMealComplete(meal.id, meal.protein)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isDone
                            ? 'bg-white border-emerald-300 ring-1 ring-emerald-100 text-gray-900 shadow-2xs'
                            : 'bg-white hover:bg-gray-100/60 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <img
                            src={meal.image}
                            alt={meal.recipeName}
                            className="w-7 h-7 rounded-md object-cover bg-gray-50 border border-gray-100 shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80';
                            }}
                          />
                          <div className="min-w-0">
                            <p className={`font-bold text-[11px] truncate ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {meal.recipeName}
                            </p>
                            <p className="text-[9px] text-gray-400">
                              {mealType} • {meal.cookTime}m
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className={`text-[10px] font-bold ${isDone ? 'text-[#689f38]' : 'text-gray-600'}`}>
                            +{meal.protein}g
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#84c225]" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-gray-300 hover:text-[#84c225]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. Analytics Charts Grid: Daywise Protein Chart + Common Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Daywise Protein Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
              <BarChart2 className="w-4 h-4 text-[#84c225]" />
              <span>Daywise Protein Intake ({timeframe === 'weekly' ? 'This Week' : 'This Month'})</span>
            </h3>
            <span className="text-[10px] text-gray-400">Target: {minProteinPerDay}g/day</span>
          </div>

          <div className="h-40 flex items-end justify-between pt-3 px-2">
            {daywiseProteinWeek.map((item) => {
              const heightPercent = Math.min(100, (item.protein / 90) * 100);
              return (
                <div key={item.day} className="flex flex-col items-center space-y-1.5 flex-1">
                  <span className="text-[9.5px] font-bold text-gray-700">{item.protein}g</span>
                  <div className="w-5 bg-gray-100 rounded-t-md h-28 flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-[#84c225] rounded-t-md transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[9.5px] text-gray-500 font-semibold">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Common Household Dishes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-xs">Most Common Household Dishes</h3>
            <span className="text-[10px] text-gray-400">Last 30 Days</span>
          </div>

          <div className="space-y-2.5">
            {topDishes.map((dish) => (
              <div key={dish.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-gray-800 text-[10.5px]">
                  <span>{dish.name} ({dish.protein} Protein)</span>
                  <span className="text-gray-500">{dish.count} orders</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#84c225] rounded-full transition-all duration-500"
                    style={{ width: `${dish.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Active Challenges & BB Cash Rewards Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-[#84c225]" />
            <h2 className="font-bold text-gray-900 text-xs">Active Challenges & BB Cash Rewards</h2>
          </div>
          <div className="flex items-center space-x-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
            <span className="font-extrabold text-[#689f38] text-[11px]">450 BB Cash Points</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Challenge 1 */}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800 text-[11px]">🎯 Budget Master</span>
              <span className="font-bold text-[#84c225] text-[11px]">+150 pts</span>
            </div>
            <p className="text-[10px] text-gray-500">Stay under ₹{budgetTarget} weekly allowance</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#84c225] rounded-full w-[85%]"></div>
            </div>
            <span className="text-[9.5px] text-gray-400 font-semibold block text-right">85% Completed</span>
          </div>

          {/* Challenge 2 */}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800 text-[11px]">💪 Protein Powerhouse</span>
              <span className="font-bold text-[#84c225] text-[11px]">+200 pts</span>
            </div>
            <p className="text-[10px] text-gray-500">Hit &gt;{minProteinPerDay}g protein/day goal</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#84c225] rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="text-[9.5px] text-[#689f38] font-bold block text-right">
              {progressPercent >= 100 ? '✓ Goal Achieved!' : `${progressPercent}% Tracked`}
            </span>
          </div>

          {/* Challenge 3 */}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800 text-[11px]">🌿 Zero Food Waste</span>
              <span className="font-bold text-[#84c225] text-[11px]">+100 pts</span>
            </div>
            <p className="text-[10px] text-gray-500">Cook planned meals without spoilage</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#84c225] rounded-full"
                style={{ width: `${Math.min(100, Math.round((completedCount / (totalPlannedMealsCount || 1)) * 100))}%` }}
              ></div>
            </div>
            <span className="text-[9.5px] text-gray-400 font-semibold block text-right">
              {completedCount}/{totalPlannedMealsCount} Cooked
            </span>
          </div>
        </div>
      </div>

      {/* 5. Strategic AI Household Recommendation Insights */}
      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
        <div className="flex items-center space-x-1.5 font-bold text-gray-900 text-xs">
          <Sparkles className="w-4 h-4 text-[#84c225]" />
          <span>Strategic Household Recommendations</span>
        </div>
        <p className="text-gray-600 leading-relaxed text-[11px]">
          • Cooking planned high-protein dishes on scheduled days delivers <strong>+{minProteinPerDay}g</strong> daily nutrition without meal repetition.
          <br />
          • Utilizing existing pantry ingredients saves an estimated <strong>₹140</strong> per week in household grocery budget.
        </p>
      </div>

    </div>
  );
}
