const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { optionalAuth } = require('../middleware/auth');
const smmService = require('../services/smmService');

// GET /api/services - Obtener todos los servicios
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, platform, search, page = 1, limit = 20 } = req.query;
    
    // Construir filtros
    const filters = { isActive: true };
    
    if (category) {
      filters.category = category;
    }
    
    if (platform) {
      filters.platform = platform;
    }
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calcular paginación
    const skip = (page - 1) * limit;
    
    // Obtener servicios
    const services = await Service.find(filters)
      .sort({ popularityScore: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Service.countDocuments(filters);
    
    res.json({
      success: true,
      data: {
        services,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener servicios'
    });
  }
});

// GET /api/services/categories - Obtener categorías disponibles
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener categorías'
    });
  }
});

// GET /api/services/platforms - Obtener plataformas disponibles
router.get('/platforms', async (req, res) => {
  try {
    const platforms = await Service.distinct('platform', { isActive: true });
    
    res.json({
      success: true,
      data: platforms
    });

  } catch (error) {
    console.error('Error obteniendo plataformas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener plataformas'
    });
  }
});

// GET /api/services/:id - Obtener un servicio específico
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        error: 'Servicio no encontrado',
        message: 'El servicio solicitado no existe'
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        error: 'Servicio no disponible',
        message: 'Este servicio no está disponible actualmente'
      });
    }

    res.json({
      success: true,
      data: service
    });

  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el servicio'
    });
  }
});

// GET /api/services/sync/smm - Sincronizar servicios con SMM Panel (solo para desarrollo)
router.get('/sync/smm', async (req, res) => {
  try {
    // Obtener servicios del SMM Panel
    const smmResult = await smmService.getServices();
    
    if (!smmResult.success) {
      return res.status(500).json({
        error: 'Error del SMM Panel',
        message: smmResult.error
      });
    }

    let syncedCount = 0;
    let errorCount = 0;

    // Procesar cada servicio del SMM Panel
    for (const smmSvc of smmResult.services) {
      try {
        // Verificar si el servicio ya existe
        let service = await Service.findOne({ apiServiceId: smmSvc.id });
        
        // Mapear categoría y plataforma basado en el nombre del servicio
        const { category, platform, type } = mapServiceCategory(smmSvc.name, smmSvc.category);
        
        const serviceData = {
          serviceId: `SVC-${smmSvc.id}`,
          name: smmSvc.name,
          description: smmSvc.description || smmSvc.name,
          category,
          platform,
          type,
          price: smmSvc.rate * 1.5, // Margen de ganancia del 50%
          minOrder: smmSvc.min,
          maxOrder: smmSvc.max,
          apiServiceId: smmSvc.id,
          isActive: true
        };

        if (service) {
          // Actualizar servicio existente
          await Service.findByIdAndUpdate(service._id, serviceData);
        } else {
          // Crear nuevo servicio
          service = new Service(serviceData);
          await service.save();
        }
        
        syncedCount++;
      } catch (error) {
        console.error(`Error sincronizando servicio ${smmSvc.id}:`, error);
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Sincronización completada: ${syncedCount} servicios sincronizados, ${errorCount} errores`
    });

  } catch (error) {
    console.error('Error sincronizando servicios:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al sincronizar servicios'
    });
  }
});

// Función auxiliar para mapear categorías
function mapServiceCategory(serviceName, smmCategory) {
  const name = serviceName.toLowerCase();
  
  let platform = 'Instagram'; // Por defecto Instagram
  let category = 'Instagram Followers';
  let type = 'followers';

  // Detectar plataforma
  if (name.includes('tiktok') || name.includes('tik tok')) {
    platform = 'TikTok';
  } else if (name.includes('youtube') || name.includes('yt')) {
    platform = 'YouTube';
  } else if (name.includes('facebook') || name.includes('fb')) {
    platform = 'Facebook';
  } else if (name.includes('twitter') || name.includes('x ')) {
    platform = 'Twitter';
  }

  // Detectar tipo de servicio
  if (name.includes('like') || name.includes('heart')) {
    type = 'likes';
    category = `${platform} Likes`;
  } else if (name.includes('view') || name.includes('watch')) {
    type = 'views';
    category = `${platform} Views`;
  } else if (name.includes('comment')) {
    type = 'comments';
    category = `${platform} Comments`;
  } else if (name.includes('subscriber') || name.includes('sub')) {
    type = 'subscribers';
    category = `${platform} Subscribers`;
  } else if (name.includes('story') || name.includes('stories')) {
    type = 'stories';
    category = `${platform} Stories`;
  } else if (name.includes('follower') || name.includes('follow')) {
    type = 'followers';
    category = `${platform} Followers`;
  }

  return { category, platform, type };
}

module.exports = router;
