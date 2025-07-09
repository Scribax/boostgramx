const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

// Servicios de ejemplo basados en la documentación
const sampleServices = [
  // Instagram Followers
  {
    serviceId: 'SVC-001',
    name: '1000 Seguidores Instagram Reales',
    description: 'Perfiles auténticos y activos que incrementarán tu engagement',
    category: 'Instagram Followers',
    platform: 'Instagram',
    type: 'followers',
    price: 15,
    minOrder: 100,
    maxOrder: 1000,
    isActive: true,
    quality: 'Premium',
    speed: 'Medium',
    guarantee: '30 Days',
    features: ['Perfiles reales', 'Entrega gradual', 'Sin riesgo de ban'],
    apiServiceId: '14350',
    popularityScore: 95
  },
  {
    serviceId: 'SVC-002',
    name: '2500 Seguidores Instagram Premium',
    description: 'Seguidores de alta calidad con perfiles completos',
    category: 'Instagram Followers',
    platform: 'Instagram',
    type: 'followers',
    price: 35,
    minOrder: 500,
    maxOrder: 2500,
    isActive: true,
    quality: 'Premium',
    speed: 'Medium',
    guarantee: '90 Days',
    features: ['Perfiles verificados', 'Actividad real', 'Retención garantizada'],
    apiServiceId: '14350',
    popularityScore: 90
  },
  {
    serviceId: 'SVC-003',
    name: '5000 Seguidores Instagram Elite',
    description: 'El paquete más popular para crecimiento acelerado',
    category: 'Instagram Followers',
    platform: 'Instagram',
    type: 'followers',
    price: 65,
    minOrder: 1000,
    maxOrder: 5000,
    isActive: true,
    quality: 'Premium',
    speed: 'Fast',
    guarantee: '180 Days',
    features: ['Máxima calidad', 'Entrega en 3-5 días', 'Soporte premium'],
    apiServiceId: '14350',
    popularityScore: 100
  },
  {
    serviceId: 'SVC-004',
    name: '10000 Seguidores Instagram VIP',
    description: 'Para influencers que buscan el siguiente nivel',
    category: 'Instagram Followers',
    platform: 'Instagram',
    type: 'followers',
    price: 120,
    minOrder: 2000,
    maxOrder: 10000,
    isActive: true,
    quality: 'Premium',
    speed: 'Medium',
    guarantee: '365 Days',
    features: ['Perfiles elite', 'Crecimiento orgánico', 'Garantía total'],
    apiServiceId: '14350',
    popularityScore: 88
  },

  // Instagram Likes
  {
    serviceId: 'SVC-005',
    name: '500 Likes Instagram Instantáneos',
    description: 'Forma rápida y natural de aumentar tu engagement',
    category: 'Instagram Likes',
    platform: 'Instagram',
    type: 'likes',
    price: 5,
    minOrder: 50,
    maxOrder: 500,
    isActive: true,
    quality: 'High',
    speed: 'Instant',
    guarantee: '30 Days',
    features: ['Entrega inmediata', 'Perfiles activos', 'Sin caídas'],
    apiServiceId: 'smm_005',
    popularityScore: 85
  },
  {
    serviceId: 'SVC-006',
    name: '1000 Likes Instagram Premium',
    description: 'Likes de alta calidad para posts importantes',
    category: 'Instagram Likes',
    platform: 'Instagram',
    type: 'likes',
    price: 8,
    minOrder: 100,
    maxOrder: 1000,
    isActive: true,
    quality: 'Premium',
    speed: 'Fast',
    guarantee: '90 Days',
    features: ['Perfiles verificados', 'Entrega en horas', 'Reposición gratis'],
    apiServiceId: 'smm_006',
    popularityScore: 82
  },
  {
    serviceId: 'SVC-007',
    name: '2500 Likes Instagram Elite',
    description: 'Perfecto para posts virales y campañas',
    category: 'Instagram Likes',
    platform: 'Instagram',
    type: 'likes',
    price: 18,
    minOrder: 250,
    maxOrder: 2500,
    isActive: true,
    quality: 'Premium',
    speed: 'Medium',
    guarantee: '180 Days',
    features: ['Máxima calidad', 'Engagement real', 'Soporte 24/7'],
    apiServiceId: 'smm_007',
    popularityScore: 87
  },

  // Instagram Views
  {
    serviceId: 'SVC-008',
    name: '10K Visualizaciones Instagram',
    description: 'Para stories, reels y videos destacados',
    category: 'Instagram Views',
    platform: 'Instagram',
    type: 'views',
    price: 12,
    minOrder: 1000,
    maxOrder: 10000,
    isActive: true,
    quality: 'High',
    speed: 'Fast',
    guarantee: '30 Days',
    features: ['Vistas reales', 'Entrega rápida', 'Algoritmo amigable'],
    apiServiceId: 'smm_008',
    popularityScore: 80
  },
  {
    serviceId: 'SVC-009',
    name: '25K Visualizaciones Premium',
    description: 'Impulsa tus videos al siguiente nivel',
    category: 'Instagram Views',
    platform: 'Instagram',
    type: 'views',
    price: 25,
    minOrder: 5000,
    maxOrder: 25000,
    isActive: true,
    quality: 'Premium',
    speed: 'Medium',
    guarantee: '90 Days',
    features: ['Visualizaciones premium', 'Retención alta', 'Sin drops'],
    apiServiceId: 'smm_009',
    popularityScore: 78
  },
  {
    serviceId: 'SVC-010',
    name: '50K Visualizaciones Elite',
    description: 'Para contenido de máxima calidad',
    category: 'Instagram Views',
    platform: 'Instagram',
    type: 'views',
    price: 45,
    minOrder: 10000,
    maxOrder: 50000,
    isActive: true,
    quality: 'Premium',
    speed: 'Medium',
    guarantee: '180 Days',
    features: ['Vistas elite', 'Algoritmo boost', 'Garantía completa'],
    apiServiceId: 'smm_010',
    popularityScore: 75
  }
];

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');

    // Limpiar servicios existentes
    await Service.deleteMany({});
    console.log('🗑️ Servicios existentes eliminados');

    // Insertar servicios de ejemplo
    await Service.insertMany(sampleServices);
    console.log(`✅ ${sampleServices.length} servicios de ejemplo creados`);

    console.log('\n📊 Servicios creados:');
    sampleServices.forEach(service => {
      console.log(`- ${service.name} ($${service.price})`);
    });

    mongoose.connection.close();
    console.log('\n🎉 Base de datos poblada exitosamente');
    
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleServices };
