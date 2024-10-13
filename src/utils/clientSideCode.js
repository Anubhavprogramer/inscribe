// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase } from "https://inscribe-95090-default-rtdb.asia-southeast1.firebasedatabase.app/";

const firebaseConfig = {
  apiKey: "AIzaSyDpQ30QO8S7MSqb07xZSV0olY9Zgw6P6LU",
  authDomain: "inscribe-95090.firebaseapp.com",
  databaseURL: "https://inscribe-95090-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "inscribe-95090",
  storageBucket: "inscribe-95090.appspot.com",
  messagingSenderId: "578321580832",
  appId: "1:578321580832:web:2e6100b702037b194a8d45",
  measurementId: "G-D01S576EVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const notesRef = ref(database, "notes");

export default notesRef;