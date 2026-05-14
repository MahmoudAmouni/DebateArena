import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // Error handled by useAuth
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#F0EDE8]">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#8A8A96] mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#1A1D26] border border-white/5 rounded-md focus:outline-none focus:border-[#C9A84C] text-[#F0EDE8]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8A8A96] mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#1A1D26] border border-white/5 rounded-md focus:outline-none focus:border-[#C9A84C] text-[#F0EDE8]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-[#C9A84C] text-[#0A0B0F] font-bold rounded-md hover:bg-[#E8C97A] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#8A8A96]">
        Don't have an account? <Link to="/register" className="text-[#C9A84C] hover:underline">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
