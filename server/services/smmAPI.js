const axios = require('axios');

class SMMAPIService {
  constructor() {
    this.apiKey = process.env.SMM_API_KEY || '398de670cbff5607141a8ef29dd7021b';
    this.apiUrl = 'https://smmhype.com/api/v2';
    this.baseParams = {
      key: this.apiKey
    };
  }

  // Obtener lista de servicios disponibles
  async getServices() {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'services'
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo servicios SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Crear una nueva orden
  async createOrder(orderData) {
    try {
      const { serviceId, link, quantity, runs, interval } = orderData;
      
      const params = {
        ...this.baseParams,
        action: 'add',
        service: serviceId,
        link: link,
        quantity: quantity
      };

      // Agregar parámetros opcionales si están presentes
      if (runs) params.runs = runs;
      if (interval) params.interval = interval;

      const response = await axios.post(this.apiUrl, params);
      
      console.log('📋 Respuesta de SMM API:', JSON.stringify(response.data, null, 2));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creando orden SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estado de una orden
  async getOrderStatus(orderId) {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'status',
        order: orderId
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo estado de orden SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estado de múltiples órdenes
  async getMultipleOrdersStatus(orderIds) {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'status',
        orders: orderIds.join(',')
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo estado de órdenes múltiples SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Crear refill para una orden
  async createRefill(orderId) {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'refill',
        order: orderId
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creando refill SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Crear refill para múltiples órdenes
  async createMultipleRefill(orderIds) {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'refill',
        orders: orderIds.join(',')
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creando refill múltiple SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estado de refill
  async getRefillStatus(refillId) {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'refill_status',
        refill: refillId
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo estado de refill SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estado de múltiples refills
  async getMultipleRefillStatus(refillIds) {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'refill_status',
        refills: refillIds.join(',')
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo estado de refills múltiples SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancelar órdenes
  async cancelOrders(orderIds) {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'cancel',
        orders: orderIds.join(',')
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error cancelando órdenes SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener balance del usuario
  async getUserBalance() {
    try {
      const response = await axios.post(this.apiUrl, {
        ...this.baseParams,
        action: 'balance'
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo balance SMM:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Mapear servicios de SMM a nuestro formato
  mapSMMService(smmService) {
    return {
      serviceId: smmService.service,
      name: smmService.name,
      category: smmService.category,
      type: smmService.type,
      rate: parseFloat(smmService.rate),
      minOrder: parseInt(smmService.min),
      maxOrder: parseInt(smmService.max),
      refillEnabled: smmService.refill,
      cancelEnabled: smmService.cancel,
      price: parseFloat(smmService.rate), // Precio por 1000 unidades
      isActive: true,
      platform: this.getPlatformFromCategory(smmService.category),
      description: `${smmService.name} - ${smmService.category}`,
      estimatedDelivery: this.getEstimatedDelivery(smmService.category)
    };
  }

  // Determinar plataforma basada en categoría
  getPlatformFromCategory(category) {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('instagram')) return 'Instagram';
    if (lowerCategory.includes('facebook')) return 'Facebook';
    if (lowerCategory.includes('youtube')) return 'YouTube';
    if (lowerCategory.includes('tiktok')) return 'TikTok';
    if (lowerCategory.includes('twitter')) return 'Twitter';
    return 'Social Media';
  }

  // Obtener tiempo estimado de entrega
  getEstimatedDelivery(category) {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('followers')) return '24-72 hours';
    if (lowerCategory.includes('likes')) return '1-24 hours';
    if (lowerCategory.includes('views')) return '6-48 hours';
    if (lowerCategory.includes('comments')) return '12-48 hours';
    return '24-48 hours';
  }

  // Mapear estado de orden de SMM a nuestro formato
  mapOrderStatus(smmStatus) {
    const statusMap = {
      'Pending': 'pending',
      'In progress': 'processing',
      'Completed': 'completed',
      'Partial': 'processing',
      'Processing': 'processing',
      'Canceled': 'cancelled',
      'Cancelled': 'cancelled'
    };

    return statusMap[smmStatus] || 'pending';
  }
}

module.exports = new SMMAPIService();
