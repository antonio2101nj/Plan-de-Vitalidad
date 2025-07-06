/**
 * Sales Management System
 * Gerenciamento completo de vendas da Kiwify com webhook e automação
 */

class SalesManager {
    constructor() {
        this.sales = [];
        this.filteredSales = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.editingSaleId = null;
        this.webhookConfig = {
            url: '',
            connected: false,
            autoCapture: true,
            captureRefunds: true,
            autoUpgrade: true,
            sendNotifications: true
        };
        
        this.init();
    }

    init() {
        this.loadSalesData();
        this.loadWebhookConfig();
        this.setupEventListeners();
        this.renderSales();
        this.updateStats();
        this.populateProductFilters();
    }

    loadSalesData() {
        // Dados de demonstração de vendas
        this.sales = [
            {
                id: 1,
                customerName: "Ana García López",
                customerEmail: "ana.garcia@email.com",
                product: "Guía Completa de Alimentación Saludable",
                productId: 1,
                value: 29.99,
                currency: "USD",
                date: "2024-12-01T14:30:00",
                origin: "kiwify",
                status: "approved",
                language: "es",
                planGranted: "premium",
                transactionId: "KW_001234567",
                webhookReceived: true
            },
            {
                id: 2,
                customerName: "Maria Silva Santos",
                customerEmail: "maria.silva@email.com",
                product: "Planner Premium de 90 Dias",
                productId: 2,
                value: 47.90,
                currency: "BRL",
                date: "2024-12-02T09:15:00",
                origin: "kiwify",
                status: "approved",
                language: "pt",
                planGranted: "premium",
                transactionId: "KW_001234568",
                webhookReceived: true
            },
            {
                id: 3,
                customerName: "John Smith",
                customerEmail: "john.smith@email.com",
                product: "21-Day Transformation Challenge",
                productId: 3,
                value: 67.00,
                currency: "USD",
                date: "2024-12-03T16:45:00",
                origin: "stripe",
                status: "approved",
                language: "en",
                planGranted: "premium",
                transactionId: "ST_pi_3abc123",
                webhookReceived: false
            },
            {
                id: 4,
                customerName: "Carmen Rodriguez",
                customerEmail: "carmen.rodriguez@email.com",
                product: "Guía Especial de Meditación",
                productId: 4,
                value: 19.99,
                currency: "USD",
                date: "2024-12-04T11:20:00",
                origin: "kiwify",
                status: "pending",
                language: "es",
                planGranted: "free",
                transactionId: "KW_001234569",
                webhookReceived: true
            },
            {
                id: 5,
                customerName: "Pedro Oliveira",
                customerEmail: "pedro.oliveira@email.com",
                product: "Complete Wellness Bundle",
                productId: 5,
                value: 97.00,
                currency: "USD",
                date: "2024-12-05T13:10:00",
                origin: "kiwify",
                status: "refunded",
                language: "pt",
                planGranted: "premium",
                transactionId: "KW_001234570",
                webhookReceived: true,
                refundDate: "2024-12-06T10:00:00",
                refundReason: "Solicitação do cliente"
            },
            {
                id: 6,
                customerName: "Sophie Martin",
                customerEmail: "sophie.martin@email.com",
                product: "21-Day Transformation Challenge",
                productId: 3,
                value: 67.00,
                currency: "USD",
                date: "2024-12-06T08:30:00",
                origin: "paypal",
                status: "approved",
                language: "en",
                planGranted: "premium",
                transactionId: "PP_7ABC123XYZ",
                webhookReceived: false
            },
            {
                id: 7,
                customerName: "Carlos Mendoza",
                customerEmail: "carlos.mendoza@email.com",
                product: "Guía Completa de Alimentación Saludable",
                productId: 1,
                value: 29.99,
                currency: "USD",
                date: "2024-12-07T15:45:00",
                origin: "kiwify",
                status: "cancelled",
                language: "es",
                planGranted: "free",
                transactionId: "KW_001234571",
                webhookReceived: true,
                cancelDate: "2024-12-07T16:00:00",
                cancelReason: "Pagamento não processado"
            },
            {
                id: 8,
                customerName: "Lucia Ferreira",
                customerEmail: "lucia.ferreira@email.com",
                product: "Planner Premium de 90 Dias",
                productId: 2,
                value: 47.90,
                currency: "BRL",
                date: "2024-12-08T12:20:00",
                origin: "manual",
                status: "approved",
                language: "pt",
                planGranted: "premium",
                transactionId: "MANUAL_001",
                webhookReceived: false
            }
        ];
        
        this.filteredSales = [...this.sales];
    }

