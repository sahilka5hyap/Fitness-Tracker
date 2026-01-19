import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(formData.email, formData.password);
    if (res.error) {
      setError(res.error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex text-white font-sans">
      
      {/* LEFT: Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Gym Motivation" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 p-12 text-center">
            <Activity className="w-16 h-16 text-[#D4FF33] mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
            <p className="text-xl text-gray-300">Track your progress, crush your goals.</p>
        </div>
      </div>

      {/* RIGHT: Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
         {/* Mobile Background (Subtle) */}
         <div className="absolute inset-0 lg:hidden bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover opacity-10 pointer-events-none"></div>

         <div className="w-full max-w-md z-10">
            <div className="mb-10">
               <h2 className="text-3xl font-bold mb-2 text-[#D4FF33]">Sign In</h2>
               <p className="text-gray-400">Enter your details to access your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
                     <input 
                       type="email" 
                       className="w-full bg-[#121212] border border-gray-800 text-white pl-12 p-3 rounded-xl focus:border-[#D4FF33] focus:outline-none transition-colors"
                       placeholder="john@example.com"
                       value={formData.email}
                       onChange={e => setFormData({...formData, email: e.target.value})}
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                  <div className="relative">
                     <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                     <input 
                       type="password" 
                       className="w-full bg-[#121212] border border-gray-800 text-white pl-12 p-3 rounded-xl focus:border-[#D4FF33] focus:outline-none transition-colors"
                       placeholder="••••••••"
                       value={formData.password}
                       onChange={e => setFormData({...formData, password: e.target.value})}
                     />
                  </div>
               </div>

               <button className="w-full bg-[#D4FF33] text-black font-bold py-4 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2">
                 Sign In <ArrowRight size={20} />
               </button>
            </form>

            <p className="mt-8 text-center text-gray-500">
               Don't have an account? <Link to="/register" className="text-white font-bold hover:underline">Create one</Link>
            </p>
         </div>
      </div>
    </div>
  );
};

export default Login;