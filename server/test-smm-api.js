const smmAPI = require('./services/smmAPI');

async function testSMMAPI() {
  console.log('🧪 Probando integración con SMM API...\n');

  try {
    // 1. Probar obtención de balance
    console.log('1️⃣ Probando balance de usuario...');
    const balanceResult = await smmAPI.getUserBalance();
    
    if (balanceResult.success) {
      console.log('✅ Balance obtenido exitosamente');
      console.log('💰 Balance:', balanceResult.data.balance, balanceResult.data.currency);
    } else {
      console.log('❌ Error obteniendo balance:', balanceResult.error);
    }

    // 2. Probar obtención de servicios
    console.log('\n2️⃣ Probando obtención de servicios...');
    const servicesResult = await smmAPI.getServices();
    
    if (servicesResult.success && Array.isArray(servicesResult.data)) {
      console.log('✅ Servicios obtenidos exitosamente');
      console.log('📋 Total de servicios disponibles:', servicesResult.data.length);
      
      // Buscar servicios de seguidores Instagram económicos
      const instagramServices = servicesResult.data
        .filter(service => {
          const category = service.category.toLowerCase();
          const name = service.name.toLowerCase();
          return (category.includes('instagram') && 
                  (name.includes('followers') || name.includes('seguidores'))) &&
                 parseFloat(service.rate) <= 5.0; // Solo servicios de $5 o menos por 1000
        })
        .sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate)) // Ordenar por precio
        .slice(0, 5); // Mostrar los 5 más baratos
      
      if (instagramServices.length > 0) {
        console.log('\n📱 Servicios de Instagram disponibles (primeros 3):');
        instagramServices.forEach((service, index) => {
          console.log(`   ${index + 1}. ${service.name}`);
          console.log(`      - ID: ${service.service}`);
          console.log(`      - Precio: $${service.rate} por 1000`);
          console.log(`      - Min: ${service.min}, Max: ${service.max}`);
          console.log(`      - Categoría: ${service.category}`);
          console.log('');
        });

        // 3. Probar creación de orden con un servicio real (solo si hay servicios disponibles)
        if (instagramServices.length > 0) {
          console.log('3️⃣ Probando creación de orden de prueba...');
          const testService = instagramServices[0];
          
          // Calcular costo para 20 seguidores
          const quantity = Math.max(20, parseInt(testService.min) || 20);
          const costPer1000 = parseFloat(testService.rate);
          const totalCost = (quantity / 1000) * costPer1000;
          
          console.log(`💰 Costo estimado: $${totalCost.toFixed(4)} para ${quantity} seguidores`);
          
          if (totalCost > 4.50) { // Dejar margen de seguridad
            console.log('⚠️ Servicio demasiado caro, buscando alternativa...');
            return;
          }
          
          // Usar datos reales de francodemartos
          const testOrderData = {
            serviceId: testService.service,
            link: 'https://instagram.com/francodemartos', // Cuenta real
            quantity: quantity
          };

          console.log('📦 Datos de la orden de prueba:');
          console.log(`   - Servicio: ${testService.name}`);
          console.log(`   - Cantidad: ${testOrderData.quantity}`);
          console.log(`   - Link: ${testOrderData.link}`);
          
          const orderResult = await smmAPI.createOrder(testOrderData);
          
          if (orderResult.success) {
            console.log('✅ Orden de prueba creada exitosamente');
            console.log('🆔 ID de orden externa:', orderResult.data.order);
            
            // 4. Probar obtención de estado de la orden
            console.log('\n4️⃣ Probando estado de la orden...');
            const statusResult = await smmAPI.getOrderStatus(orderResult.data.order);
            
            if (statusResult.success) {
              console.log('✅ Estado de orden obtenido exitosamente');
              console.log('📊 Estado:', statusResult.data);
            } else {
              console.log('❌ Error obteniendo estado:', statusResult.error);
            }
          } else {
            console.log('❌ Error creando orden de prueba:', orderResult.error);
          }
        }
      } else {
        console.log('⚠️ No se encontraron servicios de Instagram');
      }
    } else {
      console.log('❌ Error obteniendo servicios:', servicesResult.error);
    }

    console.log('\n🎉 Pruebas de SMM API completadas');

  } catch (error) {
    console.error('\n💥 Error general en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testSMMAPI();
