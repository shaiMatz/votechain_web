/* eslint-disable react/prop-types */
import { useState, useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import { EAContext } from '../contexts/EAContext';

const AddEAModal = ({ isOpen, onClose, onSubmit, editData }) => {
    const [fullname, setFullname] = useState(editData ? editData.name : '');
    const [email, setEmail] = useState(editData ? editData.email : '');
    const [password, setPassword] = useState(editData ? editData.password : ''); // Don't prefill the password for security reasons
    const [userId, setUserId] = useState(editData ? editData.user_id : '');
    const [errors, setErrors] = useState({});
    const { error } = useContext(EAContext);
    console.log("edit",editData)
    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length === 0) {
            onSubmit({ fullname, email, password, user_id: userId, id: editData ? editData.id : undefined });
        } else {
            setErrors(validationErrors);
        }
    };

    const validateInputs = () => {
        const errors = {};
        if (!userId) errors.userId = 'User ID is required';
        if (!fullname) errors.fullname = 'Full name is required';
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password && !editData) errors.password = 'Password is required'; // Password is required only for new EAs
        return errors;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-12 shadow-lg max-w-lg mx-auto relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
                >
                    <IoClose className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-semibold mb-6 text-primary">{editData ? 'Edit EA' : 'Add New EA'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">User ID</label>
                        <input
                            type="text"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        {errors.userId && <p className="text-red-500 text-sm">{errors.userId}</p>}
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required={!editData} // Password is required only for new EAs
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border rounded-lg bg-purple-500 text-white shadow-md hover:bg-purple-600 transition duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Confirm
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
        </div>
    );
};

export default AddEAModal;
