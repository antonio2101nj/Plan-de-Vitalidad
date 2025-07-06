/**
 * Notifications Management System
 * Sistema completo de notificações push PWA
 */

class NotificationsManager {
    constructor() {
        this.notifications = [];
        this.filteredNotifications = [];
        this.templates = [];
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.editingNotificationId = null;
        
        this.init();
    }

    init() {
        this.loadNotificationsData();
        this.loadTemplatesData();
        this.setupEventListeners();
        this.renderNotifications();
        this.updateStats();
        this.requestNotificationPermission();
    }

    loadNotificationsData() {
        // Dados de demonstração de notificações
        this.notifications = [
            {
                id: 1,
                internalTitle: "Lembrete Desafio Dia 3",
                title: "¡Es hora de tu desafío!",
                message: "¡No olvides completar tu actividad del día 3! Tu transformación depende de tu constancia.",
                language: "es",
                segment: "event",
                event: "challenge_day_3",
                scheduleType: "scheduled",
                scheduledDate: "2024-12-10T09:00:00",
                status: "scheduled",
                sound: true,
                link: "/challenges",
                image: null,
                createdAt: "2024-12-08T14:30:00",
                stats: {
                    sent: 0,
                    delivered: 0,
                    clicked: 0,
                    failed: 0,
                    devices: { mobile: 0, desktop: 0 }
                }
            },
            {
                id: 2,
                internalTitle: "Boas-vindas Usuário Premium",
                title: "Bem-vindo ao Premium! 👑",
                message: "Agora você tem acesso a todos os recursos exclusivos. Explore sua nova jornada!",
                language: "pt",
                segment: "premium",
                event: null,
                scheduleType: "immediate",
                scheduledDate: null,
                status: "sent",
                sound: true,
                link: "/products",
                image: null,
                createdAt: "2024-12-07T16:45:00",
                sentAt: "2024-12-07T16:45:00",
                stats: {
                    sent: 156,
                    delivered: 152,
                    clicked: 47,
                    failed: 4,
                    devices: { mobile: 134, desktop: 18 }
                }
            },
            {
                id: 3,
                internalTitle: "Usuários Inativos - Volta",
                title: "We miss you! 💙",
                message: "Your wellness journey is waiting. Come back and continue your transformation!",
                language: "en",
                segment: "event",
                event: "inactive_7_days",
                scheduleType: "immediate",
                scheduledDate: null,
                status: "sent",
                sound: false,
                link: "/challenges",
                image: null,
                createdAt: "2024-12-06T10:00:00",
                sentAt: "2024-12-06T10:00:00",
                stats: {
                    sent: 89,
                    delivered: 85,
                    clicked: 23,
                    failed: 4,
                    devices: { mobile: 71, desktop: 14 }
                }
            },
            {
                id: 4,
                internalTitle: "Novo Produto Disponível",
                title: "¡Nuevo producto disponible! 🎉",
                message: "Descubre nuestro nuevo planner de 90 días para transformar tu vida completamente.",
                language: "es",
                segment: "all",
                event: null,
                scheduleType: "scheduled",
                scheduledDate: "2024-12-12T14:00:00",
                status: "scheduled",
                sound: true,
                link: "/store",
                image: null,
                createdAt: "2024-12-08T11:20:00",
                stats: {
                    sent: 0,
                    delivered: 0,
                    clicked: 0,
                    failed: 0,
                    devices: { mobile: 0, desktop: 0 }
                }
            },
            {
                id: 5,
                internalTitle: "Lembrete Gratuitos",
                title: "Experimente o Premium! ⭐",
                message: "Desbloqueie recursos exclusivos e acelere sua jornada de bem-estar.",
                language: "pt",
                segment: "free",
                event: null,
                scheduleType: "immediate",
                scheduledDate: null,
                status: "cancelled",
                sound: true,
                link: "/upgrade",
                image: null,
                createdAt: "2024-12-05T13:15:00",
                cancelledAt: "2024-12-05T13:30:00",
                stats: {
                    sent: 0,
                    delivered: 0,
                    clicked: 0,
                    failed: 0,
                    devices: { mobile: 0, desktop: 0 }
                }
            },
            {
                id: 6,
                internalTitle: "Falha Técnica Teste",
                title: "Test Notification",
                message: "This is a test notification that failed to send properly.",
                language: "en",
                segment: "premium",
                event: null,
                scheduleType: "immediate",
                scheduledDate: null,
                status: "failed",
                sound: false,
                link: null,
                image: null,
                createdAt: "2024-12-04T09:30:00",
                failedAt: "2024-12-04T09:30:15",
                stats: {
                    sent: 0,
                    delivered: 0,
                    clicked: 0,
                    failed: 87,
                    devices: { mobile: 0, desktop: 0 }
                }
            }
        ];
        
        this.filteredNotifications = [...this.notifications];
    }

