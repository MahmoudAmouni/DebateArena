import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F0EDE8] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-bold text-[#C9A84C] mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">Verdict: Not Found</h2>
      <p className="text-[#8A8A96] mb-12 max-w-md">
        The page you are looking for has been dismissed from the arena. It may have been moved or deleted.
      </p>
      <Link to="/" className="px-8 py-3 bg-[#1A1D26] border border-white/10 rounded-md hover:bg-[#22263A] transition-colors">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
