import React, { useState, useEffect, useContext } from 'react';
import { Plus, Activity, Heart, Scale, Percent, Calendar } from 'lucide-react'; 
import { AuthContext } from '../context/AuthContext';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis } from 'recharts';

const BodyStats = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get latest entry for the top cards
  const latest = stats[0] || {}; 

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stats', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) { console.error(err); }
    };
    if(user) fetchStats();
  }, [user]);

  // Format data for the graph (Oldest -> Newest)
  const graphData = [...stats].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: s.weight
  }));

  const StatCard = ({ label, value, unit, icon: Icon, color }) => (
    <div className="bg-[#121212] border border-gray-800 p-5 rounded-xl">
      <div className={`flex items-start justify-between mb-2`}>
        <div className={`p-2 rounded-lg bg-opacity-10 ${color}`}>
          <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
      <p className="text-xs text-gray-400 uppercase font-bold">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
         <span className="text-2xl font-bold text-white">{value || '--'}</span>
         <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 pb-24 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Body Stats</h1>
          <p className="text-gray-400">Track your measurements and progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D4FF33] text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={20} /> Log Stats
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Weight" value={latest.weight} unit="kg" icon={Scale} color="bg-yellow-500 text-yellow-500" />
        <StatCard label="Body Fat" value={latest.bodyFat} unit="%" icon={Percent} color="bg-blue-500 text-blue-500" />
        <StatCard label="Heart Rate" value={latest.heartRate} unit="bpm" icon={Heart} color="bg-red-500 text-red-500" />
        <StatCard label="Steps" value={latest.steps} unit="" icon={Activity} color="bg-green-500 text-green-500" />
      </div>

      {/* Graph Section */}
      <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl mb-6 h-80">
        <h3 className="font-bold mb-4">Weight Trend</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={graphData}>
            <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#121212', borderRadius: '8px', border: '1px solid #333', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="weight" stroke="#D4FF33" strokeWidth={3} dot={{r: 4, fill:'#D4FF33'}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent History List */}
      <div className="space-y-4">
        <h3 className="font-bold">Recent Entries</h3>
        {stats.length === 0 && <p className="text-gray-500 text-sm">No entries yet. Click "Log Stats" to add one.</p>}
        {stats.map((item) => (
           <div key={item._id} className="bg-[#121212] border border-gray-800 p-4 rounded-xl flex justify-between items-center text-sm">
             <div className="flex items-center gap-3 text-gray-500">
               <Calendar size={16} /> {new Date(item.date).toDateString()}
             </div>
             <div className="flex gap-4 font-bold">
               <span>{item.weight} kg</span>
               <span className="text-blue-400">{item.bodyFat}%</span>
               <span className="text-green-500">{item.steps} steps</span>
             </div>
           </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BodyStatsModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => window.location.reload()} 
        />
      )}
    </div>
  );
};

// Internal Modal Component
const BodyStatsModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ weight: '', bodyFat: '', muscleMass: '', steps: '', heartRate: '' });
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
      onSave(); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Log Body Stats</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Weight (kg)</label>
              <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4FF33]" value={formData.weight} onChange={e=>setFormData({...formData, weight: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Body Fat (%)</label>
              <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4FF33]" value={formData.bodyFat} onChange={e=>setFormData({...formData, bodyFat: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Heart Rate</label>
              <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4FF33]" value={formData.heartRate} onChange={e=>setFormData({...formData, heartRate: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Steps Today</label>
              <input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#D4FF33]" value={formData.steps} onChange={e=>setFormData({...formData, steps: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#D4FF33] text-black font-bold py-3 rounded-xl mt-4 hover:opacity-90">
            {loading ? 'Saving...' : 'Save Stats'}
          </button>
          <button type="button" onClick={onClose} className="w-full mt-2 text-sm text-gray-500 hover:text-white">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default BodyStats;