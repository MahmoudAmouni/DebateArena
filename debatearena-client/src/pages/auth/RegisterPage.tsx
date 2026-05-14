import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // Add validation check
      return;
    }
    try {
      await register(formData);
    } catch (err) {
      // Error handled by useAuth
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-[#F0EDE8]">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#8A8A96] mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1D26] border border-white/5 rounded-md focus:outline-none focus:border-[#C9A84C] text-[#F0EDE8]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8A8A96] mb-1">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1D26] border border-white/5 rounded-md focus:outline-none focus:border-[#C9A84C] text-[#F0EDE8]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8A8A96] mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1D26] border border-white/5 rounded-md focus:outline-none focus:border-[#C9A84C] text-[#F0EDE8]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8A8A96] mb-1">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1D26] border border-white/5 rounded-md focus:outline-none focus:border-[#C9A84C] text-[#F0EDE8]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-[#C9A84C] text-[#0A0B0F] font-bold rounded-md hover:bg-[#E8C97A] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#8A8A96]">
        Already have an account? <Link to="/login" className="text-[#C9A84C] hover:underline">Sign In</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
