import React from 'react';
import { Outlet } from 'react-router-dom';

const GuestLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F0EDE8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111318] border border-white/5 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F0EDE8]">Debate<span className="text-[#C9A84C]">Arena</span></h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default GuestLayout;
