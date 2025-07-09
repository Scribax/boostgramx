const smmAPI = require('./services/smmAPI');

async function checkOrderStatus() {
  const orderId = '1044621'; // ID de la orden que acabamos de crear
  
  console.log('🔍 Verificando estado de la orden #' + orderId + '...\n');
  
  try {
    const statusResult = await smmAPI.getOrderStatus(orderId);
    
    if (statusResult.success) {
      console.log('✅ Estado obtenido exitosamente:');
      console.log(JSON.stringify(statusResult.data, null, 2));
      
      if (statusResult.data.status) {
        console.log('\n📊 Detalles de la orden:');
        console.log('🏷️  Estado:', statusResult.data.status);
        console.log('💰 Costo:', '$' + statusResult.data.charge, statusResult.data.currency);
        console.log('📈 Cantidad inicial:', statusResult.data.start_count);
        console.log('⏳ Pendientes:', statusResult.data.remains);
      }
    } else {
      console.log('❌ Error:', statusResult.error);
    }
  } catch (error) {
    console.error('💥 Error verificando estado:', error.message);
  }
}

// Ejecutar verificación cada 30 segundos, 3 veces
let checks = 0;
const maxChecks = 3;

function runPeriodicCheck() {
  checkOrderStatus().then(() => {
    checks++;
    if (checks < maxChecks) {
      console.log(`\n⏰ Próxima verificación en 30 segundos... (${checks}/${maxChecks})\n`);
      setTimeout(runPeriodicCheck, 30000);
    } else {
      console.log('\n🏁 Monitoreo completado. Puedes verificar manualmente tu Instagram para ver los nuevos seguidores.');
    }
  });
}

runPeriodicCheck();
