import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Scale, Percent, Activity, Calendar, TrendingUp, TrendingDown, 
  Ruler, User, Droplets, Dumbbell 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis, CartesianGrid 
} from 'recharts';
import BodyStatsModel from '../components/BodyStatsModel';

const BodyStats = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // To get height for BMI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      
      const [statsRes, profileRes] = await Promise.all([
        fetch('http://localhost:5000/api/stats', { headers }),
        fetch('http://localhost:5000/api/users/profile', { headers })
      ]);

      const statsData = await statsRes.json();
      const profileData = await profileRes.json();

      setStats(statsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setUserProfile(profileData);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if(user) fetchData(); }, [user]);

  // Derived Metrics
  const current = stats[0] || {};
  const previous = stats[1] || {};
  
  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return { val: '--', status: '' };
    const h = height / 100;
    const bmi = (weight / (h * h)).toFixed(1);
    let status = 'Normal';
    if(bmi < 18.5) status = 'Underweight';
    else if(bmi >= 25) status = 'Overweight';
    return { val: bmi, status };
  };

  const bmiData = calculateBMI(current.weight, userProfile?.height);
  const weightChange = current.weight && previous.weight ? (current.weight - previous.weight).toFixed(1) : 0;

  // Graph Data
  const graphData = [...stats].reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: s.weight,
    bodyFat: s.bodyFat
  }));

  const MetricCard = ({ label, value, unit, icon: Icon, color, change, subtext }) => (
    <div className="bg-[#121212] border border-gray-800 p-5 rounded-2xl relative flex flex-col justify-between min-h-[140px]">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg bg-opacity-10 ${color}`}>
          <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
        {change !== undefined && change !== 0 && (
          <div className={`flex items-center text-xs font-bold ${change < 0 ? 'text-[#D4FF33]' : 'text-red-500'}`}>
            {change < 0 ? <TrendingDown size={14} className="mr-1"/> : <TrendingUp size={14} className="mr-1"/>}
            {Math.abs(change)}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</p>
        <div className="flex items-end gap-2">
           <span className="text-3xl font-bold text-white">{value || '--'}</span>
           <span className="text-sm text-gray-400 font-medium mb-1">{unit}</span>
        </div>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="p-6 pb-24 min-h-screen text-white">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Body Composition</h1>
          <p className="text-gray-400">Detailed biometrics and progress tracking</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D4FF33] text-black font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-[#D4FF33]/20"
        >
          <Plus size={20} /> Log New Entry
        </button>
      </div>

      {/* 1. CORE METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          label="Current Weight" value={current.weight} unit="kg" 
          icon={Scale} color="bg-yellow-500 text-yellow-500" 
          change={Number(weightChange)} 
        />
        <MetricCard 
          label="Body Mass Index" value={bmiData.val} unit="BMI" 
          icon={Activity} color="bg-purple-500 text-purple-500" 
          subtext={bmiData.status}
        />
        <MetricCard 
          label="Body Fat" value={current.bodyFat} unit="%" 
          icon={Percent} color="bg-blue-500 text-blue-500" 
        />
        <MetricCard 
          label="Muscle Mass" value={current.muscleMass} unit="kg" 
          icon={Dumbbell} color="bg-red-500 text-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* 2. GRAPH SECTION */}
        <div className="lg:col-span-2 bg-[#121212] border border-gray-800 p-6 rounded-2xl h-80 relative">
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#D4FF33]" />
                  <h3 className="font-bold">Weight Progress</h3>
              </div>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="date" stroke="#555" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} dx={-10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' }} itemStyle={{ color: '#D4FF33' }} />
              <Line type="monotone" dataKey="weight" stroke="#D4FF33" strokeWidth={3} dot={{r: 4, fill:'#0A0A0A', stroke:'#D4FF33', strokeWidth: 2}} activeDot={{r: 6, fill:'#D4FF33'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 3. MEASUREMENTS CARD */}
        <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
             <Ruler size={20} className="text-blue-400" />
             <h3 className="font-bold">Measurements</h3>
          </div>
          <div className="space-y-6">
             <div className="flex justify-between items-center border-b border-gray-800 pb-3">
               <span className="text-gray-400 text-sm">Waist</span>
               <span className="font-bold text-lg">{current.waist || '--'} <span className="text-xs text-gray-600">cm</span></span>
             </div>
             <div className="flex justify-between items-center border-b border-gray-800 pb-3">
               <span className="text-gray-400 text-sm">Chest</span>
               <span className="font-bold text-lg">{current.chest || '--'} <span className="text-xs text-gray-600">cm</span></span>
             </div>
             <div className="flex justify-between items-center border-b border-gray-800 pb-3">
               <span className="text-gray-400 text-sm">Arms</span>
               <span className="font-bold text-lg">{current.arms || '--'} <span className="text-xs text-gray-600">cm</span></span>
             </div>
             <div className="flex justify-between items-center pb-1">
               <span className="text-gray-400 text-sm">Legs</span>
               <span className="font-bold text-lg">{current.legs || '--'} <span className="text-xs text-gray-600">cm</span></span>
             </div>
          </div>
        </div>
      </div>

      {/* 4. HISTORY LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Detailed History</h3>
        {stats.map((item) => (
           <div key={item._id} className="bg-[#121212] border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-700 transition-colors">
             <div className="flex items-center gap-4 text-gray-400 min-w-[150px]">
               <div className="p-2 bg-gray-900 rounded-lg text-[#D4FF33]"><Calendar size={18} /></div>
               <div>
                  <span className="font-bold text-white block">{new Date(item.date).toLocaleDateString()}</span>
                  <span className="text-xs">{new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
               </div>
             </div>
             
             <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
               <div><span className="block text-xs text-gray-500 uppercase">Weight</span><span className="font-bold text-white">{item.weight} kg</span></div>
               <div><span className="block text-xs text-gray-500 uppercase">Body Fat</span><span className="font-bold text-blue-400">{item.bodyFat ? item.bodyFat + '%' : '--'}</span></div>
               <div><span className="block text-xs text-gray-500 uppercase">Muscle</span><span className="font-bold text-white">{item.muscleMass ? item.muscleMass + ' kg' : '--'}</span></div>
               <div className="md:text-right hidden md:block">
                 {item.notes && <span className="text-xs text-gray-500 italic truncate max-w-[150px] inline-block" title={item.notes}>{item.notes}</span>}
               </div>
             </div>
           </div>
        ))}
      </div>

      <BodyStatsModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} />
    </div>
  );
};

export default BodyStats;