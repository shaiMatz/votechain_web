import useAPI from './useAPI';
import { BASE_API_URL } from '../config';
import { useCallback } from 'react';

export const useCreateElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const createElection = useCallback(async (electionData, onSuccess) => {
    const result = await fetchData(`${BASE_API_URL}/create_election`, 'POST', electionData);
    if (!error && onSuccess) {
      onSuccess();
    }
    return result;
  }, [fetchData, error]);
  return { data, loading, error, createElection };
};

export const useGetElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getElection = useCallback((id) => fetchData(`${BASE_API_URL}/get_election_by_id`, 'POST', { id }), [fetchData]);
  return { data, loading, error, getElection };
};

export const useUpdateElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const updateElection = useCallback((electionData) => fetchData(`${BASE_API_URL}/update_election`, 'POST', electionData), [fetchData]);
  return { data, loading, error, updateElection };
};

export const useDeleteElection = () => {
  const { data, loading, error, fetchData } = useAPI();

  const deleteElection = useCallback(async (id) => {
    const result = await fetchData(`${BASE_API_URL}/delete_election`, 'POST', { id });
    if (result && result.error_code !== 0) {
      throw new Error(result.message || 'Failed to delete election');
    }
    return result;
  }, [fetchData]);

  return { data, loading, error, deleteElection };
};

export const useGetElectionsByUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getElectionsByUser = useCallback(async (user_id) => {
    user_id = parseInt(user_id);
    var res=await fetchData(`${BASE_API_URL}/get_elections_by_user`, 'POST', {user_id} );
    return res;
  }, [fetchData]);
  return { data, loading, error, getElectionsByUser };
};

export const useGetElectionWinner = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getElectionWinner = useCallback((electionId) => fetchData(`${BASE_API_URL}/get_election_winner`, 'POST', { election_id: electionId }), [fetchData]);
  return { data, loading, error, getElectionWinner };
};

export const useGetElectionsByEA = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getElectionsByEA = useCallback(async (eaId) => {
    const result = await fetchData(`${BASE_API_URL}/get_elections_by_ea`, 'POST', { ea_id: eaId });
    return result;
  }, [fetchData]);
  return { data, loading, error, getElectionsByEA };
};
