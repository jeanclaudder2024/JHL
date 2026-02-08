import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface AuthProps {
  onLogin: (role: UserRole) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation of login logic
    onLogin(UserRole.INDIVIDUAL); 
    navigate('/dashboard');
  };

  const handleDemoLogin = (role: UserRole) => {
    onLogin(role);
    if (role === UserRole.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 px-4">
      <div className="bg-white p-8 md:p-12 shadow-xl max-w-md w-full border border-gray-100">
        <h2 className="font-serif text-3xl mb-2 text-center">{isLogin ? 'Welcome Back' : 'Join JHL'}</h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          {isLogin ? 'Access your subscription and preferences' : 'Begin your journey with us'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Full Name</label>
              <input 
                type="text" 
                className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Email Address</label>
            <input 
              type="email" 
              className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
             <label className="text-xs uppercase tracking-wider text-gray-500">Password</label>
             <input 
              type="password" 
              className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors mt-8"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-500 underline hover:text-black"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-widest">Demo Access</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <button onClick={() => handleDemoLogin(UserRole.INDIVIDUAL)} className="text-xs text-blue-600 hover:underline px-2">
              Individual
            </button>
            <span className="text-gray-300">|</span>
             <button onClick={() => handleDemoLogin(UserRole.COMPANY_ADMIN)} className="text-xs text-blue-600 hover:underline px-2">
              Company Admin
            </button>
            <span className="text-gray-300">|</span>
            <button onClick={() => handleDemoLogin(UserRole.ADMIN)} className="text-xs text-blue-600 hover:underline px-2">
              JHL Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
