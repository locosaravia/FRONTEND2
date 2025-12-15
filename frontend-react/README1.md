# Sistema de Buses - Frontend React

Frontend desarrollado en React para la gestión integral de un sistema de buses, consumiendo la API REST Django.

## 🚀 Tecnologías Utilizadas

- **React** 19.2.3
- **React Router DOM** 7.10.1
- **Axios** 1.13.2 (Cliente HTTP)
- **CSS3** (Estilos personalizados)

## 📋 Prerequisitos

- Node.js 18+ y npm
- API REST Django corriendo en `http://localhost:8000`
- Usuario administrador creado en la API

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
cd frontend-react
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la API

El proyecto está configurado para conectarse a `http://localhost:8000` por defecto.

Si necesitas cambiar la URL, edita `src/services/api.js`:

```javascript
const API_URL = 'http://TU_SERVIDOR:PUERTO/api';
```

### 4. Iniciar el servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en: **http://localhost:3000**

## 📁 Estructura del Proyecto

```
frontend-react/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── componentes/
│   │   ├── login.jsx          # Componente de login
│   │   ├── login.css
│   │   ├── navbar.jsx         # Barra de navegación
│   │   └── navbar.css
│   ├── pages/
│   │   ├── dashboard.js       # Dashboard principal
│   │   ├── dashboard.css
│   │   ├── trabajadores.js    # CRUD Trabajadores
│   │   ├── trabajadores.css
│   │   ├── buses.js           # CRUD Buses
│   │   ├── roles.js           # CRUD Roles
│   │   └── asignaciones.js    # Gestión de Asignaciones
│   ├── services/
│   │   └── api.js            # Servicios de API
│   ├── App.js                # Componente principal
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🔐 Autenticación

### Credenciales por defecto

```
Usuario: admin
Contraseña: admin123
```

### Sistema de Tokens

- El login genera un token de autenticación
- El token se almacena en `localStorage`
- Todas las peticiones incluyen el token en los headers
- El token permanece activo hasta el logout

## 🎯 Funcionalidades

### 1. **Dashboard**
- Visualización de estadísticas generales
- Contadores de trabajadores, buses, roles y asignaciones
- Accesos rápidos a cada módulo

### 2. **Gestión de Trabajadores**
- ✅ Listar todos los trabajadores
- ✅ Crear nuevo trabajador
- ✅ Editar trabajador existente
- ✅ Eliminar trabajador
- ✅ Búsqueda por nombre/apellido
- ✅ Filtros por estado (activo/inactivo)

**Validaciones:**
- Nombre y apellido solo letras (mínimo 2 caracteres)
- Edad entre 18 y 70 años
- Contacto formato telefónico válido
- Todos los campos son requeridos

### 3. **Gestión de Buses**
- ✅ Listar todos los buses
- ✅ Crear nuevo bus
- ✅ Editar bus existente
- ✅ Eliminar bus
- ✅ Búsqueda por patente/modelo/marca

**Validaciones:**
- Patente formato válido (ABC-123)
- Año entre 1990 y año actual
- Capacidad entre 10 y 80 pasajeros
- Todos los campos son requeridos

### 4. **Gestión de Roles**
- ✅ Listar todos los roles
- ✅ Crear nuevo rol
- ✅ Editar rol existente
- ✅ Eliminar rol
- ✅ Búsqueda por nombre
- ✅ Ver cantidad de asignaciones activas

**Validaciones:**
- Nombre solo letras (mínimo 3 caracteres)
- Nivel de acceso entre 1 y 5
- Descripción opcional (máximo 500 caracteres)

### 5. **Gestión de Asignaciones**
- ✅ Asignaciones de Roles a Trabajadores
- ✅ Asignaciones de Buses a Trabajadores
- ✅ Selector de turnos (Mañana/Tarde/Noche)
- ✅ Visualización por pestañas
- ✅ Filtros por estado activo

**Validaciones:**
- Solo trabajadores activos
- Solo roles/buses activos
- No duplicar asignaciones activas
- Turnos válidos para buses

## 🎨 Características de UI/UX

### Diseño Moderno
- ✨ Interfaz limpia y profesional
- 🎯 Gradientes y sombras elegantes
- 🔄 Animaciones suaves
- 📱 Completamente responsive

### Componentes
- 🔘 Botones con efectos hover
- 📋 Tablas con hover en filas
- 🎭 Modales con backdrop blur
- 🔍 Buscadores en tiempo real
- 🏷️ Badges de estado coloridos
- ⚡ Loading spinners animados

### Paleta de Colores
- **Primario:** Gradiente púrpura (#667eea → #764ba2)
- **Éxito:** Verde (#28a745)
- **Peligro:** Rojo (#dc3545)
- **Advertencia:** Amarillo (#ffc107)
- **Info:** Azul (#17a2b8)

## 🔌 Integración con la API

### Configuración de Axios

```javascript
// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

### Servicios Disponibles

```javascript
// Autenticación
authService.login(username, password)
authService.logout()
authService.isAuthenticated()
authService.getUsername()

// Trabajadores
trabajadoresService.getAll()
trabajadoresService.getById(id)
trabajadoresService.create(data)
trabajadoresService.update(id, data)
trabajadoresService.delete(id)

// Buses
busesService.getAll()
busesService.create(data)
busesService.update(id, data)
busesService.delete(id)

// Roles
rolesService.getAll()
rolesService.create(data)
rolesService.update(id, data)
rolesService.delete(id)

// Asignaciones
asignacionesService.getRoles()
asignacionesService.getBuses()
asignacionesService.createRol(data)
asignacionesService.createBus(data)
asignacionesService.deleteRol(id)
asignacionesService.deleteBus(id)

// Estadísticas
statsService.getAll()
```

## 🧪 Testing

### Ejecutar tests

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm test -- --coverage
```

## 📦 Build para Producción

### Crear build optimizado

```bash
npm run build
```

Esto generará una carpeta `build/` con los archivos optimizados listos para deploy.

### Servir build localmente

```bash
npx serve -s build
```

## 🚨 Manejo de Errores

### Errores de Conexión

```javascript
try {
  const data = await trabajadoresService.getAll();
} catch (error) {
  alert('Error al cargar trabajadores');
}
```

### Validaciones de Formulario

```javascript
if (formData.edad < 18) {
  alert('La edad debe ser mayor a 18 años');
  return;
}
```

### Sesión Expirada

Si el token expira, el usuario es redirigido automáticamente al login.

## 🔧 Configuración Adicional

### Proxy para Desarrollo

En `package.json`:

```json
{
  "proxy": "http://127.0.0.1:8000"
}
```

Esto evita problemas de CORS en desarrollo.

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

Y úsalo en `api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
```

## 📱 Responsive Design

La aplicación es completamente responsive:

- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

### Breakpoints

```css
@media (max-width: 1024px) { /* Tablets */ }
@media (max-width: 768px) { /* Mobile */ }
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to API"

1. Verifica que la API Django esté corriendo en `http://localhost:8000`
2. Revisa que CORS esté configurado correctamente en Django
3. Verifica la URL en `src/services/api.js`

### Error: "Token not found"

1. Haz logout y vuelve a hacer login
2. Limpia el localStorage: `localStorage.clear()`
3. Verifica que el usuario exista en la base de datos

### Error de compilación

```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos Adicionales

- [Documentación React](https://react.dev/)
- [Documentación Axios](https://axios-http.com/)
- [API REST Documentation](http://localhost:8000/swagger/)
