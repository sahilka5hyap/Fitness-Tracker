import React, { useState, useContext } from 'react';
import { X, Dumbbell, Clock, Flame, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const WorkoutModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Strength',
    duration: '',
    caloriesBurned: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave(); // Refresh parent data
        onClose(); // Close modal
        setFormData({ name: '', type: 'Strength', duration: '', caloriesBurned: '', notes: '' }); // Reset form
      } else {
        alert("Failed to save workout");
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
            <Dumbbell className="text-primary" /> Log New Workout
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Workout Name</label>
            <input 
              type="text" 
              placeholder="e.g., Morning Run" 
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          {/* Type Dropdown */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Type</label>
            <select 
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option>Strength</option>
              <option>Cardio</option>
              <option>Yoga</option>
              <option>HIIT</option>
              <option>Sports</option>
            </select>
          </div>

          {/* Duration & Calories Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><Clock size={14}/> Duration (min)</label>
              <input 
                type="number" 
                placeholder="45" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><Flame size={14}/> Calories</label>
              <input 
                type="number" 
                placeholder="300" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({...formData, caloriesBurned: e.target.value})}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block flex items-center gap-1"><FileText size={14}/> Notes (optional)</label>
            <textarea 
              rows="3"
              placeholder="How did it go?" 
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Workout'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutModal;