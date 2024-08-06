import logo from '../assets/logo.png';

export default function Navbar() {
  return (
     <nav className="top-0 left-0 w-full   z-50 flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-16 mr-1" />
          <span className="text-primary text-xl font-bold">VoteChain</span>
        </div>
      </nav>
  )
}
