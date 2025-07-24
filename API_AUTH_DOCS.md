# API de Autenticación - Vento Backend

## Endpoints de Autenticación

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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "nombreCompleto": "Juan Pérez",
    "correo": "juan@ejemplo.com"
  }
}
```

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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "nombreCompleto": "Juan Pérez",
    "correo": "juan@ejemplo.com"
  }
}
```

**Respuesta de error (401):**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Validaciones

### Registro:
- `nombreCompleto`: Requerido, string, 3-100 caracteres
- `correo`: Requerido, formato de email válido, único
- `contrasena`: Requerido, string, 6-100 caracteres

### Login:
- `correo`: Requerido, formato de email válido
- `contrasena`: Requerido, string, 6-100 caracteres

## Uso del Token

Para endpoints protegidos, incluye el token en el header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Errores Comunes

1. **401 Unauthorized**: Credenciales incorrectas o token inválido
2. **400 Bad Request**: Datos de entrada inválidos
3. **409 Conflict**: Email ya registrado (solo en registro)

## Configuración Requerida

Asegúrate de tener las siguientes variables de entorno configuradas:
- `JWT_SECRET`: Clave secreta para firmar los tokens JWT
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: Configuración de la base de datos