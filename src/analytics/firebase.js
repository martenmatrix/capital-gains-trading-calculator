// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_hr-WrS2w4ApJjksRi81DbtMGU8mQSK4",
  authDomain: "trading-csv-fifo-calculator.firebaseapp.com",
  projectId: "trading-csv-fifo-calculator",
  storageBucket: "trading-csv-fifo-calculator.appspot.com",
  messagingSenderId: "1065719901351",
  appId: "1:1065719901351:web:97914e23b36ce3d865ff82",
  measurementId: "G-K4KRGYDCEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
