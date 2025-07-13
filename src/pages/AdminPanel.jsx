// AdminPanel Page - Plan de Vitalidad
// Painel administrativo com upload de arquivos

import React, { useState, useEffect } from 'react';
import { logoutUser, getCurrentUser } from '../firebase/firebase-config.js';
import FileUploader from '../components/FileUploader.jsx';
import FileViewer from '../components/FileViewer.jsx';

const AdminPanel = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUploadComplete = (results) => {
    setUploadSuccess(true);
    setUploadMessage(`${results.length} arquivo(s) enviado(s) com sucesso!`);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadMessage('');
    }, 5000);
  };

  const handleUploadError = (error, fileName) => {
    setUploadSuccess(false);
    setUploadMessage(`Erro ao enviar ${fileName || 'arquivo'}: ${error.message}`);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setUploadMessage('');
    }, 5000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'upload', label: 'Upload de Arquivos', icon: '☁️' },
    { id: 'manage', label: 'Gerenciar Mídia', icon: '📁' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Usuários', icon: '👥' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div>
            <h2>Upload de Arquivos</h2>
            <p>Envie imagens, vídeos e PDFs para seus usuários</p>
            <FileUploader
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          </div>
        );
      case 'manage':
        return (
          <div>
            <h2>Gerenciar Mídia</h2>
            <p>Visualize e gerencie todos os arquivos enviados</p>
            <FileViewer userRole="admin" />
          </div>
        );
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard</h2>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Arquivos Total</h3>
                  <p>Em desenvolvimento</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>Usuários Ativos</h3>
                  <p>Em desenvolvimento</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h3>Visualizações</h3>
                  <p>Em desenvolvimento</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div>
            <h2>Gerenciar Usuários</h2>
            <p>Funcionalidade em desenvolvimento</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2>Configurações</h2>
            <p>Funcionalidade em desenvolvimento</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-panel">
      <style>{`
        .admin-panel {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }

        .sidebar-logo-icon {
          font-size: 32px;
        }

        .sidebar-nav {
          padding: 20px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: #f1f5f9;
          color: #334155;
        }

        .nav-item.active {
          background: #f0f9ff;
          color: #0369a1;
          border-left-color: #0369a1;
        }

        .nav-item-icon {
          font-size: 20px;
        }

        .nav-item-label {
          font-weight: 500;
        }

        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .user-details h4 {
          margin: 0;
          font-size: 14px;
          color: #1e293b;
        }

        .user-details p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .logout-button {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
        }

        .logout-button:hover {
          background: #dc2626;
        }

        .main-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .content-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 24px;
        }

        .content-header h2 {
          margin: 0;
          font-size: 28px;
          color: #1e293b;
        }

        .content-header p {
          margin: 8px 0 0 0;
          color: #64748b;
        }

        .success-message {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 32px;
          background: #f0f9ff;
          padding: 12px;
          border-radius: 8px;
        }

        .stat-info h3 {
          margin: 0 0 4px 0;
          color: #1e293b;
          font-size: 16px;
        }

        .stat-info p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .mobile-menu-button {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .mobile-menu-button {
            display: block;
          }

          .mobile-overlay {
            display: block;
          }

          .main-content {
            padding: 80px 16px 16px 16px;
          }
        }
      `}</style>

      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🌱</span>
            <span>Plan de Vitalidad</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.displayName?.[0] || user?.email?.[0] || 'A'}
            </div>
            <div className="user-details">
              <h4>{user?.displayName || 'Administrador'}</h4>
              <p>{user?.email || 'admin@plandevitalidad.com'}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </div>

      <div className="main-content">
        {uploadSuccess && (
          <div className="success-message">
            <span>✅</span>
            <span>{uploadMessage}</span>
          </div>
        )}

        {!uploadSuccess && uploadMessage && (
          <div className="error-message">
            <span>❌</span>
            <span>{uploadMessage}</span>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;