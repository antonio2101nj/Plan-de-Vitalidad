/**
 * Creatives Management System
 * Sistema completo de criativos e campanhas com geração por IA
 */

class CreativesManager {
    constructor() {
        this.creatives = [];
        this.aiHistory = [];
        this.currentSection = 'gallery';
        this.currentEditingCreative = null;
        this.currentView = 'grid';
        this.currentGeneratedImage = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderOverviewStats();
        this.renderCurrentSection();
        this.loadDemoData();
    }

    loadData() {
        const savedCreatives = localStorage.getItem('planVitalidadCreatives');
        const savedAiHistory = localStorage.getItem('planVitalidadAiHistory');

        if (savedCreatives) this.creatives = JSON.parse(savedCreatives);
        if (savedAiHistory) this.aiHistory = JSON.parse(savedAiHistory);
    }

    saveData() {
        localStorage.setItem('planVitalidadCreatives', JSON.stringify(this.creatives));
        localStorage.setItem('planVitalidadAiHistory', JSON.stringify(this.aiHistory));
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.creatives-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Gallery section
        document.getElementById('addCreativeBtn').addEventListener('click', () => this.openAddCreativeModal());
        
        // Filters and search
        this.setupFilterEvents();
        
        // View controls
        this.setupViewControls();
        
        // Modal events
        this.setupModalEvents();
        
        // AI Generator
        this.setupAiGenerator();
    }

