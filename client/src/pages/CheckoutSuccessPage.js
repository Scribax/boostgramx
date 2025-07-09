import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaInstagram, FaUsers, FaHome } from 'react-icons/fa';
import Cookies from 'js-cookie';
import './CheckoutSuccessPage.css';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPaymentAndGetOrder = async () => {
      try {
        // Obtener parámetros de MercadoPago
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const orderId = searchParams.get('order') || searchParams.get('external_reference');

        console.log('Payment verification params:', { paymentId, status, orderId });

        if (orderId) {
          // Obtener detalles de la orden usando cookies
          const token = Cookies.get('token');
          const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const orderResponse = await response.json();
            console.log('Order response:', orderResponse);
            if (orderResponse.success) {
              setOrderDetails(orderResponse.data);
            }
          } else {
            console.error('Error obteniendo orden:', response.statusText);
            // Mostrar página de éxito básica sin detalles
            setOrderDetails({
              _id: orderId,
              status: 'completed',
              message: 'Pago procesado exitosamente'
            });
          }
        }
      } catch (error) {
        console.error('Error verificando pago:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentAndGetOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="checkout-success-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Verificando tu pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-success-page">
      <div className="success-container">
        <motion.div 
          className="success-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div 
            className="success-icon"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FaCheckCircle />
          </motion.div>

          {/* Success Message */}
          <motion.div 
            className="success-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1>¡Pago Exitoso!</h1>
            <p>Tu orden ha sido procesada correctamente y está siendo ejecutada.</p>
          </motion.div>

          {/* Order Details */}
          {orderDetails && (
            <motion.div 
              className="order-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2>Detalles de tu orden</h2>
              <div className="details-card">
                <div className="detail-row">
                  <span className="detail-label">Orden ID:</span>
                  <span className="detail-value">#{orderDetails._id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <FaInstagram className="detail-icon" />
                    Usuario:
                  </span>
                  <span className="detail-value">@{orderDetails.instagramUser}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <FaUsers className="detail-icon" />
                    Cantidad:
                  </span>
                  <span className="detail-value">{orderDetails.quantity} seguidores</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total pagado:</span>
                  <span className="detail-value total">${orderDetails.price} ARS</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Estado:</span>
                  <span className={`detail-value status ${orderDetails.status}`}>
                    {orderDetails.status === 'in_progress' ? 'En progreso' : 
                     orderDetails.status === 'completed' ? 'Completado' : 
                     orderDetails.status === 'pending' ? 'Pendiente' : orderDetails.status}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* What's Next */}
          <motion.div 
            className="next-steps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h3>¿Qué sigue?</h3>
            <ul>
              <li>Tu orden está siendo procesada automáticamente</li>
              <li>Los seguidores comenzarán a llegar en los próximos minutos</li>
              <li>Puedes seguir el progreso en tiempo real desde tu dashboard</li>
              <li>Recibirás una notificación cuando esté completa</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <button 
              className="btn primary"
              onClick={() => navigate('/my-orders')}
            >
              <FaArrowRight />
              Ver mis órdenes
            </button>
            <button 
              className="btn secondary"
              onClick={() => navigate('/dashboard')}
            >
              <FaHome />
              Volver al dashboard
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
