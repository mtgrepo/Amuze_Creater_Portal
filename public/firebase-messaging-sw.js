
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// const firebaseConfig = {
//   apiKey: "AIzaSyDWzTbxc_CJ5PMog5OSAP-rWFqYij3nRAg",
//   authDomain: "amuzecreatorportal.firebaseapp.com",
//   projectId: "amuzecreatorportal",
//   storageBucket: "amuzecreatorportal.firebasestorage.app",
//   messagingSenderId: "268125967279",
//   appId: "1:268125967279:web:c35893076018a1774d155a"
// };

firebase.initializeApp({
  apiKey: "AIzaSyDWzTbxc_CJ5PMog5OSAP-rWFqYij3nRAg",
  authDomain: "amuzecreatorportal.firebaseapp.com",
  databaseURL: "https://amuzecreatorportal-default-rtdb.firebaseio.com",
  projectId: "amuzecreatorportal",
  storageBucket: "amuzecreatorportal.firebasestorage.app",
  messagingSenderId: "268125967279",
  appId: "1:268125967279:web:c35893076018a1774d155a"
});

console.log('Initialized the firebase apps')

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});

console.log('Firebase is listening the message')

// self.addEventListener("push", (event) => {
//   console.log("[SW] Push event received:", event);

//   const data = event.data?.json();
//   console.log("[SW] Push payload:", data);

//   self.registration.showNotification(
//     data?.notification?.title || "Test Notification",
//     {
//       body: data?.notification?.body || "Push received successfully",
//       icon: "/favicon.ico",
//     }
//   );
// });