import React from 'react';
import useGsapAnimation from '../hooks/useGsapAnimation';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowLeft, FaArrowRight, FaCalendarAlt, FaLongArrowAltRight } from 'react-icons/fa';
import { useResponsiveJSX } from '../hooks/useResponsiveJSX';
import { breakpoints } from '../config';

const ElectionList = ({ title, description, elections = [], noElectionMessage }) => {
  const listRef = useGsapAnimation({
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0, duration: 1 },
  });

  const index = useResponsiveJSX(breakpoints);

  const getFlexClass = () => {
    switch (index) {
      case 0: return 'flex flex-wrap justify-center'; // Small screen
      case 1: return 'flex flex-wrap justify-center'; // Medium screen
      default: return 'flex flex-wrap'; // Large and extra-large screens
    }
  };

  const getStatusTag = (isended) => {
    return (
      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${isended ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
        {isended ? 'Closed' : 'Open'}
      </span>
    );
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
              className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl hover:cursor-pointer transition-shadow duration-300 sm:mr-6 mb-6 flex-grow"
              style={{ minWidth: '275px', flexBasis: '25%', minHeight: '150px',  maxWidth: `${index < 1 ? 'calc(100vw - 50vw)' : 'auto'}` }} 
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl mr-3 font-semibold text-gray-900">{election.name}</h3>
                {getStatusTag(election.isended)}
              </div>
            
              <p className="text-lg text-gray-700 flex items-center">
                {`Candidates: ${election.candidates.join(', ')}`}
              </p>
              <div className='mt-6 flex items-center justify-between'> 
                  <p className="text-md text-gray-400 ">
                {election.startdate} to {election.enddate}
              </p>
              {election.isended ? <p className="text-md text-pink-600 hover:font-bold hover:underline flex items-center">Results  <FaArrowRight className="ml-2" /></p> :
               <p className="text-md text-pink-600 hover:font-bold hover:underline flex items-center">Let's vote  <FaArrowRight className="ml-2" />
              </p>}
             
              
              </div>
             
            </div>
          ))
        ) : (
          <p className="text-gray-700 text-lg">{noElectionMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ElectionList;
