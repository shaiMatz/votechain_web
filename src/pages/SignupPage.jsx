import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../api/voterService';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { useAddress } from '../contexts/AddressContext';
import Select from 'react-select';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { createEOSAccount } from '../services/CreateAccountService';
import { registerVoter } from '../services/registerVoter';
import { ADMINPRIVATEKEY } from '../config';
import { session, loadContract } from '../services/sessionService';

const SignupForm = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const { addresses } = useAddress();
	const [step, setStep] = useState(1);
	const [credentials, setCredentials] = useState({
		user_id: '',
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
		streetNumber: '',
		password: '',
		confirmPassword: ''
	});
	const { data: user, loading, error, createUser } = useCreateUser();
	const isSmallScreen = useResponsiveJSX([768]) === 0; // Considering 768px as the breakpoint for small screens
	const [formLoading, setFormLoading] = useState(false); // Add form loading state


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

	const generateUsername = () => {
		const firstNamePart = credentials.firstname.toLowerCase().replace(/[^a-z1-5]/g, '').slice(0, 6);
		const lastNamePart = credentials.lastname.toLowerCase().replace(/[^a-z1-5]/g, '').slice(0, 5);
		let baseUsername = (firstNamePart + lastNamePart).slice(0, 10);

		// Pad the base username with allowed characters if it's less than 10 characters
		while (baseUsername.length < 10) {
			baseUsername += '1'; // Padding with '1' which is allowed
		}

		// Add a random suffix to ensure uniqueness
		const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
		return baseUsername + randomSuffix;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormLoading(true); // Set form loading state to true

		let username = generateUsername();
		const maxRetries = 10; // Limit the number of retries
		let retries = 0;

		try {
			// Create EOS account
			let eosAccount;
			while (retries < maxRetries) {
				try {
					eosAccount = await createEOSAccount(username, ADMINPRIVATEKEY);
					break;
				} catch (error) {
					if (error.message.includes("no active bid for name") || error.message.includes("only suffix may create this account") || error.message.includes("name is already taken")) {
						username = generateUsername(); // Generate a new username
						console.log("Creating account for: " + username);
						retries++;
					} else {
						throw error; // Re-throw other errors
					}
				}
			}

			if (retries === maxRetries) {
				throw new Error("Unable to create account. Please try again.");
			}

			console.log("EOS Account: public key - " + eosAccount.publicKey + ", private key - " + eosAccount.privateKey);

			// Complete credentials with birthdate and address
			const birthdate = `${credentials.birthdate.year}-${credentials.birthdate.month}-${credentials.birthdate.day}`;
			const fullCredentials = {
				fullname: `${credentials.firstname} ${credentials.lastname}`,
				birthdate,
				phonenumber: credentials.phonenumber,
				country: credentials.country,
				state: credentials.state,
				city: credentials.city,
				street: credentials.street,
				streetNumber: credentials.streetNumber,
				privatekey: eosAccount.privateKey,
				publickey: eosAccount.publicKey,
				username,
				role: 'voter',
				password: credentials.password,
				user_id: credentials.user_id,
			};

			const res = await createUser(fullCredentials);
			console.log("user: ", res);

			if (res && res.error_code === 0) {
				// Register voter in blockchain
				const contract = await loadContract();
				await registerVoter(fullCredentials, contract, session);
				// Create user in your application
				console.log("User created successfully.");
				console.log(user);
				const userData = {
					user_id: fullCredentials.user_id,
					password: fullCredentials.password
				};
				login(userData, true);
			} else {
				console.log(user);
			}
		} catch (error) {
			console.error(error);
			// Handle error appropriately, e.g., display error message to user
		} finally {
			setFormLoading(false); // Set form loading state to false
		}
	};

	const renderDropdown = (label, name, options) => (
		<div className="flex-1">
			<label className="block text-sm md:text-base font-bold mb-2 text-gray-700">{label}</label>
			<select
				name={`birthdate.${name}`}
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
						borderRadius: '10px'
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
			<div className="flex justify-center items-center">
				<form onSubmit={handleSubmit} className="w-full max-w-md lg:max-w-xl p-6 md:p-10">
					<h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-secondary">Sign Up</h2>
					{step === 1 && (
						<>
							<div className="mb-4 md:mb-6">
								<label className="block text-sm md:text-base font-bold mb-2 text-gray-700">ID</label>
								<input
									type="text"
									maxLength={9}
									name="user_id"
									value={credentials.user_id}
									onChange={(e) => {
										const { value } = e.target;
										if (/^\d*$/.test(value)) { // Only allow numeric values
											handleChange(e);
										}
									}}
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
									name="streetNumber"
									value={credentials.streetNumber}
									onChange={handleChange}
									placeholder="Enter your street number"
									className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
								/>
							</div>
							<button type="button" onClick={handleNext} className="w-full bg-secondary text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-secondary-200 transition duration-300">
								Next
							</button>
							<div className="flex flex-col md:flex-row md:space-x-4">
								<button type="button" onClick={handlePrevious} className="bg-gray-300 text-gray-700 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-300">
									Previous
								</button>
							</div>
						</>
					)}
					{step === 3 && (
						<>
							<div className="mb-4 md:mb-6">
								<label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Password</label>
								<input
									type="password"
									name="password"
									value={credentials.password}
									onChange={handleChange}
									placeholder="Enter your password"
									className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
								/>
							</div>
							<div className="mb-4 md:mb-6">
								<label className="block text-sm md:text-base font-bold mb-2 text-gray-700">Confirm Password</label>
								<input
									type="password"
									name="confirmPassword"
									value={credentials.confirmPassword}
									onChange={handleChange}
									placeholder="Confirm your password"
									className="w-full px-3 md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
								/>
							</div>
							<div className="flex flex-col md:flex-row md:space-x-4">
								<button type="submit" className="w-full bg-secondary text-white py-2 md:py-3 my-3 md:my-0 rounded-lg font-semibold hover:bg-secondary-200 transition duration-300" disabled={formLoading}>
									{formLoading ? (
										<svg
											className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full inline-block"
											viewBox="0 0 24 24"
										></svg>
									) : (
										"Sign Up"
									)}
								</button>
								<button type="button" onClick={handlePrevious} className="bg-gray-300 text-gray-700 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-300">
									Previous
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
					{error && <p className="text-red-500 text-sm md:text-base text-center">Error: {error.message}</p>}
				</form>
			</div>
		</div>
	);
};

export default SignupForm;
