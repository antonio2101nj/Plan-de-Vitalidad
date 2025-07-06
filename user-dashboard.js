// User Dashboard JavaScript
class UserDashboard {
    constructor() {
        this.currentLanguage = 'es';
        this.currentTab = 'inicio';
        this.isMenuOpen = false;
        this.userPoints = 120;
        this.dailyTasks = {
            task1: false,
            task2: false, 
            task3: false,
            task4: false,
            task5: false
        };
        this.supportHistory = [];
        this.audioBlob = null;
        this.mediaRecorder = null;
        this.isRecording = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTranslations();
        this.loadUserData();
        this.hideLoadingScreen();
        this.updateCurrentDate();
        this.startBannerRotation();
        this.renderInitialContent();
    }

    setupEventListeners() {
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleMenu());
        document.getElementById('sidebarOverlay').addEventListener('click', () => this.closeMenu());

        // Language toggle
        document.getElementById('languageToggle').addEventListener('click', () => this.cycleLanguage());

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Quick access cards
        document.querySelectorAll('[data-tab]').forEach(element => {
            if (!element.classList.contains('nav-item')) {
                element.addEventListener('click', (e) => {
                    const tab = e.currentTarget.dataset.tab;
                    this.switchTab(tab);
                });
            }
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => this.showLogoutModal());
        document.getElementById('logoutSettingBtn').addEventListener('click', () => this.showLogoutModal());
        document.getElementById('cancelLogout').addEventListener('click', () => this.hideLogoutModal());
        document.getElementById('confirmLogout').addEventListener('click', () => this.logout());

        // Tasks
        this.setupTaskListeners();

        // Settings
        this.setupSettingsListeners();

        // Support
        this.setupSupportListeners();

        // Filters
        this.setupFilterListeners();
    }

