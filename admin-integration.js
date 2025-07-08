// === INTEGRAÇÃO ADMIN x USUÁRIO ===
// Sistema de sincronização entre painéis

class AdminIntegration {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadIntegrationData();
    }

    setupEventListeners() {
        // Escutar mudanças nos dados compartilhados
        window.addEventListener('planVitalidadDataChange', () => {
            this.updatePreviewStats();
        });

        // Auto-save quando dados são modificados
        this.setupAutoSave();
    }

    setupAutoSave() {
        // Salvar automaticamente quando houver mudanças
        const saveInterval = setInterval(() => {
            if (window.sharedDataManager) {
                // Força uma sincronização a cada 30 segundos
                window.sharedDataManager.notifyDataChange();
            }
        }, 30000);
    }

    loadIntegrationData() {
        if (window.sharedDataManager) {
            this.updatePreviewStats();
        }
    }

    updatePreviewStats() {
        const data = window.sharedDataManager?.getData();
        if (!data) return;

        // Atualizar estatísticas do carrossel
        const carouselSlides = data.carousel?.slides?.filter(s => s.active) || [];
        const totalProducts = (data.products?.unlocked?.length || 0) + 
                             (data.products?.bonus?.length || 0) + 
                             (data.products?.locked?.length || 0);

        // Atualizar elementos do DOM
        this.updateStatsElement('totalCarouselImages', carouselSlides.length);
        this.updateStatsElement('totalProducts', totalProducts);
    }

    updateStatsElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // === MODAL DE PRODUTO ===
    openProductModal() {
        const modal = this.createProductModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    createProductModal() {
        const modal = document.createElement('div');
        modal.className = 'integration-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus-circle"></i> Adicionar Novo Produto</h3>
                    <button class="modal-close" onclick="this.closest('.integration-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="productForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="productTitle">Título do Produto *</label>
                                <input type="text" id="productTitle" required placeholder="Ex: eBook Nutrição Vital">
                            </div>
                            <div class="form-group">
                                <label for="productType">Tipo de Produto *</label>
                                <select id="productType" required>
                                    <option value="">Selecionar tipo</option>
                                    <option value="eBook">📖 eBook</option>
                                    <option value="Video">🎥 Video</option>
                                    <option value="Audio">🎵 Audio</option>
                                    <option value="Planner">📋 Planner</option>
                                    <option value="Guia">📚 Guia</option>
                                    <option value="Combo">📦 Combo</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="productCategory">Categoria</label>
                                <select id="productCategory">
                                    <option value="Nutrição">🥗 Nutrição</option>
                                    <option value="Fitness">💪 Fitness</option>
                                    <option value="Bem-estar">🧘 Bem-estar</option>
                                    <option value="Hábitos">🎯 Hábitos</option>
                                    <option value="Motivação">🔥 Motivação</option>
                                    <option value="Bônus">🎁 Bônus</option>
                                    <option value="Premium">👑 Premium</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="productStatus">Status *</label>
                                <select id="productStatus" required>
                                    <option value="unlocked">✅ Liberado</option>
                                    <option value="bonus">🎁 Bônus</option>
                                    <option value="locked">🔒 Bloqueado</option>
                                </select>
                            </div>
                            <div class="form-group full-width">
                                <label for="productDescription">Descrição</label>
                                <textarea id="productDescription" rows="3" placeholder="Descrição do produto..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="productImage">Imagem do Produto</label>
                                <div class="image-upload-container">
                                    <input type="file" id="productImageFile" accept="image/*" style="display: none;">
                                    <input type="url" id="productImage" placeholder="https://exemplo.com/imagem.jpg ou clique para upload">
                                    <button type="button" class="btn-upload" onclick="document.getElementById('productImageFile').click()">
                                        <i class="fas fa-upload"></i> Upload
                                    </button>
                                </div>
                                <div class="image-preview" id="productImagePreview" style="display: none;">
                                    <img src="" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 8px;">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="productThumbnail">Emoji/Thumbnail</label>
                                <input type="text" id="productThumbnail" placeholder="📖" maxlength="2">
                            </div>
                            <div class="form-group">
                                <label for="productUrl">URL do Arquivo</label>
                                <input type="url" id="productUrl" placeholder="https://exemplo.com/arquivo.pdf">
                            </div>
                            <div class="form-group">
                                <label for="productFileType">Tipo de Arquivo</label>
                                <select id="productFileType">
                                    <option value="pdf">📄 PDF</option>
                                    <option value="video">🎥 Video (MP4)</option>
                                    <option value="audio">🎵 Audio (MP3/WAV)</option>
                                    <option value="image">🖼️ Imagem</option>
                                    <option value="zip">📦 Arquivo ZIP</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="productProgress">Progresso Inicial (%)</label>
                                <input type="number" id="productProgress" min="0" max="100" value="0">
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="productFeatured">
                                    <span class="checkmark"></span>
                                    Produto em Destaque
                                </label>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.integration-modal').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                Salvar Produto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Adicionar event listener para o formulário
        const form = modal.querySelector('#productForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct(form);
        });

        // Adicionar event listener para upload de imagem
        const imageFileInput = modal.querySelector('#productImageFile');
        const imageUrlInput = modal.querySelector('#productImage');
        const imagePreview = modal.querySelector('#productImagePreview');
        
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file, imageUrlInput, imagePreview);
            }
        });

        // Preview quando URL é digitada
        imageUrlInput.addEventListener('input', (e) => {
            if (e.target.value) {
                this.showImagePreview(e.target.value, imagePreview);
            }
        });

        return modal;
    }

    saveProduct(form) {
        const formData = new FormData(form);
        const productData = {
            title: form.productTitle.value,
            type: form.productType.value,
            category: form.productCategory.value,
            status: form.productStatus.value,
            description: form.productDescription.value,
            image: form.productImage.value,
            thumbnail: form.productThumbnail.value || '📦',
            url: form.productUrl.value,
            fileType: form.productFileType.value,
            progress: parseInt(form.productProgress.value) || 0,
            featured: form.productFeatured.checked,
            order: Date.now() // Usar timestamp como ordem
        };

        // Validar dados obrigatórios
        if (!productData.title || !productData.type || !productData.status) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        // Salvar no sistema de dados compartilhados
        if (window.sharedDataManager) {
            const success = window.sharedDataManager.addProduct(productData);
            if (success) {
                this.showNotification('Produto adicionado com sucesso!', 'success');
                form.closest('.integration-modal').remove();
                this.updatePreviewStats();
            } else {
                this.showNotification('Erro ao salvar produto!', 'error');
            }
        }
    }

    // === MODAL DE BANNER ===
    openBannerModal() {
        const modal = this.createBannerModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    createBannerModal() {
        const currentBanner = window.sharedDataManager?.getBanners()?.home?.main || {};
        
        const modal = document.createElement('div');
        modal.className = 'integration-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-image"></i> Editar Banner Principal</h3>
                    <button class="modal-close" onclick="this.closest('.integration-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="bannerForm">
                        <div class="form-grid">
                            <div class="form-group full-width">
                                <label for="bannerTitle">Título do Banner *</label>
                                <input type="text" id="bannerTitle" required value="${currentBanner.title || ''}" placeholder="Ex: QUER FAZER UMA PARCERIA COM NOSSA PÁGINA OFICIAL">
                            </div>
                            <div class="form-group full-width">
                                <label for="bannerSubtitle">Subtítulo</label>
                                <input type="text" id="bannerSubtitle" value="${currentBanner.subtitle || ''}" placeholder="Ex: @PLANVITALIDAD">
                            </div>
                            <div class="form-group">
                                <label for="bannerCta">Texto do Botão</label>
                                <input type="text" id="bannerCta" value="${currentBanner.cta || ''}" placeholder="Ex: CLIQUE AQUI">
                            </div>
                            <div class="form-group">
                                <label for="bannerLink">Link do Banner</label>
                                <input type="url" id="bannerLink" value="${currentBanner.link || ''}" placeholder="https://instagram.com/planvitalidad">
                            </div>
                            <div class="form-group full-width">
                                <label for="bannerImage">URL da Imagem de Fundo</label>
                                <input type="url" id="bannerImage" value="${currentBanner.image || ''}" placeholder="https://exemplo.com/imagem.jpg">
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="bannerActive" ${currentBanner.active ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                    Banner Ativo
                                </label>
                            </div>
                        </div>
                        <div class="banner-preview">
                            <h4>Preview do Banner:</h4>
                            <div class="preview-banner" id="previewBanner">
                                <div class="preview-overlay">
                                    <h3 id="previewTitle">${currentBanner.title || 'Título do Banner'}</h3>
                                    <p id="previewSubtitle">${currentBanner.subtitle || 'Subtítulo'}</p>
                                    <button id="previewCta">${currentBanner.cta || 'CLIQUE AQUI'}</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.integration-modal').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                Salvar Banner
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Adicionar event listeners para preview em tempo real
        const form = modal.querySelector('#bannerForm');
        const previewTitle = modal.querySelector('#previewTitle');
        const previewSubtitle = modal.querySelector('#previewSubtitle');
        const previewCta = modal.querySelector('#previewCta');
        const previewBanner = modal.querySelector('#previewBanner');

        form.bannerTitle.addEventListener('input', () => {
            previewTitle.textContent = form.bannerTitle.value || 'Título do Banner';
        });

        form.bannerSubtitle.addEventListener('input', () => {
            previewSubtitle.textContent = form.bannerSubtitle.value || 'Subtítulo';
        });

        form.bannerCta.addEventListener('input', () => {
            previewCta.textContent = form.bannerCta.value || 'CLIQUE AQUI';
        });

        form.bannerImage.addEventListener('input', () => {
            if (form.bannerImage.value) {
                previewBanner.style.backgroundImage = `url('${form.bannerImage.value}')`;
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBanner(form);
        });

        return modal;
    }

    saveBanner(form) {
        const bannerData = {
            title: form.bannerTitle.value,
            subtitle: form.bannerSubtitle.value,
            cta: form.bannerCta.value,
            link: form.bannerLink.value,
            image: form.bannerImage.value,
            active: form.bannerActive.checked
        };

        if (!bannerData.title) {
            this.showNotification('Por favor, preencha o título do banner!', 'error');
            return;
        }

        if (window.sharedDataManager) {
            const success = window.sharedDataManager.updateBanner('home', 'main', bannerData);
            if (success) {
                this.showNotification('Banner atualizado com sucesso!', 'success');
                form.closest('.integration-modal').remove();
            } else {
                this.showNotification('Erro ao salvar banner!', 'error');
            }
        }
    }

    // === PREVIEW DO PAINEL USUÁRIO ===
    previewUserDashboard() {
        const previewWindow = window.open('user-dashboard.html', 'userPreview', 'width=1200,height=800');
        
        if (previewWindow) {
            this.showNotification('Painel do usuário aberto em nova janela!', 'info');
        } else {
            // Fallback: redirecionar na mesma janela
            window.open('user-dashboard.html', '_blank');
        }
    }

    // === SINCRONIZAÇÃO DE DADOS ===
    syncWithUserDashboard() {
        // Forçar sincronização imediata
        if (window.sharedDataManager) {
            window.sharedDataManager.notifyDataChange();
            this.showNotification('Dados sincronizados com o painel do usuário!', 'success');
        }
    }

    // === EXPORT/IMPORT ===
    exportConfiguration() {
        if (window.sharedDataManager) {
            window.sharedDataManager.exportData();
            this.showNotification('Configuração exportada com sucesso!', 'success');
        }
    }

    importConfiguration() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && window.sharedDataManager) {
                window.sharedDataManager.importData(file)
                    .then(() => {
                        this.showNotification('Configuração importada com sucesso!', 'success');
                        this.updatePreviewStats();
                    })
                    .catch(error => {
                        this.showNotification('Erro ao importar configuração!', 'error');
                        console.error(error);
                    });
            }
        };
        input.click();
    }

    // === UPLOAD DE IMAGENS ===
    handleImageUpload(file, urlInput, previewElement) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            this.showNotification('Por favor, selecione apenas arquivos de imagem!', 'error');
            return;
        }

        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Imagem muito grande! Máximo 5MB.', 'error');
            return;
        }

        // Converter para base64 (para demonstração - em produção usaria cloud storage)
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target.result;
            urlInput.value = base64Data;
            this.showImagePreview(base64Data, previewElement);
            this.showNotification('Imagem carregada com sucesso!', 'success');
        };
        reader.onerror = () => {
            this.showNotification('Erro ao carregar imagem!', 'error');
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(url, previewElement) {
        const img = previewElement.querySelector('img');
        if (img) {
            img.src = url;
            previewElement.style.display = 'block';
        }
    }

    // === NOTIFICAÇÕES ===
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `integration-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // === ESTATÍSTICAS EM TEMPO REAL ===
    getRealtimeStats() {
        const data = window.sharedDataManager?.getData();
        if (!data) return null;

        return {
            carouselSlides: data.carousel?.slides?.filter(s => s.active)?.length || 0,
            totalProducts: (data.products?.unlocked?.length || 0) + 
                          (data.products?.bonus?.length || 0) + 
                          (data.products?.locked?.length || 0),
            unlockedProducts: data.products?.unlocked?.length || 0,
            bonusProducts: data.products?.bonus?.length || 0,
            lockedProducts: data.products?.locked?.length || 0,
            activeBanners: Object.values(data.banners || {}).reduce((count, section) => {
                return count + Object.values(section).filter(banner => banner.active).length;
            }, 0)
        };
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar o carregamento do sistema de dados compartilhados
    if (window.sharedDataManager) {
        window.adminIntegration = new AdminIntegration();
        console.log('✅ AdminIntegration inicializado');
    } else {
        // Tentar novamente após um pequeno delay
        setTimeout(() => {
            if (window.sharedDataManager) {
                window.adminIntegration = new AdminIntegration();
                console.log('✅ AdminIntegration inicializado (delayed)');
            }
        }, 1000);
    }
});

// Estilos CSS para os modais e notificações
const integrationStyles = `
<style>
.integration-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.integration-modal .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.integration-modal .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.integration-modal .modal-header h3 {
    margin: 0;
    color: #333;
}

.integration-modal .modal-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
    padding: 5px;
}

