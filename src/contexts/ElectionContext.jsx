/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from 'react';
import { useGetElectionsByUser, useGetElectionsByEA, useDeleteElection, useGetElection } from '../api/electionService';

export const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
  const [elections, setElections] = useState([]);
  const [isFetched, setIsFetched] = useState({ user: false, ea: false });
  const [detailedElections, setDetailedElections] = useState([]);

  const { data: userElections, loading: userLoading, error: userError, getElectionsByUser } = useGetElectionsByUser();
  const { loading: eaLoading, error: eaError, getElectionsByEA } = useGetElectionsByEA();
  const { data: deleteData, loading: deleteLoading, error: deleteError, deleteElection } = useDeleteElection();
  const { loading: electionLoading, error: electionError, getElection } = useGetElection();

  const fetchElectionsByUser = useCallback(async (userId) => {
    if (!isFetched.user) {
      await getElectionsByUser(userId);
      setIsFetched((prev) => ({ ...prev, user: true }));
    }
  }, [getElectionsByUser, isFetched]);

  const fetchElectionsByEA = useCallback(async (eaId) => {
    console.log("EA ID:", eaId);
    if (eaId && !isFetched.ea) {
      console.log("Fetching elections by EA...");
      const res = await getElectionsByEA(eaId);
      console.log("API Response:", res);
      if (res.error_code === 0 && res.data) {
        setIsFetched((prev) => ({ ...prev, ea: true }));
        console.log("Elections by EA:", res.data);
        setElections(res.data);
      } else {
        console.error("Error fetching elections by EA:", eaError);
        return;
      }
    }
  }, [getElectionsByEA, isFetched, eaError]);

  const fetchDetailedElections = useCallback(async (electionList) => {
    if (electionList.length > 0) {
      console.log("Fetching full election data...");
      console.log("Election List:", electionList);
      const fullElectionDataPromises = electionList.map(async (election) => {
        const result = await getElection(election.id);
        return { ...election, ...result.data };
      });
      const fullElectionData = await Promise.all(fullElectionDataPromises);
      console.log("Full Election Data:", fullElectionData);
      setDetailedElections(fullElectionData);
    } else {
      console.log("No elections found to fetch full data.");
    }
  }, [getElection]);

  useEffect(() => {
    if (userElections && !userError) {
      setElections(userElections);
    }
  }, [userElections, userError]);

  const handleDeleteElection = useCallback(async (id) => {
    await deleteElection(id);
    if (!deleteError && deleteData) {
      setElections((prevElections) => prevElections.filter((election) => election.id !== id));
    }
  }, [deleteElection, deleteError, deleteData]);

  const loading = userLoading || eaLoading || deleteLoading || electionLoading;
  const error = userError || eaError || deleteError || electionError;

  return (
    <ElectionContext.Provider value={{
      elections,
      setElections,
      fetchElectionsByUser,
      handleDeleteElection,
      fetchElectionsByEA,
      fetchDetailedElections,
      detailedElections,
      loading,
      error,
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
