import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Dumbbell } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData.name, formData.email, formData.password);
    if (res.error) {
      setError(res.error);
    } else {
      navigate('/Onboarding'); // Redirect to Onboarding after signup
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white font-sans">
      
      {/* LEFT: Image Section */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop" 
          alt="Fitness Training" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 p-12 text-center">
            <Dumbbell className="w-16 h-16 text-[#D4FF33] mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Join the Club</h1>
            <p className="text-xl text-gray-300">Start your fitness journey today.</p>
        </div>
      </div>

      {/* RIGHT: Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
         <div className="w-full max-w-md z-10">
            <div className="mb-10">
               <h2 className="text-3xl font-bold mb-2 text-[#D4FF33]">Create Account</h2>
               <p className="text-gray-400">Get started for free</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                     <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
                     <input type="text" className="w-full bg-[#121212] border border-gray-800 text-white pl-12 p-3 rounded-xl focus:border-[#D4FF33] focus:outline-none" placeholder="Enter your Username" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
                     <input type="email" className="w-full bg-[#121212] border border-gray-800 text-white pl-12 p-3 rounded-xl focus:border-[#D4FF33] focus:outline-none" placeholder="abc@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                     <input type="password" className="w-full bg-[#121212] border border-gray-800 text-white pl-12 p-3 rounded-xl focus:border-[#D4FF33] focus:outline-none" placeholder="Create a password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
               </div>

               <button className="w-full bg-[#D4FF33] text-black font-bold py-4 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 mt-4">
                 Sign Up <ArrowRight size={20} />
               </button>
            </form>

            <p className="mt-8 text-center text-gray-500">
               Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log in</Link>
            </p>
         </div>
      </div>
    </div>
  );
};

export default Register;