// Login Page - Plan de Vitalidad
// Página de login com Firebase Authentication

import React, { useState, useEffect } from 'react';
import { loginUser, onAuthStateChange, getUserRole } from '../firebase/firebase-config.js';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);
        if (onLogin) {
          onLogin(user, role);
        }
      }
    });

    return () => unsubscribe();
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginUser(email, password);
      const role = await getUserRole(user.uid);
      
      if (onLogin) {
        onLogin(user, role);
      }
    } catch (error) {
      setError(getErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado. Verifique o email.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Tente novamente.';
      case 'auth/invalid-email':
        return 'Email inválido. Verifique o formato.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente em alguns minutos.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet.';
      default:
        return 'Erro no login. Tente novamente.';
    }
  };

  const handleDemoLogin = async (demoType) => {
    const demoAccounts = {
      admin: {
        email: 'admin@plandevitalidad.com',
        password: 'demo123'
      },
      user: {
        email: 'user@plandevitalidad.com',
        password: 'demo123'
      }
    };

    const account = demoAccounts[demoType];
    setEmail(account.email);
    setPassword(account.password);
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      const form = document.getElementById('loginForm');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: #6b7280;
          font-size: 14px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 6px;
          color: #374151;
          font-weight: 500;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .form-checkbox input {
          width: 16px;
          height: 16px;
          accent-color: #10b981;
        }

        .form-checkbox label {
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
        }

        .login-button {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 20px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 20px;
        }

        .login-button:hover:not(:disabled) {
          background: #059669;
        }

        .login-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
          text-align: center;
        }

        .demo-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
          margin-top: 20px;
        }

        .demo-title {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .demo-buttons {
          display: flex;
          gap: 12px;
        }

        .demo-button {
          flex: 1;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .demo-button:hover {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .demo-button.admin {
          background: #fef3c7;
          color: #92400e;
          border-color: #fcd34d;
        }

        .demo-button.admin:hover {
          background: #fde68a;
          border-color: #f59e0b;
        }

        .demo-button.user {
          background: #dbeafe;
          color: #1e40af;
          border-color: #93c5fd;
        }

        .demo-button.user:hover {
          background: #bfdbfe;
          border-color: #3b82f6;
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .footer-text {
          color: #6b7280;
          font-size: 12px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px;
          }
          
          .login-title {
            font-size: 24px;
          }
          
          .demo-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🌱</div>
          <h1 className="login-title">Plan de Vitalidad</h1>
          <p className="login-subtitle">Sua jornada para uma vida mais saudável</p>
        </div>

        <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Sua senha"
              required
              disabled={loading}
            />
          </div>

          <div className="form-checkbox">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="remember">Lembrar-me</label>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="demo-section">
          <div className="demo-title">🚀 Teste rápido</div>
          <div className="demo-buttons">
            <button
              className="demo-button admin"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              👨‍💼 Admin
            </button>
            <button
              className="demo-button user"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
            >
              👤 Usuário
            </button>
          </div>
        </div>

        <div className="footer">
          <p className="footer-text">
            © 2024 Plan de Vitalidad. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;