import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGsapAnimation from '../hooks/useGsapAnimation';
import ballotPhones from '../assets/ballotPhones.png';
import { breakpoints } from '../config';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import Navbar from './Navbar';

const HeroSection = () => {
  const heroRef = useGsapAnimation({
    from: { opacity: 0, y: -50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  const navigate = useNavigate();
  const index = useResponsiveJSX(breakpoints);

  const getballotPhonesSize = () => {
    switch (index) {
      case 0: return 'w-3/4'; // Small screen
      case 1: return 'w-1/2'; // Medium screen
      case 2: return 'w-3/4'; // Large screen
      default: return 'w-3/4'; // Extra large screen
    }
  };

  const handleLearnMore = () => {
    const nextSection = document.getElementById('FeatureSection');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
     <Navbar />
      <div className="relative z-10">
        <section
          ref={heroRef}
          className="text-center p-12 bg-white text-primary relative flex flex-col md:flex-row justify-center items-center drop-shadow-lg"
          style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '70px' }} // Adjusted for navbar height
        >
          <div className="w-full md:w-1/2 p-4 md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">Welcome to the Future of Elections</h1>
            <p className="text-lg md:text-2xl lg:text-2xl mb-6">Secure, Transparent, and Trustworthy Voting with <b>VoteChain</b></p>
            <div>
              <button 
                className="sm:mr-3 mb-3 lg:mb-0 px-8 py-4 bg-secondary text-white rounded-lg text-lg md:text-lg lg:text-lg font-semibold hover:bg-secondary-200 transition duration-300 shadow-lg"
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>
              <button 
                className=" px-8 py-4 bg-primary text-white rounded-lg text-lg md:text-lg lg:text-lg font-semibold hover:bg-gray-200 transition duration-300 shadow-lg"
                onClick={handleLearnMore}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img src={ballotPhones} alt="Logo" className={`${getballotPhonesSize()} mb-8`} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeroSection;