    // Translations
    translations = {
        es: {
            appName: 'Plan de Vitalidad',
            inicio: 'Inicio',
            misProductos: 'Mis Productos',
            misBonus: 'Mis Bónus',
            desafios: 'Desafíos',
            tienda: 'Tienda',
            notificaciones: 'Notificaciones',
            soporte: 'Soporte',
            configuraciones: 'Configuraciones',
            salir: 'Salir',
            bienvenido: '¡Hola, Sara Emanuelly 👋',
            fraseMotivacional: 'Tu bienestar empieza con una pequeña decisión',
            tuProgreso: 'Tu Progreso',
            continuar: 'Continuar',
            explorarTodo: 'Explorar todos los contenidos 🚀',
            filtrarPor: 'Filtrar por',
            buscarProducto: 'Buscar producto...',
            tipo: 'Tipo',
            idioma: 'Idioma',
            footerText: 'App Plan de Vitalidad – Uso personal. Derechos reservados.',
            cerrarSesion: 'Cerrar Sesión',
            confirmarCerrarSesion: '¿Estás seguro de que deseas cerrar sesión?',
            cancelar: 'Cancelar',
            confirmar: 'Confirmar',
            cambiosGuardados: 'Cambios guardados exitosamente',
            tarea1: 'Beber 2L de agua',
            tarea2: 'Comer una fruta natural',
            tarea3: 'Leer 1 receita del eBook',
            tarea4: 'Hacer 10 minutos de ejercicio',
            tarea5: 'Meditar por 5 minutos',
            bienHecho: '¡Bien hecho! Día completado',
            verRecompensas: 'Ver recompensas',
            activarNotificaciones: 'Activar notificaciones',
            dailyRemindersText: 'Para recordatorios diarios',
            enviar: 'Enviar',
            escribeTuDuda: 'Escribe tu duda aquí...',
            tipoTecnico: 'Técnico',
            tipoContenido: 'Contenido',
            tipoAcceso: 'Acceso',
            tipoOtro: 'Otro',
            seleccionarTipo: 'Seleccionar tipo de duda',
            enviarAudio: 'Enviar audio',
            grabandoAudio: 'Grabando...',
            configuracionGeneral: 'Configuración general',
            languageSettingTitle: 'Idioma',
            currentLanguageText: 'Idioma actual: Español',
            personalizationTitle: 'Personalizar',
            darkModeTitle: 'Activar modo oscuro',
            darkModeDesc: 'Modo claro',
            notificationSettingsTitle: 'Notificaciones',
            pushNotificationsTitle: 'Recibir notificaciones push',
            soundNotificationsTitle: 'Sonidos de notificaciones',
            accountDataTitle: 'Datos de la cuenta',
            securityTitle: 'Seguridad y privacidad',
            logoutSettingTitle: 'Cerrar sesión'
        },
        pt: {
            appName: 'Plano de Vitalidade',
            inicio: 'Início',
            misProductos: 'Meus Produtos',
            misBonus: 'Meus Bônus',
            desafios: 'Desafios',
            tienda: 'Loja',
            notificaciones: 'Notificações',
            soporte: 'Suporte',
            configuraciones: 'Configurações',
            salir: 'Sair',
            bienvenido: 'Olá, Sara Emanuelly 👋',
            fraseMotivacional: 'Seu bem-estar começa com uma pequena decisão',
            tuProgreso: 'Seu Progresso',
            continuar: 'Continuar',
            explorarTodo: 'Explorar todos os conteúdos 🚀',
            filtrarPor: 'Filtrar por',
            buscarProducto: 'Buscar produto...',
            tipo: 'Tipo',
            idioma: 'Idioma',
            footerText: 'App Plano de Vitalidade – Uso pessoal. Direitos reservados.',
            cerrarSesion: 'Sair',
            confirmarCerrarSesion: 'Tem certeza de que deseja sair?',
            cancelar: 'Cancelar',
            confirmar: 'Confirmar',
            cambiosGuardados: 'Alterações salvas com sucesso',
            tarea1: 'Beber 2L de água',
            tarea2: 'Comer uma fruta natural',
            tarea3: 'Ler 1 receita do eBook',
            tarea4: 'Fazer 10 minutos de exercício',
            tarea5: 'Meditar por 5 minutos',
            bienHecho: 'Muito bem! Dia concluído',
            verRecompensas: 'Ver recompensas',
            activarNotificaciones: 'Ativar notificações',
            dailyRemindersText: 'Para lembretes diários',
            enviar: 'Enviar',
            escribeTuDuda: 'Escreva sua dúvida aqui...',
            tipoTecnico: 'Técnico',
            tipoContenido: 'Conteúdo',
            tipoAcceso: 'Acesso',
            tipoOtro: 'Outro',
            seleccionarTipo: 'Selecionar tipo de dúvida',
            enviarAudio: 'Enviar áudio',
            grabandoAudio: 'Gravando...',
            configuracionGeneral: 'Configuração geral',
            languageSettingTitle: 'Idioma',
            currentLanguageText: 'Idioma atual: Português',
            personalizationTitle: 'Personalizar',
            darkModeTitle: 'Ativar modo escuro',
            darkModeDesc: 'Modo claro',
            notificationSettingsTitle: 'Notificações',
            pushNotificationsTitle: 'Receber notificações push',
            soundNotificationsTitle: 'Sons de notificações',
            accountDataTitle: 'Dados da conta',
            securityTitle: 'Segurança e privacidade',
            logoutSettingTitle: 'Sair'
        },
        en: {
            appName: 'Vitality Plan',
            inicio: 'Home',
            misProductos: 'My Products',
            misBonus: 'My Bonuses',
            desafios: 'Challenges',
            tienda: 'Store',
            notificaciones: 'Notifications',
            soporte: 'Support',
            configuraciones: 'Settings',
            salir: 'Logout',
            bienvenido: 'Hello, Sara Emanuelly 👋',
            fraseMotivacional: 'Your wellness starts with one small decision',
            tuProgreso: 'Your Progress',
            continuar: 'Continue',
            explorarTodo: 'Explore all content 🚀',
            filtrarPor: 'Filter by',
            buscarProducto: 'Search product...',
            tipo: 'Type',
            idioma: 'Language',
            footerText: 'Vitality Plan App – Personal use. All rights reserved.',
            cerrarSesion: 'Sign Out',
            confirmarCerrarSesion: 'Are you sure you want to sign out?',
            cancelar: 'Cancel',
            confirmar: 'Confirm',
            cambiosGuardados: 'Changes saved successfully',
            tarea1: 'Drink 2L of water',
            tarea2: 'Eat a natural fruit',
            tarea3: 'Read 1 recipe from eBook',
            tarea4: 'Do 10 minutes of exercise',
            tarea5: 'Meditate for 5 minutes',
            bienHecho: 'Well done! Day completed',
            verRecompensas: 'View rewards',
            activarNotificaciones: 'Enable notifications',
            dailyRemindersText: 'For daily reminders',
            enviar: 'Send',
            escribeTuDuda: 'Write your question here...',
            tipoTecnico: 'Technical',
            tipoContenido: 'Content',
            tipoAcceso: 'Access',
            tipoOtro: 'Other',
            seleccionarTipo: 'Select question type',
            enviarAudio: 'Send audio',
            grabandoAudio: 'Recording...',
            configuracionGeneral: 'General settings',
            languageSettingTitle: 'Language',
            currentLanguageText: 'Current language: English',
            personalizationTitle: 'Customize',
            darkModeTitle: 'Enable dark mode',
            darkModeDesc: 'Light mode',
            notificationSettingsTitle: 'Notifications',
            pushNotificationsTitle: 'Receive push notifications',
            soundNotificationsTitle: 'Notification sounds',
            accountDataTitle: 'Account data',
            securityTitle: 'Security & privacy',
            logoutSettingTitle: 'Sign out'
        }
    };

    setupTranslations() {
        this.updateTexts();
    }

