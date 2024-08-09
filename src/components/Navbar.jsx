/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { forwardRef } from 'react';

import logo from '../assets/logo.png';

const Navbar = forwardRef(({ fromMain }, ref) => {
  const navigate = useNavigate();

  return (
    <nav ref={ref} className="top-0 left-0 w-full z-50 flex justify-between items-center p-4">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-16 mr-1" />
        <span className={`text-2xl font-bold ${fromMain ? 'text-white' : 'text-primary'}`}>VoteChain</span>
      </div>
      {fromMain && (
      <div className="flex items-center gap-3">
        <a
          onClick={() => navigate("/login")}
          className={`text-base cursor-pointer font-medium ${fromMain ? 'text-white' : 'text-primary'} hover:text-gray-700`}
        >
          Login
        </a>
        <a
          onClick={() => navigate("/signup")}
          className={`text-base  cursor-pointer font-medium ${fromMain ? 'text-white' : 'text-primary'} hover:text-gray-700`}
        >
          Signup
        </a>
      </div>
      )}
    </nav>
  );
});

// Set the display name for debugging purposes
Navbar.displayName = "Navbar";

export default Navbar;