    loadTemplatesData() {
        // Modelos salvos de notificações
        this.templates = [
            {
                id: 1,
                name: "Lembrete Desafio Diário",
                title: "¡Es hora de tu desafío!",
                message: "¡No olvides completar tu actividad del día [DIA]! Tu transformación depende de tu constancia.",
                language: "es",
                segment: "event",
                event: "challenge_day_1",
                sound: true,
                link: "/challenges",
                createdAt: "2024-12-01T10:00:00"
            },
            {
                id: 2,
                name: "Boas-vindas Premium",
                title: "Bem-vindo ao Premium! 👑",
                message: "Agora você tem acesso a todos os recursos exclusivos. Explore sua nova jornada!",
                language: "pt",
                segment: "premium",
                event: null,
                sound: true,
                link: "/products",
                createdAt: "2024-12-01T10:00:00"
            },
            {
                id: 3,
                name: "Reativação Usuários",
                title: "We miss you! 💙",
                message: "Your wellness journey is waiting. Come back and continue your transformation!",
                language: "en",
                segment: "event",
                event: "inactive_7_days",
                sound: false,
                link: "/challenges",
                createdAt: "2024-12-01T10:00:00"
            }
        ];
    }

    setupEventListeners() {
        // Main controls
        document.getElementById('createNotificationBtn').addEventListener('click', () => this.openCreateNotificationModal());
        document.getElementById('templatesBtn').addEventListener('click', () => this.openTemplatesModal());
        document.getElementById('exportNotificationsBtn').addEventListener('click', () => this.exportNotifications());
        
        // Search and filters
        document.getElementById('notificationsSearchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('notificationsStatusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('notificationsLanguageFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('notificationsSegmentFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('notificationsDateFromFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('notificationsDateToFilter').addEventListener('change', () => this.applyFilters());
        
        // Pagination
        document.getElementById('notificationsPrevPageBtn').addEventListener('click', () => this.prevPage());
        document.getElementById('notificationsNextPageBtn').addEventListener('click', () => this.nextPage());
        
        // Notification modal
        document.getElementById('notificationModalClose').addEventListener('click', () => this.closeNotificationModal());
        document.getElementById('notificationModalCancel').addEventListener('click', () => this.closeNotificationModal());
        document.getElementById('notificationForm').addEventListener('submit', (e) => this.handleNotificationSubmit(e));
        document.getElementById('notificationPreviewBtn').addEventListener('click', () => this.openPreviewModal());
        
        // Form interactions
        document.getElementById('notificationTitle').addEventListener('input', (e) => this.updateCharCount('title', e.target.value));
        document.getElementById('notificationMessage').addEventListener('input', (e) => this.updateCharCount('message', e.target.value));
        document.getElementById('notificationSegment').addEventListener('change', (e) => this.handleSegmentChange(e.target.value));
        document.getElementById('notificationScheduleType').addEventListener('change', (e) => this.handleScheduleTypeChange(e.target.value));
        document.getElementById('notificationLink').addEventListener('change', (e) => this.handleLinkChange(e.target.value));
        document.getElementById('saveAsTemplate').addEventListener('change', (e) => this.handleSaveAsTemplateChange(e.target.checked));
        
        // Preview modal
        document.getElementById('notificationPreviewModalClose').addEventListener('click', () => this.closePreviewModal());
        document.getElementById('notificationPreviewModalCancel').addEventListener('click', () => this.closePreviewModal());
        document.getElementById('sendFromPreviewBtn').addEventListener('click', () => this.sendFromPreview());
        
        // Stats modal
        document.getElementById('notificationStatsModalClose').addEventListener('click', () => this.closeStatsModal());
        document.getElementById('notificationStatsModalCancel').addEventListener('click', () => this.closeStatsModal());
        document.getElementById('exportStatsBtn').addEventListener('click', () => this.exportStats());
        
        // Templates modal
        document.getElementById('templatesModalClose').addEventListener('click', () => this.closeTemplatesModal());
        document.getElementById('templatesModalCancel').addEventListener('click', () => this.closeTemplatesModal());
        
        // File upload
        document.getElementById('notificationImage').addEventListener('change', (e) => this.handleFileUpload(e));
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }
    }

    handleSearch(searchTerm) {
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = document.getElementById('notificationsSearchInput').value.toLowerCase();
        const statusFilter = document.getElementById('notificationsStatusFilter').value;
        const languageFilter = document.getElementById('notificationsLanguageFilter').value;
        const segmentFilter = document.getElementById('notificationsSegmentFilter').value;
        const dateFromFilter = document.getElementById('notificationsDateFromFilter').value;
        const dateToFilter = document.getElementById('notificationsDateToFilter').value;
        
        this.filteredNotifications = this.notifications.filter(notification => {
            const matchesSearch = !searchTerm || 
                notification.internalTitle.toLowerCase().includes(searchTerm) ||
                notification.title.toLowerCase().includes(searchTerm) ||
                notification.message.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || notification.status === statusFilter;
            const matchesLanguage = !languageFilter || notification.language === languageFilter;
            const matchesSegment = !segmentFilter || notification.segment === segmentFilter;
            
            let matchesDateRange = true;
            if (dateFromFilter || dateToFilter) {
                const notificationDate = new Date(notification.createdAt);
                if (dateFromFilter) {
                    matchesDateRange = matchesDateRange && notificationDate >= new Date(dateFromFilter);
                }
                if (dateToFilter) {
                    const endDate = new Date(dateToFilter);
                    endDate.setHours(23, 59, 59, 999);
                    matchesDateRange = matchesDateRange && notificationDate <= endDate;
                }
            }
            
            return matchesSearch && matchesStatus && matchesLanguage && matchesSegment && matchesDateRange;
        });
        
        this.currentPage = 1;
        this.renderNotifications();
        this.updatePagination();
    }

    renderNotifications() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedNotifications = this.filteredNotifications.slice(startIndex, endIndex);
        
        this.renderNotificationsTable(paginatedNotifications);
        this.updatePagination();
        this.toggleEmptyState();
    }

    renderNotificationsTable(notifications) {
        const tbody = document.getElementById('notificationsTableBody');
        
        if (notifications.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhuma notificação encontrada</td></tr>';
            return;
        }
        
        tbody.innerHTML = notifications.map(notification => `
            <tr class="notification-row ${notification.status}" data-id="${notification.id}">
                <td>
                    <div class="notification-info">
                        <strong>${notification.internalTitle}</strong>
                        <small>${notification.title}</small>
                    </div>
                </td>
                <td>
                    <span class="notification-message">${this.truncateText(notification.message, 50)}</span>
                </td>
                <td>
                    <span class="notification-date">${this.formatNotificationDate(notification)}</span>
                </td>
                <td>
                    <span class="language-badge">${this.getLanguageFlag(notification.language)}</span>
                </td>
                <td>
                    <span class="segment-badge ${notification.segment}">${this.getSegmentIcon(notification.segment, notification.event)}</span>
                </td>
                <td>
                    <span class="status-badge ${notification.status}">${this.getStatusIcon(notification.status)}</span>
                </td>
                <td>
                    <div class="stats-summary">
                        ${notification.stats.sent > 0 ? `
                            <span class="stat-item">📤 ${notification.stats.sent}</span>
                            <span class="stat-item">👁️ ${notification.stats.delivered}</span>
                            <span class="stat-item">🖱️ ${notification.stats.clicked}</span>
                        ` : '<span class="stat-item">-</span>'}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-small btn-info" onclick="notificationsManager.viewStats(${notification.id})" title="Ver Estatísticas">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-small btn-primary" onclick="notificationsManager.editNotification(${notification.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${notification.status === 'scheduled' ? 
                            `<button class="btn btn-small btn-warning" onclick="notificationsManager.cancelNotification(${notification.id})" title="Cancelar">
                                <i class="fas fa-times"></i>
                            </button>` : ''
                        }
                        ${notification.status === 'sent' || notification.status === 'failed' ? 
                            `<button class="btn btn-small btn-success" onclick="notificationsManager.resendNotification(${notification.id})" title="Reenviar">
                                <i class="fas fa-redo"></i>
                            </button>` : ''
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // Notificações enviadas hoje
        const sentToday = this.notifications.filter(n => 
            n.status === 'sent' && n.sentAt && n.sentAt.startsWith(todayString)
        ).length;
        
        // Notificações programadas
        const scheduled = this.notifications.filter(n => n.status === 'scheduled').length;
        
        // Usuários inscritos (simulado)
        const subscribedUsers = 2847;
        
        // Taxa de clique média
        const totalSent = this.notifications.reduce((sum, n) => sum + n.stats.sent, 0);
        const totalClicked = this.notifications.reduce((sum, n) => sum + n.stats.clicked, 0);
        const clickThroughRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0;
        
        // Atualizar UI
        document.getElementById('notificationsSent').textContent = sentToday;
        document.getElementById('notificationsScheduled').textContent = scheduled;
        document.getElementById('subscribedUsers').textContent = subscribedUsers.toLocaleString();
        document.getElementById('clickThroughRate').textContent = `${clickThroughRate}%`;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredNotifications.length / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredNotifications.length);
        
        // Atualizar informações
        document.getElementById('notificationsPaginationInfo').textContent = 
            `Mostrando ${startItem}-${endItem} de ${this.filteredNotifications.length} notificações`;
        
        // Atualizar botões
        document.getElementById('notificationsPrevPageBtn').disabled = this.currentPage === 1;
        document.getElementById('notificationsNextPageBtn').disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Atualizar números das páginas
        this.renderPageNumbers(totalPages);
    }

    renderPageNumbers(totalPages) {
        const pageNumbers = document.getElementById('notificationsPageNumbers');
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        let html = '';
        
        if (startPage > 1) {
            html += '<button class="page-btn" onclick="notificationsManager.goToPage(1)">1</button>';
            if (startPage > 2) {
                html += '<span class="page-ellipsis">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="notificationsManager.goToPage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<span class="page-ellipsis">...</span>';
            }
            html += `<button class="page-btn" onclick="notificationsManager.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        pageNumbers.innerHTML = html;
    }

    toggleEmptyState() {
        const noNotificationsMessage = document.getElementById('noNotificationsMessage');
        const notificationsTable = document.querySelector('.notifications-table-container');
        
        if (this.filteredNotifications.length === 0) {
            noNotificationsMessage.style.display = 'block';
            notificationsTable.style.display = 'none';
        } else {
            noNotificationsMessage.style.display = 'none';
            notificationsTable.style.display = 'block';
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderNotifications();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredNotifications.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderNotifications();
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderNotifications();
    }

    // Modal Management
    openCreateNotificationModal() {
        this.editingNotificationId = null;
        this.clearNotificationForm();
        document.getElementById('notificationModalTitle').textContent = 'Criar Nova Notificação';
        document.getElementById('notificationModal').style.display = 'block';
        this.updateSegmentPreview();
    }

    closeNotificationModal() {
        document.getElementById('notificationModal').style.display = 'none';
        this.editingNotificationId = null;
    }

    clearNotificationForm() {
        document.getElementById('notificationForm').reset();
        document.getElementById('titleCharCount').textContent = '0';
        document.getElementById('messageCharCount').textContent = '0';
        this.hideAllConditionalGroups();
        this.removeFilePreview('image');
    }

    hideAllConditionalGroups() {
        document.getElementById('eventSegmentGroup').style.display = 'none';
        document.getElementById('scheduledDateGroup').style.display = 'none';
        document.getElementById('customLinkGroup').style.display = 'none';
        document.getElementById('templateNameGroup').style.display = 'none';
    }

    handleNotificationSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const notificationData = {
            internalTitle: formData.get('internalTitle'),
            title: formData.get('title'),
            message: formData.get('message'),
            language: formData.get('language'),
            segment: formData.get('segment'),
            event: formData.get('event'),
            scheduleType: formData.get('scheduleType'),
            scheduledDate: formData.get('scheduledDate'),
            sound: formData.has('sound'),
            link: formData.get('link') === 'custom' ? formData.get('customLink') : formData.get('link'),
            image: formData.get('image'),
            saveAsTemplate: formData.has('saveAsTemplate'),
            templateName: formData.get('templateName')
        };
        
        // Validação
        if (!this.validateNotificationData(notificationData)) {
            return;
        }
        
        if (this.editingNotificationId) {
            this.updateNotification(notificationData);
        } else {
            this.createNotification(notificationData);
        }
        
        this.closeNotificationModal();
    }

    validateNotificationData(data) {
        if (!data.internalTitle || !data.title || !data.message || !data.language || !data.segment || !data.scheduleType) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return false;
        }
        
        if (data.title.length > 50) {
            this.showNotification('O título não pode ter mais de 50 caracteres.', 'error');
            return false;
        }
        
        if (data.message.length > 140) {
            this.showNotification('A mensagem não pode ter mais de 140 caracteres.', 'error');
            return false;
        }
        
        if (data.segment === 'event' && !data.event) {
            this.showNotification('Selecione um evento para segmentação por comportamento.', 'error');
            return false;
        }
        
        if (data.scheduleType === 'scheduled' && !data.scheduledDate) {
            this.showNotification('Selecione uma data para agendamento.', 'error');
            return false;
        }
        
        if (data.saveAsTemplate && !data.templateName) {
            this.showNotification('Digite um nome para salvar como modelo.', 'error');
            return false;
        }
        
        return true;
    }

    createNotification(data) {
        const newNotification = {
            id: Math.max(...this.notifications.map(n => n.id)) + 1,
            ...data,
            status: data.scheduleType === 'immediate' ? 'sent' : 'scheduled',
            createdAt: new Date().toISOString(),
            sentAt: data.scheduleType === 'immediate' ? new Date().toISOString() : null,
            stats: {
                sent: data.scheduleType === 'immediate' ? this.getEstimatedUserCount(data.segment, data.event) : 0,
                delivered: data.scheduleType === 'immediate' ? Math.floor(this.getEstimatedUserCount(data.segment, data.event) * 0.95) : 0,
                clicked: 0,
                failed: data.scheduleType === 'immediate' ? Math.floor(this.getEstimatedUserCount(data.segment, data.event) * 0.05) : 0,
                devices: { mobile: 0, desktop: 0 }
            }
        };
        
        this.notifications.unshift(newNotification);
        
        // Salvar como modelo se solicitado
        if (data.saveAsTemplate) {
            this.saveAsTemplate(data);
        }
        
        // Enviar notificação se for imediata
        if (data.scheduleType === 'immediate') {
            this.sendNotification(newNotification);
        }
        
        this.applyFilters();
        this.updateStats();
        
        this.showNotification(
            data.scheduleType === 'immediate' ? 
            'Notificação enviada com sucesso!' : 
            'Notificação agendada com sucesso!', 
            'success'
        );
    }

    updateNotification(data) {
        const index = this.notifications.findIndex(n => n.id === this.editingNotificationId);
        if (index !== -1) {
            this.notifications[index] = { 
                ...this.notifications[index], 
                ...data,
                updatedAt: new Date().toISOString()
            };
            
            this.applyFilters();
            this.updateStats();
            
            this.showNotification('Notificação atualizada com sucesso!', 'success');
        }
    }

    editNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        this.editingNotificationId = notificationId;
        this.populateNotificationForm(notification);
        document.getElementById('notificationModalTitle').textContent = 'Editar Notificação';
        document.getElementById('notificationModal').style.display = 'block';
    }

