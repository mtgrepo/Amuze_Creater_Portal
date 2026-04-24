import { getToken, type Messaging,  } from "firebase/messaging";
import { messaging } from "./firebase";
import { registerServiceWorker } from "./registerSW";

export async function requestPermissionAndGetToken(): Promise<string | null> {
  const permission = await Notification.requestPermission();
  const registration = await registerServiceWorker();

  if (Notification.permission === "denied") {
    console.log("noti is denied")
    return null;
  }

  if (permission !== "granted") {
     const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }
    return null;
  }

  try {
    console.log(import.meta.env.VITE_FIREBASE_VAPID_KEY)
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