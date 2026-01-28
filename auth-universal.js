// auth-universal.js - УНИВЕРСАЛЬНАЯ АУТЕНТИФИКАЦИЯ
class AuthManager {
    constructor() {
        this.mode = 'demo'; // 'firebase' или 'demo'
        this.user = null;
        this.init();
    }
    
    async init() {
        console.log("🔧 Инициализация AuthManager...");
        
        // Проверяем, доступен ли Firebase
        await this.checkFirebase();
        
        // Загружаем состояние пользователя
        await this.loadUserState();
        
        // Настраиваем интерфейс
        this.setupUI();
    }
    
    async checkFirebase() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 20;
            
            const check = () => {
                attempts++;
                
                if (typeof firebase !== 'undefined' && 
                    firebase.apps && 
                    firebase.apps.length > 0 &&
                    firebase.auth) {
                    
                    this.mode = 'firebase';
                    console.log("✅ Firebase доступен, режим: firebase");
                    resolve(true);
                    
                } else if (attempts >= maxAttempts) {
                    console.log("⚠️ Firebase не загрузился, режим: demo");
                    this.mode = 'demo';
                    resolve(false);
                    
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        });
    }
    
    async loadUserState() {
        if (this.mode === 'firebase') {
            // С Firebase
            return new Promise((resolve) => {
                firebase.auth().onAuthStateChanged((user) => {
                    this.user = user;
                    console.log("Firebase пользователь:", user ? user.email : "не вошел");
                    resolve();
                });
            });
        } else {
            // Демо-режим
            const userData = localStorage.getItem('soundcollab_user');
            this.user = userData ? JSON.parse(userData) : null;
            console.log("Демо пользователь:", this.user ? this.user.email : "не вошел");
        }
    }
    
    setupUI() {
        // Показываем текущий режим
        this.showModeIndicator();
        
        // Если пользователь уже вошел, обновляем интерфейс
        if (this.user) {
            this.updateUIForLoggedInUser();
        }
        
        // Назначаем обработчики
        this.assignEventHandlers();
    }
    
    showModeIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'auth-mode-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: ${this.mode === 'firebase' ? '#4CAF50' : '#FF9800'};
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        `;
        indicator.innerHTML = `
            🔧 ${this.mode === 'firebase' ? 'Firebase' : 'Демо-режим'}
        `;
        document.body.appendChild(indicator);
    }
    
    async login(email, password) {
        console.log(`🔑 Вход в режиме ${this.mode}:`, email);
        
        if (this.mode === 'firebase') {
            return this.loginWithFirebase(email, password);
        } else {
            return this.loginWithDemo(email, password);
        }
    }
    
    async register(name, email, password) {
        console.log(`🔑 Регистрация в режиме ${this.mode}:`, email, name);
        
        if (this.mode === 'firebase') {
            return this.registerWithFirebase(name, email, password);
        } else {
            return this.registerWithDemo(name, email, password);
        }
    }
    
    async loginWithFirebase(email, password) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            this.user = userCredential.user;
            this.showMessage('✅ Вход выполнен!', 'success');
            
            // Перенаправляем
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
            return true;
        } catch (error) {
            this.showMessage(`❌ Ошибка: ${this.getFirebaseError(error)}`, 'error');
            return false;
        }
    }
    
    async registerWithFirebase(name, email, password) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            // Обновляем имя
            await userCredential.user.updateProfile({ displayName: name });
            
            this.user = userCredential.user;
            this.showMessage(`🎉 Регистрация успешна! Добро пожаловать, ${name}!`, 'success');
            
            // Перенаправляем
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
            return true;
        } catch (error) {
            this.showMessage(`❌ Ошибка: ${this.getFirebaseError(error)}`, 'error');
            return false;
        }
    }
    
    async loginWithDemo(email, password) {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = {
            email: email,
            displayName: email.split('@')[0],
            uid: 'demo_' + Date.now(),
            mode: 'demo'
        };
        
        localStorage.setItem('soundcollab_user', JSON.stringify(user));
        this.user = user;
        
        this.showMessage('✅ Демо-вход выполнен!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard-demo.html';
        }, 1000);
        
        return true;
    }
    
    async registerWithDemo(name, email, password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = {
            email: email,
            displayName: name || email.split('@')[0],
            uid: 'demo_' + Date.now(),
            mode: 'demo'
        };
        
        localStorage.setItem('soundcollab_user', JSON.stringify(user));
        this.user = user;
        
        this.showMessage(`🎉 Демо-регистрация успешна! Добро пожаловать, ${name}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard-demo.html';
        }, 1500);
        
        return true;
    }
    
    logout() {
        if (this.mode === 'firebase') {
            firebase.auth().signOut();
        }
        
        localStorage.removeItem('soundcollab_user');
        this.user = null;
        
        window.location.href = 'index.html';
    }
    
    updateUIForLoggedInUser() {
        const authSection = document.querySelector('.auth-section');
        if (authSection && this.user) {
            authSection.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3 style="color: #333;">🎵 Добро пожаловать, ${this.user.displayName}!</h3>
                    <p style="color: #666; margin: 20px 0;">Вы вошли в режиме: <strong>${this.mode}</strong></p>
                    <button onclick="window.location.href='${this.mode === 'firebase' ? 'dashboard.html' : 'dashboard-demo.html'}'" 
                            style="padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 10px;">
                        Перейти в ${this.mode === 'firebase' ? 'студию' : 'демо-студию'}
                    </button>
                    <br>
                    <button onclick="authManager.logout()" 
                            style="padding: 10px 20px; background: transparent; color: #666; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; margin-top: 20px;">
                        Выйти
                    </button>
                </div>
            `;
        }
    }
    
    assignEventHandlers() {
        // Вход
        const loginBtn = document.getElementById('loginButton');
        if (loginBtn) {
            loginBtn.addEventListener('click', async () => {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                if (!email || !password) {
                    this.showMessage('⚠️ Заполните все поля', 'error');
                    return;
                }
                
                await this.login(email, password);
            });
        }
        
        // Регистрация
        const registerBtn = document.getElementById('registerButton');
        if (registerBtn) {
            registerBtn.addEventListener('click', async () => {
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                
                if (!name || !email || !password) {
                    this.showMessage('⚠️ Заполните все поля', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    this.showMessage('⚠️ Пароль должен быть не менее 6 символов', 'error');
                    return;
                }
                
                await this.register(name, email, password);
            });
        }
    }
    
    showMessage(message, type) {
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
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        if (type === 'success') {
            alertDiv.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
        } else {
            alertDiv.style.background = 'linear-gradient(135deg, #ff4757 0%, #c0392b 100%)';
        }
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => alertDiv.remove(), 300);
        }, 4000);
    }
    
    getFirebaseError(error) {
        const errors = {
            'auth/user-not-found': 'Пользователь не найден',
            'auth/wrong-password': 'Неверный пароль',
            'auth/invalid-email': 'Неверный email',
            'auth/email-already-in-use': 'Email уже используется',
            'auth/weak-password': 'Пароль слишком слабый',
            'auth/network-request-failed': 'Ошибка сети'
        };
        
        return errors[error.code] || error.message;
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
