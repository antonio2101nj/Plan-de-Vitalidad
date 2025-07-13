// App.jsx - Plan de Vitalidad
// Aplicação principal com roteamento e autenticação

import React, { useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser, getUserRole } from './firebase/firebase-config.js';
import Login from './pages/Login.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import UserPanel from './pages/UserPanel.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChange(async (authUser) => {
      try {
        if (authUser) {
          const role = await getUserRole(authUser.uid);
          setUser(authUser);
          setUserRole(role);
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Error getting user role:', err);
        setError('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (authUser, role) => {
    setUser(authUser);
    setUserRole(role);
    setError(null);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
    setError(null);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingScreen />;
    }

    if (error) {
      return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
    }

    if (!user) {
      return <Login onLogin={handleLogin} />;
    }

    // Route based on user role
    if (userRole === 'admin') {
      return <AdminPanel user={user} onLogout={handleLogout} />;
    } else {
      return <UserPanel user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="app">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #f8fafc;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Loading Screen Styles */
        .loading-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .loading-logo {
          font-size: 64px;
          margin-bottom: 20px;
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          text-align: center;
        }

        .loading-subtitle {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 32px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error Screen Styles */
        .error-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 20px;
        }

        .error-card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        .error-icon {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .error-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .error-message {
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .error-button {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .error-button:hover {
          background: #059669;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .loading-logo {
            font-size: 48px;
          }

          .loading-title {
            font-size: 24px;
          }

          .loading-subtitle {
            font-size: 16px;
          }

          .error-card {
            padding: 32px 24px;
          }

          .error-icon {
            font-size: 48px;
          }

          .error-title {
            font-size: 20px;
          }
        }

        /* Utility Classes */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Smooth transitions for route changes */
        .app > * {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {renderContent()}
    </div>
  );
};

// Loading Screen Component
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-logo">🌱</div>
    <h1 className="loading-title">Plan de Vitalidad</h1>
    <p className="loading-subtitle">Carregando sua jornada de bem-estar...</p>
    <div className="loading-spinner"></div>
  </div>
);

// Error Screen Component
const ErrorScreen = ({ error, onRetry }) => (
  <div className="error-screen">
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <h1 className="error-title">Oops! Algo deu errado</h1>
      <p className="error-message">
        {error || 'Ocorreu um erro inesperado. Tente novamente.'}
      </p>
      <button className="error-button" onClick={onRetry}>
        Tentar Novamente
      </button>
    </div>
  </div>
);

export default App;