# 🚀 Deploy a IONOS

## Pasos para subir a IONOS:

### 1. Subir archivos
Sube TODO el contenido de la carpeta `client/build/` a tu hosting IONOS:

```
client/build/
├── index.html          → Raíz de tu dominio
├── favicon.ico         → Raíz de tu dominio
├── manifest.json       → Raíz de tu dominio
├── robots.txt          → Raíz de tu dominio
└── static/             → Carpeta static completa
    ├── css/
    └── js/
```

### 2. Estructura final en IONOS
```
Tu dominio (boostgramx.com)/
├── index.html
├── favicon.ico
├── manifest.json
├── robots.txt
└── static/
    ├── css/
    └── js/
```

### 3. URLs configuradas:
- Frontend: https://boostgramx.com
- Backend: https://boostgramx.vercel.app/api

### 4. Variables de entorno configuradas en Vercel:
- MONGODB_URI ✅
- NODE_ENV ✅
- JWT_SECRET ✅
- SMM_API_URL ✅
- SMM_API_KEY ✅
- MERCADOPAGO_ACCESS_TOKEN ✅
- MERCADOPAGO_PUBLIC_KEY ✅
- FRONTEND_URL_PROD ✅
- BACKEND_URL ✅

### 5. Verificar funcionamiento:
- Backend health: https://boostgramx.vercel.app/api/health
- Frontend: https://boostgramx.com
- Login: Debería funcionar después del deploy

## ⚠️ Importante:
- Subir SOLO el contenido de `build/`, no la carpeta `build/` completa
- Verificar que las variables de entorno estén configuradas en Vercel
- Asegurarse de que MongoDB Atlas permita conexiones desde 0.0.0.0/0
