import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthProps {
  onLogin: (role: UserRole, userData?: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await authApi.login(formData.email, formData.password);
      } else {
        data = await authApi.register(formData.name, formData.email, formData.password);
      }

      onLogin(data.user.role as UserRole, data.user);

      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError('');
    setLoading(true);

    try {
      const data = await authApi.demoLogin(role);
      onLogin(data.user.role as UserRole, data.user);

      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 px-4">
      <div className="bg-white p-8 md:p-12 shadow-xl max-w-md w-full border border-gray-100">
        <h2 className="font-serif text-3xl mb-2 text-center">{isLogin ? 'Welcome Back' : 'Join JHL'}</h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          {isLogin ? 'Access your subscription and preferences' : 'Begin your journey with us'}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Full Name</label>
              <input
                type="text"
                className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Email Address</label>
            <input
              type="email"
              className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-gray-500">Password</label>
            <input
              type="password"
              className="w-full border-b border-gray-300 py-2 focus:border-black outline-none transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors mt-8 disabled:bg-gray-400"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
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
            <button
              onClick={() => handleDemoLogin(UserRole.GUEST)}
              disabled={loading}
              className="text-xs text-green-600 hover:underline px-2 disabled:opacity-50"
            >
              New User
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleDemoLogin(UserRole.INDIVIDUAL)}
              disabled={loading}
              className="text-xs text-blue-600 hover:underline px-2 disabled:opacity-50"
            >
              Individual
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleDemoLogin(UserRole.COMPANY_ADMIN)}
              disabled={loading}
              className="text-xs text-blue-600 hover:underline px-2 disabled:opacity-50"
            >
              Company Admin
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleDemoLogin(UserRole.ADMIN)}
              disabled={loading}
              className="text-xs text-blue-600 hover:underline px-2 disabled:opacity-50"
            >
              JHL Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
