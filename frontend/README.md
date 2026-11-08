# MotoPit Frontend

Aplicación web de **MotoPit**, servicio (ficticio) de mantenimiento preventivo de motos a domicilio en Bogotá. Permite que un usuario se registre, inicie sesión y gestione sus motos (crear, ver, editar y eliminar). Cada usuario solo ve sus propias motos.

> Proyecto académico, trabajo final del curso de Desarrollo Web de BIT. No tiene fines comerciales. La landing del proyecto está en [sacuervo/MotoPit](https://github.com/sacuervo/MotoPit) y la API en [sacuervo/motopit-backend](https://github.com/sacuervo/motopit-backend).

## Qué hace

| Funcionalidad | Detalle |
| --- | --- |
| **Registro** | Formulario reactivo con validaciones; los errores del backend se muestran bajo cada campo |
| **Login** | Obtiene un JWT y lo guarda en `sessionStorage` |
| **Navbar dinámico** | Muestra "Iniciar sesión / Registrarse" o "Mis motos / Cerrar sesión" según haya sesión |
| **Gestión de motos** | Listado en cards de Bootstrap, detalle en modal, creación, edición y eliminación |
| **Alertas** | SweetAlert2 para confirmaciones, éxitos y errores del servidor |

## Tecnologías

- [Angular 21](https://angular.dev/) con componentes standalone, Router, ReactiveForms y HttpClient
- TypeScript con interfaces para tipar las respuestas de la API
- RxJS (Observables)
- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/), personalizado con Sass
- [SweetAlert2](https://sweetalert2.github.io/) para las alertas

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- El **backend corriendo** en `http://localhost:5000`. Sigue las instrucciones de [motopit-backend](https://github.com/sacuervo/motopit-backend). La URL base de la API está en `src/app/utiles/api.ts`.

## Cómo correrlo

```bash
git clone https://github.com/sacuervo/motopit-frontend.git
cd motopit-frontend
npm install
ng serve        # o: npm start
```

Abre [http://localhost:4200](http://localhost:4200) en el navegador. La app se recarga sola cada vez que guardas un archivo.

> Si no tienes Angular CLI instalado de forma global, usa `npx ng serve` o `npm start`.

## Estructura

```text
src/app/
├── pages/        # Vistas: inicio, login, registro y gestión de motos
├── services/     # AuthService y MotoService: llamadas HTTP a la API
├── interfaces/   # Contratos TypeScript de usuario, moto y errores de la API
├── guards/       # authGuard: bloquea rutas privadas si no hay token
├── shared/       # Componentes comunes: navbar y footer
└── utiles/       # URL base de la API y mapeo de errores a los formularios
```

## Rutas

| Ruta | Vista | Protegida |
| --- | --- | --- |
| `/` | Inicio | No |
| `/login` | Iniciar sesión | No |
| `/registro` | Registrarse | No |
| `/motos` | Gestión de motos | **Sí** (`authGuard`) |

Si se intenta entrar a `/motos` sin sesión, el guard redirige a `/login`. Cualquier ruta desconocida redirige al inicio.
