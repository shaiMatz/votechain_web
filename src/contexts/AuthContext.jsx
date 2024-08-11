/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/voterService';
import { mintNftToUser } from '../services/mintNftToUser';
import { ElectionContext } from './ElectionContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: apiLogin } = useLogin();
  const {  fetchElectionsByUser } = useContext(ElectionContext);

  const login = async (userData, checked = false) => {
    setLoading(true);
    setError(null);

    try {
      const ans = await apiLogin(userData);
      if (ans && ans.error_code || ans && ans.data === false) {
        setError('Login failed: Incorrect credentials');
      } else {
        console.log('User:', ans.data);
        console.log('User checked:', checked);

        // Fetch elections if not checked before
        if (!checked && ans.data.role === 'voter') {
          console.log('Fetching elections... for minting');
          const eligibleElections = await fetchElectionsByUser(ans.data.user_id);
          console.log('Eligible Elections123:', eligibleElections);
          if (eligibleElections&&eligibleElections.data) {
            await mintNftToUser(ans.data, eligibleElections.data);
          }
        }

        console.log('User after the minting:', ans.data);
        setUser(ans.data);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ setUser,user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
