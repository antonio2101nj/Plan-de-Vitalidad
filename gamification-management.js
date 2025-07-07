/**
 * Gamification Management System
 * Sistema completo de gamificação com pontos, conquistas e recompensas
 */

class GamificationManager {
    constructor() {
        this.rules = [];
        this.achievements = [];
        this.rewards = [];
        this.userProgress = [];
        this.currentSection = 'rules';
        this.currentEditingItem = null;
        
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
        // Load saved data from localStorage
        const savedRules = localStorage.getItem('planVitalidadGamificationRules');
        const savedAchievements = localStorage.getItem('planVitalidadGamificationAchievements');
        const savedRewards = localStorage.getItem('planVitalidadGamificationRewards');
        const savedProgress = localStorage.getItem('planVitalidadGamificationProgress');

        if (savedRules) this.rules = JSON.parse(savedRules);
        if (savedAchievements) this.achievements = JSON.parse(savedAchievements);
        if (savedRewards) this.rewards = JSON.parse(savedRewards);
        if (savedProgress) this.userProgress = JSON.parse(savedProgress);
    }

    saveData() {
        localStorage.setItem('planVitalidadGamificationRules', JSON.stringify(this.rules));
        localStorage.setItem('planVitalidadGamificationAchievements', JSON.stringify(this.achievements));
        localStorage.setItem('planVitalidadGamificationRewards', JSON.stringify(this.rewards));
        localStorage.setItem('planVitalidadGamificationProgress', JSON.stringify(this.userProgress));
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.gamification-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Create buttons
        document.getElementById('createRuleBtn').addEventListener('click', () => this.openCreateRuleModal());
        document.getElementById('createAchievementBtn').addEventListener('click', () => this.openCreateAchievementModal());
        document.getElementById('createRewardBtn').addEventListener('click', () => this.openCreateRewardModal());

        // Modal events
        this.setupModalEvents();
        
        // Filters
        this.setupFilterEvents();
        
        // Award points modal
        this.setupAwardPointsModal();
        
        // Export and refresh buttons
        this.setupProgressButtons();
    }

    setupModalEvents() {
        // Rule Modal
        document.getElementById('ruleForm').addEventListener('submit', (e) => this.handleRuleSubmit(e));
        document.getElementById('ruleModalClose').addEventListener('click', () => this.closeModal('ruleModal'));
        document.getElementById('ruleModalCancel').addEventListener('click', () => this.closeModal('ruleModal'));

        // Achievement Modal
        document.getElementById('achievementForm').addEventListener('submit', (e) => this.handleAchievementSubmit(e));
        document.getElementById('achievementModalClose').addEventListener('click', () => this.closeModal('achievementModal'));
        document.getElementById('achievementModalCancel').addEventListener('click', () => this.closeModal('achievementModal'));
        
        // Reward Modal
        document.getElementById('rewardForm').addEventListener('submit', (e) => this.handleRewardSubmit(e));
        document.getElementById('rewardModalClose').addEventListener('click', () => this.closeModal('rewardModal'));
        document.getElementById('rewardModalCancel').addEventListener('click', () => this.closeModal('rewardModal'));

        // File uploads
        this.setupFileUploads();
        
        // Dynamic form changes
        document.getElementById('achievementRewardType').addEventListener('change', (e) => {
            const detailsGroup = document.getElementById('achievementRewardDetailsGroup');
            detailsGroup.style.display = e.target.value === 'content' ? 'block' : 'none';
        });

        document.getElementById('rewardType').addEventListener('change', (e) => {
            this.toggleRewardContentFields(e.target.value);
        });
    }

    setupFileUploads() {
        // Achievement badge upload
        const badgeUpload = document.getElementById('achievementBadge');
        const badgeArea = document.getElementById('achievementBadgeUploadArea');
        
        badgeArea.addEventListener('click', () => badgeUpload.click());
        badgeUpload.addEventListener('change', (e) => this.handleFileUpload(e, 'badge'));

        // Reward file upload
        const rewardFileUpload = document.getElementById('rewardFile');
        const rewardFileArea = document.getElementById('rewardFileUploadArea');
        
        rewardFileArea.addEventListener('click', () => rewardFileUpload.click());
        rewardFileUpload.addEventListener('change', (e) => this.handleFileUpload(e, 'rewardFile'));
    }

    setupFilterEvents() {
        // Progress filters
        document.getElementById('progressUserFilter').addEventListener('input', () => this.filterProgress());
        document.getElementById('progressLanguageFilter').addEventListener('change', () => this.filterProgress());
        document.getElementById('progressPlanFilter').addEventListener('change', () => this.filterProgress());
        document.getElementById('progressAchievementFilter').addEventListener('change', () => this.filterProgress());
        
        // Ranking period filter
        document.getElementById('rankingPeriodFilter').addEventListener('change', () => this.renderRanking());
    }

