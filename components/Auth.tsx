import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from './Button';

interface AuthProps {
  onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
      if (isLogin) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 mt-2">
          {isLogin ? 'Sign in to access your applications' : 'Get started with your free account'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <Button
          variant="primary"
          className="w-full justify-center py-3"
          isLoading={loading}
          type="submit"
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 font-semibold hover:text-blue-700"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};
