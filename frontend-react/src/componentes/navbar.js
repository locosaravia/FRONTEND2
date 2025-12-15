import React from 'react';
import { authService } from '../services/api';
import './navbar.css';

function Navbar({ currentView, onViewChange, onLogout }) {
  const username = authService.getUsername();

  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de cerrar sesión?')) {
      await authService.logout();
      onLogout();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'trabajadores', label: 'Trabajadores', icon: '👷' },
    { id: 'buses', label: 'Buses', icon: '🚌' },
    { id: 'roles', label: 'Roles', icon: '👔' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onViewChange('dashboard')}>
          <span className="brand-icon">🚌</span>
          <span className="brand-text">Sistema de Buses</span>
        </div>

        <div className="navbar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;