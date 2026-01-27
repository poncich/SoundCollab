const firebaseConfig = {
  apiKey: "AIzaSyB5qJAbGxG-A3BekXXv-EPq3QrFohu30JE", // НОВЫЙ КЛЮЧ
  authDomain: "soundcollab-fes9d.firebaseapp.com",
  projectId: "soundcollab-fes9d",
  storageBucket: "soundcollab-fes9d.appspot.com",
  messagingSenderId: "383807903925",
  appId: "1:383807903925:web:093dcd6af81b53d1a6945b"
};

// Инициализация
if (!firebase.apps.length) {
  const app = firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} else {
  console.log("Firebase already initialized");
}
