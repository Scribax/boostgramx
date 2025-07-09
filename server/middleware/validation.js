const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        message: error.details[0].message,
        details: error.details
      });
    }
    next();
  };
};

// Esquemas de validación
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'any.required': 'El nombre es requerido'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es requerido'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es requerido'
    }),
    password: Joi.string().required().messages({
      'any.required': 'La contraseña es requerida'
    })
  }),

  createOrder: Joi.object({
    serviceId: Joi.string().required().messages({
      'any.required': 'El ID del servicio es requerido'
    }),
    targetUrl: Joi.string().uri().required().messages({
      'string.uri': 'La URL debe ser válida',
      'any.required': 'La URL es requerida'
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      'number.integer': 'La cantidad debe ser un número entero',
      'number.min': 'La cantidad debe ser al menos 1',
      'any.required': 'La cantidad es requerida'
    }),
    paymentMethod: Joi.string().valid('balance', 'mercadopago', 'paypal', 'crypto').optional()
  }),

  updateService: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    price: Joi.number().min(0).optional(),
    minOrder: Joi.number().integer().min(1).optional(),
    maxOrder: Joi.number().integer().min(1).optional(),
    isActive: Joi.boolean().optional(),
    quality: Joi.string().valid('Premium', 'High', 'Medium', 'Standard').optional(),
    speed: Joi.string().valid('Instant', 'Fast', 'Medium', 'Slow').optional(),
    guarantee: Joi.string().valid('Lifetime', '365 Days', '180 Days', '90 Days', '30 Days', 'No Guarantee').optional(),
    features: Joi.array().items(Joi.string()).optional()
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'El email debe ser válido',
      'any.required': 'El email es requerido'
    })
  }),

  newPassword: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'El token es requerido'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    })
  }),

  addBalance: Joi.object({
    amount: Joi.number().min(1).required().messages({
      'number.min': 'El monto debe ser al menos 1',
      'any.required': 'El monto es requerido'
    }),
    paymentMethod: Joi.string().valid('mercadopago', 'paypal', 'crypto').required().messages({
      'any.only': 'Método de pago inválido',
      'any.required': 'El método de pago es requerido'
    })
  })
};

// Validación de URLs de Instagram
const validateInstagramUrl = (url) => {
  const patterns = [
    /^https?:\/\/(www\.)?instagram\.com\/([a-zA-Z0-9_\.]+)\/?$/,
    /^https?:\/\/(www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?$/,
    /^https?:\/\/(www\.)?instagram\.com\/reel\/([a-zA-Z0-9_-]+)\/?$/,
    /^https?:\/\/(www\.)?instagram\.com\/stories\/([a-zA-Z0-9_\.]+)\/([0-9]+)\/?$/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

// Middleware personalizado para validar URLs de Instagram
const validateInstagramUrlMiddleware = (req, res, next) => {
  const { targetUrl } = req.body;
  
  if (!targetUrl) {
    return res.status(400).json({
      error: 'URL requerida',
      message: 'La URL de Instagram es requerida'
    });
  }
  
  if (!validateInstagramUrl(targetUrl)) {
    return res.status(400).json({
      error: 'URL inválida',
      message: 'La URL de Instagram no es válida. Debe ser una URL de perfil, post, reel o historia de Instagram.'
    });
  }
  
  next();
};

module.exports = {
  validate,
  schemas,
  validateInstagramUrl,
  validateInstagramUrlMiddleware
};
