// auth-minimal.js
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Заполните все поля');
        return;
    }
    
    const btn = document.querySelector('#loginForm .auth-button');
    btn.textContent = 'Вход...';
    btn.disabled = true;
    
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        showSuccess('Добро пожаловать!');
        console.log('Вход успешен:', userCredential.user.email);
        
        // Перенаправляем через 1 секунду
        setTimeout(() => {
            window.location.href = 'dashboard-simple.html';
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        btn.textContent = 'Войти';
        btn.disabled = false;
        
        let message = 'Ошибка входа: ';
        switch (error.code) {
            case 'auth/user-not-found': message = 'Пользователь не найден'; break;
            case 'auth/wrong-password': message = 'Неверный пароль'; break;
            default: message += error.message;
        }
        alert(message);
    }
}

async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        alert('Заполните все поля');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
    }
    
    const btn = document.querySelector('#registerForm .auth-button');
    btn.textContent = 'Регистрация...';
    btn.disabled = true;
    
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Обновляем имя пользователя
        await userCredential.user.updateProfile({ displayName: name });
        
        showSuccess('Регистрация успешна! Добро пожаловать, ' + name + '!');
        console.log('Регистрация успешна:', userCredential.user.uid);
        
        // Перенаправляем через 2 секунды
        setTimeout(() => {
            window.location.href = 'dashboard-simple.html';
        }, 2000);
        
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        btn.textContent = 'Создать аккаунт';
        btn.disabled = false;
        
        let message = 'Ошибка регистрации: ';
        switch (error.code) {
            case 'auth/email-already-in-use': message = 'Email уже используется'; break;
            case 'auth/invalid-email': message = 'Неверный формат email'; break;
            default: message += error.message;
        }
        alert(message);
    }
}

function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s;
    `;
    
    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`;
    document.head.appendChild(style);
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
        style.remove();
    }, 3000);
}

// Проверяем, вошел ли пользователь
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('Пользователь уже вошел:', user.email);
        // Можно автоматически перенаправить
        // window.location.href = 'dashboard-simple.html';
    } else {
        console.log('Пользователь не вошел');
    }
});
