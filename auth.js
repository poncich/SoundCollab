// auth.js
function initAuth() {
  // Проверяем текущий домен
  console.log("Current domain:", window.location.hostname);
  console.log("Full URL:", window.location.href);
  
  // Кнопка входа
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', signInWithGoogle);
  }
}

async function signInWithGoogle() {
  try {
    console.log("Starting Google sign-in...");
    
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Добавляем scope если нужно
    provider.addScope('profile');
    provider.addScope('email');
    
    // Пробуем войти с перенаправлением (лучше для мобильных)
    const result = await firebase.auth().signInWithRedirect(provider);
    
    console.log("Redirect initiated...");
  } catch (error) {
    console.error("Sign-in error:", error);
    alert("Ошибка входа: " + error.message);
  }
}

// Проверяем результат редиректа
firebase.auth().getRedirectResult().then((result) => {
  if (result.user) {
    console.log("User signed in via redirect:", result.user.email);
    window.location.href = "dashboard.html";
  }
}).catch((error) => {
  console.error("Redirect error:", error);
});

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', initAuth);
