// demo-auth.js - ДЕМО-РЕЖИМ БЕЗ FIREBASE
console.log("🚀 Включаем демо-режим SoundCollab");

// Создаем фиктивный Firebase для демо
window.firebaseDemo = {
    auth: () => ({
        currentUser: null,
        
        signInWithEmailAndPassword: async function(email, password) {
            console.log("🔑 Демо-вход:", email);
            
            await new Promise(resolve => setTimeout(resolve, 800)); // Имитация задержки
            
            return {
                user: {
                    email: email,
                    displayName: email.split('@')[0],
                    uid: 'demo_' + Date.now(),
                    photoURL: null
                }
            };
        },
        
        createUserWithEmailAndPassword: async function(email, password, name) {
            console.log("🔑 Демо-регистрация:", email, name);
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            return {
                user: {
                    email: email,
                    displayName: name || email.split('@')[0],
                    uid: 'demo_' + Date.now(),
                    photoURL: null
                }
            };
        },
        
        signOut: function() {
            return Promise.resolve();
        },
        
        onAuthStateChanged: function(callback) {
            // Имитация проверки состояния
            const user = localStorage.getItem('soundcollab_demo_user') 
                ? JSON.parse(localStorage.getItem('soundcollab_demo_user'))
                : null;
            
            setTimeout(() => callback(user), 100);
            
            return function() {}; // Функция отписки
        }
    })
};

// Подменяем реальный Firebase демо-версией
if (typeof firebase === 'undefined') {
    console.log("⚠️ Firebase не найден, используем демо-версию");
    window.firebase = window.firebaseDemo;
}

// Функции аутентификации для демо-режима
async function demoLogin(email, password) {
    try {
        const btn = document.getElementById('loginButton');
        if (btn) {
            btn.textContent = 'Вход...';
            btn.disabled = true;
        }
        
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Создаем демо-пользователя
        const user = {
            email: email,
            displayName: email.split('@')[0],
            uid: 'demo_' + Date.now(),
            photoURL: null
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('soundcollab_demo_user', JSON.stringify(user));
        
        // Показываем успех
        showDemoMessage('✅ Демо-вход успешен! Добро пожаловать, ' + user.displayName, 'success');
        
        // Перенаправляем через 1.5 секунды
        setTimeout(() => {
            window.location.href = 'dashboard-demo.html';
        }, 1500);
        
    } catch (error) {
        if (btn) {
            btn.textContent = 'Войти';
            btn.disabled = false;
        }
        showDemoMessage('❌ Ошибка входа: ' + (error.message || 'Неизвестная ошибка'), 'error');
    }
}

async function demoRegister(name, email, password) {
    try {
        const btn = document.getElementById('registerButton');
        if (btn) {
            btn.textContent = 'Регистрация...';
            btn.disabled = true;
        }
        
        // Имитируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Создаем демо-пользователя
        const user = {
            email: email,
            displayName: name || email.split('@')[0],
            uid: 'demo_' + Date.now(),
            photoURL: null
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('soundcollab_demo_user', JSON.stringify(user));
        
        // Показываем успех
        showDemoMessage('🎉 Демо-регистрация успешна! Добро пожаловать, ' + user.displayName, 'success');
        
        // Перенаправляем через 2 секунды
        setTimeout(() => {
            window.location.href = 'dashboard-demo.html';
        }, 2000);
        
    } catch (error) {
        if (btn) {
            btn.textContent = 'Создать аккаунт';
            btn.disabled = false;
        }
        showDemoMessage('❌ Ошибка регистрации: ' + (error.message || 'Неизвестная ошибка'), 'error');
    }
}

function demoLogout() {
    localStorage.removeItem('soundcollab_demo_user');
    window.location.href = 'index.html';
}

function showDemoMessage(message, type) {
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
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        alertDiv.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
    } else {
        alertDiv.style.background = 'linear-gradient(135deg, #ff4757 0%, #c0392b 100%)';
    }
    
    // Добавляем стили анимации
    if (!document.querySelector('#demo-alert-styles')) {
        const style = document.createElement('style');
        style.id = 'demo-alert-styles';
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
        alertDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, 4000);
}

// Инициализация демо-режима
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎵 SoundCollab Демо-режим активирован");
    
    // Проверяем, вошел ли пользователь в демо-режиме
    const demoUser = localStorage.getItem('soundcollab_demo_user');
    if (demoUser) {
        console.log("👤 Демо-пользователь найден:", JSON.parse(demoUser).email);
    }
    
    // Переопределяем функции входа и регистрации
    window.login = async function() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showDemoMessage('⚠️ Заполните все поля', 'error');
            return;
        }
        
        await demoLogin(email, password);
    };
    
    window.register = async function() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        if (!name || !email || !password) {
            showDemoMessage('⚠️ Заполните все поля', 'error');
            return;
        }
        
        if (password.length < 6) {
            showDemoMessage('⚠️ Пароль должен быть не менее 6 символов', 'error');
            return;
        }
        
        await demoRegister(name, email, password);
    };
    
    console.log("✅ Демо-функции подключены");
});
