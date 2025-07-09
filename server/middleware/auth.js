const jwt = require('jsonwebtoken');
const User = require('../models/User');
const memoryDB = require('../data/memoryDB');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado', 
        message: 'Token de autenticación requerido' 
      });
    }

    // Verificar que el token no esté vacío o mal formateado
    if (token === 'null' || token === 'undefined' || token.length < 10) {
      return res.status(401).json({ 
        error: 'Token inválido', 
        message: 'Token mal formateado, por favor inicia sesión nuevamente' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    
    if (global.USE_MEMORY_DB) {
      user = await memoryDB.findUserById(decoded.userId);
    } else {
      user = await User.findById(decoded.userId).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Token inválido', 
        message: 'Usuario no encontrado' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Cuenta desactivada', 
        message: 'Tu cuenta ha sido desactivada' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(401).json({ 
      error: 'Token inválido', 
      message: 'Token de autenticación inválido o expirado' 
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado', 
        message: 'Se requieren permisos de administrador' 
      });
    }
    next();
  } catch (error) {
    console.error('Error en middleware de admin:', error);
    res.status(500).json({ 
      error: 'Error interno', 
      message: 'Error verificando permisos' 
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user;
      
      if (global.USE_MEMORY_DB) {
        user = await memoryDB.findUserById(decoded.userId);
      } else {
        user = await User.findById(decoded.userId).select('-password');
      }
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Si hay error, simplemente continúa sin autenticación
    next();
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  optionalAuth
};
