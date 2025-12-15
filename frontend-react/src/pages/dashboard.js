import React, { useState, useEffect } from 'react';
import { statsService } from '../services/api';
import './dashboard.css';

function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    trabajadores: 0,
    buses: 0,
    roles: 0,
    asignaciones: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsService.getAll();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'trabajadores',
      title: 'Trabajadores',
      icon: '👷',
      count: stats.trabajadores,
      color: 'blue',
      description: 'Personal registrado',
    },
    {
      id: 'buses',
      title: 'Buses',
      icon: '🚌',
      count: stats.buses,
      color: 'green',
      description: 'Flota de vehículos',
    },
    {
      id: 'roles',
      title: 'Roles',
      icon: '👔',
      count: stats.roles,
      color: 'yellow',
      description: 'Roles disponibles',
    },
    {
      id: 'asignaciones',
      title: 'Asignaciones',
      icon: '📋',
      count: stats.asignaciones,
      color: 'red',
      description: 'Asignaciones activas',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Principal</h1>
        <p>Resumen general del sistema de gestión</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.id} className={`stat-card stat-${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-content">
              <div className="stat-number">{card.count}</div>
              <div className="stat-title">{card.title}</div>
              <div className="stat-description">{card.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="actions-grid">
        {cards.map((card) => (
          <button
            key={card.id}
            className="action-card"
            onClick={() => onNavigate(card.id)}
          >
            <div className="action-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>Gestionar {card.title.toLowerCase()}</p>
            <div className="action-arrow">→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;