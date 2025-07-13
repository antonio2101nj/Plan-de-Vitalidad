// UserPanel Page - Plan de Vitalidad
// Painel do usuário para visualizar arquivos

import React, { useState } from 'react';
import { logoutUser } from '../firebase/firebase-config.js';
import FileViewer from '../components/FileViewer.jsx';

const UserPanel = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { id: 'materials', label: 'Materiais', icon: '📚' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'progress', label: 'Progresso', icon: '📈' },
    { id: 'notifications', label: 'Notificações', icon: '🔔' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'materials':
        return (
          <div>
            <h2>Materiais Disponíveis</h2>
            <p>Acesse todos os materiais enviados pelo seu coach</p>
            <FileViewer userRole="user" />
          </div>
        );
      case 'profile':
        return (
          <div>
            <h2>Meu Perfil</h2>
            <div className="profile-card">
              <div className="profile-avatar">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div className="profile-info">
                <h3>{user?.displayName || 'Usuário'}</h3>
                <p>{user?.email}</p>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-label">Membro desde:</span>
                    <span className="stat-value">
                      {user?.metadata?.creationTime 
                        ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR')
                        : 'Recente'
                      }
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Último acesso:</span>
                    <span className="stat-value">
                      {user?.metadata?.lastSignInTime 
                        ? new Date(user.metadata.lastSignInTime).toLocaleDateString('pt-BR')
                        : 'Hoje'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div>
            <h2>Meu Progresso</h2>
            <div className="progress-cards">
              <div className="progress-card">
                <div className="progress-icon">📊</div>
                <div className="progress-info">
                  <h3>Materiais Visualizados</h3>
                  <p>Em desenvolvimento</p>
                </div>
              </div>
              <div className="progress-card">
                <div className="progress-icon">⭐</div>
                <div className="progress-info">
                  <h3>Conquistas</h3>
                  <p>Em desenvolvimento</p>
                </div>
              </div>
              <div className="progress-card">
                <div className="progress-icon">🎯</div>
                <div className="progress-info">
                  <h3>Metas</h3>
                  <p>Em desenvolvimento</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div>
            <h2>Notificações</h2>
            <div className="notification-item">
              <div className="notification-icon">🔔</div>
              <div className="notification-content">
                <h3>Bem-vindo ao Plan de Vitalidad!</h3>
                <p>Explore os materiais disponíveis e inicie sua jornada de bem-estar.</p>
                <span className="notification-time">Agora</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-panel">
      <style>{`
        .user-panel {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 32px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .sidebar-logo {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .sidebar-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .sidebar-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .sidebar-nav {
          padding: 24px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s;
          border-left: 4px solid transparent;
          margin: 4px 0;
        }

        .nav-item:hover {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .nav-item.active {
          background: rgba(16, 185, 129, 0.15);
          color: #059669;
          border-left-color: #10b981;
        }

        .nav-item-icon {
          font-size: 24px;
        }

        .nav-item-label {
          font-weight: 500;
          font-size: 16px;
        }

        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .user-details h4 {
          margin: 0;
          font-size: 16px;
          color: #1e293b;
        }

        .user-details p {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #64748b;
        }

        .logout-button {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .logout-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }

        .main-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          min-height: calc(100vh - 64px);
        }

        .content-wrapper h2 {
          margin: 0 0 8px 0;
          font-size: 32px;
          color: #1e293b;
        }

        .content-wrapper p {
          margin: 0 0 24px 0;
          color: #64748b;
          font-size: 16px;
        }

        .profile-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          margin-top: 24px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 32px;
          margin-bottom: 24px;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .profile-info h3 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #1e293b;
        }

        .profile-info p {
          margin: 0 0 24px 0;
          color: #64748b;
          font-size: 16px;
        }

        .profile-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .stat:last-child {
          border-bottom: none;
        }

        .stat-label {
          color: #64748b;
          font-weight: 500;
        }

        .stat-value {
          color: #1e293b;
          font-weight: 600;
        }

        .progress-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .progress-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s;
        }

        .progress-card:hover {
          transform: translateY(-4px);
        }

        .progress-icon {
          font-size: 40px;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          padding: 16px;
          border-radius: 12px;
        }

        .progress-info h3 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 18px;
        }

        .progress-info p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .notification-item {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-top: 20px;
        }

        .notification-icon {
          font-size: 24px;
          background: #f0f9ff;
          padding: 12px;
          border-radius: 8px;
        }

        .notification-content h3 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 16px;
        }

        .notification-content p {
          margin: 0 0 8px 0;
          color: #64748b;
          font-size: 14px;
        }

        .notification-time {
          color: #9ca3af;
          font-size: 12px;
        }

        .mobile-menu-button {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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

          .content-wrapper {
            padding: 20px;
          }

          .content-wrapper h2 {
            font-size: 24px;
          }

          .progress-cards {
            grid-template-columns: 1fr;
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
          <div className="sidebar-logo">🌱</div>
          <div className="sidebar-title">Plan de Vitalidad</div>
          <div className="sidebar-subtitle">Sua jornada de bem-estar</div>
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
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="user-details">
              <h4>{user?.displayName || 'Usuário'}</h4>
              <p>{user?.email}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;