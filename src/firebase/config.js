import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtm4CLGMEedQDGIwbbEDVLdSefwXGx5-w",
  authDomain: "restaurants-app-react.firebaseapp.com",
  projectId: "restaurants-app-react",
  storageBucket: "restaurants-app-react.firebasestorage.app",
  messagingSenderId: "842933804138",
  appId: "1:842933804138:web:98ebb73aebe3757e8e7e13"
  
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };