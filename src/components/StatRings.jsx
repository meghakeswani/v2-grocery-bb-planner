import React from 'react';

export default function StatRings({ cartTotalValue, budgetTarget, cartTotalProtein, proteinTarget }) {
  // Budget percentage based ONLY on selected meals added to cart
  const budgetPercent = Math.min(100, Math.round((cartTotalValue / (budgetTarget || 1)) * 100));
  const isOverBudget = cartTotalValue > budgetTarget;

  // Protein percentage based ONLY on selected meals added to cart
  const proteinPercent = Math.min(100, Math.round((cartTotalProtein / (proteinTarget || 1)) * 100));

  // SVG parameters
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  
  const budgetDashoffset = circumference - (budgetPercent / 100) * circumference;
  const proteinDashoffset = circumference - (proteinPercent / 100) * circumference;

  const budgetLeft = budgetTarget - cartTotalValue;
  const proteinLeft = Math.max(0, proteinTarget - cartTotalProtein);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-2xs flex items-center justify-around h-full min-h-[140px]">
      
      {/* Budget Circular Ring matching sketch */}
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              className={`transition-all duration-500 ease-out ${
                isOverBudget ? 'stroke-red-500' : 'stroke-[#84c225]'
              }`}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={budgetDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-gray-800">Budget</span>
            <span className="text-[10px] text-gray-500 font-medium">
              {budgetLeft < 0 ? `-₹${Math.abs(budgetLeft)}` : `₹${budgetLeft}`}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {budgetPercent}% of ₹{budgetTarget}
        </span>
      </div>

      {/* Divider */}
      <div className="w-[1px] h-14 bg-gray-100"></div>

      {/* Protein Circular Ring matching sketch */}
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-[#84c225] transition-all duration-500 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={proteinDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-gray-800">Protein</span>
            <span className="text-[10px] text-gray-500 font-medium">{proteinLeft}g</span>
          </div>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {proteinPercent}% of {proteinTarget}g
        </span>
      </div>

    </div>
  );
}
