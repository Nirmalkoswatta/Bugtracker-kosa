// Firebase configuration for Bugtracker-kosa

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXdqXjri1UH7d79qCLr2oEwHnABjn8dcM",
  authDomain: "bug-tracker-updated.firebaseapp.com",
  projectId: "bug-tracker-updated",
  storageBucket: "bug-tracker-updated.appspot.com",
  messagingSenderId: "40171616795",
  appId: "1:40171616795:web:your-app-id",
  measurementId: "G-your-measurement-id"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
