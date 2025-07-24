# API de Menú - Documentación

Esta documentación describe los endpoints disponibles para la gestión del menú de platillos en la aplicación de restaurante.

## Autenticación Requerida

Todos los endpoints del menú requieren autenticación mediante JWT token en las cookies (`access_token`).

## Endpoints Disponibles

### 1. Crear Platillo
**POST** `/menu`

Crea un nuevo platillo en el menú del usuario autenticado.

**Headers:**
```
Content-Type: application/json
Cookie: access_token=<jwt_token>
```

**Body:**
```json
{
  "nombre": "Tacos al Pastor",
  "descripcion": "Deliciosos tacos con carne al pastor, piña y cebolla",
  "precio": 85.50,
  "imagenUrl": "https://ejemplo.com/imagen-tacos.jpg",
  "disponible": true,
  "categoria": "Tacos"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": "uuid-del-platillo",
  "nombre": "Tacos al Pastor",
  "descripcion": "Deliciosos tacos con carne al pastor, piña y cebolla",
  "precio": 85.50,
  "imagenUrl": "https://ejemplo.com/imagen-tacos.jpg",
  "disponible": true,
  "categoria": "Tacos",
  "usuarioId": "uuid-del-usuario",
  "createdAt": "2025-01-24T20:18:46.000Z",
  "updatedAt": "2025-01-24T20:18:46.000Z"
}
```

### 2. Obtener Todos los Platillos
**GET** `/menu`

Obtiene todos los platillos disponibles. Opcionalmente puede filtrar por usuario.

**Headers:**
```
Cookie: access_token=<jwt_token>
```

**Query Parameters (Opcionales):**
- `usuario`: UUID del usuario para filtrar sus platillos

**Ejemplos:**
- `GET /menu` - Todos los platillos
- `GET /menu?usuario=uuid-del-usuario` - Platillos de un usuario específico

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "uuid-del-platillo",
    "nombre": "Tacos al Pastor",
    "descripcion": "Deliciosos tacos con carne al pastor",
    "precio": 85.50,
    "imagenUrl": "https://ejemplo.com/imagen-tacos.jpg",
    "disponible": true,
    "categoria": "Tacos",
    "usuarioId": "uuid-del-usuario",
    "createdAt": "2025-01-24T20:18:46.000Z",
    "updatedAt": "2025-01-24T20:18:46.000Z"
  }
]
```

### 3. Obtener Mis Platillos
**GET** `/menu/mis-platillos`

Obtiene todos los platillos del usuario autenticado.

**Headers:**
```
Cookie: access_token=<jwt_token>
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "uuid-del-platillo",
    "nombre": "Tacos al Pastor",
    "descripcion": "Deliciosos tacos con carne al pastor",
    "precio": 85.50,
    "imagenUrl": "https://ejemplo.com/imagen-tacos.jpg",
    "disponible": true,
    "categoria": "Tacos",
    "usuarioId": "uuid-del-usuario",
    "createdAt": "2025-01-24T20:18:46.000Z",
    "updatedAt": "2025-01-24T20:18:46.000Z"
  }
]
```

### 4. Obtener Platillos por Categoría
**GET** `/menu/categoria/:categoria`

Obtiene platillos filtrados por categoría.

**Headers:**
```
Cookie: access_token=<jwt_token>
```

**Path Parameters:**
- `categoria`: Nombre de la categoría (ej: "Tacos", "Bebidas", "Postres")

**Query Parameters (Opcionales):**
- `usuario`: UUID del usuario para filtrar sus platillos

**Ejemplos:**
- `GET /menu/categoria/Tacos` - Todos los tacos
- `GET /menu/categoria/Bebidas?usuario=uuid-del-usuario` - Bebidas de un usuario específico

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "uuid-del-platillo",
    "nombre": "Tacos al Pastor",
    "descripcion": "Deliciosos tacos con carne al pastor",
    "precio": 85.50,
    "imagenUrl": "https://ejemplo.com/imagen-tacos.jpg",
    "disponible": true,
    "categoria": "Tacos",
    "usuarioId": "uuid-del-usuario",
    "createdAt": "2025-01-24T20:18:46.000Z",
    "updatedAt": "2025-01-24T20:18:46.000Z"
  }
]
```

### 5. Obtener Platillo por ID
**GET** `/menu/:id`

Obtiene un platillo específico por su ID.

**Headers:**
```
Cookie: access_token=<jwt_token>
```

