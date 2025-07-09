const mongoose = require('mongoose');

// Configuración de MongoDB
const connectDB = async () => {
  try {
    // Opciones de conexión optimizadas para Vercel/Serverless
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 2, // Reducir pool size para serverless
      serverSelectionTimeoutMS: 5000, // Reducir timeout para serverless
      socketTimeoutMS: 20000, // Reducir socket timeout
      connectTimeoutMS: 5000, // Reducir timeout de conexión
      bufferMaxEntries: 0, // Disable buffering
      bufferCommands: false, // Disable buffering
      retryWrites: true, // Habilitar retry de escrituras
      w: 'majority', // Write concern
      authSource: 'admin', // Base de datos de autenticación
    };

    // Verificar que la URI esté configurada
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está configurada en las variables de entorno');
    }

    console.log('🔄 Intentando conectar a MongoDB...');
    
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

    // Evento de reconexión
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
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
    console.error('❌ Stack completo:', error.stack);
    
    // En desarrollo, usar memoria como fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Fallback: Usando base de datos en memoria');
      global.USE_MEMORY_DB = true;
      return null;
    }
    
    // En producción, usar memoria DB como fallback temporal
    console.log('📝 Fallback temporal: Usando base de datos en memoria');
    global.USE_MEMORY_DB = true;
    return null;
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
