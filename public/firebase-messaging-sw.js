
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

const messaging = firebase.messaging();

const getTargetUrl = (type, titleId) => {
  const routes = {
    "USER LIKED NOVEL": `/creator-portal/entertainment/novel/details/${titleId}`,
    "USER COMMENT ON NOVEL": `/entertainment/novel/details/${titleId}`,
    "USER LIKED COMIC": `/entertainment/comics/details/${titleId}`,
    "USER COMMENT ON COMIC": `/entertainment/comics/details/${titleId}`,
    "USER LIKED STORY": `/entertainment/storytelling/details/${titleId}`,
    "USER COMMENT ON STORY": `/entertainment/storytelling/details/${titleId}`,
    "USER LIKED GALLERY": `/entertainment/gallery/details/${titleId}`,
    "USER COMMENT ON GALLERY": `/entertainment/gallery/details/${titleId}`,
    "USER LIKED MUZEBOX": `/entertainment/muzebox/details/${titleId}`,
    "USER COMMENT ON MUZEBOX": `/entertainment/muzebox/details/${titleId}`,
    "USER LIKED EDUCATION": `/entertainment/educatin/grades/details/${titleId}`,
    "USER LIKED MUSEUM": `/entertainment/museum/details/${titleId}`,
    "USER LIKED POST": `/entertainment/posts/details/${titleId}`,
    "USER COMMENT ON POST": `/entertainment/posts/details/${titleId}`,
  };
  return routes[type] || "/";
};

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Full Payload Received:', JSON.stringify(payload, null, 2));
  
  const fcmData = payload.data || {};
  console.log('[SW] FCM Data Object:', fcmData);

  const type = fcmData.type; 
  const titleId = fcmData.titleId;

  console.log(`[SW] Extracted - Type: ${type}, TitleId: ${titleId}`);

  const notificationTitle = payload.notification?.title || "New Notification";

  const notificationOptions = {
    body: payload.notification?.body || "",
    data: {
      url: getTargetUrl(type, titleId)
    },
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

    const data = event.notification.data || {};

    const targetUrl = new URL(
    data.url || "/",
    self.location.origin
  ).href;


  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then(async(clientList) => {
      for (const client of clientList) {
        if ("focus" in client && "navigate" in client) {
         await client.focus();
         return client.navigate(targetUrl);
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});
