import React, { useState, useEffect } from 'react';
import { rolesService } from '../services/api';
import './roles.css';

function Roles() {
  const [roles, setRoles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel_acceso: 1,
    activo: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(roles);
    } else {
      const result = roles.filter((r) =>
        r.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(result);
    }
  }, [search, roles]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await rolesService.getAll();
      setRoles(data);
      setFiltered(data);
    } catch (error) {
      alert('Error al cargar roles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        ...formData,
        nivel_acceso: parseInt(formData.nivel_acceso),
      };

      if (editing) {
        await rolesService.update(editing, dataToSend);
        alert('✓ Rol actualizado exitosamente');
      } else {
        await rolesService.create(dataToSend);
        alert('✓ Rol creado exitosamente');
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      const errorMsg = error.response?.data || error.message;
      alert('Error: ' + JSON.stringify(errorMsg));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este rol?')) return;

    try {
      await rolesService.delete(id);
      alert('✓ Rol eliminado exitosamente');
      loadData();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const handleEdit = (rol) => {
    setEditing(rol.id);
    setFormData({
      nombre: rol.nombre,
      descripcion: rol.descripcion || '',
      nivel_acceso: rol.nivel_acceso,
      activo: rol.activo,
    });
    setShowModal(true);
  };

  const handleNew = () => {
    setEditing(null);
    setFormData({
      nombre: '',
      descripcion: '',
      nivel_acceso: 1,
      activo: true,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Cargando roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>👔 Gestión de Roles</h1>
          <p>Administra los roles del sistema</p>
        </div>
        <button onClick={handleNew} className="btn btn-primary">
          ➕ Nuevo Rol
        </button>
      </div>

      <div className="page-content">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="toolbar-info">
            <span className="badge badge-info">{filtered.length} rol(es)</span>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Nivel Acceso</th>
                <th>Asignaciones</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    {search ? '🔍 No se encontraron resultados' : '📭 No hay roles registrados'}
                  </td>
                </tr>
              ) : (
                filtered.map((rol) => (
                  <tr key={rol.id}>
                    <td className="text-center">{rol.id}</td>
                    <td className="font-semibold">{rol.nombre}</td>
                    <td className="text-truncate">{rol.descripcion || 'Sin descripción'}</td>
                    <td className="text-center">Nivel {rol.nivel_acceso}</td>
                    <td className="text-center">{rol.cantidad_asignaciones || 0}</td>
                    <td className="text-center">
                      <span className={`badge ${rol.activo ? 'badge-success' : 'badge-danger'}`}>
                        {rol.activo ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleEdit(rol)} className="btn-icon btn-warning" title="Editar">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(rol.id)} className="btn-icon btn-danger" title="Eliminar">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? '✏️ Editar Rol' : '➕ Nuevo Rol'}</h2>
              <button onClick={handleCloseModal} className="close-button">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nombre <span className="required">*</span></label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Conductor"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Descripción del rol..."
                  style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                />
              </div>

              <div className="form-group">
                <label>Nivel de Acceso <span className="required">*</span></label>
                <input
                  type="number"
                  name="nivel_acceso"
                  value={formData.nivel_acceso}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  required
                />
                <small style={{ color: '#666', fontSize: '13px' }}>1 = Básico, 5 = Máximo</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                  <span>Rol activo</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>💾</span>
                  {editing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roles;