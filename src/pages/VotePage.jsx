import  { useContext, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ElectionContext } from '../contexts/ElectionContext';
import { VotingPermissionContext } from '../contexts/VotingPermissionContext';
import Navbar from '../components/Navbar';
import useGsapAnimation from '../hooks/useGsapAnimation';
import Modal from '../components/Modal'; // Import a modal component for confirmations
import { FaInfoCircle } from 'react-icons/fa'; // Import an info icon from react-icons

const VotePage = () => {
    const { electionId } = useParams();
    const { user } = useContext(AuthContext);
    const { elections } = useContext(ElectionContext);
    const { hasVotingPermission, setHasVotingPermission } = useContext(VotingPermissionContext);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [message, setMessage] = useState('');
    const [showFirstModal, setShowFirstModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const election = elections.find(e => e.id === Number(electionId));
    const ref = useGsapAnimation({
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 1 },
    });

    // Check if the user is logged in, has the voter role, and has voting permission
    if (!user || user.role !== 'voter' || !hasVotingPermission) {
        return <Navigate to="/" />;
    }

    if (!election) {
        return <p className="text-center text-red-500">Election not found.</p>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCandidate) {
            setMessage('Please select a candidate before submitting your vote.');
            return;
        }
        setShowFirstModal(true);
    };

    const handleFirstApproval = () => {
        setShowFirstModal(false);
        setShowSecondModal(true);
    };

    const handleFinalApproval = () => {
        setShowSecondModal(false);
        setMessage(`You have successfully voted for ${selectedCandidate.name}.`);
        setSelectedCandidate(null);
        setHasVotingPermission(false);
    };

    return (
        <>
            <div className="min-h-screen">
                <Navbar />
                <div ref={ref} className="w-full max-w-4xl mx-auto flex items-center flex-col">
                    <div className="text-lg text-gray-600 flex flex-row items-center justify-center mb-4 gap-3">
                        <h2 className="text-4xl font-psemibold text-center  text-primary ">{election.name} </h2>

                        <FaInfoCircle className=" text-primary cursor-pointer" onClick={() => setShowInfoModal(true)} />
                    </div>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Candidates: <span className="font-semibold">{election.candidates.map(c => c.name).join(', ')}</span>
                    </p>
                  
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                        <div className="flex flex-wrap gap-4 justify-center w-full">
                            {election.candidates.map((candidate, index) => (
                                <div
                                    key={index}
                                    className={`p-4 border text-center rounded-lg cursor-pointer transition duration-300 transform hover:scale-105 flex flex-col 
                                        justify-center items-center
                                         ${selectedCandidate === candidate ? 'border-accent-blue bg-accent-blue-100 shadow-lg' : 'border-gray-300'}`}
                                    style={{ minWidth: '100px', flexBasis: '20%', minHeight: '150px' }}
                                    onClick={() => setSelectedCandidate(candidate)}
                                >
                                    <h3 className="text-lg font-pbold font-semibold text-gray-700">{candidate.name}</h3>
                                    <p className="text-sm text-gray-500">{candidate.party}</p>
                                </div>
                            ))}
                        </div>
                        {message && <p className="text-red-500 text-center mt-4">{message}</p>}
                        <div className="flex justify-center items-center gap-3 w-full mt-8">
                            <button
                                type="submit"
                                className="py-2 px-8 bg-secondary text-white text-lg rounded-lg hover:bg-secondary-400 transition duration-300"
                            >
                                Submit Vote
                            </button>
                           
                        </div>
                       
                    </form>
                </div>
            </div>
            {showFirstModal && (
                <Modal
                    title="Confirm Your Selection"
                    content={<>
                        <p>You have selected <b>{selectedCandidate.name}</b>.<br />Do you want to proceed?</p>
                    </>}
                    onClose={() => setShowFirstModal(false)}
                    onConfirm={handleFirstApproval}
                />
            )}
            {showSecondModal && (
                <Modal
                    title="Confirm Your Vote"
                    content={<>
                        <p>Are you sure you want to cast your vote for this candidate?</p>
                    </>}
                    onClose={() => setShowSecondModal(false)}
                    onConfirm={handleFinalApproval}
                />
            )}
            {showInfoModal && (
                <Modal
                    title="Voting Steps"
                    content={
                    <>
                        <p>1. Select your candidate.</p>
                        <p>2. Approve your selection.</p>
                        <p>3. Confirm your vote.</p>
                    </>}
                    onClose={() => setShowInfoModal(false)}
                    onConfirm={() => setShowInfoModal(false)}
                />
            )}
        </>
    );
};

export default VotePage;
