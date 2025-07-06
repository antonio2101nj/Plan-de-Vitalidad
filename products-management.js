// Products Management System for Plan de Vitalidad Admin
class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'cards';
        this.currentEditingProduct = null;
        this.currentDeleteProduct = null;
        this.tags = [];
        
        this.init();
    }
    
    init() {
        this.loadDemoProducts();
        this.setupEventListeners();
        this.renderProducts();
        this.updateStats();
    }
    
    // Demo products data
    loadDemoProducts() {
        this.products = [
            {
                id: 1,
                name: 'Guía Completa de Alimentación Saludable',
                description: '<p>Descubre los secretos de una <strong>alimentación equilibrada</strong> con este completo guía.</p><ul><li>Planes de comida semanales</li><li>Recetas fáciles y nutritivas</li><li>Tips para mantener hábitos saludables</li></ul>',
                type: 'ebook',
                language: 'es',
                visibility: 'both',
                status: 'active',
                publishDate: '2024-01-15',
                tags: ['alimentação', 'saúde', 'nutrição'],
                cover: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Guía+Alimentación',
                mockup: 'https://via.placeholder.com/300x400/059669/FFFFFF?text=Mockup',
                file: 'guia-alimentacion-saludable.pdf',
                fileSize: '2.5 MB'
            },
            {
                id: 2,
                name: 'Planner de Bem-estar 2024',
                description: '<p>Organize sua jornada de <strong>bem-estar</strong> com este planner interativo.</p><p>Inclui:</p><ul><li>Calendário de atividades</li><li>Tracker de hábitos</li><li>Páginas de reflexão</li></ul>',
                type: 'planner',
                language: 'pt',
                visibility: 'premium',
                status: 'active',
                publishDate: '2024-02-01',
                tags: ['bem-estar', 'organização', 'hábitos'],
                cover: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Planner+2024',
                file: 'planner-bem-estar-2024.pdf',
                fileSize: '5.1 MB'
            },
            {
                id: 3,
                name: 'Meditation & Mindfulness Video Course',
                description: '<p>Learn the fundamentals of <strong>meditation</strong> and mindfulness practices.</p><p>Course includes:</p><ul><li>10 guided meditation sessions</li><li>Breathing techniques</li><li>Daily mindfulness exercises</li></ul>',
                type: 'video',
                language: 'en',
                visibility: 'premium',
                status: 'active',
                publishDate: '2024-02-15',
                tags: ['meditation', 'mindfulness', 'wellness'],
                cover: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Meditation+Course',
                file: 'meditation-course.mp4',
                fileSize: '1.2 GB'
            },
            {
                id: 4,
                name: 'Recetas Saludables para Principiantes',
                description: '<p>Colección de <strong>recetas fáciles</strong> para comenzar tu transformación alimentaria.</p><ul><li>50 recetas paso a paso</li><li>Lista de ingredientes</li><li>Valores nutricionales</li></ul>',
                type: 'ebook',
                language: 'es',
                visibility: 'free',
                status: 'active',
                publishDate: '2024-03-01',
                tags: ['receitas', 'culinária', 'iniciantes'],
                cover: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Recetas+Saludables',
                file: 'recetas-principiantes.pdf',
                fileSize: '3.2 MB'
            },
            {
                id: 5,
                name: 'Áudios de Relaxamento e Sono',
                description: '<p>Coleção de <strong>áudios relaxantes</strong> para melhorar a qualidade do seu sono.</p><ul><li>Sons da natureza</li><li>Meditações guiadas</li><li>Música instrumental</li></ul>',
                type: 'audio',
                language: 'pt',
                visibility: 'both',
                status: 'active',
                publishDate: '2024-03-10',
                tags: ['relaxamento', 'sono', 'música'],
                cover: 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Áudios+Relaxamento',
                file: 'audios-relaxamento.zip',
                fileSize: '125 MB'
            },
            {
                id: 6,
                name: 'Guía de Ejercicios en Casa',
                description: '<p>Rutinas completas de <strong>ejercicio</strong> que puedes hacer desde tu hogar.</p><ul><li>Ejercicios para principiantes</li><li>Rutinas avanzadas</li><li>Videos demostrativos</li></ul>',
                type: 'guide',
                language: 'es',
                visibility: 'premium',
                status: 'inactive',
                publishDate: '2024-03-20',
                tags: ['exercício', 'fitness', 'casa'],
                cover: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Ejercicios+Casa',
                file: 'guia-ejercicios-casa.pdf',
                fileSize: '4.7 MB'
            }
        ];
        
        this.filteredProducts = [...this.products];
    }
    
    setupEventListeners() {
        // Search and filters
        const searchInput = document.getElementById('productSearchInput');
        const languageFilter = document.getElementById('productLanguageFilter');
        const typeFilter = document.getElementById('productTypeFilter');
        const statusFilter = document.getElementById('productStatusFilter');
        const visibilityFilter = document.getElementById('productVisibilityFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }
        if (languageFilter) {
            languageFilter.addEventListener('change', () => this.applyFilters());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.applyFilters());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }
        if (visibilityFilter) {
            visibilityFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // View toggle
        const cardViewBtn = document.getElementById('cardViewBtn');
        const tableViewBtn = document.getElementById('tableViewBtn');
        
        if (cardViewBtn) {
            cardViewBtn.addEventListener('click', () => this.switchView('cards'));
        }
        if (tableViewBtn) {
            tableViewBtn.addEventListener('click', () => this.switchView('table'));
        }
        
        // Create product button
        const createProductBtn = document.getElementById('createProductBtn');
        if (createProductBtn) {
            createProductBtn.addEventListener('click', () => this.openCreateProductModal());
        }
        
        // Export products button
        const exportProductsBtn = document.getElementById('exportProductsBtn');
        if (exportProductsBtn) {
            exportProductsBtn.addEventListener('click', () => this.exportProducts());
        }
        
        // Modal event listeners
        this.setupModalEventListeners();
        this.setupRichTextEditor();
        this.setupTagsInput();
        this.setupFileUploads();
        
        // Pagination
        const prevPageBtn = document.getElementById('productsPrevPageBtn');
        const nextPageBtn = document.getElementById('productsNextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.goToPreviousPage());
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.goToNextPage());
        }
    }
    
    setupModalEventListeners() {
        // Product modal
        const productModal = document.getElementById('productModal');
        const productModalClose = document.getElementById('productModalClose');
        const productModalCancel = document.getElementById('productModalCancel');
        const productForm = document.getElementById('productForm');
        
        if (productModalClose) {
            productModalClose.addEventListener('click', () => this.closeProductModal());
        }
        if (productModalCancel) {
            productModalCancel.addEventListener('click', () => this.closeProductModal());
        }
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductFormSubmit(e));
        }
        
        // Delete confirmation modal
        const confirmDeleteProductModal = document.getElementById('confirmDeleteProductModal');
        const confirmDeleteProductClose = document.getElementById('confirmDeleteProductClose');
        const confirmDeleteProductCancel = document.getElementById('confirmDeleteProductCancel');
        const confirmDeleteProductConfirm = document.getElementById('confirmDeleteProductConfirm');
        
        if (confirmDeleteProductClose) {
            confirmDeleteProductClose.addEventListener('click', () => this.closeDeleteProductModal());
        }
        if (confirmDeleteProductCancel) {
            confirmDeleteProductCancel.addEventListener('click', () => this.closeDeleteProductModal());
        }
        if (confirmDeleteProductConfirm) {
            confirmDeleteProductConfirm.addEventListener('click', () => this.confirmDeleteProduct());
        }
        
        // Close modals when clicking outside
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) this.closeProductModal();
            });
        }
        if (confirmDeleteProductModal) {
            confirmDeleteProductModal.addEventListener('click', (e) => {
                if (e.target === confirmDeleteProductModal) this.closeDeleteProductModal();
            });
        }
    }
    
    setupRichTextEditor() {
        const editorButtons = document.querySelectorAll('.editor-btn');
        const editorContent = document.getElementById('productDescription');
        
        editorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.getAttribute('data-command');
                document.execCommand(command, false, null);
                this.updateHiddenDescription();
            });
        });
        
        if (editorContent) {
            editorContent.addEventListener('input', () => {
                this.updateHiddenDescription();
            });
        }
    }
    
    updateHiddenDescription() {
        const editorContent = document.getElementById('productDescription');
        const hiddenInput = document.getElementById('productDescriptionHidden');
        
        if (editorContent && hiddenInput) {
            hiddenInput.value = editorContent.innerHTML;
        }
    }
    
    setupTagsInput() {
        const tagsInput = document.getElementById('productTagsInput');
        
        if (tagsInput) {
            tagsInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag(e.target.value.trim());
                    e.target.value = '';
                }
            });
        }
    }
    
    addTag(tagText) {
        if (tagText && !this.tags.includes(tagText)) {
            this.tags.push(tagText);
            this.renderTags();
            this.updateTagsInput();
        }
    }
    
    removeTag(tagText) {
        this.tags = this.tags.filter(tag => tag !== tagText);
        this.renderTags();
        this.updateTagsInput();
    }
    
    renderTags() {
        const tagsList = document.getElementById('productTagsList');
        if (!tagsList) return;
        
        tagsList.innerHTML = '';
        this.tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `
                <span>${tag}</span>
                <button type="button" class="tag-remove" onclick="productsManager.removeTag('${tag}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            tagsList.appendChild(tagElement);
        });
    }
    
    updateTagsInput() {
        const tagsHidden = document.getElementById('productTags');
        if (tagsHidden) {
            tagsHidden.value = this.tags.join(',');
        }
    }
    
    setupFileUploads() {
        const fileInputs = ['productCover', 'productMockup', 'productFile'];
        
        fileInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', (e) => this.handleFileUpload(e, inputId));
            }
            
            // Setup drag and drop
            const uploadArea = input?.closest('.file-upload-area');
            if (uploadArea) {
                uploadArea.addEventListener('click', () => input.click());
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
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        input.files = files;
                        this.handleFileUpload({ target: input }, inputId);
                    }
                });
            }
        });
    }
    
    handleFileUpload(event, inputId) {
        const file = event.target.files[0];
        if (!file) return;
        
        const fileType = inputId.replace('product', '').toLowerCase();
        this.showFilePreview(file, fileType);
    }
    
    showFilePreview(file, type) {
        const uploadArea = document.getElementById(`${type}UploadArea`);
        const placeholder = uploadArea?.querySelector('.upload-placeholder');
        const preview = uploadArea?.querySelector('.upload-preview');
        
        if (!uploadArea || !placeholder || !preview) return;
        
        placeholder.style.display = 'none';
        preview.style.display = 'block';
        
        if (type === 'cover' || type === 'mockup') {
            const img = preview.querySelector('img');
            if (img && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        } else if (type === 'file') {
            const fileName = preview.querySelector('.file-name');
            const fileSize = preview.querySelector('.file-size');
            const fileIcon = preview.querySelector('#fileIcon');
            
            if (fileName) fileName.textContent = file.name;
            if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
            if (fileIcon) {
                fileIcon.className = this.getFileIcon(file.type);
            }
        }
    }
    
    getFileIcon(fileType) {
        if (fileType.includes('pdf')) return 'fas fa-file-pdf';
        if (fileType.includes('video')) return 'fas fa-file-video';
        if (fileType.includes('audio')) return 'fas fa-file-audio';
        if (fileType.includes('zip')) return 'fas fa-file-archive';
        return 'fas fa-file';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    applyFilters() {
        const searchTerm = document.getElementById('productSearchInput')?.value.toLowerCase() || '';
        const languageFilter = document.getElementById('productLanguageFilter')?.value || '';
        const typeFilter = document.getElementById('productTypeFilter')?.value || '';
        const statusFilter = document.getElementById('productStatusFilter')?.value || '';
        const visibilityFilter = document.getElementById('productVisibilityFilter')?.value || '';
        
        this.filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm);
            const matchesLanguage = !languageFilter || product.language === languageFilter;
            const matchesType = !typeFilter || product.type === typeFilter;
            const matchesStatus = !statusFilter || product.status === statusFilter;
            const matchesVisibility = !visibilityFilter || product.visibility === visibilityFilter;
            
            return matchesSearch && matchesLanguage && matchesType && matchesStatus && matchesVisibility;
        });
        
        this.currentPage = 1;
        this.renderProducts();
        this.updatePagination();
    }
    
    switchView(view) {
        this.currentView = view;
        
        const cardViewBtn = document.getElementById('cardViewBtn');
        const tableViewBtn = document.getElementById('tableViewBtn');
        const productsGrid = document.getElementById('productsGrid');
        const productsTableContainer = document.getElementById('productsTableContainer');
        
        if (view === 'cards') {
            cardViewBtn?.classList.add('active');
            tableViewBtn?.classList.remove('active');
            if (productsGrid) productsGrid.style.display = 'grid';
            if (productsTableContainer) productsTableContainer.style.display = 'none';
        } else {
            tableViewBtn?.classList.add('active');
            cardViewBtn?.classList.remove('active');
            if (productsGrid) productsGrid.style.display = 'none';
            if (productsTableContainer) productsTableContainer.style.display = 'block';
        }
        
        this.renderProducts();
    }
    
    renderProducts() {
        const loadingElement = document.getElementById('productsLoading');
        const noProductsElement = document.getElementById('noProductsMessage');
        
        // Show loading
        if (loadingElement) loadingElement.style.display = 'flex';
        if (noProductsElement) noProductsElement.style.display = 'none';
        
        // Simulate loading delay
        setTimeout(() => {
            if (loadingElement) loadingElement.style.display = 'none';
            
            if (this.filteredProducts.length === 0) {
                if (noProductsElement) noProductsElement.style.display = 'flex';
                return;
            }
            
            // Calculate pagination
            const startIndex = (this.currentPage - 1) * this.productsPerPage;
            const endIndex = startIndex + this.productsPerPage;
            const paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
            
            if (this.currentView === 'cards') {
                this.renderProductsGrid(paginatedProducts);
            } else {
                this.renderProductsTable(paginatedProducts);
            }
            
            this.updateStats();
            this.updatePagination();
        }, 300);
    }
    
    renderProductsGrid(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        products.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });
    }
    
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const typeIcons = {
            'ebook': '📖',
            'video': '🎥',
            'audio': '🎵',
            'planner': '📋',
            'guide': '📚',
            'bonus': '🎁'
        };
        
        const languageFlags = {
            'es': '🇪🇸',
            'pt': '🇧🇷',
            'en': '🇺🇸'
        };
        
        const visibilityLabels = {
            'free': 'Gratuito',
            'premium': 'Premium',
            'both': 'Ambos'
        };
        
        const plainDescription = product.description.replace(/<[^>]*>/g, '');
        
        card.innerHTML = `
            <div class="product-cover">
                ${product.cover ? 
                    `<img src="${product.cover}" alt="${product.name}">` :
                    `<div class="placeholder">${typeIcons[product.type] || '📄'}</div>`
                }
                <div class="product-type-badge">${typeIcons[product.type]} ${product.type.toUpperCase()}</div>
                <div class="product-status-indicator ${product.status}"></div>
            </div>
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-meta">
                        <div class="product-language">
                            <span>${languageFlags[product.language]}</span>
                            <span>${product.language.toUpperCase()}</span>
                        </div>
                        <div class="product-visibility ${product.visibility}">
                            ${visibilityLabels[product.visibility]}
                        </div>
                    </div>
                </div>
                <div class="product-description">${plainDescription}</div>
                <div class="product-tags">
                    ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                </div>
                <div class="product-footer">
                    <div class="product-date">${this.formatDate(product.publishDate)}</div>
                    <div class="product-actions">
                        <button class="action-btn edit" onclick="productsManager.editProduct(${product.id})" title="Editar produto">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn ${product.status === 'active' ? 'suspend' : 'activate'}" 
                                onclick="productsManager.toggleProductStatus(${product.id})" 
                                title="${product.status === 'active' ? 'Inativar' : 'Ativar'} produto">
                            <i class="fas fa-${product.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="action-btn delete" onclick="productsManager.deleteProduct(${product.id})" title="Excluir produto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    renderProductsTable(products) {
        const tableBody = document.getElementById('productsTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        products.forEach(product => {
            const row = this.createProductTableRow(product);
            tableBody.appendChild(row);
        });
    }
    
    createProductTableRow(product) {
        const row = document.createElement('tr');
        
        const typeIcons = {
            'ebook': '📖',
            'video': '🎥', 
            'audio': '🎵',
            'planner': '📋',
            'guide': '📚',
            'bonus': '🎁'
        };
        
        const languageFlags = {
            'es': '🇪🇸',
            'pt': '🇧🇷',
            'en': '🇺🇸'
        };
        
        const plainDescription = product.description.replace(/<[^>]*>/g, '');
        
        row.innerHTML = `
            <td>
                <div class="product-info-table">
                    <div class="product-thumbnail">
                        ${product.cover ? 
                            `<img src="${product.cover}" alt="${product.name}">` :
                            `<div class="placeholder">${typeIcons[product.type]}</div>`
                        }
                    </div>
                    <div class="product-details-table">
                        <div class="product-name-table">${product.name}</div>
                        <div class="product-description-table">${plainDescription}</div>
                    </div>
                </div>
            </td>
            <td>${typeIcons[product.type]} ${product.type.charAt(0).toUpperCase() + product.type.slice(1)}</td>
            <td>
                <span class="language-flag">${languageFlags[product.language]}</span>
                ${product.language.toUpperCase()}
            </td>
            <td>
                <span class="product-visibility ${product.visibility}">
                    ${product.visibility === 'free' ? '🆓 Gratuito' : 
                      product.visibility === 'premium' ? '👑 Premium' : '👥 Ambos'}
                </span>
            </td>
            <td>
                <div class="product-tags">
                    ${product.tags.slice(0, 2).map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                    ${product.tags.length > 2 ? `<span class="product-tag">+${product.tags.length - 2}</span>` : ''}
                </div>
            </td>
            <td>
                <span class="status-badge ${product.status}">
                    ${product.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                </span>
            </td>
            <td>${this.formatDate(product.publishDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="productsManager.editProduct(${product.id})" title="Editar produto">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn ${product.status === 'active' ? 'suspend' : 'activate'}" 
                            onclick="productsManager.toggleProductStatus(${product.id})" 
                            title="${product.status === 'active' ? 'Inativar' : 'Ativar'} produto">
                        <i class="fas fa-${product.status === 'active' ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="action-btn delete" onclick="productsManager.deleteProduct(${product.id})" title="Excluir produto">
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
        const activeProducts = this.products.filter(p => p.status === 'active').length;
        const inactiveProducts = this.products.filter(p => p.status === 'inactive').length;
        const premiumProducts = this.products.filter(p => p.visibility === 'premium').length;
        const totalProducts = this.products.length;
        
        const activeProductsCount = document.getElementById('activeProductsCount');
        const inactiveProductsCount = document.getElementById('inactiveProductsCount');
        const premiumProductsCount = document.getElementById('premiumProductsCount');
        const totalProductsCount = document.getElementById('totalProductsCount');
        
        if (activeProductsCount) activeProductsCount.textContent = activeProducts;
        if (inactiveProductsCount) inactiveProductsCount.textContent = inactiveProducts;
        if (premiumProductsCount) premiumProductsCount.textContent = premiumProducts;
        if (totalProductsCount) totalProductsCount.textContent = totalProducts;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = Math.min(startIndex + this.productsPerPage, this.filteredProducts.length);
        
        // Update pagination info
        const paginationInfo = document.getElementById('productsPaginationInfo');
        if (paginationInfo) {
            paginationInfo.textContent = `Mostrando ${startIndex + 1}-${endIndex} de ${this.filteredProducts.length} produtos`;
        }
        
        // Update pagination buttons
        const prevPageBtn = document.getElementById('productsPrevPageBtn');
        const nextPageBtn = document.getElementById('productsNextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.disabled = this.currentPage <= 1;
        }
        if (nextPageBtn) {
            nextPageBtn.disabled = this.currentPage >= totalPages;
        }
        
        // Update page numbers
        const pageNumbers = document.getElementById('productsPageNumbers');
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
        this.renderProducts();
    }
    
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderProducts();
        }
    }
    
    goToNextPage() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderProducts();
        }
    }
    
    // Product actions
    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.currentEditingProduct = product;
        this.openProductModal(product);
    }
    
    toggleProductStatus(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        product.status = product.status === 'active' ? 'inactive' : 'active';
        this.renderProducts();
        this.showNotification(`Produto ${product.name} ${product.status === 'active' ? 'ativado' : 'inativado'}`, 'success');
    }
    
    deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.currentDeleteProduct = product;
        this.openDeleteProductModal(product);
    }
    
    confirmDeleteProduct() {
        if (!this.currentDeleteProduct) return;
        
        const productIndex = this.products.findIndex(p => p.id === this.currentDeleteProduct.id);
        if (productIndex > -1) {
            const productName = this.currentDeleteProduct.name;
            this.products.splice(productIndex, 1);
            this.applyFilters();
            this.showNotification(`Produto ${productName} excluído com sucesso`, 'success');
        }
        
        this.closeDeleteProductModal();
    }
    
    // Modal functions
    openCreateProductModal() {
        this.currentEditingProduct = null;
        this.tags = [];
        this.openProductModal();
    }
    
    openProductModal(product = null) {
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('productModalTitle');
        
        if (!modal) return;
        
        if (product) {
            modalTitle.textContent = 'Editar Produto';
            this.populateProductForm(product);
        } else {
            modalTitle.textContent = 'Adicionar Novo Produto';
            this.clearProductForm();
        }
        
        modal.classList.add('show');
    }
    
    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentEditingProduct = null;
            this.tags = [];
        }
    }
    
    openDeleteProductModal(product) {
        const modal = document.getElementById('confirmDeleteProductModal');
        const deleteProductName = document.getElementById('deleteProductName');
        const deleteProductType = document.getElementById('deleteProductType');
        
        if (!modal) return;
        
        if (deleteProductName) deleteProductName.textContent = product.name;
        if (deleteProductType) deleteProductType.textContent = product.type;
        
        modal.classList.add('show');
    }
    
    closeDeleteProductModal() {
        const modal = document.getElementById('confirmDeleteProductModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentDeleteProduct = null;
        }
    }
    
    populateProductForm(product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').innerHTML = product.description;
        document.getElementById('productLanguage').value = product.language;
        document.getElementById('productType').value = product.type;
        document.getElementById('productVisibility').value = product.visibility;
        document.getElementById('productStatus').value = product.status;
        document.getElementById('productPublishDate').value = product.publishDate;
        
        this.tags = [...product.tags];
        this.renderTags();
        this.updateTagsInput();
        this.updateHiddenDescription();
    }
    
    clearProductForm() {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productDescription').innerHTML = '';
        document.getElementById('productDescriptionHidden').value = '';
        this.tags = [];
        this.renderTags();
        this.updateTagsInput();
        
        // Clear file previews
        ['cover', 'mockup', 'file'].forEach(type => {
            const uploadArea = document.getElementById(`${type}UploadArea`);
            const placeholder = uploadArea?.querySelector('.upload-placeholder');
            const preview = uploadArea?.querySelector('.upload-preview');
            
            if (placeholder) placeholder.style.display = 'block';
            if (preview) preview.style.display = 'none';
        });
    }
    
    handleProductFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            language: formData.get('language'),
            type: formData.get('type'),
            visibility: formData.get('visibility'),
            status: formData.get('status'),
            publishDate: formData.get('publishDate') || new Date().toISOString().split('T')[0],
            tags: this.tags
        };
        
        // Validate required fields
        if (!productData.name || !productData.description || !productData.language || 
            !productData.type || !productData.visibility || !productData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (this.currentEditingProduct) {
            this.updateProduct(productData);
        } else {
            this.createProduct(productData);
        }
    }
    
    createProduct(productData) {
        const newProduct = {
            id: Math.max(...this.products.map(p => p.id)) + 1,
            ...productData,
            cover: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=' + encodeURIComponent(productData.name),
            file: 'demo-file.' + (productData.type === 'video' ? 'mp4' : productData.type === 'audio' ? 'mp3' : 'pdf'),
            fileSize: '2.5 MB'
        };
        
        this.products.push(newProduct);
        this.applyFilters();
        this.closeProductModal();
        this.showNotification(`Produto ${newProduct.name} criado com sucesso`, 'success');
    }
    
    updateProduct(productData) {
        const productIndex = this.products.findIndex(p => p.id === this.currentEditingProduct.id);
        if (productIndex > -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...productData
            };
            
            this.applyFilters();
            this.closeProductModal();
            this.showNotification(`Produto ${productData.name} atualizado com sucesso`, 'success');
        }
    }
    
    exportProducts() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `plan-vitalidad-produtos-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Lista de produtos exportada com sucesso', 'success');
        }
    }
    
    generateCSV() {
        const headers = ['Nome', 'Tipo', 'Idioma', 'Visibilidade', 'Status', 'Tags', 'Data de Publicação'];
        const rows = this.filteredProducts.map(product => [
            product.name,
            product.type,
            product.language,
            product.visibility,
            product.status,
            product.tags.join('; '),
            this.formatDate(product.publishDate)
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
            
        return '\uFEFF' + csvContent;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
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

// Global function to remove files
function removeFile(type) {
    const uploadArea = document.getElementById(`${type}UploadArea`);
    const placeholder = uploadArea?.querySelector('.upload-placeholder');
    const preview = uploadArea?.querySelector('.upload-preview');
    const input = document.getElementById(`product${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (placeholder) placeholder.style.display = 'block';
    if (preview) preview.style.display = 'none';
    if (input) input.value = '';
}

// Initialize products manager
let productsManager;

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productsGrid')) {
        productsManager = new ProductsManager();
    }
});

window.productsManager = productsManager;