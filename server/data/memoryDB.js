// Base de datos en memoria para desarrollo y demostración
const { sampleServices } = require('../seedDatabase');

class MemoryDB {
  constructor() {
    this.users = [];
    this.services = [...sampleServices];
    this.orders = [];
    this.nextUserId = 1;
    this.nextOrderId = 1;
  }

  // USERS
  async createUser(userData) {
    const user = {
      _id: this.nextUserId++,
      ...userData,
      balance: 0,
      totalSpent: 0,
      isActive: true,
      isVerified: false,
      role: 'user',
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(user);
    return user;
  }

  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserById(id) {
    return this.users.find(user => user._id == id);
  }

  async getUserById(id) {
    return this.users.find(user => user._id == id);
  }

  async updateUser(id, updates) {
    const userIndex = this.users.findIndex(user => user._id == id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates, updatedAt: new Date() };
      return this.users[userIndex];
    }
    return null;
  }

  // SERVICES
  async findServices(filters = {}, options = {}) {
    let results = [...this.services];
    
    // Aplicar filtros
    if (filters.isActive !== undefined) {
      results = results.filter(service => service.isActive === filters.isActive);
    }
    
    if (filters.category) {
      results = results.filter(service => service.category === filters.category);
    }
    
    if (filters.platform) {
      results = results.filter(service => service.platform === filters.platform);
    }
    
    if (filters.$or) {
      const searchTerms = filters.$or;
      results = results.filter(service => {
        return searchTerms.some(term => {
          if (term.name && term.name.$regex) {
            return service.name.toLowerCase().includes(term.name.$regex.toLowerCase());
          }
          if (term.description && term.description.$regex) {
            return service.description.toLowerCase().includes(term.description.$regex.toLowerCase());
          }
          return false;
        });
      });
    }
    
    // Aplicar ordenamiento
    if (options.sort) {
      if (options.sort.popularityScore === -1) {
        results.sort((a, b) => b.popularityScore - a.popularityScore);
      }
    }
    
    // Aplicar paginación
    const skip = options.skip || 0;
    const limit = options.limit || results.length;
    
    return results.slice(skip, skip + limit);
  }

  async countServices(filters = {}) {
    const results = await this.findServices(filters);
    return results.length;
  }

  async findServiceById(id) {
    return this.services.find(service => service.serviceId === id || service._id === id);
  }

  async getDistinctCategories() {
    const categories = [...new Set(this.services
      .filter(service => service.isActive)
      .map(service => service.category)
    )];
    return categories;
  }

  async getDistinctPlatforms() {
    const platforms = [...new Set(this.services
      .filter(service => service.isActive)
      .map(service => service.platform)
    )];
    return platforms;
  }

  // ORDERS
  async createOrder(orderData) {
    const order = {
      _id: this.nextOrderId++,
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
      ...orderData,
      status: 'pending',
      paymentStatus: 'pending',
      delivered: 0,
      remains: orderData.quantity,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.orders.push(order);
    return order;
  }

  async findOrdersByUser(userId, options = {}) {
    let results = this.orders.filter(order => order.user == userId);
    
    // Aplicar ordenamiento por fecha de creación descendente
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Aplicar paginación
    const skip = options.skip || 0;
    const limit = options.limit || results.length;
    
    return results.slice(skip, skip + limit);
  }

  async countOrdersByUser(userId) {
    return this.orders.filter(order => order.user == userId).length;
  }

  async findOrderById(id) {
    return this.orders.find(order => order._id == id || order.orderId === id);
  }

  async updateOrder(id, updates) {
    const orderIndex = this.orders.findIndex(order => order._id == id || order.orderId === id);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = { ...this.orders[orderIndex], ...updates, updatedAt: new Date() };
      return this.orders[orderIndex];
    }
    return null;
  }

  // UTILIDADES
  async reset() {
    this.users = [];
    this.services = [...sampleServices];
    this.orders = [];
    this.nextUserId = 1;
    this.nextOrderId = 1;
  }

  getStats() {
    return {
      users: this.users.length,
      services: this.services.length,
      orders: this.orders.length,
      activeServices: this.services.filter(s => s.isActive).length
    };
  }
}

// Instancia global
const memoryDB = new MemoryDB();

module.exports = memoryDB;
