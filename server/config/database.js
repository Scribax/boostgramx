const mongoose = require('mongoose');

// Configuración de MongoDB
const connectDB = async () => {
  try {
    // Opciones de conexión optimizadas para MongoDB Atlas en Vercel
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 3, // Pool size reducido para Vercel
      serverSelectionTimeoutMS: 15000, // Aumentar timeout para Atlas
      socketTimeoutMS: 45000, // Socket timeout más largo
      connectTimeoutMS: 15000, // Timeout de conexión inicial más largo
      bufferMaxEntries: 0, // Disable buffering
      bufferCommands: false, // Disable buffering
      retryWrites: true, // Habilitar retry de escrituras
      w: 'majority', // Write concern
      readPreference: 'primaryPreferred', // Leer desde primario preferido
      heartbeatFrequencyMS: 10000, // Frecuencia de heartbeat
      minPoolSize: 0, // Pool mínimo 0 para serverless
      maxIdleTimeMS: 30000, // Tiempo máximo de inactividad
      authSource: 'admin', // Base de datos de autenticación
      ssl: true, // Habilitar SSL
      tls: true, // Habilitar TLS
      tlsInsecure: false // Validar certificados SSL
    };

    // Verificar que la URI esté configurada
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está configurada en las variables de entorno');
    }

    console.log('🔄 Intentando conectar a MongoDB Atlas...');
    console.log('💻 Configuración de conexión:', {
      serverSelectionTimeoutMS: options.serverSelectionTimeoutMS,
      connectTimeoutMS: options.connectTimeoutMS,
      maxPoolSize: options.maxPoolSize
    });
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Atlas conectado exitosamente!`);
    console.log(`🛜 Host: ${conn.connection.host}`);
    console.log(`📂 Base de datos: ${conn.connection.name}`);
    console.log(`🔗 Estado: ${conn.connection.readyState}`);
    
    // Evento de desconexión
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado - intentando reconectar...');
    });

    // Evento de error
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err.message);
      if (err.name === 'MongooseServerSelectionError') {
        console.error('❌ Posibles causas:');
        console.error('   - IP no está en whitelist de Atlas');
        console.error('   - Credenciales incorrectas');
        console.error('   - Cluster no disponible');
      }
    });

    // Evento de reconexión
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado exitosamente!');
    });

    // Evento de conexión exitosa
    mongoose.connection.on('connected', () => {
      console.log('🔗 MongoDB conectado!');
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
    
    // En producción, intentar usar memoria DB como fallback temporal
    console.log('⚠️ Conexión a MongoDB Atlas falló');
    console.log('📝 Fallback temporal: Usando base de datos en memoria');
    console.log('💡 Verifica que MongoDB Atlas esté configurado correctamente');
    
    // Solo usar memoria DB como último recurso
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
