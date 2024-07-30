// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider,signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, startAfter, endBefore, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc, setDoc, getDoc, startAt } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyAbXnH3dAkWr5TTN6Y9b3_QOfnOPj5JpdE",
  authDomain: "techright-d04e3.firebaseapp.com",
  projectId: "techright-d04e3",
  storageBucket: "techright-d04e3.appspot.com",
  messagingSenderId: "167063003822",
  appId: "1:167063003822:web:09b62e8b2de126e407833f",
  measurementId: "G-3MSYXJ49M5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);
const signInWithTwitter = () => signInWithPopup(auth, twitterProvider);
const storage = getStorage(app);
export { auth,storage,getStorage, ref, uploadBytes, getDownloadURL ,FacebookAuthProvider,createUserWithEmailAndPassword,signInWithPopup ,TwitterAuthProvider,GoogleAuthProvider,signInWithEmailAndPassword, signInWithGoogle, signInWithFacebook, signInWithTwitter, db, collection, getDocs, addDoc, query, where, orderBy, limit, startAfter, endBefore, onSnapshot, serverTimestamp, doc, updateDoc, deleteDoc, setDoc, getDoc, startAt };
