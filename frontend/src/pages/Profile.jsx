import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  User, Calendar, Dumbbell, Flame, Trophy, Save, 
  Target, Plus, CheckCircle, TrendingUp 
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: '', email: '', age: '', height: '', fitnessGoal: 'General Health', joinDate: ''
  });
  const [stats, setStats] = useState({ workouts: 0, calories: 0, achievements: 0 });
  
  // Goals State
  const [goals, setGoals] = useState([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  
  const [msg, setMsg] = useState('');

  // Fetch All Data
  const fetchAllData = async () => {
    if (!user?.token) return;
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      
      // 1. Fetch Profile
      const profileRes = await fetch('http://localhost:5000/api/users/profile', { headers });
      const profile = await profileRes.json();
      
      // 2. Fetch Workouts (for stats)
      const workoutsRes = await fetch('http://localhost:5000/api/workouts', { headers });
      const workouts = await workoutsRes.json();
      
      // 3. Fetch Goals
      const goalsRes = await fetch('http://localhost:5000/api/goals', { headers });
      const goalsData = await goalsRes.json();

      const totalCals = workouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

      setProfileData({
        name: profile.name,
        email: profile.email,
        age: profile.age || '',
        height: profile.height || '',
        fitnessGoal: profile.fitnessGoal || 'General Health',
        joinDate: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });

      setStats({ 
        workouts: workouts.length, 
        calories: totalCals, 
        achievements: profile.achievements?.length || 0 
      });

      setGoals(goalsData);

    } catch (error) { console.error("Error fetching data", error); }
  };

  useEffect(() => { fetchAllData(); }, [user]);

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ 
          name: profileData.name, 
          age: profileData.age, 
          height: profileData.height, 
          fitnessGoal: profileData.fitnessGoal 
        }),
      });
      if (response.ok) setMsg('Profile updated successfully!');
    } catch (error) { console.error(error); }
  };

  // Handle Goal Progress Update
  const updateGoalProgress = async (goalId, current, target) => {
    const newProgress = Math.min(current + 1, target); 
    await fetch(`http://localhost:5000/api/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
      body: JSON.stringify({ currentProgress: newProgress })
    });
    fetchAllData(); // Refresh list
  };

  const activeGoals = goals.filter(g => g.status === 'active');

  return (
    <div className="min-h-screen p-6 pb-24 bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div><h1 className="text-3xl font-bold">Profile & Goals</h1><p className="text-gray-400">Manage your account and targets</p></div>
        <button onClick={logout} className="text-red-500 text-sm font-bold border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10 transition">Sign Out</button>
      </div>

      {/* User Info Card */}
      <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="h-20 w-20 bg-[#D4FF33] rounded-full flex items-center justify-center text-3xl font-bold text-black">{profileData.name.charAt(0).toUpperCase()}</div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold">{profileData.name}</h2>
          <p className="text-gray-400">{profileData.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-xs font-medium bg-[#D4FF33]/10 text-[#D4FF33] w-fit mx-auto md:mx-0 px-3 py-1 rounded-full"><Calendar size={12} /> Member since {profileData.joinDate}</div>
        </div>
        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
          <div className="text-center"><div className="text-[#D4FF33] font-bold text-xl flex justify-center items-center gap-1"><Dumbbell size={16}/> {stats.workouts}</div><p className="text-xs text-gray-500 uppercase">Workouts</p></div>
          <div className="text-center"><div className="text-orange-500 font-bold text-xl flex justify-center items-center gap-1"><Flame size={16}/> {stats.calories}</div><p className="text-xs text-gray-500 uppercase">Calories</p></div>
          <div className="text-center"><div className="text-yellow-500 font-bold text-xl flex justify-center items-center gap-1"><Trophy size={16}/> {stats.achievements}</div><p className="text-xs text-gray-500 uppercase">Badges</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: ACTIVE GOALS */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><Target size={20} className="text-[#D4FF33]"/> My Goals</h3>
            <button onClick={() => setIsGoalModalOpen(true)} className="text-xs bg-[#121212] border border-gray-700 px-3 py-1 rounded-lg hover:border-[#D4FF33] flex items-center gap-1"><Plus size={14}/> Add Goal</button>
          </div>

          <div className="space-y-4">
            {activeGoals.length === 0 ? (
              <div className="bg-[#121212] border border-gray-800 p-8 rounded-2xl text-center text-gray-500 text-sm">
                No active goals. Set a target to stay motivated!
              </div>
            ) : (
              activeGoals.map(goal => {
                const pct = Math.min((goal.currentProgress / goal.targetValue) * 100, 100);
                return (
                  <div key={goal._id} className="bg-[#121212] border border-gray-800 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div><h3 className="font-bold text-white">{goal.title}</h3><p className="text-xs text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p></div>
                      <span className="text-[#D4FF33] font-bold text-sm">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-2"><div className="h-full bg-[#D4FF33]" style={{ width: `${pct}%` }}></div></div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{goal.currentProgress} / {goal.targetValue} {goal.unit}</span>
                      <button onClick={() => updateGoalProgress(goal._id, goal.currentProgress, goal.targetValue)} className="text-[#D4FF33] hover:underline font-bold">+ Log Progress</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT PROFILE */}
        <div>
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20} className="text-blue-400"/> Personal Details</h3>
           <form onSubmit={handleUpdateProfile} className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
            {msg && <p className="mb-4 text-green-500 text-sm">{msg}</p>}
            <div className="space-y-4">
              <div><label className="block text-sm mb-1 text-gray-400">Full Name</label><input type="text" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1 text-gray-400">Age</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={profileData.age} onChange={(e) => setProfileData({...profileData, age: e.target.value})} /></div>
                <div><label className="block text-sm mb-1 text-gray-400">Height (cm)</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={profileData.height} onChange={(e) => setProfileData({...profileData, height: e.target.value})} /></div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-400">Primary Focus</label>
                <select className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={profileData.fitnessGoal} onChange={(e) => setProfileData({...profileData, fitnessGoal: e.target.value})}>
                  <option>General Health</option><option>Weight Loss</option><option>Muscle Gain</option><option>Endurance</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#D4FF33] text-black font-bold py-3 rounded-xl mt-6 hover:opacity-90 flex justify-center items-center gap-2"><Save size={18}/> Save Changes</button>
          </form>
        </div>
      </div>

      {/* CREATE GOAL MODAL */}
      {isGoalModalOpen && (
        <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onSave={fetchAllData} />
      )}
    </div>
  );
};

// Internal Goal Modal Component
const GoalModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: '', targetValue: '', unit: '', deadline: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(formData)
    });
    onSave(); onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Create New Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs text-gray-500 mb-1 block">Goal Title</label><input type="text" placeholder="e.g. Lose 5kg" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 mb-1 block">Target Value</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={formData.targetValue} onChange={e=>setFormData({...formData, targetValue: e.target.value})} /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Unit</label><input type="text" placeholder="kg, steps" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={formData.unit} onChange={e=>setFormData({...formData, unit: e.target.value})} /></div>
          </div>
          <div><label className="text-xs text-gray-500 mb-1 block">Deadline</label><input type="date" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white" value={formData.deadline} onChange={e=>setFormData({...formData, deadline: e.target.value})} /></div>
          <button type="submit" className="w-full bg-[#D4FF33] text-black font-bold py-3 rounded-xl mt-4">Create Goal</button>
          <button type="button" onClick={onClose} className="w-full mt-2 text-sm text-gray-500 hover:text-white">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;