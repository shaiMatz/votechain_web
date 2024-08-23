/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { FaArrowDown } from "react-icons/fa";

const HeroSection = ({ circleRef, titleRef, nextSectionRef }) => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/login");
  };
  const handleScrollClick = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="h-[100dvh] mb-12 relative">
      <Navbar fromMain={true} ref={titleRef} />
      <div className="flex p-3 md:px-12 md:pt-0 pb-24 flex-col h-full justify-end items-start">
        <div className="md:w-4/5 lg:w-3/5">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3">
            Unlocking the Power of Voting for{" "}
            <span className="text-6xl md:text-8xl lg:text-9xl italic font-pacifico text-accent-blue-100">VoteChain</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12">
            The new way to secure electronic voting with blockchain technology.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full">
          <button
            className="px-6 w-64 py-3 text-secondary-100 border border-secondary-100 bg-transparent rounded-full shadow-lg hover:bg-secondary-200 hover:text-white focus:outline-none"
            onClick={handleJoinClick}
          >
            Login to Vote
          </button>
          <div className="flex-grow w-full h-0.5 bg-secondary-100"></div>
          <div
            ref={circleRef}
            className="bg-secondary-100 rounded-full p-4 z-0 animate-bounce"
            onClick={handleScrollClick}

          >
            <div className="flex flex-col items-center justify-center h-full cursor-pointer">
              <p className="text-white text-center text-xs">Scroll Down</p>
              <FaArrowDown className="text-white text-xs md:text-sm mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
