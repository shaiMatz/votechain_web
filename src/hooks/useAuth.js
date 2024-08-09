import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const { user, login, logout, loading, error } = useContext(AuthContext);

  const loginWithRedirect = (userData, checked = false, eligibleElections) => {
    login(userData, checked, eligibleElections);
  };

  const logoutWithRedirect = () => {
    logout();
  };

  return { user, login: loginWithRedirect, logout: logoutWithRedirect, loading, error };
};

export default useAuth;
