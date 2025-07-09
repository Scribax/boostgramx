import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaInstagram, 
  FaRocket, 
  FaUsers, 
  FaHeart, 
  FaEye, 
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft
} from 'react-icons/fa';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const features = [
    {
      icon: <FaUsers />,
      title: "Seguidores Reales",
      description: "Aumenta tus seguidores con perfiles auténticos y activos que realmente interactúan con tu contenido."
    },
    {
      icon: <FaHeart />,
      title: "Likes Instantáneos",
      description: "Obtén likes de forma rápida y natural en todas tus publicaciones para mayor visibilidad."
    },
    {
      icon: <FaEye />,
      title: "Visualizaciones",
      description: "Incrementa las vistas en tus stories, reels y videos para alcanzar más audiencia."
    }
  ];

  const benefits = [
    {
      icon: <FaBolt />,
      title: "Entrega Rápida",
      description: "Resultados visibles en minutos, no en días. Nuestro sistema automatizado garantiza velocidad."
    },
    {
      icon: <FaShieldAlt />,
      title: "100% Seguro",
      description: "Métodos seguros que protegen tu cuenta. Cumplimos con todas las políticas de Instagram."
    },
    {
      icon: <FaCheckCircle />,
      title: "Garantía Total",
      description: "Garantizamos la calidad de nuestros servicios con soporte 24/7 y reembolso garantizado."
    }
  ];

  const reviews = [
    {
      name: "María González",
      username: "@maria_lifestyle",
      rating: 5,
      text: "Increíble servicio! Mi cuenta creció de 500 a 15K seguidores en solo 2 meses. Los seguidores son reales y activos.",
      followers: "15.2K"
    },
    {
      name: "Carlos Ruiz",
      username: "@carlos_fitness",
      rating: 5,
      text: "Perfecta para mi negocio de fitness. Ahora tengo más clientes y mi engagement subió un 300%. Totalmente recomendado.",
      followers: "28.5K"
    },
    {
      name: "Ana López",
      username: "@ana_chef",
      rating: 5,
      text: "Como chef, necesitaba más visibilidad. Esta plataforma me ayudó a conseguir colaboraciones con restaurantes importantes.",
      followers: "42.1K"
    }
  ];

  const stats = [
    { number: "50K+", label: "Clientes Satisfechos" },
    { number: "2M+", label: "Seguidores Entregados" },
    { number: "24/7", label: "Soporte Técnico" },
    { number: "99.9%", label: "Tasa de Éxito" }
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
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="hero-title">
              Impulsa <span className="highlight">Tu Instagram</span>
            </h1>
            <p className="hero-description">
              Incrementa tus seguidores, likes y visualizaciones de manera segura y rápida.
              Confía en nuestra plataforma para un crecimiento auténtico y efectivo.
            </p>
            <button className="cta-button" onClick={handleGetStarted}>
              <FaInstagram className="cta-icon" />
              Comienza Ahora
            </button>
          </motion.div>
          <motion.div 
            className="hero-illustration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <FaRocket className="rocket-icon" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
            <p>Soluciones completas para hacer crecer tu presencia en Instagram de manera auténtica y efectiva</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>¿Cómo Funciona?</h2>
            <p>Tres simples pasos para transformar tu Instagram</p>
          </motion.div>
          
          <div className="steps-grid">
            <motion.div 
              className="step"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="step-number">1</div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta en segundos y selecciona el plan que mejor se adapte a tus necesidades.</p>
            </motion.div>
            
            <motion.div 
              className="step"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number">2</div>
              <h3>Configura</h3>
              <p>Ingresa tu usuario de Instagram y personaliza tu estrategia de crecimiento.</p>
            </motion.div>
            
            <motion.div 
              className="step"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="step-number">3</div>
              <h3>Crece</h3>
              <p>Observa cómo tu cuenta crece de forma natural con seguidores reales y comprometidos.</p>
            </motion.div>
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
            <p>Somos líderes en crecimiento de redes sociales con resultados comprobados</p>
          </motion.div>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="benefit-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <div className="benefit-content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Lo Que Dicen Nuestros Clientes</h2>
            <p>Más de 50,000 creadores confían en nosotros para hacer crecer sus cuentas</p>
          </motion.div>
          
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <motion.div 
                key={index}
                className="review-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4>{review.name}</h4>
                      <span className="username">{review.username}</span>
                      <span className="followers">{review.followers} seguidores</span>
                    </div>
                  </div>
                  <div className="rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>
                </div>
                <div className="review-content">
                  <FaQuoteLeft className="quote-icon" />
                  <p>{review.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>¿Listo para Transformar tu Instagram?</h2>
            <p>Más de 50,000 creadores ya están creciendo con nosotros. Únete hoy y ve los resultados en minutos.</p>
            <motion.button 
              className="cta-button secondary"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket className="cta-icon" />
              Comenzar Ahora - Es Gratis
            </motion.button>
            <p className="guarantee-text">
              ✓ Sin compromisos • ✓ Resultados garantizados • ✓ Soporte 24/7
            </p>
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
