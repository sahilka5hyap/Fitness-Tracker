import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Flame, Droplets, ChevronRight, Utensils, Zap, Wheat, AlignJustify 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import MealModel from '../components/MealModel';

const Nutrition = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Targets (You could make these dynamic in Profile later)
  const TARGETS = { calories: 2500, protein: 150, carbs: 300, fat: 80 };

  // Fetch Nutrition Data
  const fetchMeals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/nutrition', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setMeals(data);
      
      // Filter for Today
      const today = new Date().toDateString();
      setTodaysMeals(data.filter(m => new Date(m.date).toDateString() === today));
      
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if(user) fetchMeals(); }, [user]);

  // Calculate Totals
  const totals = todaysMeals.reduce((acc, curr) => ({
    calories: acc.calories + (curr.calories || 0),
    protein: acc.protein + (curr.protein || 0),
    carbs: acc.carbs + (curr.carbs || 0),
    fat: acc.fat + (curr.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Pie Chart Data
  const macroData = [
    { name: 'Protein', value: totals.protein, color: '#3b82f6' }, // Blue
    { name: 'Carbs', value: totals.carbs, color: '#eab308' },     // Yellow
    { name: 'Fat', value: totals.fat, color: '#ef4444' },         // Red
  ].filter(d => d.value > 0);

  // Helper to filter meals by type
  const getMealsByType = (type) => todaysMeals.filter(m => m.mealType === type);

  // Reusable Macro Card
  const MacroCard = ({ label, value, target, unit, color, icon: Icon }) => {
    const pct = Math.min((value / target) * 100, 100);
    return (
      <div className="bg-[#121212] border border-gray-800 p-5 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 rounded-lg bg-opacity-10 ${color}`}>
            <Icon size={20} className={color.replace('bg-', 'text-')} />
          </div>
          <span className="text-xs font-bold text-gray-500">{Math.round(pct)}%</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-xs text-gray-500">/ {target}{unit}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
             <div className={`h-full ${color}`} style={{ width: `${pct}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  // Reusable Meal Section
  const MealSection = ({ title, type }) => {
    const sectionMeals = getMealsByType(type);
    if (sectionMeals.length === 0) return null;

    const sectionCals = sectionMeals.reduce((acc, curr) => acc + curr.calories, 0);

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-bold text-gray-300 text-sm uppercase tracking-wide">{title}</h3>
          <span className="text-xs text-gray-500">{sectionCals} cal</span>
        </div>
        <div className="space-y-3">
          {sectionMeals.map(meal => (
            <div key={meal._id} className="bg-[#121212] border border-gray-800 p-4 rounded-xl flex justify-between items-center group hover:border-[#D4FF33] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 group-hover:bg-[#D4FF33] group-hover:text-black transition-colors">
                  <Utensils size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{meal.foodName}</h4>
                  <p className="text-xs text-gray-500 flex gap-2">
                    <span>P: {meal.protein}g</span>
                    <span>C: {meal.carbs}g</span>
                    <span>F: {meal.fat}g</span>
                  </p>
                </div>
              </div>
              <span className="font-bold text-[#D4FF33] text-sm">{meal.calories}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 pb-24 min-h-screen text-white">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Nutrition</h1>
          <p className="text-gray-400">Track your macros and meals</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D4FF33] text-black font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-[#D4FF33]/20"
        >
          <Plus size={20} /> Log Meal
        </button>
      </div>

      {/* MACRO SUMMARY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MacroCard label="Calories" value={totals.calories} target={TARGETS.calories} unit="" icon={Flame} color="bg-orange-500 text-orange-500" />
        <MacroCard label="Protein" value={totals.protein} target={TARGETS.protein} unit="g" icon={Zap} color="bg-blue-500 text-blue-500" />
        <MacroCard label="Carbs" value={totals.carbs} target={TARGETS.carbs} unit="g" icon={Wheat} color="bg-yellow-500 text-yellow-500" />
        <MacroCard label="Fats" value={totals.fat} target={TARGETS.fat} unit="g" icon={Droplets} color="bg-red-500 text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: MEAL LOG */}
        <div className="lg:col-span-2">
           <div className="bg-[#0A0A0A] rounded-2xl">
             {todaysMeals.length === 0 ? (
               <div className="text-center py-12 border border-gray-800 rounded-2xl border-dashed">
                 <Utensils size={40} className="mx-auto text-gray-600 mb-4"/>
                 <p className="text-gray-500">No meals logged today.</p>
                 <button onClick={() => setIsModalOpen(true)} className="text-[#D4FF33] text-sm font-bold mt-2 hover:underline">Start Tracking</button>
               </div>
             ) : (
               <>
                 <MealSection title="Breakfast" type="Breakfast" />
                 <MealSection title="Lunch" type="Lunch" />
                 <MealSection title="Dinner" type="Dinner" />
                 <MealSection title="Snacks" type="Snack" />
               </>
             )}
           </div>
        </div>

        {/* RIGHT COL: ANALYSIS */}
        <div className="space-y-6">
          
          {/* Pie Chart Card */}
          <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl h-80 flex flex-col items-center justify-center relative">
            <h3 className="absolute top-6 left-6 font-bold text-sm text-gray-400 uppercase">Macro Split</h3>
            {totals.calories > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-600 text-sm">Log food to see breakdown</div>
            )}
            {totals.calories > 0 && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-4">
                 <div className="text-center">
                   <span className="block text-2xl font-bold text-white">{totals.calories}</span>
                   <span className="text-xs text-gray-500">kcal</span>
                 </div>
               </div>
            )}
          </div>

          {/* Quick Tip Card */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 p-6 rounded-2xl">
            <div className="flex items-start gap-3">
              <Droplets className="text-blue-400 shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-blue-100 mb-1">Hydration Tip</h4>
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  Drink 500ml of water before every meal to improve digestion and manage appetite.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* POPUP MODAL */}
      <MealModel 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchMeals} 
      />
    </div>
  );
};

export default Nutrition;