// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNt6TAzYa9dhyg8d_69NLT1DrNEU-j7nM",
  authDomain: "gotta-reel-them-all.firebaseapp.com",
  projectId: "gotta-reel-them-all",
  storageBucket: "gotta-reel-them-all.firebasestorage.app",
  messagingSenderId: "930017927706",
  appId: "1:930017927706:web:cd2783258c70788675a7a3",
  measurementId: "G-PR5NN38268"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
