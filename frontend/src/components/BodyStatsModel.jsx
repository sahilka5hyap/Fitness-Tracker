import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Calendar, Activity, Ruler, FileText, Save } from 'lucide-react';

const BodyStatsModel = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  // Expanded Form Data
  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], // Default to today
    weight: '', bodyFat: '', muscleMass: '', waterPercent: '',
    waist: '', chest: '', arms: '', legs: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(formData)
      });
      onSave(); 
      onClose(); 
      // Reset form (optional, or keep date)
      setFormData({ ...formData, weight: '', bodyFat: '', notes: '' }); 
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-gray-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative my-8">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-[#D4FF33]" size={24} /> Log Body Stats
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Core Metrics */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Core Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Date</label>
                <input type="date" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" 
                  value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Weight (kg)</label>
                <input type="number" step="0.1" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" 
                  value={formData.weight} onChange={e=>setFormData({...formData, weight: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Body Fat (%)</label>
                <input type="number" step="0.1" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" 
                  value={formData.bodyFat} onChange={e=>setFormData({...formData, bodyFat: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Muscle Mass (kg)</label>
                <input type="number" step="0.1" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" 
                  value={formData.muscleMass} onChange={e=>setFormData({...formData, muscleMass: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section 2: Measurements */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Ruler size={14} /> Measurements (cm)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><label className="text-xs text-gray-400 mb-1 block">Waist</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" value={formData.waist} onChange={e=>setFormData({...formData, waist: e.target.value})} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Chest</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" value={formData.chest} onChange={e=>setFormData({...formData, chest: e.target.value})} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Arms</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" value={formData.arms} onChange={e=>setFormData({...formData, arms: e.target.value})} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">Legs</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-[#D4FF33] focus:outline-none" value={formData.legs} onChange={e=>setFormData({...formData, legs: e.target.value})} /></div>
            </div>
          </div>

          {/* Section 3: Notes */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText size={14} /> Notes
            </h3>
            <textarea 
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-[#D4FF33] focus:outline-none resize-none h-24"
              placeholder="How are you feeling? Any progress photos taken?"
              value={formData.notes}
              onChange={e=>setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-[#D4FF33] text-black font-bold py-4 rounded-xl hover:opacity-90 transition flex justify-center items-center gap-2"
          >
            {loading ? 'Saving Entry...' : <><Save size={20} /> Save Entry</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BodyStatsModel;