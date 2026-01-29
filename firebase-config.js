// firebase-config.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKrjtyk9pXAdTRLI_Jm7pM-bRjvX7O3cI",
  authDomain: "soundcollab-production.firebaseapp.com",
  projectId: "soundcollab-production",
  storageBucket: "soundcollab-production.firebasestorage.app",
  messagingSenderId: "1024413284863",
  appId: "1:1024413284863:web:1e051df31f3fd0b3f0cfca",
  measurementId: "G-TYM8HQZ0ZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
