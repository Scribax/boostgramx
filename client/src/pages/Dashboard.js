import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/api';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaClock, FaCheckCircle, FaDollarSign, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ServiceModal from '../components/ServiceModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentOrders, setRecentOrders] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Actualizar datos cada 30 segundos para estado en tiempo real
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas del usuario
      const statsResult = await ordersService.getOrderStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
      // Obtener órdenes recientes
      const ordersResult = await ordersService.getUserOrders(1, 5);
      if (ordersResult.success) {
        setRecentOrders(ordersResult.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleCreateOrder = () => {
    setShowServiceModal(true);
  };

  const handleSelectPackage = (orderData) => {
    // Navegar a la página de checkout con los datos del pedido
    navigate('/checkout', {
      state: {
        orderData: orderData
      }
    });
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que quieres cerrar sesión?')) {
      logout();
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="welcome-section">
          <h1>¡Bienvenido, {user?.name}!</h1>
          <p>Gestiona tus órdenes y servicios desde tu panel personal</p>
        </div>
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button 
            className="logout-button"
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        className="dashboard-nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaUser /> Resumen
        </button>
        <button 
          className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaShoppingBag /> Mis Órdenes
        </button>
        <button 
          className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaCog /> Perfil
        </button>
      </motion.div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <motion.div 
            className="overview-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Stats Cards */}
            <div className="stats-grid">
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="stat-icon total">
                  <FaShoppingBag />
                </div>
                <div className="stat-info">
                  <h3>{stats?.totalOrders || 0}</h3>
                  <p>Órdenes Totales</p>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="stat-icon pending">
                  <FaClock />
                </div>
                <div className="stat-info">
                  <h3>{stats?.pendingOrders || 0}</h3>
                  <p>Pendientes</p>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="stat-icon completed">
                  <FaCheckCircle />
                </div>
                <div className="stat-info">
                  <h3>{stats?.completedOrders || 0}</h3>
                  <p>Completadas</p>
                </div>
              </motion.div>

              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="stat-icon money">
                  <FaDollarSign />
                </div>
                <div className="stat-info">
                  <h3>${stats?.totalSpent?.toFixed(2) || '0.00'}</h3>
                  <p>Total Gastado</p>
                </div>
              </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div 
              className="recent-orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2>Órdenes Recientes</h2>
              {recentOrders.length > 0 ? (
                <div className="orders-list">
                  {recentOrders.map((order, index) => (
                    <motion.div 
                      key={order._id || index}
                      className="order-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="order-info">
                        <h4>{order.service?.name || 'Servicio'}</h4>
                        <p>{order.quantity} unidades</p>
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusText(order.status)}
                        </span>
                        <div className="order-details">
                          <span className="order-amount">${order.totalAmount}</span>
                          {order.externalOrderId && (
                            <span className="external-id">ID: {order.externalOrderId}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FaShoppingBag size={48} />
                  <p>No tienes órdenes recientes</p>
                  <button className="cta-button" onClick={handleCreateOrder}>
                    Crear Primera Orden
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div 
            className="orders-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Gestión de Órdenes</h2>
            <p>Aquí podrás ver y gestionar todas tus órdenes</p>
            {/* Componente MyOrders se integrará aquí */}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div 
            className="profile-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Configuración del Perfil</h2>
            <p>Gestiona tu información personal y preferencias</p>
            {/* Componente Profile se integrará aquí */}
          </motion.div>
        )}
      </div>
      
      {/* Service Modal */}
      <ServiceModal 
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSelectPackage={handleSelectPackage}
      />
    </div>
  );
};

export default Dashboard;