    updateTexts() {
        const t = this.translations[this.currentLanguage];
        
        // Update navigation
        document.getElementById('appTitle').textContent = t.appName;
        document.getElementById('nav-inicio').textContent = t.inicio;
        document.getElementById('nav-productos').textContent = t.misProductos;
        document.getElementById('nav-bonus').textContent = t.misBonus;
        document.getElementById('nav-desafios').textContent = t.desafios;
        document.getElementById('nav-tienda').textContent = t.tienda;
        document.getElementById('nav-notificaciones').textContent = t.notificaciones;
        document.getElementById('nav-soporte').textContent = t.soporte;
        document.getElementById('nav-configuraciones').textContent = t.configuraciones;
        document.getElementById('nav-salir').textContent = t.salir;

        // Update home content
        document.getElementById('welcomeMessage').textContent = t.bienvenido;
        document.getElementById('motivationalQuote').textContent = `"${t.fraseMotivacional}"`;
        document.getElementById('progressTitle').textContent = t.tuProgreso;
        document.getElementById('continueReading').textContent = t.continuar;
        document.getElementById('exploreAll').textContent = t.explorarTodo;

        // Update footer
        document.getElementById('footerText').textContent = t.footerText;

        // Update language indicator
        document.getElementById('currentLanguage').textContent = this.currentLanguage.toUpperCase();
        document.getElementById('languageIndicator').textContent = `🌐 ${this.currentLanguage.toUpperCase()}`;

        // Update modal
        document.getElementById('logoutTitle').textContent = t.cerrarSesion;
        document.getElementById('logoutMessage').textContent = t.confirmarCerrarSesion;
        document.getElementById('cancelLogout').textContent = t.cancelar;
        document.getElementById('confirmLogout').textContent = t.confirmar;

        // Update save message
        document.getElementById('saveText').textContent = t.cambiosGuardados;

        // Update tasks
        this.updateTaskTexts();

        // Update filters
        const productSearch = document.getElementById('productSearch');
        if (productSearch) productSearch.placeholder = t.buscarProducto;

        // Update settings
        this.updateSettingsTexts();
    }

