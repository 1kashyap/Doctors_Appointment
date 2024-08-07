
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "**********************************",
  authDomain: "***************************",
  databaseURL: "***************************************",
  projectId: "*************",
  storageBucket: "**********************",
  messagingSenderId: "****************",
  appId: "***************************************",
  measurementId: "*************"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

