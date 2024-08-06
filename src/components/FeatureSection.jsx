import useGsapAnimation from '../hooks/useGsapAnimation';

const FeatureSection = () => {
  const featureRef = useGsapAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  return (
    <section ref={featureRef} id="FeatureSection" className="text-center p-12  ">
      <h2 className="text-5xl font-bold mb-6 text-primary">Features</h2>
      <p className="text-xl mb-16 text-gray-800">Discover the benefits of electronic elections on the EOS blockchain.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-8 rounded-lg shadow-lg ">
          <h3 className="text-2xl font-semibold mb-4 text-secondary">Secure Voting</h3>
          <p className="text-base text-gray-700">Ensure the integrity of your vote with the advanced security features of the EOS blockchain.</p>
        </div>
        <div className="p-8 rounded-lg shadow-lg ">
          <h3 className="text-2xl font-semibold mb-4 text-secondary">Transparent Results</h3>
          <p className="text-base text-gray-700">Experience transparent and tamper-proof election results with the EOS blockchain.</p>
        </div>
        <div className="p-8 rounded-lg shadow-lg ">
          <h3 className="text-2xl font-semibold mb-4 text-secondary">Decentralized Governance</h3>
          <p className="text-base text-gray-700">Empower voters with decentralized governance and decision-making using the EOS blockchain.</p>
        </div>
        <div className="p-8 rounded-lg shadow-lg ">
          <h3 className="text-2xl font-semibold mb-4 text-secondary">Immutable Records</h3>
          <p className="text-base text-gray-700">Keep a permanent and unalterable record of all election data on the EOS blockchain.</p>
        </div>
        <div className="p-8 rounded-lg shadow-lg ">
          <h3 className="text-2xl font-semibold mb-4 text-secondary">Efficient and Cost-effective</h3>
          <p className="text-base text-gray-700">Streamline the election process and reduce costs with the efficiency of the EOS blockchain.</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
