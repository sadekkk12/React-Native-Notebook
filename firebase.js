// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSfjbhmAy-1koiTv4ClhgKYYfqDSjYQDM",
  authDomain: "notebook-6b8df.firebaseapp.com",
  projectId: "notebook-6b8df",
  storageBucket: "notebook-6b8df.appspot.com",
  messagingSenderId: "681900691658",
  appId: "1:681900691658:web:04fb6135b3f5d4948b2433"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
export {app, database}