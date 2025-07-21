// Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC6X05SSX-3Nv5yF3oVtovxCHzHC9qx5J8",
    authDomain: "app-vitalidade.firebaseapp.com",
    projectId: "app-vitalidade",
    storageBucket: "app-vitalidade.firebasestorage.app",
    messagingSenderId: "360435217676",
    appId: "1:360435217676:web:3bce7a5fa30305a8dc0529",
    measurementId: "G-BN5KS1HYR9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoading() {
    loading.style.display = 'block';
    loginBtn.disabled = true;
}

function hideLoading() {
    loading.style.display = 'none';
    loginBtn.disabled = false;
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    showLoading();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verificar se é admin
        let isAdmin = false;
        if (email === 'antonio.n.21lsantos@gmail.com') {
            isAdmin = true;
        } else {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    isAdmin = userData.role === 'admin';
                }
            } catch (error) {
                console.log('Erro ao verificar role do usuário:', error);
            }
        }

        // Redirecionar baseado no tipo de usuário
        if (isAdmin) {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }

    } catch (error) {
        hideLoading();
        console.error('Erro no login:', error);
        
        let errorMsg = 'Erro ao fazer login. Tente novamente.';
        if (error.code === 'auth/invalid-credential') {
            errorMsg = 'Email ou senha incorretos.';
        } else if (error.code === 'auth/user-not-found') {
            errorMsg = 'Usuário não encontrado.';
        } else if (error.code === 'auth/wrong-password') {
            errorMsg = 'Senha incorreta.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMsg = 'Muitas tentativas. Tente novamente mais tarde.';
        }
        
        showError(errorMsg);
    }
});