import React, { useState, useEffect, useContext } from 'react';
import { Plus, Dumbbell, Calendar, Clock, Flame, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import WorkoutModel from '../components/WorkoutModel';

const Workouts = () => {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Workouts function
  const fetchWorkouts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/workouts', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      setWorkouts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch workouts", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  // Calculate Stats
  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  const totalMinutes = workouts.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  
  // Get workouts for "This Week" (Simplified check)
  const thisWeekCount = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    const diffTime = Math.abs(now - workoutDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }).length;

  return (
    <div className="min-h-screen bg-background p-6 pb-24 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-gray-400">Track and manage your exercise sessions</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={20} /> Log Workout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase font-bold">Total Workouts</p>
          <div className="flex items-center gap-2 mt-1">
             <Dumbbell className="text-primary" size={20} />
             <span className="text-2xl font-bold">{totalWorkouts}</span>
          </div>
        </div>
        <div className="bg-card border border-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase font-bold">Total Calories</p>
          <div className="flex items-center gap-2 mt-1">
             <Flame className="text-orange-500" size={20} />
             <span className="text-2xl font-bold">{totalCalories}</span>
          </div>
        </div>
        <div className="bg-card border border-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase font-bold">Total Minutes</p>
          <div className="flex items-center gap-2 mt-1">
             <Clock className="text-blue-500" size={20} />
             <span className="text-2xl font-bold">{totalMinutes}</span>
          </div>
        </div>
        <div className="bg-card border border-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase font-bold">This Week</p>
          <div className="flex items-center gap-2 mt-1">
             <Calendar className="text-green-500" size={20} />
             <span className="text-2xl font-bold">{thisWeekCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Entries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Recent Entries</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading workouts...</p>
        ) : workouts.length === 0 ? (
          <div className="bg-card border border-gray-800 rounded-2xl p-12 text-center">
            <Dumbbell className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No workouts logged yet</p>
            <p className="text-sm text-gray-600">Start by logging your first workout!</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div key={workout._id} className="bg-card border border-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-gray-700 transition">
              <div className="flex items-center gap-4">
                <div className="bg-[#0A0A0A] p-3 rounded-lg border border-gray-800">
                  <Dumbbell className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{workout.name}</h3>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(workout.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {workout.duration} min</span>
                    <span className="flex items-center gap-1"><Flame size={12}/> {workout.caloriesBurned} kcal</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                 <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded uppercase font-bold tracking-wider">
                   {workout.type}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <WorkoutModel 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={fetchWorkouts} 
      />
    </div>
  );
};

export default Workouts;