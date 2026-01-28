// auth.js
document.addEventListener('DOMContentLoaded', function() {
  console.log("📱 Страница загружена, инициализируем авторизацию...");
  
  // Находим кнопку "Попробовать бесплатно"
  const mainActionBtn = document.getElementById('main-action-btn');
  
  if (mainActionBtn) {
    console.log("✅ Кнопка найдена, добавляем обработчик...");
    mainActionBtn.addEventListener('click', handleMainAction);
  } else {
    console.error("❌ Кнопка с id='main-action-btn' не найдена!");
  }
  
  // Проверяем, не вошел ли пользователь уже
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("👤 Пользователь уже вошел:", user.email);
      // Можно перенаправить на dashboard
      // window.location.href = "dashboard.html";
    }
  });
});

async function handleMainAction() {
  console.log("🔄 Начинаем процесс входа...");
  
  try {
    // Создаем провайдера Google
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Добавляем дополнительные разрешения если нужно
    provider.addScope('profile');
    provider.addScope('email');
    
    // Показываем индикатор загрузки
    const button = document.getElementById('main-action-btn');
    const originalText = button.textContent;
    button.textContent = "Вход через Google...";
    button.disabled = true;
    
    // Входим через всплывающее окно
    const result = await firebase.auth().signInWithPopup(provider);
    
    console.log("✅ Вход успешен!", result.user);
    
    // Показываем приветствие
    alert(`🎉 Добро пожаловать в SoundCollab, ${result.user.displayName}!`);
    
    // Перенаправляем на dashboard
    window.location.href = "dashboard.html";
    
  } catch (error) {
    console.error("❌ Ошибка входа:", error);
    
    // Восстанавливаем кнопку
    const button = document.getElementById('main-action-btn');
    button.textContent = "Попробовать бесплатно";
    button.disabled = false;
    
    // Показываем понятное сообщение об ошибке
    let errorMessage = "Не удалось войти. ";
    
    switch (error.code) {
      case 'auth/popup-blocked':
        errorMessage += "Всплывающее окно было заблокировано браузером. Разрешите всплывающие окна для этого сайта.";
        break;
      case 'auth/popup-closed-by-user':
        errorMessage += "Вы закрыли окно входа. Попробуйте еще раз.";
        break;
      case 'auth/unauthorized-domain':
        errorMessage += "Домен не авторизован. Мы уже работаем над исправлением.";
        break;
      default:
        errorMessage += error.message;
    }
    
    alert(errorMessage);
  }
}

// Функция выхода (для dashboard)
function logout() {
  firebase.auth().signOut().then(() => {
    console.log("✅ Выход выполнен");
    window.location.href = "index.html";
  });
}
