import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const { user, login, logout, loading, error } = useContext(AuthContext);

  const loginWithRedirect = async (userData, checked = false, eligibleElections) => {
    await login(userData, checked, eligibleElections);
  };

  const logoutWithRedirect = async () => {
    await logout();
  };

  return { user, login: loginWithRedirect, logout: logoutWithRedirect, loading, error };
};

export default useAuth;
