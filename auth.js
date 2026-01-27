function initAuth() {
  // Проверяем, загружен ли Firebase
  if (typeof firebase === 'undefined') {
    console.error('Firebase не загружен! Проверь подключение в index.html');
    return;
  }
  
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  
  // Кнопка входа
  const loginBtn = document.getElementById('google-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      auth.signInWithRedirect(googleProvider)
        .then((result) => {
          console.log('✅ Вход выполнен:', result.user.email);
          updateUI(true, result.user);
        })
        .catch((error) => {
          console.error('❌ Ошибка входа:', error.message);
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
          console.log('✅ Выход выполнен');
          updateUI(false);
        })
        .catch((error) => {
          console.error('❌ Ошибка выхода:', error);
        });
    });
  }
  
  // Отслеживание состояния входа
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('👤 Пользователь авторизован:', user.email);
      updateUI(true, user);
    } else {
      console.log('👤 Пользователь не авторизован');
      updateUI(false);
    }
  });
  
  function updateUI(isLoggedIn, user = null) {
    const loginBtn = document.getElementById('google-login-btn');
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Показываем/скрываем кнопки
    if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    
    // Показываем информацию о пользователе
    if (userInfo && user) {
      userInfo.innerHTML = `
        <div class="user-profile">
          <img src="${user.photoURL || 'https://via.placeholder.com/40'}" 
               alt="Аватар" width="40" height="40" style="border-radius: 50%;">
          <span>Привет, ${user.displayName || user.email || 'Пользователь'}!</span>
        </div>
      `;
    } else if (userInfo) {
      userInfo.innerHTML = ''; // Очищаем, если пользователь вышел
    }
  }
  
  // Инициализируем UI текущим состоянием
  const currentUser = auth.currentUser;
  updateUI(!!currentUser, currentUser);
}

// Запуск когда страница загрузится
document.addEventListener('DOMContentLoaded', initAuth);

