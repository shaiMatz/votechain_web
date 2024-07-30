import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { useGetElectionsByUser } from '../api/electionService';

const LoginPage = () => {
  const { login, error, loading } = useAuth();
  const [credentials, setCredentials] = useState({ user_id: '', password: '' });
  const navigate = useNavigate();
  const [eligibleElections, setEligibleElections] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  const { getElectionsByUser } = useGetElectionsByUser();
  useEffect(() => {
    if (isRegistered) {
      getElectionsByUser(credentials.user_id).then(response => setEligibleElections(response.data)).catch(console.error);
    }
  }, [isRegistered, credentials.user_id, getElectionsByUser]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistered(true); // Set the registration flag to true

    await login(credentials, eligibleElections);
  };

  return (
    <div className="h-screen">
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
