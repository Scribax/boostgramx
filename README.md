# 🚀 BoostGramX - SMM Panel

Plataforma profesional para la venta de servicios de crecimiento en Instagram (seguidores, likes, visualizaciones).

## 🌐 Live Demo

🔗 **Website**: [https://boostgramx.com](https://boostgramx.com)
🔗 **API**: [Backend URL será actualizada después del deploy]

## 🏗️ Arquitectura

```
📁 boostgramx/
├── 📁 client/          # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 pages/   # Todas las páginas
│   │   ├── 📁 components/
│   │   ├── 📁 context/
│   │   └── 📁 services/
│   └── 📁 build/       # Build de producción
├── 📁 server/          # Backend Node.js
│   ├── 📁 routes/      # API endpoints
│   ├── 📁 models/      # Modelos MongoDB
│   ├── 📁 middleware/
│   └── 📁 services/
└── 📁 docs/           # Documentación completa
```

## 🛠️ Tecnologías

### Frontend
- ⚛️ React 19.1.0
- 🎨 Framer Motion (animaciones)
- 🎯 React Router DOM
- 📱 Responsive Design
- 🎪 React Icons

### Backend
- 🟢 Node.js + Express
- 🗄️ MongoDB + Mongoose
- 🔐 JWT Authentication
- 💳 MercadoPago Integration
- 🔒 Security (Helmet, CORS, Rate Limiting)

## 🚀 Instalación Local

### 1. Clonar repositorio
```bash
git clone https://github.com/Scribax/boostgramx.git
cd boostgramx
```

### 2. Instalar dependencias
```bash
# Instalar todas las dependencias
npm run install-all

# O instalar por separado
npm run install-client
npm run install-server
```

### 3. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp server/.env.example server/.env

# Editar con tus credenciales
```

### 4. Ejecutar en desarrollo
```bash
# Ejecutar frontend y backend
npm run dev

# O ejecutar por separado
npm run client  # Frontend en puerto 3000
npm run server  # Backend en puerto 5000
```

## 📦 Deploy

### Frontend (IONOS)
```bash
cd client
npm run build
# Subir carpeta 'build' a IONOS hosting
```

### Backend (Railway)
1. Conectar repositorio a Railway
2. Configurar variables de entorno
3. Deploy automático

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo completo
npm run client       # Solo frontend
npm run server       # Solo backend
npm run build        # Build de producción
npm run install-all  # Instalar todas las dependencias
```

## 📱 Características

### ✅ Completamente Funcional
- 🏠 Homepage con 8 secciones profesionales
- 🔐 Sistema de autenticación JWT
- 📊 Dashboard de usuario
- 🛒 Proceso de checkout completo
- 💳 Integración con MercadoPago
- 📱 Diseño 100% responsive
- ⚡ Animaciones fluidas

### 🎯 Páginas Implementadas
- **HomePage**: Landing page completa
- **Login/Register**: Autenticación
- **Dashboard**: Panel de usuario
- **Checkout**: Proceso de pago
- **Success/Failure/Pending**: Resultados de pago
- **Profile**: Gestión de perfil
- **My Orders**: Historial de órdenes

## 🔒 Seguridad

- 🛡️ JWT Authentication
- 🔐 Bcrypt para passwords
- 🚫 Rate limiting
- 🔒 CORS configurado
- 🛡️ Helmet para headers de seguridad

## 💳 Pagos

- ✅ MercadoPago integrado
- 💰 Soporte para ARS
- 🔄 Webhooks configurados
- 📊 Tracking de estados

## 📊 Base de Datos

### Modelos implementados:
- **User**: Usuarios del sistema
- **Service**: Servicios/productos
- **Order**: Órdenes de compra
- **Payment**: Transacciones

## 🐛 Solución de Problemas

### Problema común: Redirección MercadoPago
- ✅ **Solucionado**: URLs de redirección configuradas para producción

### Variables de entorno faltantes
```bash
# Verificar archivo .env en server/
cp server/.env.example server/.env
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado y propietario.

## 👨‍💻 Autor

**Franco Demartos** - [GitHub](https://github.com/Scribax)

---

⭐ Si te gusta el proyecto, ¡dale una estrella!

**Última actualización**: Enero 2025
