// Users Management System for Plan de Vitalidad Admin
class UsersManager {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.currentPage = 1;
        this.usersPerPage = 10;
        this.currentEditingUser = null;
        this.currentDeleteUser = null;
        
        this.init();
    }
    
    init() {
        this.loadDemoUsers();
        this.setupEventListeners();
        this.renderUsers();
        this.updateStats();
    }
    
    // Demo users data
    loadDemoUsers() {
        this.users = [
            {
                id: 1,
                name: 'Ana García',
                email: 'ana.garcia@email.com',
                country: 'ES',
                language: 'es',
                plan: 'premium',
                status: 'active',
                createdAt: '2024-01-15',
                avatar: 'AG'
            },
            {
                id: 2,
                name: 'Carlos Silva',
                email: 'carlos.silva@email.com',
                country: 'BR',
                language: 'pt',
                plan: 'free',
                status: 'active',
                createdAt: '2024-01-20',
                avatar: 'CS'
            },
            {
                id: 3,
                name: 'María Rodriguez',
                email: 'maria.rodriguez@email.com',
                country: 'MX',
                language: 'es',
                plan: 'premium',
                status: 'inactive',
                createdAt: '2024-02-01',
                avatar: 'MR'
            },
            {
                id: 4,
                name: 'João Santos',
                email: 'joao.santos@email.com',
                country: 'BR',
                language: 'pt',
                plan: 'free',
                status: 'active',
                createdAt: '2024-02-10',
                avatar: 'JS'
            },
            {
                id: 5,
                name: 'Sarah Johnson',
                email: 'sarah.johnson@email.com',
                country: 'US',
                language: 'en',
                plan: 'premium',
                status: 'active',
                createdAt: '2024-02-15',
                avatar: 'SJ'
            },
            {
                id: 6,
                name: 'Pedro Martínez',
                email: 'pedro.martinez@email.com',
                country: 'ES',
                language: 'es',
                plan: 'free',
                status: 'active',
                createdAt: '2024-02-20',
                avatar: 'PM'
            },
            {
                id: 7,
                name: 'Lucia Fernandez',
                email: 'lucia.fernandez@email.com',
                country: 'AR',
                language: 'es',
                plan: 'premium',
                status: 'inactive',
                createdAt: '2024-03-01',
                avatar: 'LF'
            },
            {
                id: 8,
                name: 'Roberto Costa',
                email: 'roberto.costa@email.com',
                country: 'BR',
                language: 'pt',
                plan: 'free',
                status: 'active',
                createdAt: '2024-03-05',
                avatar: 'RC'
            },
            {
                id: 9,
                name: 'Jennifer Smith',
                email: 'jennifer.smith@email.com',
                country: 'CA',
                language: 'en',
                plan: 'premium',
                status: 'active',
                createdAt: '2024-03-10',
                avatar: 'JS'
            },
            {
                id: 10,
                name: 'Diego López',
                email: 'diego.lopez@email.com',
                country: 'CO',
                language: 'es',
                plan: 'free',
                status: 'active',
                createdAt: '2024-03-15',
                avatar: 'DL'
            },
            // Usuario demo do sistema
            {
                id: 11,
                name: 'Sara Mendoza',
                email: 'usuario@planvitalidad.com',
                country: 'ES',
                language: 'es',
                plan: 'premium',
                status: 'active',
                createdAt: '2024-01-01',
                avatar: 'SM'
            }
        ];
        
        this.filteredUsers = [...this.users];
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('userSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Filter functionality
        const statusFilter = document.getElementById('statusFilter');
        const languageFilter = document.getElementById('languageFilter');
        const planFilter = document.getElementById('planFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }
        if (languageFilter) {
            languageFilter.addEventListener('change', () => this.applyFilters());
        }
        if (planFilter) {
            planFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Create user button
        const createUserBtn = document.getElementById('createUserBtn');
        if (createUserBtn) {
            createUserBtn.addEventListener('click', () => this.openCreateUserModal());
        }
        
        // Export users button
        const exportUsersBtn = document.getElementById('exportUsersBtn');
        if (exportUsersBtn) {
            exportUsersBtn.addEventListener('click', () => this.exportUsers());
        }
        
        // Modal event listeners
        this.setupModalEventListeners();
        
        // Pagination
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.goToNextPage());
        }
    }
    
    setupModalEventListeners() {
        // User modal
        const userModal = document.getElementById('userModal');
        const userModalClose = document.getElementById('userModalClose');
        const userModalCancel = document.getElementById('userModalCancel');
        const userForm = document.getElementById('userForm');
        
        if (userModalClose) {
            userModalClose.addEventListener('click', () => this.closeUserModal());
        }
        if (userModalCancel) {
            userModalCancel.addEventListener('click', () => this.closeUserModal());
        }
        if (userForm) {
            userForm.addEventListener('submit', (e) => this.handleUserFormSubmit(e));
        }
        
        // Delete confirmation modal
        const confirmDeleteModal = document.getElementById('confirmDeleteModal');
        const confirmDeleteClose = document.getElementById('confirmDeleteClose');
        const confirmDeleteCancel = document.getElementById('confirmDeleteCancel');
        const confirmDeleteConfirm = document.getElementById('confirmDeleteConfirm');
        
        if (confirmDeleteClose) {
            confirmDeleteClose.addEventListener('click', () => this.closeDeleteModal());
        }
        if (confirmDeleteCancel) {
            confirmDeleteCancel.addEventListener('click', () => this.closeDeleteModal());
        }
        if (confirmDeleteConfirm) {
            confirmDeleteConfirm.addEventListener('click', () => this.confirmDeleteUser());
        }
        
        // Close modals when clicking outside
        if (userModal) {
            userModal.addEventListener('click', (e) => {
                if (e.target === userModal) this.closeUserModal();
            });
        }
        if (confirmDeleteModal) {
            confirmDeleteModal.addEventListener('click', (e) => {
                if (e.target === confirmDeleteModal) this.closeDeleteModal();
            });
        }
    }
    
    handleSearch(searchTerm) {
        this.currentPage = 1;
        this.applyFilters();
    }
    
    applyFilters() {
        const searchTerm = document.getElementById('userSearchInput')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const languageFilter = document.getElementById('languageFilter')?.value || '';
        const planFilter = document.getElementById('planFilter')?.value || '';
        
        this.filteredUsers = this.users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                                user.email.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || user.status === statusFilter;
            const matchesLanguage = !languageFilter || user.language === languageFilter;
            const matchesPlan = !planFilter || user.plan === planFilter;
            
            return matchesSearch && matchesStatus && matchesLanguage && matchesPlan;
        });
        
        this.renderUsers();
        this.updatePagination();
    }
    
    renderUsers() {
        const tableBody = document.getElementById('usersTableBody');
        const loadingElement = document.getElementById('usersTableLoading');
        const noUsersElement = document.getElementById('noUsersMessage');
        
        if (!tableBody) return;
        
        // Show loading
        if (loadingElement) loadingElement.style.display = 'flex';
        if (noUsersElement) noUsersElement.style.display = 'none';
        tableBody.style.display = 'none';
        
        // Simulate loading delay
        setTimeout(() => {
            if (loadingElement) loadingElement.style.display = 'none';
            
            if (this.filteredUsers.length === 0) {
                if (noUsersElement) noUsersElement.style.display = 'flex';
                tableBody.style.display = 'none';
                return;
            }
            
            // Calculate pagination
            const startIndex = (this.currentPage - 1) * this.usersPerPage;
            const endIndex = startIndex + this.usersPerPage;
            const paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
            
            // Render users
            tableBody.innerHTML = '';
            paginatedUsers.forEach(user => {
                const row = this.createUserRow(user);
                tableBody.appendChild(row);
            });
            
            tableBody.style.display = '';
            this.updateStats();
            this.updatePagination();
        }, 500);
    }
    
    createUserRow(user) {
        const row = document.createElement('tr');
        
        const countryFlags = {
            'BR': '🇧🇷',
            'ES': '🇪🇸',
            'MX': '🇲🇽',
            'AR': '🇦🇷',
            'CO': '🇨🇴',
            'PE': '🇵🇪',
            'CL': '🇨🇱',
            'US': '🇺🇸',
            'CA': '🇨🇦',
            'PT': '🇵🇹',
            'Other': '🌍'
        };
        
        const languageFlags = {
            'es': '🇪🇸',
            'pt': '🇧🇷',
            'en': '🇺🇸'
        };
        
        const languageNames = {
            'es': 'Español',
            'pt': 'Português',
            'en': 'English'
        };
        
        const countryNames = {
            'BR': 'Brasil',
            'ES': 'España',
            'MX': 'México',
            'AR': 'Argentina',
            'CO': 'Colombia',
            'PE': 'Peru',
            'CL': 'Chile',
            'US': 'Estados Unidos',
            'CA': 'Canadá',
            'PT': 'Portugal',
            'Other': 'Outro'
        };
        
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-details">
                        <div class="user-name">${user.name}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="language-flag">${countryFlags[user.country] || '🌍'}</span>
                ${countryNames[user.country] || user.country}
            </td>
            <td>
                <span class="language-flag">${languageFlags[user.language]}</span>
                ${languageNames[user.language]}
            </td>
            <td>
                <span class="plan-badge ${user.plan}">
                    ${user.plan === 'premium' ? '👑 Premium' : '🆓 Gratuito'}
                </span>
            </td>
            <td>
                <span class="status-badge ${user.status}">
                    ${user.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                </span>
            </td>
            <td>${this.formatDate(user.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="usersManager.editUser(${user.id})" title="Editar usuário">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn plan" onclick="usersManager.toggleUserPlan(${user.id})" title="Alterar plano">
                        <i class="fas fa-crown"></i>
                    </button>
                    ${user.status === 'active' ? 
                        `<button class="action-btn suspend" onclick="usersManager.toggleUserStatus(${user.id})" title="Suspender usuário">
                            <i class="fas fa-user-slash"></i>
                        </button>` :
                        `<button class="action-btn activate" onclick="usersManager.toggleUserStatus(${user.id})" title="Ativar usuário">
                            <i class="fas fa-user-check"></i>
                        </button>`
                    }
                    <button class="action-btn delete" onclick="usersManager.deleteUser(${user.id})" title="Excluir usuário">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }
    
    updateStats() {
        const activeUsers = this.users.filter(u => u.status === 'active').length;
        const inactiveUsers = this.users.filter(u => u.status === 'inactive').length;
        const premiumUsers = this.users.filter(u => u.plan === 'premium').length;
        const totalUsers = this.users.length;
        
        const activeUsersCount = document.getElementById('activeUsersCount');
        const inactiveUsersCount = document.getElementById('inactiveUsersCount');
        const premiumUsersCount = document.getElementById('premiumUsersCount');
        const totalUsersCount = document.getElementById('totalUsersCount');
        
        if (activeUsersCount) activeUsersCount.textContent = activeUsers;
        if (inactiveUsersCount) inactiveUsersCount.textContent = inactiveUsers;
        if (premiumUsersCount) premiumUsersCount.textContent = premiumUsers;
        if (totalUsersCount) totalUsersCount.textContent = totalUsers;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
        const startIndex = (this.currentPage - 1) * this.usersPerPage;
        const endIndex = Math.min(startIndex + this.usersPerPage, this.filteredUsers.length);
        
        // Update pagination info
        const paginationInfo = document.getElementById('paginationInfo');
        if (paginationInfo) {
            paginationInfo.textContent = `Mostrando ${startIndex + 1}-${endIndex} de ${this.filteredUsers.length} usuários`;
        }
        
        // Update pagination buttons
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.disabled = this.currentPage <= 1;
        }
        if (nextPageBtn) {
            nextPageBtn.disabled = this.currentPage >= totalPages;
        }
        
        // Update page numbers
        const pageNumbers = document.getElementById('pageNumbers');
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
                    pageBtn.textContent = i;
                    pageBtn.addEventListener('click', () => this.goToPage(i));
                    pageNumbers.appendChild(pageBtn);
                } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.style.padding = '8px 4px';
                    ellipsis.style.color = 'var(--gray-500)';
                    pageNumbers.appendChild(ellipsis);
                }
            }
        }
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderUsers();
    }
    
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderUsers();
        }
    }
    
    goToNextPage() {
        const totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderUsers();
        }
    }
    
    // User actions
    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        this.currentEditingUser = user;
        this.openUserModal(user);
    }
    
    toggleUserPlan(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        user.plan = user.plan === 'free' ? 'premium' : 'free';
        this.renderUsers();
        this.showNotification(`Plano do usuário ${user.name} alterado para ${user.plan === 'premium' ? 'Premium' : 'Gratuito'}`, 'success');
    }
    
    toggleUserStatus(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        user.status = user.status === 'active' ? 'inactive' : 'active';
        this.renderUsers();
        this.showNotification(`Usuário ${user.name} ${user.status === 'active' ? 'ativado' : 'suspenso'}`, 'success');
    }
    
    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        this.currentDeleteUser = user;
        this.openDeleteModal(user);
    }
    
    confirmDeleteUser() {
        if (!this.currentDeleteUser) return;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentDeleteUser.id);
        if (userIndex > -1) {
            const userName = this.currentDeleteUser.name;
            this.users.splice(userIndex, 1);
            this.applyFilters();
            this.showNotification(`Usuário ${userName} excluído com sucesso`, 'success');
        }
        
        this.closeDeleteModal();
    }
    
    // Modal functions
    openCreateUserModal() {
        this.currentEditingUser = null;
        this.openUserModal();
    }
    
    openUserModal(user = null) {
        const modal = document.getElementById('userModal');
        const modalTitle = document.getElementById('userModalTitle');
        const passwordGroup = document.getElementById('passwordGroup');
        
        if (!modal) return;
        
        if (user) {
            modalTitle.textContent = 'Editar Usuário';
            this.populateUserForm(user);
            if (passwordGroup) passwordGroup.style.display = 'none';
        } else {
            modalTitle.textContent = 'Criar Novo Usuário';
            this.clearUserForm();
            if (passwordGroup) passwordGroup.style.display = 'block';
        }
        
        modal.classList.add('show');
    }
    
    closeUserModal() {
        const modal = document.getElementById('userModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentEditingUser = null;
        }
    }
    
    openDeleteModal(user) {
        const modal = document.getElementById('confirmDeleteModal');
        const deleteUserName = document.getElementById('deleteUserName');
        const deleteUserEmail = document.getElementById('deleteUserEmail');
        
        if (!modal) return;
        
        if (deleteUserName) deleteUserName.textContent = user.name;
        if (deleteUserEmail) deleteUserEmail.textContent = user.email;
        
        modal.classList.add('show');
    }
    
    closeDeleteModal() {
        const modal = document.getElementById('confirmDeleteModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentDeleteUser = null;
        }
    }
    
    populateUserForm(user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userCountry').value = user.country;
        document.getElementById('userLanguage').value = user.language;
        document.getElementById('userPlan').value = user.plan;
        document.getElementById('userStatus').value = user.status;
    }
    
    clearUserForm() {
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
    }
    
    handleUserFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            country: formData.get('country'),
            language: formData.get('language'),
            plan: formData.get('plan'),
            status: formData.get('status'),
            password: formData.get('password')
        };
        
        // Validate required fields
        if (!userData.name || !userData.email || !userData.language || !userData.plan || !userData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            this.showNotification('Por favor, insira um e-mail válido', 'error');
            return;
        }
        
        // Check for duplicate email (excluding current user)
        const existingUser = this.users.find(u => u.email === userData.email && u.id !== parseInt(formData.get('userId')));
        if (existingUser) {
            this.showNotification('Este e-mail já está em uso', 'error');
            return;
        }
        
        if (this.currentEditingUser) {
            // Update existing user
            this.updateUser(userData);
        } else {
            // Create new user
            if (!userData.password || userData.password.length < 6) {
                this.showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            this.createUser(userData);
        }
    }
    
    createUser(userData) {
        const newUser = {
            id: Math.max(...this.users.map(u => u.id)) + 1,
            name: userData.name,
            email: userData.email,
            country: userData.country || 'Other',
            language: userData.language,
            plan: userData.plan,
            status: userData.status,
            createdAt: new Date().toISOString().split('T')[0],
            avatar: this.generateAvatar(userData.name)
        };
        
        this.users.push(newUser);
        this.applyFilters();
        this.closeUserModal();
        this.showNotification(`Usuário ${newUser.name} criado com sucesso`, 'success');
    }
    
    updateUser(userData) {
        const userIndex = this.users.findIndex(u => u.id === this.currentEditingUser.id);
        if (userIndex > -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                name: userData.name,
                email: userData.email,
                country: userData.country || 'Other',
                language: userData.language,
                plan: userData.plan,
                status: userData.status,
                avatar: this.generateAvatar(userData.name)
            };
            
            this.applyFilters();
            this.closeUserModal();
            this.showNotification(`Usuário ${userData.name} atualizado com sucesso`, 'success');
        }
    }
    
    generateAvatar(name) {
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    
    exportUsers() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `plan-vitalidad-usuarios-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Lista de usuários exportada com sucesso', 'success');
        }
    }
    
    generateCSV() {
        const headers = ['Nome', 'E-mail', 'País', 'Idioma', 'Plano', 'Status', 'Data de Cadastro'];
        const rows = this.filteredUsers.map(user => [
            user.name,
            user.email,
            user.country,
            user.language,
            user.plan,
            user.status,
            this.formatDate(user.createdAt)
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
            
        return '\uFEFF' + csvContent; // Add BOM for proper Excel encoding
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize users manager when DOM is loaded
let usersManager;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the admin dashboard page
    if (document.getElementById('usersTable')) {
        usersManager = new UsersManager();
    }
});

// Export for global access
window.usersManager = usersManager;