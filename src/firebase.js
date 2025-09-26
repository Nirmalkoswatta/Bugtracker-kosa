// Firebase configuration for Bugtracker-kosa

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnJNDPGUqHw-Ok6da4louF8d2u45mJGzw",
  authDomain: "rentmedb-f3da6.firebaseapp.com",
  projectId: "rentmedb-f3da6",
  storageBucket: "rentmedb-f3da6.appspot.com",
  messagingSenderId: "33370459489",
  appId: "1:33370459489:web:your-app-id",
  measurementId: "G-your-measurement-id"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
