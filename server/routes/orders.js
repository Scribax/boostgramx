const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Service = require('../models/Service');
const { authMiddleware } = require('../middleware/auth');
const memoryDB = require('../data/memoryDB');
const smmAPI = require('../services/smmAPI');

// POST /api/orders - Crear nueva orden
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { serviceId, targetUrl, quantity } = req.body;
    const userId = req.user._id;

    // Validaciones básicas
    if (!serviceId || !targetUrl || !quantity) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Service ID, URL objetivo y cantidad son requeridos'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        error: 'Cantidad inválida',
        message: 'La cantidad debe ser mayor a 0'
      });
    }

    let service;
    if (global.USE_MEMORY_DB) {
      service = await memoryDB.findServiceById(serviceId);
    } else {
      service = await Service.findById(serviceId);
    }

    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado',
        message: 'El servicio seleccionado no existe'
      });
    }

    if (!service.isActive) {
      return res.status(400).json({
        error: 'Servicio no disponible',
        message: 'Este servicio no está disponible actualmente'
      });
    }

    // Validar cantidad mínima y máxima
    if (quantity < service.minOrder) {
      return res.status(400).json({
        error: 'Cantidad muy pequeña',
        message: `La cantidad mínima para este servicio es ${service.minOrder}`
      });
    }

    if (quantity > service.maxOrder) {
      return res.status(400).json({
        error: 'Cantidad muy grande',
        message: `La cantidad máxima para este servicio es ${service.maxOrder}`
      });
    }

    // Calcular precio total
    // Usar el precio real del frontend en lugar de dividir por 1000
    const pricePerUnit = service.price / 1000; // Precio por cada 1000 unidades del servicio
    const totalAmount = (quantity * pricePerUnit).toFixed(2);
    
    // Precios optimizados con márgenes de ganancia rentables
    // Costo base: $1.68 USD por 1000 seguidores = $2,184 ARS
    // Margen de ganancia: 300-400%
    let customPrice;
    if (quantity <= 250) {
      customPrice = 1890; // Margen: 346%
    } else if (quantity <= 500) {
      customPrice = 3490; // Margen: 320%
    } else if (quantity <= 1000) {
      customPrice = 6490; // Margen: 297%
    } else {
      // Para cantidades mayores, precio proporcional
      const pricePerThousand = 6490;
      customPrice = Math.round((quantity / 1000) * pricePerThousand);
    }
    const finalAmount = customPrice;

    // Extraer usuario de Instagram de la URL
    const instagramUser = targetUrl.replace('https://instagram.com/', '').replace('/', '');
    
    // Crear orden en nuestro sistema primero (pendiente de pago)
    const orderData = {
      user: userId,
      service: serviceId,
      targetUrl,
      instagramUser, // Agregar el usuario de Instagram
      quantity,
      price: pricePerUnit,
      totalAmount: finalAmount, // Usar el precio personalizado
      paymentMethod: 'mercadopago',
      paymentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending'
    };

    let order;
    if (global.USE_MEMORY_DB) {
      order = await memoryDB.createOrder(orderData);
    } else {
      order = new Order({
        ...orderData,
        orderId: Order.generateOrderId()
      });
      await order.save();
    }

    // NOTA: La orden en la API SMM se creará automáticamente cuando el pago sea confirmado
    // por el webhook de MercadoPago en /api/payments/webhook
    console.log(`📋 Orden creada en estado pendiente de pago - ID: ${order.orderId || order._id}`);
    console.log(`💳 Orden esperando confirmación de pago de MercadoPago`);
    
    // La orden NO se ejecuta en SMM hasta que el pago sea confirmado

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        order,
        service: {
          name: service.name,
          category: service.category,
          platform: service.platform
        }
      }
    });

  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear la orden'
    });
  }
});

// GET /api/orders - Obtener órdenes del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;

    let orders, total;
    const skip = (page - 1) * limit;

    if (global.USE_MEMORY_DB) {
      orders = await memoryDB.findOrdersByUser(userId, {
        skip,
        limit: parseInt(limit)
      });
      total = await memoryDB.countOrdersByUser(userId);
    } else {
      const filter = { user: userId };
      if (status) {
        filter.status = status;
      }

      orders = await Order.find(filter)
        .populate('service', 'name category platform')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      total = await Order.countDocuments(filter);
    }

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener órdenes'
    });
  }
});

// GET /api/orders/:id - Obtener una orden específica
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let order;
    if (global.USE_MEMORY_DB) {
      order = await memoryDB.findOrderById(id);
      
      if (order && order.user != userId) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: 'No tienes permiso para ver esta orden'
        });
      }
    } else {
      order = await Order.findOne({ 
        $or: [{ _id: id }, { orderId: id }],
        user: userId 
      }).populate('service', 'name category platform description');
    }

    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
        message: 'La orden solicitada no existe o no tienes acceso a ella'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener la orden'
    });
  }
});

// GET /api/orders/stats/summary - Estadísticas del usuario
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    let orders;
    if (global.USE_MEMORY_DB) {
      orders = await memoryDB.findOrdersByUser(userId);
    } else {
      orders = await Order.find({ user: userId });
    }

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? 
        (orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener estadísticas'
    });
  }
});

module.exports = router;
