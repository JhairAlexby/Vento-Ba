# API de Pedidos - Documentación

## Descripción
El módulo de pedidos permite a los usuarios crear, gestionar y hacer seguimiento de sus pedidos de platillos del menú.

## Endpoints

### 1. Crear Pedido
**POST** `/pedidos`

Crea un nuevo pedido con los platillos seleccionados.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "notas": "Sin cebolla en la hamburguesa",
  "detalles": [
    {
      "platilloId": "uuid-del-platillo",
      "cantidad": 2,
      "notasEspeciales": "Término medio"
    },
    {
      "platilloId": "uuid-del-platillo-2",
      "cantidad": 1
    }
  ]
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "uuid-del-pedido",
  "total": 45.50,
  "estado": "pendiente",
  "notas": "Sin cebolla en la hamburguesa",
  "usuarioId": "uuid-del-usuario",
  "detalles": [
    {
      "id": "uuid-detalle-1",
      "cantidad": 2,
      "precioUnitario": 15.00,
      "subtotal": 30.00,
      "notasEspeciales": "Término medio",
      "platillo": {
        "id": "uuid-del-platillo",
        "nombre": "Hamburguesa Clásica",
        "precio": 15.00
      }
    }
  ],
  "fechaCreacion": "2024-01-15T10:30:00Z",
  "fechaActualizacion": "2024-01-15T10:30:00Z"
}
```

### 2. Obtener Todos los Pedidos
**GET** `/pedidos`

Obtiene todos los pedidos (admin) o filtrados por usuario.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `usuario` (opcional): UUID del usuario para filtrar pedidos

**Respuesta exitosa (200):**
```json
[
  {
    "id": "uuid-del-pedido",
    "total": 45.50,
    "estado": "confirmado",
    "notas": "Sin cebolla",
    "usuario": {
      "id": "uuid-del-usuario",
      "nombreCompleto": "Juan Pérez",
      "correo": "juan@email.com"
    },
    "detalles": [...],
    "fechaCreacion": "2024-01-15T10:30:00Z"
  }
]
```

### 3. Obtener Mis Pedidos
**GET** `/pedidos/mis-pedidos`

Obtiene todos los pedidos del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### 4. Obtener Pedido por ID
**GET** `/pedidos/:id`

Obtiene un pedido específico por su ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### 5. Actualizar Pedido
**PATCH** `/pedidos/:id`

Actualiza un pedido existente (solo notas y estado).

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "notas": "Nuevas notas del pedido",
  "estado": "confirmado"
}
```

### 6. Actualizar Estado del Pedido
**PATCH** `/pedidos/:id/estado`

Actualiza únicamente el estado del pedido.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "estado": "en_preparacion"
}
```

### 7. Cancelar Pedido
**PATCH** `/pedidos/:id/cancelar`

Cancela un pedido (cambia estado a "cancelado").

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### 8. Obtener Pedidos por Estado
**GET** `/pedidos/estado/:estado`

Obtiene todos los pedidos con un estado específico.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parámetros:**
- `estado`: Uno de los valores: `pendiente`, `confirmado`, `en_preparacion`, `listo`, `entregado`, `cancelado`

### 9. Obtener Estadísticas
**GET** `/pedidos/estadisticas`

Obtiene estadísticas de pedidos.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `usuario` (opcional): UUID del usuario para estadísticas específicas

**Respuesta exitosa (200):**
```json
{
  "totalPedidos": 25,
  "pedidosPorEstado": {
    "pendientes": 3,
    "confirmados": 5,
    "enPreparacion": 2,
    "listos": 1,
    "entregados": 12,
    "cancelados": 2
  }
}
```

## Estados de Pedido

- **pendiente**: Pedido creado, esperando confirmación
- **confirmado**: Pedido confirmado por el restaurante
- **en_preparacion**: Pedido en proceso de preparación
- **listo**: Pedido listo para entrega/recogida
- **entregado**: Pedido entregado al cliente
- **cancelado**: Pedido cancelado

## Validaciones

### CreatePedidoDto
- `notas`: Opcional, máximo 500 caracteres
- `detalles`: Requerido, mínimo 1 elemento
  - `platilloId`: Requerido, UUID válido
  - `cantidad`: Requerido, número entre 1 y 99
  - `notasEspeciales`: Opcional, máximo 200 caracteres

### Reglas de Negocio

1. **Creación de Pedidos:**
   - Todos los platillos deben estar disponibles
   - El total se calcula automáticamente
   - Estado inicial siempre es "pendiente"

2. **Actualización de Pedidos:**
   - No se pueden modificar pedidos entregados o cancelados
   - Solo el propietario puede modificar sus pedidos

3. **Cancelación:**
   - No se pueden cancelar pedidos ya entregados
   - No se puede cancelar un pedido ya cancelado

## Códigos de Error

- **400 Bad Request**: Datos inválidos o reglas de negocio violadas
- **401 Unauthorized**: Token JWT inválido o faltante
- **403 Forbidden**: Sin permisos para acceder al recurso
- **404 Not Found**: Pedido o platillo no encontrado

## Ejemplos de Uso

### Crear un pedido simple
```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "detalles": [
      {
        "platilloId": "123e4567-e89b-12d3-a456-426614174000",
        "cantidad": 2
      }
    ]
  }'
```

### Actualizar estado a "listo"
```bash
curl -X PATCH http://localhost:3000/pedidos/pedido-id/estado \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"estado": "listo"}'
```