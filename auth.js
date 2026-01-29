// auth.js - РЕАЛЬНАЯ АУТЕНТИФИКАЦИЯ С FIREBASE

// Импорт из нашего конфига
import { auth, db } from './firebase-config.js';

// Импорт необходимых методов Firebase
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import { 
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentUser = null;
let authStateListeners = [];

// ==================== УТИЛИТЫ ====================
function formatFirebaseError(error) {
  const errorMap = {
    // Регистрация
    'auth/email-already-in-use': 'Этот email уже зарегистрирован',
    'auth/invalid-email': 'Некорректный email адрес',
    'auth/operation-not-allowed': 'Регистрация отключена',
    'auth/weak-password': 'Пароль слишком слабый (минимум 6 символов)',
    
    // Вход
    'auth/user-disabled': 'Аккаунт заблокирован',
    'auth/user-not-found': 'Пользователь не найден',
    'auth/wrong-password': 'Неверный пароль',
    
    // Общие
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    'auth/network-request-failed': 'Проблемы с сетью. Проверьте подключение',
    'auth/internal-error': 'Внутренняя ошибка сервера'
  };
  
  return errorMap[error.code] || error.message || 'Произошла ошибка';
}

// ==================== РЕАЛЬНАЯ РЕГИСТРАЦИЯ ====================
async function realRegister(name, email, password) {
  console.log('🔐 [REAL] Регистрация нового пользователя:', { name, email });
  
  try {
    // 1. Создаем пользователя в Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email.trim(), 
      password
    );
    
    const userId = userCredential.user.uid;
    console.log('✅ Пользователь создан в Auth, UID:', userId);
    
    // 2. Отправляем email подтверждение (опционально)
    // await sendEmailVerification(userCredential.user);
    
    // 3. Создаем документ пользователя в Firestore
    const userData = {
      uid: userId,
      email: email.trim().toLowerCase(),
      displayName: name.trim(),
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isPremium: false,
      isVerified: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=667eea&color=fff&bold=true`,
      stats: {
        projects: 0,
        tracks: 0,
        collaborations: 0,
        aiGenerations: 0,
        totalPlayTime: 0
      },
      preferences: {
        theme: 'dark',
        notifications: true,
        autoSave: true
      }
    };
    
    await setDoc(doc(db, "users", userId), userData);
    console.log('✅ Данные пользователя сохранены в Firestore');
    
    // 4. Сохраняем в localStorage для совместимости
    const userForStorage = {
      uid: userId,
      email: email.trim(),
      displayName: name.trim(),
      isPremium: false,
      avatar: userData.avatar
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userForStorage));
    localStorage.setItem('isAuthenticated', 'true');
    
    // 5. Обновляем текущего пользователя
    currentUser = userForStorage;
    
    // 6. Оповещаем слушателей
    notifyAuthStateChange(userForStorage);
    
    return userForStorage;
    
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    const formattedError = formatFirebaseError(error);
    throw new Error(formattedError);
  }
}

// ==================== РЕАЛЬНЫЙ ВХОД ====================
async function realLogin(email, password) {
  console.log('🔐 [REAL] Вход пользователя:', email);
  
  try {
    // 1. Аутентификация
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email.trim(), 
      password
    );
    
    const userId = userCredential.user.uid;
    console.log('✅ Вход успешен, UID:', userId);
    
    // 2. Получаем данные из Firestore
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    let userData;
    
    if (userDoc.exists()) {
      // Обновляем последний вход
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
      
      userData = userDoc.data();
    } else {
      // Создаем базовый профиль если не существует
      userData = {
        displayName: email.split('@')[0],
        email: email.trim(),
        isPremium: false,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=667eea&color=fff`,
        stats: { projects: 0, tracks: 0, collaborations: 0, aiGenerations: 0 }
      };
      
      await setDoc(userDocRef, {
        ...userData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    }
    
    // 3. Подготавливаем данные для клиента
    const clientUserData = {
      uid: userId,
      email: userCredential.user.email,
      displayName: userData.displayName || email.split('@')[0],
      isPremium: userData.isPremium || false,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=667eea&color=fff`,
      stats: userData.stats || {
        projects: 0,
        tracks: 0,
        collaborations: 0
      }
    };
    
    // 4. Сохраняем в localStorage
    localStorage.setItem('currentUser', JSON.stringify(clientUserData));
    localStorage.setItem('isAuthenticated', 'true');
    
    // 5. Обновляем текущего пользователя
    currentUser = clientUserData;
    
    // 6. Оповещаем слушателей
    notifyAuthStateChange(clientUserData);
    
    return clientUserData;
    
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    const formattedError = formatFirebaseError(error);
    throw new Error(formattedError);
  }
}

// ==================== ВЫХОД ====================
async function realLogout() {
  console.log('🚪 [REAL] Выход пользователя');
  
  try {
    await signOut(auth);
    
    // Очищаем localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('demoProjects');
    localStorage.removeItem('demoMusic');
    
    // Сбрасываем текущего пользователя
    currentUser = null;
    
    // Оповещаем слушателей
    notifyAuthStateChange(null);
    
    console.log('✅ Выход успешен');
    return true;
    
  } catch (error) {
    console.error('❌ Ошибка при выходе:', error);
    throw error;
  }
}

// ==================== ВОССТАНОВЛЕНИЕ ПАРОЛЯ ====================
async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (error) {
    console.error('❌ Ошибка восстановления пароля:', error);
    throw new Error(formatFirebaseError(error));
  }
}

// ==================== СЛУШАТЕЛЬ СОСТОЯНИЯ АУТЕНТИФИКАЦИИ ====================
function initAuthListener() {
  console.log('👂 Инициализация слушателя состояния аутентификации...');
  
  onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('🔄 Изменение состояния аутентификации:', firebaseUser ? 'вошел' : 'вышел');
    
    if (firebaseUser) {
      try {
        // Загружаем данные пользователя из Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        
        let userData;
        if (userDoc.exists()) {
          userData = userDoc.data();
          
          // Обновляем последний вход
          await updateDoc(doc(db, "users", firebaseUser.uid), {
            lastLogin: serverTimestamp()
          });
        } else {
          userData = {
            displayName: firebaseUser.email.split('@')[0],
            isPremium: false,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.email.split('@')[0])}&background=667eea&color=fff`,
            stats: { projects: 0, tracks: 0, collaborations: 0 }
          };
        }
        
        const clientUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: userData.displayName || firebaseUser.email.split('@')[0],
          isPremium: userData.isPremium || false,
          avatar: userData.avatar,
          stats: userData.stats || { projects: 0, tracks: 0, collaborations: 0 }
        };
        
        // Сохраняем в localStorage
        localStorage.setItem('currentUser', JSON.stringify(clientUserData));
        localStorage.setItem('isAuthenticated', 'true');
        
        currentUser = clientUserData;
        notifyAuthStateChange(clientUserData);
        
      } catch (error) {
        console.error('❌ Ошибка загрузки данных пользователя:', error);
        // Используем базовые данные
        const basicUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(basicUserData));
        localStorage.setItem('isAuthenticated', 'true');
        
        currentUser = basicUserData;
        notifyAuthStateChange(basicUserData);
      }
    } else {
      // Пользователь вышел
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      
      currentUser = null;
      notifyAuthStateChange(null);
    }
  });
}

