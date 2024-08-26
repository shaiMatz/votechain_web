import { useContext, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ElectionContext } from '../contexts/ElectionContext';
import { VotingPermissionContext } from '../contexts/VotingPermissionContext';
import Navbar from '../components/Navbar';
import useGsapAnimation from '../hooks/useGsapAnimation';
import Modal from '../components/Modal'; // Import a modal component for confirmations
import { FaInfoCircle } from 'react-icons/fa'; // Import an info icon from react-icons
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { castVote } from '../services/castVote';
import { confirmVote } from '../services/confirmVote';
import { session, loadContract } from '../services/sessionService';

const VotePage = () => {
    const { electionId } = useParams();
    const { user } = useContext(AuthContext);
    const { elections } = useContext(ElectionContext);
    const { hasVotingPermission, setHasVotingPermission } = useContext(VotingPermissionContext);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [message, setMessage] = useState('');
    const [showFirstModal, setShowFirstModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(true);
    const [trxId, setTrxId] = useState("");
    const [selectedCandidateName, setSelectedCandidateName] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLinkOpened, setIsLinkOpened] = useState(false);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    const election = elections?.find(e => e.id === electionId);

    const ref = useGsapAnimation({
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 1 },
    });

    // Check if the user is logged in, has the voter role, and has voting permission
    if (!user || user.role !== 'voter' || !hasVotingPermission) {
        return <Navigate to="/dashboard" />;
    }

    if (!election) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <div className="p-8 border-4 border-dashed border-red-500 rounded-lg bg-red-50">
                    <h2 className="text-4xl font-bold text-red-600 mb-4">Election Not Found</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        Oops! We couldn't find the election you're looking for. It might have ended, or the link could be incorrect.
                    </p>
                    <button
                        className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-300"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                    <button
                        className="ml-4 px-6 py-3 bg-gray-600 text-white text-lg rounded-lg hover:bg-gray-700 transition duration-300"
                        onClick={() => window.location.href = '/contact-support'}
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCandidate) {
            setMessage('Please select a candidate before submitting your vote.');
            return;
        }
        setShowFirstModal(true);
    };

    const handleFirstApproval = async () => {
        setShowFirstModal(false);
        try {
            const contract = await loadContract();
            const { trxId } = await castVote(user, selectedCandidateName, electionId, contract, elections);
            setTrxId(trxId);
            setShowSecondModal(true);
        } catch (error) {
            console.error("Error casting vote:", error);
            setMessage("Error casting vote. Please try again.");
        }
    };

    const handleFinalApproval = async () => {
        setShowSecondModal(false);
        try {
            const contract = await loadContract();
            await confirmVote(trxId, session, contract);
            setIsConfirmed(true);
            setHasVotingPermission(false);
            setSelectedCandidate(null); // Reset the selected candidate
            setSelectedCandidateName(""); // Clear the selected candidate name
        } catch (error) {
            console.error("Error confirming vote:", error);
            setMessage("Error confirming vote. Please try again.");
        }
    };

    return (
        <>
            <div className="min-h-screen">
                <Navbar />
                <div ref={ref} className="w-full p-12 max-w-4xl mx-auto flex items-center flex-col">
                    <div className="text-lg text-gray-600 flex flex-row items-center justify-center mb-4 gap-3">
                        <h2 className="text-4xl font-semibold text-center text-primary">
                            {election?.name ?? 'Loading...'}
                        </h2>

                        <FaInfoCircle
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Click here to see how to vote"
                            className="text-3xl text-primary cursor-pointer"
                            onClick={() => setShowInfoModal(true)}
                        />
                        <Tooltip id="my-tooltip" />
                    </div>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Candidates: <span className="font-semibold">{election?.candidates?.map(c => c.name).join(', ')}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                        <div className="flex flex-wrap gap-4 justify-center w-full">
                            {election?.candidates?.map((candidate, index) => (
                                <div
                                    key={index}
                                    className={`p-4 border text-center rounded-lg cursor-pointer transition-all duration-300 transform flex flex-col 
        justify-center items-center 
        ${selectedCandidate === candidate ? 'border-accent-blue bg-accent-blue-100 shadow-xl' : 'border-gray-300 bg-white shadow-md'}`}
                                    style={{
                                        minWidth: '120px',
                                        flexBasis: '20%',
                                        minHeight: '170px',
                                        backgroundColor: '#fdfdfd',
                                        borderRadius: '2px',
                                        backgroundImage: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)', // Very subtle gradient
                                        boxShadow: selectedCandidate === candidate
                                            ? '0 15px 30px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)' // Softer, more realistic shadow
                                            : '0 5px 15px rgba(0, 0, 0, 0.1)',
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                    onClick={() => { setSelectedCandidate(candidate); setSelectedCandidateName(candidate.name); setMessage(''); }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'perspective(800px) rotateX(2deg) rotateY(-2deg)';
                                        e.currentTarget.style.boxShadow = '0 25px 35px rgba(0, 0, 0, 0.25), 0 8px 12px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
                                        e.currentTarget.style.boxShadow = selectedCandidate === candidate
                                            ? '0 15px 30px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.15)'
                                            : '0 5px 15px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-gray-700">{candidate.name}</h3>
                                    <p className="text-sm text-gray-500">{candidate.party}</p>
                                </div>
                            ))}
                        </div>
                        {message && <p className="text-red-500 text-center mt-4 max-w-md break-words">{message}</p>}
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
                    content={
                        <div className='flex flex-col justify-center items-center gap-3 text-center'>
                            <p>You have selected:</p>
                            <div
                                className="p-4 border transition-all duration-300 transform flex flex-col justify-center items-center border-accent-blue bg-accent-blue-100"
                                style={{
                                    width: '100px',
                                    minHeight: '130px',
                                    backgroundColor: '#fdfdfd',
                                    borderRadius: '2px',
                                    backgroundImage: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
                                }}
                            >
                                <h3 className="text-lg font-semibold text-gray-700">{selectedCandidate?.name}</h3>
                                <p className="text-sm text-gray-500">{selectedCandidate?.party}</p>
                            </div>
                            <p>Do you want to proceed?</p>
                        </div>
                    }
                    onClose={() => setShowFirstModal(false)}
                    onConfirm={handleFirstApproval}
                    buttonclass="justify-center"
                />
            )}
            {showSecondModal && (
                <Modal
                    title="Verify and Confirm Your Vote"
                    content={
                        <>
                        <div className="max-h-[60vh] overflow-y-auto">
                            <p className="mb-4 text-sm md:text-md">Your vote has been recorded with the following transaction ID:</p>
                            <div
                                className="p-4 border cursor-pointer border-gray-300 rounded-lg bg-gray-50 text-center mb-4"
                                style={{
                                    backgroundColor: '#fefefe',
                                    borderRadius: '4px',
                                    backgroundImage: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
                                }}
                                onClick={() => {
                                    alert("Remember to return to this page to confirm your vote after verifying!");
                                    window.open(`https://jungle4.cryptolions.io/v2/explore/transaction/${trxId}`, '_blank');
                                    setIsLinkOpened(true);
                                }}
                            >
                                <iframe
                                    src={`https://jungle4.cryptolions.io/v2/explore/transaction/${trxId}`}
                                    width="100%"
                                    height="300px"
                                    className="rounded-lg"
                                    style={{
                                        border: 'none',
                                        borderRadius: '4px',
                                        pointerEvents: 'none', // Disable interactions within the iframe so the click event triggers the container
                                    }}
                                ></iframe>
                            </div>
                            <p className="text-red-600 text-sm font-bold mb-4">
                                Important: You must confirm your vote using the link below to finalize your vote.
                            </p>
                            
                            <p className="mb-4 text-sm md:text-md">
                                Click the link below to verify your vote. Please return to this page to confirm: {" "}
                                <a
                                    href={`https://jungle4.cryptolions.io/v2/explore/transaction/${trxId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                    onClick={() => setIsLinkOpened(true)}
                                >
                                     Verify Vote on Blockchain
                                </a>
                            </p>
                           
                           
                        </div>
                         <div className="mt-4">
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        checked={isCheckboxChecked}
                                        onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                                        className="mr-2"
                                    />
                                    I have verified my vote on the blockchain.
                                </label>
                            </div>
                            </>
                    }
                    onClose={() => setShowSecondModal(false)}
                    onConfirm={handleFinalApproval}
                    buttonclass="justify-center"
                    confirmDisabled={!isLinkOpened && !isCheckboxChecked} // Disable confirm button if neither condition is met
                />
            )}


            {showInfoModal && (
                <Modal
                    title="How to Vote"
                    buttonclass="justify-center"
                    content={
                        <div className="text-left text-gray-700">
                            <ol className="list-decimal pl-4 space-y-2">
                                <li>
                                    <span className="font-bold">Select Your Candidate: </span>
                                    Click on the candidate you want to vote for. Your selection will be highlighted.
                                </li>
                                <li>
                                    <span className="font-bold">Submit Your Vote: </span>
                                    Press the <span className="font-semibold text-blue-600">"Submit Vote"</span> button.
                                </li>
                                <li>
                                    <span className="font-bold">Confirm Your Selection: </span>
                                    A popup will appear. If you’re sure about your choice, click <span className="font-semibold text-blue-600">"Confirm"</span>.
                                </li>
                                <li>
                                    <span className="font-bold">Verify Your Vote: </span>
                                    You’ll receive a special link to verify your vote. Open the link to confirm your vote was recorded correctly.
                                </li>
                                <li>
                                    <span className="font-bold">Vote Cast: </span>
                                    After verifying, your vote is officially cast, and you'll see a confirmation message.
                                </li>
                            </ol>
                        </div>
                    }
                    onClose={() => setShowInfoModal(false)}
                    onConfirm={() => setShowInfoModal(false)}
                />
            )}
        </>
    );
};

export default VotePage;
