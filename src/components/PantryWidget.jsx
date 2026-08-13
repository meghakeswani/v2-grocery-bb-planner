import React, { useState } from 'react';
import { Package, Plus, Trash2, Clock } from 'lucide-react';

export default function PantryWidget({ pantryItems, setPantryItems }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemDaysLeft, setNewItemDaysLeft] = useState(2);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const item = {
      id: `pantry-${Date.now()}`,
      name: newItemName.trim(),
      quantity: newItemQty.trim() || '250g',
      daysLeft: parseInt(newItemDaysLeft) || 2
    };
    setPantryItems([...pantryItems, item]);
    setNewItemName('');
    setNewItemQty('');
    setIsAdding(false);
  };

  const removeItem = (id) => {
    setPantryItems(pantryItems.filter(i => i.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-2xs flex flex-col justify-between h-full min-h-[140px] relative">
      
      {/* Header matching wireframe "My Pantry" */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-xs">My Pantry</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-[11px] text-gray-600 hover:text-gray-900 font-semibold flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3 h-3 text-[#84c225]" />
          <span>Add</span>
        </button>
      </div>

      {/* Pantry Items list */}
      <div className="my-2 space-y-1.5 overflow-y-auto max-h-24 pr-1">
        {pantryItems.length === 0 ? (
          <p className="text-[11px] text-gray-400 italic py-2">No pantry items added.</p>
        ) : (
          pantryItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50 text-xs"
            >
              <div>
                <span className="font-semibold text-gray-800 block text-[11px]">{item.name} {item.quantity}</span>
                <span className="text-[10px] text-gray-400 block">{item.daysLeft} days left</span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-red-500 p-0.5 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Inline Form */}
      {isAdding && (
        <div className="absolute inset-0 z-20 bg-white rounded-xl p-3 border border-gray-200 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800">Add Pantry Item</span>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          </div>
          <form onSubmit={handleAddItem} className="space-y-1.5 my-1">
            <input
              type="text"
              placeholder="Item (e.g. Spinach)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full text-xs p-1 border border-gray-200 rounded outline-none focus:border-[#84c225]"
              autoFocus
            />
            <div className="flex space-x-1.5">
              <input
                type="text"
                placeholder="Qty (250g)"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                className="w-1/2 text-xs p-1 border border-gray-200 rounded outline-none focus:border-[#84c225]"
              />
              <input
                type="number"
                placeholder="Days"
                value={newItemDaysLeft}
                onChange={(e) => setNewItemDaysLeft(e.target.value)}
                className="w-1/2 text-xs p-1 border border-gray-200 rounded outline-none focus:border-[#84c225]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1 bg-[#84c225] text-white font-bold rounded text-xs hover:bg-[#689f38]"
            >
              Save
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
