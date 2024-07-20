import React from 'react';
import useGsapAnimation from '../hooks/useGsapAnimation';

const HowItWorksSection = () => {
  const howItWorksRef = useGsapAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  return (
    <section ref={howItWorksRef} id="howitsworks" className="text-center p-12 bg-white">
      <h2 className="text-5xl font-bold mb-12 text-primary">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Step 1</h3>
          <p className="text-lg">Register on our platform.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Step 2</h3>
          <p className="text-lg">Login with your credentials.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Step 3</h3>
          <p className="text-lg">Cast your vote securely and transparently.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
