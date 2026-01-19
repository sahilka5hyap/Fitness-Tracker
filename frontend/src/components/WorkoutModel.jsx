import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { X, Dumbbell, Search, Database } from 'lucide-react';

const WorkoutModel = ({ isOpen, onClose, onSave }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  // Search
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    title: '', 
    date: new Date().toISOString().split('T')[0],
    sets: '', reps: '', weight: '', 
    duration: '', caloriesBurned: '', distance: ''
  });

  // 1. UPDATED URL: Fetch from /api/workouts/search
  useEffect(() => {
    if(!isOpen) return;
    const fetchExercises = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/workouts/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) { console.error(err); }
    };
    const delayDebounceFn = setTimeout(() => fetchExercises(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, isOpen]);

  const handleSelect = (ex) => {
    setSelectedExercise(ex);
    setFormData({ ...formData, title: ex.name }); // Lock in the title
    setQuery('');
  };

  // 2. UPDATED URL: Seed to /api/workouts/seed
  const handleSeed = async () => {
    if(window.confirm("Seed Exercise Database?")) {
      await fetch('http://localhost:5000/api/workouts/seed', { method: 'POST' });
      setQuery(' '); setTimeout(()=>setQuery(''), 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 3. FIX: Use search query as title if nothing selected
    const finalTitle = formData.title || query;

    if (!finalTitle) {
      alert("Please select an exercise or type a name.");
      setLoading(false);
      return;
    }

    const payload = {
        ...formData,
        title: finalTitle,
        exerciseName: selectedExercise?.name || finalTitle,
        muscleGroup: selectedExercise?.muscleGroup || 'Custom'
    };

    try {
      const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(payload)
      });
      
      if(res.ok) {
        onSave(); 
        onClose();
        // Reset Form
        setFormData({ title: '', date: new Date().toISOString().split('T')[0], sets: '', reps: '', weight: '', duration: '', caloriesBurned: '' });
        setSelectedExercise(null);
        setQuery('');
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[#121212] border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="text-[#D4FF33]" size={24} /> Log Workout
          </h2>
          <div className="flex gap-2">
            <button onClick={handleSeed} className="text-gray-600 hover:text-blue-500" title="Reset Database"><Database size={18}/></button>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-4 shrink-0 relative">
          <div className="absolute left-3 top-3 text-gray-500"><Search size={18} /></div>
          <input 
            type="text" 
            placeholder="Search exercise (e.g. 'Bench', 'Run')" 
            className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl p-3 pl-10 text-white focus:border-[#D4FF33] focus:outline-none"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // Clear selection if user types something new
              if(selectedExercise) { setSelectedExercise(null); setFormData({...formData, title: ''}); }
            }}
          />
          {/* Quick List */}
          {!selectedExercise && (
             <div className="mt-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {results.map(ex => (
                   <button key={ex._id} onClick={() => handleSelect(ex)} className="whitespace-nowrap bg-[#1e1e1e] hover:bg-[#D4FF33] hover:text-black border border-gray-800 text-gray-300 px-3 py-2 rounded-lg text-xs font-medium transition-colors">
                      {ex.name}
                   </button>
                ))}
             </div>
          )}
        </div>

        {/* FORM */}
        <div className="overflow-y-auto pr-1 custom-scrollbar">
           <form onSubmit={handleSubmit} className="space-y-5">
              
              {selectedExercise ? (
                  <div className="bg-[#1a1a1a] p-3 rounded-xl border border-gray-800 flex justify-between items-center">
                      <div>
                          <span className="text-xs text-gray-500 uppercase font-bold">{selectedExercise.muscleGroup}</span>
                          <div className="font-bold text-white">{selectedExercise.name}</div>
                      </div>
                      <button type="button" onClick={() => { setSelectedExercise(null); setQuery(''); }} className="text-xs text-[#D4FF33] hover:underline">Change</button>
                  </div>
              ) : query && (
                <div className="text-xs text-gray-500 italic">
                  Creating custom workout: <span className="text-white font-bold">"{query}"</span>
                </div>
              )}

              {/* Strength Section */}
              {(!selectedExercise || selectedExercise.category !== 'Cardio') && (
                  <div className="grid grid-cols-3 gap-4">
                      <div><label className="text-xs text-gray-500 mb-1 block">Sets</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" value={formData.sets} onChange={e=>setFormData({...formData, sets: e.target.value})} /></div>
                      <div><label className="text-xs text-gray-500 mb-1 block">Reps</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" value={formData.reps} onChange={e=>setFormData({...formData, reps: e.target.value})} /></div>
                      <div><label className="text-xs text-gray-500 mb-1 block">Weight (kg)</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" value={formData.weight} onChange={e=>setFormData({...formData, weight: e.target.value})} /></div>
                  </div>
              )}

              {/* Cardio / Time Section */}
              <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-xs text-gray-500 mb-1 block">Duration (min)</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" value={formData.duration} onChange={e=>setFormData({...formData, duration: e.target.value})} /></div>
                   <div><label className="text-xs text-gray-500 mb-1 block">Calories</label><input type="number" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" value={formData.caloriesBurned} onChange={e=>setFormData({...formData, caloriesBurned: e.target.value})} /></div>
              </div>

              <div><label className="text-xs text-gray-500 mb-1 block">Date</label><input type="date" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:border-[#D4FF33] focus:outline-none" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} /></div>

              <button disabled={loading} type="submit" className="w-full bg-[#D4FF33] text-black font-bold py-3.5 rounded-xl mt-4 hover:opacity-90 transition">
                {loading ? 'Saving...' : 'Log Workout'}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default WorkoutModel;