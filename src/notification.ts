import { getToken, type Messaging,  } from "firebase/messaging";
import { messaging } from "./firebase";
import { registerServiceWorker } from "./registerSW";

export async function requestPermissionAndGetToken(): Promise<string | null> {
  const permission = await Notification.requestPermission();
  const registration = await registerServiceWorker();

//   Notification.requestPermission().then((permission) => {
//   console.log("Permission:", permission)
// })

  if (permission !== "granted") {
    console.warn("Notification permission denied");
    return null;
  }

  try {
    const token = await getToken(messaging as Messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    console.log("fcm token", token)
    return token;
  } catch (err) {
    console.error("Error getting token:", err);
    return null;
  }
}