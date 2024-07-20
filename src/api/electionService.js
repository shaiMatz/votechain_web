import useAPI from './useAPI';
import {BASE_API_URL} from '../config';

export const useCreateElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const createElection = (electionData) => fetchData(`${BASE_API_URL}/create_election`, 'POST', electionData);
  return { data, loading, error, createElection };
};

export const useGetElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getElection = (id) => fetchData(`${BASE_API_URL}/get_election_by_id`, 'POST', { id });
  return { data, loading, error, getElection };
};

export const useUpdateElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const updateElection = (electionData) => fetchData(`${BASE_API_URL}/update_election`, 'POST', electionData);
  return { data, loading, error, updateElection };
};

export const useDeleteElection = () => {
  const { data, loading, error, fetchData } = useAPI();
  const deleteElection = (id) => fetchData(`${BASE_API_URL}/delete_election`, 'POST', { id });
  return { data, loading, error, deleteElection };
};
