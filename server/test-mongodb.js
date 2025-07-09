const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDB() {
  try {
    console.log('🔄 Probando conexión a MongoDB Atlas...');
    console.log('🔗 URI:', process.env.MONGODB_URI.replace(/:[^@]+@/, ':***@'));
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 3,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      bufferCommands: false,
      retryWrites: true,
      w: 'majority',
      readPreference: 'primaryPreferred',
      heartbeatFrequencyMS: 10000,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      authSource: 'admin',
      ssl: true,
      tls: true,
      tlsInsecure: false
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ Conexión exitosa!');
    console.log(`🛜 Host: ${conn.connection.host}`);
    console.log(`📂 Base de datos: ${conn.connection.name}`);
    console.log(`🔗 Estado: ${conn.connection.readyState}`);
    
    // Probar una operación simple
    const testCollection = mongoose.connection.db.collection('test');
    const testDoc = await testCollection.findOne({});
    console.log('✅ Operación de lectura exitosa');
    
    // Probar inserción
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Operación de escritura exitosa');
    
    // Limpiar
    await testCollection.deleteOne({ test: true });
    console.log('✅ Operación de eliminación exitosa');
    
    await mongoose.connection.close();
    console.log('✅ Todas las operaciones completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('❌ Posibles causas:');
      console.error('   1. IP no está en whitelist de Atlas');
      console.error('   2. Credenciales incorrectas');
      console.error('   3. Cluster no disponible');
      console.error('   4. Problemas de red');
    }
    
    process.exit(1);
  }
}

testMongoDB();
