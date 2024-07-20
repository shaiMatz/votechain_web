import useAPI from './useAPI';
import {BASE_API_URL} from '../config';

export const useCreateVote = () => {
  const { data, loading, error, fetchData } = useAPI();
  const createVote = (voteData) => fetchData(`${BASE_API_URL}/create_vote`, 'POST', voteData);
  return { data, loading, error, createVote };
};

export const useGetVotesByElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getVotesByElection = (electionId) => fetchData(`${BASE_API_URL}/get_vote_list_by_election`, 'POST', { id: electionId });
  return { data, loading, error, getVotesByElection };
};

export const useCreateUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const createUser = (userData) => fetchData(`${BASE_API_URL}/create_user`, 'POST', userData);
  return { data, loading, error, createUser };
};

export const useGetUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getUser = (id) => fetchData(`${BASE_API_URL}/get_user`, 'POST', { id });
  return { data, loading, error, getUser };
};

export const useUpdateUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const updateUser = (userData) => fetchData(`${BASE_API_URL}/update_user`, 'POST', userData);
  return { data, loading, error, updateUser };
};

export const useDeleteUser = () => {
  const { data, loading, error, fetchData } = useAPI();
  const deleteUser = (id) => fetchData(`${BASE_API_URL}/delete_user`, 'POST', { id });
  return { data, loading, error, deleteUser };
};
