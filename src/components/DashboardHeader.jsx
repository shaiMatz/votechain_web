import useGsapAnimation from '../hooks/useGsapAnimation';

const DashboardHeader = () => {
  const headerRef = useGsapAnimation({
    from: { opacity: 0, y: -50 },
    to: { opacity: 1, y: 0, duration: 1 },
  });

  return (
    <div ref={headerRef} className="p-6 pt-4 text-primary rounded-lg mb-6">
      <p className="text-3xl font-extrabold">Welcome to the VoteChain.</p>
      <p className="text-lg">Here you can cast your votes and view election results.</p>
    </div>
  );
};

export default DashboardHeader;
