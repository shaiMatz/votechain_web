import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginWithRedirect = (userData) => {
    login(userData);
  };

  const logoutWithRedirect = () => {
    logout();
    navigate('/login');
  };

  return { user, login: loginWithRedirect, logout: logoutWithRedirect };
};

export default useAuth;
