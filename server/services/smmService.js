const axios = require('axios');

class SMMService {
  constructor() {
    this.apiUrl = 'https://smmhype.com/api/v2';
    this.apiKey = '398de670cbff5607141a8ef29dd7021b';
    
    if (!this.apiUrl || !this.apiKey) {
      console.error('❌ SMM API URL o API Key no configurados');
    }
  }

  // Método base para hacer peticiones a la API
  async makeRequest(action, data = {}) {
    try {
      const payload = {
        key: this.apiKey,
        action: action,
        ...data
      };

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SMM-Panel-Store/1.0'
        },
        timeout: 30000 // 30 segundos timeout
      });

      return response.data;
    } catch (error) {
      console.error(`Error en petición SMM API [${action}]:`, error.message);
      throw new Error(`Error en API del SMM Panel: ${error.message}`);
    }
  }

  // Obtener balance de la cuenta
  async getBalance() {
    try {
      const response = await this.makeRequest('balance');
      return {
        success: true,
        balance: parseFloat(response.balance) || 0,
        currency: response.currency || 'USD'
      };
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener lista de servicios
  async getServices() {
    try {
      const response = await this.makeRequest('services');
      
      if (Array.isArray(response)) {
        return {
          success: true,
          services: response.map(service => ({
            id: service.service,
            name: service.name,
            type: service.type,
            category: service.category,
            rate: parseFloat(service.rate),
            min: parseInt(service.min),
            max: parseInt(service.max),
            description: service.description || '',
            dripfeed: service.dripfeed === '1',
            refill: service.refill === '1'
          }))
        };
      } else {
        throw new Error('Respuesta inválida de la API');
      }
    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Crear una nueva orden
  async createOrder(serviceId, link, quantity, runs = null, interval = null) {
    try {
      const orderData = {
        service: serviceId,
        link: link,
        quantity: quantity
      };

      // Si es un pedido con dripfeed
      if (runs && interval) {
        orderData.runs = runs;
        orderData.interval = interval;
      }

      const response = await this.makeRequest('add', orderData);
      
      if (response.order) {
        return {
          success: true,
          orderId: response.order,
          message: 'Orden creada exitosamente'
        };
      } else {
        throw new Error(response.error || 'Error desconocido al crear orden');
      }
    } catch (error) {
      console.error('Error creando orden:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estado de una orden
  async getOrderStatus(orderId) {
    try {
      const response = await this.makeRequest('status', { order: orderId });
      
      if (response.status !== undefined) {
        return {
          success: true,
          status: response.status,
          charge: parseFloat(response.charge) || 0,
          startCount: parseInt(response.start_count) || 0,
          remains: parseInt(response.remains) || 0,
          currency: response.currency || 'USD'
        };
      } else {
        throw new Error('Respuesta inválida de la API');
      }
    } catch (error) {
      console.error('Error obteniendo estado de orden:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener múltiples estados de órdenes
  async getMultipleOrderStatus(orderIds) {
    try {
      const orderIdsString = orderIds.join(',');
      const response = await this.makeRequest('status', { orders: orderIdsString });
      
      if (typeof response === 'object') {
        return {
          success: true,
          orders: response
        };
      } else {
        throw new Error('Respuesta inválida de la API');
      }
    } catch (error) {
      console.error('Error obteniendo estados múltiples:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancelar una orden
  async cancelOrder(orderId) {
    try {
      const response = await this.makeRequest('cancel', { order: orderId });
      
      if (response.success || response.status === 'Canceled') {
        return {
          success: true,
          message: 'Orden cancelada exitosamente'
        };
      } else {
        throw new Error(response.error || 'No se pudo cancelar la orden');
      }
    } catch (error) {
      console.error('Error cancelando orden:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Recargar una orden (refill)
  async refillOrder(orderId) {
    try {
      const response = await this.makeRequest('refill', { order: orderId });
      
      if (response.refill) {
        return {
          success: true,
          refillId: response.refill,
          message: 'Recarga solicitada exitosamente'
        };
      } else {
        throw new Error(response.error || 'No se pudo solicitar la recarga');
      }
    } catch (error) {
      console.error('Error en recarga:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estado de recarga
  async getRefillStatus(refillId) {
    try {
      const response = await this.makeRequest('refill_status', { refill: refillId });
      
      if (response.status !== undefined) {
        return {
          success: true,
          status: response.status
        };
      } else {
        throw new Error('Respuesta inválida de la API');
      }
    } catch (error) {
      console.error('Error obteniendo estado de recarga:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verificar conexión con la API
  async testConnection() {
    try {
      const balanceResult = await this.getBalance();
      return balanceResult.success;
    } catch (error) {
      console.error('Error verificando conexión:', error);
      return false;
    }
  }
}

module.exports = new SMMService();
