const firebaseConfig = {
  apiKey: "AIzaSyDDx8iKcZ12bC8QQcLDLaVlzOueAJC3rTg",
  authDomain: "soundcollab-fes9d.firebaseapp.com",
  projectId: "soundcollab-fes9d",
  storageBucket: "soundcollab-fes9d.appspot.com",
  messagingSenderId: "383807903925",
  appId: "1:383807903925:web:093dcd6af81b53d1a6945b"
};

// Инициализируем Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log("Firebase initialized for domain:", window.location.hostname);
