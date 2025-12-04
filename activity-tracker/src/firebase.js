// Firebase initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { __firebase_config } from "./config";

const firebaseApp = initializeApp(__firebase_config);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
