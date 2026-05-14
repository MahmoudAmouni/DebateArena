import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import HeroSection from '../components/landing/HeroSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AIJudgeSection from '../components/landing/AIJudgeSection';
import StatsSection from '../components/landing/StatsSection';
import FinalCTASection from '../components/landing/FinalCTASection';

const LandingPage: React.FC = () => {
  return (
    <LandingLayout>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <AIJudgeSection />
      <StatsSection />
      <FinalCTASection />
    </LandingLayout>
  );
};

export default LandingPage;
