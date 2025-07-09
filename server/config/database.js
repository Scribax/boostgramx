const mongoose = require('mongoose');

// Configuración de MongoDB
const connectDB = async () => {
  try {
    // Opciones de conexión optimizadas para Mongoose 7+
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📂 Base de datos: ${conn.connection.name}`);
    
    // Evento de desconexión
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    // Evento de error
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Conexión a MongoDB cerrada');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    
    // En desarrollo, usar memoria como fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Fallback: Usando base de datos en memoria');
      global.USE_MEMORY_DB = true;
      return null;
    }
    
    process.exit(1);
  }
};

// Función para verificar el estado de la conexión
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    status: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
};

module.exports = {
  connectDB,
  getConnectionStatus
};
