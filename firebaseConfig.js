import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZiZj_qLfLWi6LVd_FanMr3eocb7TfC78",
  authDomain: "biografia-app.firebaseapp.com",
  projectId: "biografia-app",
  storageBucket: "biografia-app.firebasestorage.app",
  messagingSenderId: "340740395614",
  appId: "1:340740395614:web:ccfd70597fb3b84153dacf",
  measurementId: "G-96KYY96L6T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
