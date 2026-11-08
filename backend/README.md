# MotoPit Backend

API REST de **MotoPit**, servicio (ficticio) de mantenimiento preventivo de motos a domicilio en Bogotá. Permite que un usuario se registre, inicie sesión y gestione sus motos. Cada usuario solo puede ver y modificar sus propias motos.

> Proyecto académico, trabajo final del curso de Desarrollo Web de BIT. La landing del proyecto está en [sacuervo/MotoPit](https://github.com/sacuervo/MotoPit) y el frontend en Angular en [sacuervo/motopit-frontend](https://github.com/sacuervo/motopit-frontend).

## Enlaces de Entrega

[Documento Final](https://drive.google.com/file/d/1KgCn-KrR7nERI1YHIMmX0MoEVtc9nXmy/view?usp=sharing) <br>
[Video Entrega](https://youtu.be/uXgQIfBXcXY)

## Tecnologías

- Node.js y Express
- MongoDB Atlas con Mongoose
- bcryptjs para el hash de contraseñas
- jsonwebtoken (JWT) para la autenticación
- express-validator para validar las peticiones
- dotenv y nodemon

## Instalación

```bash
git clone https://github.com/sacuervo/motopit-backend.git
cd motopit-backend
npm install
```

Copia `.env.example` como `.env` y llena tus valores:

```env
PORT=5000
MONGO_URI=su_cadena_de_conexion
JWT_SECRET=su_clave_secreta
CORS_ORIGIN=http://localhost:4200
```

| Variable | Descripción |
| ------------- | ------------------------------------------------------------------------------------------- |
| `PORT` | Puerto del servidor. Por defecto `5000` |
| `MONGO_URI` | Cadena de conexión a MongoDB (Atlas o local, ej. `mongodb://127.0.0.1:27017/motopit`) |
| `JWT_SECRET` | Clave con la que se firman y verifican los tokens. Usa una cadena larga y privada |
| `CORS_ORIGIN` | Origen al que se le permite consumir la API. Por defecto `http://localhost:4200` (Angular) |

> El archivo `.env` no se sube al repositorio; solo `.env.example`.

## Ejecución

```bash
npm run dev   # desarrollo, con nodemon
npm start     # producción
```

La API queda disponible en `http://localhost:5000/api`.

> **Importante:** el [frontend](https://github.com/sacuervo/motopit-frontend) espera la API en el puerto **5000** (`src/app/utiles/api.ts`). Si cambias `PORT`, actualiza también esa URL. Si el frontend corre en otro origen distinto a `http://localhost:4200`, ajusta `CORS_ORIGIN`.

Para probar el proyecto completo: arranca primero este backend y luego el frontend con `ng serve`.

## Endpoints

| Método | Ruta                 | Protegida | Descripción                    |
| ------ | -------------------- | --------- | ------------------------------ |
| POST   | `/api/auth/register` | No        | Registrar usuario              |
| POST   | `/api/auth/login`    | No        | Iniciar sesión y obtener token |
| POST   | `/api/motos`         | Sí        | Crear moto                     |
| GET    | `/api/motos`         | Sí        | Listar mis motos               |
| GET    | `/api/motos/:id`     | Sí        | Ver una moto                   |
| PUT    | `/api/motos/:id`     | Sí        | Actualizar una moto            |
| DELETE | `/api/motos/:id`     | Sí        | Eliminar una moto              |

Las rutas protegidas necesitan la cabecera `Authorization: Bearer <token>`. El token dura 1 hora. <br>
IDs inválidos responden 400.

## Pruebas

La colección de Postman está en `postman\MotoPit API.postman_collectionV2.json`. Impórtala en Postman y define la variable `baseUrl` como `http://localhost:5000`.

## Estructura

```
├── config/          # Conexión a MongoDB
├── controllers/     # Lógica de cada endpoint
├── middlewares/     # JWT y resultado de validaciones
├── models/          # Esquemas de Mongoose
├── routes/          # Definición de rutas
├── validators/      # Reglas de express-validator
├── postman/         # Colección de pruebas
└── index.js         # Punto de entrada
```
