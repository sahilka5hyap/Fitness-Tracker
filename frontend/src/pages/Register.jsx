import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        login(data);
        // Redirect to onboarding instead of dashboard immediately
        navigate('/onboarding');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-gray-800 rounded-2xl p-8">
        <div className="flex justify-center mb-6 text-primary">
          <Zap size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-gray-400 text-center mb-6">Join Vitality today</p>

        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input type="text" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder=" Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder="abc@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-primary" placeholder="Set your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:opacity-90 transition">Sign Up</button>
        </form>

        <p className="text-gray-500 text-center mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;