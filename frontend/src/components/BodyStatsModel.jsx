import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X } from 'lucide-react'; // Added Close Icon

const BodyStatsModel = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ weight: '', bodyFat: '', heartRate: '', steps: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(formData)
      });
      onSave(); // Refresh dashboard data
      onClose(); // Close modal
      setFormData({ weight: '', bodyFat: '', heartRate: '', steps: '' }); // Reset form
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Log Body Stats</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Weight (kg)</label>
              <input 
                type="number" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" 
                value={formData.weight} 
                onChange={e=>setFormData({...formData, weight: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Body Fat (%)</label>
              <input 
                type="number" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" 
                value={formData.bodyFat} 
                onChange={e=>setFormData({...formData, bodyFat: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Heart Rate</label>
              <input 
                type="number" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" 
                value={formData.heartRate} 
                onChange={e=>setFormData({...formData, heartRate: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Steps</label>
              <input 
                type="number" 
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" 
                value={formData.steps} 
                onChange={e=>setFormData({...formData, steps: e.target.value})} 
              />
            </div>
          </div>
          
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-[#D4FF33] text-black font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition"
          >
            {loading ? 'Saving...' : 'Save Stats'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BodyStatsModel;