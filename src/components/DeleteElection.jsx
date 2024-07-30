/* eslint-disable react/prop-types */
import { useState } from 'react';

const DeleteElection = ({ onDelete, loading, error }) => {
    const [electionId, setElectionId] = useState('');

    const handleChange = (e) => {
        setElectionId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onDelete(electionId);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
            <div className="mb-4">
                <label htmlFor="electionId" className="block text-gray-700 font-semibold mb-2">Election ID</label>
                <input type="text" id="electionId" name="electionId" value={electionId} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            {error && <p className="text-red-500">{error.message}</p>}
            <button type="submit" className="bg-primary text-white p-2 rounded-lg w-full" disabled={loading}>Delete Election</button>
        </form>
    );
};

export default DeleteElection;
