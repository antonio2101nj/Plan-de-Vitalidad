# 🚀 Guia de Hospedagem na Hostinger
## Plan de Vitalidad - app.plandevitalidad.com

### 📋 **LISTA DE ARQUIVOS NECESSÁRIOS**

Para hospedar o Plan de Vitalidad na Hostinger, você precisará dos seguintes arquivos:

#### **📁 Arquivos HTML (Páginas)**
```
admin-dashboard.html         - Painel administrativo
user-dashboard.html          - Painel do usuário
admin-login.html            - Login do admin
app-login.html              - Login do usuário
index.html                  - Página inicial
```

#### **📁 Arquivos JavaScript (Funcionalidades)**
```
config.js                   - Configurações do app
auth.js                     - Sistema de autenticação
shared-data.js              - Dados compartilhados
admin-integration.js        - Integração admin-usuário
user-dashboard.js           - Funcionalidades do usuário
script.js                   - Scripts do admin (se necessário)
```

#### **📁 Arquivos CSS (Estilos)**
```
styles.css                  - Estilos principais (se separado)
```

#### **📁 Arquivos de Documentação (Opcional)**
```
MANUAL_ADMIN_USUARIO.md     - Manual de uso
INTEGRACAO_RESUMO.md        - Resumo das funcionalidades
GUIA_HOSPEDAGEM_HOSTINGER.md - Este guia
```

---

## 🌐 **CONFIGURAÇÃO DO SUBDOMÍNIO**

### **1. Acessar o Painel da Hostinger**
1. Faça login na sua conta Hostinger
2. Vá para "Hospedagem" → "Gerenciar"
3. Clique em "Subdomínios"

### **2. Criar o Subdomínio**
1. Clique em "Criar Subdomínio"
2. Digite: `app`
3. Confirme que ficará: `app.plandevitalidad.com`
4. Escolha a pasta de destino (ex: `public_html/app`)

### **3. Configurar SSL (HTTPS)**
1. Vá para "SSL" no painel
2. Ative o SSL para `app.plandevitalidad.com`
3. Aguarde a ativação (pode levar até 24h)

---

## 📂 **ESTRUTURA DE PASTAS NA HOSTINGER**

```
public_html/app/
├── index.html
├── admin-dashboard.html
├── user-dashboard.html
├── admin-login.html
├── app-login.html
├── config.js
├── auth.js
├── shared-data.js
├── admin-integration.js
├── user-dashboard.js
└── assets/ (opcional)
    ├── images/
    ├── css/
    └── js/
```

---

## 📤 **UPLOAD DOS ARQUIVOS**

### **Método 1: File Manager da Hostinger**
1. No painel da Hostinger, vá para "File Manager"
2. Navegue até `public_html/app/`
3. Clique em "Upload"
4. Selecione todos os arquivos HTML e JS
5. Aguarde o upload completar

### **Método 2: FTP**
1. Use um cliente FTP (FileZilla, WinSCP)
2. Conecte com as credenciais FTP da Hostinger
3. Navegue até `/public_html/app/`
4. Transfira todos os arquivos

### **Método 3: Git Deploy (Avançado)**
```bash
# No terminal local
git clone https://github.com/antonio2101nj/Plan-de-Vitalidad.git
cd Plan-de-Vitalidad

# Compactar arquivos necessários
zip -r plan-vitalidad.zip *.html *.js *.md

# Upload via File Manager da Hostinger
```

---

## ⚙️ **CONFIGURAÇÕES NECESSÁRIAS**

### **1. Arquivo .htaccess (Opcional)**
Crie um arquivo `.htaccess` na pasta `public_html/app/`:

```apache
# Forçar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Página inicial
DirectoryIndex index.html

# Cache para arquivos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### **2. Configurar index.html**
Certifique-se de que o `index.html` redireciona corretamente:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Plan de Vitalidad</title>
    <meta http-equiv="refresh" content="0;url=admin-login.html">
</head>
<body>
    <script>
        window.location.href = 'admin-login.html';
    </script>
</body>
</html>
```

---

## 🔧 **VERIFICAÇÕES PÓS-INSTALAÇÃO**

### **1. Testar URLs**
Acesse cada URL para verificar funcionamento:

```
✅ https://app.plandevitalidad.com/
✅ https://app.plandevitalidad.com/admin-login.html
✅ https://app.plandevitalidad.com/app-login.html
✅ https://app.plandevitalidad.com/admin-dashboard.html
✅ https://app.plandevitalidad.com/user-dashboard.html
```

### **2. Testar Credenciais**
**Admin:**
- Email: `admin@plandevitalidad.com`
- Senha: `admin123`

**Usuário:**
- Email: `user@plandevitalidad.com`
- Senha: `user123`

### **3. Verificar Console**
1. Abra o console do navegador (F12)
2. Procure por erros JavaScript
3. Verifique se os logs aparecem:
   - `🚀 Plan de Vitalidad - Configuração carregada`
   - `✅ Sistema de Dados Compartilhados carregado`
   - `✅ AdminIntegration inicializado`

