import useGsapAnimation from '../hooks/useGsapAnimation';

const FeatureSection = () => {
  const featureRef = useGsapAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  return (
    <section ref={featureRef} id="FeatureSection" className="text-center p-12 bg-gray-100">
      <h2 className="text-5xl font-bold mb-12 text-primary">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Secure</h3>
          <p className="text-lg">Ensure your vote is safe and tamper-proof.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Transparent</h3>
          <p className="text-lg">Every vote is recorded on the blockchain for transparency.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Trustworthy</h3>
          <p className="text-lg">Built on a reliable blockchain platform.</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
