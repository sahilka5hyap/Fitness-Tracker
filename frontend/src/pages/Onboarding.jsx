import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Onboarding = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '', // We'll log this as a BodyStat too if needed
    fitnessGoal: 'General Health'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!user?.token) return;

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Onboarding failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="mt-10 mb-8">
        <h1 className="text-3xl font-bold mb-2">Let's get to know you</h1>
        <p className="text-gray-400">We need a few details to customize your plan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 mb-2">Age</label>
          <input 
            type="number" 
            className="w-full bg-card border border-gray-800 rounded-xl p-4 text-white text-lg focus:border-primary focus:outline-none"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2">Height (cm)</label>
            <input 
              type="number" 
              className="w-full bg-card border border-gray-800 rounded-xl p-4 text-white text-lg focus:border-primary focus:outline-none"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Weight (kg)</label>
            <input 
              type="number" 
              className="w-full bg-card border border-gray-800 rounded-xl p-4 text-white text-lg focus:border-primary focus:outline-none"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Main Goal</label>
          <select 
            className="w-full bg-card border border-gray-800 rounded-xl p-4 text-white text-lg focus:border-primary focus:outline-none appearance-none"
            value={formData.fitnessGoal}
            onChange={(e) => setFormData({...formData, fitnessGoal: e.target.value})}
          >
            <option>General Health</option>
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
            <option>Endurance</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-primary text-black font-bold text-lg py-4 rounded-xl mt-8">
          Start Journey
        </button>
      </form>
    </div>
  );
};

export default Onboarding;