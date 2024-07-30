/* eslint-disable react/prop-types */
import { useState } from 'react';

const UpdateElection = ({ onUpdate, loading, error }) => {
    const [electionData, setElectionData] = useState({
        id: '',
        name: '',
        startdate: '',
        enddate: '',
        candidates: '',
        voterscriteria: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setElectionData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(electionData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
            <div className="mb-4">
                <label htmlFor="id" className="block text-gray-700 font-semibold mb-2">Election ID</label>
                <input type="text" id="id" name="id" value={electionData.id} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Election Name</label>
                <input type="text" id="name" name="name" value={electionData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="mb-4">
                <label htmlFor="startdate" className="block text-gray-700 font-semibold mb-2">Start Date</label>
                <input type="date" id="startdate" name="startdate" value={electionData.startdate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="mb-4">
                <label htmlFor="enddate" className="block text-gray-700 font-semibold mb-2">End Date</label>
                <input type="date" id="enddate" name="enddate" value={electionData.enddate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="mb-4">
                <label htmlFor="candidates" className="block text-gray-700 font-semibold mb-2">Candidates</label>
                <input type="text" id="candidates" name="candidates" value={electionData.candidates} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Candidate IDs separated by commas" />
            </div>
            <div className="mb-4">
                <label htmlFor="voterscriteria" className="block text-gray-700 font-semibold mb-2">Voters Criteria</label>
                <input type="text" id="voterscriteria" name="voterscriteria" value={electionData.voterscriteria} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            {error && <p className="text-red-500">{error.message}</p>}
            <button type="submit" className="bg-primary text-white p-2 rounded-lg w-full" disabled={loading}>Update Election</button>
        </form>
    );
};

export default UpdateElection;
