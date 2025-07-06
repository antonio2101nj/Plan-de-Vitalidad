// Challenges Management System for Plan de Vitalidad Admin
class ChallengesManager {
    constructor() {
        this.challenges = [];
        this.filteredChallenges = [];
        this.currentPage = 1;
        this.challengesPerPage = 12;
        this.currentView = 'cards';
        this.currentEditingChallenge = null;
        this.currentDeleteChallenge = null;
        this.currentDayEditing = 1;
        this.challengeDays = {};
        
        this.init();
    }
    
    init() {
        this.loadDemoChallenges();
        this.setupEventListeners();
        this.waitForChallengesTab();
    }
    
    waitForChallengesTab() {
        const challengesGrid = document.getElementById('challengesGrid');
        
        if (challengesGrid) {
            console.log('Challenges tab elements found, initializing...');
            this.renderChallenges();
            this.updateStats();
        } else {
            console.log('Challenges tab elements not found, waiting for tab activation...');
        }
    }
    
    // Demo challenges data
    loadDemoChallenges() {
        this.challenges = [
            {
                id: 1,
                name: 'Desafio 30 Días para Transformación Total',
                description: 'Un programa completo de 30 días diseñado para transformar tu vida con hábitos saludables, ejercicio y mindfulness.',
                duration: 30,
                language: 'es',
                visibility: 'premium',
                progressUnlockable: true,
                releaseType: 'immediate',
                delayDays: null,
                scheduledDate: null,
                status: 'active',
                image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=30+Días+Transformación',
                participants: 156,
                completionRate: 78,
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                name: 'Desafio 7 Dias de Alimentação Consciente',
                description: 'Uma jornada de uma semana para desenvolver consciência alimentar e criar uma relação mais saudável com a comida.',
                duration: 7,
                language: 'pt',
                visibility: 'both',
                progressUnlockable: false,
                releaseType: 'delayed',
                delayDays: 3,
                scheduledDate: null,
                status: 'active',
                image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=7+Dias+Alimentação',
                participants: 234,
                completionRate: 85,
                createdAt: '2024-02-01'
            },
            {
                id: 3,
                name: '21-Day Mindfulness Challenge',
                description: 'Build a consistent mindfulness practice with daily guided meditations and reflection exercises over 21 transformative days.',
                duration: 21,
                language: 'en',
                visibility: 'free',
                progressUnlockable: true,
                releaseType: 'scheduled',
                delayDays: null,
                scheduledDate: '2024-04-01T09:00:00',
                status: 'active',
                image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=21+Days+Mindfulness',
                participants: 89,
                completionRate: 72,
                createdAt: '2024-02-15'
            },
            {
                id: 4,
                name: 'Reto 14 Días de Ejercicio en Casa',
                description: 'Fortalece tu cuerpo con rutinas de ejercicio diseñadas para hacer en casa, sin necesidad de equipamiento especial.',
                duration: 14,
                language: 'es',
                visibility: 'free',
                progressUnlockable: false,
                releaseType: 'immediate',
                delayDays: null,
                scheduledDate: null,
                status: 'active',
                image: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=14+Días+Ejercicio',
                participants: 312,
                completionRate: 68,
                createdAt: '2024-02-20'
            },
            {
                id: 5,
                name: 'Desafio 10 Dias de Gratidão',
                description: 'Cultive o hábito da gratidão com práticas diárias que irão transformar sua perspectiva e bem-estar emocional.',
                duration: 10,
                language: 'pt',
                visibility: 'premium',
                progressUnlockable: true,
                releaseType: 'delayed',
                delayDays: 7,
                scheduledDate: null,
                status: 'inactive',
                image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=10+Dias+Gratidão',
                participants: 67,
                completionRate: 91,
                createdAt: '2024-03-01'
            }
        ];
        
        // Load demo days for first challenge
        this.challengeDays[1] = {};
        for (let day = 1; day <= 30; day++) {
            this.challengeDays[1][day] = {
                title: `Día ${day}: ${this.getDayTitle(day)}`,
                content: `Contenido del día ${day}. Actividades y ejercicios diseñados para tu transformación.`,
                motivationalPhrase: '¡Excelente trabajo! Estás un paso más cerca de tu transformación.',
                media: null,
                mediaType: null
            };
        }
        
        this.filteredChallenges = [...this.challenges];
    }
    
