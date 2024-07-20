import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const index = useResponsiveJSX(breakpoints);
  const navigate = useNavigate();

  // Detailed demo user data
  const demoUsers = [
    {
      id: 1,
      fullname: 'John Doe',
      birthdate: '1985-05-01',
      phonenumber: '123-456-7890',
      address: '1234 Main St, Anytown, AN 12345',
      privatekey: 'your_private_key_here',
      publickey: 'your_public_key_here',
      username: 'manager1',
      password: 'password',
      role: 'manager'
    },
    {
      id: 2,
      fullname: 'Jane Smith',
      birthdate: '1990-01-01',
      phonenumber: '987-654-3210',
      address: '5678 Oak St, Othertown, OT 54321',
      privatekey: 'another_private_key_here',
      publickey: 'another_public_key_here',
      username: 'ea1',
      password: 'password',
      role: 'ea'
    },
    {
      id: 3,
      fullname: 'Alice Johnson',
      birthdate: '1995-07-15',
      phonenumber: '456-789-0123',
      address: '91011 Pine St, Sometown, ST 67890',
      privatekey: 'yet_another_private_key_here',
      publickey: 'yet_another_public_key_here',
      username: 'voter1',
      password: '',
      role: 'voter'
    }
  ];

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the credentials match any demo user
    const user = demoUsers.find(
      (user) => user.username === credentials.username && user.password === credentials.password
    );
    login(user);
  };

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex justify-center items-center mt-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-secondary">Login</h2>
          <div className="mb-4 md:mb-6">
            <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
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
          <button type="submit" className="w-full bg-secondary text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-secondary-200 transition duration-300">
            Login
          </button>
          <p className="text-center mt-4 text-gray-800">
            Don't have an account?{' '}
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
