// Script para probar la autenticación
const axios = require('axios');

const testAuth = async () => {
  try {
    // Test 1: Verificar que el servidor responde
    console.log('1. Verificando servidor...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Servidor funcionando:', healthResponse.data.status);

    // Test 2: Intentar acceder a endpoint protegido sin token
    console.log('\n2. Probando acceso sin token...');
    try {
      await axios.get('http://localhost:5000/api/orders');
    } catch (error) {
      console.log('✅ Error 401 esperado:', error.response?.status === 401);
    }

    // Test 3: Crear un usuario de prueba
    console.log('\n3. Creando usuario de prueba...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpass123'
    };

    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', testUser);
      console.log('✅ Usuario creado:', registerResponse.data.success);
      
      const token = registerResponse.data.token;
      console.log('✅ Token recibido:', token ? 'SI' : 'NO');

      // Test 4: Usar el token para acceder a endpoint protegido
      console.log('\n4. Probando acceso con token...');
      const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Acceso con token exitoso:', ordersResponse.data.success);
      
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('ya existe')) {
        console.log('⚠️  Usuario ya existe, probando login...');
        
        // Test 5: Login con usuario existente
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: testUser.email,
          password: testUser.password
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login exitoso, token:', token ? 'SI' : 'NO');
        
        // Test 6: Usar el token para acceder a endpoint protegido
        console.log('\n6. Probando acceso con token de login...');
        const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Acceso con token exitoso:', ordersResponse.data.success);
      } else {
        console.error('❌ Error inesperado:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error en test:', error.message);
  }
};

testAuth();
