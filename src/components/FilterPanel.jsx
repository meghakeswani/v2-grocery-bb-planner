export default function FilterPanel({
  budget, setBudget,
  numDays, setNumDays,
  minProtein, setMinProtein,
  sortBy, setSortBy,
}) {
  const sortOptions = [
    { value: 'max_offer', label: 'Max Offer' },
    { value: 'lowest_price', label: 'Lowest Price' },
    { value: 'highest_price', label: 'Highest Price' },
    { value: 'popular', label: 'Popular' },
    { value: 'new', label: 'New' },
  ];

  return (
    <div className="p-5 space-y-7">
      {/* Header */}
      <h2 className="text-xs font-semibold text-bb-text-dim uppercase tracking-widest">Filters</h2>

      {/* Budget */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-bb-text">Budget</span>
          <span className="text-[13px] font-semibold text-bb-green">₹{budget.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="500"
          max="10000"
          step="100"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-bb-text-dim">
          <span>₹500</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Days */}
      <div className="space-y-2.5">
        <span className="text-[13px] font-medium text-bb-text">No. of Days</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNumDays(Math.max(1, numDays - 1))}
            className="w-8 h-8 rounded-md border border-bb-border flex items-center justify-center text-bb-text-secondary hover:border-bb-green transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center text-lg font-bold text-bb-text">{numDays}</span>
          <button
            onClick={() => setNumDays(Math.min(7, numDays + 1))}
            className="w-8 h-8 rounded-md border border-bb-border flex items-center justify-center text-bb-text-secondary hover:border-bb-green transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Protein */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-bb-text">Min Protein / Day</span>
          <span className="text-[13px] font-semibold text-bb-orange">{minProtein}g</span>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={minProtein}
          onChange={(e) => setMinProtein(Number(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-bb-text-dim">
          <span>10g</span>
          <span>200g</span>
        </div>
      </div>

      <hr className="border-bb-border" />

      {/* Sort */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-bb-text-dim uppercase tracking-widest">Sort</h2>
        <div className="space-y-1">
          {sortOptions.map(opt => (
            <label
              key={opt.value}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer text-[13px] transition-colors ${
                sortBy === opt.value
                  ? 'text-bb-green bg-bb-green-lighter font-medium'
                  : 'text-bb-text-secondary hover:bg-gray-50'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center ${
                sortBy === opt.value ? 'border-bb-green' : 'border-gray-300'
              }`}>
                {sortBy === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-bb-green" />}
              </div>
              {opt.label}
              <input type="radio" name="sort" value={opt.value} checked={sortBy === opt.value} onChange={() => setSortBy(opt.value)} className="hidden" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