    populateNotificationForm(notification) {
        document.getElementById('notificationInternalTitle').value = notification.internalTitle;
        document.getElementById('notificationTitle').value = notification.title;
        document.getElementById('notificationMessage').value = notification.message;
        document.getElementById('notificationLanguage').value = notification.language;
        document.getElementById('notificationSegment').value = notification.segment;
        document.getElementById('notificationScheduleType').value = notification.scheduleType;
        document.getElementById('notificationSound').checked = notification.sound;
        
        if (notification.event) {
            document.getElementById('notificationEvent').value = notification.event;
            this.handleSegmentChange(notification.segment);
        }
        
        if (notification.scheduledDate) {
            document.getElementById('notificationScheduledDate').value = notification.scheduledDate.slice(0, 16);
            this.handleScheduleTypeChange(notification.scheduleType);
        }
        
        if (notification.link) {
            const isCustomLink = !['/challenges', '/products', '/bonus', '/profile', '/store'].includes(notification.link);
            if (isCustomLink) {
                document.getElementById('notificationLink').value = 'custom';
                document.getElementById('notificationCustomLink').value = notification.link;
                this.handleLinkChange('custom');
            } else {
                document.getElementById('notificationLink').value = notification.link;
            }
        }
        
        this.updateCharCount('title', notification.title);
        this.updateCharCount('message', notification.message);
        this.updateSegmentPreview();
    }

