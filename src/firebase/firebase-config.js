// Firebase Configuration - Plan de Vitalidad
// Configuração do Firebase Authentication e Firestore

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

// Configuração do Firebase (substitua pelas suas credenciais)
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "plan-vitalidad.firebaseapp.com",
  projectId: "plan-vitalidad",
  storageBucket: "plan-vitalidad.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Auth Functions
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerUser = async (email, password, displayName, role = 'user') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore Functions
export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return 'user'; // default role
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};

export const updateUserRole = async (uid, role) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      role: role,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Media Functions
export const addMedia = async (mediaData) => {
  try {
    const docRef = await addDoc(collection(db, 'media'), {
      ...mediaData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMedia = async () => {
  try {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const subscribeToMedia = (callback) => {
  const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const media = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(media);
  });
};

export const deleteMedia = async (mediaId) => {
  try {
    await deleteDoc(doc(db, 'media', mediaId));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Utility Functions
export const isAdmin = async (user) => {
  if (!user) return false;
  const role = await getUserRole(user.uid);
  return role === 'admin';
};

export const isUser = async (user) => {
  if (!user) return false;
  const role = await getUserRole(user.uid);
  return role === 'user';
};

export default app;