/* eslint-disable react/prop-types */
import logo from '../assets/logo.png';

export default function Navbar({ fromMain=false }) {
  return (
    <nav className="top-0 left-0 w-full z-50 flex justify-between items-center p-4">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-16 mr-1" />
        <span className={`text-2xl font-bold ${fromMain ? 'text-white' : 'text-primary'}`}>VoteChain</span>
     
      </div>
      <div className="flex items-center gap-3">
        <a href="/login" className={`text-base font-medium ${fromMain ? 'text-white' : 'text-primary'} hover:text-gray-700`}>Login</a>
        <a href="/signup" className={`text-base font-medium ${fromMain ? 'text-white' : 'text-primary'} hover:text-gray-700`}>Signup</a>

      </div>
    </nav>
  );
}
