import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { useGetElectionsByUser } from '../api/electionService';

const LoginPage = () => {
  const { user, login, error, loading } = useAuth();
  const [credentials, setCredentials] = useState({ user_id: '', password: '' });
  const navigate = useNavigate();
  const [eligibleElections, setEligibleElections] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  const { getElectionsByUser } = useGetElectionsByUser();
  useEffect(() => {
    if (isRegistered && user && user.role === 'voter') {
      getElectionsByUser(credentials.user_id)
        .then(response => setEligibleElections(response.data))
        .catch(console.error);
    }
  }, [user, isRegistered, credentials.user_id, getElectionsByUser]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials, eligibleElections);
    if (!error) {
      setIsRegistered(true); // Set the registration flag to true only if there is no error
    }
  };

  return (
    <div className="h-screen">
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
      <Navbar />

      <div className="flex justify-center items-center mt-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-secondary">Login</h2>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Id</label>
            <input
              type="text"
              name="user_id"
              value={credentials.user_id}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-secondary-200 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center mt-4 text-gray-800">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="text-secondary hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