// ==================== УПРАВЛЕНИЕ СЛУШАТЕЛЯМИ ====================
function addAuthStateListener(callback) {
  authStateListeners.push(callback);
  
  // Немедленно вызываем с текущим состоянием
  if (currentUser !== undefined) {
    callback(currentUser);
  }
}

function removeAuthStateListener(callback) {
  authStateListeners = authStateListeners.filter(listener => listener !== callback);
}

function notifyAuthStateChange(user) {
  console.log('📢 Оповещение слушателей:', user ? 'пользователь обновлен' : 'пользователь вышел');
  authStateListeners.forEach(listener => {
    try {
      listener(user);
    } catch (error) {
      console.error('❌ Ошибка в слушателе:', error);
    }
  });
}

// ==================== ПОЛУЧЕНИЕ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ ====================
function getCurrentUser() {
  if (currentUser) {
    return currentUser;
  }
  
  // Пробуем получить из localStorage
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

// ==================== ПРОВЕРКА АУТЕНТИФИКАЦИИ ====================
function isAuthenticated() {
  return !!getCurrentUser();
}

// ==================== ОБНОВЛЕНИЕ ПРОФИЛЯ ====================
async function updateProfile(updates) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('Пользователь не авторизован');
  }
  
  try {
    await updateDoc(doc(db, "users", user.uid), updates);
    
    // Обновляем локальные данные
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    currentUser = updatedUser;
    
    notifyAuthStateChange(updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error('❌ Ошибка обновления профиля:', error);
    throw error;
  }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function initAuth() {
  console.log('🔄 Инициализация системы аутентификации...');
  
  // Загружаем пользователя из localStorage
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      console.log('📱 Пользователь загружен из localStorage:', currentUser.email);
    } catch (e) {
      console.warn('⚠️ Не удалось загрузить пользователя из localStorage');
    }
  }
  
  // Запускаем слушатель Firebase
  initAuthListener();
  
  console.log('✅ Система аутентификации инициализирована');
}

// ==================== ЭКСПОРТ ====================
export { 
  // Основные функции
  realRegister,
  realLogin,
  realLogout,
  resetPassword,
  
  // Управление состоянием
  initAuth,
  getCurrentUser,
  isAuthenticated,
  updateProfile,
  
  // Слушатели
  addAuthStateListener,
  removeAuthStateListener,
  
  // Сервисы Firebase
  auth,
  db
};

// Автоматическая инициализация при загрузке модуля
setTimeout(() => {
  initAuth();
}, 100);
