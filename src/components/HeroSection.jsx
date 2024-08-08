import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen mb-12">
      <Navbar fromMain={true} />
      <div className="flex p-3 md:px-12 md:pt-0 pb-24 flex-col h-full justify-end items-start">
        <div className="md:w-4/5 lg:w-3/5">
          <h1 className="text-3xl md:text-7xl lg:text-8xl font-bold text-white mb-3">
            Unlocking the Power of Voting for{" "}
            <span className="italic font-pacifico text-accent-blue-100">VoteChain</span>
          </h1>
          <p className="text-lg md:text-2xl text-white mb-8">
            The new way to secure electronic voting with blockchain technology.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full">
          <button
            className="px-6 w-64 py-3 text-secondary-100 border border-secondary-100 bg-transparent rounded-full shadow-lg hover:bg-secondary-200 hover:text-white focus:outline-none"
            onClick={handleJoinClick}
          >
            Join the Fun
          </button>
          <div className="flex-grow w-full h-0.5 bg-secondary-100"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
