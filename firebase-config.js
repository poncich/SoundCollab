/ ============================================
// firebase-config.js
// Real Firebase Configuration for SoundCollab
// ============================================

console.log('🔥 Загрузка Firebase конфигурации...');

// ==================== РЕАЛЬНАЯ КОНФИГУРАЦИЯ FIREBASE ====================
const firebaseConfig = {
  apiKey: "AIzaSyAKrjtyk9pXAdTRLI_Jm7pM-bRjvX7O3cI",
  authDomain: "soundcollab-production.firebaseapp.com",
  projectId: "soundcollab-production",
  storageBucket: "soundcollab-production.firebasestorage.app",
  messagingSenderId: "1024413284863",
  appId: "1:1024413284863:web:1e051df31f3fd0b3f0cfca",
  measurementId: "G-TYM8HQZ0ZS"
};

// ==================== ПРОВЕРКА КОНФИГУРАЦИИ ====================
console.log('📋 Firebase Config проверка:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// ==================== ИМПОРТ МОДУЛЕЙ FIREBASE ====================
// Используем CDN для совместимости с GitHub Pages
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-performance.js";

// ==================== ИНИЦИАЛИЗАЦИЯ FIREBASE ====================
let app;
let auth;
let db;
let storage;
let analytics;
let performance;

try {
  // Инициализация основного приложения
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App инициализирован');

  // Инициализация сервисов
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('✅ Firebase сервисы инициализированы:', {
    auth: !!auth,
    db: !!db,
    storage: !!storage
  });

  // Инициализация Analytics (только в продакшене)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    analytics = getAnalytics(app);
    console.log('📊 Firebase Analytics включен');
  }

  // Инициализация Performance Monitoring
  if (typeof window !== 'undefined') {
    performance = getPerformance(app);
    console.log('⚡ Firebase Performance включен');
  }

} catch (error) {
  console.error('❌ Ошибка инициализации Firebase:', error);
  throw new Error(`Не удалось инициализировать Firebase: ${error.message}`);
}

// ==================== ГЛОБАЛЬНЫЕ НАСТРОЙКИ ====================
// Флаг режима работы
window.isDemoMode = false;
window.isFirebaseInitialized = true;

// Настройка Firestore
if (db) {
  // Опциональные настройки Firestore
  // db.settings({ timestampsInSnapshots: true });
}

// Настройка Authentication
if (auth) {
  // Можно настроить язык и другие параметры
  // auth.languageCode = 'ru';
}

// ==================== УТИЛИТЫ ДЛЯ ОТЛАДКИ ====================
function checkFirebaseConnection() {
  const checks = {
    app: !!app,
    auth: !!auth,
    db: !!db,
    storage: !!storage,
    config: !!firebaseConfig.apiKey,
    isDemoMode: window.isDemoMode
  };
  
  console.log('🔍 Проверка подключения Firebase:', checks);
  return checks;
}

// Функция для сброса (только для разработки)
function resetFirebaseForDemo() {
  if (window.location.hostname === 'localhost' || window.confirm('Переключиться в демо-режим?')) {
    window.isDemoMode = true;
    console.log('🔄 Переключение в демо-режим');
    localStorage.setItem('forceDemoMode', 'true');
  }
}

// ==================== ОБРАБОТКА ОШИБОК СЕТИ ====================
function handleNetworkError(error) {
  console.warn('🌐 Проблема с сетью:', error);
  
  // Можно добавить логику для офлайн-режима
  if (!navigator.onLine) {
    console.log('📴 Офлайн режим, используем кэш');
    return 'offline';
  }
  
  return 'error';
}

// ==================== ВАЛИДАЦИЯ КОНФИГА ====================
function validateFirebaseConfig() {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!firebaseConfig[field] || firebaseConfig[field].includes('YOUR_')) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    console.error(`❌ Отсутствуют поля конфигурации: ${missingFields.join(', ')}`);
    return false;
  }
  
  console.log('✅ Конфигурация Firebase валидна');
  return true;
}

// Проверяем конфигурацию при загрузке
validateFirebaseConfig();

// ==================== СЛУШАТЕЛИ СОСТОЯНИЯ ====================
// Слушатель состояния сети
window.addEventListener('online', () => {
  console.log('🌐 Онлайн: Соединение восстановлено');
});

window.addEventListener('offline', () => {
  console.log('📴 Офлайн: Нет соединения с интернетом');
});

// ==================== ЭКСПОРТ СЕРВИСОВ ====================
export { 
  app, 
  auth, 
  db, 
  storage, 
  analytics, 
  performance 
};

// Экспорт утилит
export {
  checkFirebaseConnection,
  resetFirebaseForDemo,
  handleNetworkError,
  validateFirebaseConfig
};

// ==================== ГЛОБАЛЬНЫЙ ЭКСПОРТ (для обратной совместимости) ====================
// Экспортируем в window для старых скриптов
if (typeof window !== 'undefined') {
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firebaseDb = db;
  window.firebaseStorage = storage;
  window.firebaseConfig = firebaseConfig;
  
  // Экспортируем утилиты
  window.checkFirebaseConnection = checkFirebaseConnection;
  window.resetFirebaseForDemo = resetFirebaseForDemo;
}

// ==================== АВТОМАТИЧЕСКАЯ ПРОВЕРКА ====================
// Автоматически проверяем подключение через 2 секунды
setTimeout(() => {
  if (typeof window !== 'undefined' && window.isFirebaseInitialized) {
    checkFirebaseConnection();
    
    // Проверяем, не в демо-ли режиме
    const forceDemo = localStorage.getItem('forceDemoMode');
    if (forceDemo === 'true') {
      window.isDemoMode = true;
      console.log('🎮 Принудительный демо-режим включен');
    }
  }
}, 2000);

// ==================== ЛОГИРОВАНИЕ ИНИЦИАЛИЗАЦИИ ====================
console.log('🎉 Firebase конфигурация загружена успешно!');
console.log('📁 Проект:', firebaseConfig.projectId);
console.log('🌐 Домен:', firebaseConfig.authDomain);
console.log('🚀 Режим:', window.isDemoMode ? 'DEMO' : 'PRODUCTION');

// ==================== ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ ====================
console.log(`
============================================
SOUNDCOLLAB FIREBASE CONFIGURATION
============================================
Статус: ${window.isDemoMode ? '🎮 ДЕМО-РЕЖИМ' : '🚀 ПРОДАКШЕН'}
Проект: ${firebaseConfig.projectId}
Версия: 1.0.0
Дата: ${new Date().toLocaleDateString()}
============================================
`);

// Экспорт конфигурации для других модулей
export default {
  config: firebaseConfig,
  services: { app, auth, db, storage, analytics, performance },
  utils: { checkFirebaseConnection, resetFirebaseForDemo },
  isDemoMode: window.isDemoMode
};
