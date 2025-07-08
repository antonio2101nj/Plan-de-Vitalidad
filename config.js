// Configuração para hospedagem simplificada - Plan de Vitalidad
// Para usar na Hostinger: app.plandevitalidad.com

const CONFIG = {
    // URLs base para produção
    BASE_URL: 'https://app.plandevitalidad.com',
    
    // Configurações do app
    APP: {
        name: 'Plan de Vitalidad',
        version: '1.0.0',
        description: 'Sua jornada para uma vida mais saudável'
    },
    
    // Credenciais de acesso
    AUTH: {
        admin: {
            email: 'admin@plandevitalidad.com',
            password: 'admin123'
        },
        user: {
            email: 'user@plandevitalidad.com',
            password: 'user123'
        }
    },
    
    // Configurações de armazenamento
    STORAGE: {
        key: 'planVitalidad_data',
        useLocalStorage: true,
        autoBackup: true
    },
    
    // Configurações de imagens
    IMAGES: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        quality: 0.8
    },
    
    // Configurações do carrossel
    CAROUSEL: {
        autoPlay: true,
        interval: 5000,
        showIndicators: true,
        showControls: true
    },
    
    // URLs de exemplo para demonstração
    DEMO_URLS: {
        pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
    },
    
    // Configurações de desenvolvimento
    DEV: {
        debug: false,
        showLogs: true,
        autoSave: true,
        mockData: true
    }
};

// Detectar ambiente (local vs produção)
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1' &&
                    !window.location.hostname.includes('github.io');

// Ajustar configurações baseado no ambiente
if (isProduction) {
    CONFIG.DEV.debug = false;
    CONFIG.DEV.showLogs = false;
    CONFIG.BASE_URL = window.location.origin;
}

// Função para obter configuração
window.getConfig = function(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], CONFIG);
};

// Função para definir configuração
window.setConfig = function(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIG);
    target[lastKey] = value;
};

// Log de inicialização
if (CONFIG.DEV.showLogs) {
    console.log('🚀 Plan de Vitalidad - Configuração carregada');
    console.log('🌍 Ambiente:', isProduction ? 'Produção' : 'Desenvolvimento');
    console.log('🔧 Configurações:', CONFIG);
}

// Exportar configuração global
window.CONFIG = CONFIG;