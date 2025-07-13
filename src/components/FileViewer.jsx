// FileViewer Component - Plan de Vitalidad
// Componente para visualizar arquivos no painel do usuário

import React, { useState, useEffect } from 'react';
import { subscribeToMedia } from '../firebase/firebase-config.js';
import { generateOptimizedUrl, generateVideoThumbnail } from '../cloudinary/upload.js';

const FileViewer = ({ userRole = 'user' }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToMedia((mediaData) => {
      setMedia(mediaData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMedia = media.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch && item.isActive;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMediaItem = (item) => {
    const { type, url, title, description, width, height, duration, size, createdAt, cloudinaryId } = item;

    switch (type) {
      case 'image':
        return (
          <div className="media-item" onClick={() => openModal(item)}>
            <div className="media-preview">
              <img 
                src={generateOptimizedUrl(cloudinaryId, { width: 300, height: 200, crop: 'fill' })} 
                alt={title}
                loading="lazy"
              />
              <div className="media-overlay">
                <span className="media-type">🖼️</span>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{title}</h3>
              {description && <p className="media-description">{description}</p>}
              <div className="media-meta">
                <span>{width}x{height}</span>
                <span>{formatFileSize(size)}</span>
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="media-item" onClick={() => openModal(item)}>
            <div className="media-preview">
              <img 
                src={generateVideoThumbnail(cloudinaryId)}
                alt={title}
                loading="lazy"
              />
              <div className="media-overlay">
                <span className="media-type">▶️</span>
                {duration && <span className="duration">{Math.round(duration)}s</span>}
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{title}</h3>
              {description && <p className="media-description">{description}</p>}
              <div className="media-meta">
                <span>{width}x{height}</span>
                <span>{formatFileSize(size)}</span>
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="media-item" onClick={() => openModal(item)}>
            <div className="media-preview pdf-preview">
              <div className="pdf-icon">📄</div>
              <div className="media-overlay">
                <span className="media-type">PDF</span>
              </div>
            </div>
            <div className="media-info">
              <h3 className="media-title">{title}</h3>
              {description && <p className="media-description">{description}</p>}
              <div className="media-meta">
                <span>{formatFileSize(size)}</span>
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!selectedMedia) return null;

    const { type, url, title, description, cloudinaryId } = selectedMedia;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="close-btn" onClick={closeModal}>✕</button>
          </div>
          
          <div className="modal-body">
            {type === 'image' && (
              <img 
                src={generateOptimizedUrl(cloudinaryId, { width: 800, quality: 90 })}
                alt={title}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            )}
            
            {type === 'video' && (
              <video
                src={url}
                controls
                style={{ maxWidth: '100%', maxHeight: '70vh' }}
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            )}
            
            {type === 'pdf' && (
              <iframe
                src={url}
                style={{ width: '100%', height: '70vh', border: 'none' }}
                title={title}
              />
            )}
          </div>
          
          {description && (
            <div className="modal-description">
              <p>{description}</p>
            </div>
          )}
          
          <div className="modal-actions">
            <button 
              className="download-btn"
              onClick={() => downloadFile(url, title)}
            >
              📥 Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="file-viewer">
      <style>{`
        .file-viewer {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .viewer-title {
          font-size: 24px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .viewer-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          min-width: 200px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .media-item {
          background: #f9fafb;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #e5e7eb;
        }

        .media-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .media-preview {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .media-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pdf-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
        }

        .pdf-icon {
          font-size: 64px;
        }

        .media-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .media-type {
          font-size: 16px;
        }

        .duration {
          font-size: 12px;
        }

        .media-info {
          padding: 16px;
        }

        .media-title {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .media-description {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .media-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #9ca3af;
          flex-wrap: wrap;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          color: #374151;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .close-btn:hover {
          color: #374151;
        }

        .modal-body {
          padding: 20px;
          text-align: center;
        }

        .modal-description {
          padding: 0 20px;
          border-top: 1px solid #e5e7eb;
        }

        .modal-description p {
          color: #6b7280;
          line-height: 1.6;
        }

        .modal-actions {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .download-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .download-btn:hover {
          background: #059669;
        }

        @media (max-width: 768px) {
          .media-grid {
            grid-template-columns: 1fr;
          }
          
          .viewer-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .viewer-controls {
            justify-content: stretch;
          }
          
          .search-input {
            flex: 1;
            min-width: unset;
          }
        }
      `}</style>

      <div className="viewer-header">
        <h1 className="viewer-title">
          {userRole === 'admin' ? 'Gerenciar Mídia' : 'Materiais Disponíveis'}
        </h1>
        <div className="viewer-controls">
          <input
            type="text"
            placeholder="Buscar arquivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os tipos</option>
            <option value="image">Imagens</option>
            <option value="video">Vídeos</option>
            <option value="pdf">PDFs</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div>Carregando...</div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>Nenhum arquivo encontrado</h3>
          <p>
            {searchTerm || filter !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Nenhum arquivo foi enviado ainda'
            }
          </p>
        </div>
      ) : (
        <div className="media-grid">
          {filteredMedia.map((item) => (
            <div key={item.id}>
              {renderMediaItem(item)}
            </div>
          ))}
        </div>
      )}

      {renderModal()}
    </div>
  );
};

export default FileViewer;