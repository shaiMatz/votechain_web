/* eslint-disable react/prop-types */
import  { useContext, useEffect, useState } from 'react';
import { useAddress } from '../contexts/AddressContext';
import { FaPlus, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';

const transformData = (data) => ({
    id: data.id || '',
    name: data.name || '',
    startdate: data.startdate || '',
    enddate: data.enddate || '',
    isended: data.isended || 0,
    candidates: (data.candidates || []).map((candidate) => ({
        id: candidate.id || '',
        name: candidate.name || '',
        party: candidate.party || '',
    })),
    minage: data.voterscriteria?.minage || '',
    maxage: data.voterscriteria?.maxage || '',
    country: data.voterscriteria?.country || '',
    state: data.voterscriteria?.state || '',
    city: data.voterscriteria?.city || '',
    userList: (Array.isArray(data.voterscriteria?.userList) ? data.voterscriteria.userList.join(', ') : data.voterscriteria?.userList || ''), // Convert array to string
    criteriaType: data.voterscriteria?.userList?.length > 0 ? 'list' : 'attributes', // Assuming criteriaType is 'list' if userList has items, otherwise 'attributes'
});


const ElectionForm = ({ Data, onCreate, loading, error }) => {
    const [electionData, setElectionData] = useState(Data ? transformData(Data) : {
        name: '',
        startdate: '',
        enddate: '',
        isended: 0,
        candidates: [],
        minage: '',
        maxage: '',
        country: '',
        state: '',
        city: '',
        userList: '',
        criteriaType: 'list',
    });
    const title = Data ? 'Edit Election' : 'Add Election';
    const buttonText = Data ? 'Update Election' : 'Create Election';

    const [candidateName, setCandidateName] = useState('');
    const [candidateParty, setCandidateParty] = useState('');
    const{user} = useContext(AuthContext);
    const { addresses } = useAddress();
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (Data) {
            setElectionData(transformData(Data));
        }
    }, [Data]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setElectionData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAddCandidate = () => {
        setElectionData(prevData => ({
            ...prevData,
            candidates: [...prevData.candidates, { name: candidateName, party: candidateParty }]
        }));
        setCandidateName('');
        setCandidateParty('');
    };

    const handleRemoveCandidate = (index) => {
        setElectionData(prevData => ({
            ...prevData,
            candidates: prevData.candidates.filter((_, i) => i !== index)
        }));
    };

    const handleNext = () => {
        setStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...electionData };

        if (data.criteriaType === 'list') {
            const validation = validateVoterIDs(data.userList);
            if (!validation.valid) {
                alert(validation.message);
                return;
            }

            if (typeof data.userList === 'string' && data.userList.trim().length > 0) {
                if (data.userList.trim().length === 9) {
                    data.userList = [data.userList.trim()];
                } else {
                    data.userList = data.userList
                        .split(/[\s,]+/)
                        .map((id) => id.trim())
                        .filter((id) => id.length === 9);
                }
            } else {
                data.userList = [];
            }
        } else {
            data.userList = [];
        }

        // Transform the data to the required format
        const payload = {
            name: data.name,
            startdate: data.startdate,
            enddate: data.enddate,
            isended: data.isended,
            ea_id: user.id,
            candidates: data.candidates.map((candidate) => ({
                name: candidate.name,
                party: candidate.party,
            })),
            voterscriteria: {
                minage: parseInt(data.minage, 10),
                maxage: parseInt(data.maxage, 10),
                city: data.city,
                state: data.state,
                country: data.country,
                userList: data.criteriaType === 'list'
                    ? data.userList.map((id) => parseInt(id, 10))
                    : [],
            },
        };

        try {
            onCreate(payload, data);
        } catch (error) {
            console.error('Failed to create election:', error);
        }
    };



    const validateVoterIDs = (userListString) => {
        // Split the string into an array of IDs
        if (!userListString) {
            return { valid: false, message: "Voter ID list is empty." };
        }
        //check if have only 1 id
        if (userListString.length === 9) {
            return { valid: true, message: "" };
        } 

        const ids = userListString.split(/[\s,]+/).map(id => id.trim());
        const idSet = new Set(ids);

        if (ids.length !== idSet.size) {
            return { valid: false, message: "Duplicate IDs found." };
        }

        for (let id of ids) {
            if (!/^\d{9}$/.test(id)) {
                return { valid: false, message: `Invalid ID found: ${id}. IDs should be exactly 9 digits.` };
            }
        }

        return { valid: true, message: "" };
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.trim().split('\n');
                // Check if the first line contains non-numeric characters (assuming it's a header if so)
                const firstLineIsHeader = isNaN(lines[0].split(',')[0]);

                // Remove the header if it's detected
                const voterIds = firstLineIsHeader ? lines.slice(1) : lines;
                setElectionData(prevData => ({ ...prevData, userList: voterIds.join('\n') }));
            };

            reader.readAsText(file);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="bg-transparent h-full w-full">
            {step === 1 && (
                <div className={`flex flex-col justify-between h-full w-full`}>
                    <div>
                        <div className="mb-4 flex items-center">

                            <h2 className="text-xl md:text-2xl mb-4 text-gray-700">{title}</h2>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Election Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={electionData.name}
                                onChange={handleChange}
                                className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="mb-4 md:flex md:space-x-4">
                            <div className="flex-1 mb-4 md:mb-0">
                                <label htmlFor="startdate" className="block text-gray-700 font-semibold mb-2">Start Date</label>
                                <input
                                    type="date"
                                    id="startdate"
                                    name="startdate"
                                    value={electionData.startdate}
                                    onChange={handleChange}
                                    className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="enddate" className="block text-gray-700 font-semibold mb-2">End Date</label>
                                <input
                                    type="date"
                                    id="enddate"
                                    name="enddate"
                                    value={electionData.enddate}
                                    onChange={handleChange}
                                    className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={handleNext} className="bg-primary text-white p-2 rounded-lg flex flex-row gap-3 w-full items-center justify-center">Next <FaArrowRight /></button>
                </div>
            )}

            {step === 2 && (
                <div className={`flex flex-col  justify-between h-full w-full`}>
                    <div>
                        <div className="mb-4 flex items-center">
                            <button type="button" onClick={handleBack} className="text-gray-700 mr-2">
                                <FaArrowLeft />
                            </button>
                            <h2 className="text-xl md:text-2xl text-gray-700">Candidates</h2>
                        </div>
                        <div className="mb-4 ">
                            {electionData.candidates && (
                                <div className="mb-2 flex flex-col space-y-2 h-3/5 overflow-y-auto">
                                    {electionData.candidates.map((candidate, index) => (
                                        <div key={index} className="flex  md:flex-row items-center justify-between p-2 border border-gray-300 rounded-lg bg-transparent">
                                            <div className="mb-0">
                                                <p className="font-semibold text-gray-800">{candidate.name}</p>
                                                <p className="text-sm text-gray-600">{candidate.party}</p>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveCandidate(index)} className="text-gray-500 hover:text-red-700">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex mt-4 items-center space-y-2 ">
                                
                                <div className='space-y-2 md:space-x-2'><input
                                    type="text"
                                    value={candidateName}
                                    onChange={(e) => setCandidateName(e.target.value)}
                                    placeholder="Candidate Name"
                                    className="flex-grow p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <input
                                    type="text"
                                    value={candidateParty}
                                    onChange={(e) => setCandidateParty(e.target.value)}
                                    placeholder="Party"
                                    className="flex-grow p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                </div>
                                <button type="button" onClick={handleAddCandidate} className="p-2 text-secondary-100 hover:text-secondary-500 rounded-lg">
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={handleNext} className="bg-primary text-white p-2 rounded-lg flex flex-row gap-3 w-full items-center justify-center">Next <FaArrowRight /></button>
                </div>
            )}


            {step === 3 && (
                <div className="flex flex-col  justify-between h-full w-full">
                    <div>
                        <div className="mb-4 flex items-center">
                            <button type="button" onClick={handleBack} className="text-gray-700 mr-2">
                                <FaArrowLeft />
                            </button>
                            <h2 className="text-xl md:text-2xl text-gray-700">Voter Criteria</h2>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Criteria Type</label>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="criteriaList"
                                        name="criteriaType"
                                        value="list"
                                        checked={electionData.criteriaType === 'list'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="criteriaList" className="text-gray-700">List of Voter IDs</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="criteriaAttributes"
                                        name="criteriaType"
                                        value="attributes"
                                        checked={electionData.criteriaType === 'attributes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="criteriaAttributes" className="text-gray-700">Attributes</label>
                                </div>
                            </div>
                            {electionData.criteriaType === 'list' ? (
                                <div className="mb-4">
                                    <label htmlFor="userList" className="block text-gray-700 font-semibold mb-2">Specific Voter IDs</label>
                                    <textarea
                                        id="userList"
                                        name="userList"
                                        value={electionData.userList}
                                        onChange={handleChange}
                                        className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="User IDs separated by commas or new lines"
                                    />
                                    <div className="mt-2">
                                        <label className="block text-gray-700 font-semibold mb-2">Or Upload CSV File</label>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex-1">
                                            <label htmlFor="minage" className="block text-gray-600">Min Age</label>
                                            <input
                                                min={0}
                                                max={120}
                                                type="number"
                                                id="minage"
                                                name="minage"
                                                value={electionData.minage}
                                                onChange={handleChange}
                                                className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="maxage" className="block text-gray-600">Max Age</label>
                                            <input
                                                min={0}
                                                max={120}
                                                type="number"
                                                id="maxage"
                                                name="maxage"
                                                value={electionData.maxage}
                                                onChange={handleChange}
                                                className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        <div className="flex-1">
                                            <label htmlFor="country" className="block text-gray-600">Country</label>
                                            <select
                                                id="country"
                                                name="country"
                                                value={electionData.country}
                                                onChange={handleChange}
                                                className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="">Select Country</option>
                                                {addresses.countries.map(country => <option key={country} value={country}>{country}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="state" className="block text-gray-600">State</label>
                                            <select
                                                id="state"
                                                name="state"
                                                value={electionData.state}
                                                onChange={handleChange}
                                                className="w-full text-gray-700 p-2 border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                                disabled={!electionData.country}
                                            >
                                                <option value="">Select State</option>
                                                {electionData.country && addresses.states[electionData.country].map(state => <option key={state} value={state}>{state}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="city" className="block text-gray-600">City</label>
                                            <select
                                                id="city"
                                                name="city"
                                                value={electionData.city}
                                                onChange={handleChange}
                                                className="w-full p-2 border text-gray-700 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                                disabled={!electionData.state}
                                            >
                                                <option value="">Select City</option>
                                                {electionData.state && addresses.cities[electionData.state].map(city => <option key={city} value={city}>{city}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-primary text-white p-2 rounded-lg w-full" disabled={loading}>{buttonText}</button>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500">{error.message}</p>}
        </form>
    );
};

export default ElectionForm;
