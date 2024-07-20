import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../contexts/AuthContext';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ManagerDashboard from '../pages/ManagerDashboard';
import EADashboard from '../pages/EADashboard';
import VoterDashboard from '../pages/VoterDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import { ElectionProvider } from '../contexts/ElectionContext';
import { AddressProvider } from '../contexts/AddressContext';

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {user && user.role === 'manager' && <ManagerDashboard />}
          {user && user.role === 'ea' && <EADashboard />}
          {user && user.role === 'voter' && <VoterDashboard />}
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ElectionProvider>
          <AddressProvider>
        <AppRouter />
        </AddressProvider>
        </ElectionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
