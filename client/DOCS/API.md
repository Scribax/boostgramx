# 📡 Documentación de API - SMMStore Client

## Configuración Base

La aplicación utiliza `axios` como cliente HTTP con la siguiente configuración:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Interceptors Configurados

#### Request Interceptor
- Añade automáticamente el token JWT a las headers
- Token obtenido desde las cookies

#### Response Interceptor
- Maneja errores globalmente
- Redirecciona al login en caso de token expirado (401)
- Muestra notificaciones toast para errores

## 🔐 Servicios de Autenticación

### `authService.register(userData)`
Registra un nuevo usuario en la plataforma.

**Parámetros:**
```javascript
{
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}
```

**Respuesta:**
```javascript
{
  success: boolean,
  user: Object,
  token: string,
  error?: string
}
```

### `authService.login(credentials)`
Inicia sesión de un usuario existente.

**Parámetros:**
```javascript
{
  email: string,
  password: string
}
```

**Respuesta:**
```javascript
{
  success: boolean,
  user: Object,
  token: string,
  error?: string
}
```

### `authService.logout()`
Cierra la sesión del usuario actual.
- Elimina token y datos de usuario de las cookies
- Redirecciona a la página principal

### `authService.getCurrentUser()`
Obtiene la información del usuario desde las cookies.

**Respuesta:**
```javascript
User | null
```

### `authService.isAuthenticated()`
Verifica si el usuario está autenticado.

**Respuesta:**
```javascript
boolean
```

### `authService.resetPassword(email)`
Envía un enlace de restablecimiento de contraseña.

**Parámetros:**
```javascript
{
  email: string
}
```

### `authService.verifyEmail(token)`
Verifica el email del usuario con un token.

**Parámetros:**
```javascript
{
  token: string
}
```

## 🛍️ Servicios de Servicios (SMM)

### `servicesService.getServices(filters)`
Obtiene la lista de servicios disponibles.

**Parámetros opcionales:**
```javascript
{
  category?: string,
  platform?: string,
  price_min?: number,
  price_max?: number
}
```

**Respuesta:**
```javascript
{
  success: boolean,
  data: Service[],
  error?: string
}
```

### `servicesService.getService(serviceId)`
Obtiene un servicio específico por ID.

**Parámetros:**
```javascript
serviceId: string
```

**Respuesta:**
```javascript
{
  success: boolean,
  data: Service,
  error?: string
}
```

## 📋 Servicios de Órdenes

### `ordersService.createOrder(orderData)`
Crea una nueva orden de servicio.

**Parámetros:**
```javascript
{
  service_id: string,
  quantity: number,
  target_url: string,
  notes?: string
}
```

**Respuesta:**
```javascript
{
  success: boolean,
  data: Order,
  error?: string
}
```

### `ordersService.getUserOrders(page, limit)`
Obtiene las órdenes del usuario con paginación.

**Parámetros:**
```javascript
page: number = 1,
limit: number = 10
```

**Respuesta:**
```javascript
{
  success: boolean,
  data: {
    orders: Order[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      pages: number
    }
  },
  error?: string
}
```

### `ordersService.getOrder(orderId)`
Obtiene una orden específica por ID.

**Parámetros:**
```javascript
orderId: string
```

**Respuesta:**
```javascript
{
  success: boolean,
  data: Order,
  error?: string
}
```

### `ordersService.getOrderStats()`
Obtiene estadísticas de órdenes del usuario.

**Respuesta:**
```javascript
{
  success: boolean,
  data: {
    total_orders: number,
    completed_orders: number,
    pending_orders: number,
    total_spent: number
  },
  error?: string
}
```

## 💳 Servicios de Pagos

### `paymentsService.addBalance(paymentData)`
Añade saldo a la cuenta del usuario.

**Parámetros:**
```javascript
{
  amount: number,
  payment_method: string,
  payment_details: Object
}
```

**Respuesta:**
```javascript
{
  success: boolean,
  data: Payment,
  error?: string
}
```

### `paymentsService.getPaymentHistory(page, limit)`
Obtiene el historial de pagos del usuario.

**Parámetros:**
```javascript
page: number = 1,
limit: number = 10
```

**Respuesta:**
```javascript
{
  success: boolean,
  data: {
    payments: Payment[],
    pagination: Object
  },
  error?: string
}
```

## 🔧 Tipos de Datos

### User
```javascript
{
  id: string,
  name: string,
  email: string,
  role: 'user' | 'admin',
  balance: number,
  created_at: string,
  updated_at: string
}
```

### Service
```javascript
{
  id: string,
  name: string,
  description: string,
  category: string,
  platform: string,
  price_per_1000: number,
  min_quantity: number,
  max_quantity: number,
  is_active: boolean
}
```

### Order
```javascript
{
  id: string,
  user_id: string,
  service_id: string,
  quantity: number,
  total_price: number,
  target_url: string,
  status: 'pending' | 'processing' | 'completed' | 'cancelled',
  notes?: string,
  created_at: string,
  updated_at: string
}
```

### Payment
```javascript
{
  id: string,
  user_id: string,
  amount: number,
  payment_method: string,
  status: 'pending' | 'completed' | 'failed',
  created_at: string
}
```

## 🚨 Manejo de Errores

Todos los servicios manejan errores de manera consistente:

1. **Errores de Red**: Timeout, conexión perdida
2. **Errores 401**: Token expirado - redirección automática al login
3. **Errores 403**: Sin permisos - notificación toast
4. **Errores 500+**: Error del servidor - notificación toast
5. **Errores de Validación**: Mensajes específicos del backend

### Ejemplo de Uso con Manejo de Errores

```javascript
const handleLogin = async (credentials) => {
  try {
    const result = await authService.login(credentials);
    
    if (result.success) {
      // Login exitoso
      navigate('/dashboard');
    } else {
      // Mostrar error específico
      setError(result.error);
    }
  } catch (error) {
    // Error inesperado ya manejado por interceptors
    console.error('Login error:', error);
  }
};
```

## 🔄 Estados de Loading

Los servicios no incluyen estados de loading internos. Cada componente debe manejar su propio estado de carga:

```javascript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    const result = await someService.someMethod();
    // Manejar resultado
  } finally {
    setLoading(false);
  }
};
```

## 🍪 Gestión de Cookies

Las cookies se configuran con las siguientes opciones de seguridad:
- `expires: 7` - Expiran en 7 días
- `secure: true` - Solo HTTPS en producción
- `sameSite: 'strict'` - Protección CSRF

### Cookies Utilizadas
- `token`: JWT token de autenticación
- `user`: Datos del usuario en formato JSON
