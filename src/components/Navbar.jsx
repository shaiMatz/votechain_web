/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from 'react-router-dom';
import { forwardRef } from 'react';
import { FiLogOut } from 'react-icons/fi'; // Importing the logout icon from react-icons

import logo from '../assets/logo.png';

const Navbar = forwardRef(({ fromMain }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleExit = () => {
    navigate('/');
  };

  // Check if the current path is either /login or /signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <nav ref={ref} className="top-0 left-0 w-full z-50 flex justify-between items-center p-4">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-16 mr-1" />
        <span className={`text-2xl font-bold ${fromMain ? 'text-white' : 'text-primary'}`}>VoteChain</span>
      </div>
      <div className="flex items-center gap-3">
        {fromMain ? (
          <>
            <a
              onClick={() => navigate("/login")}
              className={`text-base cursor-pointer font-medium ${fromMain ? 'text-white' : 'text-primary'} hover:text-gray-700`}
            >
              Login
            </a>
            <a
              onClick={() => navigate("/signup")}
              className={`text-base cursor-pointer font-medium ${fromMain ? 'text-white' : 'text-primary'} hover:text-gray-700`}
            >
              Signup
            </a>
          </>
        ) : (
          // Only show the logout icon if it's not on the login or signup page
          !isAuthPage && (
            <FiLogOut
              className="h-6 w-6 cursor-pointer text-primary" // Adjust the color and size as needed
              onClick={handleExit}
            />
          )
        )}
      </div>
    </nav>
  );
});

// Set the display name for debugging purposes
Navbar.displayName = "Navbar";

export default Navbar;