    // Form Handlers
    updateCharCount(field, value) {
        const countElement = document.getElementById(`${field}CharCount`);
        countElement.textContent = value.length;
        
        const maxLength = field === 'title' ? 50 : 140;
        countElement.style.color = value.length > maxLength * 0.9 ? '#ef4444' : '#6b7280';
    }

    handleSegmentChange(segment) {
        const eventGroup = document.getElementById('eventSegmentGroup');
        eventGroup.style.display = segment === 'event' ? 'block' : 'none';
        this.updateSegmentPreview();
    }

    handleScheduleTypeChange(type) {
        const scheduledGroup = document.getElementById('scheduledDateGroup');
        scheduledGroup.style.display = type === 'scheduled' ? 'block' : 'none';
    }

    handleLinkChange(link) {
        const customGroup = document.getElementById('customLinkGroup');
        customGroup.style.display = link === 'custom' ? 'block' : 'none';
    }

    handleSaveAsTemplateChange(checked) {
        const templateGroup = document.getElementById('templateNameGroup');
        templateGroup.style.display = checked ? 'block' : 'none';
    }

    updateSegmentPreview() {
        const segment = document.getElementById('notificationSegment').value;
        const event = document.getElementById('notificationEvent').value;
        const language = document.getElementById('notificationLanguage').value;
        
        const estimatedCount = this.getEstimatedUserCount(segment, event, language);
        const segmentText = this.getSegmentText(segment, event);
        
        document.getElementById('segmentCount').textContent = 
            `${estimatedCount} usuários estimados - ${segmentText}`;
    }

