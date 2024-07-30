/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useCreateElection } from '../api/electionService';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import AddElectionModal from './AddElectionModal';

const ElectionActions = ({ searchTerm, onSearchChange, filter, onFilterChange }) => {
    const [showForm, setShowForm] = useState(false);
    const { createElection, loading, error } = useCreateElection();

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleCreateElection = async (electionData) => {
        await createElection(electionData, () => {
            setShowForm(false); // Close the form on successful creation
        });
    };

    return (
        <div className="mb-6 px-4 md:px-6 pt-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 relative w-full md:w-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Search elections..."
                    className="w-full md:w-auto p-2 pl-10 border rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center justify-between">
                <div className="relative mr-0 md:mr-4 mb-4 md:mb-0 w-full md:w-auto">
                    <select
                        value={filter}
                        onChange={onFilterChange}
                        className="w-full md:w-auto p-2 border rounded-lg bg-transparent focus:outline-none text-gray-800 focus:ring-2 focus:ring-primary appearance-none"
                        style={{ paddingRight: '2.5rem' }}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="ended">Ended</option>
                    </select>
                    <FaFilter className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <button
                    onClick={toggleForm}
                    className="flex items-center bg-primary text-white px-4 py-2 rounded-lg"
                >
                    <FaPlus className="mr-2" />
                    {showForm ? 'Close' : 'Add Election'}
                </button>
            </div>
            {showForm && <AddElectionModal
                isOpen={showForm}
                onRequestClose={toggleForm}
                onCreate={handleCreateElection}
                loading={loading}
                error={error}
            />}
        </div>
    );
};

export default ElectionActions;
