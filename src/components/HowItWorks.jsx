import { FaCheckCircle, FaUserEdit, FaLock } from 'react-icons/fa';
import useGsapAnimation from '../hooks/useGsapAnimation';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';

const HowItWorks = () => {
    const breakpoints = [640, 768, 1024]; // example breakpoints for responsiveness
    const index = useResponsiveJSX(breakpoints);

    const step1Ref = useGsapAnimation({
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 },
    });

    const step2Ref = useGsapAnimation({
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 },
    });

    const step3Ref = useGsapAnimation({
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 },
    });

    return (
        <div className="py-16 p-12 how-it-works-section">
            <div className='bg-white rounded-3xl p-12'>
                <h2 className="text-3xl font-bold text-center text-primary mb-12">How VoteChain Works</h2>
                <div className="relative flex flex-col items-center max-w-4xl mx-auto">
                    <div ref={step1Ref} className={`flex items-center ${index === 0 ? 'flex-col' : 'flex-row'} mb-16`}>
                        <div className={`flex-shrink-0 ${index === 0 ? 'mb-4' : ''}`}>
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="text-white text-2xl" />
                            </div>
                        </div>
                        <div className={`text-left ${index === 0 ? 'text-center mt-4' : 'ml-8'}`}>
                            <h3 className="text-xl text-primary font-bold">Register and Verify Your Identity</h3>
                            <p className="text-gray-600">
                                Tell us a bit about yourself and register to receive a unique Non-Fungible Token (NFT). This NFT will verify your eligibility to participate in upcoming elections.
                            </p>
                        </div>
                    </div>
                    <div ref={step2Ref} className={`flex items-center ${index === 0 ? 'flex-col' : 'flex-row'} mb-16`}>
                        <div className={`flex-shrink-0 ${index === 0 ? 'mb-4' : ''}`}>
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <FaUserEdit className="text-white text-2xl" />
                            </div>
                        </div>
                        <div className={`text-left ${index === 0 ? 'text-center mt-4' : 'ml-8'}`}>
                            <h3 className="text-xl text-primary font-bold">Participate in Elections</h3>
                            <p className="text-gray-600">
                                Once registered, you can view and participate in elections you are eligible for. Choose your preferred candidate and cast your vote through our secure system.
                            </p>
                        </div>
                    </div>
                    <div ref={step3Ref} className={`flex items-center ${index === 0 ? 'flex-col' : 'flex-row'} mb-16`}>
                        <div className={`flex-shrink-0 ${index === 0 ? 'mb-4' : ''}`}>
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <FaLock className="text-white text-2xl" />
                            </div>
                        </div>
                        <div className={`text-left ${index === 0 ? 'text-center mt-4' : 'ml-8'}`}>
                            <h3 className="text-xl text-primary font-bold">Confirm Your Vote</h3>
                            <p className="text-gray-600">
                                After voting, confirm your vote through a verification link. This step ensures your vote is accurately recorded and adds an extra layer of security to the voting process.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
