// FileUploader Component - Plan de Vitalidad
// Componente para upload de arquivos no painel administrativo

import React, { useState, useRef } from 'react';
import { uploadToCloudinary, uploadMultipleFiles, uploadWithProgress } from '../cloudinary/upload.js';
import { addMedia } from '../firebase/firebase-config.js';

const FileUploader = ({ onUploadComplete, onUploadError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadResults = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        try {
          const result = await uploadWithProgress(
            file,
            {
              folder: 'plan-vitalidad',
              tags: ['admin-upload', new Date().toISOString().split('T')[0]]
            },
            (progress) => {
              const overallProgress = ((i * 100) + progress) / selectedFiles.length;
              setUploadProgress(overallProgress);
            }
          );

          // Save metadata to Firestore
          await addMedia({
            cloudinaryId: result.id,
            url: result.url,
            type: result.type,
            format: result.format,
            size: result.size,
            width: result.width,
            height: result.height,
            duration: result.duration,
            title: file.name,
            description: '',
            tags: ['admin-upload'],
            isActive: true,
            uploadedBy: 'admin' // You can get this from auth context
          });

          uploadResults.push(result);

        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          if (onUploadError) {
            onUploadError(error, file.name);
          }
        }
      }

      setUploadProgress(100);
      
      if (onUploadComplete) {
        onUploadComplete(uploadResults);
      }

      // Reset
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/gif':
      case 'image/webp':
        return '🖼️';
      case 'video/mp4':
      case 'video/webm':
      case 'video/ogg':
        return '🎥';
      case 'application/pdf':
        return '📄';
      default:
        return '📎';
    }
  };

  return (
    <div className="file-uploader">
      <style>{`
        .file-uploader {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        .upload-area:hover, .upload-area.drag-over {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .upload-area.drag-over {
          border-color: #059669;
          background: #ecfdf5;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .upload-text {
          color: #374151;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .upload-subtext {
          color: #6b7280;
          font-size: 14px;
        }

        .file-input {
          display: none;
        }

        .selected-files {
          margin-top: 20px;
        }

        .file-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: #f3f4f6;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .file-info {
          flex: 1;
          margin-left: 12px;
        }

        .file-name {
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }

        .file-size {
          color: #6b7280;
          font-size: 14px;
        }

        .remove-btn {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 12px;
        }

        .remove-btn:hover {
          background: #dc2626;
        }

        .upload-btn {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 16px;
          width: 100%;
          transition: background 0.2s;
        }

        .upload-btn:hover:not(:disabled) {
          background: #059669;
        }

        .upload-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 16px;
        }

        .progress-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          margin-top: 8px;
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>

      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">☁️</div>
        <div className="upload-text">
          Arraste e solte arquivos aqui
        </div>
        <div className="upload-subtext">
          ou clique para selecionar
        </div>
        <div className="upload-subtext" style={{ marginTop: '8px' }}>
          Suporte: JPG, PNG, GIF, MP4, PDF (máx. 10MB)
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        onChange={handleInputChange}
        className="file-input"
      />

      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h3>Arquivos selecionados:</h3>
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <span style={{ fontSize: '24px' }}>
                {getFileIcon(file.type)}
              </span>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-size">{formatFileSize(file.size)}</div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="remove-btn"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <button
          onClick={uploadFiles}
          disabled={uploading}
          className="upload-btn"
        >
          {uploading ? 'Enviando...' : `Enviar ${selectedFiles.length} arquivo(s)`}
        </button>
      )}

      {uploading && (
        <div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="progress-text">
            {Math.round(uploadProgress)}% concluído
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;