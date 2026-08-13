import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CartSidebar({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalCartValue,
  totalCartProtein,
  totalSavings
}) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryFrequency, setDeliveryFrequency] = useState('Daily Morning (6:00 AM)');
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  return (
    <aside className="w-full lg:w-72 bg-white rounded-xl border border-gray-100 p-4 space-y-4 flex flex-col justify-between">
      
      {/* Header matching wireframe "Cart" */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-1.5 font-bold text-gray-900 text-xs">
          <ShoppingBag className="w-4 h-4 text-[#84c225]" />
          <span>Cart</span>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Cart Items list matching wireframe: "Palak ₹50 1kg", "Paneer ₹70 250g" */}
      <div className="flex-1 overflow-y-auto max-h-[420px] space-y-2 pr-1">
        {cartItems.length === 0 ? (
          <div className="py-12 text-center text-gray-400 space-y-1">
            <ShoppingBag className="w-8 h-8 mx-auto text-gray-200" />
            <p className="text-xs font-medium">Cart is empty</p>
            <p className="text-[10px] text-gray-400">Select meals to populate ingredient materials</p>
          </div>
        ) : (
          cartItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center space-x-2 min-w-0">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-9 h-9 rounded object-cover bg-white border border-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100';
                  }}
                />
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate text-[11px]" title={item.productName}>
                    {item.productName}
                  </h4>
                  <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                    <span className="font-bold text-gray-800">₹{item.discountPrice}</span>
                    <span>•</span>
                    <span>{item.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded px-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.count - 1)}
                    className="text-gray-500 hover:text-gray-800 font-bold cursor-pointer text-xs"
                  >
                    -
                  </button>
                  <span className="font-bold text-gray-900 text-[10px] px-1">{item.count}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.count + 1)}
                    className="text-gray-500 hover:text-gray-800 font-bold cursor-pointer text-xs"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-gray-300 hover:text-red-500 p-0.5 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Total Section matching wireframe */}
      {cartItems.length > 0 && (
        <div className="pt-3 border-t border-gray-100 space-y-2.5">
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Items Total</span>
              <span className="font-semibold text-gray-900">₹{totalCartValue}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Selected Protein</span>
              <span className="font-semibold text-gray-900">{totalCartProtein}g</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#84c225]">₹{totalCartValue}</span>
            </div>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="w-full py-2.5 bg-[#84c225] hover:bg-[#689f38] text-white font-bold rounded-lg text-xs transition-colors shadow-2xs flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Place Order</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>
      )}

      {/* Subscription Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-gray-100 shadow-xl space-y-4">
            {orderPlaced ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#84c225] mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-gray-900">Order Confirmed!</h3>
                <p className="text-xs text-gray-500">Scheduled for morning delivery.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">Checkout Summary</h3>
                  <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Amount</span>
                    <span className="font-bold text-gray-900">₹{totalCartValue}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Materials</span>
                    <span className="font-bold text-gray-900">{cartItems.length} items</span>
                  </div>
                </div>

                <button
                  onClick={handleSubscribe}
                  className="w-full py-2.5 bg-[#84c225] hover:bg-[#689f38] text-white font-bold rounded-lg text-xs transition-colors"
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
