import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaArrowLeft, FaHome } from 'react-icons/fa';
import './CheckoutFailurePage.css';

const CheckoutFailurePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const verifyPaymentFailure = async () => {
        try {
          const paymentId = searchParams.get('payment_id');
          const status = searchParams.get('status');

          if (paymentId && status === 'failure') {
            // Handle failure case, possibly log or alert
            console.warn('Payment failed with ID:', paymentId);
          }
        } catch (error) {
          console.error('Error processing payment cancellation:', error);
        } finally {
          setLoading(false);
        }
      };

      verifyPaymentFailure();
    }, [searchParams]);

    if (loading) {
      return (
        <div className="checkout-failure-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Verifying your transaction status...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="checkout-failure-page">
        <div className="failure-container">
          <motion.div 
            className="failure-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="failure-icon"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <FaTimesCircle />
            </motion.div>

            <motion.div 
              className="failure-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1>Payment Failed</h1>
              <p>Unfortunately, your transaction could not be processed.</p>
            </motion.div>

            <motion.div 
              className="next-steps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3>What's next?</h3>
              <ul>
                <li>Please check your payment details and try again.</li>
                <li>If the problem persists, contact support.</li>
                <li>You can view your order history on your dashboard.</li>
              </ul>
            </motion.div>

            <motion.div 
              className="action-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button 
                className="btn primary"
                onClick={() => navigate('/checkout')}
              >
                <FaArrowLeft />
                Retry Payment
              </button>
              <button 
                className="btn secondary"
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

export default CheckoutFailurePage;
