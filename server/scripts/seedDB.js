require('dotenv').config();
const { connectDB } = require('../config/database');
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');

// Datos de servicios de prueba
const sampleServices = [
  {
    serviceId: 'IG_FOLLOWERS_1000',
    name: '1000 Seguidores Instagram',
    description: 'Seguidores reales y activos para tu perfil de Instagram. Entrega gradual en 24-48 horas.',
    category: 'Instagram Followers',
    platform: 'Instagram',
    type: 'followers',
    price: 15.99,
    minOrder: 100,
    maxOrder: 5000,
    quality: 'High',
    speed: 'Fast',
    guarantee: '90 Days',
    features: [
      'Seguidores reales y activos',
      'Entrega gradual y natural',
      'Garantía de 90 días',
      'Soporte 24/7'
    ],
    apiServiceId: 'api_service_001',
    popularityScore: 85
  },
  {
    serviceId: 'IG_FOLLOWERS_2500',
    name: '2500 Seguidores Instagram',
    description: 'Paquete premium de seguidores para crecimiento acelerado. Perfiles verificados y activos.',
    category: 'Instagram Followers',
    platform: 'Instagram',
    type: 'followers',
    price: 35.99,
    minOrder: 500,
    maxOrder: 10000,
    quality: 'Premium',
    speed: 'Fast',
    guarantee: '180 Days',
    features: [
      'Seguidores premium verificados',
      'Perfiles con foto y biografía',
      'Interacción natural',
      'Garantía extendida de 180 días'
    ],
    apiServiceId: 'api_service_002',
    popularityScore: 95
  },
  {
    serviceId: 'IG_LIKES_500',
    name: '500 Likes Instagram',
    description: 'Likes instantáneos para tus publicaciones. Aumento inmediato de engagement.',
    category: 'Instagram Likes',
    platform: 'Instagram',
    type: 'likes',
    price: 5.99,
    minOrder: 50,
    maxOrder: 2000,
    quality: 'High',
    speed: 'Instant',
    guarantee: '30 Days',
    features: [
      'Entrega instantánea',
      'Likes de cuentas reales',
      'Aumento natural del engagement',
      'Compatible con cualquier publicación'
    ],
    apiServiceId: 'api_service_003',
    popularityScore: 75
  },
  {
    serviceId: 'IG_LIKES_1000',
    name: '1000 Likes Instagram',
    description: 'Paquete de likes para maximizar el alcance de tus publicaciones más importantes.',
    category: 'Instagram Likes',
    platform: 'Instagram',
    type: 'likes',
    price: 9.99,
    minOrder: 100,
    maxOrder: 5000,
    quality: 'High',
    speed: 'Fast',
    guarantee: '90 Days',
    features: [
      'Likes de alta calidad',
      'Entrega en 1-6 horas',
      'Mejora el algoritmo de Instagram',
      'Garantía de permanencia'
    ],
    apiServiceId: 'api_service_004',
    popularityScore: 80
  },
  {
    serviceId: 'IG_VIEWS_10K',
    name: '10,000 Visualizaciones Instagram',
    description: 'Visualizaciones para Stories, Reels y videos. Aumento significativo de alcance.',
    category: 'Instagram Views',
    platform: 'Instagram',
    type: 'views',
    price: 12.99,
    minOrder: 1000,
    maxOrder: 50000,
    quality: 'High',
    speed: 'Fast',
    guarantee: '30 Days',
    features: [
      'Compatible con Stories y Reels',
      'Visualizaciones de cuentas reales',
      'Mejora el alcance orgánico',
      'Entrega rápida en 6-12 horas'
    ],
    apiServiceId: 'api_service_005',
    popularityScore: 70
  },
  {
    serviceId: 'IG_VIEWS_25K',
    name: '25,000 Visualizaciones Instagram',
    description: 'Paquete premium de visualizaciones para contenido viral. Ideal para influencers.',
    category: 'Instagram Views',
    platform: 'Instagram',
    type: 'views',
    price: 25.99,
    minOrder: 5000,
    maxOrder: 100000,
    quality: 'Premium',
    speed: 'Fast',
    guarantee: '90 Days',
    features: [
      'Visualizaciones premium',
      'Ideal para contenido viral',
      'Aumento masivo de alcance',
      'Soporte prioritario'
    ],
    apiServiceId: 'api_service_006',
    popularityScore: 90
  }
];

// Usuario de prueba
const sampleUser = {
  email: 'demo@smmstore.com',
  password: 'demo123456',
  name: 'Usuario Demo',
  role: 'user',
  isVerified: true,
  balance: 100.00
};

// Usuario admin de prueba
const adminUser = {
  email: 'admin@smmstore.com',
  password: 'admin123456',
  name: 'Administrador',
  role: 'admin',
  isVerified: true,
  balance: 1000.00
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando proceso de población de la base de datos...');
    
    // Conectar a la base de datos
    await connectDB();

    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Order.deleteMany({})
    ]);

    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    const demoUser = await User.create(sampleUser);
    const admin = await User.create(adminUser);
    console.log(`✅ Usuario demo creado: ${demoUser.email}`);
    console.log(`✅ Usuario admin creado: ${admin.email}`);

    // Crear servicios
    console.log('🛍️ Creando servicios...');
    const services = await Service.insertMany(sampleServices);
    console.log(`✅ ${services.length} servicios creados exitosamente`);

    // Crear algunas órdenes de ejemplo
    console.log('📦 Creando órdenes de ejemplo...');
    const sampleOrders = [
      {
        orderId: Order.generateOrderId(),
        user: demoUser._id,
        service: services[0]._id,
        targetUrl: 'https://instagram.com/demo_account',
        quantity: 1000,
        price: services[0].price,
        totalAmount: services[0].price,
        status: 'completed',
        paymentMethod: 'mercadopago',
        paymentStatus: 'approved',
        delivered: 1000,
        completedAt: new Date()
      },
      {
        orderId: Order.generateOrderId(),
        user: demoUser._id,
        service: services[2]._id,
        targetUrl: 'https://instagram.com/p/example123',
        quantity: 500,
        price: services[2].price,
        totalAmount: services[2].price,
        status: 'in_progress',
        paymentMethod: 'mercadopago',
        paymentStatus: 'approved',
        delivered: 250,
        remains: 250
      }
    ];

    const orders = await Order.insertMany(sampleOrders);
    console.log(`✅ ${orders.length} órdenes de ejemplo creadas`);

    // Actualizar estadísticas de servicios
    console.log('📊 Actualizando estadísticas...');
    await Service.findByIdAndUpdate(services[0]._id, { 
      $inc: { totalOrders: 1 }
    });
    await Service.findByIdAndUpdate(services[2]._id, { 
      $inc: { totalOrders: 1 }
    });

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   👥 Usuarios: 2 (1 demo, 1 admin)`);
    console.log(`   🛍️ Servicios: ${services.length}`);
    console.log(`   📦 Órdenes: ${orders.length}`);
    console.log('\n🔑 Credenciales de prueba:');
    console.log(`   Demo: ${sampleUser.email} / ${sampleUser.password}`);
    console.log(`   Admin: ${adminUser.email} / ${adminUser.password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
