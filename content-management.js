/**
 * Content Management System
 * Sistema completo de gerenciamento de conteúdos do aplicativo
 */

class ContentManager {
    constructor() {
        this.contents = [];
        this.currentEditingContent = null;
        this.currentView = 'cards';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderStats();
        this.renderContents();
        this.loadDemoData();
    }

    loadData() {
        const savedContents = localStorage.getItem('planVitalidadContents');
        if (savedContents) this.contents = JSON.parse(savedContents);
    }

    saveData() {
        localStorage.setItem('planVitalidadContents', JSON.stringify(this.contents));
    }

    setupEventListeners() {
        // Main controls
        document.getElementById('addContentBtn').addEventListener('click', () => this.openAddContentModal());
        document.getElementById('exportContentsBtn').addEventListener('click', () => this.exportContents());
        document.getElementById('reorderContentsBtn').addEventListener('click', () => this.openReorderModal());
        
        // Search and filters
        this.setupFilterEvents();
        
        // View controls
        this.setupViewControls();
        
        // Modal events
        this.setupModalEvents();
        
        // Rich text editor
        this.setupRichTextEditor();
        
        // Media type selection
        this.setupMediaTypeSelection();
    }

    setupFilterEvents() {
        const filters = [
            'contentSearchInput',
            'contentTypeFilter',
            'contentLanguageFilter', 
            'contentCategoryFilter',
            'contentStatusFilter',
            'contentAccessFilter'
        ];
        
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('input', () => this.filterContents());
                element.addEventListener('change', () => this.filterContents());
            }
        });
    }

    setupViewControls() {
        document.getElementById('contentCardViewBtn').addEventListener('click', () => this.switchView('cards'));
        document.getElementById('contentTableViewBtn').addEventListener('click', () => this.switchView('table'));
    }

    setupModalEvents() {
        // Content Modal
        document.getElementById('contentForm').addEventListener('submit', (e) => this.handleContentSubmit(e));
        document.getElementById('contentModalClose').addEventListener('click', () => this.closeModal('contentModal'));
        document.getElementById('contentModalCancel').addEventListener('click', () => this.closeModal('contentModal'));

        // View Modal
        document.getElementById('viewContentModalClose').addEventListener('click', () => this.closeModal('viewContentModal'));
        document.getElementById('viewContentModalCancel').addEventListener('click', () => this.closeModal('viewContentModal'));
        document.getElementById('editContentFromView').addEventListener('click', () => this.editContentFromView());
        document.getElementById('previewContentBtn').addEventListener('click', () => this.previewContent());

        // Delete Modal
        document.getElementById('confirmDeleteContentClose').addEventListener('click', () => this.closeModal('confirmDeleteContentModal'));
        document.getElementById('confirmDeleteContentCancel').addEventListener('click', () => this.closeModal('confirmDeleteContentModal'));

        // Reorder Modal
        document.getElementById('reorderContentsModalClose').addEventListener('click', () => this.closeModal('reorderContentsModal'));
        document.getElementById('reorderContentsModalCancel').addEventListener('click', () => this.closeModal('reorderContentsModal'));
        document.getElementById('saveReorderBtn').addEventListener('click', () => this.saveReorder());

        // File uploads
        this.setupFileUploads();
    }

    setupRichTextEditor() {
        const toolbar = document.querySelector('.editor-toolbar');
        const editor = document.getElementById('contentDescription');
        
        toolbar.addEventListener('click', (e) => {
            if (e.target.closest('.editor-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.editor-btn');
                const command = btn.dataset.command;
                document.execCommand(command, false, null);
                editor.focus();
            }
        });
    }

    setupMediaTypeSelection() {
        const mediaTypeSelect = document.getElementById('contentMediaType');
        const fileSection = document.getElementById('fileUploadSection');
        const linkSection = document.getElementById('linkSection');
        
        mediaTypeSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            
            if (value === 'file') {
                fileSection.style.display = 'block';
                linkSection.style.display = 'none';
            } else if (value === 'link') {
                fileSection.style.display = 'none';
                linkSection.style.display = 'block';
            } else {
                fileSection.style.display = 'none';
                linkSection.style.display = 'none';
            }
        });
    }

    setupFileUploads() {
        // Main file upload
        const fileUploadArea = document.getElementById('contentFileUploadArea');
        const fileInput = document.getElementById('contentFile');
        
        fileUploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e, 'main'));
        
        // Thumbnail upload
        const thumbnailUploadArea = document.getElementById('contentThumbnailUploadArea');
        const thumbnailInput = document.getElementById('contentThumbnail');
        
        thumbnailUploadArea.addEventListener('click', () => thumbnailInput.click());
        thumbnailInput.addEventListener('change', (e) => this.handleFileUpload(e, 'thumbnail'));
        
        // Drag and drop
        this.setupDragAndDrop(fileUploadArea, fileInput);
        this.setupDragAndDrop(thumbnailUploadArea, thumbnailInput);
    }

    setupDragAndDrop(area, input) {
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('drag-over');
        });
        
        area.addEventListener('dragleave', () => {
            area.classList.remove('drag-over');
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                const type = area.id.includes('Thumbnail') ? 'thumbnail' : 'main';
                this.handleFileUpload({ target: { files } }, type);
            }
        });
    }

    switchView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        const gridContainer = document.getElementById('contentGrid');
        const tableContainer = document.getElementById('contentTableContainer');
        
        if (view === 'cards') {
            gridContainer.style.display = 'grid';
            tableContainer.style.display = 'none';
        } else {
            gridContainer.style.display = 'none';
            tableContainer.style.display = 'block';
        }
        
        this.renderContents();
    }

    renderStats() {
        const totalContents = this.contents.length;
        const activeContents = this.contents.filter(c => c.status === 'active').length;
        const premiumContents = this.contents.filter(c => c.access === 'premium').length;
        const totalViews = this.contents.reduce((sum, c) => sum + (c.views || 0), 0);

        document.getElementById('totalContents').textContent = totalContents;
        document.getElementById('activeContents').textContent = activeContents;
        document.getElementById('premiumContents').textContent = premiumContents;
        document.getElementById('totalViews').textContent = totalViews.toLocaleString();

        // Type counts
        const typeCounts = {
            video: 0,
            pdf: 0,
            image: 0,
            audio: 0,
            link: 0
        };

        this.contents.forEach(content => {
            if (content.mediaType === 'file' && content.fileType) {
                typeCounts[content.fileType]++;
            } else if (content.mediaType === 'link') {
                typeCounts.link++;
            }
        });

        document.getElementById('videoCount').textContent = typeCounts.video;
        document.getElementById('pdfCount').textContent = typeCounts.pdf;
        document.getElementById('imageCount').textContent = typeCounts.image;
        document.getElementById('audioCount').textContent = typeCounts.audio;
        document.getElementById('linkCount').textContent = typeCounts.link;
    }

    filterContents() {
        const searchTerm = document.getElementById('contentSearchInput').value.toLowerCase();
        const typeFilter = document.getElementById('contentTypeFilter').value;
        const languageFilter = document.getElementById('contentLanguageFilter').value;
        const categoryFilter = document.getElementById('contentCategoryFilter').value;
        const statusFilter = document.getElementById('contentStatusFilter').value;
        const accessFilter = document.getElementById('contentAccessFilter').value;

        let filteredContents = this.contents.filter(content => {
            const nameMatch = content.name.toLowerCase().includes(searchTerm) ||
                            (content.description && content.description.toLowerCase().includes(searchTerm));
            const typeMatch = !typeFilter || content.fileType === typeFilter || 
                            (typeFilter === 'link' && content.mediaType === 'link');
            const languageMatch = !languageFilter || content.language === languageFilter;
            const categoryMatch = !categoryFilter || content.category === categoryFilter;
            const statusMatch = !statusFilter || content.status === statusFilter;
            const accessMatch = !accessFilter || content.access === accessFilter;

            return nameMatch && typeMatch && languageMatch && categoryMatch && statusMatch && accessMatch;
        });

        // Sort by order
        filteredContents.sort((a, b) => (a.order || 999) - (b.order || 999));

        this.renderContentsList(filteredContents);
    }

    renderContents() {
        this.filterContents();
    }

    renderContentsList(contents) {
        const gridContainer = document.getElementById('contentGrid');
        const tableContainer = document.getElementById('contentTableContainer');
        const noContentMsg = document.getElementById('noContentMessage');

        if (contents.length === 0) {
            gridContainer.style.display = 'none';
            tableContainer.style.display = 'none';
            noContentMsg.style.display = 'block';
            return;
        }

        noContentMsg.style.display = 'none';

        if (this.currentView === 'cards') {
            gridContainer.style.display = 'grid';
            tableContainer.style.display = 'none';
            this.renderCardsView(contents);
        } else {
            gridContainer.style.display = 'none';
            tableContainer.style.display = 'block';
            this.renderTableView(contents);
        }
    }

    renderCardsView(contents) {
        const container = document.getElementById('contentGrid');
        
        container.innerHTML = contents.map(content => `
            <div class="content-card" data-id="${content.id}">
                <div class="content-thumbnail">
                    <img src="${content.thumbnailUrl || this.getDefaultThumbnail(content)}" 
                         alt="${content.name}" 
                         onclick="contentManager.viewContent(${content.id})">
                    <div class="content-overlay">
                        <div class="content-actions">
                            <button class="action-btn view" onclick="contentManager.viewContent(${content.id})" title="Visualizar">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="contentManager.editContent(${content.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="contentManager.deleteContent(${content.id})" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        ${content.featured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
                        <div class="type-badge">${this.getTypeIcon(content)}</div>
                    </div>
                </div>
                <div class="content-info">
                    <div class="content-header">
                        <h4 class="content-name">${content.name}</h4>
                        <div class="content-status ${content.status}">
                            ${content.status === 'active' ? '✅' : '❌'}
                        </div>
                    </div>
                    <div class="content-meta">
                        <span class="content-category">${this.getCategoryText(content.category)}</span>
                        <span class="content-language">${this.getLanguageText(content.language)}</span>
                        <span class="content-access ${content.access}">${content.access === 'premium' ? '👑' : '🆓'}</span>
                    </div>
                    <div class="content-stats">
                        <span class="content-views">
                            <i class="fas fa-eye"></i>
                            ${content.views || 0}
                        </span>
                        <span class="content-order">
                            <i class="fas fa-sort-numeric-down"></i>
                            ${content.order || '-'}
                        </span>
                    </div>
                    <div class="content-toggle">
                        <label class="toggle-switch">
                            <input type="checkbox" ${content.status === 'active' ? 'checked' : ''} 
                                   onchange="contentManager.toggleContentStatus(${content.id})">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderTableView(contents) {
        const tbody = document.getElementById('contentTableBody');
        
        tbody.innerHTML = contents.map(content => `
            <tr>
                <td>
                    <div class="table-content-info">
                        <img src="${content.thumbnailUrl || this.getDefaultThumbnail(content)}" 
                             alt="${content.name}" class="table-thumbnail">
                        <div class="table-content-details">
                            <strong>${content.name}</strong>
                            ${content.featured ? '<i class="fas fa-star featured-icon"></i>' : ''}
                            <small>${this.truncateText(content.description, 50)}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="type-badge-small">${this.getTypeIcon(content)}</span>
                </td>
                <td>${this.getLanguageText(content.language)}</td>
                <td>${this.getCategoryText(content.category)}</td>
                <td>
                    <span class="access-badge ${content.access}">
                        ${content.access === 'premium' ? '👑 Premium' : '🆓 Gratuito'}
                    </span>
                </td>
                <td>${this.formatDate(content.createdAt)}</td>
                <td>
                    <span class="views-count">
                        <i class="fas fa-eye"></i>
                        ${content.views || 0}
                    </span>
                </td>
                <td>
                    <label class="toggle-switch small">
                        <input type="checkbox" ${content.status === 'active' ? 'checked' : ''} 
                               onchange="contentManager.toggleContentStatus(${content.id})">
                        <span class="toggle-slider"></span>
                    </label>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-small btn-info" onclick="contentManager.viewContent(${content.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="contentManager.editContent(${content.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="contentManager.deleteContent(${content.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Content Management
    openAddContentModal() {
        this.currentEditingContent = null;
        document.getElementById('contentModalTitle').textContent = 'Adicionar Novo Conteúdo';
        document.getElementById('contentForm').reset();
        document.getElementById('contentId').value = '';
        document.getElementById('contentDescription').innerHTML = '';
        this.clearFilePreview('main');
        this.clearFilePreview('thumbnail');
        this.openModal('contentModal');
    }

    editContent(id) {
        const content = this.contents.find(c => c.id === id);
        if (!content) return;

        this.currentEditingContent = content;
        document.getElementById('contentModalTitle').textContent = 'Editar Conteúdo';
        
        // Fill form
        document.getElementById('contentId').value = content.id;
        document.getElementById('contentName').value = content.name;
        document.getElementById('contentLanguage').value = content.language;
        document.getElementById('contentDescription').innerHTML = content.description || '';
        document.getElementById('contentCategory').value = content.category;
        document.getElementById('contentOrder').value = content.order || '';
        document.getElementById('contentMediaType').value = content.mediaType;
        document.getElementById('contentAccess').value = content.access;
        document.getElementById('contentStatus').value = content.status;
        document.getElementById('contentFeatured').checked = content.featured || false;
        document.getElementById('contentDownloadable').checked = content.downloadable || false;

        // Handle media type specific fields
        if (content.mediaType === 'link') {
            document.getElementById('contentExternalLink').value = content.externalLink || '';
            document.getElementById('contentLinkType').value = content.linkType || 'other';
        }

        // Trigger media type change
        document.getElementById('contentMediaType').dispatchEvent(new Event('change'));

        this.openModal('contentModal');
    }

    handleContentSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const description = document.getElementById('contentDescription').innerHTML;
        
        const contentData = {
            id: formData.get('contentId') ? parseInt(formData.get('contentId')) : Date.now(),
            name: formData.get('name'),
            language: formData.get('language'),
            description: description,
            category: formData.get('category'),
            order: parseInt(formData.get('order')) || 999,
            mediaType: formData.get('mediaType'),
            access: formData.get('access'),
            status: formData.get('status'),
            featured: formData.get('featured') === 'on',
            downloadable: formData.get('downloadable') === 'on',
            views: this.currentEditingContent ? this.currentEditingContent.views : 0,
            createdAt: this.currentEditingContent ? this.currentEditingContent.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Handle media type specific data
        if (contentData.mediaType === 'link') {
            contentData.externalLink = formData.get('externalLink');
            contentData.linkType = formData.get('linkType');
        }

        // Handle file uploads
        this.handleFileUploadsForSave(contentData);
    }

    handleFileUploadsForSave(contentData) {
        const mainFile = document.getElementById('contentFile').files[0];
        const thumbnailFile = document.getElementById('contentThumbnail').files[0];

        let filesToProcess = 0;
        let filesProcessed = 0;

        const checkComplete = () => {
            filesProcessed++;
            if (filesProcessed === filesToProcess) {
                this.saveContent(contentData);
            }
        };

        // Process main file
        if (mainFile) {
            filesToProcess++;
            const reader = new FileReader();
            reader.onload = (e) => {
                contentData.fileUrl = e.target.result;
                contentData.fileName = mainFile.name;
                contentData.fileSize = mainFile.size;
                contentData.fileType = this.getFileType(mainFile);
                checkComplete();
            };
            reader.readAsDataURL(mainFile);
        } else if (this.currentEditingContent && this.currentEditingContent.fileUrl) {
            contentData.fileUrl = this.currentEditingContent.fileUrl;
            contentData.fileName = this.currentEditingContent.fileName;
            contentData.fileSize = this.currentEditingContent.fileSize;
            contentData.fileType = this.currentEditingContent.fileType;
        }

        // Process thumbnail
        if (thumbnailFile) {
            filesToProcess++;
            const reader = new FileReader();
            reader.onload = (e) => {
                contentData.thumbnailUrl = e.target.result;
                checkComplete();
            };
            reader.readAsDataURL(thumbnailFile);
        } else if (this.currentEditingContent && this.currentEditingContent.thumbnailUrl) {
            contentData.thumbnailUrl = this.currentEditingContent.thumbnailUrl;
        }

        if (filesToProcess === 0) {
            this.saveContent(contentData);
        }
    }

    saveContent(contentData) {
        if (this.currentEditingContent) {
            const index = this.contents.findIndex(c => c.id === contentData.id);
            this.contents[index] = contentData;
            this.showNotification('Conteúdo atualizado com sucesso!', 'success');
        } else {
            this.contents.push(contentData);
            this.showNotification('Conteúdo criado com sucesso!', 'success');
        }

        this.saveData();
        this.renderContents();
        this.renderStats();
        this.closeModal('contentModal');
    }

    viewContent(id) {
        const content = this.contents.find(c => c.id === id);
        if (!content) return;

        // Fill view modal
        document.getElementById('viewContentTitle').textContent = content.name;
        document.getElementById('viewContentThumbnail').src = content.thumbnailUrl || this.getDefaultThumbnail(content);
        document.getElementById('viewContentName').textContent = content.name;
        document.getElementById('viewContentLanguage').textContent = this.getLanguageText(content.language);
        document.getElementById('viewContentCategory').textContent = this.getCategoryText(content.category);
        document.getElementById('viewContentAccess').textContent = content.access === 'premium' ? '👑 Premium' : '🆓 Gratuito';
        document.getElementById('viewContentViews').textContent = `${content.views || 0} visualizações`;
        document.getElementById('viewContentDescription').innerHTML = content.description || 'Sem descrição';
        document.getElementById('viewContentDate').textContent = this.formatDate(content.createdAt);
        document.getElementById('viewContentUpdated').textContent = this.formatDate(content.updatedAt);
        document.getElementById('viewContentOrder').textContent = content.order || 'Não definida';
        document.getElementById('viewContentTypeBadge').innerHTML = this.getTypeIcon(content);

        // Set current content for actions
        this.currentEditingContent = content;
        this.openModal('viewContentModal');
    }

    editContentFromView() {
        this.closeModal('viewContentModal');
        this.editContent(this.currentEditingContent.id);
    }

    previewContent() {
        if (!this.currentEditingContent) return;

        const content = this.currentEditingContent;
        
        if (content.mediaType === 'link' && content.externalLink) {
            window.open(content.externalLink, '_blank');
        } else if (content.fileUrl) {
            window.open(content.fileUrl, '_blank');
        } else {
            this.showNotification('Conteúdo não disponível para preview.', 'warning');
        }
    }

    toggleContentStatus(id) {
        const content = this.contents.find(c => c.id === id);
        if (!content) return;

        content.status = content.status === 'active' ? 'inactive' : 'active';
        content.updatedAt = new Date().toISOString();

        this.saveData();
        this.renderContents();
        this.renderStats();
        
        const statusText = content.status === 'active' ? 'ativado' : 'desativado';
        this.showNotification(`Conteúdo ${statusText} com sucesso!`, 'success');
    }

    deleteContent(id) {
        const content = this.contents.find(c => c.id === id);
        if (!content) return;

        document.getElementById('deleteContentName').textContent = content.name;
        document.getElementById('deleteContentDetails').textContent = `${this.getCategoryText(content.category)} - ${this.getLanguageText(content.language)}`;

        document.getElementById('confirmDeleteContentConfirm').onclick = () => {
            this.contents = this.contents.filter(c => c.id !== id);
            this.saveData();
            this.renderContents();
            this.renderStats();
            this.closeModal('confirmDeleteContentModal');
            this.showNotification('Conteúdo excluído com sucesso!', 'success');
        };

        this.openModal('confirmDeleteContentModal');
    }

    // Helper methods
    getFileType(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
            return 'video';
        } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
            return 'audio';
        } else if (['pdf'].includes(extension)) {
            return 'pdf';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            return 'image';
        }
        
        return 'other';
    }

    getTypeIcon(content) {
        if (content.mediaType === 'link') {
            const linkTypes = {
                'youtube': '📺',
                'vimeo': '🎬',
                'drive': '☁️',
                'dropbox': '📦',
                'other': '🔗'
            };
            return linkTypes[content.linkType] || '🔗';
        }

        const typeIcons = {
            'video': '🎥',
            'audio': '🎵',
            'pdf': '📄',
            'image': '🖼️',
            'other': '📁'
        };
        
        return typeIcons[content.fileType] || '📁';
    }

    getDefaultThumbnail(content) {
        const type = content.mediaType === 'link' ? 'link' : content.fileType;
        const colors = {
            'video': '3b82f6',
            'audio': '10b981',
            'pdf': 'ef4444',
            'image': 'f59e0b',
            'link': '8b5cf6',
            'other': '6b7280'
        };
        
        const color = colors[type] || '6b7280';
        const icon = this.getTypeIcon(content);
        
        return `https://via.placeholder.com/300x200/${color}/ffffff?text=${encodeURIComponent(icon)}`;
    }

    getCategoryText(category) {
        const categories = {
            'ebook': '📚 eBook',
            'planner': '📋 Planner',
            'lesson': '🎓 Aula',
            'bonus': '🎁 Bônus',
            'guide': '📖 Guia',
            'challenge': '🏆 Desafio',
            'recipe': '🍽️ Receita',
            'other': '🔧 Outro'
        };
        return categories[category] || category;
    }

    getLanguageText(language) {
        const languages = {
            'es': '🇪🇸 Español',
            'pt': '🇧🇷 Português',
            'en': '🇺🇸 English'
        };
        return languages[language] || language;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        const cleanText = text.replace(/<[^>]*>/g, '');
        return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
    }

    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        const maxSize = type === 'thumbnail' ? 5 * 1024 * 1024 : 100 * 1024 * 1024; // 5MB for thumbnails, 100MB for content
        
        if (file.size > maxSize) {
            const maxSizeText = type === 'thumbnail' ? '5MB' : '100MB';
            this.showNotification(`Arquivo muito grande. Máximo ${maxSizeText}.`, 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showFilePreview(file, e.target.result, type);
        };
        reader.readAsDataURL(file);
    }

    showFilePreview(file, dataUrl, type) {
        if (type === 'thumbnail') {
            const preview = document.getElementById('contentThumbnailPreview');
            const placeholder = document.querySelector('#contentThumbnailUploadArea .upload-placeholder');
            
            document.getElementById('contentThumbnailPreviewImg').src = dataUrl;
            placeholder.style.display = 'none';
            preview.style.display = 'flex';
        } else {
            const preview = document.getElementById('contentFilePreview');
            const placeholder = document.querySelector('#contentFileUploadArea .upload-placeholder');
            
            document.getElementById('contentFileName').textContent = file.name;
            document.getElementById('contentFileSize').textContent = this.formatFileSize(file.size);
            document.getElementById('contentFileType').textContent = this.getFileType(file).toUpperCase();
            
            const icon = document.getElementById('contentFileIcon');
            const fileType = this.getFileType(file);
            const iconClasses = {
                'video': 'fas fa-play-circle',
                'audio': 'fas fa-music',
                'pdf': 'fas fa-file-pdf',
                'image': 'fas fa-image',
                'other': 'fas fa-file'
            };
            
            icon.className = iconClasses[fileType] || 'fas fa-file';
            
            placeholder.style.display = 'none';
            preview.style.display = 'flex';
        }
    }

    removeFile(type) {
        if (type === 'thumbnail') {
            document.getElementById('contentThumbnail').value = '';
            this.clearFilePreview('thumbnail');
        } else {
            document.getElementById('contentFile').value = '';
            this.clearFilePreview('main');
        }
    }

    clearFilePreview(type) {
        if (type === 'thumbnail') {
            const preview = document.getElementById('contentThumbnailPreview');
            const placeholder = document.querySelector('#contentThumbnailUploadArea .upload-placeholder');
            
            preview.style.display = 'none';
            placeholder.style.display = 'block';
        } else {
            const preview = document.getElementById('contentFilePreview');
            const placeholder = document.querySelector('#contentFileUploadArea .upload-placeholder');
            
            preview.style.display = 'none';
            placeholder.style.display = 'block';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Export functionality
    exportContents() {
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conteudos-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    generateCSV() {
        const headers = ['Nome', 'Categoria', 'Idioma', 'Tipo', 'Acesso', 'Status', 'Visualizações', 'Data Upload'];
        const rows = this.contents.map(content => [
            content.name,
            this.getCategoryText(content.category),
            this.getLanguageText(content.language),
            content.mediaType === 'link' ? 'Link Externo' : content.fileType?.toUpperCase() || 'Arquivo',
            content.access === 'premium' ? 'Premium' : 'Gratuito',
            content.status === 'active' ? 'Ativo' : 'Inativo',
            content.views || 0,
            this.formatDate(content.createdAt)
        ]);

        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }

    // Reorder functionality
    openReorderModal() {
        const sortedContents = [...this.contents].sort((a, b) => (a.order || 999) - (b.order || 999));
        this.renderReorderList(sortedContents);
        this.openModal('reorderContentsModal');
    }

    renderReorderList(contents) {
        const container = document.getElementById('reorderList');
        
        container.innerHTML = contents.map((content, index) => `
            <div class="reorder-item" data-id="${content.id}">
                <div class="reorder-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="reorder-content">
                    <img src="${content.thumbnailUrl || this.getDefaultThumbnail(content)}" alt="${content.name}">
                    <div class="reorder-info">
                        <strong>${content.name}</strong>
                        <small>${this.getCategoryText(content.category)} - ${this.getLanguageText(content.language)}</small>
                    </div>
                </div>
                <div class="reorder-number">
                    <span>${index + 1}</span>
                </div>
            </div>
        `).join('');

        // Make sortable (simplified version)
        this.makeSortable(container);
    }

    makeSortable(container) {
        // Simplified drag and drop implementation
        let draggedElement = null;

        container.addEventListener('dragstart', (e) => {
            if (e.target.closest('.reorder-item')) {
                draggedElement = e.target.closest('.reorder-item');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetElement = e.target.closest('.reorder-item');
            
            if (targetElement && draggedElement && targetElement !== draggedElement) {
                const rect = targetElement.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    container.insertBefore(draggedElement, targetElement);
                } else {
                    container.insertBefore(draggedElement, targetElement.nextSibling);
                }
                
                // Update order numbers
                this.updateReorderNumbers();
            }
        });

        // Make items draggable
        container.querySelectorAll('.reorder-item').forEach(item => {
            item.draggable = true;
        });
    }

    updateReorderNumbers() {
        const items = document.querySelectorAll('.reorder-item');
        items.forEach((item, index) => {
            const numberSpan = item.querySelector('.reorder-number span');
            numberSpan.textContent = index + 1;
        });
    }

    saveReorder() {
        const items = document.querySelectorAll('.reorder-item');
        
        items.forEach((item, index) => {
            const contentId = parseInt(item.dataset.id);
            const content = this.contents.find(c => c.id === contentId);
            if (content) {
                content.order = index + 1;
            }
        });

        this.saveData();
        this.renderContents();
        this.closeModal('reorderContentsModal');
        this.showNotification('Ordem dos conteúdos atualizada com sucesso!', 'success');
    }

    // Modal management
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Demo data
    loadDemoData() {
        if (this.contents.length === 0) {
            this.contents = [
                {
                    id: 1,
                    name: "Planner de Alimentação Saudável",
                    language: "pt",
                    description: "<p>Planner completo para organizar suas refeições semanais com foco em alimentação saudável e equilibrada.</p><ul><li>Planejamento semanal</li><li>Lista de compras automática</li><li>Receitas incluídas</li></ul>",
                    category: "planner",
                    order: 1,
                    mediaType: "file",
                    fileType: "pdf",
                    fileName: "planner-alimentacao-saudavel.pdf",
                    fileSize: 2048000,
                    fileUrl: "data:application/pdf;base64,demo",
                    thumbnailUrl: "https://via.placeholder.com/300x200/10b981/ffffff?text=📋+Planner",
                    access: "free",
                    status: "active",
                    featured: true,
                    downloadable: true,
                    views: 245,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 2,
                    name: "Aula: Fundamentos da Nutrição",
                    language: "pt",
                    description: "<p>Aula completa sobre os fundamentos da nutrição, macronutrientes e micronutrientes essenciais para uma vida saudável.</p>",
                    category: "lesson",
                    order: 2,
                    mediaType: "link",
                    linkType: "youtube",
                    externalLink: "https://youtube.com/watch?v=demo",
                    thumbnailUrl: "https://via.placeholder.com/300x200/3b82f6/ffffff?text=🎓+Aula",
                    access: "premium",
                    status: "active",
                    featured: false,
                    downloadable: false,
                    views: 189,
                    createdAt: "2024-12-02T14:30:00Z",
                    updatedAt: "2024-12-02T14:30:00Z"
                },
                {
                    id: 3,
                    name: "eBook: 21 Receitas Detox",
                    language: "es",
                    description: "<p><strong>21 recetas detox</strong> para purificar tu cuerpo y sentirte mejor cada día.</p><p>Incluye recetas para:</p><ul><li>Desayunos detox</li><li>Smoothies verdes</li><li>Cenas ligeras</li></ul>",
                    category: "ebook",
                    order: 3,
                    mediaType: "file",
                    fileType: "pdf",
                    fileName: "21-recetas-detox.pdf",
                    fileSize: 5120000,
                    fileUrl: "data:application/pdf;base64,demo",
                    thumbnailUrl: "https://via.placeholder.com/300x200/f59e0b/ffffff?text=📚+eBook",
                    access: "premium",
                    status: "active",
                    featured: true,
                    downloadable: true,
                    views: 156,
                    createdAt: "2024-12-03T09:15:00Z",
                    updatedAt: "2024-12-03T09:15:00Z"
                },
                {
                    id: 4,
                    name: "Meditação Guiada: Mindful Eating",
                    language: "en",
                    description: "<p>Guided meditation to develop a mindful relationship with food and eating habits.</p>",
                    category: "bonus",
                    order: 4,
                    mediaType: "file",
                    fileType: "audio",
                    fileName: "mindful-eating-meditation.mp3",
                    fileSize: 15360000,
                    fileUrl: "data:audio/mp3;base64,demo",
                    thumbnailUrl: "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=🎵+Audio",
                    access: "free",
                    status: "active",
                    featured: false,
                    downloadable: true,
                    views: 98,
                    createdAt: "2024-12-04T16:45:00Z",
                    updatedAt: "2024-12-04T16:45:00Z"
                },
                {
                    id: 5,
                    name: "Guía de Suplementación",
                    language: "es",
                    description: "<p>Guía completa sobre suplementación nutricional, cuándo y cómo usar suplementos de forma segura.</p>",
                    category: "guide",
                    order: 5,
                    mediaType: "file",
                    fileType: "pdf",
                    fileName: "guia-suplementacion.pdf",
                    fileSize: 3072000,
                    fileUrl: "data:application/pdf;base64,demo",
                    thumbnailUrl: "https://via.placeholder.com/300x200/ef4444/ffffff?text=📖+Guía",
                    access: "premium",
                    status: "inactive",
                    featured: false,
                    downloadable: true,
                    views: 67,
                    createdAt: "2024-12-05T11:20:00Z",
                    updatedAt: "2024-12-05T11:20:00Z"
                },
                {
                    id: 6,
                    name: "Workout Video: HIIT Cardio",
                    language: "en",
                    description: "<p>High-intensity interval training video for cardiovascular health and fat burning.</p>",
                    category: "lesson",
                    order: 6,
                    mediaType: "link",
                    linkType: "vimeo",
                    externalLink: "https://vimeo.com/demo",
                    thumbnailUrl: "https://via.placeholder.com/300x200/10b981/ffffff?text=🎬+Video",
                    access: "free",
                    status: "active",
                    featured: false,
                    downloadable: false,
                    views: 134,
                    createdAt: "2024-12-06T08:30:00Z",
                    updatedAt: "2024-12-06T08:30:00Z"
                }
            ];
        }

        this.saveData();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('contentGrid')) {
            window.contentManager = new ContentManager();
        }
    }, 100);
});