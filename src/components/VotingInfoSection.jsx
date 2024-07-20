import React from 'react';
import useGsapAnimation from '../hooks/useGsapAnimation';

const VotingInfoSection = () => {
  const votingInfoRef = useGsapAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  return (
    <section ref={votingInfoRef} className="text-center p-12 bg-white">
      <h2 className="text-5xl font-bold mb-12 text-primary">Voting Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Eligibility</h3>
          <p className="text-lg">Information on who is eligible to vote.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Process</h3>
          <p className="text-lg">Details on the voting process.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Support</h3>
          <p className="text-lg">Where to find help and support.</p>
        </div>
      </div>
    </section>
  );
};

export default VotingInfoSection;
