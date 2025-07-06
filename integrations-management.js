/**
 * Integrations Management System
 * Sistema completo de integrações e APIs
 */

class IntegrationsManager {
    constructor() {
        this.integrations = {
            openai: { enabled: false, status: 'disconnected', config: {} },
            kiwify: { enabled: false, status: 'disconnected', config: {} },
            zapier: { enabled: false, status: 'inactive', config: {} },
            firebase: { enabled: false, status: 'disconnected', config: {} },
            custom: { enabled: false, status: 'disconnected', config: {} }
        };
        
        this.init();
    }

    init() {
        this.loadIntegrationsData();
        this.setupEventListeners();
        this.updateOverviewStats();
        this.setupTooltips();
    }

    loadIntegrationsData() {
        // Load saved configurations from localStorage or API
        const saved = localStorage.getItem('planVitalidadIntegrations');
        if (saved) {
            try {
                this.integrations = { ...this.integrations, ...JSON.parse(saved) };
                this.updateUIFromData();
            } catch (error) {
                console.error('Error loading integrations data:', error);
            }
        }
    }

    setupEventListeners() {
        // Toggle switches
        document.getElementById('openaiToggle').addEventListener('change', (e) => this.toggleIntegration('openai', e.target.checked));
        document.getElementById('kiwifyToggle').addEventListener('change', (e) => this.toggleIntegration('kiwify', e.target.checked));
        document.getElementById('zapierToggle').addEventListener('change', (e) => this.toggleIntegration('zapier', e.target.checked));
        document.getElementById('firebaseToggle').addEventListener('change', (e) => this.toggleIntegration('firebase', e.target.checked));
        document.getElementById('customToggle').addEventListener('change', (e) => this.toggleIntegration('custom', e.target.checked));

        // Form submissions
        document.getElementById('openaiForm').addEventListener('submit', (e) => this.handleOpenAISubmit(e));
        document.getElementById('kiwifyForm').addEventListener('submit', (e) => this.handleKiwifySubmit(e));
        document.getElementById('zapierForm').addEventListener('submit', (e) => this.handleZapierSubmit(e));
        document.getElementById('firebaseForm').addEventListener('submit', (e) => this.handleFirebaseSubmit(e));
        document.getElementById('customForm').addEventListener('submit', (e) => this.handleCustomSubmit(e));

        // Test buttons
        document.getElementById('testOpenaiBtn').addEventListener('click', () => this.testOpenAI());
        document.getElementById('testKiwifyBtn').addEventListener('click', () => this.testKiwify());
        document.getElementById('testZapierBtn').addEventListener('click', () => this.testZapier());
        document.getElementById('testFirebaseBtn').addEventListener('click', () => this.testFirebase());
        document.getElementById('testCustomBtn').addEventListener('click', () => this.testCustom());

        // Export/Import
        document.getElementById('exportIntegrationsBtn').addEventListener('click', () => this.exportIntegrations());
        document.getElementById('importIntegrationsBtn').addEventListener('click', () => this.importIntegrations());
        document.getElementById('importIntegrationsFile').addEventListener('change', (e) => this.handleImportFile(e));
    }

