// Script de prueba para verificar funcionalidad de sesiones mejorada
// Este archivo es solo para testing y desarrollo

const testSessionFunctionality = async () => {
  console.log('🔍 Iniciando pruebas de funcionalidad de sesiones...');
  
  // Verificar que las funciones existen
  const { authService, addSessionExpiredListener, clearSessionExpiredState } = await import('../services/api');
  
  console.log('✅ Funciones importadas correctamente');
  
  // Test 1: Verificar si el usuario está autenticado
  console.log('\n📝 Test 1: Verificar autenticación');
  const isAuth = authService.isAuthenticated();
  console.log(`Autenticado: ${isAuth}`);
  
  // Test 2: Obtener usuario actual
  console.log('\n📝 Test 2: Obtener usuario actual');
  const currentUser = authService.getCurrentUser();
  console.log('Usuario actual:', currentUser);
  
  // Test 3: Verificar token silenciosamente
  console.log('\n📝 Test 3: Verificar token silenciosamente');
  try {
    const tokenResult = await authService.verifyTokenSilently();
    console.log('Resultado verificación de token:', tokenResult);
  } catch (error) {
    console.log('Error verificando token:', error);
  }
  
  // Test 4: Registrar listener de sesión expirada
  console.log('\n📝 Test 4: Registrar listener de sesión expirada');
  addSessionExpiredListener(() => {
    console.log('🚨 Sesión expirada detectada por listener');
  });
  console.log('✅ Listener registrado');
  
  // Test 5: Limpiar estado de sesión expirada
  console.log('\n📝 Test 5: Limpiar estado de sesión expirada');
  clearSessionExpiredState();
  console.log('✅ Estado limpiado');
  
  console.log('\n🎉 Pruebas completadas');
};

// Exportar función para uso en consola del navegador
window.testSessionFunctionality = testSessionFunctionality;

export default testSessionFunctionality;
