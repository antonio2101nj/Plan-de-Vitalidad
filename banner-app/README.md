# Plan de Vitalidad - Sistema de Banners

Sistema completo de gerenciamento de banners com painel administrativo e painel do usuário, desenvolvido com Firebase Authentication e upload direto para Hostinger.

## 🚀 Características

- **Autenticação Firebase**: Login seguro para admin e usuários
- **Painel Administrativo**: Gerenciamento completo de banners
- **Painel do Usuário**: Visualização de banners em slider responsivo
- **Upload Direto**: Imagens salvas diretamente na Hostinger
- **Tempo Real**: Sincronização automática entre painéis
- **PWA Ready**: Funciona como aplicativo nativo

## 📁 Estrutura do Projeto

```
banner-app/
├── dist/                    # Arquivos prontos para produção
│   ├── index.html          # Página de login principal
│   ├── admin-dashboard.html # Painel administrativo
│   ├── user-dashboard.html  # Painel do usuário
│   ├── manifest.json       # Configuração PWA
│   ├── .htaccess          # Configurações Apache
│   └── assets/
│       └── js/
│           └── auth.js     # Autenticação Firebase
├── backend/
│   └── upload.php         # Script de upload de imagens
└── src/                   # Código fonte
```

## 🛠️ Instalação na Hostinger

### 1. Upload dos Arquivos

1. Faça upload do conteúdo da pasta `dist/` para o diretório raiz do subdomínio `app.plandevitalidad.com`
2. Faça upload do arquivo `backend/upload.php` para `https://app.plandevitalidad.com/upload.php`

### 2. Configuração de Diretórios

Certifique-se de que os seguintes diretórios existam e tenham permissões de escrita:

```bash
https://app.plandevitalidad.com/uploads/imagens/
https://app.plandevitalidad.com/uploads/pdfs/
```

### 3. Estrutura Final na Hostinger

```
app.plandevitalidad.com/
├── index.html
├── admin-dashboard.html
├── user-dashboard.html
├── manifest.json
├── .htaccess
├── upload.php
├── assets/
│   └── js/
│       └── auth.js
└── uploads/
    ├── imagens/
    └── pdfs/
```

## 🔐 Configuração Firebase

O projeto já está configurado com as credenciais fornecidas:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC6X05SSX-3Nv5yF3oVtovxCHzHC9qx5J8",
    authDomain: "app-vitalidade.firebaseapp.com",
    projectId: "app-vitalidade",
    // ... outras configurações
};
```

### Regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /banners/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 👤 Acesso Administrativo

**Email do Administrador**: `antonio.n.21lsantos@gmail.com`

O sistema reconhece automaticamente este email como administrador. Outros usuários podem ser configurados no Firestore com `role: 'admin'`.

## 🎨 Funcionalidades do Painel Admin

- ✅ Upload de imagens (JPG, PNG, WebP até 5MB)
- ✅ Campos opcionais: título, descrição, botão CTA
- ✅ Preview em tempo real das imagens
- ✅ Visualização dos banners criados
- ✅ Exclusão de banners
- ✅ Arrastar e soltar para upload
- ✅ Otimização automática de imagens

### Recomendações de Imagem

- **Proporção**: 16:9 (ex: 1920x1080px)
- **Largura mínima**: 1200px
- **Formatos**: JPG, PNG, WebP
- **Tamanho máximo**: 5MB

## 🖥️ Funcionalidades do Painel Usuário

- ✅ Slider responsivo com transições suaves
- ✅ Atualização em tempo real dos banners
- ✅ Navegação por setas e pontos
- ✅ Slideshow automático (5 segundos)
- ✅ Suporte a gestos touch (mobile)
- ✅ Navegação por teclado (setas)
- ✅ Pause ao passar o mouse

## 📱 PWA (Progressive Web App)

O aplicativo pode ser instalado como app nativo no dispositivo:

- **Desktop**: Botão "Instalar" no navegador
- **Mobile**: "Adicionar à tela inicial"

## 🔧 Configurações Técnicas

### PHP Upload Script

- **Limite de arquivo**: 5MB
- **Tipos permitidos**: JPG, JPEG, PNG, WebP
- **Otimização**: Redimensionamento automático para máx. 1920x1080px
- **Segurança**: Validação de tipo MIME e extensão
- **CORS**: Configurado para aceitar requisições do domínio

### Firebase

- **Autenticação**: Email/senha
- **Firestore**: Armazenamento de dados dos banners
- **Tempo real**: Sincronização automática via `onSnapshot`

## 🚦 Como Usar

### Para Administradores

1. Acesse `https://app.plandevitalidad.com`
2. Faça login com as credenciais de admin
3. No painel administrativo:
   - Escolha quais elementos mostrar (título, descrição, botão)
   - Preencha os campos desejados
   - Faça upload da imagem
   - Clique em "Adicionar Banner"
4. Os banners aparecerão em tempo real no painel do usuário

### Para Usuários

1. Acesse `https://app.plandevitalidad.com`
2. Faça login com suas credenciais
3. Visualize os banners no slider central
4. Use as setas, pontos ou gestos para navegar

## 🔒 Segurança

- **HTTPS obrigatório**: Redirecionamento automático
- **Headers de segurança**: XSS Protection, Content Security Policy
- **Validação de arquivos**: Tipo MIME e extensão
- **Autenticação Firebase**: Tokens seguros
- **CORS configurado**: Apenas domínios autorizados

## 🐛 Resolução de Problemas

### Erro no Upload de Imagens

1. Verifique se o diretório `uploads/imagens/` existe
2. Confirme as permissões de escrita (755)
3. Verifique o tamanho do arquivo (máx. 5MB)
4. Confirme o formato (JPG, PNG, WebP)

### Problemas de Login

1. Verifique a conexão com Firebase
2. Confirme as credenciais no console Firebase
3. Verifique as regras do Firestore

### Banners não Aparecem

1. Verifique se há banners no Firestore
2. Confirme a autenticação do usuário
3. Verifique o console do navegador para erros

## 📞 Suporte

Para suporte técnico ou dúvidas sobre a implementação, consulte:

- Logs do servidor em `uploads/logs/uploads.log`
- Console do navegador para erros JavaScript
- Firebase Console para dados e autenticação

## 🔄 Atualizações Futuras

- [ ] Sistema de categorias de banners
- [ ] Agendamento de publicação
- [ ] Estatísticas de visualização
- [ ] Editor de imagem integrado
- [ ] Múltiplos idiomas