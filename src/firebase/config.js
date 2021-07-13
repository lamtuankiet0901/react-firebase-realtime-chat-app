import firebase from "firebase/app";

import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"

var firebaseConfig = {
    apiKey: "AIzaSyB3qd1jwOT91Nf9sG_GyhJ2M5alWLG_ytY",
    authDomain: "chat-app-31c6c.firebaseapp.com",
    projectId: "chat-app-31c6c",
    storageBucket: "chat-app-31c6c.appspot.com",
    messagingSenderId: "945655884283",
    appId: "1:945655884283:web:5bd87f540e6e3252c5035e",
    measurementId: "G-JYWKDLNB48"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

auth.useEmulator('http://localhost:9099');
if (window.location.hostname === 'localhost') {
    db.useEmulator('localhost', '8080');
}

export {auth, db};
export default firebase;