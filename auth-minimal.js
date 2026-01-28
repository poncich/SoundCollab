// auth-minimal.js - ОБНОВЛЕННАЯ ВЕРСИЯ
console.log("🔧 auth-minimal.js загружен");

// Ждем загрузки Firebase
function waitForFirebase() {
    return new Promise((resolve, reject) => {
        const maxAttempts = 50;
        let attempts = 0;
        
        const check = () => {
            attempts++;
            
            if (typeof firebase !== 'undefined' && 
                typeof firebase.auth === 'function' &&
                firebase.apps.length > 0) {
                console.log("✅ Firebase загружен на попытке", attempts);
                resolve();
            } else if (attempts >= maxAttempts) {
                console.error("❌ Firebase не загрузился после", maxAttempts, "попыток");
                reject(new Error("Firebase не загрузился"));
            } else {
                console.log("⏳ Ожидаем Firebase...", attempts);
                setTimeout(check, 100);
            }
        };
        
        check();
    });
}

// Основная функция
async function initAuth() {
    console.log("🔧 Инициализация аутентификации...");
    
    try {
        await waitForFirebase();
        
        // Проверяем, вошел ли пользователь
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("👤 Пользователь вошел:", user.email);
                // Автоматически перенаправляем
                setTimeout(() => {
                    window.location.href = 'dashboard-simple.html';
                }, 1000);
            } else {
                console.log("👤 Пользователь не вошел");
            }
        });
        
    } catch (error) {
        console.error("❌ Ошибка инициализации:", error);
        showError("Firebase не загрузился. Проверьте подключение к интернету.");
    }
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', initAuth);

async function login() {
    console.log("🔧 Начинаем вход...");
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showError('Заполните все поля');
        return;
    }
    
    const btn = document.querySelector('#loginForm .auth-button');
    btn.textContent = 'Вход...';
    btn.disabled = true;
    
    try {
        console.log("🔧 Вызываем firebase.auth()...");
        const auth = firebase.auth();
        console.log("🔧 Auth object:", auth);
        
        console.log("🔧 Пытаемся войти с email:", email);
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        console.log("✅ Вход успешен:", userCredential.user.email);
        showSuccess('Добро пожаловать!');
        
        // Перенаправляем
        setTimeout(() => {
            window.location.href = 'dashboard-simple.html';
        }, 1000);
        
    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        console.error('Код ошибки:', error.code);
        console.error('Сообщение:', error.message);
        
        btn.textContent = 'Войти';
        btn.disabled = false;
        
        let message = 'Ошибка входа: ';
        switch (error.code) {
            case 'auth/user-not-found': 
                message = 'Пользователь не найден'; 
                break;
            case 'auth/wrong-password': 
                message = 'Неверный пароль'; 
                break;
            case 'auth/invalid-email': 
                message = 'Неверный формат email'; 
                break;
            case 'auth/api-key-not-valid':
                message = 'Ошибка подключения к серверу. Попробуйте позже.';
                break;
            default: 
                message += error.message;
        }
        
        showError(message);
    }
}

async function register() {
    console.log("🔧 Начинаем регистрацию...");
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showError('Заполните все поля');
        return;
    }
    
    if (password.length < 6) {
        showError('Пароль должен быть не менее 6 символов');
        return;
    }
    
    const btn = document.querySelector('#registerForm .auth-button');
    btn.textContent = 'Регистрация...';
    btn.disabled = true;
    
    try {
        console.log("🔧 Создаем пользователя...");
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        console.log("✅ Пользователь создан:", userCredential.user.uid);
        
        // Обновляем имя
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        showSuccess('Регистрация успешна! Добро пожаловать, ' + name + '!');
        
        // Перенаправляем
        setTimeout(() => {
            window.location.href = 'dashboard-simple.html';
        }, 2000);
        
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        btn.textContent = 'Создать аккаунт';
        btn.disabled = false;
        
        let message = 'Ошибка регистрации: ';
        switch (error.code) {
            case 'auth/email-already-in-use': 
                message = 'Email уже используется'; 
                break;
            case 'auth/invalid-email': 
                message = 'Неверный формат email'; 
                break;
            case 'auth/weak-password': 
                message = 'Пароль слишком слабый'; 
                break;
            case 'auth/api-key-not-valid':
                message = 'Ошибка подключения. Попробуйте позже.';
                break;
            default: 
                message += error.message;
        }
        
        showError(message);
    }
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showError(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        alertDiv.style.background = '#4CAF50';
    } else {
        alertDiv.style.background = '#ff4757';
    }
    
    // Добавляем стили анимации
    if (!document.querySelector('#alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(alertDiv);
    
    // Убираем через 4 секунды
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s';
        setTimeout(() => alertDiv.remove(), 300);
    }, 4000);
}
