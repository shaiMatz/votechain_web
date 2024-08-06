import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import JoinUsSection from '../components/JoinUsSection';
import VotingInfoSection from '../components/VotingInfoSection';
import FAQSection from '../components/FAQSection';
import HowItWorks from '../components/HowItWorks';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* SVG Background */}
      <div className="absolute inset-0 -z-10">
        <svg viewBox="0 0 358.38 637.12" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <rect x="0" y="0" width="358.38" height="637.12" fill="#ffffff"></rect>
          <defs>
            <filter id="f1" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="50"></feGaussianBlur>
            </filter>
          </defs>
          <circle cx="197" cy="70" r="318.56" fill="#E2F2F6" filter="url(#f1)"></circle>
          <circle cx="229" cy="636" r="318.56" fill="#F7EBFF" filter="url(#f1)"></circle>
          <circle cx="278" cy="119" r="318.56" fill="#EFF7FE" filter="url(#f1)"></circle>
          <circle cx="227" cy="484" r="318.56" fill="#CDDAF3" filter="url(#f1)"></circle>
          <circle cx="339" cy="540" r="318.56" fill="#F7FDFF" filter="url(#f1)"></circle>
        </svg>
      </div>
      {/* Page Content */}
      <div className="relative">
        <HeroSection />
        <HowItWorks />
        <FeatureSection />
      
        {/* <JoinUsSection />
        <VotingInfoSection />
        <FAQSection /> */}
      </div>
    </div>
  );
};

export default LandingPage;
