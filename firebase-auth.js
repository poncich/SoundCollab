// firebase-auth.js - ПРОСТАЯ ВЕРСИЯ БЕЗ import/export

console.log('🔧 Загрузка простого Firebase модуля...');

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
window.firebaseApp = null;
window.firebaseAuth = null;
window.firebaseDb = null;
window.isFirebaseLoaded = false;

// Функция для загрузки Firebase
function loadFirebaseScripts() {
  return new Promise((resolve, reject) => {
    console.log('📦 Начинаем загрузку Firebase SDK...');
    
    // Скрипты для загрузки
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js',
      'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js',
      'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
    ];
    
    let loadedCount = 0;
    
    scripts.forEach(scriptUrl => {
      const script = document.createElement('script');
      script.src = scriptUrl;
      
      script.onload = () => {
        loadedCount++;
        console.log(`✅ Загружен: ${scriptUrl.split('/').pop()}`);
        
        if (loadedCount === scripts.length) {
          console.log('🎉 Все скрипты Firebase загружены');
          initializeFirebase();
          resolve();
        }
      };
      
      script.onerror = (error) => {
        console.error(`❌ Ошибка загрузки ${scriptUrl}:`, error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  });
}

// Инициализация Firebase
function initializeFirebase() {
  try {
    // Проверяем что firebase доступен
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK не загрузился');
    }
    
    // Инициализируем Firebase
    window.firebaseApp = firebase.initializeApp(firebaseConfig);
    window.firebaseAuth = firebase.auth();
    window.firebaseDb = firebase.firestore();
    window.isFirebaseLoaded = true;
    
    console.log('✅ Firebase успешно инициализирован!');
    console.log('📁 Проект:', firebaseConfig.projectId);
    
  } catch (error) {
    console.error('❌ Ошибка инициализации Firebase:', error);
    window.isFirebaseLoaded = false;
  }
}

// Функция входа
async function loginUser(email, password) {
  if (!window.isFirebaseLoaded || !window.firebaseAuth) {
    throw new Error('Firebase не загружен');
  }
  
  try {
    console.log('🔐 Попытка входа:', email);
    
    // Выполняем вход
    const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
    console.log('✅ Вход успешен:', userCredential.user.uid);
    
    // Получаем данные пользователя
    const userDoc = await window.firebaseDb.collection('users').doc(userCredential.user.uid).get();
    
    let userData;
    if (userDoc.exists) {
      userData = userDoc.data();
    } else {
      // Создаем профиль если не существует
      userData = {
        email: email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
        isPremium: false
      };
      await window.firebaseDb.collection('users').doc(userCredential.user.uid).set(userData);
    }
    
    // Формируем объект пользователя
    const user = {
      uid: userCredential.user.uid,
      email: email,
      displayName: userData.displayName || email.split('@')[0],
      isPremium: userData.isPremium || false,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=667eea&color=fff`
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    return user;
    
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    
    // Преобразуем ошибку Firebase
    let errorMessage = 'Ошибка входа';
    if (error.code === 'auth/user-not-found') errorMessage = 'Пользователь не найден';
    if (error.code === 'auth/wrong-password') errorMessage = 'Неверный пароль';
    if (error.code === 'auth/invalid-email') errorMessage = 'Некорректный email';
    
    throw new Error(errorMessage);
  }
}

// Автоматически загружаем Firebase при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM загружен, начинаем загрузку Firebase...');
  loadFirebaseScripts().catch(error => {
    console.warn('⚠️ Firebase не загрузился:', error);
  });
});

// Делаем функции доступными глобально
window.loginUser = loginUser;
window.loadFirebase = loadFirebaseScripts;

console.log('✅ Простой Firebase модуль загружен');
