/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/voterService';
import { mintNftToUser } from '../services/mintNftToUser';
import { session, loadContract } from '../services/sessionService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: apiLogin } = useLogin();

  const login = async (userData, checked = false, eligibleElections) => {
    setLoading(true);
    setError(null);

    try {
      const ans = await apiLogin(userData);
      if (ans && ans.error_code) {
        setError(ans.message || 'Login failed');
      } else {
        setUser(ans.data);
        if (!checked) {
          const contract = loadContract();
          if (eligibleElections && eligibleElections.length > 0) {
            await mintNftToUser(ans.data, contract, session, eligibleElections);
          }
        }
        navigate('/dashboard');
      }
    } catch (err) {
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
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