    getEstimatedUserCount(segment, event, language) {
        // Simulação de contagem de usuários
        const baseCounts = {
            all: 2847,
            free: 1923,
            premium: 924,
            event: 450
        };
        
        let count = baseCounts[segment] || 0;
        
        // Ajustar por idioma (simulado)
        if (language) {
            const languageMultipliers = { es: 0.45, pt: 0.35, en: 0.20 };
            count = Math.floor(count * (languageMultipliers[language] || 1));
        }
        
        // Ajustar por evento específico
        if (segment === 'event' && event) {
            const eventMultipliers = {
                challenge_day_1: 0.3,
                challenge_day_3: 0.25,
                challenge_day_7: 0.15,
                downloaded_planner: 0.4,
                purchased_product: 0.1,
                inactive_3_days: 0.2,
                inactive_7_days: 0.15,
                new_user: 0.05,
                birthday: 0.003
            };
            count = Math.floor(count * (eventMultipliers[event] || 0.1));
        }
        
        return Math.max(1, count);
    }

    getSegmentText(segment, event) {
        const segments = {
            all: 'Todos os usuários',
            free: 'Usuários gratuitos',
            premium: 'Usuários premium',
            event: 'Usuários por evento'
        };
        
        let text = segments[segment] || segment;
        
        if (segment === 'event' && event) {
            const events = {
                challenge_day_1: 'que concluíram o Dia 1',
                challenge_day_3: 'que concluíram o Dia 3',
                challenge_day_7: 'que concluíram o Dia 7',
                downloaded_planner: 'que baixaram um planner',
                purchased_product: 'que compraram um produto',
                inactive_3_days: 'inativos há 3 dias',
                inactive_7_days: 'inativos há 7 dias',
                new_user: 'novos (24h)',
                birthday: 'aniversariantes'
            };
            text += ` (${events[event] || event})`;
        }
        
        return text;
    }

