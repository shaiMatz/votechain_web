/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { useGetElectionsByUser } from '../api/electionService';
import useAuth from '../hooks/useAuth'; // Assuming you have a useAuth hook to get the logged-in user

export const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
  const { user } = useAuth(); // Assuming the useAuth hook returns the logged-in user's info
  const [elections, setElections] = useState([]);
  const { getElectionsByUser } = useGetElectionsByUser();

  useEffect(() => {
    const fetchElections = async () => {
      if (user && user.user_id) {
        console.log('Fetching elections for user ID:', user.user_id);
        try {
          const response = await getElectionsByUser(user.user_id);
          setElections(response.data);
        } catch (err) {
          console.error('Failed to fetch elections:', err);
        }
      }
    };

    fetchElections();
  }, [user, getElectionsByUser]);

  return (
    <ElectionContext.Provider value={{ elections, setElections }}>
      {children}
    </ElectionContext.Provider>
  );
};
