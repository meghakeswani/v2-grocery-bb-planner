import React, { useState } from 'react';
import { Sliders, ArrowUpDown, Plus, Minus, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  budget,
  setBudget,
  days,
  setDays,
  minProtein,
  setMinProtein,
  sortBy,
  setSortBy,
  resetFilters,
  timeConstraint,
  setTimeConstraint,
  numPeople,
  setNumPeople,
  usePantryFirst,
  setUsePantryFirst
}) {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-xl border border-gray-100 p-4 space-y-5">
      
      {/* Top Title & Reset */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-1.5 text-gray-900 font-bold text-xs">
          <Sliders className="w-4 h-4 text-[#84c225]" />
          <span>Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Filter Options matching sketch */}
      {/* Filter Options grouped logically: Steppers together, then Sliders together */}
      <div className="space-y-4 text-xs">
        
        {/* 1. STEPPERS GROUP: Days & People */}
        <div className="space-y-3 pb-3 border-b border-gray-100">
          
          {/* No. of Days Stepper */}
          <div className="flex justify-between items-center text-gray-700 font-semibold">
            <span>• No. of days</span>
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5">
              <button
                onClick={() => setDays(Math.max(1, days - 1))}
                className="text-gray-500 hover:text-gray-900 font-bold cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-gray-900 px-1 text-xs">{days}</span>
              <button
                onClick={() => setDays(Math.min(7, days + 1))}
                className="text-gray-500 hover:text-gray-900 font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Number of People */}
          <div className="flex justify-between items-center text-gray-700 font-semibold">
            <span>• No. of people</span>
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-0.5">
              <button
                onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                className="text-gray-500 hover:text-gray-900 font-bold cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-gray-900 px-1 text-xs">{numPeople}</span>
              <button
                onClick={() => setNumPeople(numPeople + 1)}
                className="text-gray-500 hover:text-gray-900 font-bold cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* 2. SLIDERS GROUP: Budget & Protein */}
        <div className="space-y-3 pb-3 border-b border-gray-100">
          
          {/* Budget */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-gray-700 font-semibold">
              <span>• Budget</span>
              <span className="font-bold text-gray-900">₹{budget}</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={250}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#84c225] cursor-pointer h-1.5 bg-gray-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>₹500</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Min Protein / Day */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-gray-700 font-semibold">
              <span>• Min protein/day</span>
              <span className="font-bold text-gray-900">{minProtein}g</span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={minProtein}
              onChange={(e) => setMinProtein(Number(e.target.value))}
              className="w-full accent-[#84c225] cursor-pointer h-1.5 bg-gray-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>20g</span>
              <span>150g</span>
            </div>
          </div>

        </div>

        {/* 3. TIME & PANTRY SETTINGS */}
        <div className="space-y-2.5">
          {/* Time Constraint */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-gray-700 font-semibold">
              <span>• Time</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-600 font-medium">
              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-gray-900">
                <input
                  type="radio"
                  name="timeConstraint"
                  checked={timeConstraint === 'Easy cook'}
                  onChange={() => setTimeConstraint('Easy cook')}
                  className="accent-[#84c225] w-3.5 h-3.5 cursor-pointer"
                />
                <span>Easy cook</span>
              </label>
              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-gray-900">
                <input
                  type="radio"
                  name="timeConstraint"
                  checked={timeConstraint === 'Flexible'}
                  onChange={() => setTimeConstraint('Flexible')}
                  className="accent-[#84c225] w-3.5 h-3.5 cursor-pointer"
                />
                <span>Flexible</span>
              </label>
            </div>
          </div>

          {/* Use Pantry First */}
          <div className="pt-1">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-700 font-semibold">
              <input
                type="checkbox"
                checked={usePantryFirst}
                onChange={(e) => setUsePantryFirst(e.target.checked)}
                className="accent-[#84c225] w-4 h-4 cursor-pointer rounded"
              />
              <span>Use pantry first</span>
            </label>
          </div>
        </div>

      </div>

      {/* Sort Options matching sketch */}
      <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
        <div className="flex items-center space-x-1.5 text-gray-900 font-bold text-xs pb-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#84c225]" />
          <span>Sort</span>
        </div>

        {[
          { id: 'maxOffer', label: 'Max offer' },
          { id: 'lowestPrice', label: 'Lowest price' },
          { id: 'highestPrice', label: 'Highest price' },
          { id: 'popular', label: 'Popular' },
          { id: 'new', label: 'New' }
        ].map((opt) => (
          <label
            key={opt.id}
            className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50 cursor-pointer text-gray-600 font-medium transition-colors"
          >
            <input
              type="radio"
              name="sortOption"
              checked={sortBy === opt.id}
              onChange={() => setSortBy(opt.id)}
              className="accent-[#84c225] w-3.5 h-3.5 cursor-pointer"
            />
            <span className={sortBy === opt.id ? 'font-bold text-gray-900' : ''}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>

    </aside>
  );
}
