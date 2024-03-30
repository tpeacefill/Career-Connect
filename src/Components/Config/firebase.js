import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkpCssHeMQ90hrbKJ_kJTw5It1eOxgh3M",
  authDomain: "career-connect-c66b7.firebaseapp.com",
  projectId: "career-connect-c66b7",
  storageBucket: "career-connect-c66b7.appspot.com",
  messagingSenderId: "32423903142",
  appId: "1:32423903142:web:0ce2a7180bd566e0ad1967",
  measurementId: "G-8QPSZEQ1F1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  googleProvider,
  db,
  getAuth,
  getFirestore,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  doc,
  setDoc,
  storage,
  getDoc,
};