    setupProgressButtons() {
        // Export progress button
        document.getElementById('exportProgressBtn').addEventListener('click', () => this.exportProgress());
        
        // Refresh progress button
        document.getElementById('refreshProgressBtn').addEventListener('click', () => this.refreshProgress());
        
        // User progress modal events
        document.getElementById('userProgressModalClose').addEventListener('click', () => this.closeModal('userProgressModal'));
        document.getElementById('userProgressModalCancel').addEventListener('click', () => this.closeModal('userProgressModal'));
        
        // Delete modal events
        document.getElementById('confirmDeleteGamificationClose').addEventListener('click', () => this.closeModal('confirmDeleteGamificationModal'));
        document.getElementById('confirmDeleteGamificationCancel').addEventListener('click', () => this.closeModal('confirmDeleteGamificationModal'));
    }

    exportProgress() {
        const users = this.userProgress;
        const csvContent = this.generateProgressCSV(users);
        this.downloadCSV(csvContent, 'progresso_gamificacao.csv');
        this.showNotification('Progresso exportado com sucesso!', 'success');
    }

    generateProgressCSV(users) {
        const headers = ['Nome', 'Email', 'Pontos', 'Conquistas', 'Desafios Completos', 'Plano', 'Idioma', 'Última Atividade'];
        const rows = users.map(user => [
            user.name,
            user.email,
            user.points,
            user.achievements.length,
            user.challengesCompleted,
            user.plan,
            user.language,
            this.formatDate(user.lastActivity)
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    refreshProgress() {
        this.renderProgress();
        this.renderRanking();
        this.renderOverviewStats();
        this.showNotification('Dados atualizados!', 'info');
    }

    switchSection(section) {
        this.currentSection = section;
        
        // Update tabs
        document.querySelectorAll('.gamification-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.section === section);
        });
        
        // Update sections
        document.querySelectorAll('.gamification-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `${section}Section`);
        });
        
        this.renderCurrentSection();
    }

    renderCurrentSection() {
        switch(this.currentSection) {
            case 'rules':
                this.renderRules();
                break;
            case 'achievements':
                this.renderAchievements();
                break;
            case 'progress':
                this.renderProgress();
                break;
            case 'rewards':
                this.renderRewards();
                break;
            case 'ranking':
                this.renderRanking();
                break;
        }
    }

    renderOverviewStats() {
        const totalPoints = this.userProgress.reduce((sum, user) => sum + user.points, 0);
        const activeAchievements = this.achievements.filter(a => a.status === 'active').length;
        const unlockedAchievements = this.userProgress.reduce((sum, user) => sum + user.achievements.length, 0);
        const activeRewards = this.rewards.filter(r => r.status === 'active').length;

        document.getElementById('totalPointsAwarded').textContent = totalPoints.toLocaleString();
        document.getElementById('totalAchievements').textContent = activeAchievements;
        document.getElementById('totalUnlockedAchievements').textContent = unlockedAchievements;
        document.getElementById('totalRewards').textContent = activeRewards;
    }

    // Rules Management
    renderRules() {
        const grid = document.getElementById('rulesGrid');
        const noRulesMsg = document.getElementById('noRulesMessage');
        
        if (this.rules.length === 0) {
            grid.style.display = 'none';
            noRulesMsg.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        noRulesMsg.style.display = 'none';
        
        grid.innerHTML = this.rules.map(rule => `
            <div class="rule-card">
                <div class="rule-header">
                    <h4>${rule.name}</h4>
                    <div class="rule-status ${rule.status}">
                        ${rule.status === 'active' ? '✅' : '❌'} ${rule.status === 'active' ? 'Ativa' : 'Inativa'}
                    </div>
                </div>
                <div class="rule-details">
                    <div class="rule-points">
                        <i class="fas fa-star"></i>
                        <span>${rule.points} pontos</span>
                    </div>
                    <div class="rule-frequency">
                        <i class="fas fa-clock"></i>
                        <span>${this.getFrequencyText(rule.frequency)}</span>
                    </div>
                    <div class="rule-user-type">
                        <i class="fas fa-users"></i>
                        <span>${this.getUserTypeText(rule.userType)}</span>
                    </div>
                    ${rule.language ? `
                        <div class="rule-language">
                            <i class="fas fa-globe"></i>
                            <span>${this.getLanguageText(rule.language)}</span>
                        </div>
                    ` : ''}
                </div>
                ${rule.description ? `<p class="rule-description">${rule.description}</p>` : ''}
                <div class="rule-actions">
                    <button class="btn btn-small btn-secondary" onclick="gamificationManager.editRule(${rule.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-small btn-danger" onclick="gamificationManager.deleteRule(${rule.id})">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    openCreateRuleModal() {
        this.currentEditingItem = null;
        document.getElementById('ruleModalTitle').textContent = 'Criar Nova Regra de Pontuação';
        document.getElementById('ruleForm').reset();
        document.getElementById('ruleId').value = '';
        this.openModal('ruleModal');
    }

    editRule(id) {
        const rule = this.rules.find(r => r.id === id);
        if (!rule) return;
        
        this.currentEditingItem = rule;
        document.getElementById('ruleModalTitle').textContent = 'Editar Regra de Pontuação';
        
        // Fill form
        document.getElementById('ruleId').value = rule.id;
        document.getElementById('ruleName').value = rule.name;
        document.getElementById('rulePoints').value = rule.points;
        document.getElementById('ruleFrequency').value = rule.frequency;
        document.getElementById('ruleUserType').value = rule.userType;
        document.getElementById('ruleLanguage').value = rule.language || '';
        document.getElementById('ruleDescription').value = rule.description || '';
        document.getElementById('ruleStatus').value = rule.status;
        
        this.openModal('ruleModal');
    }

    handleRuleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const ruleData = {
            id: formData.get('ruleId') ? parseInt(formData.get('ruleId')) : Date.now(),
            name: formData.get('name'),
            points: parseInt(formData.get('points')),
            frequency: formData.get('frequency'),
            userType: formData.get('userType'),
            language: formData.get('language') || null,
            description: formData.get('description') || null,
            status: formData.get('status'),
            createdAt: this.currentEditingItem ? this.currentEditingItem.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.currentEditingItem) {
            // Update existing rule
            const index = this.rules.findIndex(r => r.id === ruleData.id);
            this.rules[index] = ruleData;
            this.showNotification('Regra atualizada com sucesso!', 'success');
        } else {
            // Create new rule
            this.rules.push(ruleData);
            this.showNotification('Regra criada com sucesso!', 'success');
        }
        
        this.saveData();
        this.renderRules();
        this.renderOverviewStats();
        this.closeModal('ruleModal');
    }

    deleteRule(id) {
        const rule = this.rules.find(r => r.id === id);
        if (!rule) return;
        
        document.getElementById('deleteGamificationTitle').textContent = 'Tem certeza que deseja excluir esta regra?';
        document.getElementById('deleteGamificationMessage').textContent = 'Esta ação não pode ser desfeita. A regra será removida permanentemente.';
        document.getElementById('deleteGamificationName').textContent = rule.name;
        document.getElementById('deleteGamificationDetails').textContent = `${rule.points} pontos - ${this.getFrequencyText(rule.frequency)}`;
        
        document.getElementById('confirmDeleteGamificationConfirm').onclick = () => {
            this.rules = this.rules.filter(r => r.id !== id);
            this.saveData();
            this.renderRules();
            this.renderOverviewStats();
            this.closeModal('confirmDeleteGamificationModal');
            this.showNotification('Regra excluída com sucesso!', 'success');
        };
        
        this.openModal('confirmDeleteGamificationModal');
    }

    // Achievements Management
    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        const noAchievementsMsg = document.getElementById('noAchievementsMessage');
        
        if (this.achievements.length === 0) {
            grid.style.display = 'none';
            noAchievementsMsg.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        noAchievementsMsg.style.display = 'none';
        
        grid.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-card">
                <div class="achievement-header">
                    <div class="achievement-badge">
                        ${achievement.badgeUrl ? `<img src="${achievement.badgeUrl}" alt="Badge">` : '<i class="fas fa-medal"></i>'}
                    </div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                    <div class="achievement-status ${achievement.status}">
                        ${achievement.status === 'active' ? '✅' : '❌'}
                    </div>
                </div>
                <div class="achievement-details">
                    <div class="achievement-criteria">
                        <i class="fas fa-target"></i>
                        <span>${this.getCriteriaText(achievement.criteriaType, achievement.criteriaValue)}</span>
                    </div>
                    <div class="achievement-reward">
                        <i class="fas fa-gift"></i>
                        <span>${this.getRewardTypeText(achievement.rewardType)}</span>
                    </div>
                    <div class="achievement-language">
                        <i class="fas fa-globe"></i>
                        <span>${this.getLanguageText(achievement.language)}</span>
                    </div>
                </div>
                <div class="achievement-stats">
                    <span class="stat">
                        <i class="fas fa-users"></i>
                        ${this.getAchievementUnlockCount(achievement.id)} desbloqueios
                    </span>
                </div>
                <div class="achievement-actions">
                    <button class="btn btn-small btn-secondary" onclick="gamificationManager.editAchievement(${achievement.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-small btn-danger" onclick="gamificationManager.deleteAchievement(${achievement.id})">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    openCreateAchievementModal() {
        this.currentEditingItem = null;
        document.getElementById('achievementModalTitle').textContent = 'Criar Nova Conquista';
        document.getElementById('achievementForm').reset();
        document.getElementById('achievementId').value = '';
        this.clearFilePreview('badge');
        this.openModal('achievementModal');
    }

    editAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return;
        
        this.currentEditingItem = achievement;
        document.getElementById('achievementModalTitle').textContent = 'Editar Conquista';
        
        // Fill form
        document.getElementById('achievementId').value = achievement.id;
        document.getElementById('achievementName').value = achievement.name;
        document.getElementById('achievementLanguage').value = achievement.language;
        document.getElementById('achievementDescription').value = achievement.description;
        document.getElementById('achievementCriteriaType').value = achievement.criteriaType;
        document.getElementById('achievementCriteriaValue').value = achievement.criteriaValue;
        document.getElementById('achievementRewardType').value = achievement.rewardType;
        document.getElementById('achievementRewardDetails').value = achievement.rewardDetails || '';
        document.getElementById('achievementStatus').value = achievement.status;
        
        // Show reward details if needed
        const detailsGroup = document.getElementById('achievementRewardDetailsGroup');
        detailsGroup.style.display = achievement.rewardType === 'content' ? 'block' : 'none';
        
        this.openModal('achievementModal');
    }

    handleAchievementSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const achievementData = {
            id: formData.get('achievementId') ? parseInt(formData.get('achievementId')) : Date.now(),
            name: formData.get('name'),
            language: formData.get('language'),
            description: formData.get('description'),
            criteriaType: formData.get('criteriaType'),
            criteriaValue: parseInt(formData.get('criteriaValue')),
            rewardType: formData.get('rewardType'),
            rewardDetails: formData.get('rewardDetails') || null,
            status: formData.get('status'),
            badgeUrl: this.currentEditingItem ? this.currentEditingItem.badgeUrl : null,
            createdAt: this.currentEditingItem ? this.currentEditingItem.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.currentEditingItem) {
            const index = this.achievements.findIndex(a => a.id === achievementData.id);
            this.achievements[index] = achievementData;
            this.showNotification('Conquista atualizada com sucesso!', 'success');
        } else {
            this.achievements.push(achievementData);
            this.showNotification('Conquista criada com sucesso!', 'success');
        }
        
        this.saveData();
        this.renderAchievements();
        this.renderOverviewStats();
        this.closeModal('achievementModal');
    }

    // Helper methods
    getFrequencyText(frequency) {
        const frequencies = {
            'once': 'Única vez',
            'daily': 'Diária',
            'repeat': 'Por repetição'
        };
        return frequencies[frequency] || frequency;
    }

    getUserTypeText(userType) {
        const types = {
            'all': 'Todos',
            'free': 'Gratuito',
            'premium': 'Premium'
        };
        return types[userType] || userType;
    }

    getLanguageText(language) {
        const languages = {
            'es': '🇪🇸 Español',
            'pt': '🇧🇷 Português',
            'en': '🇺🇸 English'
        };
        return languages[language] || 'Todos os idiomas';
    }

    getCriteriaText(type, value) {
        const criteria = {
            'points': `${value} pontos acumulados`,
            'challenges': `${value} desafios completos`,
            'days': `${value} dias consecutivos`,
            'bonus': `${value} bônus acessados`,
            'streak': `${value} atividades em sequência`
        };
        return criteria[type] || `${value} ${type}`;
    }

    getRewardTypeText(type) {
        const types = {
            'visual': 'Selo visual',
            'content': 'Conteúdo desbloqueado',
            'points': 'Pontos extras'
        };
        return types[type] || type;
    }

    getAchievementUnlockCount(achievementId) {
        return this.userProgress.filter(user => 
            user.achievements.some(a => a.id === achievementId)
        ).length;
    }

    // File handling
    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file size (5MB for badges, 50MB for rewards)
        const maxSize = type === 'badge' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showNotification(`Arquivo muito grande. Máximo ${type === 'badge' ? '5MB' : '50MB'}.`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showFilePreview(type, file, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    showFilePreview(type, file, dataUrl) {
        const previewId = type === 'badge' ? 'achievementBadgePreview' : 'rewardFilePreview';
        const preview = document.getElementById(previewId);
        const placeholder = preview.previousElementSibling;
        
        if (type === 'badge') {
            document.getElementById('achievementBadgePreviewImg').src = dataUrl;
        } else {
            // Update file info
            document.getElementById('rewardFileName').textContent = file.name;
            document.getElementById('rewardFileSize').textContent = this.formatFileSize(file.size);
            
            // Update icon based on file type
            const icon = document.getElementById('rewardFileIcon');
            if (file.type.startsWith('image/')) {
                icon.className = 'fas fa-image';
            } else if (file.type.startsWith('video/')) {
                icon.className = 'fas fa-video';
            } else if (file.type === 'application/pdf') {
                icon.className = 'fas fa-file-pdf';
            } else {
                icon.className = 'fas fa-file';
            }
        }
        
        placeholder.style.display = 'none';
        preview.style.display = 'block';
    }

    removeFile(type) {
        const inputId = type === 'badge' ? 'achievementBadge' : 'rewardFile';
        const previewId = type === 'badge' ? 'achievementBadgePreview' : 'rewardFilePreview';
        
        document.getElementById(inputId).value = '';
        this.clearFilePreview(type);
    }

    clearFilePreview(type) {
        const previewId = type === 'badge' ? 'achievementBadgePreview' : 'rewardFilePreview';
        const preview = document.getElementById(previewId);
        const placeholder = preview.previousElementSibling;
        
        preview.style.display = 'none';
        placeholder.style.display = 'block';
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
        if (this.rules.length === 0) {
            this.rules = [
                {
                    id: 1,
                    name: "Concluir o dia 1 do desafio",
                    points: 10,
                    frequency: "once",
                    userType: "all",
                    language: null,
                    description: "Primeira conclusão de qualquer desafio",
                    status: "active",
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 2,
                    name: "Login diário",
                    points: 5,
                    frequency: "daily",
                    userType: "all",
                    language: null,
                    description: "Acessar o aplicativo todos os dias",
                    status: "active",
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 3,
                    name: "Completar desafio completo",
                    points: 50,
                    frequency: "repeat",
                    userType: "all",
                    language: null,
                    description: "Concluir um desafio de 21 dias",
                    status: "active",
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 4,
                    name: "Acesso a conteúdo premium",
                    points: 15,
                    frequency: "repeat",
                    userType: "premium",
                    language: null,
                    description: "Acessar conteúdo exclusivo premium",
                    status: "active",
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 5,
                    name: "Compartilhar progresso",
                    points: 20,
                    frequency: "daily",
                    userType: "all",
                    language: null,
                    description: "Compartilhar progresso nas redes sociais",
                    status: "active",
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                }
            ];
        }

        if (this.achievements.length === 0) {
            this.achievements = [
                {
                    id: 1,
                    name: "Desafiante Constante",
                    language: "pt",
                    description: "Você concluiu 7 dias seguidos de desafios",
                    criteriaType: "days",
                    criteriaValue: 7,
                    rewardType: "visual",
                    rewardDetails: null,
                    status: "active",
                    badgeUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 2,
                    name: "Mestre dos Pontos",
                    language: "pt",
                    description: "Acumule 100 pontos em gamificação",
                    criteriaType: "points",
                    criteriaValue: 100,
                    rewardType: "content",
                    rewardDetails: "Acesso a conteúdo exclusivo de motivação",
                    status: "active",
                    badgeUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 3,
                    name: "Transformador",
                    language: "pt",
                    description: "Complete 3 desafios diferentes",
                    criteriaType: "challenges",
                    criteriaValue: 3,
                    rewardType: "points",
                    rewardDetails: "50 pontos extras de bônus",
                    status: "active",
                    badgeUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 4,
                    name: "Challenger Constante",
                    language: "es",
                    description: "Completaste 7 días seguidos de desafíos",
                    criteriaType: "days",
                    criteriaValue: 7,
                    rewardType: "visual",
                    rewardDetails: null,
                    status: "active",
                    badgeUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 5,
                    name: "Consistent Challenger",
                    language: "en",
                    description: "You completed 7 consecutive days of challenges",
                    criteriaType: "days",
                    criteriaValue: 7,
                    rewardType: "visual",
                    rewardDetails: null,
                    status: "active",
                    badgeUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                }
            ];
        }

        if (this.userProgress.length === 0) {
            this.userProgress = [
                {
                    id: 1,
                    userId: 1,
                    name: "Maria Silva",
                    email: "maria@exemplo.com",
                    points: 150,
                    achievements: [{ id: 1, unlockedAt: "2024-12-05T14:30:00Z" }],
                    challengesCompleted: 8,
                    lastActivity: "2024-12-08T09:15:00Z",
                    plan: "premium",
                    language: "pt"
                },
                {
                    id: 2,
                    userId: 2,
                    name: "Carlos Rodriguez",
                    email: "carlos@ejemplo.com",
                    points: 95,
                    achievements: [],
                    challengesCompleted: 3,
                    lastActivity: "2024-12-07T16:45:00Z",
                    plan: "free",
                    language: "es"
                },
                {
                    id: 3,
                    userId: 3,
                    name: "Jennifer Smith",
                    email: "jennifer@example.com",
                    points: 220,
                    achievements: [{ id: 1, unlockedAt: "2024-12-03T11:20:00Z" }],
                    challengesCompleted: 12,
                    lastActivity: "2024-12-08T14:20:00Z",
                    plan: "premium",
                    language: "en"
                },
                {
                    id: 4,
                    userId: 4,
                    name: "Ana Costa",
                    email: "ana@exemplo.com",
                    points: 75,
                    achievements: [],
                    challengesCompleted: 2,
                    lastActivity: "2024-12-06T08:30:00Z",
                    plan: "free",
                    language: "pt"
                },
                {
                    id: 5,
                    userId: 5,
                    name: "Miguel Santos",
                    email: "miguel@ejemplo.com",
                    points: 180,
                    achievements: [{ id: 1, unlockedAt: "2024-12-04T19:15:00Z" }],
                    challengesCompleted: 9,
                    lastActivity: "2024-12-08T12:00:00Z",
                    plan: "premium",
                    language: "es"
                }
            ];
        }

        if (this.rewards.length === 0) {
            this.rewards = [
                {
                    id: 1,
                    name: "Planner Secreto Premium",
                    pointsRequired: 100,
                    description: "Planner exclusivo com 90 dias de planejamento detalhado",
                    type: "pdf",
                    visibility: "premium",
                    link: null,
                    textContent: null,
                    status: "active",
                    fileUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 2,
                    name: "Receitas Detox Exclusivas",
                    pointsRequired: 50,
                    description: "Coleção de 25 receitas detox para transformação completa",
                    type: "pdf",
                    visibility: "all",
                    link: null,
                    textContent: null,
                    status: "active",
                    fileUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                },
                {
                    id: 3,
                    name: "Meditação Guiada VIP",
                    pointsRequired: 200,
                    description: "Acesso a sessões de meditação guiada exclusivas",
                    type: "link",
                    visibility: "premium",
                    link: "https://exemplo.com/meditacao-vip",
                    textContent: null,
                    status: "active",
                    fileUrl: null,
                    createdAt: "2024-12-01T10:00:00Z",
                    updatedAt: "2024-12-01T10:00:00Z"
                }
            ];
        }

        this.saveData();
    }

    // Progress Management
    renderProgress() {
        this.updateAchievementFilter();
        this.filterProgress();
    }

    updateAchievementFilter() {
        const select = document.getElementById('progressAchievementFilter');
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">Todas</option>';
        this.achievements.forEach(achievement => {
            const option = document.createElement('option');
            option.value = achievement.id;
            option.textContent = achievement.name;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    }

    filterProgress() {
        const userFilter = document.getElementById('progressUserFilter').value.toLowerCase();
        const languageFilter = document.getElementById('progressLanguageFilter').value;
        const planFilter = document.getElementById('progressPlanFilter').value;
        const achievementFilter = document.getElementById('progressAchievementFilter').value;
        
        let filteredProgress = this.userProgress.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(userFilter) || 
                            user.email.toLowerCase().includes(userFilter);
            const languageMatch = !languageFilter || user.language === languageFilter;
            const planMatch = !planFilter || user.plan === planFilter;
            const achievementMatch = !achievementFilter || 
                                   user.achievements.some(a => a.id == achievementFilter);
            
            return nameMatch && languageMatch && planMatch && achievementMatch;
        });
        
        this.renderProgressTable(filteredProgress);
    }

    renderProgressTable(users) {
        const tbody = document.getElementById('progressTableBody');
        const noProgressMsg = document.getElementById('noProgressMessage');
        
        if (users.length === 0) {
            tbody.innerHTML = '';
            noProgressMsg.style.display = 'block';
            return;
        }
        
        noProgressMsg.style.display = 'none';
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <strong>${user.name}</strong><br>
                        <small>${user.email}</small>
                    </div>
                </td>
                <td>
                    <div class="user-points">
                        <i class="fas fa-star"></i>
                        ${user.points}
                    </div>
                </td>
                <td>
                    <div class="user-achievements">
                        ${user.achievements.map(a => {
                            const achievement = this.achievements.find(ach => ach.id === a.id);
                            return achievement ? `<span class="achievement-mini">${achievement.name}</span>` : '';
                        }).join('')}
                        ${user.achievements.length === 0 ? '<span class="text-muted">Nenhuma</span>' : ''}
                    </div>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${user.challengesCompleted * 10}%"></div>
                    </div>
                    <small>${user.challengesCompleted} desafios</small>
                </td>
                <td>${this.formatDate(user.lastActivity)}</td>
                <td>
                    <button class="btn btn-small btn-info" onclick="gamificationManager.viewUserProgress(${user.id})">
                        <i class="fas fa-eye"></i>
                        Ver Detalhes
                    </button>
                </td>
            </tr>
        `).join('');
    }

    viewUserProgress(userId) {
        const user = this.userProgress.find(u => u.id === userId);
        if (!user) return;
        
        // Fill user progress modal
        document.getElementById('progressUserName').textContent = user.name;
        document.getElementById('progressUserEmail').textContent = user.email;
        document.getElementById('progressUserPoints').textContent = user.points;
        document.getElementById('progressUserAchievements').textContent = user.achievements.length;
        
        // Set award points user ID
        document.getElementById('awardUserId').value = user.id;
        
        // Render sections
        this.renderPointsHistory(user);
        this.renderUserAchievements(user);
        this.renderChallengesProgress(user);
        
        this.openModal('userProgressModal');
    }

    renderPointsHistory(user) {
        const container = document.getElementById('pointsHistory');
        // Simulate points history
        const history = [
            { date: '2024-12-08', action: 'Login diário', points: 5 },
            { date: '2024-12-07', action: 'Concluir dia 3 do desafio', points: 10 },
            { date: '2024-12-06', action: 'Login diário', points: 5 },
            { date: '2024-12-05', action: 'Concluir dia 2 do desafio', points: 10 }
        ];
        
        container.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-date">${this.formatDate(item.date)}</div>
                <div class="history-action">${item.action}</div>
                <div class="history-points">+${item.points} pts</div>
            </div>
        `).join('');
    }

    renderUserAchievements(user) {
        const container = document.getElementById('userAchievementsList');
        
        if (user.achievements.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhuma conquista desbloqueada ainda.</p>';
            return;
        }
        
        container.innerHTML = user.achievements.map(userAch => {
            const achievement = this.achievements.find(a => a.id === userAch.id);
            if (!achievement) return '';
            
            return `
                <div class="user-achievement-item">
                    <div class="achievement-badge-mini">
                        ${achievement.badgeUrl ? `<img src="${achievement.badgeUrl}" alt="Badge">` : '<i class="fas fa-medal"></i>'}
                    </div>
                    <div class="achievement-details">
                        <strong>${achievement.name}</strong>
                        <p>${achievement.description}</p>
                        <small>Desbloqueada em ${this.formatDate(userAch.unlockedAt)}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderChallengesProgress(user) {
        const container = document.getElementById('challengesProgress');
        // Simulate challenges progress
        const challenges = [
            { name: 'Desafio 21 Dias', progress: 15, total: 21 },
            { name: 'Transformação Total', progress: 5, total: 30 }
        ];
        
        container.innerHTML = challenges.map(challenge => `
            <div class="challenge-progress-item">
                <div class="challenge-name">${challenge.name}</div>
                <div class="challenge-progress-bar">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(challenge.progress / challenge.total) * 100}%"></div>
                    </div>
                    <span>${challenge.progress}/${challenge.total} dias</span>
                </div>
            </div>
        `).join('');
    }

    // Rewards Management
    renderRewards() {
        const grid = document.getElementById('rewardsGrid');
        const noRewardsMsg = document.getElementById('noRewardsMessage');
        
        if (this.rewards.length === 0) {
            grid.style.display = 'none';
            noRewardsMsg.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        noRewardsMsg.style.display = 'none';
        
        grid.innerHTML = this.rewards.map(reward => `
            <div class="reward-card">
                <div class="reward-header">
                    <h4>${reward.name}</h4>
                    <div class="reward-points">${reward.pointsRequired} pts</div>
                </div>
                <p class="reward-description">${reward.description}</p>
                <div class="reward-details">
                    <div>
                        <i class="fas fa-file"></i>
                        <span>${this.getRewardTypeText(reward.type)}</span>
                    </div>
                    <div>
                        <i class="fas fa-users"></i>
                        <span>${reward.visibility === 'all' ? 'Todos' : 'Premium'}</span>
                    </div>
                    <div>
                        <i class="fas fa-circle"></i>
                        <span class="${reward.status}">${reward.status === 'active' ? 'Ativa' : 'Inativa'}</span>
                    </div>
                </div>
                <div class="reward-stats">
                    <span class="stat">
                        <i class="fas fa-download"></i>
                        ${this.getRewardClaimCount(reward.id)} resgates
                    </span>
                </div>
                <div class="reward-actions">
                    <button class="btn btn-small btn-secondary" onclick="gamificationManager.editReward(${reward.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn btn-small btn-danger" onclick="gamificationManager.deleteReward(${reward.id})">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    openCreateRewardModal() {
        this.currentEditingItem = null;
        document.getElementById('rewardModalTitle').textContent = 'Criar Nova Recompensa';
        document.getElementById('rewardForm').reset();
        document.getElementById('rewardId').value = '';
        this.clearFilePreview('rewardFile');
        this.toggleRewardContentFields('');
        this.openModal('rewardModal');
    }

    toggleRewardContentFields(type) {
        const fileGroup = document.getElementById('rewardFileGroup');
        const linkGroup = document.getElementById('rewardLinkGroup');
        const textGroup = document.getElementById('rewardTextGroup');
        
        fileGroup.style.display = ['pdf', 'video', 'image'].includes(type) ? 'block' : 'none';
        linkGroup.style.display = type === 'link' ? 'block' : 'none';
        textGroup.style.display = type === 'text' ? 'block' : 'none';
    }

    editReward(id) {
        const reward = this.rewards.find(r => r.id === id);
        if (!reward) return;
        
        this.currentEditingItem = reward;
        document.getElementById('rewardModalTitle').textContent = 'Editar Recompensa';
        
        // Fill form
        document.getElementById('rewardId').value = reward.id;
        document.getElementById('rewardName').value = reward.name;
        document.getElementById('rewardPointsRequired').value = reward.pointsRequired;
        document.getElementById('rewardDescription').value = reward.description;
        document.getElementById('rewardType').value = reward.type;
        document.getElementById('rewardVisibility').value = reward.visibility;
        document.getElementById('rewardLink').value = reward.link || '';
        document.getElementById('rewardTextContent').value = reward.textContent || '';
        document.getElementById('rewardStatus').value = reward.status;
        
        this.toggleRewardContentFields(reward.type);
        this.openModal('rewardModal');
    }

    handleRewardSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const rewardData = {
            id: formData.get('rewardId') ? parseInt(formData.get('rewardId')) : Date.now(),
            name: formData.get('name'),
            pointsRequired: parseInt(formData.get('pointsRequired')),
            description: formData.get('description'),
            type: formData.get('type'),
            visibility: formData.get('visibility'),
            link: formData.get('link') || null,
            textContent: formData.get('textContent') || null,
            status: formData.get('status'),
            fileUrl: this.currentEditingItem ? this.currentEditingItem.fileUrl : null,
            createdAt: this.currentEditingItem ? this.currentEditingItem.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        if (this.currentEditingItem) {
            const index = this.rewards.findIndex(r => r.id === rewardData.id);
            this.rewards[index] = rewardData;
            this.showNotification('Recompensa atualizada com sucesso!', 'success');
        } else {
            this.rewards.push(rewardData);
            this.showNotification('Recompensa criada com sucesso!', 'success');
        }
        
        this.saveData();
        this.renderRewards();
        this.renderOverviewStats();
        this.closeModal('rewardModal');
    }

    deleteReward(id) {
        const reward = this.rewards.find(r => r.id === id);
        if (!reward) return;
        
        document.getElementById('deleteGamificationTitle').textContent = 'Tem certeza que deseja excluir esta recompensa?';
        document.getElementById('deleteGamificationMessage').textContent = 'Esta ação não pode ser desfeita. A recompensa será removida permanentemente.';
        document.getElementById('deleteGamificationName').textContent = reward.name;
        document.getElementById('deleteGamificationDetails').textContent = `${reward.pointsRequired} pontos - ${this.getRewardTypeText(reward.type)}`;
        
        document.getElementById('confirmDeleteGamificationConfirm').onclick = () => {
            this.rewards = this.rewards.filter(r => r.id !== id);
            this.saveData();
            this.renderRewards();
            this.renderOverviewStats();
            this.closeModal('confirmDeleteGamificationModal');
            this.showNotification('Recompensa excluída com sucesso!', 'success');
        };
        
        this.openModal('confirmDeleteGamificationModal');
    }

    getRewardTypeText(type) {
        const types = {
            'pdf': '📄 PDF',
            'video': '🎥 Vídeo',
            'image': '🖼️ Imagem',
            'link': '🔗 Link',
            'text': '📝 Texto'
        };
        return types[type] || type;
    }

    getRewardClaimCount(rewardId) {
        // Simulate reward claims
        return Math.floor(Math.random() * 50);
    }

    // Ranking Management
    renderRanking() {
        const period = document.getElementById('rankingPeriodFilter').value;
        const sortedUsers = [...this.userProgress].sort((a, b) => b.points - a.points);
        
        // Update podium
        this.updatePodium(sortedUsers.slice(0, 3));
        
        // Update ranking list
        this.updateRankingList(sortedUsers.slice(3));
    }

    updatePodium(topUsers) {
        const positions = ['second', 'first', 'third'];
        const places = [1, 0, 2]; // Order for podium display
        
        positions.forEach((position, index) => {
            const place = document.getElementById(`${position}Place`);
            const userIndex = places[index];
            const user = topUsers[userIndex];
            
            if (user) {
                place.querySelector('.podium-name').textContent = user.name.split(' ')[0];
                place.querySelector('.podium-points').textContent = `${user.points} pts`;
                if (position === 'first') {
                    place.querySelector('.podium-avatar').textContent = '👑';
                } else {
                    place.querySelector('.podium-avatar').textContent = userIndex + 1;
                }
            } else {
                place.querySelector('.podium-name').textContent = '-';
                place.querySelector('.podium-points').textContent = '0 pts';
                place.querySelector('.podium-avatar').textContent = position === 'first' ? '👑' : (userIndex + 1);
            }
        });
    }

    updateRankingList(users) {
        const list = document.getElementById('rankingList');
        
        if (users.length === 0) {
            list.innerHTML = '<p class="text-center text-muted">Não há mais usuários no ranking.</p>';
            return;
        }
        
        list.innerHTML = users.map((user, index) => `
            <div class="ranking-item">
                <div class="ranking-position">${index + 4}</div>
                <div class="ranking-user">
                    <div class="ranking-user-name">${user.name}</div>
                    <div class="ranking-user-info">${user.plan === 'premium' ? '👑' : '🆓'} ${user.language.toUpperCase()}</div>
                </div>
                <div class="ranking-points">${user.points} pts</div>
            </div>
        `).join('');
    }

    // Award Points Modal
    setupAwardPointsModal() {
        document.getElementById('awardPointsBtn').addEventListener('click', () => {
            this.openModal('awardPointsModal');
        });
        
        document.getElementById('awardPointsForm').addEventListener('submit', (e) => this.handleAwardPoints(e));
        document.getElementById('awardPointsModalClose').addEventListener('click', () => this.closeModal('awardPointsModal'));
        document.getElementById('awardPointsModalCancel').addEventListener('click', () => this.closeModal('awardPointsModal'));
    }

    handleAwardPoints(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const userId = parseInt(formData.get('userId'));
        const points = parseInt(formData.get('points'));
        const reason = formData.get('reason');
        
        // Find user and award points
        const user = this.userProgress.find(u => u.id === userId);
        if (user) {
            user.points += points;
            user.lastActivity = new Date().toISOString();
            
            this.saveData();
            this.renderProgress();
            this.renderRanking();
            this.renderOverviewStats();
            
            // Update progress modal if open
            document.getElementById('progressUserPoints').textContent = user.points;
            
            this.closeModal('awardPointsModal');
            this.showNotification(`${points} pontos concedidos para ${user.name}!`, 'success');
        }
    }

    deleteAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return;
        
        document.getElementById('deleteGamificationTitle').textContent = 'Tem certeza que deseja excluir esta conquista?';
        document.getElementById('deleteGamificationMessage').textContent = 'Esta ação não pode ser desfeita. A conquista será removida permanentemente.';
        document.getElementById('deleteGamificationName').textContent = achievement.name;
        document.getElementById('deleteGamificationDetails').textContent = `${this.getCriteriaText(achievement.criteriaType, achievement.criteriaValue)}`;
        
        document.getElementById('confirmDeleteGamificationConfirm').onclick = () => {
            this.achievements = this.achievements.filter(a => a.id !== id);
            this.saveData();
            this.renderAchievements();
            this.renderOverviewStats();
            this.closeModal('confirmDeleteGamificationModal');
            this.showNotification('Conquista excluída com sucesso!', 'success');
        };
        
        this.openModal('confirmDeleteGamificationModal');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('rulesGrid')) {
            window.gamificationManager = new GamificationManager();
        }
    }, 100);
});