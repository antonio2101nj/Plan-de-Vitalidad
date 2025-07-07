/**
 * Sistema de Personalização do App - Integrado com Admin Dashboard
 */

class AppCustomization {
    constructor() {
        this.settings = {
            appName: 'Plan de Vitalidad',
            logo: null,
            icon: null,
            splash: null,
            primaryColor: '#10B981',
            secondaryColor: '#6B7280',
            backgroundColor: '#F9FAFB',
            titleColor: '#1F2937',
            fontFamily: 'Inter',
            buttonStyle: 'rounded',
            enableAnimations: true,
            homeLayout: 'cards',
            primaryLanguage: 'es'
        };
        
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) {
            console.log('✅ App Customization já foi inicializado');
            return;
        }
        
        console.log('🔧 Inicializando App Customization...');
        
        // Verificar se a aba existe
        const customizationTab = document.getElementById('app-customization');
        if (!customizationTab) {
            console.error('❌ Aba de personalização não encontrada');
            return;
        }
        
        console.log('📋 Aba encontrada, verificando elementos...');
        
        // Verificar elementos principais
        const appNameInput = document.getElementById('appName');
        const saveBtn = document.getElementById('saveCustomizationBtn');
        const previewScreen = document.getElementById('previewScreen');
        
        console.log('🔍 Elementos encontrados:', {
            appNameInput: !!appNameInput,
            saveBtn: !!saveBtn,
            previewScreen: !!previewScreen
        });
        
        this.loadSettings();
        this.setupEventListeners();
        this.updatePreview();
        this.updateOverviewStats();
        this.isInitialized = true;
        
        console.log('✅ App Customization inicializado com sucesso!');
        
