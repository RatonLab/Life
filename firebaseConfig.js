import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZiZj_qLfLWi6LVd_FanMr3eocb7TfC78",
  authDomain: "biografia-app.firebaseapp.com",
  projectId: "biografia-app",
  storageBucket: "biografia-app.appspot.com", // <-- corregido: debe terminar en .appspot.com
  messagingSenderId: "340740395614",
  appId: "1:340740395614:web:ccfd70597fb3b84153dacf",
  measurementId: "G-96KYY96L6T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // <-- esto faltaba

export { auth, db, storage };
