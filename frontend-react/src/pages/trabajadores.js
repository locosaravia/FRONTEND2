import React, { useState, useEffect } from 'react';
import { trabajadoresService } from '../services/api';
import './trabajadores.css';

function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: 18,
    contacto: '',
    direccion: '',
    activo: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(trabajadores);
    } else {
      const result = trabajadores.filter(
        (t) =>
          t.nombre.toLowerCase().includes(search.toLowerCase()) ||
          t.apellido.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(result);
    }
  }, [search, trabajadores]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await trabajadoresService.getAll();
      setTrabajadores(data);
      setFiltered(data);
    } catch (error) {
      alert('Error al cargar trabajadores');
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
        edad: parseInt(formData.edad),
      };

      if (editing) {
        await trabajadoresService.update(editing, dataToSend);
        alert('Trabajador actualizado');
      } else {
        await trabajadoresService.create(dataToSend);
        alert('Trabajador creado');
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      alert('Error: ' + JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este trabajador?')) return;

    try {
      await trabajadoresService.delete(id);
      alert('Trabajador eliminado');
      loadData();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleEdit = (trabajador) => {
    setEditing(trabajador.id);
    setFormData({
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      edad: trabajador.edad,
      contacto: trabajador.contacto,
      direccion: trabajador.direccion,
      activo: trabajador.activo,
    });
    setShowModal(true);
  };

  const handleNew = () => {
    setEditing(null);
    setFormData({
      nombre: '',
      apellido: '',
      edad: 18,
      contacto: '',
      direccion: '',
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
          <p>Cargando trabajadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>👷 Gestión de Trabajadores</h1>
          <p>Administra el personal del sistema</p>
        </div>
        <button onClick={handleNew} className="btn btn-primary">
          ➕ Nuevo Trabajador
        </button>
      </div>

      <div className="page-content">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Buscar trabajador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No hay trabajadores
                  </td>
                </tr>
              ) : (
                filtered.map((trabajador) => (
                  <tr key={trabajador.id}>
                    <td>{trabajador.id}</td>
                    <td>{trabajador.nombre}</td>
                    <td>{trabajador.apellido}</td>
                    <td>{trabajador.edad}</td>
                    <td>{trabajador.contacto}</td>
                    <td>
                      <span className={`badge ${trabajador.activo ? 'badge-success' : 'badge-danger'}`}>
                        {trabajador.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(trabajador)} className="btn-icon btn-warning">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(trabajador.id)} className="btn-icon btn-danger">
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
              <h2>{editing ? 'Editar' : 'Nuevo'} Trabajador</h2>
              <button onClick={handleCloseModal} className="close-button">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Apellido</label>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Edad</label>
                <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} min="18" max="70" required />
              </div>

              <div className="form-group">
                <label>Contacto</label>
                <input type="text" name="contacto" value={formData.contacto} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trabajadores;