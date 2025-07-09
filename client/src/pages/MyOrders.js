import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/api';
import { FiSearch, FiDownload, FiRefreshCw, FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import '../styles/MyOrders.css';

const MyOrders = () => {
    const { user } = useAuth(); // eslint-disable-line no-unused-vars
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');

    // Estados de filtros
    const filterOptions = [
        { value: 'all', label: 'Todas las órdenes', icon: FiPackage },
        { value: 'pending', label: 'Pendientes', icon: FiClock },
        { value: 'processing', label: 'En proceso', icon: FiRefreshCw },
        { value: 'completed', label: 'Completadas', icon: FiCheckCircle },
        { value: 'cancelled', label: 'Canceladas', icon: FiXCircle }
    ];


    useEffect(() => {
fetchUserOrders();
    }, []);

const fetchUserOrders = async () => {
        setLoading(true);
        try {
            const response = await ordersService.getUserOrders();
            if (response.success) {
                setOrders(response.data.orders);
            } else {
                console.error('Error al obtener las órdenes:', response.error);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar y ordenar órdenes
    const filteredOrders = orders
        .filter(order => {
            if (filter !== 'all' && order.status !== filter) return false;
            if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !order.service.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'price') return b.price - a.price;
            if (sortBy === 'status') return a.status.localeCompare(b.status);
            return 0;
        });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10B981';
            case 'processing': return '#F59E0B';
            case 'pending': return '#6B7280';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return FiCheckCircle;
            case 'processing': return FiRefreshCw;
            case 'pending': return FiClock;
            case 'cancelled': return FiXCircle;
            default: return FiClock;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProgress = (delivered, quantity) => {
        return Math.min((delivered / quantity) * 100, 100);
    };

    if (loading) {
        return (
            <div className="my-orders-page">
                <div className="loading-container">
                    <motion.div
                        className="loading-spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <FiRefreshCw size={32} />
                    </motion.div>
                    <p>Cargando tus órdenes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            {/* Header */}
            <motion.div 
                className="orders-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="header-content">
                    <h1>Mis Órdenes</h1>
                    <p>Administra y da seguimiento a tus pedidos</p>
                </div>
                <button className="refresh-btn" onClick={fetchUserOrders}>
                    <FiRefreshCw /> Actualizar
                </button>
            </motion.div>

            {/* Filtros y búsqueda */}
            <motion.div 
                className="orders-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por número de orden o servicio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filters">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="date">Ordenar por fecha</option>
                        <option value="price">Ordenar por precio</option>
                        <option value="status">Ordenar por estado</option>
                    </select>
                </div>
            </motion.div>

            {/* Lista de órdenes */}
            <div className="orders-list">
                {filteredOrders.length === 0 ? (
                    <motion.div 
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <FiPackage size={64} />
                        <h3>No hay órdenes</h3>
                        <p>No se encontraron órdenes que coincidan con los filtros seleccionados</p>
                    </motion.div>
                ) : (
                    filteredOrders.map((order, index) => {
                        const StatusIcon = getStatusIcon(order.status);
                        const progress = getProgress(order.delivered, order.quantity);

                        return (
                            <motion.div
                                key={order._id}
                                className="order-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>#{order.orderNumber}</h3>
                                        <span className="order-date">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div 
                                        className="order-status"
                                        style={{ color: getStatusColor(order.status) }}
                                    >
                                        <StatusIcon size={16} />
                                        <span>{order.status === 'pending' ? 'Pendiente' : 
                                               order.status === 'processing' ? 'En proceso' :
                                               order.status === 'completed' ? 'Completada' : 'Cancelada'}</span>
                                    </div>
                                </div>

                                <div className="order-content">
                                    <div className="service-info">
                                        <h4>{order.service.name}</h4>
                                        <p className="service-category">{order.service.category}</p>
                                        <p className="target-url">Objetivo: {order.targetUrl}</p>
                                    </div>

                                    <div className="order-details">
                                        <div className="detail-item">
                                            <span className="label">Cantidad:</span>
                                            <span className="value">{order.quantity.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Precio:</span>
                                            <span className="value">${order.price.toFixed(2)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="label">Tiempo estimado:</span>
                                            <span className="value">{order.estimatedTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Barra de progreso */}
                                <div className="progress-section">
                                    <div className="progress-info">
                                        <span>Progreso: {order.delivered.toLocaleString()} / {order.quantity.toLocaleString()}</span>
                                        <span>{progress.toFixed(1)}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <motion.div 
                                            className="progress-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        />
                                    </div>
                                </div>

                                <div className="order-actions">
                                    <button className="action-btn secondary">
                                        <FiDownload /> Descargar reporte
                                    </button>
                                    {order.status === 'pending' && (
                                        <button className="action-btn danger">
                                            <FiXCircle /> Cancelar orden
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyOrders;