    loadWebhookConfig() {
        // Carregar configuração do webhook do localStorage
        const savedConfig = localStorage.getItem('kiwify_webhook_config');
        if (savedConfig) {
            this.webhookConfig = { ...this.webhookConfig, ...JSON.parse(savedConfig) };
        }
        this.updateWebhookUI();
    }

    saveWebhookConfig() {
        localStorage.setItem('kiwify_webhook_config', JSON.stringify(this.webhookConfig));
    }

    setupEventListeners() {
        // Webhook controls
        document.getElementById('saveWebhookBtn').addEventListener('click', () => this.saveWebhook());
        document.getElementById('testWebhookBtn').addEventListener('click', () => this.testWebhook());
        
        // Webhook options
        document.getElementById('autoCaptureSales').addEventListener('change', (e) => {
            this.webhookConfig.autoCapture = e.target.checked;
            this.saveWebhookConfig();
        });
        
        document.getElementById('captureRefunds').addEventListener('change', (e) => {
            this.webhookConfig.captureRefunds = e.target.checked;
            this.saveWebhookConfig();
        });
        
        document.getElementById('autoUpgradePlan').addEventListener('change', (e) => {
            this.webhookConfig.autoUpgrade = e.target.checked;
            this.saveWebhookConfig();
        });
        
        document.getElementById('sendNotifications').addEventListener('change', (e) => {
            this.webhookConfig.sendNotifications = e.target.checked;
            this.saveWebhookConfig();
        });

        // Sales controls
        document.getElementById('refreshSalesBtn').addEventListener('click', () => this.refreshSales());
        document.getElementById('exportSalesBtn').addEventListener('click', () => this.exportSales());
        document.getElementById('addManualSaleBtn').addEventListener('click', () => this.openManualSaleModal());
        
        // Search and filters
        document.getElementById('salesSearchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('salesStatusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('salesProductFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('salesPlanFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('salesDateFromFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('salesDateToFilter').addEventListener('change', () => this.applyFilters());
        
        // Pagination
        document.getElementById('salesPrevPageBtn').addEventListener('click', () => this.prevPage());
        document.getElementById('salesNextPageBtn').addEventListener('click', () => this.nextPage());
        
        // Manual sale modal
        document.getElementById('manualSaleModalClose').addEventListener('click', () => this.closeManualSaleModal());
        document.getElementById('manualSaleModalCancel').addEventListener('click', () => this.closeManualSaleModal());
        document.getElementById('manualSaleForm').addEventListener('submit', (e) => this.handleManualSaleSubmit(e));
        
        // Sale details modal
        document.getElementById('saleDetailsModalClose').addEventListener('click', () => this.closeSaleDetailsModal());
        document.getElementById('saleDetailsModalCancel').addEventListener('click', () => this.closeSaleDetailsModal());
        document.getElementById('editSaleBtn').addEventListener('click', () => this.editSaleFromDetails());
        
        // Sale action buttons
        document.getElementById('upgradeToPremiumBtn').addEventListener('click', () => this.upgradeToPremium());
        document.getElementById('sendWelcomeNotificationBtn').addEventListener('click', () => this.sendWelcomeNotification());
        document.getElementById('refundSaleBtn').addEventListener('click', () => this.processSaleRefund());
        document.getElementById('resendAccessBtn').addEventListener('click', () => this.resendAccess());
    }

    updateWebhookUI() {
        document.getElementById('webhookUrl').value = this.webhookConfig.url;
        document.getElementById('autoCaptureSales').checked = this.webhookConfig.autoCapture;
        document.getElementById('captureRefunds').checked = this.webhookConfig.captureRefunds;
        document.getElementById('autoUpgradePlan').checked = this.webhookConfig.autoUpgrade;
        document.getElementById('sendNotifications').checked = this.webhookConfig.sendNotifications;
        
        const statusElement = document.getElementById('webhookStatus');
        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('.status-text');
        
        if (this.webhookConfig.connected) {
            indicator.className = 'status-indicator connected';
            text.textContent = 'Conectado';
        } else {
            indicator.className = 'status-indicator disconnected';
            text.textContent = 'Desconectado';
        }
    }

    saveWebhook() {
        const url = document.getElementById('webhookUrl').value.trim();
        
        if (!url) {
            this.showNotification('Por favor, insira uma URL válida', 'error');
            return;
        }
        
        if (!this.isValidUrl(url)) {
            this.showNotification('URL do webhook inválida', 'error');
            return;
        }
        
        this.webhookConfig.url = url;
        this.saveWebhookConfig();
        this.showNotification('Configuração do webhook salva com sucesso!', 'success');
    }

    async testWebhook() {
        const url = document.getElementById('webhookUrl').value.trim();
        
        if (!url) {
            this.showNotification('Por favor, insira uma URL antes de testar', 'error');
            return;
        }
        
        const testBtn = document.getElementById('testWebhookBtn');
        const originalText = testBtn.innerHTML;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testando...';
        testBtn.disabled = true;
        
        try {
            // Simular teste de webhook
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simular resultado (em produção, faria uma requisição real)
            const success = Math.random() > 0.3; // 70% de chance de sucesso
            
            if (success) {
                this.webhookConfig.connected = true;
                this.webhookConfig.url = url;
                this.saveWebhookConfig();
                this.updateWebhookUI();
                this.showNotification('Webhook testado com sucesso! Conexão estabelecida.', 'success');
            } else {
                this.webhookConfig.connected = false;
                this.updateWebhookUI();
                this.showNotification('Falha no teste do webhook. Verifique a URL e tente novamente.', 'error');
            }
        } catch (error) {
            this.webhookConfig.connected = false;
            this.updateWebhookUI();
            this.showNotification('Erro ao testar webhook: ' + error.message, 'error');
        } finally {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }
    }

    populateProductFilters() {
        const productFilter = document.getElementById('salesProductFilter');
        const manualSaleProduct = document.getElementById('manualSaleProduct');
        
        // Obter produtos únicos das vendas
        const products = [...new Set(this.sales.map(sale => sale.product))];
        
        // Limpar e popular filtro de produtos
        productFilter.innerHTML = '<option value="">Todos os produtos</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product;
            option.textContent = product;
            productFilter.appendChild(option);
        });
        
        // Popular dropdown do modal de venda manual
        if (manualSaleProduct) {
            manualSaleProduct.innerHTML = '<option value="">Selecione o produto</option>';
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product;
                option.textContent = product;
                manualSaleProduct.appendChild(option);
            });
        }
    }

    handleSearch(searchTerm) {
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        const searchTerm = document.getElementById('salesSearchInput').value.toLowerCase();
        const statusFilter = document.getElementById('salesStatusFilter').value;
        const productFilter = document.getElementById('salesProductFilter').value;
        const planFilter = document.getElementById('salesPlanFilter').value;
        const dateFromFilter = document.getElementById('salesDateFromFilter').value;
        const dateToFilter = document.getElementById('salesDateToFilter').value;
        
        this.filteredSales = this.sales.filter(sale => {
            const matchesSearch = !searchTerm || 
                sale.customerName.toLowerCase().includes(searchTerm) ||
                sale.customerEmail.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || sale.status === statusFilter;
            const matchesProduct = !productFilter || sale.product === productFilter;
            const matchesPlan = !planFilter || sale.planGranted === planFilter;
            
            let matchesDateRange = true;
            if (dateFromFilter || dateToFilter) {
                const saleDate = new Date(sale.date);
                if (dateFromFilter) {
                    matchesDateRange = matchesDateRange && saleDate >= new Date(dateFromFilter);
                }
                if (dateToFilter) {
                    const endDate = new Date(dateToFilter);
                    endDate.setHours(23, 59, 59, 999);
                    matchesDateRange = matchesDateRange && saleDate <= endDate;
                }
            }
            
            return matchesSearch && matchesStatus && matchesProduct && matchesPlan && matchesDateRange;
        });
        
        this.currentPage = 1;
        this.renderSales();
        this.updatePagination();
    }

    renderSales() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedSales = this.filteredSales.slice(startIndex, endIndex);
        
        this.renderSalesTable(paginatedSales);
        this.updatePagination();
        this.toggleEmptyState();
    }

    renderSalesTable(sales) {
        const tbody = document.getElementById('salesTableBody');
        
        if (sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center">Nenhuma venda encontrada</td></tr>';
            return;
        }
        
        tbody.innerHTML = sales.map(sale => `
            <tr class="sale-row ${sale.status}" data-id="${sale.id}">
                <td>
                    <div class="customer-info">
                        <strong>${sale.customerName}</strong>
                        ${sale.webhookReceived ? '<span class="webhook-indicator" title="Recebido via webhook">🔗</span>' : ''}
                    </div>
                </td>
                <td>
                    <span class="customer-email">${sale.customerEmail}</span>
                </td>
                <td>
                    <span class="product-name">${sale.product}</span>
                </td>
                <td>
                    <strong class="sale-value">${this.formatPrice(sale.value, sale.currency)}</strong>
                </td>
                <td>
                    <span class="sale-date">${this.formatDate(sale.date)}</span>
                </td>
                <td>
                    <span class="origin-badge ${sale.origin}">${this.getOriginIcon(sale.origin)}</span>
                </td>
                <td>
                    <span class="status-badge ${sale.status}">${this.getStatusIcon(sale.status)}</span>
                </td>
                <td>
                    <span class="language-badge">${this.getLanguageFlag(sale.language)}</span>
                </td>
                <td>
                    <span class="plan-badge ${sale.planGranted}">${this.getPlanIcon(sale.planGranted)}</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-small btn-info" onclick="salesManager.viewSaleDetails(${sale.id})" title="Ver Detalhes">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-small btn-primary" onclick="salesManager.editSale(${sale.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${sale.status === 'approved' && sale.planGranted !== 'premium' ? 
                            `<button class="btn btn-small btn-success" onclick="salesManager.quickUpgradeToPremium(${sale.id})" title="Liberar Premium">
                                <i class="fas fa-crown"></i>
                            </button>` : ''
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Vendas do mês atual
        const salesThisMonth = this.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        }).length;
        
        // Vendas aprovadas
        const approvedSales = this.sales.filter(sale => sale.status === 'approved').length;
        
        // Total arrecadado (apenas vendas aprovadas)
        const totalRevenue = this.sales
            .filter(sale => sale.status === 'approved')
            .reduce((total, sale) => {
                // Converter tudo para USD para simplificar (em produção, usar taxas de câmbio reais)
                let valueInUSD = sale.value;
                if (sale.currency === 'BRL') {
                    valueInUSD = sale.value / 5.5; // Taxa aproximada
                } else if (sale.currency === 'EUR') {
                    valueInUSD = sale.value * 1.1; // Taxa aproximada
                }
                return total + valueInUSD;
            }, 0);
        
        // Produto mais vendido
        const productSales = {};
        this.sales.filter(sale => sale.status === 'approved').forEach(sale => {
            productSales[sale.product] = (productSales[sale.product] || 0) + 1;
        });
        
        const bestSellingProduct = Object.keys(productSales).reduce((a, b) => 
            productSales[a] > productSales[b] ? a : b, '-');
        
        // Atualizar UI
        document.getElementById('salesThisMonth').textContent = salesThisMonth;
        document.getElementById('approvedSales').textContent = approvedSales;
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('bestSellingProduct').textContent = bestSellingProduct === '-' ? '-' : 
            bestSellingProduct.length > 20 ? bestSellingProduct.substring(0, 20) + '...' : bestSellingProduct;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredSales.length / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredSales.length);
        
        // Atualizar informações
        document.getElementById('salesPaginationInfo').textContent = 
            `Mostrando ${startItem}-${endItem} de ${this.filteredSales.length} vendas`;
        
        // Atualizar botões
        document.getElementById('salesPrevPageBtn').disabled = this.currentPage === 1;
        document.getElementById('salesNextPageBtn').disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Atualizar números das páginas
        this.renderPageNumbers(totalPages);
    }

    renderPageNumbers(totalPages) {
        const pageNumbers = document.getElementById('salesPageNumbers');
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        let html = '';
        
        if (startPage > 1) {
            html += '<button class="page-btn" onclick="salesManager.goToPage(1)">1</button>';
            if (startPage > 2) {
                html += '<span class="page-ellipsis">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="salesManager.goToPage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<span class="page-ellipsis">...</span>';
            }
            html += `<button class="page-btn" onclick="salesManager.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        pageNumbers.innerHTML = html;
    }

    toggleEmptyState() {
        const noSalesMessage = document.getElementById('noSalesMessage');
        const salesTable = document.querySelector('.sales-table-container');
        
        if (this.filteredSales.length === 0) {
            noSalesMessage.style.display = 'block';
            salesTable.style.display = 'none';
        } else {
            noSalesMessage.style.display = 'none';
            salesTable.style.display = 'block';
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderSales();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredSales.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderSales();
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderSales();
    }

    refreshSales() {
        // Simular atualização de vendas via API
        const refreshBtn = document.getElementById('refreshSalesBtn');
        const originalText = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            // Em produção, aqui faria uma chamada à API
            this.loadSalesData();
            this.renderSales();
            this.updateStats();
            this.populateProductFilters();
            
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            
            this.showNotification('Vendas atualizadas com sucesso!', 'success');
        }, 1500);
    }

    exportSales() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `vendas_kiwify_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        this.showNotification('Relatório de vendas exportado com sucesso!', 'success');
    }

    generateCSV() {
        const headers = [
            'ID', 'Cliente', 'E-mail', 'Produto', 'Valor', 'Moeda', 'Data', 
            'Origem', 'Status', 'Idioma', 'Plano', 'ID Transação', 'Webhook'
        ];
        
        const rows = this.filteredSales.map(sale => [
            sale.id,
            `"${sale.customerName}"`,
            sale.customerEmail,
            `"${sale.product}"`,
            sale.value,
            sale.currency,
            this.formatDate(sale.date),
            this.getOriginText(sale.origin),
            this.getStatusText(sale.status),
            sale.language.toUpperCase(),
            sale.planGranted === 'premium' ? 'Premium' : 'Gratuito',
            sale.transactionId,
            sale.webhookReceived ? 'Sim' : 'Não'
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    openManualSaleModal() {
        this.editingSaleId = null;
        this.clearManualSaleForm();
        document.getElementById('manualSaleModalTitle').textContent = 'Adicionar Venda Manual';
        
        // Definir data atual
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('manualSaleDate').value = localDateTime;
        
        document.getElementById('manualSaleModal').style.display = 'block';
    }

    closeManualSaleModal() {
        document.getElementById('manualSaleModal').style.display = 'none';
        this.editingSaleId = null;
    }

    clearManualSaleForm() {
        document.getElementById('manualSaleForm').reset();
    }

    handleManualSaleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const saleData = {
            customerName: formData.get('customerName'),
            customerEmail: formData.get('customerEmail'),
            product: formData.get('product'),
            value: parseFloat(formData.get('value')),
            currency: formData.get('currency'),
            date: formData.get('saleDate'),
            origin: formData.get('origin'),
            status: formData.get('status'),
            language: formData.get('language'),
            planGranted: formData.has('upgradePlan') ? 'premium' : 'free',
            webhookReceived: false,
            transactionId: this.generateTransactionId(formData.get('origin'))
        };
        
        // Validação básica
        if (!saleData.customerName || !saleData.customerEmail || !saleData.product || 
            !saleData.value || !saleData.currency || !saleData.date || 
            !saleData.origin || !saleData.status || !saleData.language) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        if (this.editingSaleId) {
            this.updateSale(saleData);
        } else {
            this.createSale(saleData);
        }
        
        this.closeManualSaleModal();
    }

    createSale(saleData) {
        const newSale = {
            id: Math.max(...this.sales.map(s => s.id)) + 1,
            ...saleData,
            productId: this.getProductIdByName(saleData.product)
        };
        
        this.sales.unshift(newSale);
        
        // Processar automações se aprovada
        if (newSale.status === 'approved') {
            this.processAutomations(newSale);
        }
        
        this.applyFilters();
        this.updateStats();
        this.populateProductFilters();
        
        this.showNotification('Venda adicionada com sucesso!', 'success');
    }

    updateSale(saleData) {
        const index = this.sales.findIndex(s => s.id === this.editingSaleId);
        if (index !== -1) {
            const oldStatus = this.sales[index].status;
            this.sales[index] = { ...this.sales[index], ...saleData };
            
            // Processar automações se status mudou para aprovado
            if (oldStatus !== 'approved' && saleData.status === 'approved') {
                this.processAutomations(this.sales[index]);
            }
            
            this.applyFilters();
            this.updateStats();
            
            this.showNotification('Venda atualizada com sucesso!', 'success');
        }
    }

    editSale(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (!sale) return;
        
        this.editingSaleId = saleId;
        this.populateManualSaleForm(sale);
        document.getElementById('manualSaleModalTitle').textContent = 'Editar Venda';
        document.getElementById('manualSaleModal').style.display = 'block';
    }

    populateManualSaleForm(sale) {
        document.getElementById('manualSaleCustomerName').value = sale.customerName;
        document.getElementById('manualSaleCustomerEmail').value = sale.customerEmail;
        document.getElementById('manualSaleProduct').value = sale.product;
        document.getElementById('manualSaleValue').value = sale.value;
        document.getElementById('manualSaleCurrency').value = sale.currency;
        document.getElementById('manualSaleDate').value = sale.date.slice(0, 16);
        document.getElementById('manualSaleOrigin').value = sale.origin;
        document.getElementById('manualSaleStatus').value = sale.status;
        document.getElementById('manualSaleLanguage').value = sale.language;
        document.getElementById('manualSaleUpgradePlan').checked = sale.planGranted === 'premium';
    }

    viewSaleDetails(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (!sale) return;
        
        this.currentSaleDetails = sale;
        this.populateSaleDetailsModal(sale);
        document.getElementById('saleDetailsModal').style.display = 'block';
    }

    populateSaleDetailsModal(sale) {
        document.getElementById('detailCustomerName').textContent = sale.customerName;
        document.getElementById('detailCustomerEmail').textContent = sale.customerEmail;
        document.getElementById('detailCustomerPlan').innerHTML = this.getPlanIcon(sale.planGranted);
        
        document.getElementById('detailProduct').textContent = sale.product;
        document.getElementById('detailValue').textContent = this.formatPrice(sale.value, sale.currency);
        document.getElementById('detailDate').textContent = this.formatDate(sale.date);
        
        document.getElementById('detailOrigin').innerHTML = this.getOriginIcon(sale.origin);
        document.getElementById('detailStatus').innerHTML = this.getStatusIcon(sale.status);
        document.getElementById('detailLanguage').innerHTML = this.getLanguageFlag(sale.language);
        
        // Configurar botões de ação
        const upgradeBtnElement = document.getElementById('upgradeToPremiumBtn');
        upgradeBtnElement.style.display = (sale.status === 'approved' && sale.planGranted !== 'premium') ? 'inline-block' : 'none';
        
        const refundBtnElement = document.getElementById('refundSaleBtn');
        refundBtnElement.style.display = (sale.status === 'approved') ? 'inline-block' : 'none';
    }

    closeSaleDetailsModal() {
        document.getElementById('saleDetailsModal').style.display = 'none';
        this.currentSaleDetails = null;
    }

    editSaleFromDetails() {
        if (this.currentSaleDetails) {
            this.closeSaleDetailsModal();
            this.editSale(this.currentSaleDetails.id);
        }
    }

    quickUpgradeToPremium(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (!sale) return;
        
        if (sale.status !== 'approved') {
            this.showNotification('Apenas vendas aprovadas podem liberar acesso Premium', 'error');
            return;
        }
        
        sale.planGranted = 'premium';
        
        // Simular upgrade do usuário no sistema
        this.upgradeUserToPremium(sale.customerEmail);
        
        this.renderSales();
        this.showNotification(`Acesso Premium liberado para ${sale.customerName}!`, 'success');
    }

    upgradeToPremium() {
        if (!this.currentSaleDetails) return;
        
        this.quickUpgradeToPremium(this.currentSaleDetails.id);
        this.populateSaleDetailsModal(this.currentSaleDetails);
    }

    sendWelcomeNotification() {
        if (!this.currentSaleDetails) return;
        
        // Simular envio de notificação
        this.showNotification(`Notificação de boas-vindas enviada para ${this.currentSaleDetails.customerName}!`, 'success');
    }

    processSaleRefund() {
        if (!this.currentSaleDetails) return;
        
        const sale = this.currentSaleDetails;
        if (sale.status !== 'approved') {
            this.showNotification('Apenas vendas aprovadas podem ser reembolsadas', 'error');
            return;
        }
        
        sale.status = 'refunded';
        sale.refundDate = new Date().toISOString();
        sale.refundReason = 'Reembolso processado pelo admin';
        sale.planGranted = 'free';
        
        // Simular downgrade do usuário
        this.downgradeUserFromPremium(sale.customerEmail);
        
        this.renderSales();
        this.updateStats();
        this.closeSaleDetailsModal();
        
        this.showNotification(`Reembolso processado para ${sale.customerName}`, 'success');
    }

    resendAccess() {
        if (!this.currentSaleDetails) return;
        
        // Simular reenvio de acesso
        this.showNotification(`Informações de acesso reenviadas para ${this.currentSaleDetails.customerName}!`, 'success');
    }

    processAutomations(sale) {
        if (!this.webhookConfig.autoUpgrade && sale.planGranted === 'premium') {
            this.upgradeUserToPremium(sale.customerEmail);
        }
        
        if (this.webhookConfig.sendNotifications) {
            this.sendWelcomeNotificationToUser(sale.customerEmail, sale.customerName);
        }
    }

    upgradeUserToPremium(email) {
        // Em produção, aqui faria uma chamada à API para upgrade do usuário
        console.log(`Upgrading user ${email} to premium`);
    }

    downgradeUserFromPremium(email) {
        // Em produção, aqui faria uma chamada à API para downgrade do usuário
        console.log(`Downgrading user ${email} from premium`);
    }

    sendWelcomeNotificationToUser(email, name) {
        // Em produção, aqui enviaria uma notificação real
        console.log(`Sending welcome notification to ${name} (${email})`);
    }

    // Métodos auxiliares
    generateTransactionId(origin) {
        const prefixes = {
            'kiwify': 'KW_',
            'stripe': 'ST_',
            'paypal': 'PP_',
            'manual': 'MANUAL_',
            'other': 'OTHER_'
        };
        
        const prefix = prefixes[origin] || 'TXN_';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        
        return prefix + timestamp + random;
    }

    getProductIdByName(productName) {
        // Em produção, isso viria de uma API ou banco de dados
        const productMap = {
            "Guía Completa de Alimentación Saludable": 1,
            "Planner Premium de 90 Dias": 2,
            "21-Day Transformation Challenge": 3,
            "Guía Especial de Meditación": 4,
            "Complete Wellness Bundle": 5
        };
        
        return productMap[productName] || 0;
    }

    formatPrice(price, currency) {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'BRL': 'R$'
        };
        
        return `${symbols[currency] || currency} ${price.toFixed(2)}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getOriginIcon(origin) {
        const icons = {
            'kiwify': '🥝 Kiwify',
            'stripe': '💳 Stripe',
            'paypal': '🅿️ PayPal',
            'manual': '📝 Manual',
            'other': '🔗 Outro'
        };
        return icons[origin] || origin;
    }

    getOriginText(origin) {
        const texts = {
            'kiwify': 'Kiwify',
            'stripe': 'Stripe',
            'paypal': 'PayPal',
            'manual': 'Manual',
            'other': 'Outro'
        };
        return texts[origin] || origin;
    }

    getStatusIcon(status) {
        const icons = {
            'approved': '✅ Aprovado',
            'pending': '⏳ Pendente',
            'refunded': '💸 Reembolsado',
            'cancelled': '❌ Cancelado'
        };
        return icons[status] || status;
    }

    getStatusText(status) {
        const texts = {
            'approved': 'Aprovado',
            'pending': 'Pendente',
            'refunded': 'Reembolsado',
            'cancelled': 'Cancelado'
        };
        return texts[status] || status;
    }

    getLanguageFlag(language) {
        const flags = {
            'es': '🇪🇸 ES',
            'pt': '🇧🇷 PT',
            'en': '🇺🇸 EN'
        };
        return flags[language] || language;
    }

    getPlanIcon(plan) {
        const icons = {
            'premium': '👑 Premium',
            'free': '🆓 Gratuito'
        };
        return icons[plan] || plan;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Remover após 4 segundos
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        if (document.getElementById('salesTable')) {
            window.salesManager = new SalesManager();
        }
    }, 100);
});