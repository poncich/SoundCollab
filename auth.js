// auth.js - Полная система авторизации SoundCollab

class AuthSystem {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.isDemo = false;
        
        this.init();
    }

    init() {
        console.log('🔐 Инициализация системы авторизации...');
        
        // Проверяем текущую авторизацию
        this.checkAuth();
        
        // Настраиваем обработчики форм
        this.setupEventListeners();
        
        // Защищаем страницы
        this.protectPages();
    }

    checkAuth() {
        try {
            const userData = localStorage.getItem('soundcollab_user');
            
            if (userData) {
                this.user = JSON.parse(userData);
                this.isAuthenticated = true;
                this.isDemo = this.user.isDemo || false;
                
                console.log('✅ Пользователь авторизован:', this.user.email);
                console.log('📊 Режим:', this.isDemo ? 'Демо' : 'Реальный');
                
                return true;
            }
        } catch (error) {
            console.error('❌ Ошибка проверки авторизации:', error);
        }
        
        this.isAuthenticated = false;
        return false;
    }

    setupEventListeners() {
        // Форма входа
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Форма регистрации
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        
        // Кнопка входа
        const loginSubmit = document.getElementById('login-submit');
        if (loginSubmit) {
            loginSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Кнопка регистрации
        const registerSubmit = document.getElementById('register-submit');
        if (registerSubmit) {
            registerSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    handleLogin() {
        console.log('👤 Обработка входа...');
        
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        
        // Валидация
        if (!this.validateEmail(email)) {
            this.showError('Введите корректный email адрес');
            return;
        }
        
        if (!password || password.length < 6) {
            this.showError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        // Показываем загрузку
        this.showLoading();
        
        // Имитация запроса к серверу
        setTimeout(() => {
            this.processLogin(email, password);
        }, 1000);
    }

    handleRegister() {
        console.log('👤 Обработка регистрации...');
        
        const name = document.getElementById('register-name')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const confirmPassword = document.getElementById('register-confirm')?.value;
        
        // Валидация
        if (!name || name.length < 2) {
            this.showError('Имя должно содержать минимум 2 символа');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showError('Введите корректный email адрес');
            return;
        }
        
        if (!password || password.length < 6) {
            this.showError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('Пароли не совпадают');
            return;
        }
        
        // Показываем загрузку
        this.showLoading();
        
        // Имитация запроса к серверу
        setTimeout(() => {
            this.processRegistration(name, email, password);
        }, 1000);
    }

    processLogin(email, password) {
        console.log('🔐 Авторизация пользователя:', email);
        
        // В демо-режиме создаем демо-пользователя
        if (this.isDemoMode()) {
            const user = this.createDemoUser(email);
            this.completeLogin(user);
        } else {
            // В реальном режиме будет Firebase
            this.firebaseLogin(email, password);
        }
    }

    processRegistration(name, email, password) {
        console.log('📝 Регистрация пользователя:', name, email);
        
        // В демо-режиме создаем демо-пользователя
        if (this.isDemoMode()) {
            const user = this.createDemoUser(email, name);
            this.completeLogin(user);
        } else {
            // В реальном режиме будет Firebase
            this.firebaseRegister(name, email, password);
        }
    }

    createDemoUser(email, name = null) {
        const names = ['Алексей', 'Мария', 'Денис', 'София', 'Максим', 'Анна', 'Иван', 'Екатерина'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        
        return {
            uid: 'demo-user-' + Date.now(),
            email: email,
            displayName: name || email.split('@')[0] || randomName,
            photoURL: '',
            isDemo: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            stats: {
                projects: Math.floor(Math.random() * 10) + 1,
                tracks: Math.floor(Math.random() * 50) + 10,
                collaborations: Math.floor(Math.random() * 5),
                storageUsed: (Math.random() * 2 + 0.5).toFixed(1) + ' GB'
            }
        };
    }

    completeLogin(user) {
        // Сохраняем пользователя
        this.saveUser(user);
        
        // Показываем успех
        this.showSuccess('Успешный вход! Перенаправляем...');
        
        // Перенаправляем через 1.5 секунды
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    saveUser(user) {
        localStorage.setItem('soundcollab_user', JSON.stringify(user));
        this.user = user;
        this.isAuthenticated = true;
        
        console.log('💾 Пользователь сохранен:', user.email);
    }

    logout() {
        console.log('👋 Выход из системы...');
        
        localStorage.removeItem('soundcollab_user');
        localStorage.removeItem('soundcollab_premium');
        
        this.user = null;
        this.isAuthenticated = false;
        
        // Перенаправляем на главную
        window.location.href = 'index.html';
    }

    protectPages() {
        // Страницы, требующие авторизации
        const protectedPages = [
            'dashboard.html',
            'music-feed-audio.html',
            'ai-images.html',
            'projects.html'
        ];
        
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            if (!this.checkAuth()) {
                console.log('🚫 Неавторизованный доступ к:', currentPage);
                window.location.href = 'login.html';
            }
        }
    }

    validateEmail(email) {
        if (!email) return false;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    isDemoMode() {
        return window.isDemoMode === true || 
               !firebaseConfig || 
               firebaseConfig.apiKey === 'demo-mode-key';
    }

    showLoading() {
        const buttons = document.querySelectorAll('.auth-btn');
        buttons.forEach(btn => {
            const originalText = btn.textContent;
            btn.innerHTML = '<span class="spinner-small"></span> Загрузка...';
            btn.disabled = true;
            
            // Сохраняем оригинальный текст для восстановления
            btn.dataset.originalText = originalText;
        });
        
        // Добавляем стили для спиннера
        if (!document.querySelector('#spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                .spinner-small {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideLoading() {
        const buttons = document.querySelectorAll('.auth-btn');
        buttons.forEach(btn => {
            if (btn.dataset.originalText) {
                btn.innerHTML = btn.dataset.originalText;
                btn.disabled = false;
            }
        });
    }

    showError(message) {
        this.hideLoading();
        
        // Удаляем старые ошибки
        document.querySelectorAll('.auth-error').forEach(el => el.remove());
        
        // Создаем новое сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                padding: 14px 18px;
                border-radius: 10px;
                margin: 15px 0;
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideDown 0.3s ease;
            ">
                <span style="font-size: 18px;">❌</span>
                <span style="flex: 1;">${message}</span>
            </div>
        `;
        
        // Вставляем перед формой
        const form = document.querySelector('.auth-form.active');
        if (form) {
            const firstInput = form.querySelector('.form-group');
            if (firstInput) {
                form.insertBefore(errorDiv, firstInput);
            }
            
            // Удаляем через 5 секунд
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
    }

    showSuccess(message) {
        this.hideLoading();
        
        // Удаляем старые успешные сообщения
        document.querySelectorAll('.auth-success').forEach(el => el.remove());
        
        // Создаем новое сообщение об успехе
        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success';
        successDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 14px 18px;
                border-radius: 10px;
                margin: 15px 0;
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideDown 0.3s ease;
            ">
                <span style="font-size: 18px;">✅</span>
                <span style="flex: 1;">${message}</span>
            </div>
        `;
        
        // Вставляем перед формой
        const form = document.querySelector('.auth-form.active');
        if (form) {
            const firstInput = form.querySelector('.form-group');
            if (firstInput) {
                form.insertBefore(successDiv, firstInput);
            }
        }
        
        // Добавляем анимацию
        if (!document.querySelector('#auth-animations')) {
            const style = document.createElement('style');
            style.id = 'auth-animations';
            style.textContent = `
                @keyframes slideDown {
                    from { 
                        opacity: 0; 
                        transform: translateY(-10px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Методы для реального Firebase (заглушки)
    firebaseLogin(email, password) {
        console.log('🔥 Firebase вход (заглушка)');
        // Здесь будет реальная логика Firebase
        this.showError('Firebase не настроен. Используйте демо-режим.');
        this.hideLoading();
    }

    firebaseRegister(name, email, password) {
        console.log('🔥 Firebase регистрация (заглушка)');
        // Здесь будет реальная логика Firebase
        this.showError('Firebase не настроен. Используйте демо-режим.');
        this.hideLoading();
    }

    // Публичные методы
    getUser() {
        return this.user;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    isPremiumUser() {
        return localStorage.getItem('soundcollab_premium') === 'true';
    }
}

// Инициализация системы при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.auth = new AuthSystem();
    
    // Глобальные функции
    window.logout = function() {
        if (window.auth) {
            window.auth.logout();
        }
    };
    
    window.getCurrentUser = function() {
        return window.auth?.getUser();
    };
    
    window.isAuthenticated = function() {
        return window.auth?.isLoggedIn();
    };
    
    console.log('🚀 Система авторизации запущена');
});

// Экспорт для модулей
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}
