import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyCjt-1UtxBlgQLgEGkivmj4Fw3iewoyMTU",
//   authDomain: "noti-testing-f0543.firebaseapp.com",
//   projectId: "noti-testing-f0543",
//   storageBucket: "noti-testing-f0543.firebasestorage.app",
//   messagingSenderId: "190837130300",
//   appId: "1:190837130300:web:241f3cb9a73d6cd1016f39",
//   measurementId: "G-B4F2782VXV"
// };
// const firebaseConfig = {
//   apiKey: "AIzaSyDymoPBC7ST5BeuFhxzxTAEHDZyWqirh74",
//   authDomain: "amuze-5057d.firebaseapp.com",
//   projectId: "amuze-5057d",
//   storageBucket: "amuze-5057d.firebasestorage.app",
//   messagingSenderId: "767561830964",
//   appId: "1:767561830964:web:eaa6b1a2c5097d79f53061",
//   measurementId: "G-KJWDK1VWC5"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDWzTbxc_CJ5PMog5OSAP-rWFqYij3nRAg",
  authDomain: "amuzecreatorportal.firebaseapp.com",
  databaseURL: "https://amuzecreatorportal-default-rtdb.firebaseio.com",
  projectId: "amuzecreatorportal",
  storageBucket: "amuzecreatorportal.firebasestorage.app",
  messagingSenderId: "268125967279",
  appId: "1:268125967279:web:c35893076018a1774d155a"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);