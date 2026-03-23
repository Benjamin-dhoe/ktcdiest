import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNWSQA2-p3eJqeqmxOCxnrhBKkZMTpOxg",
  authDomain: "ktc-diest-2791b.firebaseapp.com",
  projectId: "ktc-diest-2791b",
  storageBucket: "ktc-diest-2791b.firebasestorage.app",
  messagingSenderId: "264576003118",
  appId: "1:264576003118:web:37bc5d07b1b3b2db1fc3bf"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export {auth, app, storage };
