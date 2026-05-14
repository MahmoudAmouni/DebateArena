import React from 'react';
import LandingNavbar from '../landing/LandingNavbar';
import LandingFooter from '../landing/LandingFooter';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="landing-layout">
      <LandingNavbar />
      <div className="landing-content">
        {children}
      </div>
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
