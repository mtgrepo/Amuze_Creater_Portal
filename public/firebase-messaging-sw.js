// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");
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
  projectId: "amuzecreatorportal",
  storageBucket: "amuzecreatorportal.firebasestorage.app",
  messagingSenderId: "268125967279",
  appId: "1:268125967279:web:c35893076018a1774d155a"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});