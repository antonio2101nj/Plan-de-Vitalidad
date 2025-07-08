// Sistema de Dados Compartilhados - Plan de Vitalidad
// Sincronização entre Painel Admin e Painel do Usuário

class SharedDataManager {
    constructor() {
        this.storageKey = 'planVitalidad_sharedData';
        this.initializeDefaultData();
    }

    initializeDefaultData() {
        const defaultData = {
            // === CARROSSEL COMERCIAL ===
            carousel: {
                slides: [
                    {
                        id: 'slide1',
                        title: '🎉 ¡Oferta Especial!',
                        description: 'Descubre nuestros nuevos productos premium con descuentos exclusivos',
                        cta: 'Ver Ofertas',
                        background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
                        link: 'tienda',
                        active: true,
                        order: 1
                    },
                    {
                        id: 'slide2',
                        title: '📚 Nuevo eBook Disponible',
                        description: 'Guía completa de alimentación consciente y hábitos saludables',
                        cta: 'Leer Ahora',
                        background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop',
                        link: 'productos',
                        active: true,
                        order: 2
                    },
                    {
                        id: 'slide3',
                        title: '🏆 Desafío de 30 Días',
                        description: 'Únete a nuestro desafío de transformación personal',
                        cta: 'Participar',
                        background: 'linear-gradient(135deg, #A8E6CF, #7FCDCD)',
                        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
                        link: 'desafios',
                        active: true,
                        order: 3
                    }
                ],
                settings: {
                    autoPlay: true,
                    interval: 5000,
                    showIndicators: true,
                    showControls: true
                }
            },

            // === PRODUTOS/CONTEÚDOS ===
            products: {
                unlocked: [
                    {
                        id: 'ebook-nutricion',
                        title: 'eBook Nutrição Vital',
                        description: 'Guia completo de nutrição para uma vida saudável',
                        type: 'eBook',
                        category: 'Nutrição',
                        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
                        thumbnail: '📖',
                        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        fileType: 'pdf',
                        status: 'unlocked',
                        progress: 75,
                        featured: true,
                        order: 1,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'video-exercicios',
                        title: 'Video Exercícios Matutinos',
                        description: 'Rotina completa de exercícios para começar o dia',
                        type: 'Video',
                        category: 'Fitness',
                        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
                        thumbnail: '🎥',
                        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                        fileType: 'video',
                        status: 'unlocked',
                        progress: 40,
                        featured: false,
                        order: 2,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'audio-meditacao',
                        title: 'Audio Meditação Guiada',
                        description: 'Sessão de meditação para relaxamento profundo',
                        type: 'Audio',
                        category: 'Bem-estar',
                        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
                        thumbnail: '🎵',
                        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                        fileType: 'audio',
                        status: 'unlocked',
                        progress: 100,
                        featured: false,
                        order: 3,
                        createdAt: new Date().toISOString()
                    }
                ],
                bonus: [
                    {
                        id: 'bonus-recetas',
                        title: 'Receitas Secretas',
                        description: 'Receitas exclusivas para uma alimentação saudável',
                        type: 'eBook',
                        category: 'Bônus',
                        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300&h=200&fit=crop',
                        thumbnail: '🍽️',
                        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                        fileType: 'pdf',
                        status: 'bonus',
                        progress: 0,
                        releaseDate: '2024-01-10',
                        featured: false,
                        order: 1,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'bonus-workout',
                        title: 'Workout Intensivo',
                        description: 'Treino intensivo para resultados rápidos',
                        type: 'Video',
                        category: 'Bônus',
                        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop',
                        thumbnail: '💪',
                        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                        fileType: 'video',
                        status: 'bonus',
                        progress: 0,
                        releaseDate: '2024-01-15',
                        featured: false,
                        order: 2,
                        createdAt: new Date().toISOString()
                    }
                ],
                locked: [
                    {
                        id: 'locked-masterclass',
                        title: 'Masterclass Avançada',
                        description: 'Conteúdo exclusivo para membros premium',
                        type: 'Video',
                        category: 'Premium',
                        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
                        thumbnail: '🎓',
                        status: 'locked',
                        progress: 0,
                        unlockDate: '2024-02-01',
                        featured: false,
                        order: 1,
                        createdAt: new Date().toISOString()
                    }
                ]
            },

            // === BANNERS POR SEÇÃO ===
            banners: {
                home: {
                    main: {
                        title: 'QUER FAZER UMA PARCERIA COM NOSSA PÁGINA OFICIAL',
                        subtitle: '@PLANVITALIDAD',
                        cta: 'CLIQUE AQUI',
                        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop',
                        link: 'https://instagram.com/planvitalidad',
                        active: true
                    }
                },
                products: {
                    header: {
                        title: 'Seus Produtos Exclusivos',
                        subtitle: 'Conteúdo premium para sua jornada',
                        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=300&fit=crop',
                        active: true
                    }
                },
                store: {
                    promotion: {
                        title: '🔥 Oferta Especial',
                        subtitle: 'Desconto de 50% em todos os produtos',
                        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop',
                        active: true
                    }
                }
            },

            // === CONFIGURAÇÕES GERAIS ===
            settings: {
                platform: {
                    name: 'Plan de Vitalidad',
                    description: 'Sua jornada para uma vida mais saudável',
                    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
                    primaryColor: '#10B981',
                    secondaryColor: '#60A5FA'
                },
                features: {
                    carousel: true,
                    products: true,
                    store: true,
                    support: true,
                    challenges: true
                },
                notifications: {
                    welcome: true,
                    newContent: true,
                    challenges: true
                }
            },

            // === AUTORESPONDER ===
            autoresponder: {
                emails: [
                    {
                        id: 'welcome',
                        title: 'Bem-vindo ao Plan de Vitalidad',
                        subject: '🌱 Bem-vindo! Sua jornada começa agora',
                        trigger: 'signup',
                        active: true,
                        template: 'welcome'
                    },
                    {
                        id: 'new-content',
                        title: 'Novo conteúdo disponível',
                        subject: '📚 Novo conteúdo liberado para você!',
                        trigger: 'content_release',
                        active: true,
                        template: 'content'
                    }
                ]
            },

            // === ANALYTICS ===
            analytics: {
                users: {
                    total: 1247,
                    active: 892,
                    newToday: 23
                },
                content: {
                    totalViews: 5432,
                    topContent: 'ebook-nutricion',
                    engagementRate: 78.5
                }
            }
        };

        // Inicializar dados se não existirem
        if (!this.getData()) {
            this.saveData(defaultData);
        }
    }

