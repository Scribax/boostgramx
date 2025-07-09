import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SessionExpiredModal.css';

const SessionExpiredModal = ({ show, onContinueLogin, onGoHome }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="session-expired-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="session-expired-modal"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="session-expired-header">
            <div className="session-expired-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#ff6b6b"/>
              </svg>
            </div>
            <h2>Sesión Expirada</h2>
          </div>
          
          <div className="session-expired-content">
            <p>Tu sesión ha expirado. Te redirigiremos al login para que puedas continuar.</p>
            <p className="session-expired-subtitle">No cierres esta ventana. Te redirigiremos automáticamente.</p>
          </div>
          
          <div className="session-expired-actions">
            <button 
              className="session-expired-btn primary"
              onClick={onContinueLogin}
            >
              Continuar al Login
            </button>
            <button 
              className="session-expired-btn secondary"
              onClick={onGoHome}
            >
              Ir al Inicio
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SessionExpiredModal;
