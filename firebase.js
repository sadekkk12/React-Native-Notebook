// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9qvB0945cJFa-CUhGo-ZPuBYzSbQoWKw",
  authDomain: "notebook-9f484.firebaseapp.com",
  projectId: "notebook-9f484",
  storageBucket: "notebook-9f484.appspot.com",
  messagingSenderId: "898915425606",
  appId: "1:898915425606:web:58721eb28e6486e3135947"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
export {app, database}