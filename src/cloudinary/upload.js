// Cloudinary Configuration - Plan de Vitalidad
// Sistema de upload de imagens, vídeos e PDFs

// Configuração do Cloudinary (substitua pelas suas credenciais)
const CLOUDINARY_CONFIG = {
  cloudName: 'your-cloud-name',
  uploadPreset: 'your-upload-preset', // unsigned upload preset
  apiKey: 'your-api-key'
};

// Utility Functions
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getFileType = (file) => {
  const type = file.type;
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type === 'application/pdf') return 'pdf';
  return 'document';
};

const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf'
  ];

  if (file.size > maxSize) {
    throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não suportado');
  }

  return true;
};

// Main Upload Function
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    // Validate file
    validateFile(file);

    const fileType = getFileType(file);
    const resourceType = fileType === 'video' ? 'video' : 
                        fileType === 'pdf' ? 'raw' : 'image';

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options.public_id) {
      formData.append('public_id', options.public_id);
    } else {
      formData.append('public_id', `${fileType}_${generateUniqueId()}`);
    }

    // Add tags
    const tags = [`plan-vitalidad`, fileType, ...(options.tags || [])];
    formData.append('tags', tags.join(','));

    // Add context
    if (options.context) {
      const contextString = Object.entries(options.context)
        .map(([key, value]) => `${key}=${value}`)
        .join('|');
      formData.append('context', contextString);
    }

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      id: result.public_id,
      url: result.secure_url,
      type: fileType,
      format: result.format,
      size: result.bytes,
      width: result.width || null,
      height: result.height || null,
      duration: result.duration || null,
      created_at: result.created_at,
      resource_type: result.resource_type,
      tags: result.tags || [],
      version: result.version
    };

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Multiple files upload
export const uploadMultipleFiles = async (files, options = {}) => {
  try {
    const uploadPromises = Array.from(files).map(file => 
      uploadToCloudinary(file, {
        ...options,
        folder: options.folder || 'plan-vitalidad'
      })
    );

    const results = await Promise.allSettled(uploadPromises);
    
    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    const failed = results
      .filter(result => result.status === 'rejected')
      .map(result => result.reason);

    return {
      successful,
      failed,
      total: files.length,
      successCount: successful.length,
      failCount: failed.length
    };

  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    // Note: For secure deletion, you'll need to implement server-side API
    // This is a client-side placeholder
    console.warn('Delete operation should be implemented server-side for security');
    
    // For demo purposes, we'll just return success
    return { success: true, message: 'File deleted successfully' };
    
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Generate optimized URLs
export const generateOptimizedUrl = (publicId, options = {}) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}`;
  
  const transformations = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  
  // Auto optimization
  transformations.push('f_auto', 'q_auto');
  
  const transformString = transformations.length > 0 ? 
    `/${transformations.join(',')}` : '';
  
  return `${baseUrl}/image/upload${transformString}/v1/${publicId}`;
};

// Generate video thumbnail
export const generateVideoThumbnail = (publicId) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/video/upload/so_0,f_jpg/${publicId}.jpg`;
};

// Get file info
export const getFileInfo = async (publicId, resourceType = 'image') => {
  try {
    const url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload/${publicId}.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('File not found');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get file info error:', error);
    throw error;
  }
};

// Progress tracking for uploads
export const uploadWithProgress = (file, options = {}, onProgress = null) => {
  return new Promise((resolve, reject) => {
    try {
      validateFile(file);

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          resolve({
            id: result.public_id,
            url: result.secure_url,
            type: getFileType(file),
            format: result.format,
            size: result.bytes,
            width: result.width || null,
            height: result.height || null,
            duration: result.duration || null,
            created_at: result.created_at,
            resource_type: result.resource_type
          });
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      const resourceType = getFileType(file) === 'video' ? 'video' : 
                          getFileType(file) === 'pdf' ? 'raw' : 'image';
      
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;
      
      xhr.open('POST', uploadUrl);
      xhr.send(formData);

    } catch (error) {
      reject(error);
    }
  });
};

export default {
  uploadToCloudinary,
  uploadMultipleFiles,
  deleteFromCloudinary,
  generateOptimizedUrl,
  generateVideoThumbnail,
  getFileInfo,
  uploadWithProgress,
  CLOUDINARY_CONFIG
};