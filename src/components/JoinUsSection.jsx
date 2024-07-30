import useGsapAnimation from '../hooks/useGsapAnimation';

const JoinUsSection = () => {
  const joinUsRef = useGsapAnimation({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  return (
    <section ref={joinUsRef} className="text-center p-12 bg-gray-100">
      <h2 className="text-5xl font-bold mb-12 text-primary">Join Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Create Elections</h3>
          <p className="text-lg">Election Authorities (EA) can easily create and manage elections with VoteChain.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Engage Voters</h3>
          <p className="text-lg">Reach a wider audience and ensure a secure voting process.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-secondary">Join Now</h3>
          <p className="text-lg">Contact us to get started with your election today!</p>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;
