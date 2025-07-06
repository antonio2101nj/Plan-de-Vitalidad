/**
 * Store Management System
 * Gerenciamento completo de produtos digitais da loja
 */

class StoreManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentView = 'cards';
        this.editingProductId = null;
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.setupFileUploads();
        this.renderProducts();
        this.updateStats();
    }

    loadProducts() {
        // Dados de demonstração
        this.products = [
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
                mockup: "https://via.placeholder.com/400x300/4CAF50/white?text=Mockup+Guía",
                status: "active",
                featured: true,
                createdAt: "2024-01-15",
                sales: 156
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
                mockup: "https://via.placeholder.com/400x300/FF9800/white?text=Mockup+Planner",
                status: "active",
                featured: true,
                createdAt: "2024-01-20",
                sales: 89
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
                mockup: "https://via.placeholder.com/400x300/9C27B0/white?text=Mockup+Challenge",
                status: "active",
                featured: false,
                createdAt: "2024-01-25",
                sales: 234
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
                mockup: null,
                status: "active",
                featured: false,
                createdAt: "2024-02-01",
                sales: 67
            },
            {
                id: 5,
                name: "Bônus Exclusivo: Receitas Detox",
                language: "pt",
                description: "Coleção exclusiva de 50 receitas detox para limpar o organismo e acelerar o metabolismo.",
                type: "bonus",
                price: 15.90,
                currency: "BRL",
                visibility: "premium",
                saleLink: "https://kiwify.com/receitas-detox",
                cover: "https://via.placeholder.com/300x200/4CAF50/white?text=Receitas+Detox",
                mockup: "https://via.placeholder.com/400x300/4CAF50/white?text=Mockup+Receitas",
                status: "inactive",
                featured: false,
                createdAt: "2024-02-05",
                sales: 23
            },
            {
                id: 6,
                name: "Complete Wellness Bundle",
                language: "en",
                description: "Ultimate wellness package including fitness plans, nutrition guides, and mental health resources.",
                type: "combo",
                price: 97.00,
                currency: "USD",
                visibility: "both",
                saleLink: "https://stripe.com/checkout/wellness-bundle",
                cover: "https://via.placeholder.com/300x200/E91E63/white?text=Wellness+Bundle",
                mockup: "https://via.placeholder.com/400x300/E91E63/white?text=Mockup+Bundle",
                status: "active",
                featured: true,
                createdAt: "2024-02-10",
                sales: 45
            }
        ];
        
        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        // Botões principais
        document.getElementById('createStoreProductBtn').addEventListener('click', () => this.openCreateProductModal());
        document.getElementById('exportStoreProductsBtn').addEventListener('click', () => this.exportProducts());
        
        // Busca
        document.getElementById('storeSearchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Filtros
        document.getElementById('storeLanguageFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('storeTypeFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('storeStatusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('storeVisibilityFilter').addEventListener('change', () => this.applyFilters());
        
        // Alternância de visualização
        document.getElementById('storeCardViewBtn').addEventListener('click', () => this.switchView('cards'));
        document.getElementById('storeTableViewBtn').addEventListener('click', () => this.switchView('table'));
        
        // Paginação
        document.getElementById('storePrevPageBtn').addEventListener('click', () => this.prevPage());
        document.getElementById('storeNextPageBtn').addEventListener('click', () => this.nextPage());
        
        // Modal de produto
        document.getElementById('storeProductModalClose').addEventListener('click', () => this.closeProductModal());
        document.getElementById('storeProductModalCancel').addEventListener('click', () => this.closeProductModal());
        document.getElementById('storeProductForm').addEventListener('submit', (e) => this.handleProductSubmit(e));
        
        // Modal de confirmação de exclusão
        document.getElementById('confirmDeleteStoreProductClose').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteStoreProductCancel').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteStoreProductConfirm').addEventListener('click', () => this.confirmDeleteProduct());
    }

    setupFileUploads() {
        // Upload de imagem de capa
        const coverUploadArea = document.getElementById('storeProductCoverUploadArea');
        const coverInput = document.getElementById('storeProductCover');
        
        coverUploadArea.addEventListener('click', () => coverInput.click());
        coverInput.addEventListener('change', (e) => this.handleFileUpload(e, 'cover'));
        
        // Upload de imagem adicional
        const mockupUploadArea = document.getElementById('storeProductMockupUploadArea');
        const mockupInput = document.getElementById('storeProductMockup');
        
        mockupUploadArea.addEventListener('click', () => mockupInput.click());
        mockupInput.addEventListener('change', (e) => this.handleFileUpload(e, 'mockup'));
    }

    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validação de arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('O arquivo deve ter no máximo 5MB.');
            return;
        }
        
        // Criar preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(`storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}Preview`);
            const img = document.getElementById(`storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}PreviewImg`);
            const placeholder = document.querySelector(`#storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea .upload-placeholder`);
            
            img.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    removeFile(type) {
        const input = document.getElementById(`storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}`);
        const preview = document.getElementById(`storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}Preview`);
        const placeholder = document.querySelector(`#storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea .upload-placeholder`);
        
        input.value = '';
        preview.style.display = 'none';
        placeholder.style.display = 'block';
    }

    handleSearch(searchTerm) {
        this.filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.applyFilters();
    }

    applyFilters() {
        const languageFilter = document.getElementById('storeLanguageFilter').value;
        const typeFilter = document.getElementById('storeTypeFilter').value;
        const statusFilter = document.getElementById('storeStatusFilter').value;
        const visibilityFilter = document.getElementById('storeVisibilityFilter').value;
        
        this.filteredProducts = this.products.filter(product => {
            return (!languageFilter || product.language === languageFilter) &&
                   (!typeFilter || product.type === typeFilter) &&
                   (!statusFilter || product.status === statusFilter) &&
                   (!visibilityFilter || product.visibility === visibilityFilter);
        });
        
        this.currentPage = 1;
        this.renderProducts();
        this.updatePagination();
    }

    switchView(view) {
        this.currentView = view;
        
        // Atualizar botões
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`store${view.charAt(0).toUpperCase() + view.slice(1)}ViewBtn`).classList.add('active');
        
        // Mostrar/esconder containers
        document.getElementById('storeGrid').style.display = view === 'cards' ? 'grid' : 'none';
        document.getElementById('storeTableContainer').style.display = view === 'table' ? 'block' : 'none';
        
        this.renderProducts();
    }

    renderProducts() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
        
        if (this.currentView === 'cards') {
            this.renderProductCards(paginatedProducts);
        } else {
            this.renderProductTable(paginatedProducts);
        }
        
        this.updatePagination();
        this.toggleEmptyState();
    }

    renderProductCards(products) {
        const grid = document.getElementById('storeGrid');
        
        if (products.length === 0) {
            grid.innerHTML = '';
            return;
        }
        
        grid.innerHTML = products.map(product => `
            <div class="product-card ${product.status === 'inactive' ? 'inactive' : ''}" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.cover}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200/ccc/666?text=Sem+Imagem'">
                    ${product.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Destaque</div>' : ''}
                    <div class="product-overlay">
                        <button class="btn btn-small btn-primary" onclick="storeManager.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="storeManager.toggleProductStatus(${product.id})">
                            <i class="fas fa-${product.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="storeManager.openDeleteModal(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-header">
                        <h3>${product.name}</h3>
                        <div class="product-badges">
                            <span class="language-badge">${this.getLanguageFlag(product.language)}</span>
                            <span class="type-badge">${this.getTypeIcon(product.type)}</span>
                            <span class="status-badge ${product.status}">${product.status === 'active' ? '✅' : '❌'}</span>
                        </div>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-details">
                        <div class="product-price">
                            <strong>${this.formatPrice(product.price, product.currency)}</strong>
                        </div>
                        <div class="product-stats">
                            <span class="sales-count">
                                <i class="fas fa-shopping-cart"></i>
                                ${product.sales} vendas
                            </span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-small" onclick="window.open('${product.saleLink}', '_blank')">
                            <i class="fas fa-external-link-alt"></i>
                            Ver Produto
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="storeManager.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderProductTable(products) {
        const tbody = document.getElementById('storeTableBody');
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum produto encontrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(product => `
            <tr class="${product.status === 'inactive' ? 'inactive' : ''}" data-id="${product.id}">
                <td>
                    <div class="table-product-info">
                        <img src="${product.cover}" alt="${product.name}" class="product-thumb" onerror="this.src='https://via.placeholder.com/50x50/ccc/666?text=?'">
                        <div>
                            <strong>${product.name}</strong>
                            <small>${product.sales} vendas</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="language-badge">${this.getLanguageFlag(product.language)}</span>
                </td>
                <td>
                    <strong>${this.formatPrice(product.price, product.currency)}</strong>
                </td>
                <td>
                    <span class="type-badge">${this.getTypeIcon(product.type)}</span>
                </td>
                <td>
                    <span class="visibility-badge ${product.visibility}">${this.getVisibilityIcon(product.visibility)}</span>
                </td>
                <td>
                    ${product.featured ? '<span class="featured-badge"><i class="fas fa-star"></i></span>' : '-'}
                </td>
                <td>
                    <span class="status-badge ${product.status}">${product.status === 'active' ? '✅ Ativo' : '❌ Inativo'}</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-small btn-primary" onclick="storeManager.editProduct(${product.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="storeManager.toggleProductStatus(${product.id})" title="${product.status === 'active' ? 'Desativar' : 'Ativar'}">
                            <i class="fas fa-${product.status === 'active' ? 'pause' : 'play'}"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="storeManager.openDeleteModal(${product.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const activeProducts = this.products.filter(p => p.status === 'active').length;
        const premiumProducts = this.products.filter(p => p.visibility === 'premium').length;
        const featuredProducts = this.products.filter(p => p.featured).length;
        const totalProducts = this.products.length;
        
        document.getElementById('storeActiveProducts').textContent = activeProducts;
        document.getElementById('storePremiumProducts').textContent = premiumProducts;
        document.getElementById('storeFeaturedProducts').textContent = featuredProducts;
        document.getElementById('storeTotalProducts').textContent = totalProducts;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
        
        // Atualizar informações
        document.getElementById('storePaginationInfo').textContent = 
            `Mostrando ${startItem}-${endItem} de ${this.filteredProducts.length} produtos`;
        
        // Atualizar botões
        document.getElementById('storePrevPageBtn').disabled = this.currentPage === 1;
        document.getElementById('storeNextPageBtn').disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Atualizar números das páginas
        this.renderPageNumbers(totalPages);
    }

    renderPageNumbers(totalPages) {
        const pageNumbers = document.getElementById('storePageNumbers');
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        let html = '';
        
        if (startPage > 1) {
            html += '<button class="page-btn" onclick="storeManager.goToPage(1)">1</button>';
            if (startPage > 2) {
                html += '<span class="page-ellipsis">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="storeManager.goToPage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<span class="page-ellipsis">...</span>';
            }
            html += `<button class="page-btn" onclick="storeManager.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        pageNumbers.innerHTML = html;
    }

    toggleEmptyState() {
        const noProductsMessage = document.getElementById('noStoreProductsMessage');
        const storeGrid = document.getElementById('storeGrid');
        const storeTableContainer = document.getElementById('storeTableContainer');
        
        if (this.filteredProducts.length === 0) {
            noProductsMessage.style.display = 'block';
            storeGrid.style.display = 'none';
            storeTableContainer.style.display = 'none';
        } else {
            noProductsMessage.style.display = 'none';
            if (this.currentView === 'cards') {
                storeGrid.style.display = 'grid';
                storeTableContainer.style.display = 'none';
            } else {
                storeGrid.style.display = 'none';
                storeTableContainer.style.display = 'block';
            }
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderProducts();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderProducts();
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
    }

    openCreateProductModal() {
        this.editingProductId = null;
        this.clearProductForm();
        document.getElementById('storeProductModalTitle').textContent = 'Adicionar Novo Produto';
        document.getElementById('storeProductModal').style.display = 'block';
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.editingProductId = productId;
        this.populateProductForm(product);
        document.getElementById('storeProductModalTitle').textContent = 'Editar Produto';
        document.getElementById('storeProductModal').style.display = 'block';
    }

    populateProductForm(product) {
        document.getElementById('storeProductId').value = product.id;
        document.getElementById('storeProductName').value = product.name;
        document.getElementById('storeProductLanguage').value = product.language;
        document.getElementById('storeProductDescription').value = product.description;
        document.getElementById('storeProductType').value = product.type;
        document.getElementById('storeProductPrice').value = product.price;
        document.getElementById('storeProductCurrency').value = product.currency;
        document.getElementById('storeProductVisibility').value = product.visibility;
        document.getElementById('storeProductSaleLink').value = product.saleLink;
        document.getElementById('storeProductStatus').value = product.status;
        document.getElementById('storeProductFeatured').checked = product.featured;
        
        // Mostrar imagens se existirem
        if (product.cover) {
            const coverPreview = document.getElementById('storeProductCoverPreview');
            const coverImg = document.getElementById('storeProductCoverPreviewImg');
            const coverPlaceholder = document.querySelector('#storeProductCoverUploadArea .upload-placeholder');
            
            coverImg.src = product.cover;
            coverPreview.style.display = 'block';
            coverPlaceholder.style.display = 'none';
        }
        
        if (product.mockup) {
            const mockupPreview = document.getElementById('storeProductMockupPreview');
            const mockupImg = document.getElementById('storeProductMockupPreviewImg');
            const mockupPlaceholder = document.querySelector('#storeProductMockupUploadArea .upload-placeholder');
            
            mockupImg.src = product.mockup;
            mockupPreview.style.display = 'block';
            mockupPlaceholder.style.display = 'none';
        }
    }

    clearProductForm() {
        document.getElementById('storeProductForm').reset();
        
        // Limpar previews de imagem
        ['cover', 'mockup'].forEach(type => {
            const preview = document.getElementById(`storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}Preview`);
            const placeholder = document.querySelector(`#storeProduct${type.charAt(0).toUpperCase() + type.slice(1)}UploadArea .upload-placeholder`);
            
            preview.style.display = 'none';
            placeholder.style.display = 'block';
        });
    }

    closeProductModal() {
        document.getElementById('storeProductModal').style.display = 'none';
        this.editingProductId = null;
    }

    handleProductSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const productData = {
            name: formData.get('name'),
            language: formData.get('language'),
            description: formData.get('description'),
            type: formData.get('type'),
            price: parseFloat(formData.get('price')),
            currency: formData.get('currency'),
            visibility: formData.get('visibility'),
            saleLink: formData.get('saleLink'),
            status: formData.get('status'),
            featured: formData.has('featured')
        };
        
        // Validação básica
        if (!productData.name || !productData.language || !productData.description || 
            !productData.type || !productData.price || !productData.currency || 
            !productData.visibility || !productData.saleLink) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Obter URLs das imagens (em um sistema real, seria upload para servidor)
        const coverImg = document.getElementById('storeProductCoverPreviewImg');
        const mockupImg = document.getElementById('storeProductMockupPreviewImg');
        
        productData.cover = coverImg.src && !coverImg.src.includes('placeholder') ? coverImg.src : 
                           `https://via.placeholder.com/300x200/4CAF50/white?text=${encodeURIComponent(productData.name)}`;
        
        productData.mockup = mockupImg.src && !mockupImg.src.includes('placeholder') ? mockupImg.src : null;
        
        if (this.editingProductId) {
            this.updateProduct(productData);
        } else {
            this.createProduct(productData);
        }
        
        this.closeProductModal();
    }

    createProduct(productData) {
        const newProduct = {
            id: Math.max(...this.products.map(p => p.id)) + 1,
            ...productData,
            createdAt: new Date().toISOString().split('T')[0],
            sales: 0
        };
        
        this.products.push(newProduct);
        this.applyFilters();
        this.updateStats();
        
        // Feedback visual
        this.showNotification('Produto criado com sucesso!', 'success');
    }

    updateProduct(productData) {
        const index = this.products.findIndex(p => p.id === this.editingProductId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
            this.applyFilters();
            this.updateStats();
            
            // Feedback visual
            this.showNotification('Produto atualizado com sucesso!', 'success');
        }
    }

    toggleProductStatus(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.status = product.status === 'active' ? 'inactive' : 'active';
            this.renderProducts();
            this.updateStats();
            
            const statusText = product.status === 'active' ? 'ativado' : 'desativado';
            this.showNotification(`Produto ${statusText} com sucesso!`, 'success');
        }
    }

    openDeleteModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.productToDelete = productId;
            document.getElementById('deleteStoreProductName').textContent = product.name;
            document.getElementById('deleteStoreProductType').textContent = this.getTypeText(product.type);
            document.getElementById('confirmDeleteStoreProductModal').style.display = 'block';
        }
    }

    closeDeleteModal() {
        document.getElementById('confirmDeleteStoreProductModal').style.display = 'none';
        this.productToDelete = null;
    }

    confirmDeleteProduct() {
        if (this.productToDelete) {
            this.products = this.products.filter(p => p.id !== this.productToDelete);
            this.applyFilters();
            this.updateStats();
            this.closeDeleteModal();
            
            this.showNotification('Produto excluído com sucesso!', 'success');
        }
    }

    exportProducts() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `produtos_loja_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        this.showNotification('Lista de produtos exportada com sucesso!', 'success');
    }

    generateCSV() {
        const headers = ['ID', 'Nome', 'Idioma', 'Tipo', 'Preço', 'Moeda', 'Visibilidade', 'Status', 'Destaque', 'Vendas', 'Link de Venda', 'Data de Criação'];
        const rows = this.products.map(product => [
            product.id,
            `"${product.name}"`,
            product.language,
            this.getTypeText(product.type),
            product.price,
            product.currency,
            this.getVisibilityText(product.visibility),
            product.status === 'active' ? 'Ativo' : 'Inativo',
            product.featured ? 'Sim' : 'Não',
            product.sales,
            product.saleLink,
            product.createdAt
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    // Métodos auxiliares
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
            'guide': '📚 Guia',
            'bonus': '🎁 Bônus',
            'other': '🔗 Outro'
        };
        return icons[type] || type;
    }

    getTypeText(type) {
        const types = {
            'ebook': 'eBook',
            'combo': 'Combo',
            'planner': 'Planner Premium',
            'guide': 'Guia Especial',
            'bonus': 'Bônus',
            'other': 'Outro'
        };
        return types[type] || type;
    }

    getVisibilityIcon(visibility) {
        const icons = {
            'free': '🆓 Gratuito',
            'premium': '👑 Premium',
            'both': '👥 Ambos'
        };
        return icons[visibility] || visibility;
    }

    getVisibilityText(visibility) {
        const texts = {
            'free': 'Usuários Gratuitos',
            'premium': 'Usuários Premium',
            'both': 'Ambos'
        };
        return texts[visibility] || visibility;
    }

    formatPrice(price, currency) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'BRL': 'R$'
        };
        
        return `${symbols[currency] || currency} ${price.toFixed(2)}`;
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        if (document.getElementById('storeGrid')) {
            window.storeManager = new StoreManager();
        }
    }, 100);
});