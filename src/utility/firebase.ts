// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMzraOI2WzMm7BggiRvJQKJL7K6RoFO8Q",
  authDomain: "chatif-ai.firebaseapp.com",
  databaseURL: "https://chatif-ai-default-rtdb.firebaseio.com",
  projectId: "chatif-ai",
  storageBucket: "chatif-ai.appspot.com",
  messagingSenderId: "531133839312",
  appId: "1:531133839312:web:ae4a2f698bdebe9afaebd5",
  measurementId: "G-MNPVF7D38Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);