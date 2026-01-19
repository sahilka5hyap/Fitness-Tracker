import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Flame, Search, Plus, Database } from 'lucide-react';

const MealModel = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  // Search & Results
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Stores search results OR common foods
  
  // Logic State
  const [selectedFood, setSelectedFood] = useState(null); 
  const [quantity, setQuantity] = useState(1);

  const [formData, setFormData] = useState({ 
    mealType: 'Breakfast', foodName: '', calories: '', protein: '', carbs: '', fat: '' 
  });

  // 1. Fetch Common Foods on Load (or Search)
  useEffect(() => {
    if(!isOpen) return; // Only fetch when open

    const fetchFoods = async () => {
      try {
        // If query is empty, backend now returns "Common Foods"
        const res = await fetch(`http://localhost:5000/api/foods/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) { console.error(err); }
    };

    const delayDebounceFn = setTimeout(() => fetchFoods(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, isOpen]);

  // 2. Select Food logic (Auto-fill)
  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(1);
    
    // Auto-populate form
    setFormData({
      ...formData,
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    });
  };

  // 3. Quantity Multiplier
  const handleQuantityChange = (e) => {
    const qty = parseFloat(e.target.value) || 0;
    setQuantity(qty);

    if (selectedFood) {
      setFormData(prev => ({
        ...prev,
        calories: Math.round(selectedFood.calories * qty),
        protein: (selectedFood.protein * qty).toFixed(1),
        carbs: (selectedFood.carbs * qty).toFixed(1),
        fat: (selectedFood.fat * qty).toFixed(1)
      }));
    }
  };

  // 4. Emergency Seed Button (Fixes "No Data" issue)
  const handleSeed = async () => {
    if(window.confirm("This will reset the food database to defaults. Continue?")) {
      await fetch('http://localhost:5000/api/foods/seed', { method: 'POST' });
      setQuery(' '); setTimeout(() => setQuery(''), 100); // Refresh list
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(formData)
      });
      onSave(); onClose();
      // Reset
      setFormData({ mealType: 'Breakfast', foodName: '', calories: '', protein: '', carbs: '', fat: '' });
      setSelectedFood(null); setQuantity(1); setQuery('');
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="text-[#D4FF33]" size={24} /> Log Meal
          </h2>
          <div className="flex gap-2">
             {/* Hidden Helper Button to Fix Empty DB */}
             <button onClick={handleSeed} className="text-gray-600 hover:text-red-500" title="Reset Database">
                <Database size={18} />
             </button>
             <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
        </div>

        {/* --- 1. SEARCH & QUICK ADD --- */}
        <div className="mb-4 shrink-0">
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-500"><Search size={18} /></div>
            <input 
              type="text" 
              placeholder="Search or select below..." 
              className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl p-3 pl-10 text-white focus:border-[#D4FF33] focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          {/* Quick Add Chips (Horizontal Scroll) */}
          {!selectedFood && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Quick Add</p>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {results.length === 0 ? (
                    <span className="text-xs text-gray-600">No foods found. Click the database icon above to fix.</span>
                ) : (
                    results.map((food) => (
                    <button
                        key={food._id}
                        onClick={() => handleSelectFood(food)}
                        className="flex-shrink-0 bg-[#1e1e1e] hover:bg-[#D4FF33] hover:text-black border border-gray-800 text-gray-300 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                        <Plus size={12} /> {food.name}
                    </button>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- 2. FORM AREA (Scrollable) --- */}
        <div className="overflow-y-auto pr-1 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Meal Type */}
            <div>
                <label className="text-xs text-gray-500 mb-2 block uppercase font-bold">Meal Type</label>
                <div className="flex gap-2">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
                    <button
                    type="button"
                    key={type}
                    onClick={() => setFormData({...formData, mealType: type})}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                        formData.mealType === type 
                        ? 'bg-[#D4FF33] text-black border-[#D4FF33] font-bold' 
                        : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-600'
                    }`}
                    >
                    {type}
                    </button>
                ))}
                </div>
            </div>

            {/* SELECTED FOOD CARD */}
            {selectedFood && (
                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div>
                    <span className="text-gray-400 text-xs block mb-1">Serving: <span className="text-[#D4FF33]">{selectedFood.servingSize}</span></span>
                    <div className="font-bold text-white">{selectedFood.name}</div>
                </div>
                <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-lg border border-gray-700">
                    <span className="text-xs text-gray-500 pl-2">Qty:</span>
                    <input 
                    type="number" min="0.1" step="0.1"
                    className="w-14 bg-transparent text-white font-bold text-center focus:outline-none"
                    value={quantity}
                    onChange={handleQuantityChange}
                    autoFocus
                    />
                </div>
                </div>
            )}

            {/* Food Name (Fallback) */}
            {!selectedFood && (
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Food Name</label>
                    <input type="text" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" value={formData.foodName} onChange={(e) => setFormData({...formData, foodName: e.target.value})} required />
                </div>
            )}

            {/* Macros Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                <label className="text-xs text-gray-500 mb-1 block">Calories</label>
                <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none font-bold" value={formData.calories} onChange={(e) => setFormData({...formData, calories: e.target.value})} required />
                </div>
                <div className="relative">
                <label className="text-xs text-blue-400 mb-1 block">Protein (g)</label>
                <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none" value={formData.protein} onChange={(e) => setFormData({...formData, protein: e.target.value})} />
                </div>
                <div className="relative">
                <label className="text-xs text-yellow-500 mb-1 block">Carbs (g)</label>
                <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none" value={formData.carbs} onChange={(e) => setFormData({...formData, carbs: e.target.value})} />
                </div>
                <div className="relative">
                <label className="text-xs text-red-500 mb-1 block">Fat (g)</label>
                <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none" value={formData.fat} onChange={(e) => setFormData({...formData, fat: e.target.value})} />
                </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#D4FF33] text-black font-bold py-3.5 rounded-xl mt-4 hover:opacity-90 transition shadow-lg shadow-[#D4FF33]/10">
                {loading ? 'Saving...' : 'Save Meal Entry'}
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default MealModel;