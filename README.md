# MotoPit Fullstack

Aplicación completa (MEAN: MongoDB, Express, Angular y Node.js) de **MotoPit**, un servicio (ficticio) de mantenimiento preventivo de motos a domicilio por suscripción, pensado para mototrabajadores en Bogotá: domiciliarios, mensajeros y empresas con flotas de motos.

Un usuario se registra, inicia sesión y gestiona sus motos (crear, ver, editar y eliminar). Cada usuario solo ve y modifica sus propias motos.

> Proyecto académico, trabajo final del curso de Desarrollo Web de BIT. No tiene fines comerciales. Los testimonios, datos de contacto y teléfonos son ilustrativos.

## Repositorios

Este repositorio reúne en uno solo el backend y el frontend, integrados con `git subtree` para conservar el historial de commits de cada uno.

| Parte | Carpeta | Repositorio original |
| --- | --- | --- |
| API REST (Node.js + Express) | `backend/` | [sacuervo/motopit-backend](https://github.com/sacuervo/motopit-backend) |
| App web (Angular) | `frontend/` | [sacuervo/motopit-frontend](https://github.com/sacuervo/motopit-frontend) |
| Landing page | — | [sacuervo/MotoPit](https://github.com/sacuervo/MotoPit) |

## Arquitectura

```text
┌──────────────────────┐   HTTP + JSON    ┌──────────────────────┐   Mongoose   ┌───────────┐
│  Frontend (Angular)  │ ───────────────► │  Backend (Express)   │ ───────────► │  MongoDB  │
│  localhost:4200      │ ◄─────────────── │  localhost:5000/api  │ ◄─────────── │           │
└──────────────────────┘   JWT en header  └──────────────────────┘              └───────────┘
```

1. El usuario se registra o inicia sesión desde Angular.
2. El backend valida los datos con express-validator, guarda la contraseña con hash (bcryptjs) y, en el login, responde con un JWT que dura 1 hora.
3. El frontend guarda el token en `sessionStorage` y lo envía en la cabecera `Authorization: Bearer <token>` en cada petición a `/api/motos`.
4. El backend verifica el token y filtra las motos por el usuario autenticado.

## Funcionalidades

| Funcionalidad | Detalle |
| --- | --- |
| **Registro** | Nombre, email y contraseña segura (mín. 8 caracteres, mayúscula, minúscula, número y símbolo) |
| **Login** | Devuelve un JWT; el frontend lo guarda en `sessionStorage` |
| **Navbar dinámico** | Muestra "Iniciar sesión / Registrarse" o "Mis motos / Cerrar sesión" según haya sesión |
| **Ruta protegida** | `authGuard` bloquea `/motos` si no hay token y redirige a `/login` |
| **Gestión de motos** | CRUD completo, listado en cards de Bootstrap y detalle en modal |
| **Manejo de errores** | El backend responde 400, 401, 404 y 500 con errores estructurados; el frontend los muestra bajo cada campo y con alertas de SweetAlert2 |

## Tecnologías

**Backend**

- Node.js y Express
- MongoDB Atlas con Mongoose
- bcryptjs para el hash de contraseñas
- jsonwebtoken (JWT) para la autenticación
- express-validator para validar las peticiones
- cors, dotenv y nodemon

**Frontend**

- Angular 21 con componentes standalone, Router, ReactiveForms y HttpClient
- TypeScript con interfaces para tipar las respuestas de la API
- RxJS
- Bootstrap 5.3, personalizado con Sass
- SweetAlert2

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- Una base de datos MongoDB: un cluster de [MongoDB Atlas](https://www.mongodb.com/atlas) o MongoDB instalado en local

## Instalación

```bash
git clone https://github.com/sacuervo/motopit-fullstack.git
cd motopit-fullstack
```

### 1. Backend

```bash
cd backend
npm install
```

Copia `backend/.env.example` como `backend/.env` y llena tus valores:

```env
PORT=5000
MONGO_URI=su_cadena_de_conexion
JWT_SECRET=su_clave_secreta
CORS_ORIGIN=http://localhost:4200
```

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor. Por defecto `5000` |
| `MONGO_URI` | Cadena de conexión a MongoDB (Atlas o local, ej. `mongodb://127.0.0.1:27017/motopit`) |
| `JWT_SECRET` | Clave con la que se firman y verifican los tokens. Usa una cadena larga y privada |
| `CORS_ORIGIN` | Origen al que se le permite consumir la API. Por defecto `http://localhost:4200` |

### 2. Frontend

```bash
cd frontend
npm install
```

El frontend no usa variables de entorno: la URL de la API está en `frontend/src/app/utiles/api.ts` (`http://localhost:5000/api`).

## Ejecución

Abre dos terminales, una para cada parte. **Arranca primero el backend.**

```bash
# Terminal 1
cd backend
npm run dev        # desarrollo, con nodemon (o npm start)
```

```bash
# Terminal 2
cd frontend
npm start          # equivale a ng serve
```

Abre [http://localhost:4200](http://localhost:4200) en el navegador.

> Si cambias el puerto del backend (`PORT`), actualiza también la URL en `frontend/src/app/utiles/api.ts`. Si el frontend corre en un origen distinto a `http://localhost:4200`, ajusta `CORS_ORIGIN`.

## API

| Método | Ruta | Protegida | Descripción |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión y obtener token |
| POST | `/api/motos` | Sí | Crear moto |
| GET | `/api/motos` | Sí | Listar mis motos |
| GET | `/api/motos/:id` | Sí | Ver una moto |
| PUT | `/api/motos/:id` | Sí | Actualizar una moto |
| DELETE | `/api/motos/:id` | Sí | Eliminar una moto |

Las rutas protegidas necesitan la cabecera `Authorization: Bearer <token>`. Los IDs inválidos responden 400.

### Modelos

| Modelo | Campos |
| --- | --- |
| **User** | `nombre`, `email` (único), `password` (con hash) |
| **Moto** | `placa` (5 a 6 caracteres, en mayúsculas), `marca`, `modelo`, `kilometraje` (entero ≥ 0), `user` (referencia al dueño) |

Ambos modelos guardan `createdAt` y `updatedAt`.

### Pruebas con Postman

La colección está en `backend/postman/`. Impórtala en Postman y define la variable `baseUrl` como `http://localhost:5000`.

## Rutas del frontend

| Ruta | Vista | Protegida |
| --- | --- | --- |
| `/` | Inicio | No |
| `/login` | Iniciar sesión | No |
| `/registro` | Registrarse | No |
| `/motos` | Gestión de motos | **Sí** (`authGuard`) |

Cualquier ruta desconocida redirige al inicio.

## Estructura

```text
motopit-fullstack/
├── backend/
│   ├── config/          # Conexión a MongoDB
│   ├── controllers/     # Lógica de cada endpoint
│   ├── middlewares/     # Verificación del JWT y resultado de validaciones
│   ├── models/          # Esquemas de Mongoose (User y Moto)
│   ├── routes/          # Definición de rutas
│   ├── validators/      # Reglas de express-validator
│   ├── postman/         # Colección de pruebas
│   └── index.js         # Punto de entrada
└── frontend/
    └── src/app/
        ├── pages/       # Vistas: inicio, login, registro y gestión de motos
        ├── services/    # AuthService y MotoService: llamadas HTTP a la API
        ├── interfaces/  # Contratos TypeScript de usuario, moto y errores de la API
        ├── guards/      # authGuard: bloquea rutas privadas si no hay token
        ├── shared/      # Componentes comunes: navbar y footer
        └── utiles/      # URL base de la API y mapeo de errores a los formularios
```

## Cómo se integraron los repositorios

El backend y el frontend se desarrollaron en repositorios separados y se trajeron a este con `git subtree`, que copia los archivos y el historial dentro de una carpeta:

```bash
git subtree add --prefix=backend https://github.com/sacuervo/motopit-backend.git main
git subtree add --prefix=frontend https://github.com/sacuervo/motopit-frontend.git main
```

Para traer cambios nuevos de alguno de los repositorios originales:

```bash
git subtree pull --prefix=backend https://github.com/sacuervo/motopit-backend.git main
git subtree pull --prefix=frontend https://github.com/sacuervo/motopit-frontend.git main
```

## Autor

Santiago Cuervo Velasco — [@sacuervo](https://github.com/sacuervo)
