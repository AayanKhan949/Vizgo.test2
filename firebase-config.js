// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-IpycvDoxbN7HZyIXBt2au3lDFro5pzE",
  authDomain: "vizgo-7cb85.firebaseapp.com",
  projectId: "vizgo-7cb85",
  storageBucket: "vizgo-7cb85.firebasestorage.app",
  messagingSenderId: "231836923398",
  appId: "1:231836923398:web:e1485aae1c2acfc3167587",
  measurementId: "G-X8N3XRPP0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  
  // Initialize services
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();
  
  export { auth, db, googleProvider };