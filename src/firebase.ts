import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDWzTbxc_CJ5PMog5OSAP-rWFqYij3nRAg",
  authDomain: "amuzecreatorportal.firebaseapp.com",
  projectId: "amuzecreatorportal",
  storageBucket: "amuzecreatorportal.firebasestorage.app",
  messagingSenderId: "268125967279",
  appId: "1:268125967279:web:c35893076018a1774d155a"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDymoPBC7ST5BeuFhxzxTAEHDZyWqirh74",
//   authDomain: "amuze-5057d.firebaseapp.com",
//   projectId: "amuze-5057d",
//   storageBucket: "amuze-5057d.firebasestorage.app",
//   messagingSenderId: "767561830964",
//   appId: "1:767561830964:web:eaa6b1a2c5097d79f53061",
//   measurementId: "G-KJWDK1VWC5"
// };

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);