import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
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

// ==================== AUTENTICACIÓN ====================

export const authService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login/`, {
      username,
      password,
    });
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    localStorage.clear();
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUsername: () => {
    return localStorage.getItem('username') || 'Usuario';
  },
};

// ==================== TRABAJADORES ====================

export const trabajadoresService = {
  getAll: async () => {
    const response = await api.get('/trabajadores/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/trabajadores/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/trabajadores/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/trabajadores/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/trabajadores/${id}/`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/trabajadores/?search=${query}`);
    return response.data;
  },
};

// ==================== BUSES ====================

export const busesService = {
  getAll: async () => {
    const response = await api.get('/buses/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/buses/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/buses/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/buses/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/buses/${id}/`);
    return response.data;
  },
};

// ==================== ROLES ====================

export const rolesService = {
  getAll: async () => {
    const response = await api.get('/roles/');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/roles/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/roles/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/roles/${id}/`);
    return response.data;
  },
};

// ==================== ASIGNACIONES ====================

export const asignacionesService = {
  getRoles: async () => {
    const response = await api.get('/asignaciones-rol/');
    return response.data;
  },

  getBuses: async () => {
    const response = await api.get('/asignaciones-bus/');
    return response.data;
  },

  createRol: async (data) => {
    const response = await api.post('/asignaciones-rol/', data);
    return response.data;
  },

  createBus: async (data) => {
    const response = await api.post('/asignaciones-bus/', data);
    return response.data;
  },

  deleteRol: async (id) => {
    const response = await api.delete(`/asignaciones-rol/${id}/`);
    return response.data;
  },

  deleteBus: async (id) => {
    const response = await api.delete(`/asignaciones-bus/${id}/`);
    return response.data;
  },
};

// ==================== ESTADÍSTICAS ====================

export const statsService = {
  getAll: async () => {
    const [trabajadores, buses, roles, asignaciones] = await Promise.all([
      trabajadoresService.getAll(),
      busesService.getAll(),
      rolesService.getAll(),
      asignacionesService.getBuses(),
    ]);

    return {
      trabajadores: trabajadores.length,
      buses: buses.length,
      roles: roles.length,
      asignaciones: asignaciones.length,
    };
  },
};

export default api;