import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);

  const loginWithRedirect = (userData, checked=false, eligibleElections) => {
    login(userData, checked, eligibleElections);
  };

  const logoutWithRedirect = () => {
    logout();
  };

  return { user, login: loginWithRedirect, logout: logoutWithRedirect };
};

export default useAuth;
