// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-19fa5.firebaseapp.com",
  projectId: "mern-blog-19fa5",
  storageBucket: "mern-blog-19fa5.appspot.com",
  messagingSenderId: "969327209025",
  appId: "1:969327209025:web:b822e4365356f56d37f4c0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);