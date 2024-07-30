/* eslint-disable react/prop-types */
import  { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useGsapAnimation from '../hooks/useGsapAnimation';
import {FaArrowRight} from 'react-icons/fa';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';
import { VotingPermissionContext } from '../contexts/VotingPermissionContext';

const ElectionList = ({ title, description, elections = [], noElectionMessage }) => {
  const listRef = useGsapAnimation({
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0, duration: 1 },
  });

  const index = useResponsiveJSX(breakpoints);
  const navigate = useNavigate();
  const { setHasVotingPermission } = useContext(VotingPermissionContext);

  const getFlexClass = () => {
    switch (index) {
      case 0: return 'flex flex-wrap justify-center'; // Small screen
      case 1: return 'flex flex-wrap justify-center'; // Medium screen
      default: return 'flex flex-wrap'; // Large and extra-large screens
    }
  };

  const getStatusTag = (election,startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const isStarted = now >= start && now <= end;
    const isEnded = now > end;
    const isStartingSoon = now < start && (start - now <= 7 * 24 * 60 * 60 * 1000); // Starting within a week

    let statusLabel = '';
    let bgColor = '';

    if (isEnded) {
      statusLabel = 'Ended';
      election.isended = true;
      bgColor = 'bg-red-200 text-red-800';
    } else if (isStarted) {
      statusLabel = 'Started';
      bgColor = 'bg-green-200 text-green-800';
    } else if (isStartingSoon) {
      statusLabel = 'Starting Soon';
      bgColor = 'bg-yellow-200 text-yellow-800';
    } else {
      statusLabel = 'Upcoming';
      bgColor = 'bg-blue-200 text-blue-800';
    }

    return <span className={`text-sm font-semibold px-2 py-1 rounded-full ${bgColor}`}>{statusLabel}</span>;
  };

  const handleVoteClick = (electionId) => {
    setHasVotingPermission(true);
    navigate(`/vote/${electionId}`);
  };
  const handleResultsClick = (electionId) => {
    navigate(`/results/${electionId}`);
  };
  return (
    <div ref={listRef} className="px-6">
      <h2 className="text-2xl font-bold mb-2 text-primary">{title}</h2>
      {description && <p className="text-lg text-gray-700 mb-6">{description}</p>}
      <div className={`${getFlexClass()}`}>
        {elections && elections.length > 0 ? (
          elections.map((election) => (
            <div
              key={election.id}
              className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer transition-shadow duration-300 sm:mr-6 mb-6 flex-grow flex flex-col
               justify-between"
              style={{ minWidth: '275px', flexBasis: '25%', minHeight: '150px',  maxWidth: `${index < 1 ? 'calc(100vw - 50vw)' : 'auto'}` }} 
            >
              <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl mr-3 font-semibold text-gray-900">{election.name}</h3>
                  {getStatusTag(election,election.startdate, election.enddate)}
              </div>
            
              <p className="text-lg text-gray-700 flex items-center">
                {`Candidates: ${election.candidates.map(c => c.name).join(', ') }`}
              </p>
              </div>
              <div className='mt-6 flex items-center justify-between'> 
                  <p className="text-md text-gray-400 ">
                {election.startdate} to {election.enddate}
              </p>
                {election.isended ? <p className="text-md text-pink-600 hover:font-bold hover:underline flex items-center" onClick={() => handleResultsClick(election.id)}>Results  <FaArrowRight className="ml-2" /></p> :
                  <p className="text-md text-pink-600 hover:font-bold hover:underline flex items-center" onClick={() => handleVoteClick(election.id)}> Let&rsquo;s vote  <FaArrowRight className="ml-2" />
              </p>}
             
              
              </div>
             
            </div>
          ))
        ) : (
          <p className="text-gray-700 text-lg shadow-xl p-16 rounded-lg">{noElectionMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ElectionList;
