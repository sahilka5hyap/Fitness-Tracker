import React, { useState, useContext } from 'react';
import { X, Utensils, Flame, Zap, Droplets, Wheat } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MealModel = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    mealType: 'Breakfast',
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
        onClose();
        setFormData({ mealType: 'Breakfast', foodName: '', calories: '', protein: '', carbs: '', fat: '' });
      } else {
        alert("Failed to save meal");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Utensils className="text-primary" /> Log New Meal
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Meal Type */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Meal Type</label>
            <select 
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
              value={formData.mealType}
              onChange={(e) => setFormData({...formData, mealType: e.target.value})}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>

          {/* Food Name */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Food Name</label>
            <input 
              type="text" 
              placeholder="e.g., Grilled Chicken Salad" 
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
              value={formData.foodName}
              onChange={(e) => setFormData({...formData, foodName: e.target.value})}
              required
            />
          </div>

          {/* Calories & Protein Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><Flame size={14}/> Calories</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><Zap size={14}/> Protein (g)</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                value={formData.protein}
                onChange={(e) => setFormData({...formData, protein: e.target.value})}
              />
            </div>
          </div>

          {/* Carbs & Fat Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><Wheat size={14}/> Carbs (g)</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                value={formData.carbs}
                onChange={(e) => setFormData({...formData, carbs: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><Droplets size={14}/> Fat (g)</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                value={formData.fat}
                onChange={(e) => setFormData({...formData, fat: e.target.value})}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Meal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MealModel;