import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8Ke4nr75Ci8G3OR2vOUBQ5ecByyCsTSs",
  authDomain: "trendboard-9d9c8.firebaseapp.com",
  projectId: "trendboard-9d9c8",
  storageBucket: "trendboard-9d9c8.firebasestorage.app",
  messagingSenderId: "344121907038",
  appId: "1:344121907038:web:1e36c32396c387044aa1cf",
  measurementId: "G-NSMP8RK3LY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);