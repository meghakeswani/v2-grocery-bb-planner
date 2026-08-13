import React from 'react';
import { TrendingDown, Sparkles } from 'lucide-react';

export default function StatRings({ cartTotalValue, budgetTarget, cartTotalProtein, proteinTarget }) {
  // Budget percentage based ONLY on selected meals added to cart
  const budgetPercent = Math.min(100, Math.round((cartTotalValue / (budgetTarget || 1)) * 100));
  const isOverBudget = cartTotalValue > budgetTarget;

  // Protein percentage based ONLY on selected meals added to cart
  const proteinPercent = Math.min(100, Math.round((cartTotalProtein / (proteinTarget || 1)) * 100));

  // SVG parameters
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  
  const budgetDashoffset = circumference - (budgetPercent / 100) * circumference;
  const proteinDashoffset = circumference - (proteinPercent / 100) * circumference;

  const budgetLeft = budgetTarget - cartTotalValue;
  const proteinLeft = Math.max(0, proteinTarget - cartTotalProtein);

  // Economic comparison: typical outside restaurant / delivery portion (₹220) vs BB Daily home-portion (₹45)
  const homePortionAvg = 45;
  const deliveryPortionAvg = 220;
  const estimatedSavingsPercent = Math.round(((deliveryPortionAvg - homePortionAvg) / deliveryPortionAvg) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-2xs flex items-center justify-between h-full min-h-[135px]">
      
      {/* 1. Budget Circular Ring */}
      <div className="flex flex-col items-center justify-center space-y-1 flex-1">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
            <circle
              cx="35"
              cy="35"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="5.5"
              fill="transparent"
            />
            <circle
              cx="35"
              cy="35"
              r={radius}
              className={`transition-all duration-500 ease-out ${
                isOverBudget ? 'stroke-red-500' : 'stroke-[#84c225]'
              }`}
              strokeWidth="5.5"
              strokeDasharray={circumference}
              strokeDashoffset={budgetDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-gray-800">Budget</span>
            <span className="text-[9px] text-gray-500 font-medium">
              {budgetLeft < 0 ? `-₹${Math.abs(budgetLeft)}` : `₹${budgetLeft}`}
            </span>
          </div>
        </div>
        <span className="text-[9.5px] text-gray-400 font-medium">
          {budgetPercent}% of ₹{budgetTarget}
        </span>
      </div>

      {/* Divider */}
      <div className="w-[1px] h-12 bg-gray-100"></div>

      {/* 2. Protein Circular Ring */}
      <div className="flex flex-col items-center justify-center space-y-1 flex-1">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
            <circle
              cx="35"
              cy="35"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="5.5"
              fill="transparent"
            />
            <circle
              cx="35"
              cy="35"
              r={radius}
              className="stroke-[#84c225] transition-all duration-500 ease-out"
              strokeWidth="5.5"
              strokeDasharray={circumference}
              strokeDashoffset={proteinDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-gray-800">Protein</span>
            <span className="text-[9px] text-gray-500 font-medium">{proteinLeft}g left</span>
          </div>
        </div>
        <span className="text-[9.5px] text-gray-400 font-medium">
          {proteinPercent}% of {proteinTarget}g
        </span>
      </div>

      {/* Divider */}
      <div className="w-[1px] h-12 bg-gray-100"></div>

      {/* 3. Economic Cost vs Dining Out Comparison */}
      <div className="flex flex-col items-center justify-center space-y-1 flex-1 text-center px-1">
        <div className="flex items-center space-x-1 text-[#689f38] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <TrendingDown className="w-3 h-3" />
          <span className="text-[10px] font-extrabold">{estimatedSavingsPercent}% Saved</span>
        </div>
        <div className="text-[11px] font-bold text-gray-800">
          ₹{homePortionAvg} <span className="text-[9.5px] text-gray-400 font-normal">vs ₹{deliveryPortionAvg}</span>
        </div>
        <span className="text-[9.5px] text-gray-400 font-medium">
          vs Dining Out
        </span>
      </div>

    </div>
  );
}
