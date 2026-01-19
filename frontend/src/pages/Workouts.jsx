import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Dumbbell, Calendar, ChevronRight, Clock, Flame, Repeat 
} from 'lucide-react';
import WorkoutModel from '../components/WorkoutModel';

const Workouts = () => {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Daily Routine Logic
  const getDailyRoutine = () => {
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const routines = {
      'Monday': { title: 'International Chest Day', focus: 'Chest & Triceps', exercises: ['Bench Press', 'Incline Dumbbell Press', 'Tricep Dips'] },
      'Tuesday': { title: 'Back Attack', focus: 'Back & Biceps', exercises: ['Deadlift', 'Pull Ups', 'Barbell Rows'] },
      'Wednesday': { title: 'Leg Day', focus: 'Legs & Core', exercises: ['Squats', 'Leg Press', 'Calf Raises'] },
      'Thursday': { title: 'Shoulder Boulder', focus: 'Shoulders & Abs', exercises: ['Overhead Press', 'Lateral Raises', 'Face Pulls'] },
      'Friday': { title: 'Full Body HIIT', focus: 'Cardio & Conditioning', exercises: ['Burpees', 'Kettlebell Swings', 'Sprints'] },
      'Saturday': { title: 'Active Recovery', focus: 'Yoga / Light Cardio', exercises: ['Stretching', 'Light Jog', 'Foam Rolling'] },
      'Sunday': { title: 'Rest Day', focus: 'Rest & Meal Prep', exercises: ['Sleep', 'Hydrate', 'Relax'] }
    };
    return { day, ...routines[day] };
  };
  const daily = getDailyRoutine();

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setWorkouts(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if(user) fetchWorkouts(); }, [user]);

  return (
    <div className="p-6 pb-24 min-h-screen text-white">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Workouts</h1>
          <p className="text-gray-400">Log your training and track progress</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D4FF33] text-black font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-[#D4FF33]/20"
        >
          <Plus size={20} /> Log Workout
        </button>
      </div>

      {/* DAILY ROUTINE CARD */}
      <div className="bg-gradient-to-r from-[#1e1e1e] to-[#121212] border border-gray-800 p-6 rounded-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4FF33] blur-[80px] opacity-10 rounded-full pointer-events-none"></div>
        
        <div className="flex items-center gap-2 mb-2">
           <Calendar className="text-[#D4FF33]" size={18} />
           <span className="text-xs font-bold text-[#D4FF33] uppercase tracking-wider">{daily.day}'s Routine</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-1">{daily.title}</h2>
        <p className="text-gray-400 text-sm mb-6">Focus: {daily.focus}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {daily.exercises.map((ex, i) => (
             <div key={i} className="bg-black/30 border border-white/5 p-3 rounded-lg flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-gray-300">{i+1}</div>
               <span className="text-sm font-medium text-gray-200">{ex}</span>
             </div>
          ))}
        </div>
      </div>

      {/* HISTORY LIST */}
      <h3 className="font-bold text-lg mb-4">Recent Logs</h3>
      <div className="space-y-3">
        {workouts.length === 0 ? (
           <div className="text-center py-10 text-gray-500">No workouts logged yet.</div>
        ) : (
           workouts.map((workout) => (
             <div key={workout._id} className="bg-[#121212] border border-gray-800 p-5 rounded-xl flex justify-between items-center hover:border-gray-600 transition-colors group">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-gray-900 rounded-xl text-[#D4FF33] group-hover:bg-[#D4FF33] group-hover:text-black transition-colors">
                    <Dumbbell size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-white text-lg">{workout.title}</h4>
                   <div className="flex gap-4 text-xs text-gray-400 mt-1">
                     <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(workout.date).toLocaleDateString()}</span>
                     {workout.duration > 0 && <span className="flex items-center gap-1"><Clock size={12}/> {workout.duration} min</span>}
                     {workout.caloriesBurned > 0 && <span className="flex items-center gap-1"><Flame size={12}/> {workout.caloriesBurned} cal</span>}
                   </div>
                 </div>
               </div>
               
               {/* Stats display */}
               <div className="text-right">
                  {workout.weight > 0 ? (
                    <div className="flex flex-col items-end">
                       <span className="text-xl font-bold text-white">{workout.weight} <span className="text-xs text-gray-500">kg</span></span>
                       <span className="text-xs text-gray-400 flex items-center gap-1">
                         <Repeat size={12} /> {workout.sets} x {workout.reps}
                       </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-gray-500">Cardio</span>
                  )}
               </div>
             </div>
           ))
        )}
      </div>

      <WorkoutModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchWorkouts} />
    </div>
  );
};

export default Workouts;