import ProgressRing from './ProgressRing';

export default function Dashboard({ pantryItems = [], budget = 2000, cartTotal = 0, minProtein = 75, cartProtein = 0 }) {
  const safePantry = Array.isArray(pantryItems) ? pantryItems : [];
  const budgetPercent = budget > 0 ? Math.min((cartTotal / budget) * 100, 100) : 0;
  const proteinPercent = minProtein > 0 ? Math.min((cartProtein / minProtein) * 100, 100) : 0;

  return (
    <div className="px-6 pt-5 pb-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Pantry Widget */}
        <div className="bg-white rounded-lg border border-bb-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Pantry</h3>
            <span className="text-[10px] text-gray-400">{safePantry.length} items</span>
          </div>
          <div className="space-y-2">
            {safePantry.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-2 rounded bg-gray-50 text-xs border border-gray-100"
              >
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-400 ml-1">({item.qty})</span>
                </div>
                <span className={`text-[10px] font-semibold ${
                  item.daysLeft <= 2 ? 'text-amber-600' : 'text-bb-green'
                }`}>
                  {item.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Progress (Calculated ONLY from selected meals) */}
        <div className="bg-white rounded-lg border border-bb-border p-4 flex flex-col items-center justify-center">
          <ProgressRing
            percent={budgetPercent}
            size={100}
            strokeWidth={7}
            color="#0a8a2e"
            bgColor="#f0f0f0"
          />
          <div className="text-center mt-2.5">
            <p className="text-xs text-gray-500 font-medium">Selected Meals Budget</p>
            <p className="text-sm font-bold text-gray-900">
              ₹{Math.round(cartTotal).toLocaleString()}
              <span className="text-xs font-normal text-gray-400"> / ₹{budget.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Protein Progress (Calculated ONLY from selected meals) */}
        <div className="bg-white rounded-lg border border-bb-border p-4 flex flex-col items-center justify-center">
          <ProgressRing
            percent={proteinPercent}
            size={100}
            strokeWidth={7}
            color="#e97a1f"
            bgColor="#f0f0f0"
          />
          <div className="text-center mt-2.5">
            <p className="text-xs text-gray-500 font-medium">Selected Meals Protein</p>
            <p className="text-sm font-bold text-gray-900">
              {cartProtein}g
              <span className="text-xs font-normal text-gray-400"> / {minProtein}g</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
