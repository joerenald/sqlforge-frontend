import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBHhUJekje18QAdYAS4FLFVR2SwQm77pA",
  authDomain: "sqlforge-dbbe9.firebaseapp.com",
  projectId: "sqlforge-dbbe9",
  storageBucket: "sqlforge-dbbe9.firebasestorage.app",
  messagingSenderId: "756226439946",
  appId: "1:756226439946:web:839a19f30fcabd032b98f3",
  measurementId: "G-2E3B872YY9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
console.log("Firebase initialized successfully");