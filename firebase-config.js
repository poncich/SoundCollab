const firebaseConfig = {
  apiKey: "AIzaSyCwfHcLrEGB4V73r4utINVzflaA5DOp2s",
  authDomain: "soundcollab-test-8a7c9.firebaseapp.com",
  projectId: "soundcollab-test-8a7c9",
  storageBucket: "soundcollab-test-8a7c9.appspot.com",
  messagingSenderId: "1052506780909",
  appId: "1:1052506780909:web:7f7c52b9c3d9c64378c3e9"
};


// Инициализация
if (!firebase.apps.length) {
  const app = firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} else {
  console.log("Firebase already initialized");
}
