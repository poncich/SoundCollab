// firebase-config.js - Конфигурация Firebase для SoundCollab

// Проверяем режим работы
const isDemoMode = typeof window !== 'undefined' && 
                   (window.location.hostname === 'localhost' || 
                    window.location.hostname.includes('github.io'));

// Демо конфигурация (по умолчанию)
const demoConfig = {
    apiKey: "demo-mode-key",
    authDomain: "demo.soundcollab.com",
    projectId: "soundcollab-demo",
    storageBucket: "soundcollab-demo.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Реальная конфигурация (будет подставляться при сборке)
// ВНИМАНИЕ: Никогда не публикуйте реальные ключи в репозитории!
// Используйте переменные окружения или серверную сборку

const productionConfig = {
    apiKey: window.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
    authDomain: window.FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: window.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: window.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: window.FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || ""
};

// Выбираем конфигурацию в зависимости от режима
const firebaseConfig = isDemoMode ? demoConfig : productionConfig;

// Проверяем наличие реальных ключей
const hasRealKeys = firebaseConfig.apiKey && 
                    firebaseConfig.apiKey !== "demo-mode-key" && 
                    firebaseConfig.apiKey.length > 20;

// Устанавливаем глобальную переменную режима
if (typeof window !== 'undefined') {
    window.isDemoMode = !hasRealKeys;
    
    if (window.isDemoMode) {
        console.log('🎵 SoundCollab работает в демо-режиме');
        console.log('🔧 Для подключения Firebase:');
        console.log('1. Создайте проект на https://firebase.google.com');
        console.log('2. Получите ключи из настроек проекта');
        console.log('3. Замените значения в firebase-config.js');
    } else {
        console.log('🚀 SoundCollab подключен к Firebase');
    }
}

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, isDemoMode: !hasRealKeys };
} else {
    // Для использования в браузере
    window.firebaseConfig = firebaseConfig;
}

// Дополнительные настройки Firebase
const firebaseSettings = {
    enablePersistence: true, // Включаем оффлайн-режим
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB кэша
    experimentalForceLongPolling: false,
    merge: true // Автоматическое слияние данных
};

// Глобальные переменные для разработки
if (typeof window !== 'undefined' && window.isDemoMode) {
    console.log('📋 Демо-данные загружены');
    console.log('💡 Подсказка: используйте localStorage для тестирования');
    console.log('👤 Демо пользователь: demo@soundcollab.com / любой пароль');
}

// Экспорт настроек
if (typeof module !== 'undefined' && module.exports) {
    module.exports.firebaseSettings = firebaseSettings;
} else {
    window.firebaseSettings = firebaseSettings;
}
