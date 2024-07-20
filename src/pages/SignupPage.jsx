import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../api/voterService';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { useAddress } from '../contexts/AddressContext';
import Select from 'react-select';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';

const SignupForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addresses, addAddress } = useAddress();
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    id: '',
    firstname: '',
    lastname: '',
    birthdate: {
      day: '',
      month: '',
      year: ''
    },
    phonenumber: '',
    country: '',
    state: '',
    city: '',
    street: '',
    number: '',
    password: '',
  });
  const { data: user, loading, error, fetchData: createUser } = useCreateUser();
  const isSmallScreen = useResponsiveJSX([768]) === 0; // Considering 768px as the breakpoint for small screens

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('birthdate')) {
      const [key, subKey] = name.split('.');
      setCredentials(prevState => ({
        ...prevState,
        [key]: {
          ...prevState[key],
          [subKey]: value
        }
      }));
    } else {
      setCredentials({ ...credentials, [name]: value });
    }
  };

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleAddressChange = (selectedOption, { name }) => {
    setCredentials({ ...credentials, [name]: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const birthdate = `${credentials.birthdate.year}-${credentials.birthdate.month}-${credentials.birthdate.day}`;
    const fullCredentials = { ...credentials, birthdate };
    await createUser(fullCredentials);
    login(user);
    navigate('/voter-dashboard');
  };

  const renderDropdown = (label, name, options) => (
    <div className="flex-1">
      <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">{label}</label>
      <select
        name={name}
        value={credentials.birthdate[name]}
        onChange={handleChange}
        className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">{`Select ${label}`}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const renderAddressField = (label, name, options) => (
    <div className="flex-1">
      <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">{label}</label>
      <Select
        name={name}
        value={options.find(option => option.value === credentials[name])}
        onChange={handleAddressChange}
        options={options}
        placeholder={`Select ${label}`}
        isClearable
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'black',
            borderColor: '#4F46E5',
            minHeight: '42px',
            '&:hover': { borderColor: '#4F46E5' },
            boxShadow: 'none',
              borderRadius:'10px'
          }),
          singleValue: (base) => ({
            ...base,
            color: 'white',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'black',
            color: 'white',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#4F46E5' : 'black',
            color: 'white',
          }),
          input: (base) => ({
            ...base,
            color: 'white',
          
          }),
          placeholder: (base) => ({
            ...base,
            color: 'white',
          }),
        }}
      />
    </div>
  );

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const countryOptions = addresses.countries.map(country => ({ value: country, label: country }));
  const stateOptions = addresses.states[credentials.country] ? addresses.states[credentials.country].map(state => ({ value: state, label: state })) : [];
  const cityOptions = addresses.cities[credentials.state] ? addresses.cities[credentials.state].map(city => ({ value: city, label: city })) : [];
  const streetOptions = addresses.streets[credentials.city] ? addresses.streets[credentials.city].map(street => ({ value: street, label: street })) : [];

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md lg:max-w-xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-secondary">Sign Up</h2>
          {step === 1 && (
            <>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">ID</label>
                <input
                  type="text"
                  name="id"
                  value={credentials.id}
                  onChange={handleChange}
                  placeholder="Enter your ID"
                  className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="mb-4 md:mb-6 flex-1">
                  <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={credentials.firstname}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div className="mb-4 md:mb-6 flex-1">
                  <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={credentials.lastname}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-6 gap-2">
                {renderDropdown('Day', 'day', days)}
                {renderDropdown('Month', 'month', months)}
                {renderDropdown('Year', 'year', years)}
              </div>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={credentials.phonenumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <button type="button" onClick={handleNext} className="w-full bg-secondary text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-secondary-200 transition duration-300">
                Next
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} md:space-x-4 mb-4`}>
                {renderAddressField('Country', 'country', countryOptions)}
                {renderAddressField('State', 'state', stateOptions)}
              </div>
              <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} md:space-x-4 mb-4`}>
                {renderAddressField('City', 'city', cityOptions)}
                {renderAddressField('Street', 'street', streetOptions)}
              </div>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Street Number</label>
                <input
                  type="text"
                  name="number"
                  value={credentials.number}
                  onChange={handleChange}
                  placeholder="Enter your street number"
                  className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4">
                <button type="button" onClick={handlePrevious} className="w-full bg-gray-300 text-gray-700 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-300">
                  Previous
                </button>
                <button type="submit" className="w-full bg-secondary text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-secondary-200 transition duration-300">
                  Sign Up
                </button>
              </div>
             
            </>
          )}
           <div className="mt-4 text-center">
                <p className="text-sm md:text-base text-gray-700">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-secondary font-semibold hover:underline"
                  >
                    Return to Login
                  </button>
                </p>
              </div>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
