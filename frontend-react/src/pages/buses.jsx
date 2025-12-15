import React, { useState, useEffect } from 'react';
import { busesService } from '../services/api';
import './trabajadores.css';

function Buses() {
  const [buses, setBuses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    patente: '',
    modelo: '',
    año: new Date().getFullYear(),
    capacidad: 40,
    marca: '',
    activo: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(buses);
    } else {
      const result = buses.filter(
        (b) =>
          b.patente.toLowerCase().includes(search.toLowerCase()) ||
          b.modelo.toLowerCase().includes(search.toLowerCase()) ||
          b.marca.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(result);
    }
  }, [search, buses]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await busesService.getAll();
      setBuses(data);
      setFiltered(data);
    } catch (error) {
      alert('Error al cargar buses');
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
        año: parseInt(formData.año),
        capacidad: parseInt(formData.capacidad),
        patente: formData.patente.toUpperCase(),
      };

      if (editing) {
        await busesService.update(editing, dataToSend);
        alert('Bus actualizado');
      } else {
        await busesService.create(dataToSend);
        alert('Bus creado');
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      alert('Error: ' + JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este bus?')) return;

    try {
      await busesService.delete(id);
      alert('Bus eliminado');
      loadData();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleEdit = (bus) => {
    setEditing(bus.id);
    setFormData({
      patente: bus.patente,
      modelo: bus.modelo,
      año: bus.año,
      capacidad: bus.capacidad,
      marca: bus.marca,
      activo: bus.activo,
    });
    setShowModal(true);
  };

  const handleNew = () => {
    setEditing(null);
    setFormData({
      patente: '',
      modelo: '',
      año: new Date().getFullYear(),
      capacidad: 40,
      marca: '',
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
          <p>Cargando buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🚌 Gestión de Buses</h1>
          <p>Administra la flota de vehículos</p>
        </div>
        <button onClick={handleNew} className="btn btn-primary">
          ➕ Nuevo Bus
        </button>
      </div>

      <div className="page-content">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Buscar bus..."
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
                <th>Patente</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No hay buses registrados
                  </td>
                </tr>
              ) : (
                filtered.map((bus) => (
                  <tr key={bus.id}>
                    <td>{bus.id}</td>
                    <td className="font-semibold">{bus.patente}</td>
                    <td>{bus.marca}</td>
                    <td>{bus.modelo}</td>
                    <td>{bus.año}</td>
                    <td>{bus.capacidad} pax</td>
                    <td>
                      <span className={`badge ${bus.activo ? 'badge-success' : 'badge-danger'}`}>
                        {bus.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(bus)} className="btn-icon btn-warning">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(bus.id)} className="btn-icon btn-danger">
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
              <h2>{editing ? 'Editar' : 'Nuevo'} Bus</h2>
              <button onClick={handleCloseModal} className="close-button">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Patente <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="patente" 
                    value={formData.patente} 
                    onChange={handleInputChange} 
                    placeholder="ABC-123"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Marca <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="marca" 
                    value={formData.marca} 
                    onChange={handleInputChange}
                    placeholder="Mercedes Benz" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Modelo <span className="required">*</span></label>
                <input 
                  type="text" 
                  name="modelo" 
                  value={formData.modelo} 
                  onChange={handleInputChange}
                  placeholder="O500 RS" 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Año <span className="required">*</span></label>
                  <input 
                    type="number" 
                    name="año" 
                    value={formData.año} 
                    onChange={handleInputChange} 
                    min="1990" 
                    max={new Date().getFullYear()} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Capacidad <span className="required">*</span></label>
                  <input 
                    type="number" 
                    name="capacidad" 
                    value={formData.capacidad} 
                    onChange={handleInputChange} 
                    min="10" 
                    max="80" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="activo" 
                    checked={formData.activo} 
                    onChange={handleInputChange} 
                  />
                  Bus activo
                </label>
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

export default Buses;