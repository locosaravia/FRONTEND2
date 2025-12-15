import React, { useState, useEffect } from 'react';
import { asignacionesService, trabajadoresService, rolesService, busesService } from '../services/api';
import './trabajadores.css';

function Asignaciones() {
  const [activeTab, setActiveTab] = useState('roles'); // 'roles' o 'buses'
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Catálogos
  const [trabajadores, setTrabajadores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [buses, setBuses] = useState([]);

  // Form data para asignación de rol
  const [formRol, setFormRol] = useState({
    trabajador: '',
    rol: '',
    activo: true,
    notas: ''
  });

  // Form data para asignación de bus
  const [formBus, setFormBus] = useState({
    trabajador: '',
    bus: '',
    turno: 'MAÑANA',
    activo: true,
    notas: ''
  });

  useEffect(() => {
    loadData();
    loadCatalogos();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'roles') {
        const data = await asignacionesService.getRoles();
        setAsignaciones(data);
      } else {
        const data = await asignacionesService.getBuses();
        setAsignaciones(data);
      }
    } catch (error) {
      alert('Error al cargar asignaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogos = async () => {
    try {
      const [trabData, rolesData, busesData] = await Promise.all([
        trabajadoresService.getAll(),
        rolesService.getAll(),
        busesService.getAll()
      ]);
      setTrabajadores(trabData.filter(t => t.activo));
      setRoles(rolesData.filter(r => r.activo));
      setBuses(busesData.filter(b => b.activo));
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
    }
  };

  const handleSubmitRol = async (e) => {
    e.preventDefault();
    try {
      await asignacionesService.createRol({
        trabajador: parseInt(formRol.trabajador),
        rol: parseInt(formRol.rol),
        activo: formRol.activo,
        notas: formRol.notas
      });
      alert('Asignación de rol creada');
      handleCloseModal();
      loadData();
    } catch (error) {
      alert('Error: ' + JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleSubmitBus = async (e) => {
    e.preventDefault();
    try {
      await asignacionesService.createBus({
        trabajador: parseInt(formBus.trabajador),
        bus: parseInt(formBus.bus),
        turno: formBus.turno,
        activo: formBus.activo,
        notas: formBus.notas
      });
      alert('Asignación de bus creada');
      handleCloseModal();
      loadData();
    } catch (error) {
      alert('Error: ' + JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta asignación?')) return;

    try {
      if (activeTab === 'roles') {
        await asignacionesService.deleteRol(id);
      } else {
        await asignacionesService.deleteBus(id);
      }
      alert('Asignación eliminada');
      loadData();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleNew = () => {
    if (activeTab === 'roles') {
      setFormRol({
        trabajador: '',
        rol: '',
        activo: true,
        notas: ''
      });
    } else {
      setFormBus({
        trabajador: '',
        bus: '',
        turno: 'MAÑANA',
        activo: true,
        notas: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Cargando asignaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>📋 Gestión de Asignaciones</h1>
          <p>Asigna roles y buses a trabajadores</p>
        </div>
        <button onClick={handleNew} className="btn btn-primary">
          ➕ Nueva Asignación
        </button>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('roles')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '10px',
            background: activeTab === 'roles' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0',
            color: activeTab === 'roles' ? 'white' : '#666',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          👔 Asignaciones de Roles
        </button>
        <button
          onClick={() => setActiveTab('buses')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '10px',
            background: activeTab === 'buses' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e0e0',
            color: activeTab === 'buses' ? 'white' : '#666',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          🚌 Asignaciones de Buses
        </button>
      </div>

      <div className="page-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Trabajador</th>
                <th>{activeTab === 'roles' ? 'Rol' : 'Bus'}</th>
                {activeTab === 'buses' && <th>Turno</th>}
                <th>Fecha Asignación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'buses' ? '7' : '6'} className="no-data">
                    No hay asignaciones registradas
                  </td>
                </tr>
              ) : (
                asignaciones.map((asig) => (
                  <tr key={asig.id}>
                    <td>{asig.id}</td>
                    <td className="font-semibold">
                      {asig.trabajador_nombre} {asig.trabajador_apellido}
                    </td>
                    <td>
                      {activeTab === 'roles' 
                        ? asig.rol_nombre 
                        : `${asig.bus_patente} - ${asig.bus_modelo}`
                      }
                    </td>
                    {activeTab === 'buses' && (
                      <td>
                        <span className="badge badge-info">{asig.turno_display}</span>
                      </td>
                    )}
                    <td>{new Date(asig.fecha_asignacion).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${asig.activo ? 'badge-success' : 'badge-danger'}`}>
                        {asig.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(asig.id)} className="btn-icon btn-danger">
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

      {/* Modal para asignación de ROL */}
      {showModal && activeTab === 'roles' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Asignación de Rol</h2>
              <button onClick={handleCloseModal} className="close-button">✕</button>
            </div>

            <form onSubmit={handleSubmitRol} className="modal-form">
              <div className="form-group">
                <label>Trabajador <span className="required">*</span></label>
                <select
                  name="trabajador"
                  value={formRol.trabajador}
                  onChange={(e) => setFormRol({...formRol, trabajador: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                >
                  <option value="">Seleccione un trabajador</option>
                  {trabajadores.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} {t.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rol <span className="required">*</span></label>
                <select
                  name="rol"
                  value={formRol.rol}
                  onChange={(e) => setFormRol({...formRol, rol: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  name="notas"
                  value={formRol.notas}
                  onChange={(e) => setFormRol({...formRol, notas: e.target.value})}
                  placeholder="Notas adicionales..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para asignación de BUS */}
      {showModal && activeTab === 'buses' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Asignación de Bus</h2>
              <button onClick={handleCloseModal} className="close-button">✕</button>
            </div>

            <form onSubmit={handleSubmitBus} className="modal-form">
              <div className="form-group">
                <label>Trabajador <span className="required">*</span></label>
                <select
                  name="trabajador"
                  value={formBus.trabajador}
                  onChange={(e) => setFormBus({...formBus, trabajador: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                >
                  <option value="">Seleccione un trabajador</option>
                  {trabajadores.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} {t.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bus <span className="required">*</span></label>
                <select
                  name="bus"
                  value={formBus.bus}
                  onChange={(e) => setFormBus({...formBus, bus: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                >
                  <option value="">Seleccione un bus</option>
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.patente} - {b.modelo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Turno <span className="required">*</span></label>
                <select
                  name="turno"
                  value={formBus.turno}
                  onChange={(e) => setFormBus({...formBus, turno: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                >
                  <option value="MAÑANA">Mañana</option>
                  <option value="TARDE">Tarde</option>
                  <option value="NOCHE">Noche</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  name="notas"
                  value={formBus.notas}
                  onChange={(e) => setFormBus({...formBus, notas: e.target.value})}
                  placeholder="Notas adicionales..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Asignar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Asignaciones;