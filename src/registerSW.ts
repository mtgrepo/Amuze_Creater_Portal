export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    return await navigator.serviceWorker.register("/creator-portal/firebase-messaging-sw.js", {
      scope: "/creator-portal/",
    });
  }
  throw new Error("Service Workers are not supported in this browser.");
}