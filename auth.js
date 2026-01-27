/ auth.js - ИСПРАВЛЕННЫЙ ВАРИАНТ
function initAuth() {
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  
  // Кнопка входа
  const loginBtn = document.getElementById('google-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      auth.signInWithPopup(googleProvider)
        .then((result) => {
          console.log('Вход выполнен:', result.user);
          updateUI(true, result.user);
        })
        .catch((error) => {
          console.error('Ошибка входа:', error);
          alert('Ошибка входа: ' + error.message);
        });
    });
  }
  
  // Кнопка выхода
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut()
        .then(() => {
          console.log('Выход выполнен');
        })
        .catch((error) => {
          console.error('Ошибка выхода:', error);
        });
    });
  }
  
  // Отслеживание состояния входа
  auth.onAuthStateChanged((user) => {
    if (user) {
      updateUI(true, user);
    } else {
      updateUI(false);
    }
  });
  
  function updateUI(isLoggedIn, user = null) {
    const loginBtn = document.getElementById('google-login-btn');
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    
    if (userInfo && user) {
      // ВАЖНО: исправлена синтаксическая ошибка в шаблонной строке
      userInfo.innerHTML = `
        <div class="user-profile">
          <img src="${user.photoURL || 'https://via.placeholder.com/40'}" 
               alt="Аватар" width="40" height="40" style="border-radius: 50%;">
          <span>Привет, ${user.displayName || 'Пользователь'}!</span>
        </div>
      `;
    } else if (userInfo) {
      userInfo.innerHTML = ''; // Очищаем, если пользователь вышел
    }
  }
}

// Запуск когда страница загрузится
document.addEventListener('DOMContentLoaded', initAuth);