    updateTaskTexts() {
        const t = this.translations[this.currentLanguage];
        const tasks = [
            { id: 'task1', text: t.tarea1, icon: '💧' },
            { id: 'task2', text: t.tarea2, icon: '🍎' },
            { id: 'task3', text: t.tarea3, icon: '📖' },
            { id: 'task4', text: t.tarea4, icon: '🏃‍♀️' },
            { id: 'task5', text: t.tarea5, icon: '🧘‍♀️' }
        ];

        const tasksList = document.getElementById('tasksList');
        if (tasksList) {
            tasksList.innerHTML = tasks.map(task => `
                <div class="task-item ${this.dailyTasks[task.id] ? 'completed' : ''}" data-task="${task.id}">
                    <button class="task-checkbox ${this.dailyTasks[task.id] ? 'checked' : ''}" data-task="${task.id}">
                        ${this.dailyTasks[task.id] ? '✓' : ''}
                    </button>
                    <span class="task-icon">${task.icon}</span>
                    <span class="task-text">${task.text}</span>
                </div>
            `).join('');

            // Add task listeners
            tasksList.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    const taskId = e.target.dataset.task;
                    this.toggleTask(taskId);
                });
            });
        }

        this.updateTaskCounter();
    }

    updateSettingsTexts() {
        const t = this.translations[this.currentLanguage];
        
        // Settings page texts
        const generalTitle = document.getElementById('generalSettingsTitle');
        if (generalTitle) generalTitle.textContent = t.configuracionGeneral;

        const languageTitle = document.getElementById('languageSettingTitle');
        if (languageTitle) languageTitle.textContent = t.languageSettingTitle;

        const currentLangText = document.getElementById('currentLanguageText');
        if (currentLangText) currentLangText.textContent = t.currentLanguageText;

        const personalizationTitle = document.getElementById('personalizationTitle');
        if (personalizationTitle) personalizationTitle.textContent = t.personalizationTitle;

        const darkModeTitle = document.getElementById('darkModeTitle');
        if (darkModeTitle) darkModeTitle.textContent = t.darkModeTitle;

        const darkModeDesc = document.getElementById('darkModeDesc');
        if (darkModeDesc) darkModeDesc.textContent = t.darkModeDesc;

        const notificationSettingsTitle = document.getElementById('notificationSettingsTitle');
        if (notificationSettingsTitle) notificationSettingsTitle.textContent = t.notificationSettingsTitle;

        const pushNotificationsTitle = document.getElementById('pushNotificationsTitle');
        if (pushNotificationsTitle) pushNotificationsTitle.textContent = t.pushNotificationsTitle;

        const soundNotificationsTitle = document.getElementById('soundNotificationsTitle');
        if (soundNotificationsTitle) soundNotificationsTitle.textContent = t.soundNotificationsTitle;

        const accountDataTitle = document.getElementById('accountDataTitle');
        if (accountDataTitle) accountDataTitle.textContent = t.accountDataTitle;

        const securityTitle = document.getElementById('securityTitle');
        if (securityTitle) securityTitle.textContent = t.securityTitle;

        const logoutSettingTitle = document.getElementById('logoutSettingTitle');
        if (logoutSettingTitle) logoutSettingTitle.textContent = t.logoutSettingTitle;
    }

    cycleLanguage() {
        const languages = ['es', 'pt', 'en'];
        const currentIndex = languages.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        this.currentLanguage = languages[nextIndex];
        this.updateTexts();
        this.showSaveMessage();
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (this.isMenuOpen) {
            sidebar.classList.add('open');
            overlay.classList.remove('hidden');
        } else {
            this.closeMenu();
        }
    }

    closeMenu() {
        this.isMenuOpen = false;
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
    }

    switchTab(tabId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            }
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetTab = document.getElementById(`tab-${tabId}`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        this.currentTab = tabId;
        this.closeMenu();

        // Load tab-specific content
        this.loadTabContent(tabId);
    }

    loadTabContent(tabId) {
        switch(tabId) {
            case 'productos':
                this.renderProducts();
                break;
            case 'bonus':
                this.renderBonus();
                break;
            case 'desafios':
                this.renderChallenges();
                break;
            case 'tienda':
                this.renderStore();
                break;
            case 'notificaciones':
                this.renderNotifications();
                break;
            case 'soporte':
                this.renderSupport();
                break;
            case 'configuraciones':
                this.renderSettings();
                break;
        }
    }

    setupTaskListeners() {
        // Tasks will be set up when rendered
    }

    toggleTask(taskId) {
        this.dailyTasks[taskId] = !this.dailyTasks[taskId];
        this.updateTaskTexts();
        this.checkAllTasksCompleted();
    }

    checkAllTasksCompleted() {
        const allCompleted = Object.values(this.dailyTasks).every(task => task === true);
        const completeMessage = document.getElementById('tasksCompleteMessage');
        
        if (allCompleted && completeMessage) {
            completeMessage.classList.remove('hidden');
        } else if (completeMessage) {
            completeMessage.classList.add('hidden');
        }
    }

    updateTaskCounter() {
        const completed = Object.values(this.dailyTasks).filter(task => task === true).length;
        const total = Object.keys(this.dailyTasks).length;
        
        const completedElement = document.getElementById('tasksCompleted');
        const totalElement = document.getElementById('tasksTotal');
        
        if (completedElement) completedElement.textContent = completed;
        if (totalElement) totalElement.textContent = total;
    }

    setupSettingsListeners() {
        // Language options
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.changeLanguage(lang);
            });
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', () => {
                this.toggleDarkMode();
            });
        }

        // Notification toggles
        const pushToggle = document.getElementById('pushNotificationsToggle');
        if (pushToggle) {
            pushToggle.addEventListener('change', () => {
                this.showSaveMessage();
            });
        }

        const soundToggle = document.getElementById('soundNotificationsToggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', () => {
                this.showSaveMessage();
            });
        }
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update active language option
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === lang) {
                option.classList.add('active');
            }
        });

        this.updateTexts();
        this.showSaveMessage();
    }

    toggleDarkMode() {
        // Implement dark mode toggle logic
        this.showSaveMessage();
    }

    setupSupportListeners() {
        const submitBtn = document.getElementById('submitSupport');
        const questionInput = document.getElementById('supportQuestion');
        const questionType = document.getElementById('questionType');
        
        // Enable/disable submit button
        const checkSubmitButton = () => {
            const hasQuestion = questionInput && questionInput.value.trim().length > 0;
            const hasAudio = this.audioBlob !== null;
            
            if (submitBtn) {
                submitBtn.disabled = !hasQuestion && !hasAudio;
            }
        };

        if (questionInput) {
            questionInput.addEventListener('input', checkSubmitButton);
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitSupportQuestion());
        }

        // Audio recording
        const recordBtn = document.getElementById('recordBtn');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                if (this.isRecording) {
                    this.stopRecording();
                } else {
                    this.startRecording();
                }
            });
        }
    }

    setupFilterListeners() {
        // Product filters
        const productSearch = document.getElementById('productSearch');
        const typeFilter = document.getElementById('typeFilter');
        const languageFilter = document.getElementById('languageFilter');

        if (productSearch) {
            productSearch.addEventListener('input', () => this.filterProducts());
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterProducts());
        }

        if (languageFilter) {
            languageFilter.addEventListener('change', () => this.filterProducts());
        }

        // Store filters
        const categoryFilter = document.getElementById('categoryFilter');
        const storeLanguageFilter = document.getElementById('storeLanguageFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterStoreProducts());
        }

        if (storeLanguageFilter) {
            storeLanguageFilter.addEventListener('change', () => this.filterStoreProducts());
        }

        // Notification filters
        const notificationTypeFilter = document.getElementById('notificationTypeFilter');
        const unreadOnlyFilter = document.getElementById('unreadOnlyFilter');

        if (notificationTypeFilter) {
            notificationTypeFilter.addEventListener('change', () => this.filterNotifications());
        }

        if (unreadOnlyFilter) {
            unreadOnlyFilter.addEventListener('change', () => this.filterNotifications());
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            this.mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            this.mediaRecorder.onstop = () => {
                this.audioBlob = new Blob(chunks, { type: 'audio/wav' });
                this.showAudioPlayback();
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.showRecordingStatus();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.hideRecordingStatus();
        }
    }

    showRecordingStatus() {
        const recordingStatus = document.getElementById('recordingStatus');
        const recordBtn = document.getElementById('recordBtn');
        const recordText = document.getElementById('recordText');
        
        if (recordingStatus) recordingStatus.classList.remove('hidden');
        if (recordText) recordText.textContent = this.translations[this.currentLanguage].grabandoAudio;
    }

    hideRecordingStatus() {
        const recordingStatus = document.getElementById('recordingStatus');
        const recordText = document.getElementById('recordText');
        
        if (recordingStatus) recordingStatus.classList.add('hidden');
        if (recordText) recordText.textContent = this.translations[this.currentLanguage].enviarAudio;
    }

    showAudioPlayback() {
        const audioControls = document.getElementById('audioControls');
        const audioPlayback = document.getElementById('audioPlayback');
        
        if (audioControls) audioControls.classList.add('hidden');
        if (audioPlayback) audioPlayback.classList.remove('hidden');

        // Set up playback controls
        const playBtn = document.getElementById('playAudioBtn');
        const deleteBtn = document.getElementById('deleteAudioBtn');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.playAudio());
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteAudio());
        }
    }

    playAudio() {
        if (this.audioBlob) {
            const audio = new Audio(URL.createObjectURL(this.audioBlob));
            audio.play();
        }
    }

    deleteAudio() {
        this.audioBlob = null;
        const audioControls = document.getElementById('audioControls');
        const audioPlayback = document.getElementById('audioPlayback');
        
        if (audioControls) audioControls.classList.remove('hidden');
        if (audioPlayback) audioPlayback.classList.add('hidden');
    }

    submitSupportQuestion() {
        const questionInput = document.getElementById('supportQuestion');
        const questionType = document.getElementById('questionType');
        
        if (!questionInput || (!questionInput.value.trim() && !this.audioBlob)) return;

        const question = {
            id: Date.now(),
            text: questionInput.value.trim(),
            type: questionType ? questionType.value : 'otro',
            timestamp: new Date(),
            hasAudio: !!this.audioBlob,
            status: 'processing'
        };

        this.supportHistory.unshift(question);
        
        // Clear form
        questionInput.value = '';
        if (questionType) questionType.value = '';
        this.deleteAudio();

        // Show AI processing
        this.showAIProcessing();

        // Simulate AI response
        setTimeout(() => {
            this.hideAIProcessing();
            question.status = 'answered';
            question.aiResponse = this.generateAIResponse(question.type);
            this.renderSupportHistory();
        }, 2000);

        this.renderSupportHistory();
    }

    generateAIResponse(type) {
        const responses = {
            tecnico: 'Para problemas técnicos, asegúrate de tener la última versión de la app. Si el problema persiste, nuestro equipo técnico te ayudará paso a paso.',
            contenido: 'Todos nuestros contenidos están diseñados por expertos en bienestar. Si tienes dudas específicas sobre algún material, estaremos encantados de aclarártelas.',
            acceso: 'Si tienes problemas para acceder a tu contenido, verifica tu conexión e intenta cerrar y abrir la app. Nuestro equipo puede ayudarte a recuperar el acceso.',
            otro: 'Gracias por contactarnos. Hemos recibido tu consulta y nuestro equipo especializado la está revisando. Te responderemos lo antes posible con información detallada.'
        };
        
        return responses[type] || responses.otro;
    }

    showAIProcessing() {
        const aiProcessing = document.getElementById('aiProcessing');
        if (aiProcessing) aiProcessing.classList.remove('hidden');
    }

    hideAIProcessing() {
        const aiProcessing = document.getElementById('aiProcessing');
        if (aiProcessing) aiProcessing.classList.add('hidden');
    }

    renderSupportHistory() {
        const historyList = document.getElementById('supportHistoryList');
        const noHistory = document.getElementById('noSupportHistory');
        
        if (!historyList) return;

        if (this.supportHistory.length === 0) {
            historyList.classList.add('hidden');
            if (noHistory) noHistory.classList.remove('hidden');
            return;
        }

        if (noHistory) noHistory.classList.add('hidden');
        historyList.classList.remove('hidden');

        historyList.innerHTML = this.supportHistory.map(item => `
            <div class="support-item">
                <div class="support-question">
                    <div class="support-user-avatar">TU</div>
                    <div class="support-content">
                        <div class="support-meta">
                            <span class="support-type">${this.translations[this.currentLanguage][`tipo${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`] || item.type}</span>
                            <span class="support-time">${this.formatTime(item.timestamp)}</span>
                        </div>
                        <p class="support-text">${item.text}</p>
                        ${item.hasAudio ? '<div class="support-audio">🎵 Mensaje de voz incluido</div>' : ''}
                    </div>
                </div>
                ${item.aiResponse ? `
                    <div class="support-response">
                        <div class="support-ai-avatar">🤖</div>
                        <div class="support-content">
                            <div class="support-meta">
                                <span class="support-type">Asistente IA</span>
                                <span class="support-status answered">Respondido</span>
                            </div>
                            <p class="support-text">${item.aiResponse}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    showLogoutModal() {
        const modal = document.getElementById('logoutModal');
        if (modal) modal.classList.remove('hidden');
    }

    hideLogoutModal() {
        const modal = document.getElementById('logoutModal');
        if (modal) modal.classList.add('hidden');
    }

    logout() {
        // Limpar dados do localStorage
        localStorage.removeItem('planVitalidad_session');
        localStorage.removeItem('userLanguage');
        localStorage.removeItem('dailyTasks');
        
        // Limpar variáveis de sessão
        this.currentUser = null;
        
        // Forçar redirecionamento para a página de login
        setTimeout(() => {
            window.location.replace('app-login.html');
        }, 100);
    }

    showSaveMessage() {
        const saveMessage = document.getElementById('saveMessage');
        if (saveMessage) {
            saveMessage.classList.remove('hidden');
            setTimeout(() => {
                saveMessage.classList.add('hidden');
            }, 3000);
        }
    }

    updateCurrentDate() {
        const currentDate = document.getElementById('currentDate');
        if (currentDate) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const locale = this.currentLanguage === 'es' ? 'es-ES' : 
                          this.currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
            currentDate.textContent = new Date().toLocaleDateString(locale, options);
        }
    }

    startBannerRotation() {
        const banners = [
            { text: '¡Nuevo bono disponible!', icon: '🎁' },
            { text: 'Actualización de contenido', icon: '🔄' },
            { text: 'Semana 2 del desafío', icon: '🏆' }
        ];
        
        let currentIndex = 0;
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % banners.length;
            const banner = banners[currentIndex];
            
            const bannerIcon = document.getElementById('bannerIcon');
            const bannerText = document.getElementById('bannerText');
            
            if (bannerIcon) bannerIcon.textContent = banner.icon;
            if (bannerText) bannerText.textContent = banner.text;
            
            // Update indicators
            document.querySelectorAll('.indicator').forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }, 3000);
    }

    loadUserData() {
        // Load user-specific data from localStorage or API
        const savedLanguage = localStorage.getItem('userLanguage');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
        }

        const savedTasks = localStorage.getItem('dailyTasks');
        if (savedTasks) {
            this.dailyTasks = JSON.parse(savedTasks);
        }
    }

    saveUserData() {
        localStorage.setItem('userLanguage', this.currentLanguage);
        localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks));
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }

    renderInitialContent() {
        this.updateTaskTexts();
    }

    renderProducts() {
        // Implement products rendering
        console.log('Rendering products...');
    }

    renderBonus() {
        // Implement bonus rendering
        console.log('Rendering bonus...');
    }

    renderChallenges() {
        // Implement challenges rendering
        console.log('Rendering challenges...');
    }

    renderStore() {
        this.loadStoreProducts();
    }

    loadStoreProducts() {
        // Simulação de produtos da loja integrados com o sistema administrativo
        const storeProducts = [
            {
                id: 1,
                name: "Guía Completa de Alimentación Saludable",
                language: "es",
                description: "Una guía completa para transformar tu alimentación con recetas saludables, planes de comida y consejos nutricionales.",
                type: "ebook",
                price: 29.99,
                currency: "USD",
                visibility: "both",
                saleLink: "https://kiwify.com/alimentacion-saludable",
                cover: "https://via.placeholder.com/300x200/4CAF50/white?text=Guía+Alimentación",
                status: "active",
                featured: true
            },
            {
                id: 2,
                name: "Planner Premium de 90 Dias",
                language: "pt",
                description: "Planner completo para organizar sua vida, estabelecer metas e acompanhar seu progresso durante 90 dias.",
                type: "planner",
                price: 47.90,
                currency: "BRL",
                visibility: "premium",
                saleLink: "https://kiwify.com/planner-90-dias",
                cover: "https://via.placeholder.com/300x200/FF9800/white?text=Planner+90+Dias",
                status: "active",
                featured: true
            },
            {
                id: 3,
                name: "21-Day Transformation Challenge",
                language: "en",
                description: "Complete digital guide with workouts, meal plans, and mindset coaching for a 21-day transformation.",
                type: "combo",
                price: 67.00,
                currency: "USD",
                visibility: "both",
                saleLink: "https://stripe.com/checkout/21-day-challenge",
                cover: "https://via.placeholder.com/300x200/9C27B0/white?text=21+Day+Challenge",
                status: "active",
                featured: false
            },
            {
                id: 4,
                name: "Guía Especial de Meditación",
                language: "es",
                description: "Guía completa de meditación con audios guiados, técnicas de respiración y ejercicios de mindfulness.",
                type: "guide",
                price: 19.99,
                currency: "USD",
                visibility: "free",
                saleLink: "https://kiwify.com/meditacion-guia",
                cover: "https://via.placeholder.com/300x200/2196F3/white?text=Guía+Meditación",
                status: "active",
                featured: false
            },
            {
                id: 5,
                name: "Complete Wellness Bundle",
                language: "en",
                description: "Ultimate wellness package including fitness plans, nutrition guides, and mental health resources.",
                type: "combo",
                price: 97.00,
                currency: "USD",
                visibility: "both",
                saleLink: "https://stripe.com/checkout/wellness-bundle",
                cover: "https://via.placeholder.com/300x200/E91E63/white?text=Wellness+Bundle",
                status: "active",
                featured: true
            }
        ];

        this.storeProducts = storeProducts;
        this.filteredStoreProducts = [...storeProducts];
        this.renderStoreContent();
    }

    renderStoreContent() {
        // Filtrar produtos baseado no idioma do usuário e visibilidade
        const userLanguage = this.currentLanguage;
        const userPlan = 'premium'; // Simular plano do usuário
        
        const availableProducts = this.storeProducts.filter(product => {
            const languageMatch = product.language === userLanguage;
            const visibilityMatch = product.visibility === 'both' || 
                                  (product.visibility === 'free') ||
                                  (product.visibility === 'premium' && userPlan === 'premium');
            const statusMatch = product.status === 'active';
            
            return languageMatch && visibilityMatch && statusMatch;
        });

        this.renderFeaturedProducts(availableProducts);
        this.renderAllStoreProducts(availableProducts);
        this.updateStoreCounter(availableProducts.length);
    }

    renderFeaturedProducts(products) {
        const featuredProducts = products.filter(product => product.featured);
        const featuredGrid = document.getElementById('featuredProductsGrid');
        
        if (!featuredGrid) return;

        if (featuredProducts.length === 0) {
            document.getElementById('featuredProducts').style.display = 'none';
            return;
        }

        document.getElementById('featuredProducts').style.display = 'block';
        
        featuredGrid.innerHTML = featuredProducts.map(product => `
            <div class="store-product-card featured" data-product-id="${product.id}">
                <div class="store-product-image">
                    <img src="${product.cover}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200/ccc/666?text=Producto'">
                    <div class="store-featured-badge">
                        <i class="fas fa-star"></i> Destaque
                    </div>
                </div>
                <div class="store-product-info">
                    <div class="store-product-header">
                        <h3 class="store-product-title">${product.name}</h3>
                    </div>
                    <div class="store-product-badges">
                        <span class="store-product-badge language">${this.getLanguageFlag(product.language)}</span>
                        <span class="store-product-badge type">${this.getTypeIcon(product.type)}</span>
                    </div>
                    <p class="store-product-description">${product.description}</p>
                    <div class="store-product-footer">
                        <div class="store-product-price">${this.formatPrice(product.price, product.currency)}</div>
                        <div class="store-product-actions">
                            <a href="${product.saleLink}" target="_blank" class="store-buy-btn">
                                <i class="fas fa-shopping-cart"></i>
                                ${this.getTranslation('comprarAhora', 'Comprar ahora')}
                            </a>
                            <button class="store-info-btn" onclick="userDashboard.showProductModal(${product.id})">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderAllStoreProducts(products) {
        const storeGrid = document.getElementById('storeProductsGrid');
        const emptyState = document.getElementById('emptyStoreState');
        
        if (!storeGrid) return;

        if (products.length === 0) {
            storeGrid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        storeGrid.style.display = 'grid';
        
        storeGrid.innerHTML = products.map(product => `
            <div class="store-product-card ${product.featured ? 'featured' : ''}" data-product-id="${product.id}">
                <div class="store-product-image">
                    <img src="${product.cover}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200/ccc/666?text=Producto'">
                    ${product.featured ? '<div class="store-featured-badge"><i class="fas fa-star"></i> Destaque</div>' : ''}
                </div>
                <div class="store-product-info">
                    <div class="store-product-header">
                        <h3 class="store-product-title">${product.name}</h3>
                    </div>
                    <div class="store-product-badges">
                        <span class="store-product-badge language">${this.getLanguageFlag(product.language)}</span>
                        <span class="store-product-badge type">${this.getTypeIcon(product.type)}</span>
                    </div>
                    <p class="store-product-description">${product.description}</p>
                    <div class="store-product-footer">
                        <div class="store-product-price">${this.formatPrice(product.price, product.currency)}</div>
                        <div class="store-product-actions">
                            <a href="${product.saleLink}" target="_blank" class="store-buy-btn">
                                <i class="fas fa-shopping-cart"></i>
                                ${this.getTranslation('comprarAhora', 'Comprar ahora')}
                            </a>
                            <button class="store-info-btn" onclick="userDashboard.showProductModal(${product.id})">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showProductModal(productId) {
        const product = this.storeProducts.find(p => p.id === productId);
        if (!product) return;

        // Criar modal dinamicamente
        const modal = document.createElement('div');
        modal.className = 'store-product-modal';
        modal.innerHTML = `
            <div class="store-product-modal-content">
                <div class="store-product-modal-header">
                    <img src="${product.cover}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/600x250/ccc/666?text=Producto'">
                    <button class="store-product-modal-close" onclick="this.closest('.store-product-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="store-product-modal-body">
                    <h2 class="store-product-modal-title">${product.name}</h2>
                    <div class="store-product-badges">
                        <span class="store-product-badge language">${this.getLanguageFlag(product.language)}</span>
                        <span class="store-product-badge type">${this.getTypeIcon(product.type)}</span>
                    </div>
                    <p class="store-product-modal-description">${product.description}</p>
                    <div class="store-product-modal-price">${this.formatPrice(product.price, product.currency)}</div>
                    <div class="store-product-modal-actions">
                        <a href="${product.saleLink}" target="_blank" class="store-buy-btn">
                            <i class="fas fa-shopping-cart"></i>
                            ${this.getTranslation('comprarAhora', 'Comprar ahora')}
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    updateStoreCounter(count) {
        const badge = document.querySelector('#tab-tienda .section-badge');
        if (badge) {
            badge.textContent = `${count} ${this.getTranslation('productos', 'productos')}`;
        }
    }

    getLanguageFlag(language) {
        const flags = {
            'es': '🇪🇸 ES',
            'pt': '🇧🇷 PT',
            'en': '🇺🇸 EN'
        };
        return flags[language] || language;
    }

    getTypeIcon(type) {
        const icons = {
            'ebook': '📖 eBook',
            'combo': '📦 Combo',
            'planner': '📋 Planner',
            'guide': '📚 Guía',
            'bonus': '🎁 Bônus',
            'other': '🔗 Outro'
        };
        return icons[type] || type;
    }

    formatPrice(price, currency) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'BRL': 'R$'
        };
        
        return `${symbols[currency] || currency} ${price.toFixed(2)}`;
    }

    getTranslation(key, defaultValue) {
        return this.translations[this.currentLanguage][key] || defaultValue;
    }

    renderNotifications() {
        // Implement notifications rendering
        console.log('Rendering notifications...');
    }

    renderSupport() {
        this.renderSupportHistory();
    }

    renderSettings() {
        // Settings are already rendered in HTML
        console.log('Settings tab active');
    }

    filterProducts() {
        // Implement product filtering
        console.log('Filtering products...');
    }

    filterStoreProducts() {
        if (!this.storeProducts) return;

        const categoryFilter = document.getElementById('categoryFilter');
        const storeLanguageFilter = document.getElementById('storeLanguageFilter');
        
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const selectedLanguage = storeLanguageFilter ? storeLanguageFilter.value : 'all';
        
        let filteredProducts = [...this.storeProducts];
        
        // Filtrar por categoria
        if (selectedCategory !== 'all') {
            const categoryMap = {
                'alimentacionSaludable': ['ebook', 'guide'],
                'habitos': ['planner'],
                'desafiosCategoria': ['combo'],
                'extras': ['bonus', 'other']
            };
            
            const allowedTypes = categoryMap[selectedCategory] || [];
            filteredProducts = filteredProducts.filter(product => 
                allowedTypes.includes(product.type)
            );
        }
        
        // Filtrar por idioma
        if (selectedLanguage !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.language === selectedLanguage
            );
        }
        
        // Aplicar filtros de visibilidade e status
        const userPlan = 'premium'; // Simular plano do usuário
        filteredProducts = filteredProducts.filter(product => {
            const visibilityMatch = product.visibility === 'both' || 
                                  (product.visibility === 'free') ||
                                  (product.visibility === 'premium' && userPlan === 'premium');
            const statusMatch = product.status === 'active';
            
            return visibilityMatch && statusMatch;
        });
        
        this.renderFeaturedProducts(filteredProducts);
        this.renderAllStoreProducts(filteredProducts);
        this.updateStoreCounter(filteredProducts.length);
    }

    filterNotifications() {
        // Implement notification filtering
        console.log('Filtering notifications...');
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}min`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    }
}

// Initialize dashboard
let userDashboard;

function initializeUserDashboard() {
    userDashboard = new UserDashboard();
}

// Auto-save user data periodically
setInterval(() => {
    if (userDashboard) {
        userDashboard.saveUserData();
    }
}, 30000); // Save every 30 seconds