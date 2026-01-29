// firebase-sync.js - СИНХРОННАЯ ВЕРСИЯ ДЛЯ ЛЕГКОЙ ИНТЕГРАЦИИ

console.log('🔥 Инициализация Firebase (синхронная версия)');

// Конфигурация Firebase
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
window.isDemoMode = false;
window.isFirebaseLoaded = false;

// Функция для загрузки Firebase
function loadFirebase() {
  return new Promise((resolve, reject) => {
    // Проверяем, уже ли загружен Firebase
    if (window.firebase && window.firebase.app) {
      console.log('✅ Firebase уже загружен');
      initializeFirebase();
      resolve();
      return;
    }

    // Загружаем Firebase SDK
    console.log('📦 Загрузка Firebase SDK...');
    
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
    // Инициализируем Firebase
    window.firebaseApp = firebase.initializeApp(firebaseConfig);
    window.firebaseAuth = firebase.auth();
    window.firebaseDb = firebase.firestore();
    window.isFirebaseLoaded = true;
    
    console.log('✅ Firebase инициализирован успешно');
    console.log('📁 Проект:', firebaseConfig.projectId);
    
    // Проверяем подключение
    checkFirebaseConnection();
    
  } catch (error) {
    console.error('❌ Ошибка инициализации Firebase:', error);
    window.isFirebaseLoaded = false;
  }
}

// Проверка подключения
function checkFirebaseConnection() {
  console.log('🔍 Проверка подключения Firebase:');
  console.log('- App:', !!window.firebaseApp);
  console.log('- Auth:', !!window.firebaseAuth);
  console.log('- Firestore:', !!window.firebaseDb);
  console.log('- Конфиг:', firebaseConfig.projectId);
}

// Функции аутентификации
window.firebaseAuthFunctions = {
  // Вход
  login: function(email, password) {
    return new Promise((resolve, reject) => {
      if (!window.firebaseAuth) {
        reject(new Error('Firebase не инициализирован'));
        return;
      }
      
      console.log('🔐 Попытка входа:', email);
      
      window.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('✅ Вход успешен:', userCredential.user.email);
          
          // Получаем данные пользователя из Firestore
          return window.firebaseDb.collection('users').doc(userCredential.user.uid).get();
        })
        .then((userDoc) => {
          let userData;
          
          if (userDoc.exists) {
            userData = userDoc.data();
          } else {
            // Создаем базовый профиль
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
            email: userCredential.user.email,
            displayName: userData.displayName || email.split('@')[0],
            isPremium: userData.isPremium || false
          };
          
          // Сохраняем в localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          
          resolve(user);
        })
        .catch((error) => {
          console.error('❌ Ошибка входа:', error);
          
          // Преобразуем ошибку
          let errorMessage = "Ошибка входа";
          
          if (error.code === 'auth/user-not-found') {
            errorMessage = "Пользователь не найден";
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Неверный пароль";
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Некорректный email";
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "Слишком много попыток. Попробуйте позже";
          }
          
          reject(new Error(errorMessage));
        });
    });
  },
  
  // Регистрация
  register: function(name, email, password) {
    return new Promise((resolve, reject) => {
      if (!window.firebaseAuth) {
        reject(new Error('Firebase не инициализирован'));
        return;
      }
      
      console.log('📝 Регистрация нового пользователя:', { name, email });
      
      window.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log('✅ Пользователь создан:', userCredential.user.uid);
          
          // Создаем запись в Firestore
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
            isPremium: false
          };
          
          // Сохраняем в localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('isAuthenticated', 'true');
          
          resolve(user);
        })
        .catch((error) => {
          console.error('❌ Ошибка регистрации:', error);
          
          let errorMessage = "Ошибка регистрации";
          
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Этот email уже используется";
          } else if (error.code === 'auth/weak-password') {
            errorMessage = "Пароль слишком слабый (минимум 6 символов)";
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Некорректный email";
          }
          
          reject(new Error(errorMessage));
        });
    });
  },
  
  // Выход
  logout: function() {
    return new Promise((resolve, reject) => {
      if (!window.firebaseAuth) {
        reject(new Error('Firebase не инициализирован'));
        return;
      }
      
      window.firebaseAuth.signOut()
        .then(() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('isAuthenticated');
          console.log('✅ Выход успешен');
          resolve();
        })
        .catch((error) => {
          console.error('❌ Ошибка выхода:', error);
          reject(error);
        });
    });
  }
};

// Автоматическая загрузка при старте
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 SoundCollab - Начало загрузки...');
  
  // Загружаем Firebase
  loadFirebase().catch(error => {
    console.error('Не удалось загрузить Firebase:', error);
    alert('Внимание: Не удалось подключиться к серверу. Используйте демо-режим.');
  });
});

// Экспорт для использования
console.log('✅ Firebase синхронный модуль загружен');
