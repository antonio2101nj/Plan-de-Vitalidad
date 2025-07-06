// Bonus Management System for Plan de Vitalidad Admin
class BonusManager {
    constructor() {
        this.bonus = [];
        this.filteredBonus = [];
        this.currentPage = 1;
        this.bonusPerPage = 12;
        this.currentView = 'cards';
        this.currentEditingBonus = null;
        this.currentDeleteBonus = null;
        
        this.init();
    }
    
    init() {
        this.loadDemoBonus();
        this.setupEventListeners();
        this.waitForBonusTab();
    }
    
    waitForBonusTab() {
        // Check if bonus tab elements exist
        const bonusGrid = document.getElementById('bonusGrid');
        
        if (bonusGrid) {
            console.log('Bonus tab elements found, initializing...');
            this.renderBonus();
            this.updateStats();
        } else {
            console.log('Bonus tab elements not found, waiting for tab activation...');
            // Wait for tab to be clicked
            const bonusTab = document.querySelector('a[href="#bonus-extras"]');
            if (bonusTab) {
                bonusTab.addEventListener('click', () => {
                    console.log('Bonus tab clicked, initializing...');
                    setTimeout(() => {
                        this.renderBonus();
                        this.updateStats();
                    }, 100);
                });
            }
        }
    }
    
    // Demo bonus data
    loadDemoBonus() {
        this.bonus = [
            {
                id: 1,
                name: 'Planner de 30 Días para Transformación Total',
                description: 'Un planner completo para organizar tu transformación durante 30 días con seguimiento diario de hábitos, metas y progreso.',
                type: 'planner',
                language: 'es',
                visibility: 'premium',
                releaseType: 'immediate',
                delayDays: null,
                scheduledDate: null,
                status: 'active',
                image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Planner+30+Días',
                file: 'planner-30-dias-transformacion.pdf',
                fileSize: '3.2 MB',
                createdAt: '2024-01-10'
            },
            {
                id: 2,
                name: 'Checklist de Alimentação Saudável',
                description: 'Lista completa de verificação para manter uma alimentação equilibrada no dia a dia, com dicas práticas e fáceis de seguir.',
                type: 'checklist',
                language: 'pt',
                visibility: 'both',
                releaseType: 'delayed',
                delayDays: 7,
                scheduledDate: null,
                status: 'active',
                image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Checklist+Alimentação',
                file: 'checklist-alimentacao-saudavel.pdf',
                fileSize: '1.8 MB',
                createdAt: '2024-01-15'
            },
            {
                id: 3,
                name: 'Weekly Wellness Challenge Guide',
                description: 'A comprehensive guide with weekly challenges to improve your overall wellness, including physical, mental, and emotional health activities.',
                type: 'challenge',
                language: 'en',
                visibility: 'premium',
                releaseType: 'scheduled',
                delayDays: null,
                scheduledDate: '2024-04-01T09:00:00',
                status: 'active',
                image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Weekly+Challenge',
                file: 'weekly-wellness-challenge.pdf',
                fileSize: '4.5 MB',
                createdAt: '2024-02-01'
            },
            {
                id: 4,
                name: 'Mini Guía de Ejercicios en Casa',
                description: 'Guía práctica con ejercicios simples que puedes hacer en casa sin equipamiento especial. Perfecta para principiantes.',
                type: 'mini-guide',
                language: 'es',
                visibility: 'free',
                releaseType: 'immediate',
                delayDays: null,
                scheduledDate: null,
                status: 'active',
                image: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Ejercicios+Casa',
                file: 'mini-guia-ejercicios-casa.pdf',
                fileSize: '2.1 MB',
                createdAt: '2024-02-10'
            },
            {
                id: 5,
                name: 'Calendário de Hábitos Saudáveis',
                description: 'Calendário interativo para acompanhar seus hábitos saudáveis mensalmente, com espaço para anotações e reflexões.',
                type: 'calendar',
                language: 'pt',
                visibility: 'premium',
                releaseType: 'delayed',
                delayDays: 14,
                scheduledDate: null,
                status: 'active',
                image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Calendário+Hábitos',
                file: 'calendario-habitos-saudaveis.pdf',
                fileSize: '2.7 MB',
                createdAt: '2024-02-20'
            },
            {
                id: 6,
                name: 'Meditation Starter Kit',
                description: 'Complete starter kit for meditation beginners including guided audio sessions, breathing techniques, and progress tracking sheets.',
                type: 'other',
                language: 'en',
                visibility: 'both',
                releaseType: 'immediate',
                delayDays: null,
                scheduledDate: null,
                status: 'inactive',
                image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Meditation+Kit',
                file: 'meditation-starter-kit.zip',
                fileSize: '15.3 MB',
                createdAt: '2024-03-01'
            }
        ];
        
        this.filteredBonus = [...this.bonus];
    }
    
