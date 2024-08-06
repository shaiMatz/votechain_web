/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from 'react';
import { useGetElectionsByUser, useGetElectionsByEA, useDeleteElection, useGetElection } from '../api/electionService';

export const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
  const [elections, setElections] = useState([]);
  const [isFetched, setIsFetched] = useState({ user: false, ea: false });

  const { data: userElections, loading: userLoading, error: userError, getElectionsByUser } = useGetElectionsByUser();
  const { data: eaElections, loading: eaLoading, error: eaError, getElectionsByEA } = useGetElectionsByEA();
  const { data: deleteData, loading: deleteLoading, error: deleteError, deleteElection } = useDeleteElection();
  const { loading: electionLoading, error: electionError, getElection } = useGetElection();

  const fetchElectionsByUser = useCallback(async (userId) => {
    if (!isFetched.user) {
      await getElectionsByUser(userId);
      setIsFetched((prev) => ({ ...prev, user: true }));
    }
  }, [getElectionsByUser, isFetched]);
  const fetchFullElectionData = useCallback(async (eaId) => {
    if (eaId && !isFetched.ea) {
      console.log("Fetching elections by EA...");
      const res = await getElectionsByEA(eaId);
      console.log("API Response:", res);
      if (res.error_code === 0 && res.data) {
        setIsFetched((prev) => ({ ...prev, ea: true }));
        setElections(res.data);
      } else {
        console.error("Error fetching elections by EA:", eaError);
        return;
      }
    }

    if (elections.length > 0) {
      console.log("Fetching full election data...");
      const fullElectionDataPromises = elections.map(async (election) => {
        const result = await getElection(election.id);
        return { ...election, ...result.data };
      });

      const fullElectionData = await Promise.all(fullElectionDataPromises);
      console.log("Full Election Data:", fullElectionData);
      setElections(fullElectionData);
    } else {
      console.log("No elections found to fetch full data.");
    }
  }, [elections, eaError, getElection, getElectionsByEA, isFetched]);
  useEffect(() => {
    if (userElections && !userError) {
      setElections(userElections);
    }
  }, [userElections, userError]);

  const handleDeleteElection = async (id) => {
    await deleteElection(id);
    if (!deleteError && deleteData) {
      setElections((prevElections) => prevElections.filter((election) => election.id !== id));
    }
  };

  const loading = userLoading || eaLoading || deleteLoading || electionLoading;
  const error = userError || eaError || deleteError || electionError;
  return (
    <ElectionContext.Provider value={{
      elections,
      setElections,
      fetchElectionsByUser,
      handleDeleteElection,
      fetchFullElectionData,
      loading,
      error,
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
