require('dotenv').config();
const firebase = require('firebase');
const admin = require('firebase-admin');
admin.initializeApp();


const firebaseConfig = {
  apiKey: process.env.firebase_apiKey,
  authDomain: process.env.firebase_authDomain,
  projectId: process.env.firebase_projectId,
  storageBucket: process.env.sfirebase_torageBucket,
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appId,
  measurementId: process.env.firebase_measurementId
};
firebase.initializeApp(firebaseConfig);

// Authentication
const auth = firebase.auth();

// Firestore
const db = admin.firestore();

// Storage
const storage = admin.storage();

module.exports = { auth, db, admin, storage };