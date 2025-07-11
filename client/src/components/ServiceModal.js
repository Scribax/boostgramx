import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaInstagram, FaUsers, FaStar, FaCheck, FaCog } from 'react-icons/fa';
import './ServiceModal.css';

import { useEffect } from 'react';
import { servicesService } from '../services/api';

const ServiceModal = ({ isOpen, onClose, onSelectPackage }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [services, setServices] = useState([]);
  const [customQuantity, setCustomQuantity] = useState(1000);
  const [instagramUser, setInstagramUser] = useState('');
  const [step, setStep] = useState(1); // 1: Selecci f3n, 2: Usuario, 3: Confirmaci f3n

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Fetching services...');
        const response = await servicesService.getServices();
        console.log('Services response:', response);
        console.log('response.data:', response.data);
        
        if (response.success) {
          // La respuesta viene como {success: true, data: {success: true, data: {services: [...]}}}
          let servicesArray = [];
          
          if (response.data && response.data.data && response.data.data.services) {
            servicesArray = response.data.data.services;
          } else if (response.data && response.data.services) {
            servicesArray = response.data.services;
          } else if (Array.isArray(response.data)) {
            servicesArray = response.data;
          }
          
          console.log('Services array found:', servicesArray);
          setServices(servicesArray);
        } else {
          console.error('Failed to load services:', response.error);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  // Mapeo de paquetes del frontend a serviceId reales
  const packageMapping = {
    'starter': 'IG_FOLLOWERS_1000', // 1000 seguidores (más cercano a 250)
    'standard': 'IG_FOLLOWERS_1000', // 1000 seguidores
    'premium': 'IG_FOLLOWERS_2500', // 2500 seguidores
  };

  // Función para calcular precio ajustado con comisiones de MercadoPago
  const calculateAdjustedPrice = (basePrice) => {
    const mercadoPagoFee = 2.99;
    const mercadoPagoRate = 0.0761;
    return Math.round((basePrice + mercadoPagoFee) / (1 - mercadoPagoRate));
  };
  
  // Paquetes predefinidos con precios ajustados por comisiones de MercadoPago
  const packages = [
    {
      id: 'starter',
      name: 'Paquete Starter',
      followers: 250,
      price: calculateAdjustedPrice(990),
      popular: false,
      features: ['Seguidores reales', 'Entrega en 24-48h', 'Soporte básico'],
      description: 'Perfecto para empezar'
    },
    {
      id: 'standard',
      name: 'Paquete Standard',
      followers: 500,
      price: calculateAdjustedPrice(1690),
      popular: true,
      features: ['Seguidores de calidad', 'Entrega en 12-24h', 'Soporte prioritario', 'Garantía 30 días'],
      description: 'El más popular'
    },
    {
      id: 'premium',
      name: 'Paquete Premium',
      followers: 1000,
      price: calculateAdjustedPrice(3390),
      popular: false,
      features: ['Seguidores premium', 'Entrega en 6-12h', 'Soporte VIP', 'Garantía 60 días', 'Bonus likes'],
      description: 'Para influencers'
    },
    {
      id: 'custom',
      name: 'Paquete Personalizado',
      followers: customQuantity,
      price: calculateAdjustedPrice(customQuantity * 3.384),
      popular: false,
      features: ['Cantidad personalizada', 'Precio por seguidor', 'Entrega gradual', 'Soporte incluido'],
      description: 'Tú eliges la cantidad',
      isCustom: true
    }
  ];

  const handlePackageSelect = (pkg) => {
    console.log('Package selected:', pkg);
    console.log('Services available:', services);
    
    // Verificar que los servicios estén cargados
    if (!services || services.length === 0) {
      alert('Los servicios están cargando. Por favor, espera un momento.');
      return;
    }

    if (pkg.isCustom) {
      // Para paquete personalizado, usar el servicio más cercano
      const closestService = services.find(service => service.serviceId === 'IG_FOLLOWERS_1000');
      console.log('Closest service found:', closestService);
      if (closestService) {
        const selectedPkgWithRealId = {
          ...pkg,
          id: closestService._id,
        };
        console.log('Selected package with real ID:', selectedPkgWithRealId);
        setSelectedPackage(selectedPkgWithRealId);
        setStep(2);
      } else {
        alert('Servicio no disponible. Por favor, selecciona otro.');
      }
      return;
    }

    // Buscar el servicio real usando el mapeo
    const realServiceId = packageMapping[pkg.id];
    console.log('Real service ID from mapping:', realServiceId);
    if (!realServiceId) {
      alert('Paquete no disponible. Por favor, selecciona otro.');
      return;
    }

    const realService = services.find(service => service.serviceId === realServiceId);
    console.log('Real service found:', realService);
    if (!realService) {
      alert('Servicio no disponible. Por favor, selecciona otro.');
      return;
    }
    
    // Asignar el id real del servicio
    const selectedPkgWithRealId = {
      ...pkg,
      id: realService._id,
    };

    console.log('Final selected package:', selectedPkgWithRealId);
    setSelectedPackage(selectedPkgWithRealId);
    setStep(2);
  };

  const handleUserSubmit = () => {
    if (!instagramUser.trim()) {
      alert('Por favor ingresa tu usuario de Instagram');
      return;
    }
    setStep(3);
  };

  const handleConfirmOrder = () => {
    console.log('Confirming order with selected package:', selectedPackage);
    
    const orderData = {
      package: selectedPackage,
      instagramUser: instagramUser.replace('@', ''),
      quantity: selectedPackage.isCustom ? customQuantity : selectedPackage.followers,
      price: selectedPackage.isCustom ? Math.round(customQuantity * 0.89) : selectedPackage.price
    };
    
    console.log('Final order data being sent:', orderData);
    onSelectPackage(orderData);
    onClose();
  };

  const handleCustomQuantityChange = (value) => {
    setCustomQuantity(value);
    // Actualizar el paquete personalizado
    const customIndex = packages.findIndex(p => p.isCustom);
    if (customIndex !== -1) {
      packages[customIndex].followers = value;
      packages[customIndex].price = Math.round(value * 0.89);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="service-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="service-modal"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h2>
              <FaInstagram className="modal-icon" />
              {step === 1 ? 'Elige tu Paquete' : 
               step === 2 ? 'Datos del Pedido' : 
               'Confirma tu Orden'}
            </h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Content based on step */}
          <div className="modal-content">
            {step === 1 && (
              <motion.div 
                className="packages-grid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {!services || services.length === 0 ? (
                  <div className="loading-services">
                    <div className="loading-spinner"></div>
                    <p>Cargando servicios...</p>
                  </div>
                ) : (
                  packages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    className={`package-card ${pkg.popular ? 'popular' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    {pkg.popular && (
                      <div className="popular-badge">
                        <FaStar /> Más Popular
                      </div>
                    )}
                    
                    <div className="package-header">
                      <h3>{pkg.name}</h3>
                      <p className="package-description">{pkg.description}</p>
                    </div>

                    <div className="package-price">
                      <span className="price-amount">${pkg.price}</span>
                      <span className="price-currency">ARS</span>
                    </div>

                    <div className="package-followers">
                      <FaUsers className="followers-icon" />
                      {pkg.isCustom ? (
                        <div className="custom-slider-container" onClick={(e) => e.stopPropagation()}>
                          <span>{customQuantity} seguidores</span>
                          <input
                            type="range"
                            min="20"
                            max="10000"
                            value={customQuantity}
                            onChange={(e) => handleCustomQuantityChange(parseInt(e.target.value))}
                            className="custom-slider"
                          />
                          <div className="slider-labels">
                            <span>20</span>
                            <span>10K</span>
                          </div>
                        </div>
                      ) : (
                        <span>{pkg.followers} seguidores</span>
                      )}
                    </div>

                    <div className="package-features">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <FaCheck className="check-icon" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className="select-package-btn">
                      {pkg.isCustom ? (
                        <>
                          <FaCog /> Personalizar
                        </>
                      ) : (
                        'Seleccionar Paquete'
                      )}
                    </button>
                  </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                className="user-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="selected-package-summary">
                  <h3>Paquete Seleccionado:</h3>
                  <div className="package-summary-card">
                    <div className="summary-info">
                      <h4>{selectedPackage?.name}</h4>
                      <p>{selectedPackage?.isCustom ? customQuantity : selectedPackage?.followers} seguidores</p>
                      <span className="summary-price">
                        ${selectedPackage?.isCustom ? Math.round(customQuantity * 0.89) : selectedPackage?.price} ARS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="instagram-user-input">
                  <h3>Datos del pedido:</h3>
                  <div className="input-group">
                    <label htmlFor="instagram-user">Usuario de Instagram:</label>
                    <div className="input-with-icon">
                      <FaInstagram className="input-icon" />
                      <input
                        type="text"
                        id="instagram-user"
                        placeholder="tu_usuario_instagram"
                        value={instagramUser}
                        onChange={(e) => setInstagramUser(e.target.value)}
                        className="instagram-input"
                      />
                    </div>
                    <small>Ingresa tu usuario sin el @</small>
                  </div>
                </div>

                <div className="step-buttons">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setStep(1)}
                  >
                    Volver
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleUserSubmit}
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                className="order-confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="confirmation-header">
                  <FaCheck className="confirmation-icon" />
                  <h3>Confirma tu pedido</h3>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span>Paquete:</span>
                    <span>{selectedPackage?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span>Cantidad:</span>
                    <span>{selectedPackage?.isCustom ? customQuantity : selectedPackage?.followers} seguidores</span>
                  </div>
                  <div className="detail-row">
                    <span>Usuario:</span>
                    <span>@{instagramUser}</span>
                  </div>
                  <div className="detail-row total">
                    <span>Total:</span>
                    <span>${selectedPackage?.isCustom ? Math.round(customQuantity * 0.89) : selectedPackage?.price} ARS</span>
                  </div>
                </div>

                <div className="step-buttons">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setStep(2)}
                  >
                    Modificar
                  </button>
                  <button 
                    className="btn-confirm" 
                    onClick={handleConfirmOrder}
                  >
                    Proceder al Pago
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal;
