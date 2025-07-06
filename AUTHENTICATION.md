# Sistema de Autenticação - Plan de Vitalidad

## 📋 Visão Geral

O sistema de autenticação do Plan de Vitalidad foi implementado com separação completa entre áreas administrativas e de usuários, com proteção de rotas, sessões persistentes e suporte multilíngue.

## 🔐 Estrutura do Sistema

### Arquitetura
- **Autenticação baseada em roles**: Admin e User
- **Sessões locais**: Persistem por 7 dias
- **Proteção de rotas**: Verificação automática de permissões
- **Redirecionamento inteligente**: Baseado no tipo de usuário

### Arquivos Principais
- `auth.js` - Sistema principal de autenticação
- `admin-login.html` - Login para administradores
- `app-login.html` - Login para usuários
- `admin-dashboard.html` - Painel administrativo
- `app-dashboard.html` - Painel do usuário
- `auth-styles.css` - Estilos para páginas de login
- `app-styles.css` - Estilos para painel do usuário

## 🚪 Pontos de Acesso

### Página Inicial
- **URL**: `index.html`
- **Função**: Redireciona automaticamente baseado na sessão existente
- **Comportamento**:
  - Se logado como admin → `admin-dashboard.html`
  - Se logado como usuário → `app-dashboard.html`
  - Se não logado → `app-login.html`

### Área Administrativa
- **Login**: `admin-login.html`
- **Dashboard**: `admin-dashboard.html`
- **Idioma**: Português do Brasil (fixo)
- **Recursos**: Todas as 18 abas administrativas

### Área do Usuário
- **Login**: `app-login.html`
- **Dashboard**: `app-dashboard.html`
- **Idiomas**: Português, Español, English
- **Recursos**: Dashboard pessoal, metas, atividades

## 👥 Tipos de Usuário

### 🛡️ Administrador
**Permissões**: Acesso total ao sistema
**Características**:
- Gerenciamento de usuários
- Configurações do sistema
- Relatórios completos
- Gestão de conteúdo
- Acesso a todas as 18 seções administrativas

**Credenciais Demo**:
```
Email: admin@planvitalidad.com
Senha: admin123

Email: antonio@planvitalidad.com
Senha: antonio123
```

### 👤 Usuário Comum
**Permissões**: Acesso ao painel pessoal
**Características**:
- Dashboard personalizado
- Metas de saúde
- Registro de atividades
- Progresso pessoal
- Configurações de perfil

**Credenciais Demo**:
```
Email: usuario@planvitalidad.com
Senha: user123
```

## 🔧 Funcionalidades

### Sistema de Autenticação

#### Login
```javascript
// Exemplo de uso
const result = await authSystem.login(email, password, rememberMe);
if (result.success) {
    // Login bem-sucedido
    console.log('Usuário logado:', result.user);
} else {
    // Erro no login
    console.log('Erro:', result.message);
}
```

#### Verificação de Permissões
```javascript
// Verificar se usuário está logado
if (authSystem.isLoggedIn()) {
    // Usuário autenticado
}

// Verificar se é admin
if (authSystem.isAdmin()) {
    // Usuário é administrador
}

// Verificar permissão específica
if (verificaPermissao('admin', 'users')) {
    // Usuário tem permissão para gerenciar usuários
}
```

#### Logout
```javascript
// Logout manual
authSystem.logout();

// Logout automático (sessão expirada)
// Acontece automaticamente após 7 dias
```

### Proteção de Rotas

O sistema implementa proteção automática que:

1. **Verifica sessão** ao carregar qualquer página
2. **Redireciona** usuários não autenticados para login
3. **Bloqueia** acesso cruzado entre áreas (admin/user)
4. **Renova** sessões automaticamente

### Gerenciamento de Sessão

#### Duração
- **Padrão**: 7 dias
- **Extensão**: Automática ao usar o sistema
- **Expiração**: Alerta antes do logout automático

#### Armazenamento
- **Local Storage**: Dados da sessão
- **Criptografia**: Não implementada (demo)
- **Limpeza**: Automática na expiração

## 🌍 Suporte Multilíngue

### Área do Usuário
- **Português (PT)**: Padrão
- **Español (ES)**: Completo
- **English (EN)**: Completo

### Área Administrativa
- **Português do Brasil**: Fixo
- **Razão**: Foco no mercado brasileiro

### Implementação
```javascript
// Trocar idioma
setLanguage('es'); // pt, es, en

// Obter texto traduzido
const text = userI18n[currentLanguage]['welcome-user'];
```

## 📱 Interface e UX

