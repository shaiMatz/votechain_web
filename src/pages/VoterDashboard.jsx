import { useContext, useEffect, useState } from 'react';
import { ElectionContext } from '../contexts/ElectionContext';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';
import ElectionList from '../components/ElectionList';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';
import { checkIfNftUsed } from '../services/checkIfNftUsed';
import Footer from '../components/Footer';

const Spinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
  </div>
);

const VoterDashboard = () => {
  const { elections, fetchElectionsByUser } = useContext(ElectionContext);
  const { user } = useAuth();
  const index = useResponsiveJSX(breakpoints);

  const [upcomingElections, setUpcomingElections] = useState([]);
  const [closedElections, setClosedElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkVotedElections = async () => {
      try {
        const updatedElections = await Promise.all(
          elections.map(async (election) => {
            const voteLog = await checkIfNftUsed(user, election.id);
            return {
              ...election,
              userHasVoted: !!voteLog, // Adds userHasVoted field to each election object
            };
          })
        );
        const currentDate = new Date();

        setUpcomingElections(
          updatedElections.filter(election =>
            new Date(election.enddate) > currentDate && !election.userHasVoted
          )
        );
        setClosedElections(
          updatedElections.filter(election =>
            new Date(election.enddate) <= currentDate || election.userHasVoted
          )
        );
      } catch (err) {
        console.error("Error checking voted elections:", err);
        setError("Failed to check voted elections.");
      } finally {
        setLoading(false);
      }
    };

    if (elections.length > 0) {
      checkVotedElections();
    } else {
      setLoading(false);
    }
  }, [elections, user]);

  useEffect(() => {
    if (elections.length === 0) {
      fetchElectionsByUser(user.user_id);
    }
  }, [elections, fetchElectionsByUser, user.user_id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`flex flex-col p-10 ${index === 0 ? 'bg-white-100' : 'bg-white-100'} min-h-screen`}>
      <Navbar />
      <div className='flex-grow'>
        <section className="mb-10 mt-6">
          <ElectionList
            title="Upcoming Elections"
            description="Cast your votes in the following upcoming elections."
            elections={upcomingElections}
            noElectionMessage="No upcoming elections available."
          />
        </section>
        <section>
          <ElectionList
            title="Closed Elections"
            description="View the results of the following closed elections."
            elections={closedElections}
            noElectionMessage="No closed elections available."
          />
        </section>

      </div>
     
      <Footer />
    </div>
  );
};

export default VoterDashboard;
