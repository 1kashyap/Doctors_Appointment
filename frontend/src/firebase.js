
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCIIpSmfwinHzn8col2KZJYDqJPZUBQXxk",
  authDomain: "doc-test-1-c8dab.firebaseapp.com",
  databaseURL: "https://doc-test-1-c8dab-default-rtdb.firebaseio.com",
  projectId: "doc-test-1-c8dab",
  storageBucket: "doc-test-1-c8dab.appspot.com",
  messagingSenderId: "538079324773",
  appId: "1:538079324773:web:c0f8b4ffc5ccf67b91f48c",
  measurementId: "G-Y0B74ZXBMT"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