### Design System
- **Cores primárias**: Verde (#10B981), Azul (#60A5FA)
- **Temas**: Claro/Escuro (usuário), Verde (admin)
- **Tipografia**: Inter font
- **Ícones**: Font Awesome 6

### Responsive Design
- **Desktop**: Layout completo
- **Tablet**: Adaptado
- **Mobile**: Navegação inferior, menu colapsado

### Acessibilidade
- **Foco visível**: Contornos em elementos interativos
- **Contraste**: Atende WCAG 2.1
- **Navegação**: Suporte a teclado
- **Redução de movimento**: Respeitada

## 🔒 Segurança

### Implementações Atuais
- **Validação client-side**: Email e senha
- **Proteção de rotas**: Verificação de permissões
- **Sessões**: Expiração automática
- **Sanitização**: Prevenção básica de XSS

### Recomendações para Produção
- **HTTPS**: Obrigatório
- **Tokens JWT**: Substituir localStorage
- **Validação server-side**: Todas as operações
- **Rate limiting**: Proteção contra força bruta
- **2FA**: Autenticação de dois fatores
- **Criptografia**: Dados sensíveis

## 🚀 Uso e Testes

### Iniciar Aplicação
```bash
# Servidor local
python3 -m http.server 8000

# Acesso
http://localhost:8000
```

### Fluxos de Teste

#### Teste 1: Login Admin
1. Acesse `admin-login.html`
2. Use: `admin@planvitalidad.com` / `admin123`
3. Verifique redirecionamento para `admin-dashboard.html`
4. Teste todas as 18 abas do menu

#### Teste 2: Login Usuário
1. Acesse `app-login.html`
2. Use: `usuario@planvitalidad.com` / `user123`
3. Verifique redirecionamento para `app-dashboard.html`
4. Teste troca de idiomas

#### Teste 3: Proteção de Rotas
1. Tente acessar `admin-dashboard.html` sem login
2. Deve redirecionar para `admin-login.html`
3. Faça login como usuário
4. Tente acessar área admin - deve ser bloqueado

#### Teste 4: Sessão Persistente
1. Faça login marcando "lembrar"
2. Feche e reabra o navegador
3. Acesse `index.html`
4. Deve redirecionar automaticamente

### Resolução de Problemas

#### Problema: Não redireciona após login
**Solução**: Verifique se `auth.js` está carregado corretamente

#### Problema: Perde sessão ao recarregar
**Solução**: Verifique localStorage no DevTools

#### Problema: Acesso negado constante
**Solução**: Limpe localStorage e faça novo login

## 📈 Próximos Passos

### Funcionalidades Planejadas
- [ ] **Backend Integration**: API REST para autenticação
- [ ] **Database**: Armazenamento de usuários
- [ ] **Password Recovery**: Sistema de recuperação
- [ ] **User Registration**: Cadastro de novos usuários
- [ ] **Profile Management**: Edição de perfil
- [ ] **Activity Logs**: Registro de ações
- [ ] **Admin User Management**: CRUD de usuários
- [ ] **Role Management**: Gestão de permissões

### Melhorias Técnicas
- [ ] **TypeScript**: Tipagem estática
- [ ] **Testing**: Testes automatizados
- [ ] **CI/CD**: Pipeline de deploy
- [ ] **Monitoring**: Logs e métricas
- [ ] **Performance**: Otimizações
- [ ] **PWA**: Funcionalidades offline

## 📞 Suporte

### Credenciais Demo Completas
```
# Administradores
admin@planvitalidad.com / admin123
antonio@planvitalidad.com / antonio123

# Usuário
usuario@planvitalidad.com / user123
```

### Estrutura de Arquivos
```
/
├── index.html              # Página inicial
├── auth.js                 # Sistema de autenticação
├── admin-login.html        # Login admin
├── admin-dashboard.html    # Painel admin
├── app-login.html         # Login usuário
├── app-dashboard.html     # Painel usuário
├── auth-styles.css        # Estilos de autenticação
├── app-styles.css         # Estilos do usuário
├── styles.css             # Estilos admin (existente)
├── script.js              # Scripts admin (existente)
├── manifest.json          # PWA manifest
└── service-worker.js      # Service Worker
```

### Console Debugging
```javascript
// Verificar status de autenticação
console.log('Logado:', authSystem.isLoggedIn());
console.log('Usuário:', authSystem.getCurrentUser());
console.log('É admin:', authSystem.isAdmin());

// Forçar logout
authSystem.logout();

// Verificar sessão
console.log('Sessão:', localStorage.getItem('planVitalidad_session'));
```

---

**Desenvolvido para Plan de Vitalidad** - Sistema de Autenticação v1.0