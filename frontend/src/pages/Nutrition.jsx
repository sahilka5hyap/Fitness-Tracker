import React, { useState, useEffect, useContext } from 'react';
import { Plus, Utensils, Flame, Zap, Droplets, Wheat, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import MealModal from '../components/MealModel';

const Nutrition = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Daily Goals (Hardcoded for now, can be moved to user profile later)
  const GOALS = {
    calories: 2500,
    protein: 180,
    carbs: 300,
    fat: 80
  };

  const fetchMeals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/nutrition', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      setMeals(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch meals", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [user]);

  // Calculate Today's Stats
  const today = new Date().toDateString();
  const todaysMeals = meals.filter(m => new Date(m.date).toDateString() === today);

  const stats = todaysMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Reusable Macro Card Component
  const MacroCard = ({ title, value, goal, unit, icon: Icon, color, progressColor }) => {
    const percentage = Math.min((value / goal) * 100, 100);
    return (
      <div className="bg-card border border-gray-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={color} size={18} />
          <h3 className="text-gray-400 text-sm font-bold uppercase">{title}</h3>
        </div>
        <div className="flex items-end gap-1 mb-2">
           <span className="text-2xl font-bold text-white">{value}</span>
           <span className="text-xs text-gray-500 mb-1">/ {goal}{unit}</span>
        </div>
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-800 rounded-full">
          <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Nutrition</h1>
          <p className="text-gray-400">Track your meals and macros</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={20} /> Log Meal
        </button>
      </div>

      {/* Macro Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MacroCard 
          title="Calories" 
          value={stats.calories} 
          goal={GOALS.calories} 
          unit="" 
          icon={Flame} 
          color="text-yellow-400" 
          progressColor="bg-yellow-400" 
        />
        <MacroCard 
          title="Protein" 
          value={stats.protein} 
          goal={GOALS.protein} 
          unit="g" 
          icon={Zap} 
          color="text-red-500" 
          progressColor="bg-red-500" 
        />
        <MacroCard 
          title="Carbs" 
          value={stats.carbs} 
          goal={GOALS.carbs} 
          unit="g" 
          icon={Wheat} 
          color="text-orange-400" 
          progressColor="bg-orange-400" 
        />
        <MacroCard 
          title="Fat" 
          value={stats.fat} 
          goal={GOALS.fat} 
          unit="g" 
          icon={Droplets} 
          color="text-blue-400" 
          progressColor="bg-blue-400" 
        />
      </div>

      {/* Daily Food Log */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Today's Meals</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading meals...</p>
        ) : todaysMeals.length === 0 ? (
          <div className="bg-card border border-gray-800 rounded-2xl p-12 text-center">
            <Utensils className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No meals logged yet today</p>
            <p className="text-sm text-gray-600">Start tracking your nutrition!</p>
          </div>
        ) : (
          todaysMeals.map((meal) => (
            <div key={meal._id} className="bg-card border border-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-gray-700 transition">
              <div className="flex items-center gap-4">
                <div className="bg-[#0A0A0A] p-3 rounded-lg border border-gray-800">
                  <span className="text-2xl">
                    {meal.mealType === 'Breakfast' ? '🍳' : 
                     meal.mealType === 'Lunch' ? '🥗' :
                     meal.mealType === 'Dinner' ? '🍲' : '🍎'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white">{meal.foodName}</h3>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Flame size={12} className="text-yellow-500"/> {meal.calories} kcal</span>
                    <span className="flex items-center gap-1"><Zap size={12} className="text-red-500"/> {meal.protein}g P</span>
                    <span className="flex items-center gap-1"><Wheat size={12} className="text-orange-500"/> {meal.carbs}g C</span>
                    <span className="flex items-center gap-1"><Droplets size={12} className="text-blue-500"/> {meal.fat}g F</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                 <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                   {meal.mealType}
                 </span>
                 <p className="text-xs text-gray-600 mt-1">{new Date(meal.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <MealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchMeals} 
      />
    </div>
  );
};

export default Nutrition;