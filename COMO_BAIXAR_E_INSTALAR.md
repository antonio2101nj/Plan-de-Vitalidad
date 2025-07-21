# 🚀 Como Baixar e Instalar - Plan de Vitalidad

## 📥 ARQUIVOS DISPONÍVEIS AGORA

### ✅ **OPÇÃO 1: Download Individual (RECOMENDADO)**

#### Baixe TODOS estes arquivos da pasta `/workspace/`:

1. **`dist-pronto-hostinger.zip`** (14KB) - Interface completa
2. **`upload-php.zip`** (2.3KB) - Script PHP

#### Ou baixe da pasta `/workspace/dist-hostinger/`:

1. **`index.html`** - Página de login
2. **`admin-dashboard.html`** - Painel admin 
3. **`user-dashboard.html`** - Painel usuário
4. **`upload.php`** - Script de upload
5. **`manifest.json`** - Configuração PWA
6. **`.htaccess`** - Configurações servidor
7. **`assets/js/auth.js`** - Script de autenticação

### ✅ **OPÇÃO 2: Download Completo**

Baixe: **`plan-vitalidad-app.zip`** (22KB) - Projeto completo

---

## 🛠️ INSTALAÇÃO NA HOSTINGER

### Passo 1: Upload dos Arquivos
1. Acesse **Gerenciador de Arquivos** da Hostinger
2. Navegue até `app.plandevitalidad.com`
3. **Upload todos os arquivos** na RAIZ

### Passo 2: Criar Diretórios
Crie estas pastas:
```
uploads/
├── imagens/
└── pdfs/
```

### Passo 3: Configurar Permissões
- Pasta `uploads/` → Permissão **755**
- Marque "Aplicar recursivamente"

### Passo 4: Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Authentication > Settings > Authorized domains**
3. **Adicione**: `app.plandevitalidad.com`

---

## 🎯 ESTRUTURA FINAL

```
app.plandevitalidad.com/
├── index.html ✅
├── admin-dashboard.html ✅
├── user-dashboard.html ✅
├── upload.php ✅
├── manifest.json ✅
├── .htaccess ✅
├── assets/
│   └── js/
│       └── auth.js ✅
└── uploads/
    ├── imagens/ ✅ (criar)
    └── pdfs/ ✅ (criar)
```

## 🧪 TESTE

Acesse estas URLs para testar:
- `https://app.plandevitalidad.com/` (login)
- `https://app.plandevitalidad.com/admin-dashboard.html`
- `https://app.plandevitalidad.com/user-dashboard.html`

## 👤 LOGIN ADMIN

**Email**: `antonio.n.21lsantos@gmail.com`
**Senha**: A que você definiu no Firebase

---

## 🆘 PROBLEMAS?

1. **Erro 404**: Verifique se todos os arquivos foram enviados
2. **Erro 500**: Verifique permissões da pasta uploads/
3. **Login não funciona**: Adicione domínio no Firebase
4. **Upload não funciona**: Verifique se upload.php existe

## 📞 Arquivos de Referência

- `README.md` - Documentação completa
- `INSTRUCOES_HOSTINGER.md` - Guia detalhado
- `DOWNLOADS.md` - Info sobre downloads