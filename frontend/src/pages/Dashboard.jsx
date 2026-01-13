import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Activity, Flame, Footprints, Dumbbell, Moon, Droplets, Scale, 
  Plus, Calendar, MoreHorizontal, Target, TrendingUp 
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- 1. UPDATED IMPORTS (Matching your file names) ---
// Assuming these are located in your components folder
import WorkoutModel from '../components/WorkoutModel';
import MealModel from '../components/MealModel';
import BodyStats from '../components/BodyStatsModel'; 

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // --- 2. QUICK LOG STATE ---
  const [showQuickLogMenu, setShowQuickLogMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'workout', 'meal', 'stats'

  // Daily Focus Logic
  const getDailyFocus = () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = days[new Date().getDay()];
      const schedule = {
        'Monday': { focus: 'Chest & Triceps', icon: '💪', color: 'bg-red-500' },
        'Tuesday': { focus: 'Back & Biceps', icon: '🏋️', color: 'bg-blue-500' },
        'Wednesday': { focus: 'Legs & Core', icon: '🦵', color: 'bg-orange-500' },
        'Thursday': { focus: 'Shoulders & Abs', icon: '🧘', color: 'bg-purple-500' },
        'Friday': { focus: 'Full Body HIIT', icon: '🔥', color: 'bg-yellow-500' },
        'Saturday': { focus: 'Yoga & Recovery', icon: '🧘', color: 'bg-green-500' },
        'Sunday': { focus: 'Rest Day', icon: '😴', color: 'bg-gray-500' }
      };
      return { day: today, ...schedule[today] };
  };
  const dailySuggestion = getDailyFocus();

  // Data State
  const [stats, setStats] = useState({ calories: 0, steps: 0, workouts: 0, activeMinutes: 0, weight: 0 });
  const [goals, setGoals] = useState([]);
  const [graphData, setGraphData] = useState([]);

  // Fetch Logic
  const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };
        
        const [workoutsRes, nutritionRes, statsRes, goalsRes] = await Promise.all([
          fetch('http://localhost:5000/api/workouts', { headers }),
          fetch('http://localhost:5000/api/nutrition', { headers }),
          fetch('http://localhost:5000/api/stats', { headers }),
          fetch('http://localhost:5000/api/goals', { headers })
        ]);

        const workoutsData = await workoutsRes.json();
        const nutritionData = await nutritionRes.json();
        const statsData = await statsRes.json();
        const goalsData = await goalsRes.json();

        // Calculate Stats
        const today = new Date().toDateString();
        let cal = 0, prot = 0, carb = 0, fat = 0;
        nutritionData.forEach(item => { 
          if (new Date(item.date).toDateString() === today) {
            cal += item.calories || 0;
            prot += item.protein || 0;
            carb += item.carbs || 0;
            fat += item.fat || 0;
          }
        });

        let mins = 0, count = 0;
        workoutsData.forEach(item => { 
          if (new Date(item.date).toDateString() === today) { count += 1; mins += item.duration || 0; } 
        });

        const latestStat = statsData[0] || {}; 
        
        setStats({ 
          calories: cal, protein: prot, carbs: carb, fat: fat,
          steps: latestStat.steps || 0, 
          workouts: count, activeMinutes: mins,
          weight: latestStat.weight || 0
        });

        setGoals(goalsData.filter(g => g.status === 'active'));

        // Graph Data
        const last7Days = Array.from({ length: 7 }, (_, i) => { 
            const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toLocaleDateString(); 
        });
        const activityGraph = last7Days.map(dateStr => {
            const dayMins = workoutsData
                .filter(w => new Date(w.date).toLocaleDateString() === dateStr)
                .reduce((acc, curr) => acc + (curr.duration || 0), 0);
            return { day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }), active: dayMins };
        });
        setGraphData(activityGraph);

      } catch (error) { console.error(error); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  // Metric Card Component
  const MetricCard = ({ title, value, subtext, icon: Icon, color, progress, details, footer }) => (
    <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl relative flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-white`}>
              <Icon size={20} className={color.replace('bg-', 'text-')} />
            </div>
            <h3 className="font-bold text-white">{title}</h3>
          </div>
          <MoreHorizontal size={16} className="text-gray-500 cursor-pointer" />
        </div>
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-white mb-1">{value}</h2>
          <p className="text-xs text-gray-500">{subtext}</p>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div>
        {details && (
          <div className="flex justify-between text-xs text-gray-400 mt-2 border-t border-gray-800 pt-3">
            {details.map((d, i) => (
              <div key={i}>
                <span className="block text-white font-bold">{d.val}</span>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        )}
        {footer && <p className="text-xs text-green-400 mt-2 flex items-center gap-1">{footer}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-white">
      
      {/* HEADER + QUICK LOG BUTTON */}
      <div className="flex justify-between items-start mb-8 relative">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">Let's check your fitness progress today</p>
        </div>
        
        <div className="text-right relative">
          {/* Main Button */}
          <button 
            onClick={() => setShowQuickLogMenu(!showQuickLogMenu)}
            className="bg-[#00B4D8] text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 mb-2"
          >
            <Plus size={18} /> Quick Log
          </button>
          
          {/* Dropdown Menu */}
          {showQuickLogMenu && (
            <div className="absolute right-0 top-12 bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-xl p-2 w-48 z-50 flex flex-col gap-1">
              <button 
                onClick={() => { setActiveModal('workout'); setShowQuickLogMenu(false); }} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg text-sm text-gray-300 hover:text-white"
              >
                <Dumbbell size={16}/> Log Workout
              </button>
              <button 
                onClick={() => { setActiveModal('meal'); setShowQuickLogMenu(false); }} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg text-sm text-gray-300 hover:text-white"
              >
                <Flame size={16}/> Log Meal
              </button>
              <button 
                onClick={() => { setActiveModal('stats'); setShowQuickLogMenu(false); }} 
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg text-sm text-gray-300 hover:text-white"
              >
                <Scale size={16}/> Log Body Stats
              </button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
            <Calendar size={12} /> {todayDate}
          </p>
        </div>
      </div>

      {/* TOP ROW: FOCUS & GOALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#1e1e1e] to-[#121212] border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-[#D4FF33]" size={20} />
            <h3 className="font-bold text-lg">Today's Focus</h3>
          </div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">{dailySuggestion.icon} {dailySuggestion.focus}</h2>
          <p className="text-sm text-gray-400 mb-6">{dailySuggestion.day}'s suggested routine.</p>
          <button className="w-full bg-[#D4FF33] text-black font-bold py-2 rounded-lg hover:opacity-90 transition">Start Workout</button>
        </div>

        <div className="lg:col-span-2 bg-[#121212] border border-gray-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Target className="text-[#D4FF33]" size={20} />
              <h3 className="font-bold text-lg">Active Goals</h3>
            </div>
            <span className="text-xs text-gray-500">{goals.length} active</span>
          </div>
          {goals.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">No active goals found. Set one in your Profile!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.slice(0, 4).map((goal) => {
                const pct = Math.min((goal.currentProgress / goal.targetValue) * 100, 100);
                return (
                  <div key={goal._id} className="bg-[#0A0A0A] p-3 rounded-xl border border-gray-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white font-bold">{goal.title}</span>
                      <span className="text-[#D4FF33]">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-[#D4FF33]" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* METRICS GRID */}
      <h3 className="text-lg font-bold mb-4">Your Fitness Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Steps" value={stats.steps.toLocaleString()} subtext="Goal: 10k" icon={Footprints} color="bg-green-500" progress={(stats.steps/10000)*100} footer="↑ 12% vs yesterday" />
        <MetricCard title="Workouts" value={`${stats.workouts}/2`} subtext="Goal: 2 sessions" icon={Dumbbell} color="bg-pink-500" progress={(stats.workouts/2)*100} footer="Upper Body • 45m" />
        <MetricCard title="Nutrition" value={`${stats.calories}`} subtext="Goal: 2k cal" icon={Flame} color="bg-blue-400" progress={(stats.calories/2000)*100} details={[{val: `${stats.protein}g`, label: 'Prot'}, {val: `${stats.carbs}g`, label: 'Carb'}, {val: `${stats.fat}g`, label: 'Fat'}]} />
        <MetricCard title="Sleep" value="7h 15m" subtext="Goal: 8h" icon={Moon} color="bg-indigo-500" progress={90} footer="Deep sleep: 2h 10m" />
        <MetricCard title="Weight" value={`${stats.weight} kg`} subtext="Goal: 70kg" icon={Scale} color="bg-yellow-500" progress={85} footer="↓ 2.5 kg this month" />
        <MetricCard title="Water" value="5 / 8" subtext="Goal: 8 glasses" icon={Droplets} color="bg-cyan-400" progress={(5/8)*100} footer="Last glass: 2:45 PM" />
      </div>

      {/* GRAPH */}
      <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl h-80">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-[#D4FF33]" /> Weekly Activity Trend
          </h3>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={graphData}>
            <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#333', color: '#fff' }} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
            <Bar dataKey="active" radius={[4, 4, 0, 0]} barSize={40}>
              {graphData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.active > 30 ? '#D4FF33' : '#333'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- 3. RENDER MODALS (Using new names) --- */}
      <WorkoutModel 
        isOpen={activeModal === 'workout'} 
        onClose={() => setActiveModal(null)} 
        onSave={fetchData} 
      />
      <MealModel 
        isOpen={activeModal === 'meal'} 
        onClose={() => setActiveModal(null)} 
        onSave={fetchData} 
      />
      <BodyStats 
        isOpen={activeModal === 'stats'} 
        onClose={() => setActiveModal(null)} 
        onSave={fetchData} 
      />

    </div>
  );
};

export default Dashboard;