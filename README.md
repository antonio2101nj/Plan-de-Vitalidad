# Plan de Vitalidad - Admin Panel

## 🌱 Sobre o Projeto

O **Plan de Vitalidad - Admin Panel** é um painel administrativo moderno, responsivo e funcional para gerenciar um aplicativo digital de saúde e bem-estar (PWA). O sistema foi desenvolvido com foco em alimentação saudável, estilo de vida equilibrado e desenvolvimento pessoal.

## ✨ Características Principais

### 🎨 Design e Interface
- Interface moderna e limpa com design intuitivo
- Totalmente responsivo (desktop e mobile)
- Paleta de cores: Verde (#10B981), Branco, Azul claro (#60A5FA)
- Sidebar com ícones para cada seção
- Menu lateral colapsável
- Animações suaves e transições elegantes

### 🌐 Multilíngue
- Suporte completo para 3 idiomas:
  - **Português (Brasil)** - Idioma padrão
  - **Español** - Idioma principal
  - **English** - Idioma internacional
- Troca de idioma em tempo real
- Interface totalmente traduzida

### 📱 Progressive Web App (PWA)
- Instalação automática no dispositivo
- Service Worker para cache inteligente
- Funcionamento offline
- Notificações push
- Ícones adaptativos

### 🌙 Modo Escuro/Claro
- Alternância entre temas claro e escuro
- Preferências salvas automaticamente
- Suporte a tema do sistema

## 🔧 Funcionalidades

### 📊 Seções Disponíveis
1. **Dashboard** - Visão geral com métricas importantes
2. **Usuários** - Gerenciamento de usuários
3. **Produtos Digitais** - Gestão de produtos
4. **Bônus e Materiais Extras** - Materiais complementares
5. **Conteúdos** - Gestão de conteúdo
6. **Desafios** - Sistema de desafios
7. **Criativos e Campanhas** - Materiais de marketing
8. **Imagens do Carrossel** - Gestão de imagens
9. **Loja (Tienda)** - E-commerce
10. **Vendas - Kiwify** - Integração com Kiwify
11. **Notificações Push** - Sistema de notificações
12. **Integrações e APIs** - Gestão de APIs
13. **Relatórios** - Analytics e relatórios
14. **Autoresponder** - Email marketing
15. **Personalização do App** - Customização
16. **Gamificação** - Sistema de pontos e conquistas
17. **Configurações Gerais** - Configurações do sistema
18. **Central de Suporte com IA** - Atendimento inteligente

### ⚡ Recursos Técnicos
- Navegação por abas dinâmica
- Armazenamento local de preferências
- Cache inteligente para performance
- Atalhos de teclado (Alt+S para sidebar, Alt+T para tema)
- Notificações do sistema
- Modo offline funcional

## 🚀 Como Usar

### 📋 Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web (Apache, Nginx, ou similar)
- Conexão com internet para recursos externos

### 🔧 Instalação
1. Faça o download dos arquivos
2. Coloque os arquivos em seu servidor web
3. Acesse via navegador
4. O sistema oferecerá instalação automática como PWA

### 🎯 Navegação
- **Menu Lateral**: Clique nos itens para navegar entre seções
- **Colapsar Sidebar**: Clique no ícone de menu ou use Alt+S
- **Trocar Tema**: Clique no ícone de lua/sol ou use Alt+T
- **Trocar Idioma**: Clique no seletor de idioma no cabeçalho
- **Mobile**: Use o botão de menu hambúrguer para acessar o menu

### ⚙️ Configurações
- **Idioma**: Português (padrão), Espanhol, Inglês
- **Tema**: Claro/Escuro (salvo automaticamente)
- **Sidebar**: Expandido/Colapsado (salvo automaticamente)
- **Aba Ativa**: Última aba visitada (salvo automaticamente)

## 🔗 Estrutura de Arquivos

```
plan-vitalidad-admin/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript principal
├── manifest.json       # Configuração PWA
├── service-worker.js   # Service Worker
└── README.md          # Documentação
```

## 🎨 Personalização

### 🎨 Cores Principais
```css
--primary-green: #10B981;
--light-blue: #60A5FA;
--white: #FFFFFF;
```

### 📐 Dimensões
- Sidebar: 280px (expandido), 80px (colapsado)
- Header: 70px de altura
- Breakpoint mobile: 768px

## 🔧 Desenvolvimento Futuro

### 🚀 Recursos Planejados
- Webhook universal de eventos
- Upload em lote (PDF, imagens, vídeos)
- Logs de falhas de API
- Logs de atividade de usuário
- Modo desenvolvedor
- Histórico de testes

### 🔌 Integrações
- APIs REST
- Webhooks
- Kiwify
- Sistemas de pagamento
- Ferramentas de email marketing

## 🌟 Recursos Avançados

### 🔒 Segurança
- Autenticação baseada em sessão
- Validação de formulários
- Proteção contra XSS
- Headers de segurança

### 📈 Performance
- Cache inteligente
- Lazy loading
- Compressão de recursos
- Otimização de imagens

### 🎯 Acessibilidade
- Navegação por teclado
- Contraste adequado
- Indicadores de foco
- Suporte a leitores de tela

## 📞 Suporte

### 🐛 Reportar Problemas
1. Verifique o console do navegador
2. Teste em modo incógnito
3. Limpe o cache se necessário
4. Documente o problema com screenshots

### 🔧 Solução de Problemas
- **PWA não instala**: Verifique se está em HTTPS
- **Não funciona offline**: Aguarde o cache ser criado
- **Idioma não muda**: Limpe o cache do navegador
- **Sidebar não colapsa**: Verifique se não está em modo mobile

## 📄 Licença

Este projeto foi desenvolvido como uma solução administrativa personalizada para o Plan de Vitalidad.

## 🎉 Agradecimentos

Desenvolvido com foco na melhor experiência do usuário e máxima funcionalidade para administradores de aplicativos de saúde e bem-estar.

---

**Plan de Vitalidad - Admin Panel** | Versão 1.0.0 | 2024
