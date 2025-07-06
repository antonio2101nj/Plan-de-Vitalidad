// Global variables
let currentLanguage = 'pt';
let isDarkMode = false;
let isSidebarCollapsed = false;
let isMobile = window.innerWidth <= 768;

// Internationalization object
const i18n = {
    pt: {
        dashboard: 'Dashboard',
        'dashboard-description': 'Visão geral do seu aplicativo de saúde e bem-estar',
        users: 'Usuários',
        'users-description': 'Gerencie os usuários do seu aplicativo',
        'digital-products': 'Produtos Digitais',
        'digital-products-description': 'Gerencie seus produtos digitais',
        'bonus-materials': 'Bônus e Materiais Extras',
        'bonus-materials-description': 'Gerencie materiais extras e bônus',
        content: 'Conteúdos',
        'content-description': 'Gerencie o conteúdo do aplicativo',
        challenges: 'Desafios',
        'challenges-description': 'Gerencie os desafios do aplicativo',
        creatives: 'Criativos e Campanhas',
        'creatives-description': 'Gerencie criativos e campanhas',
        carousel: 'Imagens do Carrossel',
        'carousel-description': 'Gerencie as imagens do carrossel',
        store: 'Loja (Tienda)',
        'store-description': 'Gerencie a loja do aplicativo',
        sales: 'Vendas - Kiwify',
        'sales-description': 'Gerencie as vendas via Kiwify',
        notifications: 'Notificações Push',
        'notifications-description': 'Gerencie as notificações push',
        integrations: 'Integrações e APIs',
        'integrations-description': 'Gerencie integrações e APIs',
        reports: 'Relatórios',
        'reports-description': 'Visualize relatórios e análises',
        autoresponder: 'Autoresponder',
        'autoresponder-description': 'Configure o autoresponder',
        'app-customization': 'Personalização do App',
        'app-customization-description': 'Personalize a aparência do aplicativo',
        gamification: 'Gamificação',
        'gamification-description': 'Configure a gamificação do aplicativo',
        'general-settings': 'Configurações Gerais',
        'general-settings-description': 'Configure as opções gerais do sistema',
        support: 'Central de Suporte com IA',
        'support-description': 'Central de suporte com inteligência artificial',
        logout: 'Sair',
        'coming-soon': 'Em breve...',
        'functionality-development': 'Esta funcionalidade será desenvolvida em breve',
        'total-users': 'Usuários Totais',
        'engagement-rate': 'Taxa de Engajamento',
        'completed-challenges': 'Desafios Concluídos',
        'monthly-revenue': 'Receita Mensal'
    },
    es: {
        dashboard: 'Panel de Control',
        'dashboard-description': 'Resumen de tu aplicación de salud y bienestar',
        users: 'Usuarios',
        'users-description': 'Gestiona los usuarios de tu aplicación',
        'digital-products': 'Productos Digitales',
        'digital-products-description': 'Gestiona tus productos digitales',
        'bonus-materials': 'Bonos y Materiales Extras',
        'bonus-materials-description': 'Gestiona materiales extras y bonos',
        content: 'Contenidos',
        'content-description': 'Gestiona el contenido de la aplicación',
        challenges: 'Desafíos',
        'challenges-description': 'Gestiona los desafíos de la aplicación',
        creatives: 'Creativos y Campañas',
        'creatives-description': 'Gestiona creativos y campañas',
        carousel: 'Imágenes del Carrusel',
        'carousel-description': 'Gestiona las imágenes del carrusel',
        store: 'Tienda',
        'store-description': 'Gestiona la tienda de la aplicación',
        sales: 'Ventas - Kiwify',
        'sales-description': 'Gestiona las ventas vía Kiwify',
        notifications: 'Notificaciones Push',
        'notifications-description': 'Gestiona las notificaciones push',
        integrations: 'Integraciones y APIs',
        'integrations-description': 'Gestiona integraciones y APIs',
        reports: 'Reportes',
        'reports-description': 'Visualiza reportes y análisis',
        autoresponder: 'Autoresponder',
        'autoresponder-description': 'Configura el autoresponder',
        'app-customization': 'Personalización de la App',
        'app-customization-description': 'Personaliza la apariencia de la aplicación',
        gamification: 'Gamificación',
        'gamification-description': 'Configura la gamificación de la aplicación',
        'general-settings': 'Configuraciones Generales',
        'general-settings-description': 'Configura las opciones generales del sistema',
        support: 'Centro de Soporte con IA',
        'support-description': 'Centro de soporte con inteligencia artificial',
        logout: 'Salir',
        'coming-soon': 'Próximamente...',
        'functionality-development': 'Esta funcionalidad será desarrollada próximamente',
        'total-users': 'Usuarios Totales',
        'engagement-rate': 'Tasa de Engagement',
        'completed-challenges': 'Desafíos Completados',
        'monthly-revenue': 'Ingresos Mensuales'
    },
    en: {
        dashboard: 'Dashboard',
        'dashboard-description': 'Overview of your health and wellness application',
        users: 'Users',
        'users-description': 'Manage your application users',
        'digital-products': 'Digital Products',
        'digital-products-description': 'Manage your digital products',
        'bonus-materials': 'Bonus and Extra Materials',
        'bonus-materials-description': 'Manage extra materials and bonuses',
        content: 'Content',
        'content-description': 'Manage application content',
        challenges: 'Challenges',
        'challenges-description': 'Manage application challenges',
        creatives: 'Creatives and Campaigns',
        'creatives-description': 'Manage creatives and campaigns',
        carousel: 'Carousel Images',
        'carousel-description': 'Manage carousel images',
        store: 'Store',
        'store-description': 'Manage the application store',
        sales: 'Sales - Kiwify',
        'sales-description': 'Manage sales via Kiwify',
        notifications: 'Push Notifications',
        'notifications-description': 'Manage push notifications',
        integrations: 'Integrations and APIs',
        'integrations-description': 'Manage integrations and APIs',
        reports: 'Reports',
        'reports-description': 'View reports and analytics',
        autoresponder: 'Autoresponder',
        'autoresponder-description': 'Configure autoresponder',
        'app-customization': 'App Customization',
        'app-customization-description': 'Customize app appearance',
        gamification: 'Gamification',
        'gamification-description': 'Configure app gamification',
        'general-settings': 'General Settings',
        'general-settings-description': 'Configure general system options',
        support: 'AI Support Center',
        'support-description': 'AI-powered support center',
        logout: 'Logout',
        'coming-soon': 'Coming soon...',
        'functionality-development': 'This functionality will be developed soon',
        'total-users': 'Total Users',
        'engagement-rate': 'Engagement Rate',
        'completed-challenges': 'Completed Challenges',
        'monthly-revenue': 'Monthly Revenue'
    }
};

// DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const overlay = document.getElementById('overlay');
const menuItems = document.querySelectorAll('.menu-item');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.querySelector('.page-title');
const languageBtn = document.getElementById('languageBtn');
const languageDropdown = document.getElementById('languageDropdown');
const currentLanguageSpan = document.getElementById('currentLanguage');
const languageOptions = document.querySelectorAll('.language-option');
const themeToggle = document.getElementById('themeToggle');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateTexts();
    checkMobileView();
    
    // Load saved preferences
    loadPreferences();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
});

// Initialize application
function initializeApp() {
    // Set initial active tab
    const activeTab = localStorage.getItem('activeTab') || 'dashboard';
    switchTab(activeTab);
    
    // Set initial language
    const savedLanguage = localStorage.getItem('language') || 'pt';
    setLanguage(savedLanguage);
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Set initial sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedSidebarState && !isMobile) {
        toggleSidebar();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Overlay click
    overlay.addEventListener('click', closeMobileMenu);
    
    // Language selector
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
    
    // Language options
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
            languageDropdown.classList.remove('show');
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Logout button
    logoutBtn.addEventListener('click', function() {
        if (confirm(i18n[currentLanguage].logout + '?')) {
            // Use authSystem logout function
            authSystem.logout();
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            languageDropdown.classList.remove('show');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        checkMobileView();
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + S to toggle sidebar
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // Alt + T to toggle theme
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape' && isMobile) {
            closeMobileMenu();
        }
    });
}

