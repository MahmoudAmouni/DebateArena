import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F0EDE8]">
      <nav className="h-20 px-8 flex items-center border-b border-white/5">
        <h1 className="text-2xl font-bold">Debate<span className="text-[#C9A84C]">Arena</span></h1>
        <div className="ml-auto flex gap-4">
          <Link to="/login" className="px-4 py-2 hover:text-[#C9A84C] transition-colors">Login</Link>
          <Link to="/register" className="px-6 py-2 bg-[#C9A84C] text-[#0A0B0F] font-bold rounded-md hover:bg-[#E8C97A] transition-colors">Get Started</Link>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto py-32 text-center">
        <h2 className="text-6xl font-bold mb-6">Debate Anyone. <span className="text-[#C9A84C]">Win on Merit.</span></h2>
        <p className="text-xl text-[#8A8A96] mb-12 max-w-2xl mx-auto">
          The ultimate AI-powered arena for intellectual combat. Submit your arguments, let the AI judge decide the victor, and climb the global rankings.
        </p>
        <Link to="/register" className="px-8 py-4 bg-[#C9A84C] text-[#0A0B0F] text-lg font-bold rounded-md hover:bg-[#E8C97A] transition-colors inline-block">
          Start Your First Debate →
        </Link>
      </main>
    </div>
  );
};

export default LandingPage;
