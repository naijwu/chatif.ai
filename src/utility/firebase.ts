import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBMzraOI2WzMm7BggiRvJQKJL7K6RoFO8Q",
  authDomain: "chatif-ai.firebaseapp.com",
  databaseURL: "https://chatif-ai-default-rtdb.firebaseio.com",
  projectId: "chatif-ai",
  storageBucket: "chatif-ai.appspot.com",
  messagingSenderId: "531133839312",
  appId: "1:531133839312:web:ae4a2f698bdebe9afaebd5",
  measurementId: "G-MNPVF7D38Q",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