**Path Parameters:**
- `id`: UUID del platillo

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-del-platillo",
  "nombre": "Tacos al Pastor",
  "descripcion": "Deliciosos tacos con carne al pastor",
  "precio": 85.50,
  "imagenUrl": "https://ejemplo.com/imagen-tacos.jpg",
  "disponible": true,
  "categoria": "Tacos",
  "usuarioId": "uuid-del-usuario",
  "createdAt": "2025-01-24T20:18:46.000Z",
  "updatedAt": "2025-01-24T20:18:46.000Z"
}
```

### 6. Actualizar Platillo
**PATCH** `/menu/:id`

Actualiza un platillo existente. Solo el propietario puede actualizar sus platillos.

**Headers:**
```
Content-Type: application/json
Cookie: access_token=<jwt_token>
```

**Path Parameters:**
- `id`: UUID del platillo

**Body (todos los campos son opcionales):**
```json
{
  "nombre": "Tacos al Pastor Especiales",
  "descripcion": "Tacos con carne al pastor, piña, cebolla y salsa especial",
  "precio": 95.00,
  "imagenUrl": "https://ejemplo.com/nueva-imagen-tacos.jpg",
  "disponible": false,
  "categoria": "Tacos Especiales"
}
```

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-del-platillo",
  "nombre": "Tacos al Pastor Especiales",
  "descripcion": "Tacos con carne al pastor, piña, cebolla y salsa especial",
  "precio": 95.00,
  "imagenUrl": "https://ejemplo.com/nueva-imagen-tacos.jpg",
  "disponible": false,
  "categoria": "Tacos Especiales",
  "usuarioId": "uuid-del-usuario",
  "createdAt": "2025-01-24T20:18:46.000Z",
  "updatedAt": "2025-01-24T20:25:30.000Z"
}
```

### 7. Cambiar Disponibilidad
**PATCH** `/menu/:id/disponibilidad`

Alterna la disponibilidad de un platillo (disponible ↔ no disponible).

**Headers:**
```
Cookie: access_token=<jwt_token>
```

**Path Parameters:**
- `id`: UUID del platillo

**Respuesta Exitosa (200):**
```json
{
  "id": "uuid-del-platillo",
  "nombre": "Tacos al Pastor",
  "descripcion": "Deliciosos tacos con carne al pastor",
  "precio": 85.50,
  "imagenUrl": "https://ejemplo.com/imagen-tacos.jpg",
  "disponible": false,
  "categoria": "Tacos",
  "usuarioId": "uuid-del-usuario",
  "createdAt": "2025-01-24T20:18:46.000Z",
  "updatedAt": "2025-01-24T20:30:15.000Z"
}
```

### 8. Eliminar Platillo
**DELETE** `/menu/:id`

Elimina un platillo del menú. Solo el propietario puede eliminar sus platillos.

**Headers:**
```
Cookie: access_token=<jwt_token>
```

**Path Parameters:**
- `id`: UUID del platillo

**Respuesta Exitosa (200):**
```json
{
  "message": "Platillo eliminado exitosamente",
  "id": "uuid-del-platillo"
}
```

## Validaciones

### Campos Requeridos para Crear Platillo:
- `nombre`: String (3-100 caracteres)
- `precio`: Number (mayor a 0)
- `imagenUrl`: String (URL válida)

### Campos Opcionales:
- `descripcion`: String (máximo 500 caracteres)
- `disponible`: Boolean (default: true)
- `categoria`: String (máximo 50 caracteres)

## Errores Comunes

### 400 Bad Request
```json
{
  "message": [
    "nombre must be longer than or equal to 3 characters",
    "precio must be a positive number"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "message": "No tienes permisos para realizar esta acción",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "message": "Platillo no encontrado",
  "statusCode": 404
}
```

## Ejemplos de Uso

### Con Fetch API:
```javascript
// Crear platillo
const response = await fetch('http://localhost:3000/menu', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    nombre: 'Tacos al Pastor',
    descripcion: 'Deliciosos tacos con carne al pastor',
    precio: 85.50,
    imagenUrl: 'https://ejemplo.com/imagen-tacos.jpg',
    categoria: 'Tacos'
  })
});

// Obtener mis platillos
const misPlatillos = await fetch('http://localhost:3000/menu/mis-platillos', {
  credentials: 'include'
});
```

### Con Axios:
```javascript
// Configurar Axios para incluir cookies
axios.defaults.withCredentials = true;

// Crear platillo
const response = await axios.post('http://localhost:3000/menu', {
  nombre: 'Tacos al Pastor',
  descripcion: 'Deliciosos tacos con carne al pastor',
  precio: 85.50,
  imagenUrl: 'https://ejemplo.com/imagen-tacos.jpg',
  categoria: 'Tacos'
});

// Obtener platillos por categoría
const tacos = await axios.get('http://localhost:3000/menu/categoria/Tacos');
```

## Notas Importantes

1. **Relaciones**: Cada platillo pertenece a un usuario específico
2. **Seguridad**: Solo el propietario puede modificar o eliminar sus platillos
3. **Validación**: Todos los datos se validan antes de ser guardados
4. **URLs de Imágenes**: Se recomienda usar servicios de almacenamiento como Cloudinary o AWS S3
5. **Categorías**: Las categorías son texto libre, se recomienda estandarizar en el frontend
6. **Precios**: Se manejan como números decimales para mayor precisión