# 🚀 Guía de Configuración IONOS para React Router

## Problema
Cuando MercadoPago redirige a rutas como `/checkout/success`, IONOS devuelve "Not Found" porque no existe ese archivo físico.

## Solución

### 1. Archivo .htaccess
El archivo `.htaccess` ya está creado en `client/.htaccess` y se copia automáticamente a `client/build/` durante el build.

### 2. Pasos para Deploy en IONOS

#### Paso 1: Build del Frontend
```bash
cd client
npm run build
```

#### Paso 2: Subir archivos a IONOS
1. Conecta por FTP o panel de control de IONOS
2. Sube TODOS los archivos de la carpeta `client/build/` a la raíz de tu dominio
3. **IMPORTANTE**: Asegúrate de que el archivo `.htaccess` esté en la raíz

#### Paso 3: Verificar estructura en IONOS
Tu hosting debería tener esta estructura:
```
/ (raíz del dominio)
├── .htaccess                 ← IMPORTANTE
├── index.html
├── static/
│   ├── css/
│   └── js/
├── manifest.json
└── robots.txt
```

### 3. Configuración del .htaccess
El archivo `.htaccess` incluye:
- **Rewrite rules** para React Router
- **Headers de seguridad**
- **Redirección HTTPS**
- **Cache headers** para optimización

### 4. Variables de Entorno
Asegúrate de que `client/package.json` tenga:
```json
{
  "homepage": "https://boostgramx.com"
}
```

### 5. Verificación
Después del deploy:
1. Visita `https://boostgramx.com/checkout/success`
2. Debería cargar la página de éxito
3. No debería mostrar "Not Found"

## Troubleshooting

### Si sigue sin funcionar:
1. Verifica que el archivo `.htaccess` esté en la raíz
2. Revisa los permisos del archivo (755 o 644)
3. Contacta soporte de IONOS para verificar que mod_rewrite esté habilitado

### URLs de MercadoPago
Las URLs configuradas en MercadoPago son:
- Success: `https://boostgramx.com/checkout/success`
- Failure: `https://boostgramx.com/checkout/failure`
- Pending: `https://boostgramx.com/checkout/pending`

## Scripts Automáticos

Para automatizar el proceso:
```bash
# Build y preparar para deploy
npm run build
cd client
npm run build
```

El archivo `.htaccess` se copia automáticamente durante el build.
