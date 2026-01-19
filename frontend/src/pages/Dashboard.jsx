import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Activity, Flame, Footprints, Dumbbell, Scale,
  Plus, Calendar, TrendingUp, Zap, ChevronRight, Moon, Droplets, Minus
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import WorkoutModel from '../components/WorkoutModel';
import MealModel from '../components/MealModel';
import BodyStatsModel from '../components/BodyStatsModel';

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Removed 'logout'
  const navigate = useNavigate();
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const [showQuickLogMenu, setShowQuickLogMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showStartOptions, setShowStartOptions] = useState(false); // State for the selection menu
  const [loading, setLoading] = useState(true);
  const [stepsInput, setStepsInput] = useState('');

  const [dashboardData, setDashboardData] = useState({
    caloriesIn: 0, caloriesBurned: 0, activeMinutes: 0, workoutsCount: 0,
    steps: 0, weight: 0, muscleMass: 0, sleep: 0, water: 0
  });
  const [graphData, setGraphData] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  // --- Daily Focus Logic ---
  const getDailyFocus = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const schedule = {
      Monday: { focus: 'Chest & Triceps', icon: '💪', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
      Tuesday: { focus: 'Back & Biceps', icon: '🏋️', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
      Wednesday: { focus: 'Legs & Core', icon: '🦵', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
      Thursday: { focus: 'Shoulders & Abs', icon: '🧘', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
      Friday: { focus: 'Full Body HIIT', icon: '🔥', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
      Saturday: { focus: 'Yoga & Recovery', icon: '🧘', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
      Sunday: { focus: 'Rest Day', icon: '😴', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20' }
    };
    return { day: today, ...schedule[today] };
  };
  const dailySuggestion = getDailyFocus();

  // --- Fetch Data ---
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      const [workoutsRes, nutritionRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/workouts', { headers }),
        fetch('http://localhost:5000/api/nutrition', { headers }),
        fetch('http://localhost:5000/api/stats', { headers })
      ]);
      const [workouts, nutrition, stats] = await Promise.all([workoutsRes.json(), nutritionRes.json(), statsRes.json()]);

      const todayStr = new Date().toDateString();
      const todaysMeals = Array.isArray(nutrition) ? nutrition.filter(n => new Date(n.date).toDateString() === todayStr) : [];
      const calIn = todaysMeals.reduce((a, c) => a + (c.calories || 0), 0);

      const todaysWorkouts = Array.isArray(workouts) ? workouts.filter(w => new Date(w.date).toDateString() === todayStr) : [];
      const calOut = todaysWorkouts.reduce((a, c) => a + (c.caloriesBurned || 0), 0);
      const durationSum = todaysWorkouts.reduce((a, c) => a + (c.duration || 0), 0);

      const sortedStats = Array.isArray(stats) ? stats.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
      const latestStat = sortedStats[0] || {};

      setDashboardData({
        caloriesIn: calIn,
        caloriesBurned: calOut,
        activeMinutes: durationSum,
        workoutsCount: todaysWorkouts.length,
        steps: latestStat.steps || 0,
        weight: latestStat.weight || 0,
        muscleMass: latestStat.muscleMass || 0,
        sleep: latestStat.sleep || 0,
        water: latestStat.water || 0
      });

      setRecentWorkouts(Array.isArray(workouts) ? workouts.slice(0, 3) : []);

      const last7Days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
      const activityGraph = last7Days.map(date => {
        const dateStr = date.toDateString();
        const dayMins = (Array.isArray(workouts) ? workouts : []).filter(w => new Date(w.date).toDateString() === dateStr).reduce((a, c) => a + (c.duration || 0), 0);
        return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), active: dayMins };
      });
      setGraphData(activityGraph);

    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  // --- Update Stat Logic ---
  const updateStat = async (key, changeValue, isDirectSet = false) => {
    let newValue = isDirectSet ? parseFloat(changeValue) : (dashboardData[key] || 0) + changeValue;
    if (newValue < 0) newValue = 0;
    setDashboardData(prev => ({ ...prev, [key]: newValue }));

    try {
      const payload = { weight: dashboardData.weight || 70, [key]: newValue };
      await fetch('http://localhost:5000/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error('Failed to update stat', e);
      fetchData();
    }
  };

  const MetricCard = ({ title, value, subtext, icon: Icon, color, type }) => (
    <div className="bg-[#121212] border border-gray-800 p-4 rounded-2xl flex flex-col justify-between h-full hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}><Icon size={18} className={color} /></div>
        {subtext && <span className="text-[10px] text-gray-500 font-medium uppercase">{subtext}</span>}
      </div>
      <div className="mb-3">
        <h3 className="text-xl font-bold text-white">{value}</h3>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{title}</p>
      </div>

      {type === 'water' && (
        <div className="flex items-center gap-2 mt-auto">
          <button onClick={() => updateStat('water', -0.25)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"><Minus size={14} /></button>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full" style={{ backgroundColor: '#06b6d4', width: `${Math.min((dashboardData.water / 3) * 100, 100)}%` }} /></div>
          <button onClick={() => updateStat('water', 0.25)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"><Plus size={14} /></button>
        </div>
      )}

      {type === 'sleep' && (
        <div className="flex items-center gap-2 mt-auto">
          <button onClick={() => updateStat('sleep', -0.5)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"><Minus size={14} /></button>
          <span className="text-xs text-gray-500 font-mono flex-1 text-center">8h Goal</span>
          <button onClick={() => updateStat('sleep', 0.5)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"><Plus size={14} /></button>
        </div>
      )}

      {type === 'steps' && (
        <div className="flex items-center gap-2 mt-auto">
          <input type="number" placeholder="+Steps" className="w-full bg-black border border-gray-800 rounded-lg py-1 px-2 text-xs text-white" value={stepsInput} onChange={(e) => setStepsInput(e.target.value)} />
          <button onClick={() => { if (!stepsInput) return; updateStat('steps', parseInt(stepsInput), false); setStepsInput(''); }} className="p-1.5 bg-green-900/30 text-green-500 border border-green-500/30 rounded-lg hover:bg-green-500"><Plus size={14} /></button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-white pb-24">
      {/* HEADER: No Logout Button */}
      <div className="flex justify-between items-start mb-8 relative">
        <div>
          <h1 className="text-3xl font-bold">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Here is your daily summary • {todayDate}</p>
        </div>

        <div className="text-right flex items-center gap-2">
          <button onClick={() => setShowQuickLogMenu(!showQuickLogMenu)} className="bg-[#D4FF33] text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all">
            <Plus size={18} /> Quick Log
          </button>
        </div>

        {showQuickLogMenu && (
          <div className="absolute right-0 top-12 bg-[#1e1e1e] border border-gray-700 rounded-xl p-2 w-48 z-50 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => { setActiveModal('workout'); setShowQuickLogMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left rounded-lg"><Dumbbell size={16} className="text-[#D4FF33]" /> Log Workout</button>
            <button onClick={() => { setActiveModal('meal'); setShowQuickLogMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left rounded-lg"><Flame size={16} className="text-orange-500" /> Log Meal</button>
            <button onClick={() => { setActiveModal('stats'); setShowQuickLogMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left rounded-lg"><Scale size={16} className="text-blue-500" /> Log Body Stats</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-2xl relative overflow-hidden border ${dailySuggestion.bg} ${dailySuggestion.border}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-1.5 rounded-md bg-black/20 ${dailySuggestion.color}`}><Calendar size={16} /></div>
            <h3 className={`font-bold text-sm uppercase tracking-wide ${dailySuggestion.color}`}>Today's Focus</h3>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">{dailySuggestion.icon} {dailySuggestion.focus}</h2>
          
          {/* Start Training Button -> Triggers Selection Modal */}
          <button onClick={() => setShowStartOptions(true)} className="w-full bg-[#1e1e1e] hover:bg-black text-white border border-gray-700 font-bold py-3 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all">
            Start Training <ChevronRight size={14} />
          </button>
        </div>

        <div className="lg:col-span-2 bg-[#121212] border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2"><Flame className="text-orange-500" size={20} /><h3 className="font-bold text-lg">Daily Nutrition</h3></div>
            <span className="text-xs text-gray-500 font-mono">Target: 2500 kcal</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Consumed</span><span className="text-white font-bold">{dashboardData.caloriesIn} kcal</span></div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-orange-500" style={{ width: `${Math.min((dashboardData.caloriesIn / 2500) * 100, 100)}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Burned</span><span className="text-[#D4FF33] font-bold">{dashboardData.caloriesBurned} kcal</span></div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-[#D4FF33]" style={{ width: `${Math.min((dashboardData.caloriesBurned / 800) * 100, 100)}%` }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-[#D4FF33]" /> Daily Tracking</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Weight" value={`${dashboardData.weight}`} subtext="kg" icon={Scale} color="text-yellow-500" />
        <MetricCard title="Muscle" value={`${dashboardData.muscleMass}`} subtext="kg" icon={Dumbbell} color="text-purple-500" />
        <MetricCard title="Active" value={dashboardData.activeMinutes} subtext="min" icon={Zap} color="text-[#D4FF33]" />
        <MetricCard title="Steps" value={dashboardData.steps.toLocaleString()} subtext="steps" icon={Footprints} color="text-green-500" type="steps" />
        <MetricCard title="Sleep" value={dashboardData.sleep.toFixed(1)} subtext="hours" icon={Moon} color="text-indigo-400" type="sleep" />
        <MetricCard title="Water" value={dashboardData.water.toFixed(2)} subtext="liters" icon={Droplets} color="text-cyan-400" type="water" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121212] border border-gray-800 p-6 rounded-2xl h-80">
          <h3 className="font-bold flex items-center gap-2 mb-4"><TrendingUp size={20} className="text-[#D4FF33]" /> Activity Volume</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={graphData}><Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} /><Bar dataKey="active" radius={[4, 4, 0, 0]} barSize={30}>{graphData.map((entry, i) => (<Cell key={i} fill={entry.active > 0 ? '#D4FF33' : '#222'} />))}</Bar></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-4">Recent Logs</h3>
          <div className="space-y-4">
            {recentWorkouts.length === 0 ? <p className="text-gray-500 text-sm">No recent activity.</p> : recentWorkouts.map(w => (
              <div key={w._id} className="flex items-center gap-3 pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                <div className="bg-gray-800 p-2 rounded-lg text-[#D4FF33]"><Dumbbell size={16} /></div>
                <div className="flex-1"><h4 className="text-sm font-bold text-white truncate">{w.title}</h4></div>
                <span className="text-xs font-bold text-gray-400">{w.duration}m</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* START TRAINING SELECTION MODAL */}
      {showStartOptions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 w-80 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-center text-white">Choose Training Mode</h3>
            <div className="space-y-3">
              <button onClick={() => { setShowStartOptions(false); navigate('/workouts'); }} className="w-full bg-[#D4FF33] hover:opacity-90 text-black font-bold py-3 rounded-xl transition-all">
                🏋️ Manual Workout
              </button>
              <button onClick={() => { setShowStartOptions(false); navigate('/ai-coach'); }} className="w-full bg-[#1e1e1e] border border-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all">
                🤖 AI Coach
              </button>
            </div>
            <button onClick={() => setShowStartOptions(false)} className="w-full text-gray-500 hover:text-white text-sm mt-4 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <WorkoutModel isOpen={activeModal === 'workout'} onClose={() => setActiveModal(null)} onSave={fetchData} />
      <MealModel isOpen={activeModal === 'meal'} onClose={() => setActiveModal(null)} onSave={fetchData} />
      <BodyStatsModel isOpen={activeModal === 'stats'} onClose={() => setActiveModal(null)} onSave={fetchData} />
    </div>
  );
};

export default Dashboard;