    // === MÉTODOS DE DADOS ===
    getData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return null;
        }
    }

    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.notifyDataChange();
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    updateData(path, value) {
        const data = this.getData() || {};
        this.setNestedProperty(data, path, value);
        return this.saveData(data);
    }

    // === MÉTODOS ESPECÍFICOS ===

    // CARROSSEL
    getCarouselSlides() {
        const data = this.getData();
        return data?.carousel?.slides?.filter(slide => slide.active) || [];
    }

    updateCarouselSlide(slideId, slideData) {
        const data = this.getData();
        const slideIndex = data.carousel.slides.findIndex(s => s.id === slideId);
        if (slideIndex !== -1) {
            data.carousel.slides[slideIndex] = { ...data.carousel.slides[slideIndex], ...slideData };
            return this.saveData(data);
        }
        return false;
    }

    addCarouselSlide(slideData) {
        const data = this.getData();
        const newSlide = {
            id: 'slide_' + Date.now(),
            ...slideData,
            createdAt: new Date().toISOString()
        };
        data.carousel.slides.push(newSlide);
        return this.saveData(data);
    }

    // PRODUTOS
    getProducts() {
        const data = this.getData();
        return data?.products || { unlocked: [], bonus: [], locked: [] };
    }

    addProduct(productData) {
        const data = this.getData();
        const newProduct = {
            id: 'product_' + Date.now(),
            ...productData,
            createdAt: new Date().toISOString()
        };
        
        const category = productData.status || 'unlocked';
        if (!data.products[category]) {
            data.products[category] = [];
        }
        data.products[category].push(newProduct);
        return this.saveData(data);
    }

    updateProduct(productId, productData) {
        const data = this.getData();
        for (const category in data.products) {
            const productIndex = data.products[category].findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                data.products[category][productIndex] = { 
                    ...data.products[category][productIndex], 
                    ...productData,
                    updatedAt: new Date().toISOString()
                };
                return this.saveData(data);
            }
        }
        return false;
    }

    deleteProduct(productId) {
        const data = this.getData();
        for (const category in data.products) {
            const productIndex = data.products[category].findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                data.products[category].splice(productIndex, 1);
                return this.saveData(data);
            }
        }
        return false;
    }

    // BANNERS
    getBanners() {
        const data = this.getData();
        return data?.banners || {};
    }

    updateBanner(section, bannerKey, bannerData) {
        const data = this.getData();
        if (!data.banners[section]) {
            data.banners[section] = {};
        }
        data.banners[section][bannerKey] = {
            ...data.banners[section][bannerKey],
            ...bannerData,
            updatedAt: new Date().toISOString()
        };
        return this.saveData(data);
    }

    // CONFIGURAÇÕES
    getSettings() {
        const data = this.getData();
        return data?.settings || {};
    }

    updateSettings(settingsData) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settingsData };
        return this.saveData(data);
    }

    // === MÉTODOS UTILITÁRIOS ===
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }

    notifyDataChange() {
        // Disparar evento personalizado para notificar mudanças
        window.dispatchEvent(new CustomEvent('planVitalidadDataChange', {
            detail: { timestamp: new Date().toISOString() }
        }));
    }

    // IMPORTAR/EXPORTAR
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan-vitalidad-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (this.saveData(data)) {
                        resolve(data);
                    } else {
                        reject(new Error('Erro ao salvar dados importados'));
                    }
                } catch (error) {
                    reject(new Error('Arquivo JSON inválido'));
                }
            };
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }

    // RESET
    resetToDefaults() {
        localStorage.removeItem(this.storageKey);
        this.initializeDefaultData();
        this.notifyDataChange();
        return true;
    }
}

// Instância global
window.sharedDataManager = new SharedDataManager();

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SharedDataManager;
}

console.log('🔄 Sistema de Dados Compartilhados carregado');