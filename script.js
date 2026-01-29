// Основной JavaScript для SoundCollab

// Глобальные переменные
let currentUser = null;
let isDemoMode = false;
let firebaseInitialized = false;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 SoundCollab инициализирован');
    
    // Загружаем данные пользователя
    loadUserData();
    
    // Настройка навигации
    setupNavigation();
    
    // Настройка мобильного меню
    setupMobileMenu();
    
    // Настройка анимаций при скролле
    setupScrollAnimations();
    
    // Инициализация Firebase (если нужно)
    initializeFirebase();
});

// Загрузка данных пользователя
function loadUserData() {
    try {
        const userData = localStorage.getItem('currentUser');
        const demoMode = localStorage.getItem('isDemoMode');
        
        if (userData) {
            currentUser = JSON.parse(userData);
            isDemoMode = demoMode === 'true';
            console.log('👤 Пользователь загружен:', currentUser.email);
        }
    } catch (error) {
        console.error('❌ Ошибка загрузки пользователя:', error);
    }
}

// Настройка навигации
function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Настройка мобильного меню
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрыть меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Анимации при скролле
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    }
}

// Инициализация Firebase
function initializeFirebase() {
    // Проверяем, нужно ли Firebase на этой странице
    const needsFirebase = document.querySelector('[data-firebase]');
    
    if (needsFirebase) {
        loadFirebaseSDK().then(success => {
            if (success) {
                console.log('✅ Firebase загружен');
                firebaseInitialized = true;
            } else {
                console.warn('⚠️ Firebase не загружен');
            }
        });
    }
}

// Загрузка Firebase SDK
function loadFirebaseSDK() {
    return new Promise((resolve) => {
        // Если уже загружен
        if (typeof firebase !== 'undefined') {
            resolve(true);
            return;
        }
        
        console.log('📦 Загрузка Firebase SDK...');
        
        const scripts = [
            'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js',
            'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js',
            'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js',
            'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js'
        ];
        
        let loaded = 0;
        
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            
            script.onload = () => {
                loaded++;
                console.log(`✅ Загружен: ${src.split('/').pop()}`);
                
                if (loaded === scripts.length) {
                    console.log('🎉 Все Firebase SDK загружены');
                    initFirebaseApp();
                    resolve(true);
                }
            };
            
            script.onerror = () => {
                console.warn(`⚠️ Не удалось загрузить: ${src}`);
                loaded++;
                if (loaded === scripts.length) {
                    resolve(false);
                }
            };
            
            document.head.appendChild(script);
        });
        
        // Таймаут
        setTimeout(() => {
            if (loaded < scripts.length) {
                console.warn('⚠️ Таймаут загрузки Firebase');
                resolve(false);
            }
        }, 10000);
    });
}

// Инициализация Firebase App
function initFirebaseApp() {
    try {
        const firebaseConfig = {
            apiKey: "AIzaSyAKrjtyk9pXAdTRLI_Jm7pM-bRjvX7O3cI",
            authDomain: "soundcollab-production.firebaseapp.com",
            projectId: "soundcollab-production",
            storageBucket: "soundcollab-production.firebasestorage.app",
            messagingSenderId: "1024413284863",
            appId: "1:1024413284863:web:1e051df31f3fd0b3f0cfca",
            measurementId: "G-TYM8HQZ0ZS"
        };
        
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase App инициализирован');
        
    } catch (error) {
        console.error('❌ Ошибка инициализации Firebase App:', error);
    }
}

// Показ уведомлений
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: 10px;
        padding: 0.25rem;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
    
    return notification;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    return colors[type] || colors.info;
}

// Проверка авторизации
function checkAuth() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Выход из аккаунта
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isDemoMode');
    
    // Если Firebase инициализирован, выходим и оттуда
    if (firebaseInitialized && firebase.auth) {
        firebase.auth().signOut();
    }
    
    window.location.href = 'index.html';
}

// Форматирование времени
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Форматирование чисел
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Генерация случайного цвета
function getRandomColor() {
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c', 
        '#f6d365', '#fda085', '#4facfe', '#00f2fe'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Копирование в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Скопировано в буфер обмена', 'success');
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        showNotification('Не удалось скопировать', 'error');
    });
}

// Дебаунс функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Троттлинг функция
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Экспорт функций в глобальную область видимости
window.showNotification = showNotification;
window.checkAuth = checkAuth;
window.logout = logout;
window.formatTime = formatTime;
window.formatNumber = formatNumber;
window.getRandomColor = getRandomColor;
window.copyToClipboard = copyToClipboard;
window.debounce = debounce;
window.throttle = throttle;

console.log('✅ SoundCollab скрипты загружены');
