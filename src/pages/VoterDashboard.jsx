import React, { useContext } from 'react';
import { ElectionContext } from '../contexts/ElectionContext';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';
import DashboardHeader from '../components/DashboardHeader';
import ElectionList from '../components/ElectionList';
import Navbar from '../components/Navbar';

const VoterDashboard = () => {
  const { elections } = useContext(ElectionContext);
  const index = useResponsiveJSX(breakpoints);

  const upcomingElections = elections?.filter(election => !election.isended) || [];
  const closedElections = elections?.filter(election => election.isended) || [];

  return (
    <div className={`p-10 ${index === 0 ? 'bg-white-100' : 'bg-white-100'} min-h-screen`}>
      <Navbar />
        <section className="mb-10 mt-6 ">
          <ElectionList 
            title="Upcoming Elections"
            description={`Cast your votes in the following upcoming elections.`}
            elections={upcomingElections}
            noElectionMessage="No upcoming elections available."
          />
        </section>
        <section className=" ">
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
