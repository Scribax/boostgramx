# 🚀 SMMStore - Plataforma de Venta de Seguidores

<div align="center">
  <h3>💫 Plataforma moderna para el crecimiento de redes sociales</h3>
  <p>Una aplicación web completa para la venta de servicios de crecimiento en Instagram: seguidores, likes, visualizaciones y más.</p>
  
  ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Status](https://img.shields.io/badge/Status-En%20Desarrollo-orange?style=for-the-badge)
</div>

## 📖 Descripción

SMMStore es una plataforma web moderna desarrollada con React para la venta de servicios de crecimiento de redes sociales. Permite a los usuarios comprar seguidores, likes, visualizaciones y otros servicios de engagement para Instagram de manera segura y eficiente.

## ✨ Características Principales

### 🎯 Funcionalidades Core
- **Página de Inicio Atractiva**: Landing page con animaciones y testimonios
- **Sistema de Autenticación**: Login y registro con gestión de cookies
- **Dashboard de Usuario**: Panel personalizado con estadísticas y gestión de órdenes
- **Catálogo de Servicios**: Múltiples servicios de crecimiento social
- **Sistema de Órdenes**: Gestión completa del ciclo de vida de las órdenes
- **Perfil de Usuario**: Gestión de información personal y configuraciones
- **Historial de Órdenes**: Seguimiento detallado de todas las compras

### 🛡️ Seguridad y Autenticación
- Autenticación JWT con cookies seguras
- Protección de rutas privadas
- Interceptors para manejo de tokens
- Manejo de sesiones expiradas

### 🎨 Experiencia de Usuario
- Diseño responsive y moderno
- Animaciones fluidas con Framer Motion
- Notificaciones toast para feedback inmediato
- Interfaz intuitiva y amigable

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ServiceModal.js  # Modal para servicios
│   └── ServiceModal.css
├── pages/              # Páginas principales
│   ├── HomePage.js     # Página de inicio
│   ├── LoginPage.js    # Página de login
│   ├── RegisterPage.js # Página de registro
│   ├── Dashboard.js    # Panel de usuario
│   ├── CheckoutPage.js # Página de checkout
│   ├── MyOrders.js     # Historial de órdenes
│   └── Profile.js      # Perfil de usuario
├── context/            # Contextos de React
│   └── AuthContext.js  # Contexto de autenticación
├── services/           # Servicios y APIs
│   └── api.js         # Configuración de axios y servicios
├── styles/            # Estilos CSS
│   ├── HomePage.css
│   ├── AuthPage.css
│   └── Dashboard.css
└── utils/             # Utilidades y helpers
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📦 Dependencias Principales

### Core
- **React**: ^19.1.0 - Framework principal
- **React DOM**: ^19.1.0 - Renderizado del DOM
- **React Router DOM**: ^6.14.0 - Enrutamiento

### UI y Animaciones
- **Framer Motion**: ^10.12.16 - Animaciones y transiciones
- **React Icons**: ^4.10.1 - Iconos
- **React Hot Toast**: ^2.4.1 - Notificaciones

### HTTP y Estado
- **Axios**: ^1.4.0 - Cliente HTTP
- **js-cookie**: ^3.0.5 - Gestión de cookies

### Testing
- **@testing-library/react**: ^16.3.0
- **@testing-library/jest-dom**: ^6.6.3
- **@testing-library/user-event**: ^13.5.0

## 🎮 Scripts Disponibles

```bash
# Desarrollo
npm start          # Ejecuta la app en modo desarrollo
npm test           # Ejecuta las pruebas
npm run build      # Construye la app para producción
npm run eject      # Expone la configuración (irreversible)
```

## 🔧 Configuración de API

La aplicación se conecta a una API backend que debe estar ejecutándose en `http://localhost:5000` por defecto. Los servicios incluyen:

- **Autenticación**: Login, registro, verificación de email
- **Servicios**: Catálogo de servicios SMM
- **Órdenes**: Creación y gestión de órdenes
- **Pagos**: Procesamiento de pagos y balance

## 🌟 Páginas y Componentes

### Páginas Principales
1. **HomePage**: Landing page con hero section, features, testimonios
2. **LoginPage**: Autenticación de usuarios
3. **RegisterPage**: Registro de nuevos usuarios
4. **Dashboard**: Panel principal del usuario
5. **CheckoutPage**: Proceso de compra
6. **MyOrders**: Historial de órdenes
7. **Profile**: Gestión de perfil

### Componentes
- **ServiceModal**: Modal para mostrar detalles de servicios
- **AuthContext**: Contexto para gestión de autenticación

## 🎯 Estado del Proyecto

### ✅ Completado
- [x] Configuración inicial del proyecto
- [x] Sistema de autenticación completo
- [x] Página de inicio con animaciones
- [x] Dashboard de usuario
- [x] Sistema de órdenes
- [x] Integración con API
- [x] Gestión de estado global
- [x] Diseño responsive

### 🚧 En Desarrollo
- [ ] Integración de métodos de pago
- [ ] Sistema de notificaciones avanzado
- [ ] Panel de administración
- [ ] Optimizaciones de rendimiento

### 📋 Próximas Funcionalidades
- [ ] Sistema de referidos
- [ ] Soporte para múltiples redes sociales
- [ ] Chat en vivo
- [ ] Análisis y reportes

## 🔒 Seguridad

- Autenticación JWT con cookies seguras
- Validación de formularios
- Protección contra XSS
- Manejo seguro de tokens
- Interceptors para manejo de errores

## 📱 Responsive Design

La aplicación está totalmente optimizada para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🚀 Deployment

### Build de Producción
```bash
npm run build
```

Esto creará una carpeta `build` con los archivos optimizados para producción.

### Variables de Entorno para Producción
```bash
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollador Frontend**: React, UI/UX
- **Desarrollador Backend**: Node.js, API REST
- **Diseñador**: UI/UX, Branding

## 📞 Contacto

Para cualquier consulta o sugerencia:
- 📧 Email: contact@smmstore.com
- 🌐 Website: [https://smmstore.com](https://smmstore.com)
- 💬 Discord: [Servidor de Discord](https://discord.gg/smmstore)

---

<div align="center">
  <p>Hecho con ❤️ para la comunidad de creadores de contenido</p>
</div>
