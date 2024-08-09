import useAPI from './useAPI';
import { BASE_API_URL } from '../config';
import { useCallback } from 'react';

export const useCreateUser = () => {
  const { data, loading, error, fetchData } = useAPI();

  const createUser = useCallback(async (userData) => {
    console.log("Sending user data to create user:", userData);
    const response = await fetchData(`${BASE_API_URL}/create_user`, 'POST', userData);
    console.log("Response from create user API:", response);
    return response;
  }, [fetchData]);

  return { data, loading, error, createUser };
};

export const useGetUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getUser = useCallback((id) => fetchData(`${BASE_API_URL}/get_user`, 'POST', { id }), [fetchData]);
  return { data, loading, error, getUser };
};

export const useUpdateUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const updateUser = useCallback((userData) => fetchData(`${BASE_API_URL}/update_user`, 'POST', userData), [fetchData]);
  return { data, loading, error, updateUser };
};

export const useDeleteUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const deleteUser = useCallback((id) => fetchData(`${BASE_API_URL}/delete_user`, 'POST', { id }), [fetchData]);
  return { data, loading, error, deleteUser };
};

export const useLogin = () => {
  const { data, loading, error, fetchData } = useAPI();

  const login = useCallback(async (loginData) => {
    console.log('Login function called with data:', loginData);
    try {
      const result = await fetchData(`${BASE_API_URL}/login_user`, 'POST', loginData);
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [fetchData]);

  return { data, loading, error, login };
};

export const useCreateVote = () => {
  const { data, loading, error, fetchData } = useAPI();
  const createVote = useCallback((voteData) => fetchData(`${BASE_API_URL}/create_vote`, 'POST', voteData), [fetchData]);
  return { data, loading, error, createVote };
};

export const useGetVotesByElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getVotesByElection = useCallback((electionId) => fetchData(`${BASE_API_URL}/get_vote_list_by_election`, 'POST', { id: electionId }), [fetchData]);
  return { data, loading, error, getVotesByElection };
};
