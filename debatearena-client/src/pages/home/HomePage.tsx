import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="text-[#F0EDE8]">
      <h2 className="text-3xl font-bold mb-8">Debate Feed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#111318] border border-white/5 rounded-xl">
          <p className="text-[#8A8A96]">No active debates found. Why not start one?</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