    // File Upload
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validar arquivo
        if (!file.type.startsWith('image/')) {
            this.showNotification('Por favor, selecione apenas arquivos de imagem.', 'error');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) { // 2MB
            this.showNotification('A imagem deve ter no máximo 2MB.', 'error');
            return;
        }
        
        // Mostrar preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showFilePreview('image', e.target.result);
        };
        reader.readAsDataURL(file);
    }

    showFilePreview(type, src) {
        const uploadArea = document.getElementById(`notification${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea`);
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const preview = uploadArea.querySelector('.upload-preview');
        const img = uploadArea.querySelector('img');
        
        placeholder.style.display = 'none';
        preview.style.display = 'flex';
        img.src = src;
    }

    removeFile(type) {
        const uploadArea = document.getElementById(`notification${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea`);
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const preview = uploadArea.querySelector('.upload-preview');
        const input = uploadArea.querySelector('input[type="file"]');
        
        placeholder.style.display = 'flex';
        preview.style.display = 'none';
        input.value = '';
    }

    removeFilePreview(type) {
        this.removeFile(type);
    }

    // Notification Actions
    async sendNotification(notification) {
        // Simular envio de notificação PWA
        if ('serviceWorker' in navigator && 'Notification' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(notification.title, {
                    body: notification.message,
                    icon: '/icon-192x192.png',
                    badge: '/icon-72x72.png',
                    vibrate: notification.sound ? [200, 100, 200] : undefined,
                    data: {
                        url: notification.link || '/',
                        notificationId: notification.id
                    },
                    actions: notification.link ? [{
                        action: 'open',
                        title: 'Abrir',
                        icon: '/icon-192x192.png'
                    }] : undefined
                });
                
                console.log('Notificação enviada:', notification.title);
            } catch (error) {
                console.error('Erro ao enviar notificação:', error);
            }
        }
    }

    cancelNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        if (confirm(`Tem certeza que deseja cancelar a notificação "${notification.internalTitle}"?`)) {
            notification.status = 'cancelled';
            notification.cancelledAt = new Date().toISOString();
            
            this.renderNotifications();
            this.updateStats();
            
            this.showNotification('Notificação cancelada com sucesso!', 'success');
        }
    }

    resendNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        if (confirm(`Deseja reenviar a notificação "${notification.internalTitle}"?`)) {
            // Criar nova notificação baseada na anterior
            const newNotification = {
                ...notification,
                id: Math.max(...this.notifications.map(n => n.id)) + 1,
                status: 'sent',
                createdAt: new Date().toISOString(),
                sentAt: new Date().toISOString(),
                stats: {
                    sent: this.getEstimatedUserCount(notification.segment, notification.event),
                    delivered: 0,
                    clicked: 0,
                    failed: 0,
                    devices: { mobile: 0, desktop: 0 }
                }
            };
            
            this.notifications.unshift(newNotification);
            this.sendNotification(newNotification);
            
            this.applyFilters();
            this.updateStats();
            
            this.showNotification('Notificação reenviada com sucesso!', 'success');
        }
    }

    // Utility Functions
    formatNotificationDate(notification) {
        let date;
        let label = '';
        
        if (notification.status === 'scheduled' && notification.scheduledDate) {
            date = new Date(notification.scheduledDate);
            label = 'Agendada: ';
        } else if (notification.status === 'sent' && notification.sentAt) {
            date = new Date(notification.sentAt);
            label = 'Enviada: ';
        } else if (notification.status === 'cancelled' && notification.cancelledAt) {
            date = new Date(notification.cancelledAt);
            label = 'Cancelada: ';
        } else if (notification.status === 'failed' && notification.failedAt) {
            date = new Date(notification.failedAt);
            label = 'Falhou: ';
        } else {
            date = new Date(notification.createdAt);
            label = 'Criada: ';
        }
        
        return label + date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getLanguageFlag(language) {
        const flags = {
            'es': '🇪🇸 ES',
            'pt': '🇧🇷 PT',
            'en': '🇺🇸 EN'
        };
        return flags[language] || language;
    }

    getSegmentIcon(segment, event) {
        const segments = {
            'all': '👥 Todos',
            'free': '🆓 Gratuitos',
            'premium': '👑 Premium',
            'event': '🎯 Evento'
        };
        return segments[segment] || segment;
    }

    getStatusIcon(status) {
        const statuses = {
            'scheduled': '📅 Programada',
            'sent': '✅ Enviada',
            'cancelled': '❌ Cancelada',
            'failed': '⚠️ Falhou'
        };
        return statuses[status] || status;
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Preview Modal Functions
    openPreviewModal() {
        const title = document.getElementById('notificationTitle').value;
        const message = document.getElementById('notificationMessage').value;
        const language = document.getElementById('notificationLanguage').value;
        const segment = document.getElementById('notificationSegment').value;
        const event = document.getElementById('notificationEvent').value;
        const scheduleType = document.getElementById('notificationScheduleType').value;
        const scheduledDate = document.getElementById('notificationScheduledDate').value;
        const sound = document.getElementById('notificationSound').checked;
        const link = document.getElementById('notificationLink').value;
        const customLink = document.getElementById('notificationCustomLink').value;
        
        // Validação básica
        if (!title || !message || !language || !segment || !scheduleType) {
            this.showNotification('Preencha os campos obrigatórios antes de visualizar.', 'error');
            return;
        }
        
        // Atualizar preview
        document.getElementById('previewTitle').textContent = title;
        document.getElementById('previewMessage').textContent = message;
        document.getElementById('previewLanguage').textContent = this.getLanguageFlag(language);
        document.getElementById('previewSegment').textContent = this.getSegmentText(segment, event);
        document.getElementById('previewUserCount').textContent = this.getEstimatedUserCount(segment, event, language);
        document.getElementById('previewSchedule').textContent = scheduleType === 'immediate' ? 'Imediato' : 
            (scheduledDate ? this.formatDate(scheduledDate) : 'Não definido');
        document.getElementById('previewLink').textContent = link === 'custom' ? customLink : (link || 'Nenhum');
        document.getElementById('previewSound').textContent = sound ? 'Sim' : 'Não';
        
        // Mostrar indicador de som
        document.getElementById('previewSoundIndicator').style.display = sound ? 'block' : 'none';
        
        document.getElementById('notificationPreviewModal').style.display = 'block';
    }

    closePreviewModal() {
        document.getElementById('notificationPreviewModal').style.display = 'none';
    }

    sendFromPreview() {
        this.closePreviewModal();
        document.getElementById('notificationForm').dispatchEvent(new Event('submit'));
    }

    // Statistics Modal Functions
    viewStats(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;
        
        this.populateStatsModal(notification);
        document.getElementById('notificationStatsModal').style.display = 'block';
    }

    populateStatsModal(notification) {
        document.getElementById('notificationStatsModalTitle').textContent = 
            `Estatísticas: ${notification.internalTitle}`;
        
        // Stats overview
        document.getElementById('statsSent').textContent = notification.stats.sent;
        document.getElementById('statsDelivered').textContent = notification.stats.delivered;
        document.getElementById('statsClicked').textContent = notification.stats.clicked;
        
        const clickRate = notification.stats.sent > 0 ? 
            ((notification.stats.clicked / notification.stats.sent) * 100).toFixed(1) : 0;
        document.getElementById('statsClickRate').textContent = `${clickRate}%`;
        
        // Device breakdown
        const totalDevices = notification.stats.devices.mobile + notification.stats.devices.desktop;
        if (totalDevices > 0) {
            const mobilePercentage = ((notification.stats.devices.mobile / totalDevices) * 100).toFixed(1);
            const desktopPercentage = ((notification.stats.devices.desktop / totalDevices) * 100).toFixed(1);
            
            document.getElementById('mobileProgress').style.width = `${mobilePercentage}%`;
            document.getElementById('mobilePercentage').textContent = `${mobilePercentage}%`;
            document.getElementById('desktopProgress').style.width = `${desktopPercentage}%`;
            document.getElementById('desktopPercentage').textContent = `${desktopPercentage}%`;
        } else {
            document.getElementById('mobileProgress').style.width = '0%';
            document.getElementById('mobilePercentage').textContent = '0%';
            document.getElementById('desktopProgress').style.width = '0%';
            document.getElementById('desktopPercentage').textContent = '0%';
        }
        
        // Delivery status table
        this.populateDeliveryStatusTable(notification);
    }

    populateDeliveryStatusTable(notification) {
        const tbody = document.getElementById('deliveryStatusTableBody');
        const statuses = [
            { name: 'Entregues', count: notification.stats.delivered, color: '#10b981' },
            { name: 'Clicadas', count: notification.stats.clicked, color: '#3b82f6' },
            { name: 'Falhas', count: notification.stats.failed, color: '#ef4444' }
        ];
        
        const total = notification.stats.sent;
        
        tbody.innerHTML = statuses.map(status => {
            const percentage = total > 0 ? ((status.count / total) * 100).toFixed(1) : 0;
            return `
                <tr>
                    <td style="color: ${status.color}; font-weight: 500;">${status.name}</td>
                    <td>${status.count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        }).join('');
    }

    closeStatsModal() {
        document.getElementById('notificationStatsModal').style.display = 'none';
    }

    exportStats() {
        if (!this.currentStatsNotification) return;
        
        // Simular exportação de estatísticas
        this.showNotification('Relatório de estatísticas exportado com sucesso!', 'success');
    }

    // Templates Modal Functions
    openTemplatesModal() {
        this.renderTemplates();
        document.getElementById('templatesModal').style.display = 'block';
    }

    closeTemplatesModal() {
        document.getElementById('templatesModal').style.display = 'none';
    }

    renderTemplates() {
        const grid = document.getElementById('templatesGrid');
        const noTemplatesMessage = document.getElementById('noTemplatesMessage');
        
        if (this.templates.length === 0) {
            grid.style.display = 'none';
            noTemplatesMessage.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        noTemplatesMessage.style.display = 'none';
        
        grid.innerHTML = this.templates.map(template => `
            <div class="template-card" onclick="notificationsManager.useTemplate(${template.id})">
                <h4>${template.name}</h4>
                <div class="template-title">${template.title}</div>
                <div class="template-message">${this.truncateText(template.message, 100)}</div>
                <div class="template-meta">
                    <span>${this.getLanguageFlag(template.language)}</span>
                    <span>${this.getSegmentText(template.segment, template.event)}</span>
                </div>
                <div class="template-actions">
                    <button class="btn btn-small btn-primary" onclick="event.stopPropagation(); notificationsManager.useTemplate(${template.id})">
                        <i class="fas fa-plus"></i>
                        Usar
                    </button>
                    <button class="btn btn-small btn-danger" onclick="event.stopPropagation(); notificationsManager.deleteTemplate(${template.id})">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    useTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;
        
        this.closeTemplatesModal();
        this.openCreateNotificationModal();
        
        // Popular formulário com dados do template
        document.getElementById('notificationInternalTitle').value = template.name;
        document.getElementById('notificationTitle').value = template.title;
        document.getElementById('notificationMessage').value = template.message;
        document.getElementById('notificationLanguage').value = template.language;
        document.getElementById('notificationSegment').value = template.segment;
        document.getElementById('notificationSound').checked = template.sound;
        
        if (template.link) {
            document.getElementById('notificationLink').value = template.link;
        }
        
        if (template.event) {
            document.getElementById('notificationEvent').value = template.event;
            this.handleSegmentChange(template.segment);
        }
        
        this.updateCharCount('title', template.title);
        this.updateCharCount('message', template.message);
        this.updateSegmentPreview();
    }

    deleteTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;
        
        if (confirm(`Tem certeza que deseja excluir o modelo "${template.name}"?`)) {
            this.templates = this.templates.filter(t => t.id !== templateId);
            this.renderTemplates();
            this.showNotification('Modelo excluído com sucesso!', 'success');
        }
    }

    saveAsTemplate(data) {
        const newTemplate = {
            id: Math.max(...this.templates.map(t => t.id), 0) + 1,
            name: data.templateName,
            title: data.title,
            message: data.message,
            language: data.language,
            segment: data.segment,
            event: data.event,
            sound: data.sound,
            link: data.link,
            createdAt: new Date().toISOString()
        };
        
        this.templates.push(newTemplate);
        this.showNotification(`Modelo "${data.templateName}" salvo com sucesso!`, 'success');
    }

    // Export Functions
    exportNotifications() {
        const csvContent = this.generateNotificationsCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `notificacoes_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        this.showNotification('Relatório de notificações exportado com sucesso!', 'success');
    }

    generateNotificationsCSV() {
        const headers = [
            'ID', 'Título Interno', 'Título', 'Mensagem', 'Idioma', 'Segmento', 
            'Status', 'Data Criação', 'Data Envio', 'Enviadas', 'Entregues', 'Cliques', 'Falhas'
        ];
        
        const rows = this.filteredNotifications.map(notification => [
            notification.id,
            `"${notification.internalTitle}"`,
            `"${notification.title}"`,
            `"${notification.message}"`,
            notification.language.toUpperCase(),
            this.getSegmentText(notification.segment, notification.event),
            this.getStatusText(notification.status),
            this.formatDate(notification.createdAt),
            notification.sentAt ? this.formatDate(notification.sentAt) : '-',
            notification.stats.sent,
            notification.stats.delivered,
            notification.stats.clicked,
            notification.stats.failed
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    getStatusText(status) {
        const statuses = {
            'scheduled': 'Programada',
            'sent': 'Enviada',
            'cancelled': 'Cancelada',
            'failed': 'Falhou'
        };
        return statuses[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('notificationsTable')) {
            window.notificationsManager = new NotificationsManager();
        }
    }, 100);
});