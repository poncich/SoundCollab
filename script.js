// script.js - ОБНОВЛЕННЫЙ ДЛЯ REAL FIREBASE

// Импортируем функции аутентификации
import { 
  realRegister, 
  realLogin, 
  realLogout, 
  getCurrentUser,
  isAuthenticated,
  addAuthStateListener 
} from './auth.js';

// ==================== ОБНОВЛЕННЫЕ ОБРАБОТЧИКИ ФОРМ ====================

// Регистрация
async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('regName')?.value;
  const email = document.getElementById('regEmail')?.value;
  const password = document.getElementById('regPassword')?.value;
  
  if (!name || !email || !password) {
    alert('Заполните все поля');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Регистрация...';
  submitBtn.disabled = true;
  
  try {
    const user = await realRegister(name, email, password);
    
    // Показываем успешное сообщение
    showNotification('Регистрация успешна!', 'success');
    
    // Редирект на дашборд
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    showNotification(error.message, 'error');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Вход
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;
  
  if (!email || !password) {
    alert('Заполните все поля');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Вход...';
  submitBtn.disabled = true;
  
  try {
    const user = await realLogin(email, password);
    
    // Показываем успешное сообщение
    showNotification(`Добро пожаловать, ${user.displayName}!`, 'success');
    
    // Редирект на дашборд
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
    
  } catch (error) {
    console.error('Ошибка входа:', error);
    showNotification(error.message, 'error');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Выход
async function handleLogout() {
  try {
    await realLogout();
    showNotification('Вы успешно вышли', 'info');
    
    // Редирект на главную
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    
  } catch (error) {
    console.error('Ошибка выхода:', error);
    showNotification('Ошибка при выходе', 'error');
  }
}

// ==================== УТИЛИТЫ УВЕДОМЛЕНИЙ ====================
function showNotification(message, type = 'info') {
  // Удаляем старое уведомление
  const oldNotification = document.querySelector('.notification');
  if (oldNotification) {
    oldNotification.remove();
  }
  
  // Создаем новое уведомление
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-text">${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  // Стили для уведомления
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${getNotificationColor(type)};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s ease;
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
    font-size: 20px;
    cursor: pointer;
    margin-left: 10px;
  `;
  
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  });
  
  document.body.appendChild(notification);
  
  // Автоматическое скрытие
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return icons[type] || icons.info;
}

function getNotificationColor(type) {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  return colors[type] || colors.info;
}

// ==================== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ПОЛЬЗОВАТЕЛЯ ====================
function updateUserInterface() {
  const user = getCurrentUser();
  
  // Обновляем навигацию
  const navAuth = document.querySelector('.nav-auth');
  const userAvatar = document.querySelector('.user-avatar');
  const userName = document.querySelector('.user-name');
  
  if (navAuth) {
    if (user) {
      navAuth.innerHTML = `
        <div class="user-menu">
          <img src="${user.avatar || 'https://ui-avatars.com/api/?name=User&background=667eea&color=fff'}" 
               alt="${user.displayName}" 
               class="user-avatar-small">
          <span class="user-greeting">Привет, ${user.displayName}!</span>
          <button onclick="handleLogout()" class="btn-logout">Выйти</button>
        </div>
      `;
    } else {
      navAuth.innerHTML = `
        <a href="login.html" class="btn btn-outline">Войти</a>
        <a href="register.html" class="btn btn-primary">Регистрация</a>
      `;
    }
  }
  
  // Обновляем информацию на дашборде
  if (userName && user) {
    userName.textContent = user.displayName;
  }
  
  if (userAvatar && user) {
    userAvatar.src = user.avatar || 'https://ui-avatars.com/api/?name=User&background=667eea&color=fff';
    userAvatar.alt = user.displayName;
  }
}

// ==================== ЗАЩИТА МАРШРУТОВ ====================
function protectRoute() {
  const isAuthPage = window.location.pathname.includes('login.html') || 
                     window.location.pathname.includes('register.html');
  
  if (isAuthenticated() && isAuthPage) {
    // Если пользователь уже вошел, перенаправляем на дашборд
    window.location.href = 'dashboard.html';
    return false;
  }
  
  if (!isAuthenticated() && !isAuthPage && 
      !window.location.pathname.includes('index.html') &&
      !window.location.pathname.includes('/')) {
    // Если пользователь не вошел, перенаправляем на логин
    window.location.href = 'login.html';
    return false;
  }
  
  return true;
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 SoundCollab - Инициализация...');
  
  // Защищаем маршруты
  protectRoute();
  
  // Обновляем интерфейс пользователя
  updateUserInterface();
  
  // Подписываемся на изменения аутентификации
  addAuthStateListener(updateUserInterface);
  
  // Назначаем обработчики форм
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Добавляем стили для анимаций
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .user-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #667eea;
    }
    
    .user-greeting {
      color: white;
      font-weight: 500;
    }
    
    .btn-logout {
      background: #ef4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }
    
    .btn-logout:hover {
      background: #dc2626;
    }
  `;
  document.head.appendChild(style);
});

// ==================== ГЛОБАЛЬНЫЙ ЭКСПОРТ ====================
window.handleLogout = handleLogout;
window.showNotification = showNotification;
