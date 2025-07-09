import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Configuración base de axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variable global para manejar estado de sesión expirada
let isSessionExpired = false;
let sessionExpiredEventListeners = [];

// Función para notificar sobre sesión expirada
const notifySessionExpired = () => {
  if (isSessionExpired) return; // Evitar múltiples notificaciones
  
  isSessionExpired = true;
  sessionExpiredEventListeners.forEach(listener => listener());
};

// Función para registrar listeners de sesión expirada
const addSessionExpiredListener = (listener) => {
  sessionExpiredEventListeners.push(listener);
};

// Función para limpiar estado de sesión expirada
const clearSessionExpiredState = () => {
  isSessionExpired = false;
};

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Error desconocido';
    
    // Si el token ha expirado, manejar de forma elegante
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      
      // Notificar a todos los componentes sobre sesión expirada
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/auth' && !isSessionExpired) {
        notifySessionExpired();
      }
      
      // Solo mostrar toast si no es una verificación silenciosa
      if (!error.config?.silent) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
    } else if (error.response?.status >= 500) {
      toast.error('Error del servidor. Por favor, intenta más tarde.');
    } else if (error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción.');
    }
    
    return Promise.reject(error);
  }
);

// Exportar funciones para manejo de sesión
export { addSessionExpiredListener, clearSessionExpiredState };

// Servicios de autenticación
export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Guardar token y datos del usuario en cookies
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      const cookieOptions = { 
        expires: 7, 
        secure: false, // Desactivar secure en desarrollo
        sameSite: 'lax' // Más permisivo para desarrollo
      };
      
      console.log('Guardando cookies:', { isDevelopment, cookieOptions });
      Cookies.set('token', token, cookieOptions);
      Cookies.set('user', JSON.stringify(user), cookieOptions);
      
      // Verificar que se guardaron correctamente
      console.log('Token guardado:', Cookies.get('token') ? 'SI' : 'NO');
      console.log('User guardado:', Cookies.get('user') ? 'SI' : 'NO');
      
      toast.success('¡Registro exitoso! Bienvenido a SMMStore.');
      return { success: true, user, token };
    } catch (error) {
      const message = error.response?.data?.message || 'Error en el registro';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Inicio de sesión
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Guardar token y datos del usuario en cookies
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      const cookieOptions = { 
        expires: 7, 
        secure: false, // Desactivar secure en desarrollo
        sameSite: 'lax' // Más permisivo para desarrollo
      };
      
      console.log('Guardando cookies:', { isDevelopment, cookieOptions });
      Cookies.set('token', token, cookieOptions);
      Cookies.set('user', JSON.stringify(user), cookieOptions);
      
      // Verificar que se guardaron correctamente
      console.log('Token guardado:', Cookies.get('token') ? 'SI' : 'NO');
      console.log('User guardado:', Cookies.get('user') ? 'SI' : 'NO');
      
      toast.success(`¡Bienvenido de nuevo, ${user.name}!`);
      return { success: true, user, token };
    } catch (error) {
      const message = error.response?.data?.message || 'Error en el inicio de sesión';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Cerrar sesión
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    toast.success('Sesión cerrada exitosamente.');
    window.location.href = '/';
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    try {
      const userCookie = Cookies.get('user');
      return userCookie ? JSON.parse(userCookie) : null;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      return null;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    return !!(token && user);
  },

  // Verificar si el token es válido
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/me');
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, error: 'Token inválido' };
    }
  },

  // Verificar token de forma silenciosa (sin mostrar errores)
  verifyTokenSilently: async () => {
    try {
      const response = await api.get('/auth/verify-token', { silent: true });
      return { 
        success: true, 
        user: response.data.user,
        tokenInfo: response.data.tokenInfo 
      };
    } catch (error) {
      return { success: false, error: 'Token inválido' };
    }
  },

  // Restablecer contraseña
  resetPassword: async (email) => {
    try {
      const response = await api.post('/auth/reset-password', { email });
      toast.success('Se ha enviado un enlace de restablecimiento a tu correo.');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al restablecer contraseña';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Verificar email
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      toast.success('Email verificado exitosamente.');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al verificar email';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Actualizar perfil de usuario
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      const { user } = response.data;
      
      // Actualizar datos del usuario en cookies
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      const cookieOptions = { 
        expires: 7, 
        secure: false, // Desactivar secure en desarrollo
        sameSite: 'lax' // Más permisivo para desarrollo
      };
      Cookies.set('user', JSON.stringify(user), cookieOptions);
      
      toast.success('Perfil actualizado exitosamente.');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      toast.success('Contraseña actualizada exitosamente.');
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cambiar contraseña';
      toast.error(message);
      return { success: false, error: message };
    }
  }
};

// Servicios de servicios (SMM)
export const servicesService = {
  // Obtener todos los servicios
  getServices: async (filters = {}) => {
    try {
      const response = await api.get('/services', { params: filters });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener servicios';
      return { success: false, error: message };
    }
  },

  // Obtener un servicio específico
  getService: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener servicio';
      return { success: false, error: message };
    }
  }
};

// Servicios de órdenes
export const ordersService = {
  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      toast.success('¡Orden creada exitosamente!');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al crear orden';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Obtener órdenes del usuario
  getUserOrders: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/orders', { params: { page, limit } });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener órdenes';
      return { success: false, error: message };
    }
  },

  // Obtener una orden específica
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener orden';
      return { success: false, error: message };
    }
  },

  // Obtener estadísticas del usuario
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats/summary');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener estadísticas';
      return { success: false, error: message };
    }
  }
};

// Servicios de pagos
export const paymentsService = {
  // Agregar saldo
  addBalance: async (paymentData) => {
    try {
      const response = await api.post('/payments/add-balance', paymentData);
      toast.success('Pago procesado exitosamente.');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al procesar pago';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Obtener historial de pagos
  getPaymentHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/payments/history', { params: { page, limit } });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al obtener historial';
      return { success: false, error: message };
    }
  }
};

export default api;
