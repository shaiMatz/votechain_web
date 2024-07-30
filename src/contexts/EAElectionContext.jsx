/* eslint-disable react/prop-types */
import  { createContext, useState } from 'react';
import useAPI from '../api/useAPI';
import { BASE_API_URL } from '../config';

export const EAElectionContext = createContext();

const defaultElections = [
   
];

export const EAElectionProvider = ({ children }) => {
    const [elections, setElections] = useState(defaultElections);

    const {  loading: createLoading, error: createError, fetchData: createElectionAPI } = useAPI();
    const { loading: updateLoading, error: updateError, fetchData: updateElectionAPI } = useAPI();
    const {  loading: deleteLoading, error: deleteError, fetchData: deleteElectionAPI } = useAPI();
    const {  loading: publishLoading, error: publishError, fetchData: publishResultsAPI } = useAPI();
    const {  loading: electionsLoading, error: electionsError } = useAPI();

   
 
    const createElection = (electionData) => {
        createElectionAPI(`${BASE_API_URL}/create_election`, 'POST', electionData);
    };

    const updateElection = (electionData) => {
        updateElectionAPI(`${BASE_API_URL}/update_election`, 'POST', electionData);
    };

    const deleteElection = (electionId) => {
        deleteElectionAPI(`${BASE_API_URL}/delete_election`, 'POST', { id: electionId });
    };

    const publishResults = (electionId) => {
        publishResultsAPI(`${BASE_API_URL}/publish_results`, 'POST', { election_id: electionId });
    };

    return (
        <EAElectionContext.Provider value={{
            elections,
            setElections,
            createElection,
            updateElection,
            deleteElection,
            publishResults,
            createLoading,
            createError,
            updateLoading,
            updateError,
            deleteLoading,
            deleteError,
            publishLoading,
            publishError,
            electionsLoading,
            electionsError
        }}>
            {children}
        </EAElectionContext.Provider>
    );
};
