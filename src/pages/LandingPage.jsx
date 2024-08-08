import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
// import JoinUsSection from '../components/JoinUsSection';
// import VotingInfoSection from '../components/VotingInfoSection';
// import FAQSection from '../components/FAQSection';
import HowItWorks from '../components/HowItWorks';
import GradientBackground from '../components/GradientBackground';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Background */}
      <GradientBackground />

      {/* Page Content */}
      <div className="relative z-10">
        <HeroSection />
        <div className="how-it-works-section">
          <HowItWorks />
        </div>
        <FeatureSection />

        {/* <JoinUsSection />
        <VotingInfoSection />
        <FAQSection /> */}
      </div>
    </div>
  );
};

export default LandingPage;
