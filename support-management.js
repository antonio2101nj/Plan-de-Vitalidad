// Support Center Management System
class SupportManager {
    constructor() {
        this.isInitialized = false;
        this.currentTicket = null;
        this.settings = {
            aiEnabled: false,
            apiKey: '',
            responseLanguage: 'es',
            aiTone: 'empathetic',
            trainingData: '',
            dailyLimit: 50,
            userLimit: 10,
            autoResponse: true
        };
        this.tickets = [];
        this.stats = {
            totalTickets: 0,
            aiResponses: 0,
            manualResponses: 0,
            pendingTickets: 0,
            resolvedTickets: 0,
            avgResponseTime: 0,
            satisfactionRating: 0
        };
        this.quickResponses = [];
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🤖 Inicializando Sistema de Suporte...');
        this.loadSettings();
        this.loadTickets();
        this.loadQuickResponses();
        this.setupEventListeners();
        this.updateStats();
        this.renderTickets();
        this.isInitialized = true;
        console.log('✅ Sistema de Suporte inicializado!');
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('supportSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        // Carregar API key das integrações se disponível
        const integrationSettings = localStorage.getItem('integrationSettings');
        if (integrationSettings) {
            const integrations = JSON.parse(integrationSettings);
            if (integrations.openai && integrations.openai.apiKey) {
                this.settings.apiKey = integrations.openai.apiKey;
            }
        }
        
        this.populateSettings();
    }

    populateSettings() {
        // AI Toggle
        const aiToggle = document.getElementById('aiToggle');
        const aiToggleSwitch = document.getElementById('aiToggleSwitch');
        if (aiToggle && aiToggleSwitch) {
            aiToggle.classList.toggle('active', this.settings.aiEnabled);
            aiToggleSwitch.classList.toggle('active', this.settings.aiEnabled);
        }

        // API Status
        this.updateApiStatus();

        // Response Language
        const responseLanguage = document.getElementById('responseLanguage');
        if (responseLanguage) {
            responseLanguage.value = this.settings.responseLanguage;
        }

        // AI Tone
        const toneOptions = document.querySelectorAll('.tone-option');
        toneOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.tone === this.settings.aiTone);
        });

        // Training Data
        const trainingData = document.getElementById('trainingData');
        if (trainingData) {
            trainingData.value = this.settings.trainingData;
            this.updateTrainingStats();
        }

        // Limits
        const dailyLimit = document.getElementById('dailyLimit');
        const userLimit = document.getElementById('userLimit');
        if (dailyLimit) dailyLimit.value = this.settings.dailyLimit;
        if (userLimit) userLimit.value = this.settings.userLimit;

        // Auto Response
        const autoResponse = document.getElementById('autoResponse');
        if (autoResponse) {
            autoResponse.checked = this.settings.autoResponse;
        }
    }

    setupEventListeners() {
        // AI Toggle
        const aiToggleSwitch = document.getElementById('aiToggleSwitch');
        if (aiToggleSwitch) {
            aiToggleSwitch.addEventListener('click', () => {
                this.toggleAI();
            });
        }

        // Test API Connection
        const testApiBtn = document.getElementById('testApiBtn');
        if (testApiBtn) {
            testApiBtn.addEventListener('click', () => {
                this.testApiConnection();
            });
        }

        // Response Language
        const responseLanguage = document.getElementById('responseLanguage');
        if (responseLanguage) {
            responseLanguage.addEventListener('change', (e) => {
                this.settings.responseLanguage = e.target.value;
                this.saveSettings();
            });
        }

        // Tone Selection
        const toneOptions = document.querySelectorAll('.tone-option');
        toneOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectTone(option.dataset.tone);
            });
        });

        // Training Data
        const trainingData = document.getElementById('trainingData');
        if (trainingData) {
            trainingData.addEventListener('input', () => {
                this.settings.trainingData = trainingData.value;
                this.updateTrainingStats();
                this.saveSettings();
            });
        }

        // Limits
        const dailyLimit = document.getElementById('dailyLimit');
        const userLimit = document.getElementById('userLimit');
        if (dailyLimit) {
            dailyLimit.addEventListener('change', (e) => {
                this.settings.dailyLimit = parseInt(e.target.value);
                this.saveSettings();
            });
        }
        if (userLimit) {
            userLimit.addEventListener('change', (e) => {
                this.settings.userLimit = parseInt(e.target.value);
                this.saveSettings();
            });
        }

        // Auto Response
        const autoResponse = document.getElementById('autoResponse');
        if (autoResponse) {
            autoResponse.addEventListener('change', (e) => {
                this.settings.autoResponse = e.target.checked;
                this.saveSettings();
            });
        }

        // Filter Buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterTickets(btn.dataset.filter);
            });
        });

        // Response Editor Events
        this.setupResponseEditor();

        // Save Settings Button
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
                this.showNotification('Configurações salvas com sucesso!', 'success');
            });
        }
    }

    setupResponseEditor() {
        // Close Response Editor
        const closeEditorBtn = document.getElementById('closeResponseEditor');
        if (closeEditorBtn) {
            closeEditorBtn.addEventListener('click', () => {
                this.closeResponseEditor();
            });
        }

        // Quick Response Buttons
        const quickResponseBtns = document.querySelectorAll('.quick-response-btn');
        quickResponseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.insertQuickResponse(btn.dataset.response);
            });
        });

        // AI Suggest Response
        const aiSuggestBtn = document.getElementById('aiSuggestResponse');
        if (aiSuggestBtn) {
            aiSuggestBtn.addEventListener('click', () => {
                this.generateAIResponse();
            });
        }

        // Translate Response
        const translateBtn = document.getElementById('translateResponse');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => {
                this.translateResponse();
            });
        }

        // Send Response
        const sendResponseBtn = document.getElementById('sendResponse');
        if (sendResponseBtn) {
            sendResponseBtn.addEventListener('click', () => {
                this.sendResponse();
            });
        }

        // Add to FAQ
        const addToFaqBtn = document.getElementById('addToFaq');
        if (addToFaqBtn) {
            addToFaqBtn.addEventListener('click', () => {
                this.addToFAQ();
            });
        }

        // Mark as Resolved
        const markResolvedBtn = document.getElementById('markResolved');
        if (markResolvedBtn) {
            markResolvedBtn.addEventListener('click', () => {
                this.markAsResolved();
            });
        }

        // Escalate Ticket
        const escalateBtn = document.getElementById('escalateTicket');
        if (escalateBtn) {
            escalateBtn.addEventListener('click', () => {
                this.escalateTicket();
            });
        }
    }

    toggleAI() {
        this.settings.aiEnabled = !this.settings.aiEnabled;
        
        const aiToggle = document.getElementById('aiToggle');
        const aiToggleSwitch = document.getElementById('aiToggleSwitch');
        
        if (aiToggle && aiToggleSwitch) {
            aiToggle.classList.toggle('active', this.settings.aiEnabled);
            aiToggleSwitch.classList.toggle('active', this.settings.aiEnabled);
        }

        this.saveSettings();
        this.updateApiStatus();
        
        const status = this.settings.aiEnabled ? 'ativado' : 'desativado';
        this.showNotification(`IA ${status} com sucesso!`, 'success');
    }

    async testApiConnection() {
        if (!this.settings.apiKey) {
            this.showNotification('API Key não configurada', 'error');
            return;
        }

        const testBtn = document.getElementById('testApiBtn');
        if (testBtn) {
            testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testando...';
            testBtn.disabled = true;
        }

        try {
            // Simular teste de API (implementar chamada real)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Conexão com API estabelecida com sucesso!', 'success');
            this.updateApiStatus(true);
        } catch (error) {
            this.showNotification('Erro ao conectar com a API: ' + error.message, 'error');
            this.updateApiStatus(false);
        } finally {
            if (testBtn) {
                testBtn.innerHTML = '<i class="fas fa-plug"></i> Testar Conexão';
                testBtn.disabled = false;
            }
        }
    }

    updateApiStatus(connected = null) {
        const apiStatus = document.getElementById('apiStatus');
        if (!apiStatus) return;

        const hasApiKey = this.settings.apiKey && this.settings.apiKey.length > 0;
        
        if (connected === null) {
            connected = hasApiKey && this.settings.aiEnabled;
        }

        if (connected && hasApiKey) {
            apiStatus.innerHTML = '<i class="fas fa-check-circle"></i> API Conectada';
            apiStatus.className = 'api-status connected';
        } else {
            apiStatus.innerHTML = '<i class="fas fa-times-circle"></i> API Desconectada';
            apiStatus.className = 'api-status disconnected';
        }
    }

    selectTone(tone) {
        this.settings.aiTone = tone;
        
        const toneOptions = document.querySelectorAll('.tone-option');
        toneOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.tone === tone);
        });

        this.saveSettings();
    }

    updateTrainingStats() {
        const trainingData = document.getElementById('trainingData');
        const wordCount = document.getElementById('wordCount');
        const charCount = document.getElementById('charCount');
        const lineCount = document.getElementById('lineCount');

        if (!trainingData || !wordCount || !charCount || !lineCount) return;

        const text = trainingData.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const lines = text.split('\n').length;

        wordCount.textContent = `${words} palavras`;
        charCount.textContent = `${chars} caracteres`;
        lineCount.textContent = `${lines} linhas`;
    }

    loadTickets() {
        const savedTickets = localStorage.getItem('supportTickets');
        if (savedTickets) {
            this.tickets = JSON.parse(savedTickets);
        } else {
            // Dados de exemplo
            this.tickets = [
                {
                    id: 1,
                    user: 'María González',
                    email: 'maria@email.com',
                    message: '¿Cómo puedo acceder a los desafíos premium? No aparecen en mi app.',
                    date: new Date().toISOString(),
                    language: 'es',
                    status: 'pending',
                    responses: [],
                    rating: null,
                    avatar: 'MG'
                },
                {
                    id: 2,
                    user: 'João Silva',
                    email: 'joao@email.com',
                    message: 'Não consigo fazer download dos eBooks. Sempre dá erro.',
                    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    language: 'pt',
                    status: 'responded',
                    responses: [
                        {
                            type: 'ai',
                            message: 'Olá João! Para resolver o problema de download dos eBooks, tente os seguintes passos: 1) Verifique sua conexão com a internet, 2) Feche e reabra o aplicativo, 3) Tente fazer o download novamente. Se o problema persistir, entre em contato conosco.',
                            date: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
                        }
                    ],
                    rating: 4,
                    avatar: 'JS'
                },
                {
                    id: 3,
                    user: 'Sarah Johnson',
                    email: 'sarah@email.com',
                    message: 'I cannot find the meditation section in the app. Is it available in English?',
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    language: 'en',
                    status: 'escalated',
                    responses: [],
                    rating: null,
                    avatar: 'SJ'
                }
            ];
        }
    }

    loadQuickResponses() {
        const savedResponses = localStorage.getItem('quickResponses');
        if (savedResponses) {
            this.quickResponses = JSON.parse(savedResponses);
        } else {
            this.quickResponses = [
                {
                    title: 'Boas-vindas',
                    text: 'Olá! Obrigado por entrar em contato. Estou aqui para ajudar você.'
                },
                {
                    title: 'Problema Técnico',
                    text: 'Entendo sua dificuldade. Vamos resolver isso juntos. Pode me fornecer mais detalhes?'
                },
                {
                    title: 'Acesso Premium',
                    text: 'Para acessar o conteúdo premium, certifique-se de ter uma assinatura ativa.'
                },
                {
                    title: 'Download de Conteúdo',
                    text: 'Para fazer download, verifique sua conexão e tente novamente. Se persistir, reinicie o app.'
                },
                {
                    title: 'Encerramento',
                    text: 'Espero ter ajudado! Se tiver outras dúvidas, não hesite em contatar novamente.'
                }
            ];
        }
        
        this.renderQuickResponses();
    }

    renderQuickResponses() {
        const quickResponseGrid = document.getElementById('quickResponseGrid');
        if (!quickResponseGrid) return;

        quickResponseGrid.innerHTML = '';
        
        this.quickResponses.forEach((response, index) => {
            const btn = document.createElement('button');
            btn.className = 'quick-response-btn';
            btn.dataset.response = response.text;
            btn.textContent = response.title;
            btn.addEventListener('click', () => {
                this.insertQuickResponse(response.text);
            });
            quickResponseGrid.appendChild(btn);
        });
    }

    renderTickets(filter = 'all') {
        const supportInbox = document.getElementById('supportInbox');
        if (!supportInbox) return;

        let filteredTickets = this.tickets;
        
        if (filter !== 'all') {
            filteredTickets = this.tickets.filter(ticket => ticket.status === filter);
        }

        supportInbox.innerHTML = '';

        if (filteredTickets.length === 0) {
            supportInbox.innerHTML = `
                <div class="no-tickets">
                    <i class="fas fa-inbox"></i>
                    <h4>Nenhum ticket encontrado</h4>
                    <p>Não há tickets que correspondam ao filtro selecionado.</p>
                </div>
            `;
            return;
        }

        filteredTickets.forEach(ticket => {
            const ticketElement = this.createTicketElement(ticket);
            supportInbox.appendChild(ticketElement);
        });
    }

    createTicketElement(ticket) {
        const div = document.createElement('div');
        div.className = `support-ticket ${ticket.status}`;
        div.dataset.ticketId = ticket.id;

        const timeAgo = this.getTimeAgo(new Date(ticket.date));
        const languageFlag = this.getLanguageFlag(ticket.language);
        const statusClass = this.getStatusClass(ticket.status);
        const statusText = this.getStatusText(ticket.status);

        div.innerHTML = `
            <div class="ticket-header">
                <div class="ticket-user">
                    <div class="user-avatar">${ticket.avatar}</div>
                    <span>${ticket.user}</span>
                </div>
                <div class="ticket-meta">
                    <span>${languageFlag} ${ticket.language.toUpperCase()}</span>
                    <span><i class="fas fa-clock"></i> ${timeAgo}</span>
                    <span class="ticket-status ${statusClass}">${statusText}</span>
                </div>
            </div>
            <div class="ticket-message">${ticket.message}</div>
            ${ticket.rating ? `
                <div class="rating-display">
                    <span>Avaliação:</span>
                    <div class="stars">
                        ${this.renderStars(ticket.rating)}
                    </div>
                </div>
            ` : ''}
            <div class="ticket-actions">
                <button class="btn btn-primary btn-small" onclick="supportManager.openResponseEditor(${ticket.id})">
                    <i class="fas fa-reply"></i> Responder
                </button>
                <button class="btn btn-secondary btn-small" onclick="supportManager.viewTicketHistory(${ticket.id})">
                    <i class="fas fa-history"></i> Histórico
                </button>
                ${ticket.status === 'pending' ? `
                    <button class="btn btn-success btn-small" onclick="supportManager.markAsResolved(${ticket.id})">
                        <i class="fas fa-check"></i> Resolver
                    </button>
                ` : ''}
            </div>
        `;

        div.addEventListener('click', (e) => {
            if (!e.target.closest('.ticket-actions')) {
                this.openResponseEditor(ticket.id);
            }
        });

        return div;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d atrás`;
        if (hours > 0) return `${hours}h atrás`;
        if (minutes > 0) return `${minutes}m atrás`;
        return 'Agora';
    }

    getLanguageFlag(language) {
        const flags = {
            'es': '🇪🇸',
            'pt': '🇧🇷',
            'en': '🇺🇸'
        };
        return flags[language] || '🌐';
    }

    getStatusClass(status) {
        return status;
    }

    getStatusText(status) {
        const texts = {
            'pending': 'Pendente',
            'responded': 'Respondido',
            'escalated': 'Encaminhado',
            'resolved': 'Resolvido'
        };
        return texts[status] || status;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating ? 'filled' : '';
            stars += `<i class="fas fa-star star ${filled}"></i>`;
        }
        return stars;
    }

    filterTickets(filter) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderTickets(filter);
    }

    openResponseEditor(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        this.currentTicket = ticket;
        
        const responseEditor = document.getElementById('responseEditor');
        const originalMessage = document.getElementById('originalMessage');
        const responseTextarea = document.getElementById('responseTextarea');

        if (responseEditor && originalMessage && responseTextarea) {
            originalMessage.innerHTML = `
                <h5>${ticket.user} (${ticket.email})</h5>
                <p><strong>Pergunta original:</strong></p>
                <p>${ticket.message}</p>
                <div class="ticket-meta">
                    <span>${this.getLanguageFlag(ticket.language)} ${ticket.language.toUpperCase()}</span>
                    <span>${this.getTimeAgo(new Date(ticket.date))}</span>
                </div>
            `;

            responseTextarea.value = '';
            responseEditor.classList.add('active');
        }

        // Renderizar histórico de conversas se existir
        this.renderConversationHistory(ticket);
    }

    renderConversationHistory(ticket) {
        const conversationHistory = document.getElementById('conversationHistory');
        if (!conversationHistory) return;

        if (ticket.responses && ticket.responses.length > 0) {
            conversationHistory.innerHTML = '';
            
            ticket.responses.forEach(response => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `conversation-message ${response.type}`;
                
                messageDiv.innerHTML = `
                    <div class="message-header">
                        <span>${response.type === 'ai' ? '🤖 IA' : '👤 Suporte'}</span>
                        <span>${this.getTimeAgo(new Date(response.date))}</span>
                    </div>
                    <div class="message-content">${response.message}</div>
                `;
                
                conversationHistory.appendChild(messageDiv);
            });
        } else {
            conversationHistory.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma resposta anterior</p>';
        }
    }

    closeResponseEditor() {
        const responseEditor = document.getElementById('responseEditor');
        if (responseEditor) {
            responseEditor.classList.remove('active');
        }
        this.currentTicket = null;
    }

    insertQuickResponse(text) {
        const responseTextarea = document.getElementById('responseTextarea');
        if (responseTextarea) {
            responseTextarea.value = text;
            responseTextarea.focus();
        }
    }

    async generateAIResponse() {
        if (!this.currentTicket || !this.settings.aiEnabled) {
            this.showNotification('IA não está habilitada', 'warning');
            return;
        }

        const aiSuggestBtn = document.getElementById('aiSuggestResponse');
        if (aiSuggestBtn) {
            aiSuggestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
            aiSuggestBtn.disabled = true;
        }

        try {
            // Simular geração de resposta da IA
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const aiResponse = this.simulateAIResponse(this.currentTicket);
            
            const responseTextarea = document.getElementById('responseTextarea');
            if (responseTextarea) {
                responseTextarea.value = aiResponse;
            }

            this.showNotification('Resposta gerada pela IA!', 'success');
        } catch (error) {
            this.showNotification('Erro ao gerar resposta: ' + error.message, 'error');
        } finally {
            if (aiSuggestBtn) {
                aiSuggestBtn.innerHTML = '<i class="fas fa-magic"></i> Sugerir Resposta IA';
                aiSuggestBtn.disabled = false;
            }
        }
    }

    simulateAIResponse(ticket) {
        const responses = {
            'es': {
                'premium': '¡Hola! Para acceder al contenido premium, asegúrate de tener una suscripción activa. Puedes verificar tu estado de suscripción en la sección "Mi Cuenta" del app. Si necesitas ayuda adicional, estoy aquí para apoyarte.',
                'download': 'Entiendo tu dificultad con las descargas. Te recomiendo: 1) Verificar tu conexión a internet, 2) Cerrar y abrir la app nuevamente, 3) Intentar la descarga nuevamente. Si el problema persiste, por favor contactanos.',
                'default': 'Gracias por contactarnos. Entiendo tu consulta y estoy aquí para ayudarte. ¿Podrías proporcionarme más detalles para poder asistirte mejor?'
            },
            'pt': {
                'premium': 'Olá! Para acessar o conteúdo premium, certifique-se de ter uma assinatura ativa. Você pode verificar seu status na seção "Minha Conta" do app. Se precisar de ajuda adicional, estou aqui para apoiá-lo.',
                'download': 'Entendo sua dificuldade com downloads. Recomendo: 1) Verificar sua conexão com internet, 2) Fechar e reabrir o app, 3) Tentar o download novamente. Se o problema persistir, por favor nos contate.',
                'default': 'Obrigado por entrar em contato. Entendo sua consulta e estou aqui para ajudar. Poderia fornecer mais detalhes para que eu possa auxiliá-lo melhor?'
            },
            'en': {
                'premium': 'Hello! To access premium content, make sure you have an active subscription. You can check your subscription status in the "My Account" section of the app. If you need additional help, I\'m here to support you.',
                'download': 'I understand your difficulty with downloads. I recommend: 1) Check your internet connection, 2) Close and reopen the app, 3) Try downloading again. If the problem persists, please contact us.',
                'default': 'Thank you for contacting us. I understand your inquiry and I\'m here to help. Could you provide more details so I can assist you better?'
            }
        };

        const lang = ticket.language || 'es';
        const message = ticket.message.toLowerCase();

        if (message.includes('premium') || message.includes('desafio') || message.includes('challenge')) {
            return responses[lang]['premium'];
        }
        if (message.includes('download') || message.includes('descarga') || message.includes('baixar')) {
            return responses[lang]['download'];
        }

        return responses[lang]['default'];
    }

    async translateResponse() {
        const responseTextarea = document.getElementById('responseTextarea');
        if (!responseTextarea || !responseTextarea.value.trim()) {
            this.showNotification('Digite uma resposta para traduzir', 'warning');
            return;
        }

        const translateBtn = document.getElementById('translateResponse');
        if (translateBtn) {
            translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traduzindo...';
            translateBtn.disabled = true;
        }

        try {
            // Simular tradução
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const targetLanguage = this.currentTicket.language;
            // Aqui implementaria a tradução real
            
            this.showNotification(`Texto traduzido para ${targetLanguage.toUpperCase()}`, 'success');
        } catch (error) {
            this.showNotification('Erro na tradução: ' + error.message, 'error');
        } finally {
            if (translateBtn) {
                translateBtn.innerHTML = '<i class="fas fa-language"></i> Traduzir';
                translateBtn.disabled = false;
            }
        }
    }

    sendResponse() {
        const responseTextarea = document.getElementById('responseTextarea');
        if (!responseTextarea || !responseTextarea.value.trim()) {
            this.showNotification('Digite uma resposta antes de enviar', 'warning');
            return;
        }

        if (!this.currentTicket) return;

        const response = {
            type: 'support',
            message: responseTextarea.value.trim(),
            date: new Date().toISOString()
        };

        // Adicionar resposta ao ticket
        if (!this.currentTicket.responses) {
            this.currentTicket.responses = [];
        }
        this.currentTicket.responses.push(response);
        this.currentTicket.status = 'responded';

        // Atualizar no array principal
        const ticketIndex = this.tickets.findIndex(t => t.id === this.currentTicket.id);
        if (ticketIndex !== -1) {
            this.tickets[ticketIndex] = this.currentTicket;
        }

        this.saveTickets();
        this.updateStats();
        this.renderTickets();
        this.closeResponseEditor();

        this.showNotification('Resposta enviada com sucesso!', 'success');
    }

    addToFAQ() {
        if (!this.currentTicket) return;

        // Aqui implementaria a adição ao FAQ
        this.showNotification('Pergunta adicionada ao FAQ!', 'success');
    }

    markAsResolved(ticketId = null) {
        const id = ticketId || (this.currentTicket ? this.currentTicket.id : null);
        if (!id) return;

        const ticket = this.tickets.find(t => t.id === id);
        if (ticket) {
            ticket.status = 'resolved';
            this.saveTickets();
            this.updateStats();
            this.renderTickets();
            
            if (this.currentTicket && this.currentTicket.id === id) {
                this.closeResponseEditor();
            }

            this.showNotification('Ticket marcado como resolvido!', 'success');
        }
    }

    escalateTicket() {
        if (!this.currentTicket) return;

        this.currentTicket.status = 'escalated';
        
        const ticketIndex = this.tickets.findIndex(t => t.id === this.currentTicket.id);
        if (ticketIndex !== -1) {
            this.tickets[ticketIndex] = this.currentTicket;
        }

        this.saveTickets();
        this.updateStats();
        this.renderTickets();
        this.closeResponseEditor();

        this.showNotification('Ticket encaminhado para supervisão!', 'info');
    }

    viewTicketHistory(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        this.openResponseEditor(ticketId);
    }

    updateStats() {
        this.stats.totalTickets = this.tickets.length;
        this.stats.pendingTickets = this.tickets.filter(t => t.status === 'pending').length;
        this.stats.resolvedTickets = this.tickets.filter(t => t.status === 'resolved').length;
        this.stats.aiResponses = this.tickets.filter(t => 
            t.responses && t.responses.some(r => r.type === 'ai')
        ).length;
        this.stats.manualResponses = this.tickets.filter(t => 
            t.responses && t.responses.some(r => r.type === 'support')
        ).length;

        // Calcular avaliação média
        const ratedTickets = this.tickets.filter(t => t.rating);
        if (ratedTickets.length > 0) {
            this.stats.satisfactionRating = ratedTickets.reduce((sum, t) => sum + t.rating, 0) / ratedTickets.length;
        }

        this.renderStats();
    }

    renderStats() {
        const elements = {
            totalTickets: document.getElementById('totalTickets'),
            aiResponses: document.getElementById('aiResponses'),
            manualResponses: document.getElementById('manualResponses'),
            pendingTickets: document.getElementById('pendingTickets'),
            resolvedTickets: document.getElementById('resolvedTickets'),
            satisfactionRating: document.getElementById('satisfactionRating')
        };

        if (elements.totalTickets) elements.totalTickets.textContent = this.stats.totalTickets;
        if (elements.aiResponses) elements.aiResponses.textContent = this.stats.aiResponses;
        if (elements.manualResponses) elements.manualResponses.textContent = this.stats.manualResponses;
        if (elements.pendingTickets) elements.pendingTickets.textContent = this.stats.pendingTickets;
        if (elements.resolvedTickets) elements.resolvedTickets.textContent = this.stats.resolvedTickets;
        if (elements.satisfactionRating) {
            elements.satisfactionRating.textContent = this.stats.satisfactionRating.toFixed(1) + '/5';
        }
    }

    saveSettings() {
        localStorage.setItem('supportSettings', JSON.stringify(this.settings));
    }

    saveTickets() {
        localStorage.setItem('supportTickets', JSON.stringify(this.tickets));
    }

    showNotification(message, type = 'info') {
        // Usar sistema de notificação existente ou criar um simples
        if (typeof showNotification === 'function') {
            showNotification(message, type);
            return;
        }

        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize Support Manager
let supportManager;

document.addEventListener('DOMContentLoaded', function() {
    // Hook into tab switching system
    const originalSwitchTab = window.switchTab;
    if (originalSwitchTab) {
        window.switchTab = function(tabId) {
            originalSwitchTab(tabId);
            
            if (tabId === 'support' && !supportManager) {
                setTimeout(() => {
                    supportManager = new SupportManager();
                }, 100);
            }
        };
    }
    
    // Initialize if already on support tab
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'support') {
        setTimeout(() => {
            if (!supportManager) {
                supportManager = new SupportManager();
            }
        }, 100);
    }
});