---

## 🛠️ **PERSONALIZAÇÃO PARA PRODUÇÃO**

### **1. Atualizar config.js**
```javascript
// Verificar se as URLs estão corretas
const CONFIG = {
    BASE_URL: 'https://app.plandevitalidad.com',
    // ... resto da configuração
};
```

### **2. Configurar E-mails**
Se quiser usar e-mails personalizados, edite em `auth.js`:

```javascript
DEMO_USERS: {
    'admin@plandevitalidad.com': {
        password: 'SUA_SENHA_SEGURA',
        role: 'admin',
        name: 'Seu Nome',
        permissions: ['all']
    }
}
```

### **3. Personalizar Visual**
- Logo: Edite as URLs de imagem nos arquivos HTML
- Cores: Modifique as variáveis CSS
- Textos: Altere os conteúdos nos arquivos HTML

---

## 📊 **MONITORAMENTO E MANUTENÇÃO**

### **1. Verificar Logs**
- Acesse o File Manager da Hostinger
- Verifique a pasta `logs` se disponível
- Monitore erros via console do navegador

### **2. Backup Regular**
- Download dos arquivos via File Manager
- Export das configurações via admin dashboard
- Backup do localStorage (dados dos usuários)

### **3. Atualizações**
Para atualizar o sistema:
1. Faça backup dos dados existentes
2. Substitua os arquivos via File Manager
3. Teste todas as funcionalidades
4. Verifique se os dados foram preservados

---

## 🔒 **SEGURANÇA**

### **1. Alterar Senhas Padrão**
```javascript
// Em auth.js, altere:
'admin@plandevitalidad.com': {
    password: 'SUA_SENHA_FORTE_AQUI', // Mude de 'admin123'
    // ...
}
```

### **2. Limitar Acesso**
- Configure IP whitelist na Hostinger (opcional)
- Use senhas complexas
- Ative 2FA na conta Hostinger

### **3. Monitorar Acessos**
- Verifique logs de acesso regularmente
- Monitore tentativas de login suspeitas
- Configure alertas de segurança

---

## 🚨 **RESOLUÇÃO DE PROBLEMAS**

### **Problema: Site não carrega**
**Soluções:**
1. Verificar se todos os arquivos foram enviados
2. Conferir permissões de arquivos (644 para HTML/JS)
3. Verificar configuração do subdomínio
4. Aguardar propagação DNS (até 24h)

### **Problema: Login não funciona**
**Soluções:**
1. Verificar console por erros JavaScript
2. Conferir se `auth.js` foi enviado
3. Testar com credenciais corretas
4. Limpar cache do navegador

### **Problema: Imagens não aparecem**
**Soluções:**
1. Verificar URLs das imagens
2. Certificar que as imagens estão acessíveis
3. Verificar permissões de pasta
4. Testar URLs diretamente no navegador

### **Problema: Funcionalidades não sincronizam**
**Soluções:**
1. Verificar se `shared-data.js` carregou
2. Confirmar se `localStorage` está habilitado
3. Testar em modo privado/anônimo
4. Verificar console por erros

---

## 📞 **SUPORTE TÉCNICO**

### **Hostinger:**
- Chat ao vivo: 24/7
- Base de conhecimento: help.hostinger.com
- Tickets de suporte via painel

### **Plan de Vitalidad:**
- Documentação: `MANUAL_ADMIN_USUARIO.md`
- Console logs para debug
- Backup e restauração via admin panel

---

## ✅ **CHECKLIST DE INSTALAÇÃO**

### **Antes de começar:**
- [ ] Conta Hostinger ativa
- [ ] Domínio plandevitalidad.com configurado
- [ ] Acesso ao painel de controle

### **Durante a instalação:**
- [ ] Subdomínio `app` criado
- [ ] SSL ativado
- [ ] Todos os arquivos enviados
- [ ] Permissões configuradas
- [ ] .htaccess criado (opcional)

### **Após a instalação:**
- [ ] URLs testadas
- [ ] Login admin funciona
- [ ] Login usuário funciona
- [ ] Integração admin-usuário testada
- [ ] Console sem erros críticos
- [ ] Backup inicial feito

### **Personalização:**
- [ ] Senhas alteradas
- [ ] E-mails configurados
- [ ] Visual personalizado
- [ ] Conteúdo atualizado

---

## 🎯 **RESULTADO ESPERADO**

Após seguir este guia, você terá:

✅ **App funcionando em**: `https://app.plandevitalidad.com`  
✅ **Painel admin completo** com todas as funcionalidades  
✅ **Painel usuário responsivo** e moderno  
✅ **Integração admin-usuário** funcionando  
✅ **Sistema seguro** com autenticação  
✅ **Upload de imagens** operacional  
✅ **Backup e recuperação** configurados  

---

**🚀 Seu Plan de Vitalidad estará online e pronto para uso profissional!**

*Guia atualizado em: Janeiro 2024*  
*Compatível com: Hostinger, cPanel, e servidores similares*