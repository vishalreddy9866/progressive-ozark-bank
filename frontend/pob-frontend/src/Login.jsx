import React, { useState } from 'react';
import { Lock, User, Landmark, AlertCircle } from 'lucide-react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Bridging the gap: React (5173) -> Spring Boot (8081)
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        username,
        password
      });

      // Capture the JWT!
      const token = response.data.token;
      localStorage.setItem('pob_token', token); 
      
      // Notify App.jsx to switch to Dashboard view
      onLoginSuccess();
      
    } catch (err) {
      console.error("Login Error:", err);
      // Better error handling for UX
      if (!err.response) {
        setError('Backend is offline. Please start the Spring Boot server.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-lg shadow-blue-500/20">
            <Landmark className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Progressive Ozark Bank</h2>
          <p className="text-slate-400 text-sm">Secure Portal Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg flex items-center gap-2 font-medium animate-in fade-in zoom-in duration-300">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 text-white font-semibold py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 flex justify-center items-center"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <p className="text-slate-500 text-xs">
            © 2026 Progressive Ozark Bank. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;