    getDayTitle(day) {
        const titles = [
            'Preparación Mental', 'Establecer Metas', 'Primer Ejercicio', 'Alimentación Consciente',
            'Rutina Matutina', 'Hidratación', 'Movimiento Activo', 'Descanso Reparador',
            'Gratitud Diaria', 'Conexión Social', 'Tiempo en Naturaleza', 'Reflexión Personal',
            'Ejercicio Intenso', 'Comida Saludable', 'Meditación', 'Lectura Inspiradora',
            'Actos de Bondad', 'Organización Personal', 'Creatividad', 'Ejercicio al Aire Libre',
            'Cocina Saludable', 'Relajación', 'Planificación', 'Ejercicio de Fuerza',
            'Mindfulness', 'Conexión Familiar', 'Aprendizaje Nuevo', 'Ejercicio Cardiovascular',
            'Reflexión Final', 'Celebración'
        ];
        return titles[day - 1] || `Actividad ${day}`;
    }
    
    setupEventListeners() {
        // Search and filters
        const searchInput = document.getElementById('challengeSearchInput');
        const languageFilter = document.getElementById('challengeLanguageFilter');
        const visibilityFilter = document.getElementById('challengeVisibilityFilter');
        const statusFilter = document.getElementById('challengeStatusFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
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
        const cardViewBtn = document.getElementById('challengeCardViewBtn');
        const tableViewBtn = document.getElementById('challengeTableViewBtn');
        
        if (cardViewBtn) {
            cardViewBtn.addEventListener('click', () => this.switchView('cards'));
        }
        if (tableViewBtn) {
            tableViewBtn.addEventListener('click', () => this.switchView('table'));
        }
        
        // Create challenge button
        const createChallengeBtn = document.getElementById('createChallengeBtn');
        if (createChallengeBtn) {
            createChallengeBtn.addEventListener('click', () => this.openCreateChallengeModal());
        }
        
        // Export challenges button
        const exportChallengesBtn = document.getElementById('exportChallengesBtn');
        if (exportChallengesBtn) {
            exportChallengesBtn.addEventListener('click', () => this.exportChallenges());
        }
        
        // Modal event listeners
        this.setupModalEventListeners();
        this.setupFileUploads();
        this.setupReleaseTypeHandlers();
        
        // Pagination
        const prevPageBtn = document.getElementById('challengesPrevPageBtn');
        const nextPageBtn = document.getElementById('challengesNextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.goToNextPage());
        }
    }
    
    setupModalEventListeners() {
        // Challenge modal
        const challengeModal = document.getElementById('challengeModal');
        const challengeModalClose = document.getElementById('challengeModalClose');
        const challengeModalCancel = document.getElementById('challengeModalCancel');
        const challengeForm = document.getElementById('challengeForm');
        
        if (challengeModalClose) {
            challengeModalClose.addEventListener('click', () => this.closeChallengeModal());
        }
        if (challengeModalCancel) {
            challengeModalCancel.addEventListener('click', () => this.closeChallengeModal());
        }
        if (challengeForm) {
            challengeForm.addEventListener('submit', (e) => this.handleChallengeFormSubmit(e));
        }
        
        // Challenge days modal
        const challengeDaysModal = document.getElementById('challengeDaysModal');
        const challengeDaysModalClose = document.getElementById('challengeDaysModalClose');
        const challengeDaysModalCancel = document.getElementById('challengeDaysModalCancel');
        const saveDayBtn = document.getElementById('saveDayBtn');
        const finishChallengeBtn = document.getElementById('finishChallengeBtn');
        const prevDayBtn = document.getElementById('prevDayBtn');
        const nextDayBtn = document.getElementById('nextDayBtn');
        
        if (challengeDaysModalClose) {
            challengeDaysModalClose.addEventListener('click', () => this.closeDaysModal());
        }
        if (challengeDaysModalCancel) {
            challengeDaysModalCancel.addEventListener('click', () => this.closeDaysModal());
        }
        if (saveDayBtn) {
            saveDayBtn.addEventListener('click', () => this.saveCurrentDay());
        }
        if (finishChallengeBtn) {
            finishChallengeBtn.addEventListener('click', () => this.finishChallengeConfiguration());
        }
        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', () => this.goToPreviousDay());
        }
        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', () => this.goToNextDay());
        }
        
        // Progress modal
        const progressModal = document.getElementById('challengeProgressModal');
        const progressModalClose = document.getElementById('challengeProgressModalClose');
        const progressModalCancel = document.getElementById('challengeProgressModalCancel');
        const exportProgressBtn = document.getElementById('exportProgressBtn');
        
