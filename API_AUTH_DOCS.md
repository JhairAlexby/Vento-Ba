# API de Autenticación - Vento Backend

## 🔐 Autenticación Basada en Cookies HttpOnly

E  de Autenticación

### 1. Registro de Usuario
**POST** `/auth/register`

**Body (JSON):**
```json
{
  "nombreCompleto": "Juan Pérez",
  "correo": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid-del-usuario",
    "nombreCompleto": "Juan Pérez",
    "correo": "juan@ejemplo.com"
  }
}
```

**Cookies establecidas:**
- `access_token`: Cookie HttpOnly con el JWT (válida por 1 hora)

### 2. Inicio de Sesión
**POST** `/auth/login`

**Body (JSON):**
```json
{
  "correo": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "uuid-del-usuario",
    "nombreCompleto": "Juan Pérez",
    "correo": "juan@ejemplo.com"
  }
}
```

**Cookies establecidas:**
- `access_token`: Cookie HttpOnly con el JWT (válida por 1 hora)

### 3. Cerrar Sesión
**POST** `/auth/logout`

**Descripción:** Cierra la sesión del usuario eliminando la cookie de autenticación. No requiere autenticación previa.

**Respuesta exitosa (200):**
```json
{
  "message": "Sesión cerrada exitosamente",
  "authenticated": false,
  "timestamp": "2024-07-24T18:44:13.000Z"
}
```

**Cookies eliminadas:**
- `access_token`: Cookie eliminada del navegador

### 3.1. Cerrar Sesión Segura
**POST** `/auth/logout/secure`

**Descripción:** Cierra la sesión de un usuario autenticado y proporciona información adicional sobre el usuario que cerró sesión.

**Headers requeridos:** Cookie con `access_token` (automático en navegadores)

**Respuesta exitosa (200):**
```json
{
  "message": "Sesión cerrada exitosamente",
  "authenticated": false,
  "lastUser": {
    "userId": "uuid-del-usuario",
    "correo": "juan@ejemplo.com"
  },
  "timestamp": "2024-07-24T18:44:13.000Z"
}
```

**Cookies eliminadas:**
- `access_token`: Cookie eliminada del navegador

### 4. Obtener Perfil del Usuario
**GET** `/auth/me`

**Headers requeridos:** Cookie con `access_token` (automático en navegadores)

**Respuesta exitosa (200):**
```json
{
  "user": {
    "id": "uuid-del-usuario",
    "nombreCompleto": "Juan Pérez",
    "correo": "juan@ejemplo.com"
  },
  "authenticated": true
}
```

### 5. Verificar Estado de Autenticación
**GET** `/auth/status`

**Headers requeridos:** Cookie con `access_token` (automático en navegadores)

**Respuesta exitosa (200):**
```json
{
  "authenticated": true,
  "userId": "uuid-del-usuario",
  "correo": "juan@ejemplo.com"
}
```

## 🛡️ Seguridad de las Cookies

Las cookies se configuran con las siguientes opciones de seguridad:

- **httpOnly: true** - No accesible desde JavaScript (protege contra XSS)
- **secure: true** - Solo se envía por HTTPS en producción
- **sameSite: 'strict'** - Protege contra ataques CSRF
- **maxAge: 3600000** - Expira en 1 hora

## 🌐 Configuración CORS

El backend está configurado para permitir cookies desde el frontend:

```javascript
{
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true, // Permite cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 📱 Uso en el Frontend

### Con Fetch API:
```javascript
// Login
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // IMPORTANTE: Incluir cookies
  body: JSON.stringify({
    correo: 'usuario@ejemplo.com',
    contrasena: 'password123'
  })
});

// Requests autenticados
const profileResponse = await fetch('http://localhost:3000/auth/me', {
  credentials: 'include' // IMPORTANTE: Incluir cookies
});
```

### Con Axios:
```javascript
// Configuración global
axios.defaults.withCredentials = true;

// Login
await axios.post('http://localhost:3000/auth/login', {
  correo: 'usuario@ejemplo.com',
  contrasena: 'password123'
});

// Requests autenticados (automático con withCredentials)
const profile = await axios.get('http://localhost:3000/auth/me');
```

## 🧪 Testing con Postman

1. **Configurar Postman para cookies:**
   - Ve a Settings → General
   - Activa "Automatically follow redirects"
   - Activa "Send cookies"

2. **Hacer login:**
   - POST a `/auth/login`
   - Postman guardará automáticamente la cookie

3. **Usar endpoints protegidos:**
   - Las cookies se enviarán automáticamente
   - No necesitas configurar headers manualmente

## Validaciones

### Registro:
- `nombreCompleto`: Requerido, string, 3-100 caracteres
- `correo`: Requerido, formato de email válido, único
- `contrasena`: Requerido, string, 6-100 caracteres

### Login:
- `correo`: Requerido, formato de email válido
- `contrasena`: Requerido, string, 6-100 caracteres

## Errores Comunes

1. **401 Unauthorized**: Credenciales incorrectas o cookie expirada
2. **400 Bad Request**: Datos de entrada inválidos
3. **409 Conflict**: Email ya registrado (solo en registro)

## Configuración Requerida

Variables de entorno necesarias:

```env
JWT_SECRET=tu_clave_secreta_muy_segura
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=vento
```

## 🔄 Migración desde localStorage

Si anteriormente usabas localStorage para tokens:

**Antes:**
```javascript
localStorage.setItem('token', response.data.access_token);
```

**Ahora:**
```javascript
// No necesitas hacer nada, las cookies se manejan automáticamente
// Solo asegúrate de usar credentials: 'include'
```