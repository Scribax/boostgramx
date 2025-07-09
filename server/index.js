const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { connectDB, getConnectionStatus } = require('./config/database');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
});
app.use('/api/', limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Conexión a MongoDB
connectDB().then(() => {
  const status = getConnectionStatus();
  console.log(`Conexión MongoDB: ${status.status}`);
}).catch(error => {
  console.warn('Error al conectar a MongoDB:', error.message);
});

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    database: {
      status: dbStatus.status,
      host: dbStatus.host,
      name: dbStatus.name,
      usingMemory: global.USE_MEMORY_DB || false
    },
    timestamp: new Date().toISOString()
  });
});

// Ruta específica para el estado de la base de datos
app.get('/api/db-status', (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({
    connected: dbStatus.status === 'connected',
    ...dbStatus,
    usingMemory: global.USE_MEMORY_DB || false
  });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
