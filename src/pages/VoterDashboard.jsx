import { useContext, useEffect, useState } from 'react';
import { ElectionContext } from '../contexts/ElectionContext';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';
import ElectionList from '../components/ElectionList';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth'; // Assuming you have a useAuth hook to get the logged-in user

const VoterDashboard = () => {
  const { elections, fetchElectionsByUser } = useContext(ElectionContext);
  const { user } = useAuth(); // Assuming the useAuth hook returns the logged-in user's info
  const index = useResponsiveJSX(breakpoints);

  const [upcomingElections, setUpcomingElections] = useState([]);
  const [closedElections, setClosedElections] = useState([]);


  useEffect(() => {
    if (!elections || elections.length === 0) {
      fetchElectionsByUser(user.user_id);
    }
  }, [elections, fetchElectionsByUser, user.user_id]);


  useEffect(() => {
    if (Array.isArray(elections)) {
      setUpcomingElections(elections.filter(election => !election.isended));
      setClosedElections(elections.filter(election => election.isended));
    }
  }, [elections]);

  return (
    <div className={`p-10 ${index === 0 ? 'bg-white-100' : 'bg-white-100'} min-h-screen`}>
      <Navbar />
      <section className="mb-10 mt-6">
        <ElectionList
          title="Upcoming Elections"
          description={`Cast your votes in the following upcoming elections.`}
          elections={upcomingElections}
          noElectionMessage="No upcoming elections available."
        />
      </section>
      <section>
        <ElectionList
          title="Closed Elections"
          description={`View the results of the following closed elections.`}
          elections={closedElections}
          noElectionMessage="No closed elections available."
        />
      </section>
    </div>
  );
};

export default VoterDashboard;
