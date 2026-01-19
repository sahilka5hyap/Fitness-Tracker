import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  User, Mail, Calendar, Ruler, Weight, Activity, 
  LogOut, Save, ShieldCheck 
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  
  // State
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [stats, setStats] = useState({ workouts: 0, calories: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '', // Current weight for BMI
    fitnessGoal: 'General Health',
    gender: 'Not Specified',
    joinDate: ''
  });

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return '--';
  };
  const bmi = calculateBMI();

  // Get BMI Category
  const getBMICategory = (bmi) => {
    if (bmi === '--') return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 24.9) return 'Normal Weight';
    if (bmi < 29.9) return 'Overweight';
    return 'Obese';
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };
        
        // 1. Profile Data
        const profileRes = await fetch('http://localhost:5000/api/users/profile', { headers });
        const profile = await profileRes.json();

        // 2. Workout Data (for totals)
        const workoutsRes = await fetch('http://localhost:5000/api/workouts', { headers });
        const workouts = await workoutsRes.json();
        const totalCals = workouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
        
        // 3. Get latest weight from Body Stats
        const statsRes = await fetch('http://localhost:5000/api/stats', { headers });
        const bodyStats = await statsRes.json();
        const latestWeight = bodyStats.length > 0 ? bodyStats[0].weight : profile.weight;

        setStats({ workouts: workouts.length, calories: totalCals });

        setFormData({
          name: profile.name,
          email: profile.email,
          age: profile.age || '',
          height: profile.height || '',
          weight: latestWeight || '', 
          fitnessGoal: profile.fitnessGoal || 'General Health',
          gender: profile.gender || 'Not Specified',
          joinDate: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });

      } catch (error) { console.error("Error fetching profile", error); }
    };
    fetchData();
  }, [user]);

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          height: formData.height,
          fitnessGoal: formData.fitnessGoal,
          gender: formData.gender
        }),
      });
      if (response.ok) setMsg('Profile updated successfully!');
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen p-6 pb-24 text-white">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 transition text-sm font-bold"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: Identity Card & Stats */}
        <div className="space-y-6">
          
          {/* Identity Card */}
          <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#D4FF33] rounded-full flex items-center justify-center text-black text-4xl font-bold mb-4 shadow-lg shadow-[#D4FF33]/20">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold">{formData.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
            <div className="bg-[#1e1e1e] px-3 py-1 rounded-full text-xs text-gray-400 flex items-center gap-2">
              <Calendar size={12} /> Member since {formData.joinDate}
            </div>
          </div>

          {/* BMI Card */}
          <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-[#D4FF33]"/> BMI Calculator</h3>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-4xl font-bold text-white">{bmi}</span>
                <p className="text-sm text-gray-400 mt-1">{getBMICategory(bmi)}</p>
              </div>
              <div className="text-right text-xs text-gray-500">
                Based on {formData.height}cm & {formData.weight}kg
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COL: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-[#121212] border border-gray-800 p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#D4FF33]" /> Personal Details
            </h3>

            {msg && (
              <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm text-center">
                {msg}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input 
                      type="text" 
                      className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-10 text-white focus:border-[#D4FF33] focus:outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input 
                      type="email" 
                      disabled
                      className="w-full bg-[#1e1e1e] border border-gray-800 rounded-xl p-3 pl-10 text-gray-400 cursor-not-allowed"
                      value={formData.email}
                    />
                  </div>
                </div>
              </div>

              {/* Physical Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Age</label>
                  <input 
                    type="number" 
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white focus:border-[#D4FF33] focus:outline-none"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Height (cm)</label>
                  <div className="relative">
                     <Ruler size={16} className="absolute left-3 top-3.5 text-gray-500" />
                     <input 
                      type="number" 
                      className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 pl-9 text-white focus:border-[#D4FF33] focus:outline-none"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Weight (kg)</label>
                  <div className="relative">
                     <Weight size={16} className="absolute left-3 top-3.5 text-gray-500" />
                     <input 
                      type="number" 
                      disabled // Edit in Body Stats page, usually
                      className="w-full bg-[#1e1e1e] border border-gray-800 rounded-xl p-3 pl-9 text-gray-400 cursor-not-allowed"
                      value={formData.weight}
                      title="Update this in the Body Stats section"
                    />
                  </div>
                </div>
              </div>

              {/* Goals & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Primary Goal</label>
                  <select 
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white focus:border-[#D4FF33] focus:outline-none appearance-none"
                    value={formData.fitnessGoal}
                    onChange={(e) => setFormData({...formData, fitnessGoal: e.target.value})}
                  >
                    <option>General Health</option>
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Endurance</option>
                    <option>Flexibility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Gender</label>
                  <select 
                    className="w-full bg-[#0A0A0A] border border-gray-800 rounded-xl p-3 text-white focus:border-[#D4FF33] focus:outline-none appearance-none"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option>Not Specified</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-Binary</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#D4FF33] text-black font-bold py-4 rounded-xl hover:opacity-90 transition flex justify-center items-center gap-2"
                >
                  {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;