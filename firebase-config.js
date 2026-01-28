// Автоматически генерируется при сборке
const firebaseConfig = {
  apiKey: "demo-mode-key",
  authDomain: "",
  projectId: "soundcollab-fes9d",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
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