// Switch between tabs
function switchTab(tabId) {
    // Remove active class from all menu items and tab contents
    menuItems.forEach(item => item.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected items
    const selectedMenuItem = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedTabContent = document.getElementById(tabId);
    
    if (selectedMenuItem && selectedTabContent) {
        selectedMenuItem.classList.add('active');
        selectedTabContent.classList.add('active');
        
        // Update page title
        const titleText = selectedMenuItem.querySelector('.menu-text').textContent;
        pageTitle.textContent = titleText;
        
        // Save active tab
        localStorage.setItem('activeTab', tabId);
        
        // Close mobile menu if open
        if (isMobile) {
            closeMobileMenu();
        }
    }
}

// Toggle sidebar
function toggleSidebar() {
    if (isMobile) return;
    
    isSidebarCollapsed = !isSidebarCollapsed;
    sidebar.classList.toggle('collapsed', isSidebarCollapsed);
    
    // Save sidebar state
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
    
    // Update toggle icon
    const toggleIcon = sidebarToggle.querySelector('i');
    toggleIcon.className = isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-bars';
}

// Toggle mobile menu
function toggleMobileMenu() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
    document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
}

// Close mobile menu
function closeMobileMenu() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Check if mobile view
function checkMobileView() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== isMobile) {
        if (isMobile) {
            // Switching to mobile
            sidebar.classList.remove('collapsed');
            closeMobileMenu();
        } else {
            // Switching to desktop
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
            
            // Restore sidebar state
            const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
            if (savedSidebarState) {
                sidebar.classList.add('collapsed');
                isSidebarCollapsed = true;
            }
        }
    }
}

// Set language
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update current language display
    const langMap = { pt: 'PT', es: 'ES', en: 'EN' };
    currentLanguageSpan.textContent = langMap[lang];
    
    // Update language options
    languageOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });
    
    // Update all texts
    updateTexts();
    
    // Update document language
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
}

// Update all texts based on current language
function updateTexts() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18n[currentLanguage] && i18n[currentLanguage][key]) {
            element.textContent = i18n[currentLanguage][key];
        }
    });
}

// Toggle theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    setTheme(isDarkMode ? 'dark' : 'light');
}

// Set theme
function setTheme(theme) {
    isDarkMode = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    const themeIcon = themeToggle.querySelector('i');
    themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// Load saved preferences
function loadPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Load language
    const savedLanguage = localStorage.getItem('language') || 'pt';
    setLanguage(savedLanguage);
    
    // Load sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
    if (savedSidebarState && !isMobile) {
        isSidebarCollapsed = true;
        sidebar.classList.add('collapsed');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// API utility functions
async function apiRequest(endpoint, options = {}) {
    const baseUrl = '/api'; // Adjust based on your API base URL
    const url = `${baseUrl}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Language': currentLanguage
        }
    };
    
    const requestOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// PWA installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button/notification
    showInstallPrompt();
});

function showInstallPrompt() {
    const installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.innerHTML = '<i class="fas fa-download"></i> Instalar App';
    installButton.onclick = installApp;
    
    // Add to header or show as notification
    const header = document.querySelector('.header-right');
    header.insertBefore(installButton, header.firstChild);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.parentNode.removeChild(installButton);
        }
    }, 10000);
}

async function installApp() {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            showNotification('App instalado com sucesso!', 'success');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferredPrompt
        deferredPrompt = null;
        
        // Hide install button
        const installButton = document.querySelector('.install-button');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }
}

// Export functions for testing
window.PlanVitalidadAdmin = {
    switchTab,
    setLanguage,
    setTheme,
    toggleSidebar,
    apiRequest,
    showNotification
};