    setupFilterEvents() {
        const filters = [
            'creativesSearchFilter',
            'creativesTypeFilter', 
            'creativesLanguageFilter',
            'creativesStatusFilter',
            'creativesSourceFilter',
            'creativesSortFilter'
        ];
        
        filters.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('input', () => this.filterCreatives());
                element.addEventListener('change', () => this.filterCreatives());
            }
        });
    }

    setupViewControls() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });
    }

    setupModalEvents() {
        // Creative Modal
        document.getElementById('creativeForm').addEventListener('submit', (e) => this.handleCreativeSubmit(e));
        document.getElementById('creativeModalClose').addEventListener('click', () => this.closeModal('creativeModal'));
        document.getElementById('creativeModalCancel').addEventListener('click', () => this.closeModal('creativeModal'));

        // View Modal
        document.getElementById('viewCreativeModalClose').addEventListener('click', () => this.closeModal('viewCreativeModal'));
        document.getElementById('viewCreativeModalCancel').addEventListener('click', () => this.closeModal('viewCreativeModal'));
        document.getElementById('editCreativeFromView').addEventListener('click', () => this.editCreativeFromView());
        document.getElementById('downloadCreative').addEventListener('click', () => this.downloadCreative());

        // Delete Modal
        document.getElementById('confirmDeleteCreativeClose').addEventListener('click', () => this.closeModal('confirmDeleteCreativeModal'));
        document.getElementById('confirmDeleteCreativeCancel').addEventListener('click', () => this.closeModal('confirmDeleteCreativeModal'));

        // File upload
        this.setupFileUpload();
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('creativeImageUploadArea');
        const fileInput = document.getElementById('creativeImage');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.handleImageUpload({ target: { files } });
            }
        });
    }

    setupAiGenerator() {
        document.getElementById('aiGeneratorForm').addEventListener('submit', (e) => this.handleAiGeneration(e));
        document.getElementById('regenerateBtn').addEventListener('click', () => this.regenerateCreative());
        document.getElementById('saveGeneratedBtn').addEventListener('click', () => this.saveGeneratedCreative());
        document.getElementById('cancelAiGeneration').addEventListener('click', () => this.cancelAiGeneration());
    }

    switchSection(section) {
        this.currentSection = section;
        
        // Update tabs
        document.querySelectorAll('.creatives-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.section === section);
        });
        
        // Update sections
        document.querySelectorAll('.creatives-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `${section}Section`);
        });
        
        this.renderCurrentSection();
    }

    switchView(view) {
        this.currentView = view;
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        const gridView = document.getElementById('creativesGrid');
        const listView = document.getElementById('creativesList');
        
        if (view === 'grid') {
            gridView.style.display = 'grid';
            listView.style.display = 'none';
        } else {
            gridView.style.display = 'none';
            listView.style.display = 'block';
        }
        
        this.renderCreatives();
    }

    renderCurrentSection() {
        switch(this.currentSection) {
            case 'gallery':
                this.renderCreatives();
                break;
            case 'ai-generator':
                this.renderAiHistory();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
        }
    }

    renderOverviewStats() {
        const totalCreatives = this.creatives.length;
        const activeCreatives = this.creatives.filter(c => c.status === 'active').length;
        const aiCreatives = this.creatives.filter(c => c.source === 'ai').length;
        const featuredCreatives = this.creatives.filter(c => c.featured).length;

        document.getElementById('totalCreatives').textContent = totalCreatives;
        document.getElementById('activeCreatives').textContent = activeCreatives;
        document.getElementById('aiCreatives').textContent = aiCreatives;
        document.getElementById('featuredCreatives').textContent = featuredCreatives;
    }

    filterCreatives() {
        const searchTerm = document.getElementById('creativesSearchFilter').value.toLowerCase();
        const typeFilter = document.getElementById('creativesTypeFilter').value;
        const languageFilter = document.getElementById('creativesLanguageFilter').value;
        const statusFilter = document.getElementById('creativesStatusFilter').value;
        const sourceFilter = document.getElementById('creativesSourceFilter').value;
        const sortFilter = document.getElementById('creativesSortFilter').value;

        let filteredCreatives = this.creatives.filter(creative => {
            const nameMatch = creative.name.toLowerCase().includes(searchTerm) ||
                            (creative.description && creative.description.toLowerCase().includes(searchTerm));
            const typeMatch = !typeFilter || creative.type === typeFilter;
            const languageMatch = !languageFilter || creative.language === languageFilter;
            const statusMatch = !statusFilter || creative.status === statusFilter;
            const sourceMatch = !sourceFilter || creative.source === sourceFilter;

            return nameMatch && typeMatch && languageMatch && statusMatch && sourceMatch;
        });

        // Sort creatives
        filteredCreatives.sort((a, b) => {
            switch(sortFilter) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'type':
                    return a.type.localeCompare(b.type);
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        this.renderCreativesList(filteredCreatives);
    }

    renderCreatives() {
        this.filterCreatives();
    }

    renderCreativesList(creatives) {
        const gridContainer = document.getElementById('creativesGrid');
        const listContainer = document.getElementById('creativesList');
        const noCreativesMsg = document.getElementById('noCreativesMessage');

        if (creatives.length === 0) {
            gridContainer.style.display = 'none';
            listContainer.style.display = 'none';
            noCreativesMsg.style.display = 'block';
            return;
        }

        noCreativesMsg.style.display = 'none';

        if (this.currentView === 'grid') {
            gridContainer.style.display = 'grid';
            listContainer.style.display = 'none';
            this.renderGridView(creatives);
        } else {
            gridContainer.style.display = 'none';
            listContainer.style.display = 'block';
            this.renderListView(creatives);
        }
    }

    renderGridView(creatives) {
        const container = document.getElementById('creativesGrid');
        
        container.innerHTML = creatives.map(creative => `
            <div class="creative-card" data-id="${creative.id}">
                <div class="creative-image">
                    <img src="${creative.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                         alt="${creative.name}" 
                         onclick="creativesManager.viewCreative(${creative.id})">
                    <div class="creative-overlay">
                        <div class="creative-actions">
                            <button class="action-btn view" onclick="creativesManager.viewCreative(${creative.id})" title="Visualizar">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="creativesManager.editCreative(${creative.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="creativesManager.deleteCreative(${creative.id})" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        ${creative.featured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
                        ${creative.source === 'ai' ? '<div class="ai-badge"><i class="fas fa-robot"></i> IA</div>' : ''}
                    </div>
                </div>
                <div class="creative-info">
                    <div class="creative-header">
                        <h4 class="creative-name">${creative.name}</h4>
                        <div class="creative-status ${creative.status}">
                            ${creative.status === 'active' ? '✅' : '❌'}
                        </div>
                    </div>
                    <div class="creative-meta">
                        <span class="creative-type">${this.getTypeText(creative.type)}</span>
                        <span class="creative-language">${this.getLanguageText(creative.language)}</span>
                    </div>
                    <div class="creative-date">
                        ${this.formatDate(creative.createdAt)}
                    </div>
                    <div class="creative-toggle">
                        <label class="toggle-switch">
                            <input type="checkbox" ${creative.status === 'active' ? 'checked' : ''} 
                                   onchange="creativesManager.toggleCreativeStatus(${creative.id})">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderListView(creatives) {
        const container = document.getElementById('creativesList');
        
        container.innerHTML = `
            <table class="creatives-table">
                <thead>
                    <tr>
                        <th>🖼️ Imagem</th>
                        <th>📝 Nome</th>
                        <th>📱 Tipo</th>
                        <th>🌐 Idioma</th>
                        <th>🤖 Origem</th>
                        <th>📅 Data</th>
                        <th>✅ Status</th>
                        <th>⚙️ Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${creatives.map(creative => `
                        <tr>
                            <td>
                                <div class="table-image">
                                    <img src="${creative.imageUrl || 'https://via.placeholder.com/60x40?text=No+Image'}" 
                                         alt="${creative.name}">
                                    ${creative.featured ? '<i class="fas fa-star featured-icon"></i>' : ''}
                                </div>
                            </td>
                            <td>
                                <div class="table-name">
                                    <strong>${creative.name}</strong>
                                    ${creative.description ? `<small>${creative.description}</small>` : ''}
                                </div>
                            </td>
                            <td>${this.getTypeText(creative.type)}</td>
                            <td>${this.getLanguageText(creative.language)}</td>
                            <td>
                                ${creative.source === 'ai' ? 
                                    '<span class="source-badge ai"><i class="fas fa-robot"></i> IA</span>' : 
                                    '<span class="source-badge manual"><i class="fas fa-user"></i> Manual</span>'
                                }
                            </td>
                            <td>${this.formatDate(creative.createdAt)}</td>
                            <td>
                                <label class="toggle-switch small">
                                    <input type="checkbox" ${creative.status === 'active' ? 'checked' : ''} 
                                           onchange="creativesManager.toggleCreativeStatus(${creative.id})">
                                    <span class="toggle-slider"></span>
                                </label>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn btn-small btn-info" onclick="creativesManager.viewCreative(${creative.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-small btn-secondary" onclick="creativesManager.editCreative(${creative.id})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-small btn-danger" onclick="creativesManager.deleteCreative(${creative.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Creative Management
    openAddCreativeModal() {
        this.currentEditingCreative = null;
        document.getElementById('creativeModalTitle').textContent = 'Adicionar Novo Criativo';
        document.getElementById('creativeForm').reset();
        document.getElementById('creativeId').value = '';
        this.clearImagePreview();
        this.openModal('creativeModal');
    }

    editCreative(id) {
        const creative = this.creatives.find(c => c.id === id);
        if (!creative) return;

        this.currentEditingCreative = creative;
        document.getElementById('creativeModalTitle').textContent = 'Editar Criativo';
        
        // Fill form
        document.getElementById('creativeId').value = creative.id;
        document.getElementById('creativeName').value = creative.name;
        document.getElementById('creativeType').value = creative.type;
        document.getElementById('creativeLanguage').value = creative.language;
        document.getElementById('creativeStatus').value = creative.status;
        document.getElementById('creativeDescription').value = creative.description || '';
        document.getElementById('creativeFeatured').checked = creative.featured || false;

        this.openModal('creativeModal');
    }

    handleCreativeSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const creativeData = {
            id: formData.get('creativeId') ? parseInt(formData.get('creativeId')) : Date.now(),
            name: formData.get('name'),
            type: formData.get('type'),
            language: formData.get('language'),
            status: formData.get('status'),
            description: formData.get('description') || null,
            featured: formData.get('featured') === 'on',
            source: this.currentEditingCreative ? this.currentEditingCreative.source : 'manual',
            imageUrl: this.currentEditingCreative ? this.currentEditingCreative.imageUrl : null,
            createdAt: this.currentEditingCreative ? this.currentEditingCreative.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Handle image upload
        const imageFile = document.getElementById('creativeImage').files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                creativeData.imageUrl = e.target.result;
                this.saveCreative(creativeData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            this.saveCreative(creativeData);
        }
    }

    saveCreative(creativeData) {
        if (this.currentEditingCreative) {
            const index = this.creatives.findIndex(c => c.id === creativeData.id);
            this.creatives[index] = creativeData;
            this.showNotification('Criativo atualizado com sucesso!', 'success');
        } else {
            this.creatives.push(creativeData);
            this.showNotification('Criativo criado com sucesso!', 'success');
        }

        this.saveData();
        this.renderCreatives();
        this.renderOverviewStats();
        this.closeModal('creativeModal');
    }

    viewCreative(id) {
        const creative = this.creatives.find(c => c.id === id);
        if (!creative) return;

        // Fill view modal
        document.getElementById('viewCreativeTitle').textContent = creative.name;
        document.getElementById('viewCreativeImage').src = creative.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image';
        document.getElementById('viewCreativeName').textContent = creative.name;
        document.getElementById('viewCreativeType').textContent = this.getTypeText(creative.type);
        document.getElementById('viewCreativeLanguage').textContent = this.getLanguageText(creative.language);
        document.getElementById('viewCreativeStatus').textContent = creative.status === 'active' ? '✅ Ativo' : '❌ Inativo';
        document.getElementById('viewCreativeSource').textContent = creative.source === 'ai' ? '🤖 IA' : '👤 Manual';
        document.getElementById('viewCreativeDate').textContent = this.formatDate(creative.createdAt);

        // Description
        const descRow = document.getElementById('viewCreativeDescriptionRow');
        if (creative.description) {
            descRow.style.display = 'flex';
            document.getElementById('viewCreativeDescription').textContent = creative.description;
        } else {
            descRow.style.display = 'none';
        }

        // AI details
        const aiDetailsRow = document.getElementById('viewCreativeAiDetailsRow');
        if (creative.source === 'ai' && creative.aiDetails) {
            aiDetailsRow.style.display = 'flex';
            document.getElementById('viewCreativeAiDetails').innerHTML = this.formatAiDetails(creative.aiDetails);
        } else {
            aiDetailsRow.style.display = 'none';
        }

        // Set current creative for actions
        this.currentEditingCreative = creative;
        this.openModal('viewCreativeModal');
    }

    editCreativeFromView() {
        this.closeModal('viewCreativeModal');
        this.editCreative(this.currentEditingCreative.id);
    }

    downloadCreative() {
        if (!this.currentEditingCreative || !this.currentEditingCreative.imageUrl) return;

        const link = document.createElement('a');
        link.href = this.currentEditingCreative.imageUrl;
        link.download = `${this.currentEditingCreative.name}.jpg`;
        link.click();
    }

    toggleCreativeStatus(id) {
        const creative = this.creatives.find(c => c.id === id);
        if (!creative) return;

        creative.status = creative.status === 'active' ? 'inactive' : 'active';
        creative.updatedAt = new Date().toISOString();

        this.saveData();
        this.renderCreatives();
        this.renderOverviewStats();
        
        const statusText = creative.status === 'active' ? 'ativado' : 'desativado';
        this.showNotification(`Criativo ${statusText} com sucesso!`, 'success');
    }

    deleteCreative(id) {
        const creative = this.creatives.find(c => c.id === id);
        if (!creative) return;

        document.getElementById('deleteCreativeName').textContent = creative.name;
        document.getElementById('deleteCreativeDetails').textContent = `${this.getTypeText(creative.type)} - ${this.getLanguageText(creative.language)}`;

        document.getElementById('confirmDeleteCreativeConfirm').onclick = () => {
            this.creatives = this.creatives.filter(c => c.id !== id);
            this.saveData();
            this.renderCreatives();
            this.renderOverviewStats();
            this.closeModal('confirmDeleteCreativeModal');
            this.showNotification('Criativo excluído com sucesso!', 'success');
        };

        this.openModal('confirmDeleteCreativeModal');
    }

    // Helper methods
    getTypeText(type) {
        const types = {
            'feed': '📱 Feed',
            'story': '📖 Story',
            'carousel': '🎠 Carrossel',
            'mockup': '📱 Mockup',
            'landing': '🌐 Página de Vendas',
            'members': '👥 Área de Membros',
            'banner': '🏷️ Banner',
            'ad': '📢 Anúncio',
            'other': '🔧 Outro'
        };
        return types[type] || type;
    }

    getLanguageText(language) {
        const languages = {
            'pt': '🇧🇷 Português',
            'es': '🇪🇸 Español',
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

    formatAiDetails(aiDetails) {
        return `
            <div class="ai-detail-item">
                <strong>Objetivo:</strong> ${aiDetails.objective}
            </div>
            <div class="ai-detail-item">
                <strong>Estilo:</strong> ${aiDetails.visualStyle}
            </div>
            <div class="ai-detail-item">
                <strong>Gatilho:</strong> ${aiDetails.emotionalTrigger || 'Nenhum'}
            </div>
            ${aiDetails.mainText ? `<div class="ai-detail-item"><strong>Texto:</strong> ${aiDetails.mainText}</div>` : ''}
        `;
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showNotification('Por favor, selecione apenas arquivos de imagem.', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            this.showNotification('Arquivo muito grande. Máximo 10MB.', 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showImagePreview(file, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(file, dataUrl) {
        const placeholder = document.querySelector('#creativeImageUploadArea .upload-placeholder');
        const preview = document.getElementById('creativeImagePreview');
        
        document.getElementById('creativeImagePreviewImg').src = dataUrl;
        document.getElementById('creativeImageName').textContent = file.name;
        document.getElementById('creativeImageSize').textContent = this.formatFileSize(file.size);
        
        placeholder.style.display = 'none';
        preview.style.display = 'flex';
    }

    removeImage() {
        document.getElementById('creativeImage').value = '';
        this.clearImagePreview();
    }

    clearImagePreview() {
        const placeholder = document.querySelector('#creativeImageUploadArea .upload-placeholder');
        const preview = document.getElementById('creativeImagePreview');
        
        placeholder.style.display = 'block';
        preview.style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        if (this.creatives.length === 0) {
            this.creatives = [
                {
                    id: 1,
                    name: "Banner Instagram Transformação",
                    type: "feed",
                    language: "pt",
                    status: "active",
                    description: "Banner promocional para transformação de 21 dias",
                    featured: true,
                    source: "manual",
                    imageUrl: "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Banner+Transformação",
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 2,
                    name: "Story Testemunho Cliente",
                    type: "story",
                    language: "pt",
                    status: "active",
                    description: "Story com testemunho de cliente satisfeita",
                    featured: false,
                    source: "ai",
                    imageUrl: "https://via.placeholder.com/300x533/10b981/ffffff?text=Story+Testemunho",
                    aiDetails: {
                        objective: "testimonial",
                        visualStyle: "emotional",
                        emotionalTrigger: "transformation",
                        mainText: "Mudei minha vida em 21 dias!"
                    },
                    createdAt: "2024-12-02T14:30:00Z",
                    updatedAt: "2024-12-02T14:30:00Z"
                },
                {
                    id: 3,
                    name: "Mockup App Mobile",
                    type: "mockup",
                    language: "en",
                    status: "active",
                    description: "Mockup da interface do aplicativo mobile",
                    featured: true,
                    source: "manual",
                    imageUrl: "https://via.placeholder.com/400x600/8b5cf6/ffffff?text=App+Mockup",
                    createdAt: "2024-12-03T09:15:00Z",
                    updatedAt: "2024-12-03T09:15:00Z"
                },
                {
                    id: 4,
                    name: "Anúncio Facebook Kiwify",
                    type: "ad",
                    language: "es",
                    status: "active",
                    description: "Anúncio para conversão na Kiwify",
                    featured: false,
                    source: "ai",
                    imageUrl: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Anuncio+Facebook",
                    aiDetails: {
                        objective: "conversion",
                        visualStyle: "professional",
                        emotionalTrigger: "urgency",
                        mainText: "¡Oferta limitada!"
                    },
                    createdAt: "2024-12-04T16:45:00Z",
                    updatedAt: "2024-12-04T16:45:00Z"
                },
                {
                    id: 5,
                    name: "Banner Página de Vendas",
                    type: "landing",
                    language: "pt",
                    status: "inactive",
                    description: "Banner principal para landing page",
                    featured: false,
                    source: "manual",
                    imageUrl: "https://via.placeholder.com/800x400/ef4444/ffffff?text=Landing+Banner",
                    createdAt: "2024-12-05T11:20:00Z",
                    updatedAt: "2024-12-05T11:20:00Z"
                }
            ];
        }

        this.saveData();
    }

    // AI Generation Methods
    handleAiGeneration(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const aiData = {
            language: formData.get('language'),
            objective: formData.get('objective'),
            visualStyle: formData.get('visualStyle'),
            creativeType: formData.get('creativeType'),
            mainText: formData.get('mainText') || '',
            emotionalTrigger: formData.get('emotionalTrigger') || '',
            additionalDetails: formData.get('additionalDetails') || ''
        };

        // Validate required fields
        if (!aiData.language || !aiData.objective || !aiData.visualStyle || !aiData.creativeType) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        this.generateCreativeWithAI(aiData);
    }

    async generateCreativeWithAI(aiData) {
        // Show progress modal
        this.openModal('aiGenerationModal');
        this.updateGenerationProgress(0, 'Iniciando geração...');

        try {
            // Step 1: Process briefing
            this.updateGenerationProgress(25, 'Processando briefing...');
            await this.delay(1000);

            // Step 2: Generate optimized prompt
            this.updateGenerationProgress(50, 'Gerando prompt otimizado...');
            const prompt = this.generateOptimizedPrompt(aiData);
            await this.delay(1500);

            // Step 3: Generate image with AI
            this.updateGenerationProgress(75, 'Criando imagem com IA...');
            const imageUrl = await this.generateImageWithAI(prompt, aiData);
            await this.delay(2000);

            // Step 4: Finalize creative
            this.updateGenerationProgress(100, 'Finalizando criativo...');
            await this.delay(500);

            // Save to history and show preview
            const generatedCreative = {
                id: Date.now(),
                name: this.generateCreativeName(aiData),
                type: aiData.creativeType,
                language: aiData.language,
                status: 'active',
                description: `Criativo gerado por IA para ${this.getObjectiveText(aiData.objective)}`,
                featured: false,
                source: 'ai',
                imageUrl: imageUrl,
                aiDetails: aiData,
                prompt: prompt,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.currentGeneratedImage = generatedCreative;
            this.showAiPreview(generatedCreative);
            this.addToAiHistory(generatedCreative);

            this.closeModal('aiGenerationModal');
            this.showNotification('Criativo gerado com sucesso!', 'success');

        } catch (error) {
            console.error('Error generating creative:', error);
            this.closeModal('aiGenerationModal');
            this.showNotification('Erro ao gerar criativo. Tente novamente.', 'error');
        }
    }

    generateOptimizedPrompt(aiData) {
        const stylePrompts = {
            'minimalist': 'clean, minimal design, lots of white space, simple typography',
            'emotional': 'warm colors, emotional imagery, human connection, inspiring',
            'colorful': 'vibrant colors, dynamic composition, energetic feel',
            'professional': 'corporate style, clean lines, professional photography',
            'mockup': 'device mockup, modern interface, realistic presentation',
            'lifestyle': 'lifestyle photography, natural lighting, authentic moments'
        };

        const objectivePrompts = {
            'engagement': 'engaging social media post, eye-catching design',
            'conversion': 'sales-focused design, clear call-to-action, compelling offer',
            'traffic': 'click-worthy design, curiosity-driven visuals',
            'warming': 'brand awareness, trust-building imagery',
            'testimonial': 'testimonial format, before/after, success story',
            'awareness': 'brand recognition, memorable visual identity'
        };

        const typePrompts = {
            'feed': 'square format 1080x1080, Instagram feed post',
            'story': 'vertical format 1080x1920, Instagram story',
            'banner': 'horizontal banner format, web-ready',
            'ad': 'advertising format, clear focal point',
            'carousel': 'carousel slide design, consistent style'
        };

        let prompt = `Create a ${stylePrompts[aiData.visualStyle]} ${typePrompts[aiData.creativeType]} for ${objectivePrompts[aiData.objective]}`;

        if (aiData.mainText) {
            prompt += ` with text "${aiData.mainText}"`;
        }

        if (aiData.emotionalTrigger) {
            const triggerPrompts = {
                'urgency': 'convey urgency and limited time',
                'belonging': 'create sense of community and belonging',
                'transformation': 'show transformation and positive change',
                'fear': 'address pain points and fears',
                'success': 'showcase success and achievement',
                'comfort': 'provide comfort and reassurance'
            };
            prompt += `, ${triggerPrompts[aiData.emotionalTrigger]}`;
        }

        if (aiData.additionalDetails) {
            prompt += `, ${aiData.additionalDetails}`;
        }

        prompt += '. High quality, professional design, modern aesthetic.';

        return prompt;
    }

    async generateImageWithAI(prompt, aiData) {
        // Simulate AI image generation
        // In a real implementation, this would call DALL-E, Midjourney, or similar API
        
        // For demo purposes, we'll return a placeholder with the creative type
        const typeColors = {
            'feed': '3b82f6',
            'story': '10b981', 
            'banner': 'f59e0b',
            'ad': 'ef4444',
            'carousel': '8b5cf6'
        };

        const color = typeColors[aiData.creativeType] || '6b7280';
        const dimensions = aiData.creativeType === 'story' ? '300x533' : 
                         aiData.creativeType === 'banner' ? '800x400' : '400x400';
        
        const text = encodeURIComponent(`AI Generated\n${this.getTypeText(aiData.creativeType)}`);
        return `https://via.placeholder.com/${dimensions}/${color}/ffffff?text=${text}`;
    }

    generateCreativeName(aiData) {
        const typeNames = {
            'feed': 'Post Feed',
            'story': 'Story',
            'banner': 'Banner',
            'ad': 'Anúncio',
            'carousel': 'Carrossel'
        };

        const objectiveNames = {
            'engagement': 'Engajamento',
            'conversion': 'Conversão',
            'traffic': 'Tráfego',
            'warming': 'Aquecimento',
            'testimonial': 'Testemunho',
            'awareness': 'Awareness'
        };

        return `${typeNames[aiData.creativeType]} ${objectiveNames[aiData.objective]} - IA`;
    }

    getObjectiveText(objective) {
        const objectives = {
            'engagement': 'engajamento no Instagram',
            'conversion': 'conversão na Kiwify',
            'traffic': 'tráfego para página de vendas',
            'warming': 'aquecimento de público',
            'testimonial': 'testemunhos visuais',
            'awareness': 'awareness de marca'
        };
        return objectives[objective] || objective;
    }

    updateGenerationProgress(percentage, text) {
        document.getElementById('aiProgress').style.width = `${percentage}%`;
        document.getElementById('aiProgressText').textContent = text;

        // Update steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const stepPercentage = (index + 1) * 25;
            if (percentage >= stepPercentage) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (percentage >= stepPercentage - 25) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    showAiPreview(creative) {
        const container = document.getElementById('aiPreviewContainer');
        const actions = document.getElementById('aiPreviewActions');

        container.innerHTML = `
            <img src="${creative.imageUrl}" alt="${creative.name}" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
        `;

        actions.style.display = 'flex';
    }

    addToAiHistory(creative) {
        this.aiHistory.unshift(creative);
        // Keep only last 20 items
        if (this.aiHistory.length > 20) {
            this.aiHistory = this.aiHistory.slice(0, 20);
        }
        this.saveData();
        this.renderAiHistory();
    }

    renderAiHistory() {
        const container = document.getElementById('aiHistoryGrid');
        
        if (this.aiHistory.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">Nenhum criativo gerado ainda.</p>';
            return;
        }

        container.innerHTML = this.aiHistory.map(creative => `
            <div class="ai-history-item" onclick="creativesManager.viewAiHistoryItem(${creative.id})">
                <img src="${creative.imageUrl}" alt="${creative.name}">
                <div class="ai-history-info">
                    <h6>${creative.name}</h6>
                    <small>${this.formatDate(creative.createdAt)}</small>
                </div>
            </div>
        `).join('');
    }

    viewAiHistoryItem(id) {
        const creative = this.aiHistory.find(c => c.id === id);
        if (creative) {
            this.currentGeneratedImage = creative;
            this.showAiPreview(creative);
        }
    }

    regenerateCreative() {
        if (!this.currentGeneratedImage || !this.currentGeneratedImage.aiDetails) return;
        
        this.generateCreativeWithAI(this.currentGeneratedImage.aiDetails);
    }

    saveGeneratedCreative() {
        if (!this.currentGeneratedImage) return;

        // Add to main creatives list
        this.creatives.unshift(this.currentGeneratedImage);
        this.saveData();
        this.renderCreatives();
        this.renderOverviewStats();

        // Clear preview
        this.currentGeneratedImage = null;
        document.getElementById('aiPreviewContainer').innerHTML = `
            <div class="ai-placeholder">
                <i class="fas fa-image"></i>
                <p>O criativo gerado aparecerá aqui</p>
            </div>
        `;
        document.getElementById('aiPreviewActions').style.display = 'none';

        // Reset form
        document.getElementById('aiGeneratorForm').reset();

        this.showNotification('Criativo salvo na galeria com sucesso!', 'success');
    }

    cancelAiGeneration() {
        this.closeModal('aiGenerationModal');
        // Reset progress
        this.updateGenerationProgress(0, 'Iniciando geração...');
    }

    // Analytics Methods
    renderAnalytics() {
        this.renderMostViewed();
        this.renderTypePerformance();
        this.renderLanguageDistribution();
        this.renderAiVsManualComparison();
    }

    renderMostViewed() {
        const container = document.getElementById('mostViewedList');
        
        // Simulate view data
        const viewData = this.creatives.slice(0, 5).map(creative => ({
            ...creative,
            views: Math.floor(Math.random() * 1000) + 100
        })).sort((a, b) => b.views - a.views);

        container.innerHTML = viewData.map(creative => `
            <div class="analytics-item">
                <img src="${creative.imageUrl}" alt="${creative.name}" class="analytics-thumb">
                <div class="analytics-info">
                    <strong>${creative.name}</strong>
                    <span>${creative.views} visualizações</span>
                </div>
            </div>
        `).join('');
    }

    renderTypePerformance() {
        const container = document.getElementById('typePerformanceChart');
        
        // Count creatives by type
        const typeCounts = {};
        this.creatives.forEach(creative => {
            typeCounts[creative.type] = (typeCounts[creative.type] || 0) + 1;
        });

        container.innerHTML = Object.entries(typeCounts).map(([type, count]) => `
            <div class="chart-item">
                <span class="chart-label">${this.getTypeText(type)}</span>
                <div class="chart-bar">
                    <div class="chart-fill" style="width: ${(count / this.creatives.length) * 100}%"></div>
                </div>
                <span class="chart-value">${count}</span>
            </div>
        `).join('');
    }

    renderLanguageDistribution() {
        const container = document.getElementById('languageDistributionChart');
        
        // Count creatives by language
        const langCounts = {};
        this.creatives.forEach(creative => {
            langCounts[creative.language] = (langCounts[creative.language] || 0) + 1;
        });

        container.innerHTML = Object.entries(langCounts).map(([lang, count]) => `
            <div class="chart-item">
                <span class="chart-label">${this.getLanguageText(lang)}</span>
                <div class="chart-bar">
                    <div class="chart-fill" style="width: ${(count / this.creatives.length) * 100}%"></div>
                </div>
                <span class="chart-value">${count}</span>
            </div>
        `).join('');
    }

    renderAiVsManualComparison() {
        const container = document.getElementById('aiVsManualComparison');
        
        const aiCount = this.creatives.filter(c => c.source === 'ai').length;
        const manualCount = this.creatives.filter(c => c.source === 'manual').length;
        const total = this.creatives.length;

        container.innerHTML = `
            <div class="comparison-item">
                <div class="comparison-label">
                    <i class="fas fa-robot"></i>
                    Gerados por IA
                </div>
                <div class="comparison-bar">
                    <div class="comparison-fill ai" style="width: ${total ? (aiCount / total) * 100 : 0}%"></div>
                </div>
                <span class="comparison-value">${aiCount}</span>
            </div>
            <div class="comparison-item">
                <div class="comparison-label">
                    <i class="fas fa-user"></i>
                    Criados Manualmente
                </div>
                <div class="comparison-bar">
                    <div class="comparison-fill manual" style="width: ${total ? (manualCount / total) * 100 : 0}%"></div>
                </div>
                <span class="comparison-value">${manualCount}</span>
            </div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('creativesGrid')) {
            window.creativesManager = new CreativesManager();
        }
    }, 100);
});