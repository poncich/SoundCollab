// firebase-auth-simple.js - ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ
console.log('🔥 Инициализация Firebase Simple');

// Конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyAKrjtyk9pXAdTRLI_Jm7pM-bRjvX7O3cI",
  authDomain: "soundcollab-production.firebaseapp.com",
  projectId: "soundcollab-production",
  storageBucket: "soundcollab-production.firebasestorage.app",
  messagingSenderId: "1024413284863",
  appId: "1:1024413284863:web:1e051df31f3fd0b3f0cfca",
  measurementId: "G-TYM8HQZ0ZS"
};

// Глобальные переменные
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let isFirebaseLoaded = false;

// Загрузка Firebase
function loadFirebase() {
  return new Promise((resolve, reject) => {
    console.log('📦 Начинаем загрузку Firebase...');
    
    // Проверяем, не загружен ли уже
    if (typeof firebase !== 'undefined' && firebase.app) {
      console.log('✅ Firebase уже загружен');
      initFirebase();
      resolve();
      return;
    }
    
    // Загружаем Firebase SDK
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    
    // Загружаем все скрипты
    Promise.all([
      loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'),
      loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'),
      loadScript('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js')
    ])
    .then(() => {
      console.log('✅ Все Firebase SDK загружены');
      initFirebase();
      resolve();
    })
    .catch((error) => {
      console.error('❌ Ошибка загрузки Firebase:', error);
      reject(error);
    });
  });
}

// Инициализация Firebase
function initFirebase() {
  try {
    console.log('🔄 Инициализация Firebase...');
    
    // Проверяем что firebase доступен
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK не загрузился');
    }
    
    // Инициализируем
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseAuth = firebase.auth();
    firebaseDb = firebase.firestore();
    isFirebaseLoaded = true;
    
    console.log('✅ Firebase успешно инициализирован!');
    console.log('📁 Проект:', firebaseConfig.projectId);
    
    // Делаем глобальными
    window.firebaseApp = firebaseApp;
    window.firebaseAuth = firebaseAuth;
    window.firebaseDb = firebaseDb;
    window.isFirebaseLoaded = true;
    
  } catch (error) {
    console.error('❌ Ошибка инициализации Firebase:', error);
    isFirebaseLoaded = false;
  }
}

// Функция входа
async function login(email, password) {
  console.log('🔐 Попытка входа:', email);
  
  if (!isFirebaseLoaded) {
    throw new Error('Firebase не загружен');
  }
  
  try {
    // Вход
    const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
    console.log('✅ Вход успешен:', userCredential.user.uid);
    
    // Получаем данные пользователя
    const userDoc = await firebaseDb.collection('users').doc(userCredential.user.uid).get();
    
    let userData;
    if (userDoc.exists) {
      userData = userDoc.data();
    } else {
      // Создаем профиль
      userData = {
        email: email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        isPremium: false
      };
      await firebaseDb.collection('users').doc(userCredential.user.uid).set(userData);
    }
    
    // Формируем объект пользователя
    const user = {
      uid: userCredential.user.uid,
      email: email,
      displayName: userData.displayName || email.split('@')[0],
      isPremium: userData.isPremium || false,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=667eea&color=fff`
    };
    
    // Сохраняем
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    return user;
    
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    
    // Преобразуем ошибку
    let errorMsg = 'Ошибка входа';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMsg = 'Пользователь не найден';
        break;
      case 'auth/wrong-password':
        errorMsg = 'Неверный пароль';
        break;
      case 'auth/invalid-email':
        errorMsg = 'Некорректный email';
        break;
      case 'auth/too-many-requests':
        errorMsg = 'Слишком много попыток. Попробуйте позже';
        break;
    }
    
    throw new Error(errorMsg);
  }
}

// Автоматическая загрузка
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM загружен, загружаем Firebase...');
  loadFirebase().catch(error => {
    console.warn('⚠️ Firebase не загрузился, но демо-режим доступен:', error);
  });
});

// Делаем функции глобальными
window.loginUser = login;
window.loadFirebase = loadFirebase;
window.checkFirebase = () => console.log('Firebase loaded:', isFirebaseLoaded);

console.log('✅ Firebase Auth Simple модуль загружен');
