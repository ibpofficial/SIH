import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyIbpsihProductionClientKey2026",
  authDomain: "ibpsih.firebaseapp.com",
  projectId: "ibpsih",
  storageBucket: "ibpsih.firebasestorage.app",
  messagingSenderId: "102938475612",
  appId: "1:102938475612:web:9876543210fedcba"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export default app;
