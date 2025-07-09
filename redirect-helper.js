// Script para copiar y pegar en la consola del navegador cuando estés en MercadoPago
// Esto te ayudará a redirigir manualmente a tu página de éxito

(function() {
    // Verificar si estamos en MercadoPago
    if (window.location.hostname.includes('mercadopago.com')) {
        console.log('🎉 Detectado pago en MercadoPago');
        
        // Obtener el order ID guardado
        const orderId = localStorage.getItem('currentOrderId');
        
        if (orderId) {
            console.log('📋 Order ID encontrado:', orderId);
            
            // Crear botón para redirigir manualmente
            const button = document.createElement('button');
            button.innerHTML = '🎉 Ir a página de éxito';
            button.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                padding: 15px 25px;
                background: #00a650;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            
            button.onclick = function() {
                window.location.href = `http://localhost:3000/checkout/success?order=${orderId}`;
            };
            
            document.body.appendChild(button);
            
            console.log('✅ Botón de redirección agregado. Haz clic en él para ir a la página de éxito.');
            
            // Auto-redirigir después de 3 segundos
            setTimeout(() => {
                console.log('🔄 Redirigiendo automáticamente...');
                window.location.href = `http://localhost:3000/checkout/success?order=${orderId}`;
            }, 3000);
            
        } else {
            console.log('❌ No se encontró Order ID. Redirigiendo al dashboard...');
            setTimeout(() => {
                window.location.href = 'http://localhost:3000/dashboard';
            }, 2000);
        }
    } else {
        console.log('❌ No estás en MercadoPago');
    }
})();

// Instrucciones:
// 1. Copia todo este código
// 2. Ve a la página de MercadoPago donde dice "approved" o "congrats"
// 3. Abre DevTools (F12)
// 4. Ve a la pestaña Console
// 5. Pega este código y presiona Enter
// 6. Verás un botón verde en la esquina superior derecha
// 7. Haz clic en él o espera 3 segundos para redirección automática
