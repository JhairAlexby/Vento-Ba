# Vento-Ba Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Descripción

Backend para la aplicación Vento-Ba, un sistema de gestión de restaurantes desarrollado con NestJS y TypeScript. El sistema permite la gestión de usuarios, menús y pedidos con autenticación JWT.

## Características

- 🔐 **Autenticación JWT** - Sistema seguro de autenticación y autorización
- 👥 **Gestión de Usuarios** - Registro, login y gestión de perfiles
- 🍽️ **Gestión de Menú** - CRUD completo para platillos del restaurante
- 📋 **Sistema de Pedidos** - Creación y seguimiento de pedidos con estados
- 🗄️ **Base de Datos PostgreSQL** - Persistencia de datos con TypeORM
- ✅ **Validaciones** - Validación robusta de datos con class-validator
- 📚 **Documentación API** - Documentación completa de endpoints

## Módulos Disponibles

### 🔐 Auth Module
- Login y registro de usuarios
- Autenticación JWT
- Guards para protección de rutas

### 👥 Users Module  
- Gestión de perfiles de usuario
- Operaciones CRUD para usuarios

### 🍽️ Menu Module
- Gestión de platillos del restaurante
- Categorización y disponibilidad
- Precios y descripciones

### 📋 Pedidos Module
- Creación de pedidos con múltiples platillos
- Estados de pedido (pendiente, confirmado, en preparación, listo, entregado, cancelado)
- Cálculo automático de totales
- Historial de pedidos por usuario
- Estadísticas de pedidos

## Tecnologías

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT + Passport
- **Validación**: class-validator + class-transformer
- **Encriptación**: bcrypt

## Configuración del Proyecto

```bash
$ npm install
```

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=vento_db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# Puerto de la aplicación
PORT=3000
```

### Base de Datos

1. Asegúrate de tener PostgreSQL instalado y ejecutándose
2. Crea la base de datos:
```sql
CREATE DATABASE vento_db;
```

3. Ejecuta las migraciones (si las hay):
```bash
$ npm run typeorm:migration:run
```

4. (Opcional) Ejecuta los seeders para datos de ejemplo:
```bash
$ npx ts-node src/scripts/run-seeders.ts
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentación de API

La documentación completa de la API está disponible en los siguientes archivos:

- **[API_AUTH_DOCS.md](./API_AUTH_DOCS.md)** - Endpoints de autenticación
- **[API_MENU_DOCS.md](./API_MENU_DOCS.md)** - Endpoints del menú
- **[API_PEDIDOS_DOCS.md](./API_PEDIDOS_DOCS.md)** - Endpoints de pedidos

### Endpoints Principales

#### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Perfil del usuario

#### Menú
- `GET /menu` - Obtener todos los platillos
- `POST /menu` - Crear platillo
- `GET /menu/:id` - Obtener platillo por ID
- `PATCH /menu/:id` - Actualizar platillo
- `DELETE /menu/:id` - Eliminar platillo

#### Pedidos
- `POST /pedidos` - Crear pedido
- `GET /pedidos` - Obtener todos los pedidos
- `GET /pedidos/mis-pedidos` - Obtener mis pedidos
- `GET /pedidos/:id` - Obtener pedido por ID
- `PATCH /pedidos/:id/estado` - Actualizar estado del pedido
- `PATCH /pedidos/:id/cancelar` - Cancelar pedido

## Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── dto/             # DTOs de autenticación
│   ├── guards/          # Guards JWT y Local
│   └── strategies/      # Estrategias de Passport
├── users/               # Módulo de usuarios
│   ├── dto/            # DTOs de usuarios
│   └── entities/       # Entidad User
├── menu/                # Módulo de menú
│   ├── dto/            # DTOs de platillos
│   └── entities/       # Entidad Platillo
├── pedidos/             # Módulo de pedidos
│   ├── dto/            # DTOs de pedidos
│   └── entities/       # Entidades Pedido y DetallePedido
├── database/            # Configuración de base de datos
│   └── seeders/        # Seeders para datos de ejemplo
├── migrations/          # Migraciones de TypeORM
└── scripts/            # Scripts utilitarios
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
