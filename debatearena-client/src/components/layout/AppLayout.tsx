import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F0EDE8]">
      <div className="flex">
        <aside className="w-60 h-screen fixed border-r border-white/5 bg-[#111318]">
          <div className="p-6">
            <h1 className="text-xl font-bold text-[#F0EDE8]">Debate<span className="text-[#C9A84C]">Arena</span></h1>
          </div>
          <nav className="mt-4 px-4">
             <div className="px-4 py-2 text-[#8A8A96] text-sm uppercase font-semibold">Menu</div>
             {/* Links would go here */}
          </nav>
        </aside>
        <main className="flex-1 ml-60">
          <header className="h-16 border-b border-white/5 bg-[#111318] flex items-center px-8">
            <div className="ml-auto"></div>
          </header>
          <div className="p-8 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
