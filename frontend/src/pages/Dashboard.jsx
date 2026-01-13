import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, Flame, Footprints, Dumbbell, Calendar, TrendingUp, Target } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Daily Focus Logic
  const getDailyFocus = () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = days[new Date().getDay()];
      const schedule = {
        'Monday': { focus: 'Chest & Triceps', icon: '💪' },
        'Tuesday': { focus: 'Back & Biceps', icon: '🏋️' },
        'Wednesday': { focus: 'Legs & Core', icon: '🦵' },
        'Thursday': { focus: 'Shoulders & Abs', icon: '🧘' },
        'Friday': { focus: 'Full Body HIIT', icon: '🔥' },
        'Saturday': { focus: 'Yoga & Recovery', icon: '🧘' },
        'Sunday': { focus: 'Rest Day', icon: '😴' }
      };
      return { day: today, ...schedule[today] };
  };
  const dailySuggestion = getDailyFocus();

  // State
  const [stats, setStats] = useState({ calories: 0, steps: 0, workouts: 0, activeMinutes: 0 });
  const [goals, setGoals] = useState([]); //New Goals State

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };
        
        // Parallel Fetch for speed
        const [workoutsRes, nutritionRes, statsRes, goalsRes] = await Promise.all([
          fetch('http://localhost:5000/api/workouts', { headers }),
          fetch('http://localhost:5000/api/nutrition', { headers }),
          fetch('http://localhost:5000/api/stats', { headers }),
          fetch('http://localhost:5000/api/goals', { headers }) // Fetch Goals
        ]);

        const workoutsData = await workoutsRes.json();
        const nutritionData = await nutritionRes.json();
        const statsData = await statsRes.json();
        const goalsData = await goalsRes.json();

        // Calculate Dashboard Stats
        const today = new Date().toDateString();
        let cal = 0;
        nutritionData.forEach(item => { if (new Date(item.date).toDateString() === today) cal += item.calories || 0; });

        let mins = 0, count = 0;
        workoutsData.forEach(item => { 
          if (new Date(item.date).toDateString() === today) { 
            count += 1; 
            mins += item.duration || 0; 
          } 
        });

        const latestStat = statsData[0] || {}; 
        
        setStats({ 
          calories: cal, 
          steps: latestStat.steps || 0, 
          workouts: count, 
          activeMinutes: mins 
        });

        // Filter only Active Goals
        setGoals(goalsData.filter(g => g.status === 'active'));

      } catch (error) { console.error(error); }
    };

    if (user) fetchData();
  }, [user]);

  // Reusable Card Component
  const SummaryCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-[#121212] border border-gray-800 p-4 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">{label}</p>
        <div className="flex items-baseline gap-1">
           <h3 className="text-xl font-bold text-white">{value}</h3>
           <span className="text-xs text-gray-500">{subtext}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 pb-24 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">Here's your fitness breakdown.</p>
        </div>
        <div className="bg-gradient-to-r from-[#D4FF33] to-green-400 text-black px-6 py-3 rounded-xl flex items-center gap-4 shadow-lg shadow-primary/20">
          <div className="bg-black/20 p-2 rounded-full"><Calendar size={24} className="text-black" /></div>
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{dailySuggestion.day}'s Focus</p>
            <h3 className="text-lg font-bold flex items-center gap-2">{dailySuggestion.icon} {dailySuggestion.focus}</h3>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon={Flame} label="Calories" value={stats.calories} subtext="/ 2,500" color="bg-orange-500 text-orange-500" />
        <SummaryCard icon={Footprints} label="Steps" value={stats.steps} subtext="/ 10k" color="bg-green-500 text-green-500" />
        <SummaryCard icon={Activity} label="Active Mins" value={stats.activeMinutes} subtext="/ 60" color="bg-pink-500 text-pink-500" />
        <SummaryCard icon={Dumbbell} label="Workouts" value={stats.workouts} subtext="sessions" color="bg-indigo-500 text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT: Activity Graph (Placeholder) */}
        <div className="md:col-span-2 bg-[#121212] border border-gray-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center h-64">
          <TrendingUp size={32} className="text-[#D4FF33] mb-2" />
          <h3 className="text-lg font-bold text-white">Activity Trends</h3>
          <p className="text-gray-400">Log more workouts to unlock your weekly graph.</p>
        </div>

        {/* RIGHT: Active Goals Widget (NEW) */}
        <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-[#D4FF33]" size={20} />
            <h3 className="font-bold text-lg">Active Goals</h3>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No active goals.</p>
              <p className="text-xs text-gray-600 mt-1">Go to Profile to set one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => { // Show max 3 goals
                const pct = Math.min((goal.currentProgress / goal.targetValue) * 100, 100);
                return (
                  <div key={goal._id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300 font-medium">{goal.title}</span>
                      <span className="text-[#D4FF33] font-bold">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D4FF33] transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-gray-500 text-right mt-1">
                      {goal.currentProgress} / {goal.targetValue} {goal.unit}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;