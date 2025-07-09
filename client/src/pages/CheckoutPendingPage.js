import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaHome } from 'react-icons/fa';
import './CheckoutPendingPage.css';

const CheckoutPendingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="checkout-pending-page">
      <div className="pending-container">
        <motion.div 
          className="pending-content"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="pending-icon"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <FaClock />
          </motion.div>

          <motion.div 
            className="pending-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1>Payment Pending</h1>
            <p>Your transaction is being processed.</p>
          </motion.div>

          <motion.div 
            className="next-steps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h3>What should you do?</h3>
            <ul>
              <li>Please wait a moment and refresh your page.</li>
              <li>Contact support if you don't receive confirmation.</li>
              <li>You can check your order status on your dashboard.</li>
            </ul>
          </motion.div>

          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <button 
              className="btn"
              onClick={() => navigate('/dashboard')}
            >
              <FaHome />
              Back to Dashboard
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPendingPage;

