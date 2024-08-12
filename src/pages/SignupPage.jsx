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
import { isValidIsraeliID } from '../services/isValidIsraeliID';

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
	const { loading, error, createUser } = useCreateUser();
	const isSmallScreen = useResponsiveJSX([768]) === 0;
	const [formLoading, setFormLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [validID, setValidID] = useState(0);

	const validateStep = () => {
		let newErrors = {};

		if (step === 1) {
			const { user_id, firstname, lastname, birthdate, phonenumber } = credentials;
			console.log('id:', user_id);


			if (!user_id) {
				newErrors.user_id = 'ID is required';
			} else {
				const { isValid, id } = isValidIsraeliID(user_id);

				if (isValid) {
					console.log(`Valid ID without leading zeros: ${id}`);
					setValidID(id);
				} else {
					newErrors.user_id = 'Invalid ID';
					console.log('Invalid ID');
				}
			}

			if (!firstname) newErrors.firstname = 'First name is required';
			if (!lastname) newErrors.lastname = 'Last name is required';
			if (!birthdate.day || !birthdate.month || !birthdate.year) newErrors.birthdate = 'Complete birthdate is required';
			if (!phonenumber) newErrors.phonenumber = 'Phone number is required';
		} else if (step === 2) {
			const { country, state, city, street, streetNumber } = credentials;
			if (!country) newErrors.country = 'Country is required';
			if (!state) newErrors.state = 'State is required';
			if (!city) newErrors.city = 'City is required';
			if (!street) newErrors.street = 'Street is required';
			if (!streetNumber) newErrors.streetNumber = 'Street number is required';
		} else if (step === 3) {
			const { password, confirmPassword } = credentials;
			if (!password) newErrors.password = 'Password is required';
			if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
			if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};


	const handleChange = (e) => {
		const { name, value } = e.target;
		let newErrors = { ...errors }; // Copy current errors

		if (name.includes('birthdate')) {
			const [key, subKey] = name.split('.');
			setCredentials(prevState => ({
				...prevState,
				[key]: {
					...prevState[key],
					[subKey]: value
				}
			}));

			// Remove error if the user inputs valid birthdate values
			if (value) {
				delete newErrors.birthdate;
			}
		} else {
			setCredentials({ ...credentials, [name]: value });

			// Remove error if the user inputs valid data for the specific field
			if (value) {
				delete newErrors[name];
			}
		}

		setErrors(newErrors); // Update errors state
	};


	const handleNext = () => {
		if (validateStep()) {
			setStep(step + 1);
		}
	};

	const handlePrevious = () => setStep(step - 1);

	const handleAddressChange = (selectedOption, { name }) => {
		setCredentials({ ...credentials, [name]: selectedOption ? selectedOption.value : '' });
	};

	const generateUsername = () => {
		const firstNamePart = credentials.firstname.toLowerCase().replace(/[^a-z1-5]/g, '').slice(0, 6);
		const lastNamePart = credentials.lastname.toLowerCase().replace(/[^a-z1-5]/g, '').slice(0, 5);
		let baseUsername = (firstNamePart + lastNamePart).slice(0, 10);

		while (baseUsername.length < 10) {
			baseUsername += '1';
		}

		const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
		return baseUsername + randomSuffix;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validateStep()) {
			setFormLoading(true);

			let username = generateUsername();
			const maxRetries = 10;
			let retries = 0;

			try {
				let eosAccount;
				while (retries < maxRetries) {
					try {
						eosAccount = await createEOSAccount(username, ADMINPRIVATEKEY);
						break;
					} catch (error) {
						if (error.message.includes("name is already taken")) {
							username = generateUsername();
							retries++;
						} else {
							throw error;
						}
					}
				}

				if (retries === maxRetries) {
					throw new Error("Unable to create account. Please try again.");
				}

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
					user_id: validID,
				};

				const res = await createUser(fullCredentials);
				if (res && res.error_code === 0) {
					const contract = await loadContract();
					await registerVoter(fullCredentials, contract, session);
					const userData = {
						user_id: fullCredentials.user_id,
						password: fullCredentials.password
					};
					login(userData, false);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setFormLoading(false);
			}
		}
	};

	const renderInputField = (label, name, type = 'text', placeholder) => (
		<div className="mb-2 md:mb-4">
			<label className="block text-sm md:text-base font-bold mb-2 text-gray-700">{label}</label>
			<input
				type={type}
				name={name}
				value={credentials[name]}
				onChange={handleChange}
				placeholder={placeholder}
				className={`w-full px-3 md:px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
			/>
			{errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
		</div>
	);

	const renderDropdown = (label, name, options) => (
		<div className="flex-1">
			<label className="block text-sm md:text-base font-bold mb-2">{label}</label>
			<select
				name={`birthdate.${name}`}
				value={credentials.birthdate[name]}
				onChange={handleChange}
				className={`w-full px-3 bg-white md:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary ${errors.birthdate ? 'border-red-500' : 'border-gray-300'}`}
			>
				<option value="">{`Select ${label}`}</option>
				{options.map(option => (
					<option key={option} value={option}>{option}</option>
				))}
			</select>
			{errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>}
		</div>
	);
	const renderAddressField = (label, name, options) => (
		<div className="flex-1">
			<label className="block text-sm md:text-base font-bold mb-2">{label}</label>
			<Select
				name={name}
				value={options.find(option => option.value === credentials[name])}
				onChange={handleAddressChange}
				options={options}
				placeholder={`Select ${label}`}
				isClearable={false} // Disable clearing if you want to enforce selection
				isSearchable={false} // Disable manual input
				classNamePrefix="react-select"
				styles={{
					control: (base) => ({
						...base,
						backgroundColor: 'white',
						borderColor: errors[name] ? '#f56565' : '#7620EA',
						minHeight: '42px',
						'&:hover': { borderColor: errors[name] ? '#f56565' : '#7620EA' },
						boxShadow: 'none',
						borderRadius: '10px'
					}),
					singleValue: (base) => ({
						...base,
						color: 'black',
					}),
					menu: (base) => ({
						...base,
						backgroundColor: 'white',
						color: 'black',
					}),
					option: (base, state) => ({
						...base,
						backgroundColor: state.isFocused ? '#7620EA' : 'white',
						color: state.isFocused ? 'white' : 'black',
					}),
					input: (base) => ({
						...base,
						color: 'black',
					}),
					placeholder: (base) => ({
						...base,
						color: 'black',
					}),
				}}
			/>
			{errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
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
		<div className="h-[100dvh]">
			{/* SVG Background */}
			<div className="absolute inset-0 -z-10 h-full">
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
				<form onSubmit={handleSubmit} className="w-full max-w-md lg:max-w-xl p-6">
					<h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center text-secondary">Sign Up</h2>
					{step === 1 && (
						<>
							{renderInputField('ID', 'user_id', 'text', 'Enter your ID')}
							<div className="flex  flex-row space-x-4">
								{renderInputField('First Name', 'firstname', 'text', 'Enter your first name')}
								{renderInputField('Last Name', 'lastname', 'text', 'Enter your last name')}
							</div>
							{renderInputField('Phone Number', 'phonenumber', 'text', 'Enter your phone number')}

							<div className="mb-2 md:mb-4">
								<label className="block text-sm md:text-base font-bold  text-gray-700">Birthday</label>
								<div className="flex md:flex-row md:space-x-4 gap-2">
									{renderDropdown('Day', 'day', days)}
									{renderDropdown('Month', 'month', months)}
									{renderDropdown('Year', 'year', years)}
								</div>
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
							{renderInputField('Street Number', 'streetNumber', 'text', 'Enter your street number')}
							<div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
								<button
									type="button"
									onClick={handleNext}
									className="w-full bg-secondary text-white py-2 md:py-3 px-4 rounded-lg font-semibold hover:bg-secondary-200 transition duration-300"
								>
									Next
								</button>
								<button
									type="button"
									onClick={handlePrevious}
									className="w-full bg-gray-300 text-gray-700 py-2 md:py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition duration-300"
								>
									Previous
								</button>
							</div>
						</>
					)}
					{step === 3 && (
						<>
							{renderInputField('Password', 'password', 'password', 'Enter your password')}
							{renderInputField('Confirm Password', 'confirmPassword', 'password', 'Confirm your password')}
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
