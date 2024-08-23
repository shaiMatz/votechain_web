/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaUserEdit, FaLock, FaTools, FaClipboardCheck, FaChartBar, FaGavel, FaUserCheck } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from "react-router-dom";

const HowItWorks = ({ scroll }) => {
    const containerRef = useRef(null);
    const [activeSide, setActiveSide] = useState(null); // null | 'voter' | 'ea'
    const [clickedSide, setClickedSide] = useState(null); // null | 'voter' | 'ea'
    console.log("clickedSide", clickedSide);
    console.log("activeSide", activeSide);
    const navigate = useNavigate();

    // Effect to handle component-specific scroll behavior
    useEffect(() => {
        console.log("scroll", scroll);

        if (containerRef.current) {
            containerRef.current.style.overflowY = scroll;
            containerRef.current.style.maxHeight = scroll === 'auto' ? '100vh' : '100vh';
        }
    }, [scroll]);

    const handleSwipe = (side) => {
        setClickedSide(clickedSide === side ? null : side);
    };

    const voterHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('ea'),
        onSwipedRight: () => handleSwipe('voter'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const eaHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('ea'),
        onSwipedRight: () => handleSwipe('voter'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const handleJoinClick = () => {
        navigate("/login");
    };

    const voterContent = (
        <div className="py-12 md:p-8 ">
            <div className="relative flex flex-col items-center max-w-4xl mx-auto">
                <div className="flex items-center flex-col md:flex-row mb-16">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="text-center mt-4 md:text-left md:ml-8">
                        <h3 className="text-xl text-primary font-bold">Register and Verify Your Identity</h3>
                        <p className="text-gray-600">
                            Tell us a bit about yourself and register to receive a unique Non-Fungible Token (NFT). This NFT will verify your eligibility to participate in upcoming elections.
                        </p>
                     
                                            </div>
                </div>
                <div className="flex items-center flex-col md:flex-row mb-16">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaUserEdit className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="text-center mt-4 md:text-left md:ml-8">
                        <h3 className="text-xl text-primary font-bold">Participate in Elections</h3>
                        <p className="text-gray-600">
                            Once registered, you can view and participate in elections you are eligible for. Choose your preferred candidate and cast your vote through our secure system.
                        </p>
                    </div>
                </div>
                <div className="flex items-center flex-col md:flex-row mb-8">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <FaLock className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="text-center mt-4 md:text-left md:ml-8">
                        <h3 className="text-xl text-primary font-bold">Confirm Your Vote</h3>
                        <p className="text-gray-600">
                            After voting, confirm your vote through a verification link. This step ensures your vote is accurately recorded and adds an extra layer of security to the voting process.
                        </p>
                    </div>
                  
                </div>
                <button
                    className="px-6 w-64 py-3 text-accent-white-100 border border-secondary-100 bg-secondary-100 rounded-full shadow-lg hover:bg-secondary-200 hover:text-white focus:outline-none"
                    onClick={handleJoinClick}
                >
                    Login to Vote
                </button>
        
            </div>
        </div>
    );

    const eaContent = (
        <div className="py-12 md:p-8 ">
            <p className="text-gray-600 mb-4 text-sm">
                * To become an Election Administrator, please contact us for more information and access.
            </p>
            <div className="relative flex flex-col items-center max-w-4xl mx-auto">
                <div className="flex items-center flex-col md:flex-row mb-16">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-secondary-300 rounded-full flex items-center justify-center">
                            <FaTools className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="text-center mt-4 md:text-left md:ml-8">
                        <h3 className="text-xl text-primary font-bold">Set Up Elections</h3>
                        <p className="text-gray-600">
                            Define the election parameters, including name, dates, candidates, and voter eligibility criteria. Use VoteChain to manage the entire election setup process.
                        </p>
                    </div>
                </div>
                <div className="flex items-center flex-col md:flex-row mb-16">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-secondary-300 rounded-full flex items-center justify-center">
                            <FaClipboardCheck className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="text-center mt-4 md:text-left md:ml-8">
                        <h3 className="text-xl text-primary font-bold">Monitor Voting Process</h3>
                        <p className="text-gray-600">
                            Track voter participation, monitor the progress of the election, and ensure that all procedures are followed correctly to maintain transparency and trust.
                        </p>
                    </div>
                </div>
                <div className="flex items-center flex-col md:flex-row mb-16">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-secondary-300 rounded-full flex items-center justify-center">
                            <FaChartBar className="text-white text-2xl" />
                        </div>
                    </div>
                    <div className="text-center mt-4 md:text-left md:ml-8">
                        <h3 className="text-xl text-primary font-bold">View Results</h3>
                        <p className="text-gray-600">
                            After the voting ends, securely tally the votes and publish the results. Use VoteChain's blockchain-based system to ensure accuracy and immutability of the results.
                        </p>
                    </div>
                </div>
               
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="px-2 max-h-screen min-h-screen">
            <div className="flex w-full h-[100dvh]">
                <div
                    {...voterHandlers}
                    className={`h-full transition-all duration-500 ease-in-out flex-grow border-r-2 relative overflow-y-auto md:overflow-y-hidden cursor-pointer
                        ${clickedSide === 'voter' ? 'flex-grow-[6]' : clickedSide === 'ea' ? 'flex-grow-[1]' :
                            activeSide === 'voter' ? 'flex-grow-[2]' : activeSide === 'ea' ? 'flex-grow-[1.5]' : 'flex-grow-1'}`}
                    onMouseEnter={() => !clickedSide && setActiveSide('voter')}
                    onMouseLeave={() => !clickedSide && setActiveSide(null)}
                    onClick={() => setClickedSide(clickedSide === 'voter' ? null : 'voter')}
                >
                    <div className={`absolute ${clickedSide === 'voter' ? 'top-10 left-1/2 transform -translate-x-1/2' : 'right-4 top-1/2 transform -translate-y-1/2'} text-2xl md:text-4xl font-pacifico flex flex-col`}>
                        <div className='flex items-center gap-3'>
                            {clickedSide === 'voter' ? <p className='text-4xl'>Voter</p> : <p className={` ${clickedSide === 'ea' ? "text-lg" : ""}`}>I am Voter</p>}
                            <FaUserCheck className="inline-block mr-2" />
                        </div>
                        {clickedSide === 'voter' ? "" : <span className="text-xs text-gray-700">Press here if you're a voter</span> }
                       
                    </div>
                    {clickedSide === 'voter' && <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-lg">{voterContent}</div>}
                </div>
                <div
                    {...eaHandlers}
                    className={`h-full transition-all duration-500 ease-in-out flex-grow relative overflow-y-auto md:overflow-y-hidden  cursor-pointer
                        ${clickedSide === 'ea' ? 'flex-grow-[6]' : clickedSide === 'voter' ? 'flex-grow-[1] overflow-hidden' :
                            activeSide === 'ea' ? 'flex-grow-[2]' : activeSide === 'voter' ? 'flex-grow-[1.5]' : 'flex-grow-1'}`}
                    onMouseEnter={() => !clickedSide && setActiveSide('ea')}
                    onMouseLeave={() => !clickedSide && setActiveSide(null)}
                    onClick={() => setClickedSide(clickedSide === 'ea' ? null : 'ea')}
                >
                    <div className={`absolute ${clickedSide === 'ea' ? 'top-10 right-1/2 transform translate-x-1/2' : 'left-4 top-1/2 transform -translate-y-1/2'}
                         text-2xl md:text-4xl font-pacifico flex flex-col`}>
                        <div className='flex items-center gap-3'>
                            <FaGavel className="inline-block mr-2" />
                            {clickedSide === 'ea' ? <p className='text-4xl  '>Election Administrator</p> : <p className={` ${clickedSide === 'voter' ? "text-lg" : ""}`}>I am Election Administrator</p>}
                        </div>
                        {clickedSide === 'ea' ? "" : <span className="text-xs text-gray-700">Press here if you're an Election Administrator</span>}
                    </div>
                    {clickedSide === 'ea' && <div className="absolute top-32 md:top-20 right-1/2 transform translate-x-1/2 text-lg">{eaContent}</div>}
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;