        // Mostrar notificação de sucesso
        this.showNotification('Sistema de personalização carregado!', 'success');
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('appCustomizationSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.populateFormFields();
        }
    }

    populateFormFields() {
        // App Name
        const appNameInput = document.getElementById('appName');
        if (appNameInput) {
            appNameInput.value = this.settings.appName;
        }

        // Colors
        this.updateColorInputs('primaryColor', this.settings.primaryColor);
        this.updateColorInputs('secondaryColor', this.settings.secondaryColor);
        this.updateColorInputs('backgroundColor', this.settings.backgroundColor);
        this.updateColorInputs('titleColor', this.settings.titleColor);

        // Font Family
        const fontSelect = document.getElementById('fontFamily');
        if (fontSelect) {
            fontSelect.value = this.settings.fontFamily;
            this.updateFontPreview();
        }

        // Button Style
        this.updateButtonStyleSelection(this.settings.buttonStyle);

        // Animations
        const animationsCheckbox = document.getElementById('enableAnimations');
        if (animationsCheckbox) {
            animationsCheckbox.checked = this.settings.enableAnimations;
        }

        // Home Layout
        this.updateLayoutSelection(this.settings.homeLayout);

        // Primary Language
        this.updateLanguageSelection(this.settings.primaryLanguage);
    }

    updateColorInputs(colorType, value) {
        const colorInput = document.getElementById(colorType);
        const textInput = document.getElementById(colorType + 'Text');
        
        if (colorInput) colorInput.value = value;
        if (textInput) textInput.value = value;
    }

    setupEventListeners() {
        // App Name
        const appNameInput = document.getElementById('appName');
        if (appNameInput) {
            appNameInput.addEventListener('input', (e) => {
                this.settings.appName = e.target.value;
                this.updatePreview();
            });
        }

        // File Uploads
        this.setupFileUpload('logo', 'logoFile', 'logoUpload', 'logoPreview', 'logoImg', 'removeLogo');
        this.setupFileUpload('icon', 'iconFile', 'iconUpload', 'iconPreview', 'iconImg', 'removeIcon');
        this.setupFileUpload('splash', 'splashFile', 'splashUpload', 'splashPreview', 'splashImg', 'removeSplash');

        // Color Inputs
        this.setupColorInput('primaryColor');
        this.setupColorInput('secondaryColor');
        this.setupColorInput('backgroundColor');
        this.setupColorInput('titleColor');

        // Reset Colors Button
        const resetColorsBtn = document.getElementById('resetColorsBtn');
        if (resetColorsBtn) {
            resetColorsBtn.addEventListener('click', () => {
                this.resetColors();
            });
        }

        // Font Family
        const fontSelect = document.getElementById('fontFamily');
        if (fontSelect) {
            fontSelect.addEventListener('change', (e) => {
                this.settings.fontFamily = e.target.value;
                this.updateFontPreview();
                this.updatePreview();
            });
        }

        // Button Style
        this.setupButtonStyleSelector();

        // Animations Toggle
        const animationsCheckbox = document.getElementById('enableAnimations');
        if (animationsCheckbox) {
            animationsCheckbox.addEventListener('change', (e) => {
                this.settings.enableAnimations = e.target.checked;
                this.updatePreview();
            });
        }

        // Layout Selection
        this.setupLayoutSelector();

        // Language Selection
        this.setupLanguageSelector();

        // Preview Device Toggle
        this.setupPreviewDeviceToggle();

        // Save Button
        const saveBtn = document.getElementById('saveCustomizationBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }

    setupFileUpload(type, fileInputId, uploadAreaId, previewId, imgId, removeId) {
        const fileInput = document.getElementById(fileInputId);
        const uploadArea = document.getElementById(uploadAreaId);
        const preview = document.getElementById(previewId);
        const img = document.getElementById(imgId);
        const removeBtn = document.getElementById(removeId);

        if (!fileInput || !uploadArea) return;

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file, type, preview, img);
            }
        });

        // Drag and drop
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
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileUpload(file, type, preview, img);
            }
        });

        // Remove file
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFile(type, fileInputId, previewId);
            });
        }
    }

    handleFileUpload(file, type, preview, img) {
        // Validate file type
        const validTypes = {
            logo: ['image/png'],
            icon: ['image/png', 'image/jpeg', 'image/jpg'],
            splash: ['image/png', 'image/jpeg', 'image/jpg']
        };

        if (!validTypes[type].includes(file.type)) {
            this.showNotification('Tipo de arquivo inválido!', 'error');
            return;
        }

        // Validate file size
        const maxSizes = {
            logo: 2 * 1024 * 1024, // 2MB
            icon: 2 * 1024 * 1024, // 2MB
            splash: 3 * 1024 * 1024 // 3MB
        };

        if (file.size > maxSizes[type]) {
            this.showNotification('Arquivo muito grande!', 'error');
            return;
        }

        // Read file and create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            this.settings[type] = dataUrl;
            
            if (img) {
                img.src = dataUrl;
            }
            
            if (preview) {
                preview.style.display = 'block';
                preview.parentElement.querySelector('.upload-placeholder').style.display = 'none';
            }

            this.updatePreview();
        };

        reader.readAsDataURL(file);
    }

    removeFile(type, fileInputId, previewId) {
        this.settings[type] = null;
        
        const fileInput = document.getElementById(fileInputId);
        const preview = document.getElementById(previewId);
        
        if (fileInput) {
            fileInput.value = '';
        }
        
        if (preview) {
            preview.style.display = 'none';
            preview.parentElement.querySelector('.upload-placeholder').style.display = 'block';
        }

        this.updatePreview();
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
            });
        }

        if (textInput) {
            textInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (this.isValidColor(value)) {
                    this.settings[colorType] = value;
                    if (colorInput) colorInput.value = value;
                    this.updatePreview();
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
        const defaultColors = {
            primaryColor: '#10B981',
            secondaryColor: '#6B7280',
            backgroundColor: '#F9FAFB',
            titleColor: '#1F2937'
        };

        Object.keys(defaultColors).forEach(colorType => {
            this.settings[colorType] = defaultColors[colorType];
            this.updateColorInputs(colorType, defaultColors[colorType]);
        });

        this.updatePreview();
        this.showNotification('Cores restauradas para o padrão!', 'success');
    }

    updateFontPreview() {
        const fontPreview = document.getElementById('fontPreview');
        if (fontPreview) {
            fontPreview.style.setProperty('--preview-font', this.settings.fontFamily);
        }
    }

    setupButtonStyleSelector() {
        const buttonOptions = document.querySelectorAll('.button-option');
        buttonOptions.forEach(option => {
            option.addEventListener('click', () => {
                const style = option.dataset.style;
                this.settings.buttonStyle = style;
                this.updateButtonStyleSelection(style);
                this.updatePreview();
            });
        });
    }

    updateButtonStyleSelection(style) {
        const buttonOptions = document.querySelectorAll('.button-option');
        buttonOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.style === style);
        });
    }

    setupLayoutSelector() {
        const layoutOptions = document.querySelectorAll('.layout-option');
        layoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                const layout = option.dataset.layout;
                this.settings.homeLayout = layout;
                this.updateLayoutSelection(layout);
                this.updatePreview();
            });
        });
    }

    updateLayoutSelection(layout) {
        const layoutOptions = document.querySelectorAll('.layout-option');
        layoutOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.layout === layout);
        });
    }

    setupLanguageSelector() {
        const languageOptions = document.querySelectorAll('.language-option-custom');
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.settings.primaryLanguage = lang;
                this.updateLanguageSelection(lang);
                this.updatePreview();
            });
        });
    }

    updateLanguageSelection(lang) {
        const languageOptions = document.querySelectorAll('.language-option-custom');
        languageOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }

    setupPreviewDeviceToggle() {
        const deviceButtons = document.querySelectorAll('.preview-device');
        deviceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const device = button.dataset.device;
                this.updatePreviewDevice(device);
            });
        });
    }

    updatePreviewDevice(device) {
        const deviceButtons = document.querySelectorAll('.preview-device');
        const previewFrame = document.getElementById('previewFrame');

        deviceButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.device === device);
        });

        if (previewFrame) {
            previewFrame.className = `preview-device-frame ${device}`;
        }
    }

    updatePreview() {
        const previewScreen = document.getElementById('previewScreen');
        const previewAppName = document.getElementById('previewAppName');
        const previewLogo = document.getElementById('previewLogo');
        const previewLayouts = document.querySelectorAll('.preview-layout');

        if (!previewScreen) return;

        // Update CSS variables for preview
        previewScreen.style.setProperty('--preview-primary-color', this.settings.primaryColor);
        previewScreen.style.setProperty('--preview-secondary-color', this.settings.secondaryColor);
        previewScreen.style.setProperty('--preview-background-color', this.settings.backgroundColor);
        previewScreen.style.setProperty('--preview-title-color', this.settings.titleColor);
        previewScreen.style.setProperty('--preview-font', this.settings.fontFamily);

        // Update app name
        if (previewAppName) {
            previewAppName.textContent = this.settings.appName;
        }

        // Update logo
        if (previewLogo && this.settings.logo) {
            previewLogo.src = this.settings.logo;
        }

        // Update layout
        previewLayouts.forEach(layout => {
            layout.classList.toggle('active', layout.id === `preview${this.settings.homeLayout.charAt(0).toUpperCase() + this.settings.homeLayout.slice(1)}`);
        });

        // Update animations
        if (this.settings.enableAnimations) {
            previewScreen.style.setProperty('--preview-transition', 'all 0.3s ease');
        } else {
            previewScreen.style.setProperty('--preview-transition', 'none');
        }
    }

    updateOverviewStats() {
        // Theme Status
        const themeStatus = document.getElementById('customThemeStatus');
        if (themeStatus) {
            const isCustom = this.settings.primaryColor !== '#10B981' || 
                           this.settings.fontFamily !== 'Inter' || 
                           this.settings.homeLayout !== 'cards';
            themeStatus.textContent = isCustom ? 'Personalizado' : 'Tema Padrão';
        }

        // Layout Model
        const layoutStatus = document.getElementById('layoutModelStatus');
        if (layoutStatus) {
            const layoutNames = {
                cards: 'Cards',
                list: 'Lista',
                grid: 'Grade'
            };
            layoutStatus.textContent = layoutNames[this.settings.homeLayout] || 'Cards';
        }

        // Primary Language
        const languageStatus = document.getElementById('primaryLanguageStatus');
        if (languageStatus) {
            const languageNames = {
                es: 'Español',
                pt: 'Português',
                en: 'English'
            };
            languageStatus.textContent = languageNames[this.settings.primaryLanguage] || 'Español';
        }

        // Last Saved
        const lastSavedStatus = document.getElementById('lastSavedStatus');
        if (lastSavedStatus) {
            const lastSaved = localStorage.getItem('appCustomizationLastSaved');
            if (lastSaved) {
                const date = new Date(lastSaved);
                lastSavedStatus.textContent = date.toLocaleDateString('pt-BR');
            } else {
                lastSavedStatus.textContent = 'Não Salvo';
            }
        }
    }

    saveSettings() {
        localStorage.setItem('appCustomizationSettings', JSON.stringify(this.settings));
        localStorage.setItem('appCustomizationLastSaved', new Date().toISOString());
        this.updateOverviewStats();
        this.showNotification('Personalização salva com sucesso!', 'success');
    }

    showNotification(message, type = 'success') {
        // Use the existing notification system if available
        if (typeof showNotification === 'function') {
            showNotification(message, type);
            return;
        }

        // Fallback notification system
        const existingNotification = document.querySelector('.customization-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `customization-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Create global instance
window.appCustomization = new AppCustomization();

// Initialize when switching to customization tab
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App Customization: DOM loaded, setting up...');
    
    // Force initialization after a delay to ensure all elements are ready
    setTimeout(() => {
        console.log('🔧 App Customization: Attempting initialization...');
        if (window.appCustomization) {
            window.appCustomization.init();
        }
    }, 1000);
    
    // Hook into the existing tab switching system
    const originalSwitchTab = window.switchTab;
    if (originalSwitchTab) {
        window.switchTab = function(tabId) {
            console.log('🔄 Switching to tab:', tabId);
            originalSwitchTab(tabId);
            
            // Initialize customization when switching to app-customization tab
            if (tabId === 'app-customization' && window.appCustomization) {
                console.log('🎨 Initializing App Customization...');
                setTimeout(() => {
                    window.appCustomization.init();
                }, 200);
            }
        };
    } else {
        console.log('⚠️ switchTab function not found, setting up manual tab listener');
        
        // Manual tab switching if switchTab is not available
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            if (item.dataset.tab === 'app-customization') {
                item.addEventListener('click', () => {
                    console.log('🎨 Manual tab click: Initializing App Customization...');
                    setTimeout(() => {
                        if (window.appCustomization) {
                            window.appCustomization.init();
                        }
                    }, 200);
                });
            }
        });
    }
    
    // Also initialize if we're already on the customization tab
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'app-customization') {
        console.log('🎨 Already on customization tab, initializing...');
        setTimeout(() => {
            if (window.appCustomization) {
                window.appCustomization.init();
            }
        }, 500);
    }
});