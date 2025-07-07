/**
 * Sistema Simplificado de Personalização do App
 */

class SimpleCustomizationManager {
    constructor() {
        this.settings = {
            appName: 'Plan de Vitalidad',
            primaryColor: '#10B981',
            secondaryColor: '#6B7280',
            backgroundColor: '#F9FAFB',
            titleColor: '#1F2937'
        };
        
        this.init();
    }

    init() {
        console.log('Inicializando Simple Customization Manager...');
        this.loadSettings();
        this.setupEventListeners();
        this.updatePreview();
        this.updateStats();
        console.log('Simple Customization Manager inicializado com sucesso!');
    }

    loadSettings() {
        const saved = localStorage.getItem('simpleCustomizationSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.populateFields();
        }
    }

    populateFields() {
        // App Name
        const appNameInput = document.getElementById('appName');
        if (appNameInput) {
            appNameInput.value = this.settings.appName;
        }

        // Colors
        this.updateColorInput('primaryColor', this.settings.primaryColor);
        this.updateColorInput('secondaryColor', this.settings.secondaryColor);
    }

    updateColorInput(colorType, value) {
        const colorInput = document.getElementById(colorType);
        const textInput = document.getElementById(colorType + 'Text');
        
        if (colorInput) colorInput.value = value;
        if (textInput) textInput.value = value;
    }

    setupEventListeners() {
        console.log('Configurando event listeners...');

        // App Name
        const appNameInput = document.getElementById('appName');
        if (appNameInput) {
            appNameInput.addEventListener('input', (e) => {
                this.settings.appName = e.target.value;
                this.updatePreview();
                console.log('App name changed:', e.target.value);
            });
        }

        // Color inputs
        this.setupColorInput('primaryColor');
        this.setupColorInput('secondaryColor');

        // Reset button
        const resetBtn = document.getElementById('resetColorsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetColors();
            });
        }

        // Save button
        const saveBtn = document.getElementById('saveCustomizationBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        console.log('Event listeners configurados!');
    }

    setupColorInput(colorType) {
        const colorInput = document.getElementById(colorType);
        const textInput = document.getElementById(colorType + 'Text');

        if (colorInput) {
            colorInput.addEventListener('input', (e) => {
                const value = e.target.value;
                this.settings[colorType] = value;
                if (textInput) textInput.value = value;
                this.updatePreview();
                console.log(`${colorType} changed:`, value);
            });
        }

        if (textInput) {
            textInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (this.isValidColor(value)) {
                    this.settings[colorType] = value;
                    if (colorInput) colorInput.value = value;
                    this.updatePreview();
                    console.log(`${colorType} text changed:`, value);
                }
            });
        }
    }

    isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    resetColors() {
        console.log('Resetando cores...');
        
        this.settings.primaryColor = '#10B981';
        this.settings.secondaryColor = '#6B7280';
        
        this.updateColorInput('primaryColor', this.settings.primaryColor);
        this.updateColorInput('secondaryColor', this.settings.secondaryColor);
        
        this.updatePreview();
        this.showNotification('Cores restauradas!', 'success');
    }

    updatePreview() {
        const previewScreen = document.getElementById('previewScreen');
        const previewAppName = document.getElementById('previewAppName');

        if (previewScreen) {
            previewScreen.style.setProperty('--preview-primary-color', this.settings.primaryColor);
            previewScreen.style.setProperty('--preview-secondary-color', this.settings.secondaryColor);
        }

        if (previewAppName) {
            previewAppName.textContent = this.settings.appName;
        }

        console.log('Preview atualizado:', this.settings);
    }

    updateStats() {
        const themeStatus = document.getElementById('customThemeStatus');
        if (themeStatus) {
            const isCustom = this.settings.primaryColor !== '#10B981';
            themeStatus.textContent = isCustom ? 'Personalizado' : 'Tema Padrão';
        }
    }

    saveSettings() {
        localStorage.setItem('simpleCustomizationSettings', JSON.stringify(this.settings));
        localStorage.setItem('simpleCustomizationLastSaved', new Date().toISOString());
        
        this.updateStats();
        this.showNotification('Personalização salva com sucesso!', 'success');
        
        console.log('Configurações salvas:', this.settings);
    }

    showNotification(message, type = 'success') {
        console.log(`Notification: ${message} (${type})`);
        
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, verificando elementos...');
    
    if (document.querySelector('.customization-container')) {
        console.log('Container de personalização encontrado, inicializando...');
        
        try {
            window.simpleCustomizationManager = new SimpleCustomizationManager();
        } catch (error) {
            console.error('Erro ao inicializar:', error);
        }
    } else {
        console.log('Container de personalização não encontrado');
    }
});

// Export for global use
window.SimpleCustomizationManager = SimpleCustomizationManager;