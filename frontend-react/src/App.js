import React, { useState, useEffect } from 'react';
import { authService } from './services/api';
import Login from './componentes/login';
import Navbar from './componentes/navbar';
import Dashboard from './pages/dashboard';
import Trabajadores from './pages/trabajadores';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión activa
    const token = localStorage.getItem('token');
    if (token && authService.isAuthenticated()) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <p>Cargando aplicación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      />

      <main className="app-content">
        {currentView === 'dashboard' && (
          <Dashboard onNavigate={handleViewChange} />
        )}
        
        {currentView === 'trabajadores' && <Trabajadores />}
        
        {currentView === 'buses' && (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <div className="icon">🚌</div>
              <h2>Módulo de Buses</h2>
              <p>Esta funcionalidad está en desarrollo</p>
              <button onClick={() => handleViewChange('dashboard')} className="btn btn-primary">
                Volver al Dashboard
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'roles' && (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <div className="icon">👔</div>
              <h2>Módulo de Roles</h2>
              <p>Esta funcionalidad está en desarrollo</p>
              <button onClick={() => handleViewChange('dashboard')} className="btn btn-primary">
                Volver al Dashboard
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'asignaciones' && (
          <div className="coming-soon">
            <div className="coming-soon-content">
              <div className="icon">📋</div>
              <h2>Módulo de Asignaciones</h2>
              <p>Esta funcionalidad está en desarrollo</p>
              <button onClick={() => handleViewChange('dashboard')} className="btn btn-primary">
                Volver al Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Sistema de Buses v1.0 - React Frontend © 2025</p>
      </footer>
    </div>
  );
}

export default App;