    setupTooltips() {
        // Add tooltip functionality
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            const trigger = tooltip.querySelector('i');
            const text = tooltip.querySelector('.tooltip-text');
            
            trigger.addEventListener('mouseenter', () => {
                text.style.visibility = 'visible';
                text.style.opacity = '1';
            });
            
            trigger.addEventListener('mouseleave', () => {
                text.style.visibility = 'hidden';
                text.style.opacity = '0';
            });
        });
    }

    toggleIntegration(integration, enabled) {
        this.integrations[integration].enabled = enabled;
        
        if (!enabled) {
            this.integrations[integration].status = 'disconnected';
            this.updateIntegrationStatus(integration, 'disconnected');
        }
        
        this.saveIntegrationsData();
        this.updateOverviewStats();
    }

    updateIntegrationStatus(integration, status) {
        const statusElement = document.getElementById(`${integration}Status`);
        const statusClasses = ['connected', 'disconnected', 'error', 'inactive'];
        
        statusClasses.forEach(cls => statusElement.classList.remove(cls));
        statusElement.classList.add(status);
        
        const statusTexts = {
            connected: 'Conectado',
            disconnected: 'Desconectado',
            error: 'Erro',
            inactive: 'Inativo'
        };
        
        statusElement.textContent = statusTexts[status] || status;
        this.integrations[integration].status = status;
    }

    // OpenAI Integration
    async handleOpenAISubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const config = {
            apiKey: formData.get('apiKey'),
            temperature: formData.get('temperature'),
            tone: formData.get('tone'),
            language: formData.get('language')
        };
        
        this.integrations.openai.config = config;
        this.saveIntegrationsData();
        
        if (config.apiKey) {
            this.updateIntegrationStatus('openai', 'connected');
            this.addLog('openai', 'Configuração salva com sucesso');
            this.showNotification('Configuração OpenAI salva com sucesso!', 'success');
        } else {
            this.updateIntegrationStatus('openai', 'disconnected');
        }
        
        this.updateOverviewStats();
    }

    async testOpenAI() {
        const config = this.integrations.openai.config;
        
        if (!config.apiKey) {
            this.showNotification('Configure a chave da API primeiro', 'error');
            return;
        }
        
        this.showNotification('Testando conexão com OpenAI...', 'info');
        
        // Simulate API test
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            
            if (success) {
                this.updateIntegrationStatus('openai', 'connected');
                this.addLog('openai', 'Teste de conexão bem-sucedido');
                this.showNotification('Conexão com OpenAI testada com sucesso!', 'success');
            } else {
                this.updateIntegrationStatus('openai', 'error');
                this.addLog('openai', 'Falha no teste de conexão - Verifique a chave da API');
                this.showNotification('Falha na conexão com OpenAI. Verifique a chave da API.', 'error');
            }
            
            this.updateOverviewStats();
        }, 2000);
    }

    // Kiwify Integration
    async handleKiwifySubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const config = {
            apiKey: formData.get('apiKey'),
            salesWebhook: formData.get('salesWebhook'),
            refundWebhook: formData.get('refundWebhook'),
            securityToken: formData.get('securityToken')
        };
        
        this.integrations.kiwify.config = config;
        this.saveIntegrationsData();
        
        if (config.apiKey) {
            this.updateIntegrationStatus('kiwify', 'connected');
            this.updateKiwifyLogs('connected');
            this.showNotification('Configuração Kiwify salva com sucesso!', 'success');
        } else {
            this.updateIntegrationStatus('kiwify', 'disconnected');
        }
        
        this.updateOverviewStats();
    }

    async testKiwify() {
        const config = this.integrations.kiwify.config;
        
        if (!config.apiKey) {
            this.showNotification('Configure a chave da API primeiro', 'error');
            return;
        }
        
        this.showNotification('Testando webhook Kiwify...', 'info');
        
        // Simulate webhook test
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success rate
            
            if (success) {
                this.updateIntegrationStatus('kiwify', 'connected');
                this.updateKiwifyLogs('success');
                this.showNotification('Webhook Kiwify testado com sucesso!', 'success');
            } else {
                this.updateIntegrationStatus('kiwify', 'error');
                this.updateKiwifyLogs('error');
                this.showNotification('Falha no teste do webhook Kiwify.', 'error');
            }
            
            this.updateOverviewStats();
        }, 1500);
    }

    updateKiwifyLogs(type) {
        const logsContent = document.querySelector('#kiwifyLogs .logs-content');
        const now = new Date().toLocaleString('pt-BR');
        
        if (type === 'connected') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Última venda:</span>
                    <span class="log-value">Aguardando...</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Último erro:</span>
                    <span class="log-value">Nenhum</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status da API:</span>
                    <span class="log-value">Conectado</span>
                </div>
            `;
        } else if (type === 'success') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Última venda:</span>
                    <span class="log-value">Teste - ${now}</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Último erro:</span>
                    <span class="log-value">Nenhum</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status da API:</span>
                    <span class="log-value">Funcionando</span>
                </div>
            `;
        } else if (type === 'error') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Última venda:</span>
                    <span class="log-value">Nenhuma</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Último erro:</span>
                    <span class="log-value">Falha webhook - ${now}</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status da API:</span>
                    <span class="log-value">Erro</span>
                </div>
            `;
        }
    }

    // Zapier Integration
    async handleZapierSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const config = {
            incomingWebhook: formData.get('incomingWebhook'),
            outgoingWebhook: formData.get('outgoingWebhook'),
            secret: formData.get('secret')
        };
        
        this.integrations.zapier.config = config;
        this.saveIntegrationsData();
        
        if (config.incomingWebhook || config.outgoingWebhook) {
            this.updateIntegrationStatus('zapier', 'inactive');
            this.updateZapierLogs('configured');
            this.showNotification('Configuração Zapier salva com sucesso!', 'success');
        } else {
            this.updateIntegrationStatus('zapier', 'inactive');
        }
        
        this.updateOverviewStats();
    }

    async testZapier() {
        const config = this.integrations.zapier.config;
        
        if (!config.incomingWebhook && !config.outgoingWebhook) {
            this.showNotification('Configure pelo menos um webhook primeiro', 'error');
            return;
        }
        
        this.showNotification('Ativando automações Zapier...', 'info');
        
        // Simulate activation
        setTimeout(() => {
            this.updateIntegrationStatus('zapier', 'connected');
            this.updateZapierLogs('active');
            this.showNotification('Automações Zapier ativadas com sucesso!', 'success');
            this.updateOverviewStats();
        }, 1000);
    }

    updateZapierLogs(type) {
        const logsContent = document.querySelector('#zapierLogs .logs-content');
        const now = new Date().toLocaleString('pt-BR');
        
        if (type === 'configured') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Status:</span>
                    <span class="log-value">Configurado</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Último disparo:</span>
                    <span class="log-value">Nenhum</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Automações ativas:</span>
                    <span class="log-value">0</span>
                </div>
            `;
        } else if (type === 'active') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Status:</span>
                    <span class="log-value">Ativo</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Último disparo:</span>
                    <span class="log-value">${now}</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Automações ativas:</span>
                    <span class="log-value">3</span>
                </div>
            `;
        }
    }

    // Firebase Integration
    async handleFirebaseSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const config = {
            apiKey: formData.get('apiKey'),
            authDomain: formData.get('authDomain'),
            projectId: formData.get('projectId'),
            messagingSenderId: formData.get('messagingSenderId'),
            appId: formData.get('appId'),
            databaseUrl: formData.get('databaseUrl')
        };
        
        this.integrations.firebase.config = config;
        this.saveIntegrationsData();
        
        if (config.apiKey && config.authDomain && config.projectId && config.appId) {
            this.updateIntegrationStatus('firebase', 'connected');
            this.updateFirebaseLogs('connected');
            this.showNotification('Configuração Firebase salva com sucesso!', 'success');
        } else {
            this.updateIntegrationStatus('firebase', 'disconnected');
        }
        
        this.updateOverviewStats();
    }

    async testFirebase() {
        const config = this.integrations.firebase.config;
        
        if (!config.apiKey || !config.projectId) {
            this.showNotification('Configure os campos obrigatórios primeiro', 'error');
            return;
        }
        
        this.showNotification('Testando conexão Firebase...', 'info');
        
        // Simulate Firebase connection test
        setTimeout(() => {
            const success = Math.random() > 0.25; // 75% success rate
            
            if (success) {
                this.updateIntegrationStatus('firebase', 'connected');
                this.updateFirebaseLogs('success');
                this.showNotification('Conexão Firebase testada com sucesso!', 'success');
            } else {
                this.updateIntegrationStatus('firebase', 'error');
                this.updateFirebaseLogs('error');
                this.showNotification('Falha na conexão Firebase. Verifique as configurações.', 'error');
            }
            
            this.updateOverviewStats();
        }, 2500);
    }

    updateFirebaseLogs(type) {
        const logsContent = document.querySelector('#firebaseLogs .logs-content');
        
        if (type === 'connected' || type === 'success') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Autenticação:</span>
                    <span class="log-value">Conectado</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Firestore:</span>
                    <span class="log-value">Conectado</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Realtime DB:</span>
                    <span class="log-value">${this.integrations.firebase.config.databaseUrl ? 'Conectado' : 'Não configurado'}</span>
                </div>
            `;
        } else if (type === 'error') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Autenticação:</span>
                    <span class="log-value">Erro</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Firestore:</span>
                    <span class="log-value">Erro</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Realtime DB:</span>
                    <span class="log-value">Erro</span>
                </div>
            `;
        }
    }

    // Custom Integration
    async handleCustomSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const config = {
            name: formData.get('name'),
            apiKey: formData.get('apiKey'),
            endpoint: formData.get('endpoint'),
            webhook: formData.get('webhook')
        };
        
        this.integrations.custom.config = config;
        this.saveIntegrationsData();
        
        if (config.name && (config.apiKey || config.endpoint || config.webhook)) {
            this.updateIntegrationStatus('custom', 'connected');
            this.updateCustomLogs('configured');
            this.showNotification('Integração personalizada salva com sucesso!', 'success');
        } else {
            this.updateIntegrationStatus('custom', 'disconnected');
        }
        
        this.updateOverviewStats();
    }

    async testCustom() {
        const config = this.integrations.custom.config;
        
        if (!config.name) {
            this.showNotification('Configure a integração primeiro', 'error');
            return;
        }
        
        this.showNotification(`Testando integração ${config.name}...`, 'info');
        
        // Simulate custom integration test
        setTimeout(() => {
            const success = Math.random() > 0.4; // 60% success rate
            
            if (success) {
                this.updateIntegrationStatus('custom', 'connected');
                this.updateCustomLogs('success');
                this.showNotification(`Integração ${config.name} testada com sucesso!`, 'success');
            } else {
                this.updateIntegrationStatus('custom', 'error');
                this.updateCustomLogs('error');
                this.showNotification(`Falha no teste da integração ${config.name}.`, 'error');
            }
            
            this.updateOverviewStats();
        }, 1500);
    }

    updateCustomLogs(type) {
        const logsContent = document.querySelector('#customLogs .logs-content');
        const now = new Date().toLocaleString('pt-BR');
        
        if (type === 'configured') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Último retorno:</span>
                    <span class="log-value">Configurado</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status de falha:</span>
                    <span class="log-value">Nenhum</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status OK:</span>
                    <span class="log-value">Aguardando teste</span>
                </div>
            `;
        } else if (type === 'success') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Último retorno:</span>
                    <span class="log-value">200 OK - ${now}</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status de falha:</span>
                    <span class="log-value">Nenhum</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status OK:</span>
                    <span class="log-value">Funcionando</span>
                </div>
            `;
        } else if (type === 'error') {
            logsContent.innerHTML = `
                <div class="log-item">
                    <span class="log-label">Último retorno:</span>
                    <span class="log-value">Erro - ${now}</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status de falha:</span>
                    <span class="log-value">Falha de conexão</span>
                </div>
                <div class="log-item">
                    <span class="log-label">Status OK:</span>
                    <span class="log-value">Erro</span>
                </div>
            `;
        }
    }

    addLog(integration, message) {
        const logsContent = document.querySelector(`#${integration}Logs .logs-content`);
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-message">${message}</span>
        `;
        
        logsContent.insertBefore(logItem, logsContent.firstChild);
        
        // Keep only last 5 logs
        const logs = logsContent.querySelectorAll('.log-item');
        if (logs.length > 5) {
            logsContent.removeChild(logs[logs.length - 1]);
        }
    }

    updateOverviewStats() {
        const active = Object.values(this.integrations).filter(i => i.enabled).length;
        const working = Object.values(this.integrations).filter(i => i.enabled && i.status === 'connected').length;
        const failed = Object.values(this.integrations).filter(i => i.enabled && i.status === 'error').length;
        
        document.getElementById('activeIntegrations').textContent = active;
        document.getElementById('workingIntegrations').textContent = working;
        document.getElementById('failedIntegrations').textContent = failed;
        document.getElementById('lastSync').textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Show alerts if there are failed integrations
        if (failed > 0) {
            this.showIntegrationAlert();
        }
    }

    showIntegrationAlert() {
        const alertsSection = document.getElementById('integrationAlerts');
        const alertMessage = document.getElementById('integrationAlertMessage');
        
        const failedIntegrations = Object.entries(this.integrations)
            .filter(([name, config]) => config.enabled && config.status === 'error')
            .map(([name]) => name);
        
        if (failedIntegrations.length > 0) {
            const integrationNames = {
                openai: 'OpenAI',
                kiwify: 'Kiwify',
                zapier: 'Zapier',
                firebase: 'Firebase',
                custom: 'Integração Personalizada'
            };
            
            const failedNames = failedIntegrations.map(name => integrationNames[name]).join(', ');
            alertMessage.textContent = `Falha nas integrações: ${failedNames}. Verifique as credenciais.`;
            alertsSection.style.display = 'block';
        }
    }

    reconnectIntegration(integration) {
        this.updateIntegrationStatus(integration, 'disconnected');
        document.getElementById('integrationAlerts').style.display = 'none';
        this.showNotification(`Reconectando ${integration}...`, 'info');
        
        // Simulate reconnection
        setTimeout(() => {
            this.updateIntegrationStatus(integration, 'connected');
            this.updateOverviewStats();
            this.showNotification(`${integration} reconectado com sucesso!`, 'success');
        }, 2000);
    }

    exportIntegrations() {
        const exportData = {
            integrations: this.integrations,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `plan-vitalidad-integrations-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Configurações de integração exportadas!', 'success');
    }

    importIntegrations() {
        document.getElementById('importIntegrationsFile').click();
    }

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (importData.integrations) {
                    this.integrations = { ...this.integrations, ...importData.integrations };
                    this.saveIntegrationsData();
                    this.updateUIFromData();
                    this.updateOverviewStats();
                    this.showNotification('Configurações importadas com sucesso!', 'success');
                } else {
                    this.showNotification('Arquivo de importação inválido.', 'error');
                }
            } catch (error) {
                this.showNotification('Erro ao importar configurações.', 'error');
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }

    updateUIFromData() {
        Object.entries(this.integrations).forEach(([name, config]) => {
            // Update toggle switches
            const toggle = document.getElementById(`${name}Toggle`);
            if (toggle) {
                toggle.checked = config.enabled;
            }
            
            // Update status
            this.updateIntegrationStatus(name, config.status);
            
            // Update form fields
            Object.entries(config.config || {}).forEach(([field, value]) => {
                const input = document.getElementById(`${name}${field.charAt(0).toUpperCase() + field.slice(1)}`);
                if (input && value) {
                    input.value = value;
                }
            });
        });
    }

    saveIntegrationsData() {
        try {
            localStorage.setItem('planVitalidadIntegrations', JSON.stringify(this.integrations));
        } catch (error) {
            console.error('Error saving integrations data:', error);
        }
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('openaiForm')) {
            window.integrationsManager = new IntegrationsManager();
        }
    }, 100);
});