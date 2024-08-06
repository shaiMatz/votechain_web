import useAPI from './useAPI';
import { BASE_API_URL } from '../config'; 
import { useCallback } from 'react';

export const useCreateManager = () => {
    const { data, loading, error, fetchData } = useAPI();
    const createManager = (managerData) => {
        console.log("Creating manager with data:", managerData);
        return fetchData(`${BASE_API_URL}/create_manager`, 'POST', managerData);
    };
    return { data, loading, error, createManager };
};

export const useDeleteManager = () => {
    const { data, loading, error, fetchData } = useAPI();
    const deleteManager = (id) => {
        console.log("Deleting manager with ID:", id);
        return fetchData(`${BASE_API_URL}/delete_manager`, 'POST', { id });
    };
    return { data, loading, error, deleteManager };
};

export const useUpdateManager = () => {
    const { data, loading, error, fetchData } = useAPI();
    const updateManager = (managerData) => {
        console.log("Updating manager with data:", managerData);
        return fetchData(`${BASE_API_URL}/update_manager`, 'POST', managerData);
    };
    return { data, loading, error, updateManager };
};

export const useGetManager = () => {
    const { data, loading, error, fetchData } = useAPI();

    const getManager = useCallback((id) => {
        console.log("Fetching manager with ID:", id);
        return fetchData(`${BASE_API_URL}/get_manager`, 'POST', { id });
    }, [fetchData]);

    return { data, loading, error, getManager };
};

export const useGetEAList = () => {
    const { data, loading, error, fetchData } = useAPI();

    const getEAList = useCallback(() => {
        console.log("Fetching EA list");
        return fetchData(`api/get_ea_list`, 'POST');
    }, [fetchData]);

    return { data, loading, error, getEAList };
};

