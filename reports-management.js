/**
 * Reports Management System
 * Sistema completo de relatórios e analytics
 */

class ReportsManager {
    constructor() {
        this.currentFilters = {
            dateRange: '30',
            language: '',
            userType: '',
            customDateFrom: '',
            customDateTo: ''
        };
        this.savedReports = [];
        this.charts = {};
        
        this.init();
    }

    init() {
        this.loadReportsData();
        this.setupEventListeners();
        this.renderAllReports();
        this.loadSavedReports();
        this.checkForAlerts();
        
        // Load Chart.js if not already loaded
        if (typeof Chart === 'undefined') {
            this.loadChartJS();
        }
    }

    loadChartJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            this.renderCharts();
        };
        document.head.appendChild(script);
    }

    loadReportsData() {
        // Simulated data - in production this would come from webhooks/API
        this.salesData = {
            totalRevenue: 12847.50,
            totalSales: 89,
            bestSellingProduct: "Planner Premium de 90 Dias",
            salesByProduct: [
                { name: "Guía Completa de Alimentación", sales: 23, revenue: 689.77 },
                { name: "Planner Premium de 90 Dias", sales: 31, revenue: 1484.90 },
                { name: "21-Day Transformation Challenge", sales: 18, revenue: 1206.00 },
                { name: "Complete Wellness Bundle", sales: 17, revenue: 1649.00 }
            ],
            salesByLanguage: {
                es: { sales: 34, revenue: 4532.45 },
                pt: { sales: 38, revenue: 5847.23 },
                en: { sales: 17, revenue: 2467.82 }
            },
            revenueByPlan: [
                { plan: "Premium", sales: 67, revenue: 9234.50, percentage: 71.9 },
                { plan: "Gratuito", sales: 22, revenue: 3613.00, percentage: 28.1 }
            ]
        };

        this.engagementData = {
            mostPopularChallenge: "Desafio 21 Dias",
            highestCompletionRate: 78.5,
            avgDaysCompleted: 14.2,
            activeUsers24h: 247,
            challengeSubscriptions: [
                { name: "Desafio 21 Dias", subscriptions: 1247 },
                { name: "Transformação 30 Dias", subscriptions: 893 },
                { name: "Bem-estar Total", subscriptions: 654 },
                { name: "Vida Saudável", subscriptions: 432 }
            ],
            completionRates: [
                { name: "Desafio 21 Dias", rate: 78.5 },
                { name: "Transformação 30 Dias", rate: 65.2 },
                { name: "Bem-estar Total", rate: 71.8 },
                { name: "Vida Saudável", rate: 58.9 }
            ]
        };

        this.productsData = {
            totalViews: 8947,
            mostAccessedProduct: "Guía de Meditación",
            readingRate: 67.3,
            productAccess: [
                { name: "Guía de Alimentación", views: 2341 },
                { name: "eBook Transformación", views: 1987 },
                { name: "Guía de Meditación", views: 2456 },
                { name: "Planner Wellness", views: 1823 },
                { name: "Bônus Receitas", views: 340 }
            ],
            accessByPlan: {
                free: { views: 3247, percentage: 36.3 },
                premium: { views: 5700, percentage: 63.7 }
            }
        };

        this.bonusData = {
            mostDownloadedBonus: "Receitas Detox",
            totalUnlocks: 1456,
            highestEngagementBonus: "Planner Semanal",
            bonusDownloads: [
                { name: "Receitas Detox", downloads: 423 },
                { name: "Planner Semanal", downloads: 387 },
                { name: "Guía de Ejercicios", downloads: 298 },
                { name: "Meditation Guide", downloads: 234 },
                { name: "Workout Plans", downloads: 114 }
            ],
            bonusEngagement: [
                { name: "Planner Semanal", engagement: 89.2 },
                { name: "Receitas Detox", engagement: 76.8 },
                { name: "Guía de Ejercicios", engagement: 71.4 },
                { name: "Meditation Guide", engagement: 68.9 },
                { name: "Workout Plans", engagement: 54.3 }
            ]
        };
    }

    setupEventListeners() {
        // Filters
        document.getElementById('reportsDateFilter').addEventListener('change', (e) => this.handleDateFilterChange(e.target.value));
        document.getElementById('reportsLanguageFilter').addEventListener('change', (e) => this.handleLanguageFilterChange(e.target.value));
        document.getElementById('reportsUserTypeFilter').addEventListener('change', (e) => this.handleUserTypeFilterChange(e.target.value));
        document.getElementById('reportsDateFrom').addEventListener('change', (e) => this.handleCustomDateChange());
        document.getElementById('reportsDateTo').addEventListener('change', (e) => this.handleCustomDateChange());

        // Export buttons
        document.getElementById('saveReportBtn').addEventListener('click', () => this.saveCurrentReport());
        document.getElementById('exportExcelBtn').addEventListener('click', () => this.exportToExcel());
        document.getElementById('generatePdfBtn').addEventListener('click', () => this.generatePDF());
    }

    handleDateFilterChange(value) {
        this.currentFilters.dateRange = value;
        const customGroup = document.getElementById('customDateGroup');
        
        if (value === 'custom') {
            customGroup.style.display = 'flex';
        } else {
            customGroup.style.display = 'none';
            this.applyFilters();
        }
    }

    handleLanguageFilterChange(value) {
        this.currentFilters.language = value;
        this.applyFilters();
    }

    handleUserTypeFilterChange(value) {
        this.currentFilters.userType = value;
        this.applyFilters();
    }

    handleCustomDateChange() {
        const dateFrom = document.getElementById('reportsDateFrom').value;
        const dateTo = document.getElementById('reportsDateTo').value;
        
        if (dateFrom && dateTo) {
            this.currentFilters.customDateFrom = dateFrom;
            this.currentFilters.customDateTo = dateTo;
            this.applyFilters();
        }
    }

    applyFilters() {
        // Simulate data filtering based on current filters
        this.renderAllReports();
        this.renderCharts();
    }

    renderAllReports() {
        this.renderSalesReport();
        this.renderEngagementReport();
        this.renderProductsReport();
        this.renderBonusReport();
    }

    renderSalesReport() {
        // Update sales statistics
        document.getElementById('totalRevenue').textContent = `$${this.salesData.totalRevenue.toLocaleString()}`;
        document.getElementById('totalSales').textContent = this.salesData.totalSales;
        document.getElementById('bestSellingProduct').textContent = this.salesData.bestSellingProduct;

        // Update revenue by plan table
        const tbody = document.getElementById('revenueByPlanTable');
        tbody.innerHTML = this.salesData.revenueByPlan.map(item => `
            <tr>
                <td>${item.plan}</td>
                <td>${item.sales}</td>
                <td>$${item.revenue.toLocaleString()}</td>
                <td>${item.percentage}%</td>
            </tr>
        `).join('');
    }

    renderEngagementReport() {
        document.getElementById('mostPopularChallenge').textContent = this.engagementData.mostPopularChallenge;
        document.getElementById('highestCompletionRate').textContent = `${this.engagementData.highestCompletionRate}%`;
        document.getElementById('avgDaysCompleted').textContent = this.engagementData.avgDaysCompleted;
        document.getElementById('activeUsers24h').textContent = this.engagementData.activeUsers24h;
    }

    renderProductsReport() {
        document.getElementById('totalProductViews').textContent = this.productsData.totalViews.toLocaleString();
        document.getElementById('mostAccessedProduct').textContent = this.productsData.mostAccessedProduct;
        document.getElementById('readingRate').textContent = `${this.productsData.readingRate}%`;
    }

    renderBonusReport() {
        document.getElementById('mostDownloadedBonus').textContent = this.bonusData.mostDownloadedBonus;
        document.getElementById('totalUnlocks').textContent = this.bonusData.totalUnlocks.toLocaleString();
        document.getElementById('highestEngagementBonus').textContent = this.bonusData.highestEngagementBonus;
    }

    renderCharts() {
        if (typeof Chart === 'undefined') {
            setTimeout(() => this.renderCharts(), 1000);
            return;
        }

        this.renderSalesCharts();
        this.renderEngagementCharts();
        this.renderProductsCharts();
        this.renderBonusCharts();
    }

    renderSalesCharts() {
        // Sales by Product Chart
        const salesByProductCtx = document.getElementById('salesByProductChart');
        if (salesByProductCtx && this.charts.salesByProduct) {
            this.charts.salesByProduct.destroy();
        }
        
        if (salesByProductCtx) {
            this.charts.salesByProduct = new Chart(salesByProductCtx, {
                type: 'bar',
                data: {
                    labels: this.salesData.salesByProduct.map(item => item.name),
                    datasets: [{
                        label: 'Vendas',
                        data: this.salesData.salesByProduct.map(item => item.sales),
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Sales by Language Chart
        const salesByLanguageCtx = document.getElementById('salesByLanguageChart');
        if (salesByLanguageCtx && this.charts.salesByLanguage) {
            this.charts.salesByLanguage.destroy();
        }
        
        if (salesByLanguageCtx) {
            const languageData = this.salesData.salesByLanguage;
            this.charts.salesByLanguage = new Chart(salesByLanguageCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Español', 'Português', 'English'],
                    datasets: [{
                        data: [languageData.es.sales, languageData.pt.sales, languageData.en.sales],
                        backgroundColor: [
                            'rgba(239, 68, 68, 0.6)',
                            'rgba(34, 197, 94, 0.6)',
                            'rgba(59, 130, 246, 0.6)'
                        ],
                        borderColor: [
                            'rgba(239, 68, 68, 1)',
                            'rgba(34, 197, 94, 1)',
                            'rgba(59, 130, 246, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    renderEngagementCharts() {
        // Challenge Subscriptions Chart
        const challengeSubsCtx = document.getElementById('challengeSubscriptionsChart');
        if (challengeSubsCtx && this.charts.challengeSubscriptions) {
            this.charts.challengeSubscriptions.destroy();
        }
        
        if (challengeSubsCtx) {
            this.charts.challengeSubscriptions = new Chart(challengeSubsCtx, {
                type: 'bar',
                data: {
                    labels: this.engagementData.challengeSubscriptions.map(item => item.name),
                    datasets: [{
                        label: 'Inscritos',
                        data: this.engagementData.challengeSubscriptions.map(item => item.subscriptions),
                        backgroundColor: 'rgba(168, 85, 247, 0.6)',
                        borderColor: 'rgba(168, 85, 247, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Challenge Completion Chart
        const challengeCompCtx = document.getElementById('challengeCompletionChart');
        if (challengeCompCtx && this.charts.challengeCompletion) {
            this.charts.challengeCompletion.destroy();
        }
        
        if (challengeCompCtx) {
            this.charts.challengeCompletion = new Chart(challengeCompCtx, {
                type: 'line',
                data: {
                    labels: this.engagementData.completionRates.map(item => item.name),
                    datasets: [{
                        label: 'Taxa de Conclusão (%)',
                        data: this.engagementData.completionRates.map(item => item.rate),
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    renderProductsCharts() {
        // Product Access Chart
        const productAccessCtx = document.getElementById('productAccessChart');
        if (productAccessCtx && this.charts.productAccess) {
            this.charts.productAccess.destroy();
        }
        
        if (productAccessCtx) {
            this.charts.productAccess = new Chart(productAccessCtx, {
                type: 'bar',
                data: {
                    labels: this.productsData.productAccess.map(item => item.name),
                    datasets: [{
                        label: 'Acessos',
                        data: this.productsData.productAccess.map(item => item.views),
                        backgroundColor: 'rgba(245, 158, 11, 0.6)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Access by Plan Chart
        const accessByPlanCtx = document.getElementById('accessByPlanChart');
        if (accessByPlanCtx && this.charts.accessByPlan) {
            this.charts.accessByPlan.destroy();
        }
        
        if (accessByPlanCtx) {
            const planData = this.productsData.accessByPlan;
            this.charts.accessByPlan = new Chart(accessByPlanCtx, {
                type: 'pie',
                data: {
                    labels: ['Gratuitos', 'Premium'],
                    datasets: [{
                        data: [planData.free.views, planData.premium.views],
                        backgroundColor: [
                            'rgba(156, 163, 175, 0.6)',
                            'rgba(245, 158, 11, 0.6)'
                        ],
                        borderColor: [
                            'rgba(156, 163, 175, 1)',
                            'rgba(245, 158, 11, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    renderBonusCharts() {
        // Bonus Downloads Chart
        const bonusDownloadsCtx = document.getElementById('bonusDownloadsChart');
        if (bonusDownloadsCtx && this.charts.bonusDownloads) {
            this.charts.bonusDownloads.destroy();
        }
        
        if (bonusDownloadsCtx) {
            this.charts.bonusDownloads = new Chart(bonusDownloadsCtx, {
                type: 'bar',
                data: {
                    labels: this.bonusData.bonusDownloads.map(item => item.name),
                    datasets: [{
                        label: 'Downloads',
                        data: this.bonusData.bonusDownloads.map(item => item.downloads),
                        backgroundColor: 'rgba(236, 72, 153, 0.6)',
                        borderColor: 'rgba(236, 72, 153, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Bonus Engagement Chart
        const bonusEngagementCtx = document.getElementById('bonusEngagementChart');
        if (bonusEngagementCtx && this.charts.bonusEngagement) {
            this.charts.bonusEngagement.destroy();
        }
        
        if (bonusEngagementCtx) {
            this.charts.bonusEngagement = new Chart(bonusEngagementCtx, {
                type: 'radar',
                data: {
                    labels: this.bonusData.bonusEngagement.map(item => item.name),
                    datasets: [{
                        label: 'Engajamento (%)',
                        data: this.bonusData.bonusEngagement.map(item => item.engagement),
                        backgroundColor: 'rgba(139, 69, 19, 0.2)',
                        borderColor: 'rgba(139, 69, 19, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(139, 69, 19, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(139, 69, 19, 1)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    toggleSection(sectionName) {
        const section = document.getElementById(`${sectionName}Section`);
        const toggle = section.parentElement.querySelector('.section-toggle i');
        
        if (section.style.display === 'none') {
            section.style.display = 'block';
            toggle.className = 'fas fa-chevron-up';
        } else {
            section.style.display = 'none';
            toggle.className = 'fas fa-chevron-down';
        }
    }

    checkForAlerts() {
        // Simulate alert detection
        const alertsSection = document.getElementById('alertsSection');
        const alertMessage = document.getElementById('alertMessage');
        
        // Check for significant drops in metrics
        const bonusViewsDrop = Math.random() > 0.7; // 30% chance of alert
        
        if (bonusViewsDrop) {
            alertMessage.textContent = "Detectada queda de 40% nas visualizações dos bônus nos últimos 7 dias.";
            alertsSection.style.display = 'block';
        }
    }

    closeAlert() {
        document.getElementById('alertsSection').style.display = 'none';
    }

    saveCurrentReport() {
        const reportName = prompt('Nome do relatório favorito:');
        if (!reportName) return;
        
        const report = {
            id: Date.now(),
            name: reportName,
            filters: { ...this.currentFilters },
            createdAt: new Date().toISOString(),
            type: 'custom'
        };
        
        this.savedReports.push(report);
        this.renderSavedReports();
        this.showNotification('Relatório salvo como favorito!', 'success');
    }

    loadSavedReports() {
        // Load some default saved reports
        this.savedReports = [
            {
                id: 1,
                name: "Vendas Mensais",
                filters: { dateRange: '30', language: '', userType: '' },
                createdAt: "2024-12-01T10:00:00Z",
                type: 'sales'
            },
            {
                id: 2,
                name: "Engajamento Premium",
                filters: { dateRange: '7', language: '', userType: 'premium' },
                createdAt: "2024-12-05T15:30:00Z",
                type: 'engagement'
            },
            {
                id: 3,
                name: "Produtos Español",
                filters: { dateRange: '30', language: 'es', userType: '' },
                createdAt: "2024-12-07T09:15:00Z",
                type: 'products'
            }
        ];
        
        this.renderSavedReports();
    }

    renderSavedReports() {
        const grid = document.getElementById('savedReportsGrid');
        
        if (this.savedReports.length === 0) {
            grid.innerHTML = `
                <div class="no-saved-reports">
                    <i class="fas fa-star"></i>
                    <h4>Nenhum relatório favorito</h4>
                    <p>Salve relatórios com filtros específicos para acesso rápido.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.savedReports.map(report => `
            <div class="saved-report-card" onclick="reportsManager.loadSavedReport(${report.id})">
                <div class="report-header">
                    <h4>${report.name}</h4>
                    <div class="report-actions">
                        <button class="btn-icon" onclick="event.stopPropagation(); reportsManager.deleteSavedReport(${report.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="report-info">
                    <span class="report-type">${this.getReportTypeIcon(report.type)} ${this.getReportTypeName(report.type)}</span>
                    <span class="report-date">${this.formatDate(report.createdAt)}</span>
                </div>
                <div class="report-filters">
                    ${this.getFiltersDescription(report.filters)}
                </div>
            </div>
        `).join('');
    }

    getReportTypeIcon(type) {
        const icons = {
            sales: '💰',
            engagement: '🏆',
            products: '📚',
            bonus: '🎁',
            custom: '⭐'
        };
        return icons[type] || '📊';
    }

    getReportTypeName(type) {
        const names = {
            sales: 'Vendas',
            engagement: 'Engajamento',
            products: 'Produtos',
            bonus: 'Bônus',
            custom: 'Personalizado'
        };
        return names[type] || 'Relatório';
    }

    getFiltersDescription(filters) {
        const parts = [];
        
        if (filters.dateRange === 'custom') {
            parts.push(`${filters.customDateFrom} - ${filters.customDateTo}`);
        } else {
            parts.push(`Últimos ${filters.dateRange} dias`);
        }
        
        if (filters.language) {
            const languages = { es: 'Español', pt: 'Português', en: 'English' };
            parts.push(languages[filters.language]);
        }
        
        if (filters.userType) {
            const types = { free: 'Gratuitos', premium: 'Premium' };
            parts.push(types[filters.userType]);
        }
        
        return parts.join(' • ');
    }

    loadSavedReport(reportId) {
        const report = this.savedReports.find(r => r.id === reportId);
        if (!report) return;
        
        // Apply saved filters
        this.currentFilters = { ...report.filters };
        
        // Update UI
        document.getElementById('reportsDateFilter').value = report.filters.dateRange;
        document.getElementById('reportsLanguageFilter').value = report.filters.language || '';
        document.getElementById('reportsUserTypeFilter').value = report.filters.userType || '';
        
        if (report.filters.dateRange === 'custom') {
            document.getElementById('customDateGroup').style.display = 'flex';
            document.getElementById('reportsDateFrom').value = report.filters.customDateFrom;
            document.getElementById('reportsDateTo').value = report.filters.customDateTo;
        }
        
        this.applyFilters();
        this.showNotification(`Relatório "${report.name}" carregado!`, 'success');
    }

    deleteSavedReport(reportId) {
        if (confirm('Tem certeza que deseja excluir este relatório favorito?')) {
            this.savedReports = this.savedReports.filter(r => r.id !== reportId);
            this.renderSavedReports();
            this.showNotification('Relatório favorito excluído!', 'success');
        }
    }

    exportToExcel() {
        // Simulate Excel export
        const data = this.generateExportData();
        const csvContent = this.convertToCSV(data);
        this.downloadFile(csvContent, 'relatorio-plan-vitalidad.csv', 'text/csv');
        this.showNotification('Relatório exportado para Excel!', 'success');
    }

    generatePDF() {
        // Simulate PDF generation
        this.showNotification('Gerando relatório em PDF...', 'info');
        
        setTimeout(() => {
            this.showNotification('Relatório PDF gerado com sucesso!', 'success');
        }, 2000);
    }

    generateExportData() {
        return {
            sales: this.salesData,
            engagement: this.engagementData,
            products: this.productsData,
            bonus: this.bonusData,
            filters: this.currentFilters,
            generatedAt: new Date().toISOString()
        };
    }

    convertToCSV(data) {
        const sections = [];
        
        // Sales data
        sections.push('VENDAS');
        sections.push('Produto,Vendas,Receita');
        data.sales.salesByProduct.forEach(item => {
            sections.push(`${item.name},${item.sales},${item.revenue}`);
        });
        sections.push('');
        
        // Engagement data
        sections.push('ENGAJAMENTO');
        sections.push('Desafio,Inscritos,Taxa Conclusão');
        data.engagement.challengeSubscriptions.forEach((item, index) => {
            const completion = data.engagement.completionRates[index];
            sections.push(`${item.name},${item.subscriptions},${completion ? completion.rate : 0}%`);
        });
        sections.push('');
        
        return sections.join('\n');
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('salesByProductChart')) {
            window.reportsManager = new ReportsManager();
        }
    }, 100);
});