    setupEventListeners() {
        // Search and filters
        const searchInput = document.getElementById('bonusSearchInput');
        const typeFilter = document.getElementById('bonusTypeFilter');
        const languageFilter = document.getElementById('bonusLanguageFilter');
        const visibilityFilter = document.getElementById('bonusVisibilityFilter');
        const statusFilter = document.getElementById('bonusStatusFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.applyFilters());
        }
        if (languageFilter) {
            languageFilter.addEventListener('change', () => this.applyFilters());
        }
        if (visibilityFilter) {
            visibilityFilter.addEventListener('change', () => this.applyFilters());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // View toggle
        const cardViewBtn = document.getElementById('bonusCardViewBtn');
        const tableViewBtn = document.getElementById('bonusTableViewBtn');
        
        if (cardViewBtn) {
            cardViewBtn.addEventListener('click', () => this.switchView('cards'));
        }
        if (tableViewBtn) {
            tableViewBtn.addEventListener('click', () => this.switchView('table'));
        }
        
        // Create bonus button
        const createBonusBtn = document.getElementById('createBonusBtn');
        if (createBonusBtn) {
            createBonusBtn.addEventListener('click', () => this.openCreateBonusModal());
        }
        
        // Export bonus button
        const exportBonusBtn = document.getElementById('exportBonusBtn');
        if (exportBonusBtn) {
            exportBonusBtn.addEventListener('click', () => this.exportBonus());
        }
        
        // Modal event listeners
        this.setupModalEventListeners();
        this.setupFileUploads();
        this.setupReleaseTypeHandlers();
        
        // Pagination
        const prevPageBtn = document.getElementById('bonusPrevPageBtn');
        const nextPageBtn = document.getElementById('bonusNextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.goToNextPage());
        }
    }
    
    setupModalEventListeners() {
        // Bonus modal
        const bonusModal = document.getElementById('bonusModal');
        const bonusModalClose = document.getElementById('bonusModalClose');
        const bonusModalCancel = document.getElementById('bonusModalCancel');
        const bonusForm = document.getElementById('bonusForm');
        
        if (bonusModalClose) {
            bonusModalClose.addEventListener('click', () => this.closeBonusModal());
        }
        if (bonusModalCancel) {
            bonusModalCancel.addEventListener('click', () => this.closeBonusModal());
        }
        if (bonusForm) {
            bonusForm.addEventListener('submit', (e) => this.handleBonusFormSubmit(e));
        }
        
        // Delete confirmation modal
        const confirmDeleteBonusModal = document.getElementById('confirmDeleteBonusModal');
        const confirmDeleteBonusClose = document.getElementById('confirmDeleteBonusClose');
        const confirmDeleteBonusCancel = document.getElementById('confirmDeleteBonusCancel');
        const confirmDeleteBonusConfirm = document.getElementById('confirmDeleteBonusConfirm');
        
        if (confirmDeleteBonusClose) {
            confirmDeleteBonusClose.addEventListener('click', () => this.closeDeleteBonusModal());
        }
        if (confirmDeleteBonusCancel) {
            confirmDeleteBonusCancel.addEventListener('click', () => this.closeDeleteBonusModal());
        }
        if (confirmDeleteBonusConfirm) {
            confirmDeleteBonusConfirm.addEventListener('click', () => this.confirmDeleteBonus());
        }
        
        // Close modals when clicking outside
        if (bonusModal) {
            bonusModal.addEventListener('click', (e) => {
                if (e.target === bonusModal) this.closeBonusModal();
            });
        }
        if (confirmDeleteBonusModal) {
            confirmDeleteBonusModal.addEventListener('click', (e) => {
                if (e.target === confirmDeleteBonusModal) this.closeDeleteBonusModal();
            });
        }
    }
    
    setupReleaseTypeHandlers() {
        const releaseTypeSelect = document.getElementById('bonusReleaseType');
        const delayDaysGroup = document.getElementById('delayDaysGroup');
        const scheduledDateGroup = document.getElementById('scheduledDateGroup');
        
        if (releaseTypeSelect) {
            releaseTypeSelect.addEventListener('change', (e) => {
                const value = e.target.value;
                
                // Hide all conditional fields first
                if (delayDaysGroup) delayDaysGroup.style.display = 'none';
                if (scheduledDateGroup) scheduledDateGroup.style.display = 'none';
                
                // Show relevant field based on selection
                if (value === 'delayed' && delayDaysGroup) {
                    delayDaysGroup.style.display = 'block';
                } else if (value === 'scheduled' && scheduledDateGroup) {
                    scheduledDateGroup.style.display = 'block';
                }
            });
        }
    }
    
    setupFileUploads() {
        const fileInputs = ['bonusImage', 'bonusFile'];
        
        fileInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', (e) => this.handleBonusFileUpload(e, inputId));
            }
            
            // Setup drag and drop
            const uploadArea = input?.closest('.file-upload-area');
            if (uploadArea) {
                uploadArea.addEventListener('click', () => input.click());
                uploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    uploadArea.classList.add('dragover');
                });
                uploadArea.addEventListener('dragleave', () => {
                    uploadArea.classList.remove('dragover');
                });
                uploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    uploadArea.classList.remove('dragover');
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        input.files = files;
                        this.handleBonusFileUpload({ target: input }, inputId);
                    }
                });
            }
        });
    }
    
    handleBonusFileUpload(event, inputId) {
        const file = event.target.files[0];
        if (!file) return;
        
        const fileType = inputId.replace('bonus', '').toLowerCase();
        this.showBonusFilePreview(file, fileType);
    }
    
    showBonusFilePreview(file, type) {
        const uploadArea = document.getElementById(`bonus${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea`);
        const placeholder = uploadArea?.querySelector('.upload-placeholder');
        const preview = uploadArea?.querySelector('.upload-preview');
        
        if (!uploadArea || !placeholder || !preview) return;
        
        placeholder.style.display = 'none';
        preview.style.display = 'block';
        
        if (type === 'image') {
            const img = preview.querySelector('img');
            if (img && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        } else if (type === 'file') {
            const fileName = preview.querySelector('.file-name');
            const fileSize = preview.querySelector('.file-size');
            const fileIcon = preview.querySelector('#bonusFileIcon');
            
            if (fileName) fileName.textContent = file.name;
            if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
            if (fileIcon) {
                fileIcon.className = this.getFileIcon(file.type);
            }
        }
    }
    
    getFileIcon(fileType) {
        if (fileType.includes('pdf')) return 'fas fa-file-pdf';
        if (fileType.includes('video')) return 'fas fa-file-video';
        if (fileType.includes('audio')) return 'fas fa-file-audio';
        if (fileType.includes('zip')) return 'fas fa-file-archive';
        if (fileType.includes('image')) return 'fas fa-file-image';
        return 'fas fa-file';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    applyFilters() {
        const searchTerm = document.getElementById('bonusSearchInput')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('bonusTypeFilter')?.value || '';
        const languageFilter = document.getElementById('bonusLanguageFilter')?.value || '';
        const visibilityFilter = document.getElementById('bonusVisibilityFilter')?.value || '';
        const statusFilter = document.getElementById('bonusStatusFilter')?.value || '';
        
        this.filteredBonus = this.bonus.filter(bonus => {
            const matchesSearch = bonus.name.toLowerCase().includes(searchTerm);
            const matchesType = !typeFilter || bonus.type === typeFilter;
            const matchesLanguage = !languageFilter || bonus.language === languageFilter;
            const matchesVisibility = !visibilityFilter || bonus.visibility === visibilityFilter;
            const matchesStatus = !statusFilter || bonus.status === statusFilter;
            
            return matchesSearch && matchesType && matchesLanguage && matchesVisibility && matchesStatus;
        });
        
        this.currentPage = 1;
        this.renderBonus();
        this.updatePagination();
    }
    
    switchView(view) {
        this.currentView = view;
        
        const cardViewBtn = document.getElementById('bonusCardViewBtn');
        const tableViewBtn = document.getElementById('bonusTableViewBtn');
        const bonusGrid = document.getElementById('bonusGrid');
        const bonusTableContainer = document.getElementById('bonusTableContainer');
        
        if (view === 'cards') {
            cardViewBtn?.classList.add('active');
            tableViewBtn?.classList.remove('active');
            if (bonusGrid) bonusGrid.style.display = 'grid';
            if (bonusTableContainer) bonusTableContainer.style.display = 'none';
        } else {
            tableViewBtn?.classList.add('active');
            cardViewBtn?.classList.remove('active');
            if (bonusGrid) bonusGrid.style.display = 'none';
            if (bonusTableContainer) bonusTableContainer.style.display = 'block';
        }
        
        this.renderBonus();
    }
    
    renderBonus() {
        const loadingElement = document.getElementById('bonusLoading');
        const noBonusElement = document.getElementById('noBonusMessage');
        const bonusGrid = document.getElementById('bonusGrid');
        
        // Check if bonus elements exist (tab might not be active)
        if (!bonusGrid) {
            console.log('Bonus elements not found - tab might not be active yet');
            // Try to find and click the bonus tab
            const bonusTab = document.querySelector('a[href="#bonus-extras"]');
            if (bonusTab && !bonusTab.classList.contains('active')) {
                console.log('Attempting to activate bonus tab...');
                bonusTab.click();
                setTimeout(() => this.renderBonus(), 200);
            }
            return;
        }
        
        console.log('Rendering bonus with', this.filteredBonus.length, 'items');
        
        // Show loading
        if (loadingElement) loadingElement.style.display = 'flex';
        if (noBonusElement) noBonusElement.style.display = 'none';
        
        // Simulate loading delay
        setTimeout(() => {
            if (loadingElement) loadingElement.style.display = 'none';
            
            if (this.filteredBonus.length === 0) {
                if (noBonusElement) noBonusElement.style.display = 'flex';
                return;
            }
            
            // Calculate pagination
            const startIndex = (this.currentPage - 1) * this.bonusPerPage;
            const endIndex = startIndex + this.bonusPerPage;
            const paginatedBonus = this.filteredBonus.slice(startIndex, endIndex);
            
            if (this.currentView === 'cards') {
                this.renderBonusGrid(paginatedBonus);
            } else {
                this.renderBonusTable(paginatedBonus);
            }
            
            this.updateStats();
            this.updatePagination();
        }, 300);
    }
    
    renderBonusGrid(bonus) {
        const grid = document.getElementById('bonusGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        bonus.forEach(bonusItem => {
            const card = this.createBonusCard(bonusItem);
            grid.appendChild(card);
        });
    }
    
    createBonusCard(bonus) {
        const card = document.createElement('div');
        card.className = `bonus-card ${bonus.releaseType === 'scheduled' ? 'scheduled' : ''} ${bonus.visibility === 'premium' ? 'premium' : ''}`;
        
        const typeIcons = {
            'planner': '📋',
            'mini-guide': '📖',
            'challenge': '🏆',
            'checklist': '✅',
            'calendar': '📅',
            'other': '📄'
        };
        
        const languageFlags = {
            'es': '🇪🇸',
            'pt': '🇧🇷',
            'en': '🇺🇸'
        };
        
        const visibilityLabels = {
            'free': 'Gratuito',
            'premium': 'Premium',
            'both': 'Ambos'
        };
        
        const releaseInfo = this.getReleaseInfo(bonus);
        
        card.innerHTML = `
            <div class="bonus-image">
                ${bonus.image ? 
                    `<img src="${bonus.image}" alt="${bonus.name}">` :
                    `<div class="placeholder">${typeIcons[bonus.type] || '📄'}</div>`
                }
                <div class="bonus-type-badge">${typeIcons[bonus.type]} ${bonus.type.toUpperCase().replace('-', ' ')}</div>
                <div class="bonus-status-indicator ${bonus.status}"></div>
                ${bonus.releaseType !== 'immediate' ? `<div class="bonus-release-badge ${bonus.releaseType}">${releaseInfo.badge}</div>` : ''}
            </div>
            <div class="bonus-content">
                <div class="bonus-header">
                    <h3 class="bonus-title">${bonus.name}</h3>
                    <div class="bonus-meta">
                        <div class="bonus-language">
                            <span>${languageFlags[bonus.language]}</span>
                            <span>${bonus.language.toUpperCase()}</span>
                        </div>
                        <div class="bonus-visibility ${bonus.visibility}">
                            ${visibilityLabels[bonus.visibility]}
                        </div>
                    </div>
                </div>
                <div class="bonus-description">${bonus.description}</div>
                <div class="bonus-release-info ${bonus.releaseType}">
                    <i class="${releaseInfo.icon}"></i>
                    <span>${releaseInfo.text}</span>
                </div>
                <div class="bonus-footer">
                    <div class="bonus-actions">
                        <button class="action-btn edit" onclick="bonusManager.editBonus(${bonus.id})" title="Editar bônus">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn ${bonus.status === 'active' ? 'suspend' : 'activate'}" 
                                onclick="bonusManager.toggleBonusStatus(${bonus.id})" 
                                title="${bonus.status === 'active' ? 'Inativar' : 'Ativar'} bônus">
                            <i class="fas fa-${bonus.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="action-btn delete" onclick="bonusManager.deleteBonus(${bonus.id})" title="Excluir bônus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    renderBonusTable(bonus) {
        const tableBody = document.getElementById('bonusTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        bonus.forEach(bonusItem => {
            const row = this.createBonusTableRow(bonusItem);
            tableBody.appendChild(row);
        });
    }
    
    createBonusTableRow(bonus) {
        const row = document.createElement('tr');
        
        const typeIcons = {
            'planner': '📋',
            'mini-guide': '📖',
            'challenge': '🏆',
            'checklist': '✅',
            'calendar': '📅',
            'other': '📄'
        };
        
        const languageFlags = {
            'es': '🇪🇸',
            'pt': '🇧🇷',
            'en': '🇺🇸'
        };
        
        const releaseInfo = this.getReleaseInfo(bonus);
        
        row.innerHTML = `
            <td>
                <div class="bonus-info-table">
                    <div class="bonus-thumbnail">
                        ${bonus.image ? 
                            `<img src="${bonus.image}" alt="${bonus.name}">` :
                            `<div class="placeholder">${typeIcons[bonus.type]}</div>`
                        }
                    </div>
                    <div class="bonus-details-table">
                        <div class="bonus-name-table">${bonus.name}</div>
                        <div class="bonus-description-table">${bonus.description}</div>
                    </div>
                </div>
            </td>
            <td>${typeIcons[bonus.type]} ${bonus.type.charAt(0).toUpperCase() + bonus.type.slice(1).replace('-', ' ')}</td>
            <td>
                <span class="language-flag">${languageFlags[bonus.language]}</span>
                ${bonus.language.toUpperCase()}
            </td>
            <td>
                <span class="bonus-visibility ${bonus.visibility}">
                    ${bonus.visibility === 'free' ? '🆓 Gratuito' : 
                      bonus.visibility === 'premium' ? '👑 Premium' : '👥 Ambos'}
                </span>
            </td>
            <td>
                <div class="bonus-release-table ${bonus.releaseType}">
                    <i class="${releaseInfo.icon}"></i>
                    <span>${releaseInfo.text}</span>
                </div>
            </td>
            <td>
                <span class="status-badge ${bonus.status}">
                    ${bonus.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="bonusManager.editBonus(${bonus.id})" title="Editar bônus">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn ${bonus.status === 'active' ? 'suspend' : 'activate'}" 
                            onclick="bonusManager.toggleBonusStatus(${bonus.id})" 
                            title="${bonus.status === 'active' ? 'Inativar' : 'Ativar'} bônus">
                        <i class="fas fa-${bonus.status === 'active' ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="action-btn delete" onclick="bonusManager.deleteBonus(${bonus.id})" title="Excluir bônus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }
    
    getReleaseInfo(bonus) {
        switch (bonus.releaseType) {
            case 'immediate':
                return {
                    icon: 'fas fa-bolt',
                    text: 'Liberação imediata',
                    badge: '⚡'
                };
            case 'delayed':
                return {
                    icon: 'fas fa-clock',
                    text: `Liberar no dia ${bonus.delayDays}`,
                    badge: `Dia ${bonus.delayDays}`
                };
            case 'scheduled':
                const date = new Date(bonus.scheduledDate);
                return {
                    icon: 'fas fa-calendar-alt',
                    text: `Agendado para ${date.toLocaleDateString('pt-BR')}`,
                    badge: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                };
            default:
                return {
                    icon: 'fas fa-question',
                    text: 'Não definido',
                    badge: '?'
                };
        }
    }
    
    updateStats() {
        const activeBonus = this.bonus.filter(b => b.status === 'active').length;
        const premiumBonus = this.bonus.filter(b => b.visibility === 'premium').length;
        const scheduledBonus = this.bonus.filter(b => b.releaseType === 'scheduled').length;
        const totalBonus = this.bonus.length;
        
        const activeBonusCount = document.getElementById('activeBonusCount');
        const premiumBonusCount = document.getElementById('premiumBonusCount');
        const scheduledBonusCount = document.getElementById('scheduledBonusCount');
        const totalBonusCount = document.getElementById('totalBonusCount');
        
        if (activeBonusCount) activeBonusCount.textContent = activeBonus;
        if (premiumBonusCount) premiumBonusCount.textContent = premiumBonus;
        if (scheduledBonusCount) scheduledBonusCount.textContent = scheduledBonus;
        if (totalBonusCount) totalBonusCount.textContent = totalBonus;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredBonus.length / this.bonusPerPage);
        const startIndex = (this.currentPage - 1) * this.bonusPerPage;
        const endIndex = Math.min(startIndex + this.bonusPerPage, this.filteredBonus.length);
        
        // Update pagination info
        const paginationInfo = document.getElementById('bonusPaginationInfo');
        if (paginationInfo) {
            paginationInfo.textContent = `Mostrando ${startIndex + 1}-${endIndex} de ${this.filteredBonus.length} bônus`;
        }
        
        // Update pagination buttons
        const prevPageBtn = document.getElementById('bonusPrevPageBtn');
        const nextPageBtn = document.getElementById('bonusNextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.disabled = this.currentPage <= 1;
        }
        if (nextPageBtn) {
            nextPageBtn.disabled = this.currentPage >= totalPages;
        }
        
        // Update page numbers
        const pageNumbers = document.getElementById('bonusPageNumbers');
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
                    pageBtn.textContent = i;
                    pageBtn.addEventListener('click', () => this.goToPage(i));
                    pageNumbers.appendChild(pageBtn);
                } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.style.padding = '8px 4px';
                    ellipsis.style.color = 'var(--gray-500)';
                    pageNumbers.appendChild(ellipsis);
                }
            }
        }
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderBonus();
    }
    
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderBonus();
        }
    }
    
    goToNextPage() {
        const totalPages = Math.ceil(this.filteredBonus.length / this.bonusPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderBonus();
        }
    }
    
    // Bonus actions
    editBonus(bonusId) {
        const bonus = this.bonus.find(b => b.id === bonusId);
        if (!bonus) return;
        
        this.currentEditingBonus = bonus;
        this.openBonusModal(bonus);
    }
    
    toggleBonusStatus(bonusId) {
        const bonus = this.bonus.find(b => b.id === bonusId);
        if (!bonus) return;
        
        bonus.status = bonus.status === 'active' ? 'inactive' : 'active';
        this.renderBonus();
        this.showNotification(`Bônus ${bonus.name} ${bonus.status === 'active' ? 'ativado' : 'inativado'}`, 'success');
    }
    
    deleteBonus(bonusId) {
        const bonus = this.bonus.find(b => b.id === bonusId);
        if (!bonus) return;
        
        this.currentDeleteBonus = bonus;
        this.openDeleteBonusModal(bonus);
    }
    
    confirmDeleteBonus() {
        if (!this.currentDeleteBonus) return;
        
        const bonusIndex = this.bonus.findIndex(b => b.id === this.currentDeleteBonus.id);
        if (bonusIndex > -1) {
            const bonusName = this.currentDeleteBonus.name;
            this.bonus.splice(bonusIndex, 1);
            this.applyFilters();
            this.showNotification(`Bônus ${bonusName} excluído com sucesso`, 'success');
        }
        
        this.closeDeleteBonusModal();
    }
    
    // Modal functions
    openCreateBonusModal() {
        this.currentEditingBonus = null;
        this.openBonusModal();
    }
    
    openBonusModal(bonus = null) {
        const modal = document.getElementById('bonusModal');
        const modalTitle = document.getElementById('bonusModalTitle');
        
        if (!modal) return;
        
        if (bonus) {
            modalTitle.textContent = 'Editar Bônus';
            this.populateBonusForm(bonus);
        } else {
            modalTitle.textContent = 'Adicionar Novo Bônus';
            this.clearBonusForm();
        }
        
        modal.classList.add('show');
    }
    
    closeBonusModal() {
        const modal = document.getElementById('bonusModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentEditingBonus = null;
        }
    }
    
    openDeleteBonusModal(bonus) {
        const modal = document.getElementById('confirmDeleteBonusModal');
        const deleteBonusName = document.getElementById('deleteBonusName');
        const deleteBonusType = document.getElementById('deleteBonusType');
        
        if (!modal) return;
        
        if (deleteBonusName) deleteBonusName.textContent = bonus.name;
        if (deleteBonusType) deleteBonusType.textContent = bonus.type;
        
        modal.classList.add('show');
    }
    
    closeDeleteBonusModal() {
        const modal = document.getElementById('confirmDeleteBonusModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentDeleteBonus = null;
        }
    }
    
    populateBonusForm(bonus) {
        document.getElementById('bonusId').value = bonus.id;
        document.getElementById('bonusName').value = bonus.name;
        document.getElementById('bonusDescription').value = bonus.description;
        document.getElementById('bonusType').value = bonus.type;
        document.getElementById('bonusLanguage').value = bonus.language;
        document.getElementById('bonusVisibility').value = bonus.visibility;
        document.getElementById('bonusReleaseType').value = bonus.releaseType;
        document.getElementById('bonusStatus').value = bonus.status;
        
        // Handle release type specific fields
        const releaseTypeSelect = document.getElementById('bonusReleaseType');
        if (releaseTypeSelect) {
            releaseTypeSelect.dispatchEvent(new Event('change'));
        }
        
        if (bonus.delayDays) {
            document.getElementById('bonusDelayDays').value = bonus.delayDays;
        }
        
        if (bonus.scheduledDate) {
            document.getElementById('bonusScheduledDate').value = bonus.scheduledDate;
        }
    }
    
    clearBonusForm() {
        document.getElementById('bonusForm').reset();
        document.getElementById('bonusId').value = '';
        
        // Hide conditional fields
        const delayDaysGroup = document.getElementById('delayDaysGroup');
        const scheduledDateGroup = document.getElementById('scheduledDateGroup');
        if (delayDaysGroup) delayDaysGroup.style.display = 'none';
        if (scheduledDateGroup) scheduledDateGroup.style.display = 'none';
        
        // Clear file previews
        ['image', 'file'].forEach(type => {
            const uploadArea = document.getElementById(`bonus${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea`);
            const placeholder = uploadArea?.querySelector('.upload-placeholder');
            const preview = uploadArea?.querySelector('.upload-preview');
            
            if (placeholder) placeholder.style.display = 'block';
            if (preview) preview.style.display = 'none';
        });
    }
    
    handleBonusFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const bonusData = {
            name: formData.get('name'),
            description: formData.get('description'),
            type: formData.get('type'),
            language: formData.get('language'),
            visibility: formData.get('visibility'),
            releaseType: formData.get('releaseType'),
            delayDays: formData.get('delayDays') ? parseInt(formData.get('delayDays')) : null,
            scheduledDate: formData.get('scheduledDate') || null,
            status: formData.get('status')
        };
        
        // Validate required fields
        if (!bonusData.name || !bonusData.description || !bonusData.type || 
            !bonusData.language || !bonusData.visibility || !bonusData.releaseType || !bonusData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Validate release type specific fields
        if (bonusData.releaseType === 'delayed' && !bonusData.delayDays) {
            this.showNotification('Por favor, informe o número de dias para liberação', 'error');
            return;
        }
        
        if (bonusData.releaseType === 'scheduled' && !bonusData.scheduledDate) {
            this.showNotification('Por favor, informe a data de liberação', 'error');
            return;
        }
        
        if (this.currentEditingBonus) {
            this.updateBonus(bonusData);
        } else {
            this.createBonus(bonusData);
        }
    }
    
    createBonus(bonusData) {
        const newBonus = {
            id: Math.max(...this.bonus.map(b => b.id)) + 1,
            ...bonusData,
            image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=' + encodeURIComponent(bonusData.name),
            file: 'demo-bonus.' + (bonusData.type === 'planner' ? 'pdf' : 'pdf'),
            fileSize: '2.5 MB',
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        this.bonus.push(newBonus);
        this.applyFilters();
        this.closeBonusModal();
        this.showNotification(`Bônus ${newBonus.name} criado com sucesso`, 'success');
    }
    
    updateBonus(bonusData) {
        const bonusIndex = this.bonus.findIndex(b => b.id === this.currentEditingBonus.id);
        if (bonusIndex > -1) {
            this.bonus[bonusIndex] = {
                ...this.bonus[bonusIndex],
                ...bonusData
            };
            
            this.applyFilters();
            this.closeBonusModal();
            this.showNotification(`Bônus ${bonusData.name} atualizado com sucesso`, 'success');
        }
    }
    
    exportBonus() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `plan-vitalidad-bonus-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Lista de bônus exportada com sucesso', 'success');
        }
    }
    
    generateCSV() {
        const headers = ['Nome', 'Tipo', 'Idioma', 'Visibilidade', 'Liberação', 'Status', 'Criado em'];
        const rows = this.filteredBonus.map(bonus => [
            bonus.name,
            bonus.type,
            bonus.language,
            bonus.visibility,
            this.getReleaseInfo(bonus).text,
            bonus.status,
            bonus.createdAt
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
            
        return '\uFEFF' + csvContent;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Global function to remove bonus files
function removeBonusFile(type) {
    const uploadArea = document.getElementById(`bonus${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea`);
    const placeholder = uploadArea?.querySelector('.upload-placeholder');
    const preview = uploadArea?.querySelector('.upload-preview');
    const input = document.getElementById(`bonus${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (placeholder) placeholder.style.display = 'block';
    if (preview) preview.style.display = 'none';
    if (input) input.value = '';
}

// Initialize bonus manager
let bonusManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up bonus manager...');
    
    // Function to initialize bonus manager
    function initializeBonusManager() {
        if (!bonusManager) {
            console.log('Creating new BonusManager instance...');
            bonusManager = new BonusManager();
            window.bonusManager = bonusManager;
        } else {
            console.log('BonusManager already exists, re-rendering...');
            bonusManager.renderBonus();
            bonusManager.updateStats();
        }
    }
    
    // Wait for the main script to load the tab system
    setTimeout(() => {
        // Look for bonus tab
        const bonusTab = document.querySelector('.menu-item[data-tab="bonus-materials"]');
        
        if (bonusTab) {
            console.log('Found bonus tab, setting up listener...');
            bonusTab.addEventListener('click', function() {
                console.log('Bonus tab clicked, initializing...');
                setTimeout(initializeBonusManager, 300);
            });
        }
        
        // Check if bonus tab is already active
        const bonusSection = document.querySelector('#bonus-materials');
        if (bonusSection && bonusSection.classList.contains('active')) {
            console.log('Bonus section is already active, initializing...');
            setTimeout(initializeBonusManager, 500);
        }
        
        // Also listen for any tab changes using MutationObserver
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.id === 'bonus-materials' && target.classList.contains('active')) {
                        console.log('Bonus section became active via mutation observer');
                        setTimeout(initializeBonusManager, 100);
                    }
                }
            });
        });
        
        // Start observing the bonus section directly
        if (bonusSection) {
            observer.observe(bonusSection, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
        
        // Also observe the main content area
        const mainContent = document.querySelector('.content-area');
        if (mainContent) {
            observer.observe(mainContent, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        }
    }, 1000);
});

// Make sure it's available globally
window.bonusManager = bonusManager;