        if (progressModalClose) {
            progressModalClose.addEventListener('click', () => this.closeProgressModal());
        }
        if (progressModalCancel) {
            progressModalCancel.addEventListener('click', () => this.closeProgressModal());
        }
        if (exportProgressBtn) {
            exportProgressBtn.addEventListener('click', () => this.exportProgressReport());
        }
        
        // Delete confirmation modal
        const confirmDeleteModal = document.getElementById('confirmDeleteChallengeModal');
        const confirmDeleteClose = document.getElementById('confirmDeleteChallengeClose');
        const confirmDeleteCancel = document.getElementById('confirmDeleteChallengeCancel');
        const confirmDeleteConfirm = document.getElementById('confirmDeleteChallengeConfirm');
        
        if (confirmDeleteClose) {
            confirmDeleteClose.addEventListener('click', () => this.closeDeleteChallengeModal());
        }
        if (confirmDeleteCancel) {
            confirmDeleteCancel.addEventListener('click', () => this.closeDeleteChallengeModal());
        }
        if (confirmDeleteConfirm) {
            confirmDeleteConfirm.addEventListener('click', () => this.confirmDeleteChallenge());
        }
        
        // Close modals when clicking outside
        if (challengeModal) {
            challengeModal.addEventListener('click', (e) => {
                if (e.target === challengeModal) this.closeChallengeModal();
            });
        }
        if (challengeDaysModal) {
            challengeDaysModal.addEventListener('click', (e) => {
                if (e.target === challengeDaysModal) this.closeDaysModal();
            });
        }
        if (progressModal) {
            progressModal.addEventListener('click', (e) => {
                if (e.target === progressModal) this.closeProgressModal();
            });
        }
        if (confirmDeleteModal) {
            confirmDeleteModal.addEventListener('click', (e) => {
                if (e.target === confirmDeleteModal) this.closeDeleteChallengeModal();
            });
        }
    }
    
    setupReleaseTypeHandlers() {
        const releaseTypeSelect = document.getElementById('challengeReleaseType');
        const delayDaysGroup = document.getElementById('challengeDelayDaysGroup');
        const scheduledDateGroup = document.getElementById('challengeScheduledDateGroup');
        
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
        const fileInputs = ['challengeImage', 'dayMedia'];
        
        fileInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', (e) => this.handleChallengeFileUpload(e, inputId));
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
                        this.handleChallengeFileUpload({ target: input }, inputId);
                    }
                });
            }
        });
    }
    
    handleChallengeFileUpload(event, inputId) {
        const file = event.target.files[0];
        if (!file) return;
        
        const fileType = inputId.replace('challenge', '').replace('day', '').toLowerCase();
        this.showChallengeFilePreview(file, fileType, inputId);
    }
    
    showChallengeFilePreview(file, type, inputId) {
        const uploadArea = document.getElementById(inputId + 'UploadArea');
        const placeholder = uploadArea?.querySelector('.upload-placeholder');
        const preview = uploadArea?.querySelector('.upload-preview');
        
        if (!uploadArea || !placeholder || !preview) return;
        
        placeholder.style.display = 'none';
        preview.style.display = 'flex';
        
        if (type === 'image' || file.type.startsWith('image/')) {
            const img = preview.querySelector('img');
            if (img) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        } else {
            const mediaName = preview.querySelector('.media-name, .file-name');
            const mediaSize = preview.querySelector('.media-size, .file-size');
            const mediaIcon = preview.querySelector('#dayMediaIcon, #challengeImageIcon');
            
            if (mediaName) mediaName.textContent = file.name;
            if (mediaSize) mediaSize.textContent = this.formatFileSize(file.size);
            if (mediaIcon) {
                mediaIcon.className = this.getFileIcon(file.type);
            }
        }
    }
    
    getFileIcon(fileType) {
        if (fileType.includes('image')) return 'fas fa-file-image';
        if (fileType.includes('video')) return 'fas fa-file-video';
        if (fileType.includes('audio')) return 'fas fa-file-audio';
        if (fileType.includes('pdf')) return 'fas fa-file-pdf';
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
        const searchTerm = document.getElementById('challengeSearchInput')?.value.toLowerCase() || '';
        const languageFilter = document.getElementById('challengeLanguageFilter')?.value || '';
        const visibilityFilter = document.getElementById('challengeVisibilityFilter')?.value || '';
        const statusFilter = document.getElementById('challengeStatusFilter')?.value || '';
        
        this.filteredChallenges = this.challenges.filter(challenge => {
            const matchesSearch = challenge.name.toLowerCase().includes(searchTerm);
            const matchesLanguage = !languageFilter || challenge.language === languageFilter;
            const matchesVisibility = !visibilityFilter || challenge.visibility === visibilityFilter;
            const matchesStatus = !statusFilter || challenge.status === statusFilter;
            
            return matchesSearch && matchesLanguage && matchesVisibility && matchesStatus;
        });
        
        this.currentPage = 1;
        this.renderChallenges();
        this.updatePagination();
    }
    
    switchView(view) {
        this.currentView = view;
        
        const cardViewBtn = document.getElementById('challengeCardViewBtn');
        const tableViewBtn = document.getElementById('challengeTableViewBtn');
        const challengesGrid = document.getElementById('challengesGrid');
        const challengesTableContainer = document.getElementById('challengesTableContainer');
        
        if (view === 'cards') {
            cardViewBtn?.classList.add('active');
            tableViewBtn?.classList.remove('active');
            if (challengesGrid) challengesGrid.style.display = 'grid';
            if (challengesTableContainer) challengesTableContainer.style.display = 'none';
        } else {
            tableViewBtn?.classList.add('active');
            cardViewBtn?.classList.remove('active');
            if (challengesGrid) challengesGrid.style.display = 'none';
            if (challengesTableContainer) challengesTableContainer.style.display = 'block';
        }
        
        this.renderChallenges();
    }
    
    renderChallenges() {
        const loadingElement = document.getElementById('challengesLoading');
        const noChallengesElement = document.getElementById('noChallengesMessage');
        const challengesGrid = document.getElementById('challengesGrid');
        
        // Check if challenges elements exist (tab might not be active)
        if (!challengesGrid) {
            console.log('Challenges elements not found - tab might not be active yet');
            return;
        }
        
        console.log('Rendering challenges with', this.filteredChallenges.length, 'items');
        
        // Show loading
        if (loadingElement) loadingElement.style.display = 'flex';
        if (noChallengesElement) noChallengesElement.style.display = 'none';
        
        // Simulate loading delay
        setTimeout(() => {
            if (loadingElement) loadingElement.style.display = 'none';
            
            if (this.filteredChallenges.length === 0) {
                if (noChallengesElement) noChallengesElement.style.display = 'flex';
                return;
            }
            
            // Calculate pagination
            const startIndex = (this.currentPage - 1) * this.challengesPerPage;
            const endIndex = startIndex + this.challengesPerPage;
            const paginatedChallenges = this.filteredChallenges.slice(startIndex, endIndex);
            
            if (this.currentView === 'cards') {
                this.renderChallengesGrid(paginatedChallenges);
            } else {
                this.renderChallengesTable(paginatedChallenges);
            }
            
            this.updateStats();
            this.updatePagination();
        }, 300);
    }
    
    renderChallengesGrid(challenges) {
        const grid = document.getElementById('challengesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        challenges.forEach(challenge => {
            const card = this.createChallengeCard(challenge);
            grid.appendChild(card);
        });
    }
    
    createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = `challenge-card ${challenge.visibility === 'premium' ? 'premium' : ''} ${challenge.releaseType === 'scheduled' ? 'scheduled' : ''}`;
        
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
        
        const releaseInfo = this.getReleaseInfo(challenge);
        
        card.innerHTML = `
            <div class="challenge-image">
                ${challenge.image ? 
                    `<img src="${challenge.image}" alt="${challenge.name}">` :
                    `<div class="placeholder">🏆</div>`
                }
                <div class="challenge-duration-badge">${challenge.duration} dias</div>
                <div class="challenge-status-indicator ${challenge.status}"></div>
                ${challenge.releaseType !== 'immediate' ? `<div class="challenge-release-badge ${challenge.releaseType}">${releaseInfo.badge}</div>` : ''}
            </div>
            <div class="challenge-content">
                <div class="challenge-header">
                    <h3 class="challenge-title">${challenge.name}</h3>
                    <div class="challenge-meta">
                        <div class="challenge-language">
                            <span>${languageFlags[challenge.language]}</span>
                            <span>${challenge.language.toUpperCase()}</span>
                        </div>
                        <div class="challenge-visibility ${challenge.visibility}">
                            ${visibilityLabels[challenge.visibility]}
                        </div>
                    </div>
                </div>
                <div class="challenge-description">${challenge.description}</div>
                <div class="challenge-stats">
                    <div class="challenge-stat">
                        <span class="challenge-stat-value">${challenge.participants}</span>
                        <span class="challenge-stat-label">Participantes</span>
                    </div>
                    <div class="challenge-stat">
                        <span class="challenge-stat-value">${challenge.completionRate}%</span>
                        <span class="challenge-stat-label">Conclusão</span>
                    </div>
                    <div class="challenge-stat">
                        <span class="challenge-stat-value">${challenge.progressUnlockable ? 'Sim' : 'Não'}</span>
                        <span class="challenge-stat-label">Desbloqueável</span>
                    </div>
                </div>
                <div class="challenge-progress-bar">
                    <div class="challenge-progress-fill" style="width: ${challenge.completionRate}%"></div>
                </div>
                <div class="challenge-footer">
                    <div class="challenge-actions">
                        <button class="challenge-action-btn edit" onclick="challengesManager.editChallenge(${challenge.id})" title="Editar desafio">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="challenge-action-btn progress" onclick="challengesManager.viewProgress(${challenge.id})" title="Ver progresso">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="challenge-action-btn toggle" onclick="challengesManager.toggleChallengeStatus(${challenge.id})" title="${challenge.status === 'active' ? 'Inativar' : 'Ativar'} desafio">
                            <i class="fas fa-${challenge.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="challenge-action-btn delete" onclick="challengesManager.deleteChallenge(${challenge.id})" title="Excluir desafio">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    getReleaseInfo(challenge) {
        switch (challenge.releaseType) {
            case 'immediate':
                return {
                    icon: 'fas fa-bolt',
                    text: 'Liberação imediata',
                    badge: '⚡'
                };
            case 'delayed':
                return {
                    icon: 'fas fa-clock',
                    text: `Liberar no dia ${challenge.delayDays}`,
                    badge: `Dia ${challenge.delayDays}`
                };
            case 'scheduled':
                const date = new Date(challenge.scheduledDate);
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
        const activeChallenges = this.challenges.filter(c => c.status === 'active').length;
        const premiumChallenges = this.challenges.filter(c => c.visibility === 'premium').length;
        const totalParticipants = this.challenges.reduce((total, c) => total + c.participants, 0);
        const totalChallenges = this.challenges.length;
        
        const activeChallengesCount = document.getElementById('activeChallengesCount');
        const premiumChallengesCount = document.getElementById('premiumChallengesCount');
        const totalParticipantsCount = document.getElementById('totalParticipantsCount');
        const totalChallengesCount = document.getElementById('totalChallengesCount');
        
        if (activeChallengesCount) activeChallengesCount.textContent = activeChallenges;
        if (premiumChallengesCount) premiumChallengesCount.textContent = premiumChallenges;
        if (totalParticipantsCount) totalParticipantsCount.textContent = totalParticipants;
        if (totalChallengesCount) totalChallengesCount.textContent = totalChallenges;
    }
    
    // Challenge actions
    editChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        this.currentEditingChallenge = challenge;
        this.openChallengeModal(challenge);
    }
    
    viewProgress(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        this.openProgressModal(challenge);
    }
    
    toggleChallengeStatus(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        challenge.status = challenge.status === 'active' ? 'inactive' : 'active';
        this.renderChallenges();
        this.showNotification(`Desafio ${challenge.name} ${challenge.status === 'active' ? 'ativado' : 'inativado'}`, 'success');
    }
    
    deleteChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        this.currentDeleteChallenge = challenge;
        this.openDeleteChallengeModal(challenge);
    }
    
    openCreateChallengeModal() {
        this.currentEditingChallenge = null;
        this.openChallengeModal();
    }
    
    openChallengeModal(challenge = null) {
        const modal = document.getElementById('challengeModal');
        const modalTitle = document.getElementById('challengeModalTitle');
        
        if (!modal) return;
        
        if (challenge) {
            modalTitle.textContent = 'Editar Desafio';
            this.populateChallengeForm(challenge);
        } else {
            modalTitle.textContent = 'Criar Novo Desafio';
            this.clearChallengeForm();
        }
        
        modal.classList.add('show');
    }
    
    closeChallengeModal() {
        const modal = document.getElementById('challengeModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentEditingChallenge = null;
        }
    }
    
    handleChallengeFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const challengeData = {
            name: formData.get('name'),
            description: formData.get('description'),
            duration: parseInt(formData.get('duration')),
            language: formData.get('language'),
            visibility: formData.get('visibility'),
            progressUnlockable: formData.get('progressUnlockable') === 'on',
            releaseType: formData.get('releaseType'),
            delayDays: formData.get('delayDays') ? parseInt(formData.get('delayDays')) : null,
            scheduledDate: formData.get('scheduledDate') || null,
            status: formData.get('status')
        };
        
        // Validate required fields
        if (!challengeData.name || !challengeData.description || !challengeData.duration || 
            !challengeData.language || !challengeData.visibility || !challengeData.releaseType || !challengeData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (this.currentEditingChallenge) {
            this.updateChallenge(challengeData);
        } else {
            this.createChallenge(challengeData);
        }
    }
    
    createChallenge(challengeData) {
        const newChallenge = {
            id: Math.max(...this.challenges.map(c => c.id)) + 1,
            ...challengeData,
            image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=' + encodeURIComponent(challengeData.name.substring(0, 20)),
            participants: 0,
            completionRate: 0,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        this.challenges.push(newChallenge);
        this.applyFilters();
        this.closeChallengeModal();
        
        // Open days configuration modal
        this.openDaysConfigurationModal(newChallenge);
        this.showNotification(`Desafio ${newChallenge.name} criado com sucesso`, 'success');
    }
    
    openDaysConfigurationModal(challenge) {
        this.currentEditingChallenge = challenge;
        this.currentDayEditing = 1;
        
        // Initialize days data if not exists
        if (!this.challengeDays[challenge.id]) {
            this.challengeDays[challenge.id] = {};
            for (let day = 1; day <= challenge.duration; day++) {
                this.challengeDays[challenge.id][day] = {
                    title: `Día ${day}`,
                    content: '',
                    motivationalPhrase: '¡Excelente trabajo! Sigue así.',
                    media: null,
                    mediaType: null
                };
            }
        }
        
        const modal = document.getElementById('challengeDaysModal');
        const modalTitle = document.getElementById('challengeDaysModalTitle');
        const challengeName = document.getElementById('challengeDaysName');
        const challengeDuration = document.getElementById('challengeDaysDuration');
        
        if (modal) {
            modalTitle.textContent = 'Configurar Conteúdo Diário';
            if (challengeName) challengeName.textContent = challenge.name;
            if (challengeDuration) challengeDuration.textContent = `Duração: ${challenge.duration} dias`;
            
            this.loadDayContent(this.currentDayEditing);
            this.updateDayNavigation();
            modal.classList.add('show');
        }
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

// Global function to remove challenge files
function removeChallengeFile(type) {
    const uploadArea = document.getElementById(`${type === 'image' ? 'challengeImage' : 'dayMedia'}UploadArea`);
    const placeholder = uploadArea?.querySelector('.upload-placeholder');
    const preview = uploadArea?.querySelector('.upload-preview');
    const input = document.getElementById(type === 'image' ? 'challengeImage' : 'dayMedia');
    
    if (placeholder) placeholder.style.display = 'block';
    if (preview) preview.style.display = 'none';
    if (input) input.value = '';
}

// Initialize challenges manager
let challengesManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up challenges manager...');
    
    // Function to initialize challenges manager
    function initializeChallengesManager() {
        if (!challengesManager) {
            console.log('Creating new ChallengesManager instance...');
            challengesManager = new ChallengesManager();
            window.challengesManager = challengesManager;
        } else {
            console.log('ChallengesManager already exists, re-rendering...');
            challengesManager.renderChallenges();
            challengesManager.updateStats();
        }
    }
    
    // Wait for the main script to load the tab system
    setTimeout(() => {
        // Look for challenges tab
        const challengesTab = document.querySelector('.menu-item[data-tab="challenges"]');
        
        if (challengesTab) {
            console.log('Found challenges tab, setting up listener...');
            challengesTab.addEventListener('click', function() {
                console.log('Challenges tab clicked, initializing...');
                setTimeout(initializeChallengesManager, 300);
            });
        }
        
        // Check if challenges tab is already active
        const challengesSection = document.querySelector('#challenges');
        if (challengesSection && challengesSection.classList.contains('active')) {
            console.log('Challenges section is already active, initializing...');
            setTimeout(initializeChallengesManager, 500);
        }
        
        // Also listen for any tab changes using MutationObserver
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.id === 'challenges' && target.classList.contains('active')) {
                        console.log('Challenges section became active via mutation observer');
                        setTimeout(initializeChallengesManager, 100);
                    }
                }
            });
        });
        
        // Start observing the challenges section directly
        const challengesSection2 = document.querySelector('#challenges');
        if (challengesSection2) {
            observer.observe(challengesSection2, {
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
window.challengesManager = challengesManager;