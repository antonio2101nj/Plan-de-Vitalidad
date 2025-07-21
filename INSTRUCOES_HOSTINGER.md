# 🚀 Instruções de Implementação na Hostinger

## 📋 Checklist de Implementação

### ✅ Passo 1: Estrutura de Diretórios

1. **Acesse o painel da Hostinger**
2. **Vá até o Gerenciador de Arquivos**
3. **Navegue até o diretório do subdomínio**: `app.plandevitalidad.com`
4. **Crie a seguinte estrutura**:

```
app.plandevitalidad.com/
├── 📁 uploads/
│   ├── 📁 imagens/
│   └── 📁 pdfs/
└── 📁 assets/
    └── 📁 js/
```

### ✅ Passo 2: Upload dos Arquivos

**Fazer upload dos seguintes arquivos na RAIZ do subdomínio**:

1. `index.html` (arquivo principal de login)
2. `admin-dashboard.html` (painel administrativo)
3. `user-dashboard.html` (painel do usuário)
4. `upload.php` (script de upload)
5. `manifest.json` (configuração PWA)
6. `.htaccess` (configurações do servidor)

**Na pasta `assets/js/`**:
- `auth.js` (script de autenticação)

### ✅ Passo 3: Configuração de Permissões

**No Gerenciador de Arquivos da Hostinger**:

1. **Clique com botão direito na pasta `uploads/`**
2. **Selecione "Permissões"**
3. **Configure para `755` (rwxr-xr-x)**
4. **Marque "Aplicar recursivamente"**
5. **Clique em "Salvar"**

### ✅ Passo 4: Teste de Conectividade

**URLs que devem estar acessíveis**:

- ✅ `https://app.plandevitalidad.com/` (página de login)
- ✅ `https://app.plandevitalidad.com/admin-dashboard.html`
- ✅ `https://app.plandevitalidad.com/user-dashboard.html`
- ✅ `https://app.plandevitalidad.com/upload.php`
- ✅ `https://app.plandevitalidad.com/uploads/imagens/`

## 🔧 Configuração PHP

### Verificar Extensões PHP Necessárias

Na Hostinger, acesse **Configurações PHP** e certifique-se de que estão ativadas:

- ✅ `GD Library` (para processamento de imagens)
- ✅ `cURL` (para requisições HTTP)
- ✅ `JSON` (para respostas API)
- ✅ `File Upload` habilitado

### Configurações Recomendadas

```ini
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 60
memory_limit = 256M
```

## 🔐 Configuração Firebase

### 1. Console Firebase

1. **Acesse**: [Firebase Console](https://console.firebase.google.com/)
2. **Selecione o projeto**: `app-vitalidade`
3. **Verifique Authentication** está ativado
4. **Verifique Firestore** está configurado

### 2. Regras do Firestore

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

### 3. Domínios Autorizados

No Firebase Console:
1. **Authentication > Settings > Authorized domains**
2. **Adicionar**: `app.plandevitalidad.com`

## 🧪 Testes Pós-Implementação

### Teste 1: Página de Login
- [ ] Acessa `https://app.plandevitalidad.com/`
- [ ] Formulário de login aparece
- [ ] Não há erros no console

### Teste 2: Autenticação Admin
- [ ] Login com `antonio.n.21lsantos@gmail.com`
- [ ] Redireciona para painel admin
- [ ] Painel carrega corretamente

### Teste 3: Upload de Imagem
- [ ] Seleciona uma imagem no painel admin
- [ ] Upload completa sem erros
- [ ] Imagem aparece no preview
- [ ] Banner é salvo no Firestore

### Teste 4: Painel Usuário
- [ ] Login com usuário normal
- [ ] Redireciona para painel usuário
- [ ] Banners aparecem no slider
- [ ] Navegação funciona

### Teste 5: Tempo Real
- [ ] Adiciona banner no painel admin
- [ ] Banner aparece automaticamente no painel usuário
- [ ] Sem necessidade de atualizar página

## 🐛 Resolução de Problemas Comuns

### ❌ Erro 500 no upload.php

**Possíveis causas**:
1. **Permissões incorretas** → Configure pasta `uploads/` como `755`
2. **PHP GD não instalado** → Ative no painel da Hostinger
3. **Limite de upload excedido** → Aumente `upload_max_filesize`

**Solução**:
```bash
# Verificar logs de erro
tail -f /path/to/error.log
```

### ❌ CORS Error

**Causa**: Headers não configurados corretamente

**Solução**: Verificar se `.htaccess` está no lugar correto

### ❌ Firebase não conecta

**Possíveis causas**:
1. **Domínio não autorizado** → Adicionar no Firebase Console
2. **HTTPS obrigatório** → Verificar se SSL está ativo
3. **CSP muito restritivo** → Ajustar no `.htaccess`

### ❌ Imagens não carregam

**Verificar**:
1. **Diretório existe**: `uploads/imagens/`
2. **Permissões corretas**: `755`
3. **URL acessível**: Testar diretamente no navegador

## 📞 Comandos Úteis para Debug

### Verificar Estrutura de Arquivos
```bash
# No terminal SSH da Hostinger (se disponível)
ls -la app.plandevitalidad.com/
ls -la app.plandevitalidad.com/uploads/
```

### Testar Upload Manual
```bash
# Criar arquivo teste
echo "test" > app.plandevitalidad.com/uploads/imagens/test.txt
```

### Verificar Logs
```bash
# Logs do Apache
tail -f /var/log/apache2/error.log

# Logs personalizados do app
tail -f app.plandevitalidad.com/uploads/logs/uploads.log
```

## ✅ Checklist Final

Antes de considerar a implementação completa:

- [ ] ✅ Todos os arquivos foram enviados
- [ ] ✅ Permissões estão corretas (755 para uploads/)
- [ ] ✅ PHP está configurado adequadamente
- [ ] ✅ Firebase está conectado
- [ ] ✅ SSL/HTTPS está funcionando
- [ ] ✅ Login admin funciona
- [ ] ✅ Upload de imagens funciona
- [ ] ✅ Painel usuário mostra banners
- [ ] ✅ Sincronização tempo real funciona
- [ ] ✅ Aplicativo funciona em mobile

## 🎯 URLs de Teste

**Após implementação, testar todos estes links**:

1. https://app.plandevitalidad.com/
2. https://app.plandevitalidad.com/admin-dashboard.html
3. https://app.plandevitalidad.com/user-dashboard.html
4. https://app.plandevitalidad.com/manifest.json
5. https://app.plandevitalidad.com/uploads/imagens/

**Todos devem responder sem erro 404 ou 500.**

---

## 🆘 Em Caso de Problemas

1. **Verificar logs de erro** no painel da Hostinger
2. **Testar cada componente** individualmente
3. **Verificar console do navegador** para erros JavaScript
4. **Confirmar configurações Firebase** no console
5. **Verificar permissões de arquivo** via gerenciador

**Lembre-se**: A Hostinger pode levar alguns minutos para propagar mudanças DNS e SSL.