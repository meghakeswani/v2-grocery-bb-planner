import React, { useState } from 'react';
import { Award, TrendingUp, BarChart2, Calendar, ShieldCheck, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function StatsView({ cartTotalValue, budgetTarget, cartTotalProtein, proteinTarget, totalSavings }) {
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' | 'monthly'

  // Mock daywise protein intake data for week
  const daywiseProteinWeek = [
    { day: 'Mon', protein: 55, target: 50 },
    { day: 'Tue', protein: 62, target: 50 },
    { day: 'Wed', protein: 48, target: 50 },
    { day: 'Thu', protein: 70, target: 50 },
    { day: 'Fri', protein: 65, target: 50 },
    { day: 'Sat', protein: 80, target: 50 },
    { day: 'Sun', protein: 58, target: 50 }
  ];

  // Top common household dishes
  const topDishes = [
    { name: 'Dal Tadka', count: 14, percent: 85, protein: '24g' },
    { name: 'Palak Paneer', count: 11, percent: 70, protein: '22g' },
    { name: 'Chana Masala', count: 9, percent: 55, protein: '28g' },
    { name: 'Poha', count: 8, percent: 50, protein: '14g' },
    { name: 'Rajma Curry', count: 7, percent: 45, protein: '22g' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Timeframe Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Household Intelligence & Analytics</h1>
          <p className="text-xs text-gray-500">Historical nutrition telemetry, budget trends, and strategic meal insights</p>
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

      {/* 1. Weekly Challenges & BB Cash Rewards Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-2xs">
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
            <p className="text-[11px] text-gray-500">Stay under ₹3,000 weekly budget allowance</p>
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
            <p className="text-[11px] text-gray-500">Hit &gt;50g protein/day goal for 5 days</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#84c225] rounded-full w-[100%]"></div>
            </div>
            <span className="text-[10px] text-[#689f38] font-bold block text-right flex items-center justify-end space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Goal Achieved!</span>
            </span>
          </div>

          {/* Challenge 3 */}
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-gray-800">🌿 Zero Food Waste Warrior</span>
              <span className="font-bold text-[#84c225]">+100 pts</span>
            </div>
            <p className="text-[11px] text-gray-500">Use 3 pantry items before expiry</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#84c225] rounded-full w-[66%]"></div>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold block text-right">2/3 Pantry Items Used</span>
          </div>

        </div>
      </div>

      {/* 2. Visualizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daywise Protein Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-xs flex items-center space-x-1.5">
              <BarChart2 className="w-4 h-4 text-[#84c225]" />
              <span>Daywise Protein Intake ({timeframe === 'weekly' ? 'This Week' : 'This Month'})</span>
            </h3>
            <span className="text-[10px] text-gray-400">Target: 50g/day</span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-44 flex items-end justify-between pt-4 px-2">
            {daywiseProteinWeek.map((item) => {
              const heightPercent = Math.min(100, (item.protein / 90) * 100);
              return (
                <div key={item.day} className="flex flex-col items-center space-y-1.5 flex-1">
                  <span className="text-[10px] font-bold text-gray-700">{item.protein}g</span>
                  <div className="w-6 bg-gray-100 rounded-t-md h-32 flex items-end justify-center overflow-hidden">
                    <div
                      className="w-full bg-[#84c225] rounded-t-md transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-semibold">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Common Household Dishes */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-xs">Most Common Household Dishes</h3>
            <span className="text-[10px] text-gray-400">Last 30 Days</span>
          </div>

          <div className="space-y-3">
            {topDishes.map((dish) => (
              <div key={dish.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-gray-800 text-[11px]">
                  <span>{dish.name} ({dish.protein} Protein)</span>
                  <span className="text-gray-500">{dish.count} orders</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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

      {/* 3. AI Strategic Recommendation Insights for Shop Tab */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
        <div className="flex items-center space-x-1.5 font-bold text-gray-900">
          <Sparkles className="w-4 h-4 text-[#84c225]" />
          <span>Strategic Household Recommendations for Shop Tab</span>
        </div>
        <p className="text-gray-600 leading-relaxed">
          • Ordering <strong>Chana Masala</strong> on Wednesdays boosts your weekly protein intake by <strong>28g</strong> while keeping basket costs low.
          <br />
          • Utilizing pantry spinach & tomatoes saves an estimated <strong>₹140</strong> per week in grocery spending.
        </p>
      </div>

    </div>
  );
}
