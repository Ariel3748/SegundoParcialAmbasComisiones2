# BuzzU - UnaHur Anti-Social Net

Red social estilo Reddit para estudiantes de la Universidad Nacional de Hurlingham (UNAHUR). Desarrollada como TP de la materia Construcción de Interfaces de Usuario.

## Funcionalidades

- **Inicio de Sesión** con nickName y contraseña (validación contra backend)
- **Registro** de nuevo usuario con nickName, email y contraseña
- **Home** con feed de publicaciones recientes, búsqueda y filtro por etiquetas
- **Detalle de publicación** con imágenes, etiquetas, comentarios y formulario para comentar
- **Perfil de usuario** con lista de publicaciones propias y botón de cerrar sesión
- **Crear publicación** con descripción, URLs de imágenes y selección de etiquetas
- **Modo oscuro/claro**
- Diseño responsive

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone <repo-url>
cd "UnaHur Anti-Social Net"

# Instalar dependencias
npm install

# Configurar variable de entorno (opcional, default: http://localhost:3000)
# Crear archivo .env con:
# VITE_API_URL=http://localhost:3000

# Iniciar en modo desarrollo
npm run dev
```

## API

Backend propio desarrollado en Estrategia de Persistencia.
URL por defecto: `http://localhost:3000`

### Endpoints utilizados

| Método | Endpoint | Uso |
|---|---|---|
| POST | /users/login | Inicio de sesión |
| GET | /users | Lista de usuarios |
| GET | /users/:nickName | Obtener usuario por nickName |
| POST | /users | Crear usuario |
| GET | /posts | Lista de publicaciones |
| GET | /posts/:id | Detalle de publicación |
| GET | /posts?userId=xxx | Posts de un usuario |
| POST | /posts | Crear publicación |
| GET | /tags | Lista de etiquetas |
| GET | /comments/post/:postId | Comentarios de un post |
| POST | /comments | Crear comentario |
| GET | /postimages/post/:postId | Imágenes de un post |
| POST | /postimages | Asociar imagen a post |

## Tecnologías

- React 19 + TypeScript
- Vite
- React Router DOM v7
- Bootstrap 5.3
- React Bootstrap Icons

## Integrantes

- Pablo Perugini
- Ariel Oliva
- Luca Lafuente
