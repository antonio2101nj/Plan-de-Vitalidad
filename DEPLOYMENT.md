# 🚀 Guia de Deploy - Plan de Vitalidad PWA

## 📋 Pré-requisitos

### Serviços Necessários
- ✅ **Firebase Project** (Authentication + Firestore)
- ✅ **Cloudinary Account** (Upload preset configurado)
- ✅ **Servidor HTTPS** (para PWA funcionar)
- ✅ **Domínio personalizado** (opcional)

### Configuração Local
```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd plan-vitalidad

# 2. Instale dependências
npm install

# 3. Configure credenciais
node setup.js

# 4. Teste localmente
npm run dev
```

## 🌐 Opções de Deploy

### 1. Firebase Hosting (Recomendado)
```bash
# Instale Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

**Configuração firebase.json:**
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index-new.html"
      }
    ],
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Service-Worker-Allowed",
            "value": "/"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 2. Vercel
```bash
# Instale Vercel CLI
npm install -g vercel

# Deploy
vercel

# Produção
vercel --prod
```

**Configuração vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index-new.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index-new.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    }
  ]
}
```

### 3. Netlify
```bash
# Instale Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Produção
netlify deploy --prod
```

**Configuração netlify.toml:**
```toml
[build]
  publish = "."
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index-new.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Service-Worker-Allowed = "/"

[[headers]]
  for = "/manifest-new.json"
  [headers.values]
    Content-Type = "application/manifest+json"
```

### 4. Servidor Próprio (Apache/Nginx)

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index-new.html [L]

# PWA headers
<FilesMatch "sw\.js$">
    Header set Service-Worker-Allowed "/"
</FilesMatch>

<FilesMatch "manifest-new\.json$">
    Header set Content-Type "application/manifest+json"
</FilesMatch>

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index-new.html;

    # PWA support
    location / {
        try_files $uri $uri/ /index-new.html;
    }

    # Service Worker
    location /sw.js {
        add_header Service-Worker-Allowed "/";
        expires -1;
    }

    # Manifest
    location /manifest-new.json {
        add_header Content-Type "application/manifest+json";
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔐 Configuração de Segurança

### 1. Firebase Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /media/{mediaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 2. Cloudinary Security
```javascript
// Upload preset settings
{
  "unsigned": true,
  "folder": "plan-vitalidad",
  "allowed_formats": ["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm", "pdf"],
  "max_file_size": 10485760,
  "max_image_width": 2048,
  "max_image_height": 2048,
  "max_video_file_size": 52428800,
  "resource_type": "auto"
}
```

### 3. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://unpkg.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://res.cloudinary.com;
  connect-src 'self' https://api.cloudinary.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com;
  media-src 'self' https://res.cloudinary.com;
">
```

## 📊 Monitoramento e Analytics

### 1. Firebase Analytics
```javascript
// Em firebase-config.js
import { getAnalytics } from 'firebase/analytics';

const analytics = getAnalytics(app);
```

### 2. Google Analytics 4
```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. PWA Analytics
```javascript
// Track PWA install
window.addEventListener('beforeinstallprompt', (e) => {
  gtag('event', 'pwa_install_prompt_shown');
});

window.addEventListener('appinstalled', (evt) => {
  gtag('event', 'pwa_installed');
});
```

## 🧪 Testes Pre-Deploy

### 1. Lighthouse Audit
```bash
# Instale Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view

# PWA specific
lighthouse http://localhost:3000 --only-categories=pwa --view
```

### 2. PWA Validation
- [ ] Manifest válido
- [ ] Service Worker funcional
- [ ] Ícones corretos
- [ ] HTTPS habilitado
- [ ] Instalação funcional

### 3. Cross-browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## 📱 Otimizações Performance

### 1. Compressão de Assets
```bash
# Gzip compression
gzip -9 *.js *.css *.html

# Brotli compression
brotli -q 11 *.js *.css *.html
```

### 2. Image Optimization
```javascript
// Cloudinary auto-optimization
const optimizedUrl = generateOptimizedUrl(publicId, {
  width: 800,
  quality: 'auto',
  format: 'auto'
});
```

### 3. Code Splitting
```javascript
// Lazy loading components
const AdminPanel = lazy(() => import('./pages/AdminPanel.jsx'));
const UserPanel = lazy(() => import('./pages/UserPanel.jsx'));
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy PWA
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Service Worker não atualiza**
   - Force refresh (Ctrl+F5)
   - Clear cache
   - Update SW version

2. **PWA não instala**
   - Verifique HTTPS
   - Validate manifest
   - Check icons

3. **Upload falha**
   - Verify Cloudinary settings
   - Check CORS policy
   - Validate file size

### Debug Tools
```javascript
// Service Worker debug
navigator.serviceWorker.ready.then(registration => {
  console.log('SW registered:', registration);
});

// PWA install debug
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA install prompt available');
});
```

## 🎯 Checklist Final

- [ ] Firebase configurado
- [ ] Cloudinary configurado
- [ ] PWA manifest válido
- [ ] Service Worker ativo
- [ ] Ícones gerados
- [ ] HTTPS habilitado
- [ ] Testes realizados
- [ ] Analytics configurado
- [ ] Deploy realizado
- [ ] DNS configurado
- [ ] Monitoring ativo

## 🚀 Deploy Realizado!

Parabéns! Seu PWA Plan de Vitalidad está online e pronto para uso! 🌱

**Próximos passos:**
1. Compartilhe o link com seus usuários
2. Monitore analytics e performance
3. Colete feedback dos usuários
4. Implemente melhorias contínuas

**URLs importantes:**
- 🌐 **App**: https://seu-dominio.com
- 📊 **Analytics**: Firebase Console
- 🔧 **Admin**: https://seu-dominio.com (login admin)
- 👤 **User**: https://seu-dominio.com (login user)