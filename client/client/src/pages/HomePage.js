import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaInstagram, 
  FaHeart, 
  FaUsers, 
  FaEye, 
  FaComments, 
  FaShieldAlt, 
  FaBolt, 
  FaCheckCircle 
} from 'react-icons/fa';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const features = [
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Seguidores Reales",
      description: "Aumenta tus seguidores con perfiles auténticos y activos"
    },
    {
      icon: <FaHeart className="feature-icon" />,
      title: "Likes Instantáneos",
      description: "Obtén likes de forma rápida y natural en tus publicaciones"
    },
    {
      icon: <FaEye className="feature-icon" />,
      title: "Visualizaciones",
      description: "Incrementa las vistas en tus stories y reels de Instagram"
    },
    {
      icon: <FaComments className="feature-icon" />,
      title: "Comentarios",
      description: "Mejora la interacción con comentarios relevantes"
    }
  ];

  const benefits = [
    {
      icon: <FaBolt className="benefit-icon" />,
      title: "Entrega Rápida",
      description: "Resultados en minutos, no en días"
    },
    {
      icon: <FaShieldAlt className="benefit-icon" />,
      title: "100% Seguro",
      description: "Métodos seguros que protegen tu cuenta"
    },
    {
      icon: <FaCheckCircle className="benefit-icon" />,
      title: "Garantía",
      description: "Garantizamos la calidad de nuestros servicios"
    }
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowAuthOptions(true);
    }
  };

  const handleAuthChoice = (choice) => {
    navigate(`/${choice}`);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-text">
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Haz Crecer Tu Instagram
                <span className="highlight"> Instantáneamente</span>
              </motion.h1>
              
              <motion.p 
                className="hero-description"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Aumenta tus seguidores, likes y engagement de forma segura y rápida. 
                Miles de creadores ya confían en nosotros para hacer crecer sus perfiles.
              </motion.p>

              <motion.div 
                className="hero-stats"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Clientes Satisfechos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Órdenes Completadas</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Soporte</span>
                </div>
              </motion.div>

              <motion.button 
                className="cta-button"
                onClick={handleGetStarted}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram className="cta-icon" />
                COMENZAR AHORA
              </motion.button>
            </div>

            <motion.div 
              className="hero-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="instagram-post">
                    <div className="post-header">
                      <div className="profile-pic"></div>
                      <div className="profile-info">
                        <span className="username">tu_perfil</span>
                        <span className="location">Tu ubicación</span>
                      </div>
                    </div>
                    <div className="post-image"></div>
                    <div className="post-actions">
                      <div className="action-buttons">
                        <FaHeart className="action-icon liked" />
                        <FaComments className="action-icon" />
                        <FaEye className="action-icon" />
                      </div>
                      <div className="likes-count">
                        <motion.span
                          key="likes"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          Les gusta a 10,234 personas
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="floating-elements">
                  <motion.div 
                    className="floating-like"
                    animate={{ 
                      y: [-10, -20, -10],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <FaHeart />
                  </motion.div>
                  <motion.div 
                    className="floating-follower"
                    animate={{ 
                      y: [-15, -25, -15],
                      x: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1
                    }}
                  >
                    <FaUsers />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Nuestros Servicios</h2>
            <p>Todo lo que necesitas para hacer crecer tu presencia en Instagram</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                {feature.icon}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>¿Por Qué Elegirnos?</h2>
            <p>La mejor experiencia en crecimiento de redes sociales</p>
          </motion.div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="benefit-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {benefit.icon}
                <div className="benefit-content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>¿Listo para Hacer Crecer Tu Instagram?</h2>
            <p>Únete a miles de creadores que ya están creciendo con nosotros</p>
            <motion.button 
              className="cta-button secondary"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Empezar Gratis
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Auth Options Modal */}
      <AnimatePresence>
        {showAuthOptions && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthOptions(false)}
          >
            <motion.div 
              className="auth-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>¿Cómo quieres continuar?</h3>
                <button 
                  className="close-modal"
                  onClick={() => setShowAuthOptions(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="auth-options">
                <motion.button 
                  className="auth-option login"
                  onClick={() => handleAuthChoice('login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="auth-option-content">
                    <h4>Iniciar Sesión</h4>
                    <p>Ya tengo una cuenta</p>
                  </div>
                </motion.button>
                
                <motion.button 
                  className="auth-option register"
                  onClick={() => handleAuthChoice('register')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="auth-option-content">
                    <h4>Registrarse</h4>
                    <p>Crear una cuenta nueva</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
