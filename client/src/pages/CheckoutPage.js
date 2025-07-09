import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaUsers, FaCreditCard, FaShieldAlt, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, error

  useEffect(() => {
    // Verificar autenticación primero
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para acceder al checkout');
      navigate('/auth');
      return;
    }

    // Obtener datos de la orden desde navigation state
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // Si no hay datos, redirigir al dashboard
      navigate('/dashboard');
    }
  }, [location, navigate, isAuthenticated]);

  const handlePayment = async () => {
    // Verificar autenticación antes de procesar
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para realizar una compra');
      navigate('/auth');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Debug: Verificar token en cookies
      const token = Cookies.get('token');
      console.log('Token en cookies:', token ? 'Presente' : 'Ausente');
      console.log('Usuario autenticado:', user);
      console.log('Estado de autenticación:', isAuthenticated);

      // Paso 1: Crear orden usando el servicio API
      const orderPayload = {
        serviceId: orderData.package.id, // ID del servicio
        targetUrl: `https://instagram.com/${orderData.instagramUser}`,
        quantity: orderData.quantity
      };

      console.log('Creando orden con payload:', orderPayload);
      
      const orderResult = await ordersService.createOrder(orderPayload);
      
      console.log('Order result completo:', orderResult);
      console.log('orderResult.data:', orderResult.data);
      
      if (!orderResult.success) {
        toast.error(orderResult.error || 'Error creando la orden');
        throw new Error(orderResult.error || 'Error creando la orden');
      }

      // Manejar diferentes estructuras de respuesta
      let orderId;
      if (orderResult.data && orderResult.data.order && orderResult.data.order._id) {
        orderId = orderResult.data.order._id;
      } else if (orderResult.data && orderResult.data._id) {
        orderId = orderResult.data._id;
      } else if (orderResult.data && orderResult.data.data && orderResult.data.data.order) {
        orderId = orderResult.data.data.order._id;
      } else {
        console.error('No se pudo extraer el ID de la orden:', orderResult);
        throw new Error('No se pudo obtener el ID de la orden creada');
      }
      
      console.log('Orden creada exitosamente:', orderId);
      toast.success('Orden creada exitosamente');

      // Paso 2: Crear preferencia de pago con el ID de la orden
      const paymentData = {
        orderId: orderId // Usar el endpoint de crear pago para orden específica
      };

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/payments/create-order-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Failed to create payment preference: ${response.status} - ${errorData}`);
      }

      const preference = await response.json();
      console.log('Preference received:', preference);

      // Redirigir a MercadoPago
      if (preference.init_point) {
        // Guardar el order ID en localStorage para poder redirigir manualmente
        localStorage.setItem('currentOrderId', orderId);
        window.location.href = preference.init_point;
      } else {
        throw new Error('No init_point received from MercadoPago');
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <motion.div 
          className="checkout-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Volver al Dashboard
          </button>
          <h1>
            <FaCreditCard className="header-icon" />
            Finalizar Compra
          </h1>
        </motion.div>

        <div className="checkout-content">
          {/* Order Summary */}
          <motion.div 
            className="order-summary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Resumen del Pedido</h2>
            
            <div className="summary-card">
              <div className="package-info">
                <h3>{orderData.package.name}</h3>
                <div className="package-details">
                  <div className="detail-item">
                    <FaUsers className="detail-icon" />
                    <span>{orderData.quantity} seguidores</span>
                  </div>
                  <div className="detail-item">
                    <FaInstagram className="detail-icon" />
                    <span>@{orderData.instagramUser}</span>
                  </div>
                </div>
              </div>
              
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>${orderData.price} ARS</span>
                </div>
                <div className="price-row">
                  <span>Impuestos:</span>
                  <span>Incluidos</span>
                </div>
                <div className="price-row total">
                  <span>Total:</span>
                  <span>${orderData.price} ARS</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="order-features">
              <h4>Qué incluye tu pedido:</h4>
              {orderData.package.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <FaCheck className="feature-check" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div 
            className="payment-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Método de Pago</h2>
            
            {paymentStatus === 'pending' && (
              <div className="payment-form">
                <div className="payment-method">
                  <div className="method-header">
                    <img 
                      src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.5/mercadopago/logo__large@2x.png" 
                      alt="MercadoPago" 
                      className="mp-logo"
                    />
                    <span>Pago seguro con MercadoPago</span>
                  </div>
                  
                  <div className="payment-options">
                    <div className="option-item">
                      <FaCreditCard className="option-icon" />
                      <span>Tarjetas de crédito y débito</span>
                    </div>
                    <div className="option-item">
                      <FaShieldAlt className="option-icon" />
                      <span>Transferencia bancaria</span>
                    </div>
                    <div className="option-item">
                      <FaCheck className="option-icon" />
                      <span>Efectivo (Rapipago, Pago Fácil)</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="pay-button"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="button-spinner"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaCreditCard />
                      Pagar ${orderData.price} ARS
                    </>
                  )}
                </button>

                <div className="security-info">
                  <FaShieldAlt className="security-icon" />
                  <div>
                    <strong>Pago 100% seguro</strong>
                    <p>Tus datos están protegidos con encriptación SSL</p>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'processing' && (
              <div className="payment-processing">
                <div className="processing-animation">
                  <div className="processing-spinner"></div>
                </div>
                <h3>Procesando tu pago...</h3>
                <p>No cierres esta ventana. Te redirigiremos automáticamente.</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="payment-success">
                <div className="success-icon">
                  <FaCheck />
                </div>
                <h3>¡Pago exitoso!</h3>
                <p>Tu orden está siendo procesada. Te notificaremos cuando esté lista.</p>
                <div className="success-details">
                  <p><strong>Orden:</strong> {orderData.package.name}</p>
                  <p><strong>Usuario:</strong> @{orderData.instagramUser}</p>
                  <p><strong>Total:</strong> ${orderData.price} ARS</p>
                </div>
              </div>
            )}

            {paymentStatus === 'error' && (
              <div className="payment-error">
                <h3>Error en el pago</h3>
                <p>Hubo un problema procesando tu pago. Por favor, intenta nuevamente.</p>
                <button 
                  className="retry-button"
                  onClick={() => {
                    setPaymentStatus('pending');
                    setLoading(false);
                  }}
                >
                  Intentar nuevamente
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
