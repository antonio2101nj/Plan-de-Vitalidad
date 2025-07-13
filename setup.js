#!/usr/bin/env node

// Setup Script - Plan de Vitalidad
// Script para facilitar a configuração inicial do projeto

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🌱 Plan de Vitalidad - Setup Script');
console.log('====================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  try {
    console.log('📋 Configurando Firebase...\n');
    
    // Firebase Configuration
    const firebaseApiKey = await question('Digite sua Firebase API Key: ');
    const firebaseAuthDomain = await question('Digite seu Firebase Auth Domain: ');
    const firebaseProjectId = await question('Digite seu Firebase Project ID: ');
    const firebaseStorageBucket = await question('Digite seu Firebase Storage Bucket: ');
    const firebaseMessagingSenderId = await question('Digite seu Firebase Messaging Sender ID: ');
    const firebaseAppId = await question('Digite seu Firebase App ID: ');
    
    console.log('\n☁️ Configurando Cloudinary...\n');
    
    // Cloudinary Configuration
    const cloudinaryCloudName = await question('Digite seu Cloudinary Cloud Name: ');
    const cloudinaryUploadPreset = await question('Digite seu Cloudinary Upload Preset: ');
    const cloudinaryApiKey = await question('Digite sua Cloudinary API Key: ');
    
    // Update Firebase config
    const firebaseConfigPath = path.join(__dirname, 'src', 'firebase', 'firebase-config.js');
    let firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');
    
    firebaseConfig = firebaseConfig
      .replace('your-api-key-here', firebaseApiKey)
      .replace('plan-vitalidad.firebaseapp.com', firebaseAuthDomain)
      .replace('plan-vitalidad', firebaseProjectId)
      .replace('plan-vitalidad.appspot.com', firebaseStorageBucket)
      .replace('123456789', firebaseMessagingSenderId)
      .replace('your-app-id-here', firebaseAppId);
    
    fs.writeFileSync(firebaseConfigPath, firebaseConfig);
    
    // Update Cloudinary config
    const cloudinaryConfigPath = path.join(__dirname, 'src', 'cloudinary', 'upload.js');
    let cloudinaryConfig = fs.readFileSync(cloudinaryConfigPath, 'utf8');
    
    cloudinaryConfig = cloudinaryConfig
      .replace('your-cloud-name', cloudinaryCloudName)
      .replace('your-upload-preset', cloudinaryUploadPreset)
      .replace('your-api-key', cloudinaryApiKey);
    
    fs.writeFileSync(cloudinaryConfigPath, cloudinaryConfig);
    
    console.log('\n✅ Configuração concluída com sucesso!\n');
    
    // Generate demo users instructions
    console.log('📝 Próximos passos:');
    console.log('1. Acesse o Firebase Console');
    console.log('2. Vá para Authentication > Users');
    console.log('3. Crie os seguintes usuários:');
    console.log('   - admin@plandevitalidad.com (senha: demo123)');
    console.log('   - user@plandevitalidad.com (senha: demo123)');
    console.log('4. No Firestore, crie a collection "users" com os documentos:');
    console.log('\n   Para o admin:');
    console.log('   {');
    console.log('     "uid": "uid_do_admin",');
    console.log('     "email": "admin@plandevitalidad.com",');
    console.log('     "role": "admin",');
    console.log('     "displayName": "Administrador"');
    console.log('   }');
    console.log('\n   Para o usuário:');
    console.log('   {');
    console.log('     "uid": "uid_do_usuario",');
    console.log('     "email": "user@plandevitalidad.com",');
    console.log('     "role": "user",');
    console.log('     "displayName": "Usuário Demo"');
    console.log('   }');
    
    console.log('\n🔐 Regras de segurança do Firestore:');
    console.log('Cole as seguintes regras no Firebase Console > Firestore > Rules:');
    console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /media/{mediaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
    `);
    
    console.log('\n🚀 Para iniciar o projeto:');
    console.log('1. npm run dev');
    console.log('2. Acesse http://localhost:3000');
    console.log('3. Faça login com as credenciais demo');
    
    console.log('\n📱 Para testar PWA:');
    console.log('1. Sirva o projeto via HTTPS');
    console.log('2. Abra no Chrome/Edge');
    console.log('3. Clique no ícone de "Instalar" na barra de endereços');
    
    console.log('\n🎯 Projeto configurado com sucesso! 🌱');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setup();
}

module.exports = { setup };