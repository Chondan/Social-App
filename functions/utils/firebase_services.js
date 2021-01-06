require('dotenv').config();
const path = require('path');
const firebase = require('firebase');
const admin = require('firebase-admin');
admin.initializeApp();

const firebaseConfig = {
  apiKey: process.env.firebase_apiKey,
  authDomain: process.env.firebase_authDomain,
  projectId: process.env.firebase_projectId,
  storageBucket: process.env.firebase_storageBucket,
  messagingSenderId: process.env.firebase_messagingSenderId,
  appId: process.env.firebase_appId,
};
firebase.initializeApp(firebaseConfig);

// Authentication
const auth = firebase.auth();

// Firestore
const db = admin.firestore();

// Storage
const storage = admin.storage();
const bucket = storage.bucket(process.env.firebase_storageBucket);

module.exports = { auth, db, admin, bucket };