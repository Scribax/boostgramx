import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useSessionExpired = () => {
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSessionExpired = () => {
    setShowSessionExpiredModal(true);
  };

  const handleContinueLogin = () => {
    setShowSessionExpiredModal(false);
    logout();
    navigate('/auth');
  };

  const handleGoHome = () => {
    setShowSessionExpiredModal(false);
    logout();
    navigate('/');
  };

  return {
    showSessionExpiredModal,
    handleSessionExpired,
    handleContinueLogin,
    handleGoHome
  };
};
