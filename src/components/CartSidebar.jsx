import React, { useState, useMemo } from 'react';
import { ShoppingBag, Trash2, ChevronDown, ChevronUp, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartSidebar({
  cartItems,
  recipes = [],
  days = 3,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalCartValue,
  totalCartProtein,
  totalSavings
}) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  // Wireframe toggle pills: 'Least Price' vs 'Nearest Qty'
  const [cartFilter, setCartFilter] = useState('Nearest Qty');
  
  // Track collapsed recipe groups: { [recipeName]: boolean }
  const [collapsedMap, setCollapsedMap] = useState({});

  // Group cart items by recipe
  const groupedCartItems = useMemo(() => {
    const map = {};
    cartItems.forEach((item) => {
      const key = item.recipeName || 'Individual Items';
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [cartItems]);

  // Lookup recipe metadata
  const getRecipeMeta = (recipeName) => {
    const found = recipes.find(
      (r) => r.name.toLowerCase() === recipeName.toLowerCase()
    );
    if (found) return found;

    return {
      name: recipeName,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
      cookTime: 20,
      totalProtein: 20,
      savingsText: '1.5x saved for 3 times'
    };
  };

  const toggleCollapse = (recipeName) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [recipeName]: !prev[recipeName]
    }));
  };

  const handleSubscribe = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCheckoutModal(false);
      onClearCart();
    }, 2200);
  };

  // Calculate total servings / future meals covered
  const totalUsagesCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.usages || 3) * item.count, 0);
  }, [cartItems]);

  return (
    <aside className="w-full lg:w-80 bg-white rounded-xl border border-gray-200 p-3.5 space-y-3.5 flex flex-col justify-between shadow-xs">
      
      {/* 1. Header & Filter Pills Matching Sketch: "CART" | [ o Least Price ] [ • Nearest Qty ] */}
      <div className="space-y-2.5 pb-2.5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-extrabold text-gray-900 text-sm tracking-wide">
            <ShoppingBag className="w-4 h-4 text-[#84c225]" />
            <span>CART</span>
            {cartItems.length > 0 && (
              <span className="bg-emerald-50 text-[#689f38] text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-200">
                {cartItems.length}
              </span>
            )}
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-[11px] text-gray-400 hover:text-red-500 cursor-pointer font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Radio Toggle Pills: [ o Least Price ]  [ • Nearest Qty ] */}
        <div className="grid grid-cols-2 gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setCartFilter('Least Price')}
            className={`flex items-center justify-center space-x-1.5 py-1 px-2 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              cartFilter === 'Least Price'
                ? 'bg-white text-gray-900 shadow-2xs border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full border ${
                cartFilter === 'Least Price' ? 'bg-[#84c225] border-[#84c225]' : 'border-gray-400 bg-transparent'
              }`}
            />
            <span>Least Price</span>
          </button>

          <button
            type="button"
            onClick={() => setCartFilter('Nearest Qty')}
            className={`flex items-center justify-center space-x-1.5 py-1 px-2 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              cartFilter === 'Nearest Qty'
                ? 'bg-white text-gray-900 shadow-2xs border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full border ${
                cartFilter === 'Nearest Qty' ? 'bg-[#84c225] border-[#84c225]' : 'border-gray-400 bg-transparent'
              }`}
            />
            <span>Nearest Qty</span>
          </button>
        </div>
      </div>

      {/* 2. Simplified Cart Items List */}
      <div className="flex-1 overflow-y-auto max-h-[460px] space-y-2.5 pr-0.5">
        {cartItems.length === 0 ? (
          <div className="py-12 text-center text-gray-400 space-y-1.5">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-xs font-bold text-gray-700">Cart is empty</p>
            <p className="text-[10.5px] text-gray-400 px-4">
              Add meals from the Recipes Plan to view full packet prices & reusable usages
            </p>
          </div>
        ) : (
          Object.entries(groupedCartItems).map(([recipeName, items]) => {
            const isCollapsed = !!collapsedMap[recipeName];
            const meta = getRecipeMeta(recipeName);

            // Compute total packet discount price for this recipe group
            const groupTotalPacketPrice = items.reduce(
              (sum, item) => sum + (item.packetDiscountPrice ?? item.discountPrice ?? 0) * item.count,
              0
            );

            // Compute protein sum
            const groupProtein = items.reduce(
              (sum, item) => sum + (item.protein || 0) * item.count,
              0
            );

            return (
              <div
                key={recipeName}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs transition-all hover:border-gray-300"
              >
                {/* Simplified Recipe Card Header (No green dot) */}
                <div
                  onClick={() => toggleCollapse(recipeName)}
                  className="bg-gray-50/80 hover:bg-gray-100/70 p-2.5 flex items-center justify-between cursor-pointer border-b border-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={meta.image || items[0]?.imageUrl}
                      alt={recipeName}
                      className="w-9 h-9 rounded-lg object-cover bg-white border border-gray-200 shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-gray-900 text-xs truncate" title={recipeName}>
                          {recipeName}
                        </h3>
                        {isCollapsed && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            ({items.length} items)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 truncate">
                        <span className="font-extrabold text-gray-900">₹{groupTotalPacketPrice}</span>{' '}
                        <span className="text-[10px] text-[#689f38] font-semibold">
                          • {meta.savingsText || 'x5 Usages'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Clean Chevron (No green dot) */}
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-700 p-1 shrink-0"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Simplified Expanded Content */}
                {!isCollapsed && (
                  <div className="p-2 space-y-2 bg-white">
                    {/* Clean Sub-specs Bar */}
                    <div className="flex items-center justify-between text-[10px] bg-gray-50 rounded px-2 py-1 text-gray-600 font-medium border border-gray-100">
                      <span>200g portion ({days} servings)</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-bold text-[#689f38]">P {groupProtein}g</span>
                      <span className="text-gray-300">•</span>
                      <span>{meta.cookTime || 20} min</span>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-1 text-[9.5px] font-bold text-gray-400 uppercase tracking-wider pb-1 border-b border-gray-100 px-0.5">
                      <span className="col-span-6">Ing.</span>
                      <span className="col-span-2 text-center">Usage</span>
                      <span className="col-span-2 text-center">Size</span>
                      <span className="col-span-2 text-right">Price</span>
                    </div>

                    {/* Simplified Ingredients Rows */}
                    <div className="space-y-1.5">
                      {items.map((item, idx) => {
                        const packPrice = (item.packetDiscountPrice ?? item.discountPrice ?? 0) * item.count;
                        const packGrams = item.quantity || '500g';
                        const usageLabel = item.usagesText || `x${item.usages || 5}`;

                        return (
                          <div
                            key={`${item.id}-${idx}`}
                            className="text-xs border-b border-gray-50 pb-1.5 last:border-0 last:pb-0 space-y-0.5"
                          >
                            <div className="grid grid-cols-12 gap-1 items-center">
                              {/* 1. Item Name & ALT badge (no green dot) */}
                              <div className="col-span-6 flex items-center space-x-1 min-w-0 pr-1">
                                <span
                                  className="font-semibold text-gray-900 truncate text-[11px]"
                                  title={item.productName}
                                >
                                  {item.productName}
                                </span>
                                <span
                                  className="text-[8px] font-bold px-1 py-0.2 bg-gray-100 text-gray-500 rounded shrink-0 cursor-pointer hover:bg-gray-200"
                                  title="Alternate pack"
                                >
                                  ALT
                                </span>
                              </div>

                              {/* 2. Usage badge */}
                              <div className="col-span-2 text-center">
                                <span className="bg-emerald-50 text-[#689f38] font-bold text-[9.5px] px-1 py-0.2 rounded border border-emerald-100">
                                  {usageLabel}
                                </span>
                              </div>

                              {/* 3. Pack Size */}
                              <div className="col-span-2 text-center">
                                <span className="text-[10px] text-gray-500 font-medium truncate block">
                                  {packGrams}
                                </span>
                              </div>

                              {/* 4. Packet Price */}
                              <div className="col-span-2 text-right">
                                <span className="font-bold text-gray-900 text-[11px]">
                                  ₹{packPrice}
                                </span>
                              </div>
                            </div>

                            {/* Stepper controls */}
                            <div className="flex items-center justify-end space-x-1.5 pt-0.5">
                              <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded px-1">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.count - 1)}
                                  className="text-gray-500 hover:text-gray-900 font-bold cursor-pointer text-xs px-0.5"
                                >
                                  -
                                </button>
                                <span className="font-bold text-gray-900 text-[10px] px-1">
                                  {item.count}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.count + 1)}
                                  className="text-gray-500 hover:text-gray-900 font-bold cursor-pointer text-xs px-0.5"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-gray-300 hover:text-red-500 p-0.5 cursor-pointer transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Total Section & BUY ITEMS Button */}
      {cartItems.length > 0 && (
        <div className="pt-3 border-t border-gray-100 space-y-2 bg-white">
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Packet Total</span>
              <span className="font-bold text-gray-900">₹{totalCartValue}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Reusable Horizon</span>
              <span className="font-bold text-[#689f38] flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#84c225]" />
                <span>{totalUsagesCount}+ meals</span>
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Protein Target</span>
              <span className="font-bold text-gray-900">{totalCartProtein}g</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold text-[11px]">
                <span>Savings</span>
                <span>-₹{totalSavings}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1.5 border-t border-gray-100">
              <span>Total Payable</span>
              <span className="text-[#84c225] text-base">₹{totalCartValue}</span>
            </div>
          </div>

          {/* BUY ITEMS button */}
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="w-full py-2.5 bg-[#84c225] hover:bg-[#689f38] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>BUY ITEMS (₹{totalCartValue})</span>
          </button>

        </div>
      )}

      {/* Subscription / Instant Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-100 shadow-2xl space-y-4">
            {orderPlaced ? (
              <div className="py-6 text-center space-y-2.5">
                <CheckCircle2 className="w-12 h-12 text-[#84c225] mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-gray-900">Order Confirmed on BB Daily!</h3>
                <p className="text-xs text-gray-500">
                  Full packet supplies scheduled for morning doorstep delivery.
                </p>
                <div className="bg-emerald-50 text-[#689f38] text-xs font-semibold p-2 rounded-lg border border-emerald-100 inline-block">
                  Covers {days} planned days + {totalUsagesCount} subsequent meal usages!
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">BigBasket Order Summary</h3>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Store Packet Amount:</span>
                    <span className="font-bold text-gray-900">₹{totalCartValue}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Pack Items:</span>
                    <span className="font-bold text-gray-900">{cartItems.length} packets</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Reusable Usage Horizon:</span>
                    <span className="font-bold text-[#689f38]">{totalUsagesCount} recipe portions</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg text-[11px] text-gray-600">
                    📦 Optimized as per <strong>{cartFilter}</strong> logic to minimize pantry waste.
                  </div>
                </div>

                <button
                  onClick={handleSubscribe}
                  className="w-full py-2.5 bg-[#84c225] hover:bg-[#689f38] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Confirm & Buy (₹{totalCartValue})
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </aside>
  );
}
