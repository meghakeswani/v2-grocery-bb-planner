export default function Cart({ items, totals, onRemoveItem, onClearCart, selectedRecipes }) {
  // Group items by recipe
  const groupedItems = {};
  items.forEach((item, idx) => {
    const key = item.RecipeSuggestion;
    if (!groupedItems[key]) {
      groupedItems[key] = [];
    }
    groupedItems[key].push({ ...item, originalIndex: idx });
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Cart Header */}
      <div className="p-4 border-b border-bb-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cart Materials</h3>
            {items.length > 0 && (
              <span className="bg-bb-green-lighter text-bb-green text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {items.length} items
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Showing up to 5 key essential materials per selected meal</p>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
              <span className="text-gray-300 text-xl">🛒</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Cart is empty</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Select a meal plan to move top key materials here</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([recipeName, recipeItems]) => (
            <div key={recipeName} className="space-y-2">
              {/* Recipe Title & Count */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-bb-green uppercase tracking-wider pt-1">
                <span>{recipeName}</span>
                <span className="text-[10px] font-normal text-gray-400 font-sans lowercase">({recipeItems.length} essential items)</span>
              </div>

              {/* Individual Ingredients with Pricing */}
              <div className="space-y-1.5">
                {recipeItems.map((item) => (
                  <div
                    key={item.originalIndex}
                    className="flex items-center gap-3 p-2 rounded-md border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors group"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-10 h-10 rounded bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src={item.Image_Url}
                        alt={item.ProductName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate leading-tight">
                        {item.ProductName}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.Quantity}</p>
                    </div>

                    {/* Product Pricing */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-semibold text-gray-900">₹{item.DiscountPrice}</div>
                      {item.Price !== item.DiscountPrice && (
                        <div className="text-[10px] text-gray-400 line-through">₹{item.Price}</div>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveItem(item.originalIndex)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary / Totals */}
      {items.length > 0 && (
        <div className="border-t border-bb-border p-4 space-y-3 bg-white">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal ({items.length} items)</span>
              <span>₹{Math.round(totals.totalOriginalPrice).toLocaleString()}</span>
            </div>
            {totals.savings > 0 && (
              <div className="flex justify-between text-bb-green">
                <span>Discount</span>
                <span>- ₹{Math.round(totals.savings).toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold text-gray-900">
              <span>Total Price</span>
              <span className="text-bb-green">₹{Math.round(totals.totalPrice).toLocaleString()}</span>
            </div>
          </div>

          <button className="w-full py-2.5 rounded-md bg-bb-green text-white font-medium text-xs hover:bg-bb-green-dark transition-colors shadow-xs">
            Checkout on BigBasket
          </button>
        </div>
      )}
    </div>
  );
}