.integration-modal .modal-body {
    padding: 20px;
}

.integration-modal .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
}

.integration-modal .form-group.full-width {
    grid-column: 1 / -1;
}

.integration-modal .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #333;
}

.integration-modal .form-group input,
.integration-modal .form-group select,
.integration-modal .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.integration-modal .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.integration-modal .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
    position: relative;
}

.integration-modal .checkbox-label input:checked + .checkmark {
    background: #10B981;
    border-color: #10B981;
}

.integration-modal .checkbox-label input:checked + .checkmark:after {
    content: '✓';
    position: absolute;
    color: white;
    font-size: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.integration-modal .banner-preview {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
}

.integration-modal .preview-banner {
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-size: cover;
    background-position: center;
}

.integration-modal .preview-overlay {
    text-align: center;
    color: white;
    padding: 20px;
}

.integration-modal .preview-overlay h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
}

.integration-modal .preview-overlay p {
    margin: 0 0 15px 0;
    opacity: 0.9;
}

.integration-modal .preview-overlay button {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
}

.integration-modal .image-upload-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.integration-modal .image-upload-container input[type="url"] {
    flex: 1;
}

.integration-modal .btn-upload {
    background: #10B981;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
}

.integration-modal .btn-upload:hover {
    background: #059669;
}

.integration-modal .image-preview {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #f9f9f9;
}

.integration-modal .image-preview img {
    border: 1px solid #ddd;
}

.integration-modal .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.integration-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10001;
    min-width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.integration-notification.success {
    border-left: 4px solid #10B981;
}

.integration-notification.error {
    border-left: 4px solid #EF4444;
}

.integration-notification.info {
    border-left: 4px solid #3B82F6;
}

.integration-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.integration-notification .notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 5px;
}

@media (max-width: 768px) {
    .integration-modal .form-grid {
        grid-template-columns: 1fr;
    }
    
    .integration-modal .modal-content {
        margin: 20px;
        max-width: calc(100% - 40px);
    }
}
</style>
`;

// Adicionar estilos ao documento
document.head.insertAdjacentHTML('beforeend', integrationStyles);

console.log('🔄 Sistema de Integração Admin-Usuário carregado');