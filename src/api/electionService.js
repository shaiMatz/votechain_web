import useAPI from './useAPI';
import { BASE_API_URL } from '../config';
import { useCallback } from 'react'; // Import useCallback from the 'react' package

// Hook for creating an election
export const useCreateElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const createElection = async (electionData, onSuccess) => {
    const result = await fetchData(`${BASE_API_URL}/create_election`, 'POST', electionData);
    if (!error && onSuccess) {
      onSuccess();
    }
    return result;
  };
  return { data, loading, error, createElection };
};

export const useGetElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getElection = useCallback((id) => fetchData(`${BASE_API_URL}/get_election_by_id`, 'POST', { id }), [fetchData]);
  return { data, loading, error, getElection };
};

// Hook for updating an election
export const useUpdateElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const updateElection = (electionData) => fetchData(`${BASE_API_URL}/update_election`, 'POST', electionData);
  return { data, loading, error, updateElection };
};

// Hook for deleting an election
export const useDeleteElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const deleteElection = (id) => fetchData(`${BASE_API_URL}/delete_election`, 'POST', { id });
  return { data, loading, error, deleteElection };
};

// Hook for getting elections by user
export const useGetElectionsByUser = () => {
  const { fetchData } = useAPI();

  const getElectionsByUser = useCallback(async (userId) => {
    console.log('Fetching elections for user ID:', userId); // Add console.log here
    const result = await fetchData(`${BASE_API_URL}/get_elections_by_user`, 'POST', { user_id: userId });
    console.log('Fetched elections:', result); // Add console.log here
    return result;
  }, [fetchData]);

  return { getElectionsByUser };
};
// Hook for getting the winner of an election
export const useGetElectionWinner = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getElectionWinner = (electionId) => fetchData(`${BASE_API_URL}/get_election_winner`, 'POST', { election_id: electionId });
  return { data, loading, error, getElectionWinner };
};
