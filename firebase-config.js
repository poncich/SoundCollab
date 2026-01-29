// Автоматически генерируется при сборке
const firebaseConfig = {
  apiKey: "AIzaSyAKrjtyk9pXAdTRLI_Jm7pM-bRjvX7O3cI",
  authDomain: "soundcollab-production.firebaseapp.com",
  projectId: "soundcollab-fes9d",
  storageBucket: "lab-production.firebasestorage.app",
  messagingSenderId: "1024413284863",
  appId: "1:1024413284863:web:1e051df31f3fd0b3f0cfca"
};

// Проверка на демо-режим
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'demo-mode-key') {
  console.warn('Firebase не настроен. Включен демо-режим.');
  window.isDemoMode = true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig };
} else {
  window.firebaseConfig = firebaseConfig;
}
