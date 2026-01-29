// firebase-simple.js - РАБОЧАЯ ВЕРСИЯ БЕЗ МОДУЛЕЙ
console.log('🚀 Загрузка Firebase...');

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
window.firebaseLoaded = false;

// Загрузка Firebase SDK
function loadFirebaseSDK() {
  return new Promise((resolve, reject) => {
    // Если уже загружен
    if (window.firebase && window.firebase.app) {
      console.log('✅ Firebase уже загружен');
      initializeFirebase();
      resolve();
      return;
    }

    // Создаем скрипты
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js',
      'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js',
      'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
    ];

    let loaded = 0;
    
    scripts.forEach(url => {
      const script = document.createElement('script');
      script.src = url;
      script.async = false;
      
      script.onload = () => {
        loaded++;
        console.log(`✅ Загружен: ${url.split('/').pop()}`);
        
        if (loaded === scripts.length) {
          console.log('🎉 Все Firebase SDK загружены');
          initializeFirebase();
          resolve();
        }
      };
      
      script.onerror = (err) => {
        console.error(`❌ Ошибка загрузки ${url}:`, err);
        reject(err);
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
      throw new Error('Firebase не загрузился');
    }
    
    // Инициализируем
    window.firebaseApp = firebase.initializeApp(firebaseConfig);
    window.firebaseAuth = firebase.auth();
    window.firebaseDb = firebase.firestore();
    window.firebaseLoaded = true;
    
    console.log('✅ Firebase инициализирован');
    console.log('📁 Проект:', firebaseConfig.projectId);
    
  } catch (error) {
    console.error('❌ Ошибка инициализации Firebase:', error);
    window.firebaseLoaded = false;
    
    // Показываем пользователю
    setTimeout(() => {
      if (typeof showMessage === 'function') {
        showMessage('Ошибка подключения к серверу. Используйте демо-режим.', 'error');
      }
    }, 100);
  }
}

// Функция входа
window.loginUser = function(email, password) {
  return new Promise((resolve, reject) => {
    if (!window.firebaseLoaded || !window.firebaseAuth) {
      reject(new Error('Firebase не загружен'));
      return;
    }
    
    console.log('🔐 Вход:', email);
    
    window.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('✅ Вход успешен:', userCredential.user.uid);
        
        // Получаем данные пользователя
        return window.firebaseDb.collection('users').doc(userCredential.user.uid).get();
      })
      .then(userDoc => {
        let userData;
        
        if (userDoc.exists) {
          userData = userDoc.data();
        } else {
          // Создаем профиль если нет
          userData = {
            email: email,
            displayName: email.split('@')[0],
            createdAt: new Date().toISOString(),
            isPremium: false
          };
          
          window.firebaseDb.collection('users').doc(userCredential.user.uid).set(userData);
        }
        
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
        
        resolve(user);
      })
      .catch(error => {
        console.error('❌ Ошибка входа:', error);
        
        let errorMsg = 'Ошибка входа';
        if (error.code === 'auth/user-not-found') errorMsg = 'Пользователь не найден';
        if (error.code === 'auth/wrong-password') errorMsg = 'Неверный пароль';
        if (error.code === 'auth/invalid-email') errorMsg = 'Некорректный email';
        
        reject(new Error(errorMsg));
      });
  });
};

// Функция регистрации
window.registerUser = function(name, email, password) {
  return new Promise((resolve, reject) => {
    if (!window.firebaseLoaded || !window.firebaseAuth) {
      reject(new Error('Firebase не загружен'));
      return;
    }
    
    console.log('📝 Регистрация:', name, email);
    
    window.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('✅ Пользователь создан:', userCredential.user.uid);
        
        // Создаем профиль в Firestore
        const userData = {
          email: email,
          displayName: name,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isPremium: false,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
          stats: {
            projects: 0,
            tracks: 0,
            collaborations: 0
          }
        };
        
        return window.firebaseDb.collection('users').doc(userCredential.user.uid).set(userData);
      })
      .then(() => {
        const user = {
          uid: userCredential.user.uid,
          email: email,
          displayName: name,
          isPremium: false,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`
        };
        
        // Сохраняем
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        resolve(user);
      })
      .catch(error => {
        console.error('❌ Ошибка регистрации:', error);
        
        let errorMsg = 'Ошибка регистрации';
        if (error.code === 'auth/email-already-in-use') errorMsg = 'Email уже используется';
        if (error.code === 'auth/weak-password') errorMsg = 'Пароль слишком слабый (мин. 6 символов)';
        if (error.code === 'auth/invalid-email') errorMsg = 'Некорректный email';
        
        reject(new Error(errorMsg));
      });
  });
};

// Автозагрузка Firebase
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM загружен, начинаем загрузку Firebase...');
  loadFirebaseSDK().catch(error => {
    console.warn('⚠️ Firebase не загрузился, используем демо-режим:', error);
    window.firebaseLoaded = false;
  });
});

console.log('✅ Firebase модуль инициализирован');
