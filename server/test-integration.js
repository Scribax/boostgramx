const axios = require('axios');

// Configuración base para pruebas
const API_BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token a las peticiones
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

const testData = {
  user: {
    name: 'Usuario Test',
    email: 'test@example.com',
    password: 'test123456'
  },
  updatedProfile: {
    name: 'Usuario Test Actualizado',
    email: 'test@example.com',
    phone: '+1234567890',
    country: 'CO',
    timezone: 'UTC-5'
  },
  passwordChange: {
    currentPassword: 'test123456',
    newPassword: 'newtest123456'
  }
};

async function runTests() {
  console.log('🚀 Iniciando pruebas de integración...\n');

  try {
    // 1. Probar registro de usuario
    console.log('1️⃣ Probando registro de usuario...');
    const registerResponse = await api.post('/auth/register', testData.user);
    
    if (registerResponse.data.success) {
      authToken = registerResponse.data.token;
      testUserId = registerResponse.data.user._id;
      console.log('✅ Registro exitoso');
      console.log('📋 Usuario creado:', registerResponse.data.user.name);
    } else {
      throw new Error('Error en registro');
    }

    // 2. Probar obtención de usuario actual
    console.log('\n2️⃣ Probando obtención de usuario actual...');
    const meResponse = await api.get('/auth/me');
    
    if (meResponse.data.success) {
      console.log('✅ Usuario obtenido correctamente');
      console.log('📋 Usuario actual:', meResponse.data.user.name);
    } else {
      throw new Error('Error obteniendo usuario');
    }

    // 3. Probar actualización de perfil
    console.log('\n3️⃣ Probando actualización de perfil...');
    const updateProfileResponse = await api.put('/auth/update-profile', testData.updatedProfile);
    
    if (updateProfileResponse.data.success) {
      console.log('✅ Perfil actualizado correctamente');
      console.log('📋 Nuevo nombre:', updateProfileResponse.data.user.name);
      console.log('📋 País:', updateProfileResponse.data.user.country);
    } else {
      throw new Error('Error actualizando perfil');
    }

    // 4. Probar cambio de contraseña
    console.log('\n4️⃣ Probando cambio de contraseña...');
    const changePasswordResponse = await api.put('/auth/change-password', testData.passwordChange);
    
    if (changePasswordResponse.data.success) {
      console.log('✅ Contraseña cambiada correctamente');
    } else {
      throw new Error('Error cambiando contraseña');
    }

    // 5. Probar login con nueva contraseña
    console.log('\n5️⃣ Probando login con nueva contraseña...');
    const loginResponse = await api.post('/auth/login', {
      email: testData.user.email,
      password: testData.passwordChange.newPassword
    });
    
    if (loginResponse.data.success) {
      authToken = loginResponse.data.token;
      console.log('✅ Login con nueva contraseña exitoso');
    } else {
      throw new Error('Error en login con nueva contraseña');
    }

    // 6. Probar obtención de órdenes (debería estar vacío)
    console.log('\n6️⃣ Probando obtención de órdenes del usuario...');
    const ordersResponse = await api.get('/orders');
    
    if (ordersResponse.data.success) {
      console.log('✅ Órdenes obtenidas correctamente');
      console.log('📋 Total de órdenes:', ordersResponse.data.data.orders.length);
      console.log('📋 Paginación:', ordersResponse.data.data.pagination);
    } else {
      throw new Error('Error obteniendo órdenes');
    }

    // 7. Probar estadísticas de órdenes
    console.log('\n7️⃣ Probando estadísticas de órdenes...');
    const statsResponse = await api.get('/orders/stats/summary');
    
    if (statsResponse.data.success) {
      console.log('✅ Estadísticas obtenidas correctamente');
      console.log('📋 Estadísticas:', statsResponse.data.data);
    } else {
      throw new Error('Error obteniendo estadísticas');
    }

    // 8. Probar obtención de servicios
    console.log('\n8️⃣ Probando obtención de servicios...');
    const servicesResponse = await api.get('/services');
    
    if (servicesResponse.data.success) {
      console.log('✅ Servicios obtenidos correctamente');
      console.log('📋 Total de servicios:', servicesResponse.data.data.services.length);
    } else {
      throw new Error('Error obteniendo servicios');
    }

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📊 Resumen de funcionalidades verificadas:');
    console.log('  ✅ Registro de usuario');
    console.log('  ✅ Autenticación y JWT');
    console.log('  ✅ Obtención de usuario actual');
    console.log('  ✅ Actualización de perfil');
    console.log('  ✅ Cambio de contraseña');
    console.log('  ✅ Login con nueva contraseña');
    console.log('  ✅ Obtención de órdenes del usuario');
    console.log('  ✅ Estadísticas de órdenes');
    console.log('  ✅ Obtención de servicios');

  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('📋 Respuesta del servidor:', error.response.data);
      console.error('📋 Status code:', error.response.status);
    }
    process.exit(1);
  }
}

// Verificar que el servidor esté corriendo
async function checkServer() {
  try {
    const response = await api.get('/health');
    if (response.data.status === 'OK') {
      console.log('✅ Servidor backend funcionando correctamente\n');
      return true;
    }
  } catch (error) {
    console.error('❌ El servidor backend no está corriendo en http://localhost:5000');
    console.error('💡 Por favor, ejecuta el servidor con: npm run server');
    process.exit(1);
  }
}

// Ejecutar pruebas
async function main() {
  console.log('🔍 Verificando estado del servidor...');
  await checkServer();
  await runTests();
}

if (require.main === module) {
  main();
}

module.exports = { runTests };
