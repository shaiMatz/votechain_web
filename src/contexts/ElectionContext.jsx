/* eslint-disable react/prop-types */
import { createContext, useState, useCallback } from 'react';
import { useGetElectionsByUser, useGetElectionsByEA, useDeleteElection, useGetElection, useUpdateElection } from '../api/electionService';
import { loadContract, session } from '../services/sessionService';
import { updateElections } from '../services/updateElection';

export const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
  const [elections, setElections] = useState([]);
  const [detailedElections, setDetailedElections] = useState([]);

  const { loading: userLoading, error: userError, getElectionsByUser } = useGetElectionsByUser();
  const { loading: eaLoading, error: eaError, getElectionsByEA } = useGetElectionsByEA();
  const { loading: deleteLoading, error: deleteError, deleteElection } = useDeleteElection();
  const { loading: electionLoading, error: electionError, getElection } = useGetElection();
  const { loading: updateLoading, error: updateError, updateElection } = useUpdateElection(); // Add the update hook

  const fetchElectionsByUser = useCallback(async (userId) => {
    console.log("User ID:", userId);
    const res = await getElectionsByUser(userId);
    console.log("Response from fetch by user:", res);
    if (res?.error_code === 0 && res?.data) {
      console.log("Elections by user:", res.data);
      setElections(res.data);
      return res;
    } else {
      console.error("Error fetching elections by user:", res?.error_message || "Unknown error");
      return null;
    }
  }, [getElectionsByUser]);

  const fetchElectionsByEA = useCallback(async (eaId) => {
    // Early return if eaId is not provided 
    if (!eaId) return;

    console.log("EA ID:", eaId);
    console.log("Fetching elections by EA...");

    try {
      const res = await getElectionsByEA(eaId);
      console.log("Response from fetch by ea:", res);

      if (res?.error_code === 0 && res?.data) {
        console.log("Elections by EA:", res.data);
        setElections(res.data);
        return res;
      } else {
        console.error("Error fetching elections by EA:", res?.error_message || "Unknown error");
        // Set an error state here if you want to display an error message to the user
      }
    } catch (error) {
      console.error("Error fetching elections by EA:", error);
      // Set an error state here if you want to display an error message to the user
    }
  }, [getElectionsByEA]);



  const fetchDetailedElections = useCallback(async (electionList) => {
    if (electionList.length > 0) {
      console.log("Fetching full election data...");
      console.log("Election List:", electionList);

      const fullElectionDataPromises = electionList.map(async (election) => {
        try {
          const result = await getElection(election.id);
          if (result && result.data) {
            return { ...election, ...result.data };
          } else {
            console.error(`Error fetching data for election ID ${election.id}:`, result?.error_message || "Unknown error");
            return { ...election, error: result?.error_message || "Unknown error" };
          }
        } catch (error) {
          console.error(`Error fetching data for election ID ${election.id}:`, error);
          return { ...election, error: "Failed to fetch data" };
        }
      });

      const fullElectionData = await Promise.all(fullElectionDataPromises);
      console.log("Full Election Data:", fullElectionData);
      setDetailedElections(fullElectionData);
      return fullElectionData;
    } else {
      console.log("No elections found to fetch full data.");
    }
  }, [getElection]);




  const handleDeleteElection = useCallback(async (id) => {
    await deleteElection(id);
    console.log("Delete Election ID:", id);
    console.log("Delete Error:", deleteError);

    if (!deleteError) {
      setElections((prevElections) => prevElections.filter((election) => election.id !== id));
      setDetailedElections((prevDetailedElections) => prevDetailedElections.filter((election) => election.id !== id));
      return true;
    } else {
      return false;
    }
  }, [deleteElection, deleteError]);

  
  const updateElectionData = async (electionData, payload, isManager = false, updatedData) => {
    try {
      console.log("Updating election data:", electionData);
      await updateElection(electionData);
      const electionIdBigInt = BigInt(payload.id);

      const payloadnew = {
        ...payload,
        election_id: electionIdBigInt,
      };

      console.log('start create in block chain1');

      try {
        console.log('start create in block chain2');

        const contract = await loadContract(session);

        var ans = await updateElections(session, contract, payloadnew, isManager);
        console.log('ans:', ans);
      } catch (error) {
        console.error("Error in createElections:", error);
      }

      // Moved error check after the API calls
      if (!updateError) {
        setElections((prevElections) =>
          prevElections.map((election) =>
            election.id === updatedData.id ? { ...election, ...updatedData } : election
          )
        );
        setDetailedElections((prevDetailedElections) =>
          prevDetailedElections.map((election) =>
            election.id === updatedData.id ? { ...election, ...updatedData } : election
          )
        );
        return true;
      } else {
        console.error("Error updating election:", updateError);
        return false;
      }
    } catch (error) {
      console.error("Error in updateElectionData:", error);
      return false;
    }
  };




  const loading = userLoading || eaLoading || deleteLoading || electionLoading || updateLoading;
  const error = userError || eaError || deleteError || electionError || updateError;

  return (
    <ElectionContext.Provider value={{
      elections,
      setElections,
      fetchElectionsByUser,
      handleDeleteElection,
      fetchElectionsByEA,
      fetchDetailedElections,
      detailedElections,
      updateElectionData, // Provide the update function in the context
      loading,
      error,
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
