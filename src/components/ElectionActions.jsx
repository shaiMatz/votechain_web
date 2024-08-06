/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import { useCreateElection } from '../api/electionService';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import AddElectionModal from './AddElectionModal';
import { ElectionContext } from '../contexts/ElectionContext';
import { AuthContext } from '../contexts/AuthContext';
import { session, loadContract } from '../services/sessionService';
import { createElections } from '../services/createElections';

const ElectionActions = ({ searchTerm, onSearchChange, filter, onFilterChange }) => {
    const [showForm, setShowForm] = useState(false);
    const { createElection, loading, error } = useCreateElection();
    const { fetchFullElectionData } = useContext(ElectionContext);
    const toggleForm = () => {
        setShowForm(!showForm);
    };
    const {user} = useContext(AuthContext);

    const handleCreateElection = async (electionData, data) => {
        try {
            const result = await createElection(electionData);
            console.log('Create Election Result:', result);

            if (result&& result.data&&result.data.election_id) {
                const electionIdBigInt = BigInt(result.data.election_id);

                const contract = await loadContract(session);
                const payload = {
                    ...data,
                    election_id: electionIdBigInt
                };
                console.log('Payload for createElections:', payload);

                await createElections(session, contract, payload);
                alert('Election created successfully!');
                await fetchFullElectionData(user.id);
                toggleForm();
            } else {
                alert('Failed to create election. Election ID is missing.');
            }
        } catch (err) {
            console.error('Error creating election:', err);
            alert('An unexpected error occurred.');
        }
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
