// Sistema de Autenticação - Plan de Vitalidad
// Gerenciamento de login, sessões e permissões

// Configurações
const AUTH_CONFIG = {
    SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 dias em millisegundos
    SESSION_KEY: 'planVitalidad_session',
    ADMIN_ROUTES: ['admin-dashboard.html', 'index.html'],
    USER_ROUTES: ['app-dashboard.html', 'user-dashboard.html'],
    DEMO_USERS: {
        // Usuários demo para teste
        'admin@planvitalidad.com': {
            password: 'admin123',
            role: 'admin',
            name: 'Administrador',
            permissions: ['all']
        },
        'usuario@planvitalidad.com': {
            password: 'user123',
            role: 'user',
            name: 'Usuário Demo',
            permissions: ['dashboard', 'profile']
        },
        'antonio@planvitalidad.com': {
            password: 'antonio123',
            role: 'admin',
            name: 'Antonio Silva',
            permissions: ['all']
        }
    }
};

// Classe principal de autenticação
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimer = null;
        this.init();
    }

    // Inicializar sistema
    init() {
        this.checkExistingSession();
        this.setupRouteProtection();
        this.setupSessionTimer();
    }

    // Verificar sessão existente
    checkExistingSession() {
        try {
            const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
            if (sessionData) {
                const session = JSON.parse(sessionData);
                
                // Verificar se a sessão não expirou
                if (session.expiresAt && new Date().getTime() < session.expiresAt) {
                    this.currentUser = session.user;
                    this.redirectToDashboard();
                    return true;
                } else {
                    this.logout();
                }
            }
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
            this.logout();
        }
        return false;
    }

    // Login do usuário
    async login(email, password, rememberMe = true) {
        try {
            // Validar campos
            if (!this.validateEmail(email)) {
                throw new Error('Email inválido');
            }

            if (!password || password.length < 6) {
                throw new Error('Senha deve ter pelo menos 6 caracteres');
            }

            // Verificar credenciais (demo)
            const user = this.authenticateUser(email, password);
            if (!user) {
                throw new Error('Email ou senha incorretos');
            }

            // Criar sessão
            this.currentUser = user;
            if (rememberMe) {
                this.createSession(user);
            }

            // Redirecionar para dashboard apropriado
            this.redirectToDashboard();

            return {
                success: true,
                user: user,
                message: `Bem-vindo, ${user.name}!`
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Autenticar usuário (demo)
    authenticateUser(email, password) {
        const user = AUTH_CONFIG.DEMO_USERS[email.toLowerCase()];
        if (user && user.password === password) {
            return {
                email: email,
                name: user.name,
                role: user.role,
                permissions: user.permissions,
                loginTime: new Date().toISOString()
            };
        }
        return null;
    }

    // Criar sessão
    createSession(user) {
        const sessionData = {
            user: user,
            createdAt: new Date().getTime(),
            expiresAt: new Date().getTime() + AUTH_CONFIG.SESSION_DURATION
        };

        localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(sessionData));
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }

        // Redirecionar para login apropriado
        const currentPage = window.location.pathname;
        if (currentPage.includes('admin') || currentPage.includes('index.html')) {
            window.location.href = 'admin-login.html';
        } else {
            window.location.href = 'app-login.html';
        }
    }

    // Verificar permissões
    verificaPermissao(requiredRole = null, requiredPermission = null) {
        if (!this.currentUser) {
            return false;
        }

        // Verificar role se especificado
        if (requiredRole && this.currentUser.role !== requiredRole) {
            return false;
        }

        // Verificar permissão específica
        if (requiredPermission) {
            if (this.currentUser.permissions.includes('all')) {
                return true;
            }
            return this.currentUser.permissions.includes(requiredPermission);
        }

        return true;
    }

    // Proteção de rotas
    setupRouteProtection() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // Se não há usuário logado e não está em página de login
        if (!this.currentUser && !currentPage.includes('login') && currentPage !== '') {
            this.redirectToLogin();
            return;
        }

        // Se usuário logado, verificar acesso à página
        if (this.currentUser) {
            this.checkPageAccess(currentPage);
        }
    }

    // Verificar acesso à página
    checkPageAccess(currentPage) {
        const isAdminPage = AUTH_CONFIG.ADMIN_ROUTES.some(route => 
            currentPage.includes(route.replace('.html', '')) || currentPage === route
        );
        
        const isUserPage = AUTH_CONFIG.USER_ROUTES.some(route => 
            currentPage.includes(route.replace('.html', '')) || currentPage === route
        );

        // Admin tentando acessar página de usuário
        if (this.currentUser.role === 'admin' && isUserPage) {
            window.location.href = 'admin-dashboard.html';
            return;
        }

        // Usuário tentando acessar página de admin
        if (this.currentUser.role === 'user' && isAdminPage) {
            window.location.href = 'user-dashboard.html';
            return;
        }

        // Usuário em página de login sendo logado
        if (currentPage.includes('login')) {
            this.redirectToDashboard();
        }
    }

    // Redirecionar para dashboard apropriado
    redirectToDashboard() {
        if (!this.currentUser) return;

        if (this.currentUser.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    }

    // Redirecionar para login apropriado
    redirectToLogin() {
        const currentPage = window.location.pathname;
        if (currentPage.includes('admin') || currentPage.includes('index.html')) {
            window.location.href = 'admin-login.html';
        } else {
            window.location.href = 'app-login.html';
        }
    }

    // Configurar timer de sessão
    setupSessionTimer() {
        if (this.currentUser && this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }

        const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
        if (sessionData) {
            const session = JSON.parse(sessionData);
            const timeUntilExpiry = session.expiresAt - new Date().getTime();
            
            if (timeUntilExpiry > 0) {
                this.sessionTimer = setTimeout(() => {
                    alert('Sua sessão expirou. Você será redirecionado para o login.');
                    this.logout();
                }, timeUntilExpiry);
            }
        }
    }

    // Validar email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar senha
    validatePassword(password, confirmPassword = null) {
        const errors = [];

        if (!password) {
            errors.push('Senha é obrigatória');
        }

        if (password && password.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }

        if (confirmPassword && password !== confirmPassword) {
            errors.push('Senhas não coincidem');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar se usuário está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Verificar se é admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Verificar se é usuário comum
    isUser() {
        return this.currentUser && this.currentUser.role === 'user';
    }

    // Renovar sessão
    renewSession() {
        if (this.currentUser) {
            this.createSession(this.currentUser);
            this.setupSessionTimer();
        }
    }

    // Alterar senha (demo)
    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.currentUser) {
                throw new Error('Usuário não logado');
            }

            // Verificar senha atual (demo)
            const user = AUTH_CONFIG.DEMO_USERS[this.currentUser.email];
            if (!user || user.password !== currentPassword) {
                throw new Error('Senha atual incorreta');
            }

            const validation = this.validatePassword(newPassword);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Em um sistema real, aqui faria a requisição para o backend
            console.log('Senha alterada com sucesso (demo)');

            return {
                success: true,
                message: 'Senha alterada com sucesso'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

// Instância global do sistema de autenticação
const authSystem = new AuthSystem();

// Função global para verificar permissões
function verificaPermissao(requiredRole = null, requiredPermission = null) {
    return authSystem.verificaPermissao(requiredRole, requiredPermission);
}

// Funções utilitárias globais
function getCurrentUser() {
    return authSystem.getCurrentUser();
}

function isLoggedIn() {
    return authSystem.isLoggedIn();
}

function logout() {
    authSystem.logout();
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem, authSystem, verificaPermissao };
}

// Log do sistema
console.log('Sistema de Autenticação Plan de Vitalidad carregado');
console.log('Usuários demo disponíveis:');
console.log('- admin@planvitalidad.com / admin123 (Admin)');
console.log('- usuario@planvitalidad.com / user123 (Usuário)');
console.log('- antonio@planvitalidad.com / antonio123 (Admin)');