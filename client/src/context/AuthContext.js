import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, addSessionExpiredListener, clearSessionExpiredState } from '../services/api';
import { useNavigate } from 'react-router-dom';
import SessionExpiredModal from '../components/SessionExpiredModal';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const navigate = useNavigate();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = authService.isAuthenticated();
        const currentUser = authService.getCurrentUser();
        
        console.log('Verificando autenticación:', { isAuth, currentUser });
        
        if (isAuth && currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listener para manejar sesiones expiradas
    const handleSessionExpired = () => {
      console.log('Sesión expirada detectada en AuthProvider');
      setUser(null);
      setIsAuthenticated(false);
      setShowSessionExpiredModal(true);
    };

    addSessionExpiredListener(handleSessionExpired);
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error inesperado durante el login' };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Error inesperado durante el registro' };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    clearSessionExpiredState();
  };

  // Manejar modal de sesión expirada
  const handleContinueLogin = () => {
    setShowSessionExpiredModal(false);
    clearSessionExpiredState();
    navigate('/auth');
  };

  const handleGoHome = () => {
    setShowSessionExpiredModal(false);
    clearSessionExpiredState();
    navigate('/');
  };

  // Actualizar información del usuario
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    // Actualizar también en las cookies
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const newUserData = { ...currentUser, ...updatedUser };
      // Aquí actualizarías las cookies si es necesario
    }
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin
  };

  return (
    <>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
      <SessionExpiredModal 
        show={showSessionExpiredModal} 
        onContinueLogin={handleContinueLogin} 
        onGoHome={handleGoHome} 
      />
    </>
  );
};

export default AuthContext;
