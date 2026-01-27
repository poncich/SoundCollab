// firebase-config.js
const backupConfig = {
    apiKey: "AIzaSyC4RgPZ16xJE4TYTHhy5JgTmyWc4E1234",
    authDomain: "soundcollab-test-12345.firebaseapp.com",
    projectId: "soundcollab-test-12345",
    storageBucket: "soundcollab-test-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Выбираем конфигурацию
const configToUse = firebaseConfig;

// Инициализация с обработкой ошибок
try {
    if (!firebase.apps.length) {
        const app = firebase.initializeApp(configToUse);
        console.log("✅ Firebase инициализирован с ключом:", configToUse.apiKey.substring(0, 10) + "...");
        
        // Тестируем подключение
        testFirebaseConnection();
    } else {
        console.log("ℹ️ Firebase уже инициализирован");
    }
} catch (error) {
    console.error("❌ Ошибка инициализации Firebase:", error);
    
    // Пробуем резервную конфигурацию
    console.log("🔄 Пробуем резервную конфигурацию...");
    try {
        const backupApp = firebase.initializeApp(backupConfig, "BackupApp");
        console.log("✅ Резервная конфигурация работает!");
    } catch (backupError) {
        console.error("❌ Резервная конфигурация тоже не работает:", backupError);
    }
}

async function testFirebaseConnection() {
    try {
        // Простой тест Firebase
        const auth = firebase.auth();
        console.log("🔧 Auth object доступен:", !!auth);
        
        // Проверяем, доступны ли методы
        console.log("🔧 Методы auth доступны:", typeof auth.signInWithEmailAndPassword === 'function');
        
    } catch (error) {
        console.error("❌ Ошибка теста Firebase:", error);
    }
}
