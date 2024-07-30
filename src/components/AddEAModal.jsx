/* eslint-disable react/prop-types */
import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const AddEAModal = ({ isOpen, onClose, onSubmit }) => {
    const [fullname, setFullname] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ fullname, phonenumber, password, user_id: userId });
        onClose();
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
                <h2 className="text-3xl font-semibold mb-6 text-primary">Add New EA</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Id</label>
                        <input
                            type="text"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md  font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    
                        <button
                            type="submit"
                            className=" w-full py-2 px-4 border rounded-lg bg-purple-500 text-white shadow-md hover:bg-purple-600 transition duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Confirm
                        </button>
                </form>
            </div>
        </div>
    );
};

export default AddEAModal;
