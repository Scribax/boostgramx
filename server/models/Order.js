const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  targetUrl: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'in_progress',
      'completed',
      'partial',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  apiOrderId: {
    type: String,
    default: null
  },
  startCount: {
    type: Number,
    default: 0
  },
  remains: {
    type: Number,
    default: 0
  },
  delivered: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['balance', 'mercadopago', 'paypal', 'crypto'],
    default: 'balance'
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  completedAt: {
    type: Date,
    default: null
  },
  estimatedDelivery: {
    type: Date,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ apiOrderId: 1 });

// Método para calcular el progreso de la orden
orderSchema.methods.getProgress = function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'cancelled' || this.status === 'refunded') return 0;
  
  const progress = (this.delivered / this.quantity) * 100;
  return Math.round(progress);
};

// Método para verificar si la orden está terminada
orderSchema.methods.isFinished = function() {
  return ['completed', 'cancelled', 'refunded'].includes(this.status);
};

// Método para generar ID de orden único
orderSchema.statics.generateOrderId = function() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
};

module.exports = mongoose.model('Order', orderSchema);
