const express = require('express');
const mercadopago = require('mercadopago');
const Order = require('../models/Order');
const User = require('../models/User');
const axios = require('axios');
const router = express.Router();

// Configurar MercadoPago
mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-YOUR-ACCESS-TOKEN');

// Crear preferencia de pago con datos del frontend
router.post('/create-preference', async (req, res) => {
  try {
    console.log('📦 Recibiendo datos de pago:', req.body);
    
    const { items, payer, back_urls } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Items son requeridos' });
    }
    
    // Obtener URL del frontend según el entorno
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL_PROD || 'https://boostgramx.com'
      : process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Crear preferencia de pago
    const preferenceData = {
      items: items.map(item => ({
        title: item.title,
        description: item.description || item.title,
        quantity: item.quantity || 1,
        unit_price: parseFloat(item.unit_price),
        currency_id: item.currency_id || 'ARS'
      })),
      back_urls: {
        success: back_urls?.success || `${frontendUrl}/checkout/success`,
        failure: back_urls?.failure || `${frontendUrl}/checkout/failure`,
        pending: back_urls?.pending || `${frontendUrl}/checkout/pending`
      },
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`,
      payer: {
        email: payer?.email || 'test@test.com'
      }
    };
    
    console.log('🔄 Enviando a MercadoPago:', preferenceData);
    
    const response = await mercadopago.preferences.create(preferenceData);
    
    console.log('✅ Respuesta de MercadoPago:', {
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });
    
    res.json({ 
      success: true,
      preferenceId: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });
    
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
});

// Crear preferencia de pago para una orden específica
router.post('/create-order-payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    console.log('💳 Procesando pago para orden:', orderId);
    
    // Buscar la orden
    const order = await Order.findById(orderId).populate('user').populate('service');
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    if (order.paymentStatus === 'approved') {
      return res.status(400).json({ error: 'Esta orden ya fue pagada' });
    }
    
    // Obtener URL del frontend según el entorno
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL_PROD || 'https://boostgramx.com'
      : process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Crear preferencia de pago
    const preferenceData = {
      items: [{
        title: order.service.name,
        description: `${order.quantity} ${order.service.type} para ${order.targetUrl}`,
        quantity: 1,
        unit_price: parseFloat(order.totalAmount),
        currency_id: 'ARS'
      }],
      back_urls: {
        success: `${frontendUrl}/checkout/success?order=${orderId}`,
        failure: `${frontendUrl}/checkout/failure?order=${orderId}`,
        pending: `${frontendUrl}/checkout/pending?order=${orderId}`
      },
      external_reference: orderId,
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      payer: {
        email: order.user.email,
        name: order.user.name
      }
    };
    
    console.log('🔄 Creando preferencia de MercadoPago:', preferenceData);
    console.log('🔗 URLs de redirección configuradas:');
    console.log('   Success: ', preferenceData.back_urls.success);
    console.log('   Failure: ', preferenceData.back_urls.failure);
    console.log('   Pending: ', preferenceData.back_urls.pending);
    
    const response = await mercadopago.preferences.create(preferenceData);
    
    // Actualizar orden con ID de preferencia
    await Order.findByIdAndUpdate(orderId, {
      paymentId: response.body.id,
      paymentStatus: 'pending'
    });
    
    console.log('✅ Preferencia creada:', {
      id: response.body.id,
      init_point: response.body.init_point
    });
    
    res.json({ 
      success: true,
      preferenceId: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });
    
  } catch (error) {
    console.error('❌ Error creando pago para orden:', error);
    res.status(500).json({ error: 'Error al crear preferencia de pago' });
  }
});

// Ruta de prueba simplificada para testing
router.post('/test-payment', async (req, res) => {
  try {
    // Obtener URL del frontend según el entorno
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL_PROD || 'https://boostgramx.com'
      : process.env.FRONTEND_URL || 'http://localhost:3000';
    
    const preferenceData = {
      items: [{
        title: 'Paquete Starter - Test',
        description: '250 seguidores para prueba',
        quantity: 1,
        unit_price: 400,
        currency_id: 'ARS'
      }],
      back_urls: {
        success: `${frontendUrl}/checkout/success`,
        failure: `${frontendUrl}/checkout/failure`,
        pending: `${frontendUrl}/checkout/pending`
      },
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`,
      payer: {
        email: 'test@example.com'
      }
    };
    
    console.log('🧪 Testing MercadoPago con datos:', preferenceData);
    
    const response = await mercadopago.preferences.create(preferenceData);
    
    res.json({ 
      success: true,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point
    });
  } catch (error) {
    console.error('❌ Error en test de pago:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook para recibir notificaciones de pago
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const paymentInfo = await mercadopago.payment.findById(data.id);
      
      const externalReference = paymentInfo.body.external_reference;
      const status = paymentInfo.body.status;
      
      // Buscar la orden
      const order = await Order.findById(externalReference);
      if (!order) {
        console.error('Orden no encontrada para external_reference:', externalReference);
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      
      // Actualizar estado de pago
      await Order.findByIdAndUpdate(externalReference, {
        paymentStatus: status,
        paymentId: data.id
      });
      
      // Si el pago fue aprobado, ejecutar orden en SMM API
      if (status === 'approved') {
        await executeOrderOnSMM(order);
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

// Función para ejecutar orden en SMM API después de pago confirmado
async function executeOrderOnSMM(order) {
  try {
    const smmResponse = await axios.post('https://smmhype.com/api/v2', {
      key: process.env.SMM_API_KEY,
      action: 'add',
      service: "14350",
      link: order.link,
      quantity: order.quantity
    });
    
    if (smmResponse.data.order) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'processing',
        externalOrderId: smmResponse.data.order,
        paymentStatus: 'approved'
      });
      
      console.log(`Orden ${order._id} ejecutada en SMM API con ID: ${smmResponse.data.order}`);
    } else {
      console.error('Error ejecutando orden en SMM API:', smmResponse.data);
      await Order.findByIdAndUpdate(order._id, {
        status: 'failed',
        error: smmResponse.data.error || 'Error desconocido en SMM API'
      });
    }
  } catch (error) {
    console.error('Error ejecutando orden en SMM API:', error);
    await Order.findByIdAndUpdate(order._id, {
      status: 'failed',
      error: error.message
    });
  }
}

// Verificar estado de pago
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      externalOrderId: order.externalOrderId
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Error verificando estado de pago' });
  }
});

module.exports = router;
