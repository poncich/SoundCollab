// auth-simple.js - УПРОЩЕННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🔧 Инициализация SoundCollab...");
    
    // Ждем загрузки Firebase
    await waitForFirebase();
    
    // Остальной код без изменений...
    setupAuthForms();
    setupEventListeners();
    checkAuthState();
});

async function waitForFirebase() {
    // Ждем пока Firebase загрузится
    return new Promise((resolve) => {
        const checkFirebase = () => {
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                console.log("✅ Firebase загружен");
                resolve();
            } else {
                console.log("⏳ Ожидаем Firebase...");
                setTimeout(checkFirebase, 100);
            }
        };
        checkFirebase();
    });
}
    
    // Обработка входа
    document.getElementById('loginBtn').addEventListener('click', loginWithEmail);
    
    // Обработка регистрации
    document.getElementById('registerBtn').addEventListener('click', registerWithEmail);
    
    // Проверяем, вошел ли пользователь
    checkAuthState();
    
    // Кнопка выхода
    document.getElementById('logout-btn').addEventListener('click', logout);
});

function switchAuthForm(formName) {
    // Обновляем табы
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === formName) {
            tab.classList.add('active');
        }
    });
    
    // Обновляем формы
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(formName + 'Form').classList.add('active');
}

async function loginWithEmail() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage("Пожалуйста, заполните все поля", "error");
        return;
    }
    
    const button = document.getElementById('loginBtn');
    const originalText = button.textContent;
    button.textContent = "Вход...";
    button.disabled = true;
    
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log("✅ Вход успешен:", userCredential.user.email);
        showMessage("Добро пожаловать!", "success");
        
        // Обновляем интерфейс
        updateUIForLoggedInUser(userCredential.user);
        
    } catch (error) {
        console.error("❌ Ошибка входа:", error);
        button.textContent = originalText;
        button.disabled = false;
        
        let errorMessage = "Ошибка входа: ";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "Пользователь не найден. Зарегистрируйтесь.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Неверный пароль";
                break;
            case 'auth/invalid-email':
                errorMessage = "Неверный формат email";
                break;
            default:
                errorMessage = "Ошибка входа: " + error.message;
        }
        
        showMessage(errorMessage, "error");
    }
}

async function registerWithEmail() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showMessage("Пожалуйста, заполните все поля", "error");
        return;
    }
    
    if (password.length < 6) {
        showMessage("Пароль должен быть не менее 6 символов", "error");
        return;
    }
    
    const button = document.getElementById('registerBtn');
    const originalText = button.textContent;
    button.textContent = "Регистрация...";
    button.disabled = true;
    
    try {
        // Создаем пользователя
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log("✅ Регистрация успешна:", userCredential.user.uid);
        
        // Обновляем имя пользователя
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        showMessage("Регистрация успешна! Добро пожаловать, " + name + "!", "success");
        
        // Обновляем интерфейс
        updateUIForLoggedInUser(userCredential.user);
        
    } catch (error) {
        console.error("❌ Ошибка регистрации:", error);
        button.textContent = originalText;
        button.disabled = false;
        
        let errorMessage = "Ошибка регистрации: ";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "Email уже используется. Войдите или используйте другой email.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Неверный формат email";
                break;
            case 'auth/weak-password':
                errorMessage = "Пароль слишком слабый. Используйте минимум 6 символов.";
                break;
            default:
                errorMessage = "Ошибка регистрации: " + error.message;
        }
        
        showMessage(errorMessage, "error");
    }
}

function updateUIForLoggedInUser(user) {
    // Скрываем формы авторизации
    const authSection = document.querySelector('.auth-section');
    if (authSection) {
        authSection.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3 style="color: #333; margin-bottom: 20px;">🎵 Добро пожаловать, ${user.displayName}!</h3>
                <p style="color: #666; margin-bottom: 30px;">Вы успешно вошли в систему</p>
                <button onclick="window.location.href='dashboard.html'" 
                        style="padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 10px;">
                    Перейти в студию
                </button>
                <br>
                <button onclick="logout()" 
                        style="padding: 10px 20px; background: transparent; color: #666; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; margin-top: 20px;">
                    Выйти
                </button>
            </div>
        `;
    }
    
    // Показываем кнопку выхода в шапке
    document.getElementById('logout-btn').style.display = 'block';
    
    // Обновляем главную кнопку
    const mainBtn = document.getElementById('main-action-btn');
    if (mainBtn) {
        mainBtn.textContent = "Перейти в студию";
        mainBtn.onclick = function() {
            window.location.href = 'dashboard.html';
        };
    }
}

function checkAuthState() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("👤 Пользователь уже вошел:", user.email);
            updateUIForLoggedInUser(user);
        } else {
            console.log("👤 Пользователь не вошел");
            document.getElementById('logout-btn').style.display = 'none';
        }
    });
}

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("✅ Выход выполнен");
        window.location.reload();
    }).catch(error => {
        console.error("Ошибка выхода:", error);
    });
}

function resetPassword() {
    const email = prompt("Введите ваш email для восстановления пароля:");
    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                showMessage("Письмо для сброса пароля отправлено на " + email, "success");
            })
            .catch(error => {
                showMessage("Ошибка: " + error.message, "error");
            });
    }
}

function showMessage(message, type) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#4CAF50';
    } else if (type === 'error') {
        notification.style.background = '#ff4757';
    } else {
        notification.style.background = '#667eea';
    }
    
    document.body.appendChild(notification);
    
    // Убираем через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Добавляем CSS анимации
const style = document.createElement('style');
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

// Автоматический фокус на первое поле формы
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const formName = this.getAttribute('data-tab');
        setTimeout(() => {
            const firstInput = document.querySelector(`#${formName}Form input`);
            if (firstInput) firstInput.focus();
        }, 100);
    });
});
