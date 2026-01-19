import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Ruler, Weight, Activity, ArrowRight, User } from 'lucide-react';

const Onboarding = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: '',
    height: '',
    weight: '',
    fitnessGoal: 'General Health' // Default
  });

  const goals = ["Weight Loss", "Muscle Gain", "General Health", "Endurance"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // 🔐 Crucial: Sending the token
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Update local storage with new profile data
        const updatedUser = { ...user, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Redirect to the main dashboard
        navigate('/dashboard'); 
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#D4FF33] rounded-full filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-[#121212] border border-white/5 rounded-3xl p-8 z-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            Let's customize your <span className="text-[#D4FF33]">Plan</span>
          </h1>
          <p className="text-gray-400">Tell us about yourself so the AI can build your perfect routine.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. GENDER SELECTION */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Gender</label>
            <div className="flex gap-4">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({...formData, gender: g})}
                  className={`flex-1 py-4 rounded-xl border-2 font-bold transition-all ${
                    formData.gender === g 
                      ? 'border-[#D4FF33] bg-[#D4FF33]/10 text-[#D4FF33]' 
                      : 'border-white/10 bg-[#181818] text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 2. STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Age */}
            <div className="relative group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Age</label>
              <User className="absolute left-4 top-[38px] text-gray-500 group-focus-within:text-[#D4FF33]" size={18} />
              <input 
                type="number" 
                required
                className="w-full bg-[#181818] border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#D4FF33] focus:outline-none transition-all"
                placeholder="21"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>

            {/* Height */}
            <div className="relative group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Height (cm)</label>
              <Ruler className="absolute left-4 top-[38px] text-gray-500 group-focus-within:text-[#D4FF33]" size={18} />
              <input 
                type="number" 
                required
                className="w-full bg-[#181818] border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#D4FF33] focus:outline-none transition-all"
                placeholder="175"
                value={formData.height}
                onChange={e => setFormData({...formData, height: e.target.value})}
              />
            </div>

            {/* Weight */}
            <div className="relative group">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Weight (kg)</label>
              <Weight className="absolute left-4 top-[38px] text-gray-500 group-focus-within:text-[#D4FF33]" size={18} />
              <input 
                type="number" 
                required
                className="w-full bg-[#181818] border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#D4FF33] focus:outline-none transition-all"
                placeholder="70"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: e.target.value})}
              />
            </div>
          </div>

          {/* 3. GOAL SELECTION */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Primary Goal</label>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setFormData({...formData, fitnessGoal: goal})}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    formData.fitnessGoal === goal
                      ? 'bg-white text-black border-white'
                      : 'bg-[#181818] border-white/5 text-gray-400 hover:bg-[#222]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{goal}</span>
                    {formData.fitnessGoal === goal && <Activity size={16} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#D4FF33] text-black font-black uppercase italic tracking-wider py-5 rounded-xl hover:opacity-90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,255,51,0.2)]"
          >
            {loading ? 'Updating Profile...' : 'Complete Profile'} <ArrowRight size={20} />
          </button>

        </form>
      </div>
    </div>
  );
};

export default Onboarding;