import useAPI from './useAPI';
import {BASE_API_URL} from '../config';

export const useCreateManager = () => {
  const { data, loading, error, fetchData } = useAPI();
  const createManager = (managerData) => fetchData(`${BASE_API_URL}/create_manager`, 'POST', managerData);
  return { data, loading, error, createManager };
};

export const useGetManager = () => {
  const { data, loading, error, fetchData } = useAPI();
  const getManager = (id) => fetchData(`${BASE_API_URL}/get_manager`, 'POST', { id });
  return { data, loading, error, getManager };
};

export const useUpdateManager = () => {
  const { data, loading, error, fetchData } = useAPI();
  const updateManager = (managerData) => fetchData(`${BASE_API_URL}/update_manager`, 'POST', managerData);
  return { data, loading, error, updateManager };
};

export const useDeleteManager = () => {
  const { data, loading, error, fetchData } = useAPI();
  const deleteManager = (id) => fetchData(`${BASE_API_URL}/delete_manager`, 'POST', { id });
  return { data, loading, error, deleteManager };
};
