"use strict;";

var swRegistration;

// eslint-disable-next-line no-unused-vars
export const askPermissionAndRegisterServiceIfAppropriate = async () => {
  check();
  // Note: Tom L (2023-12-18) I switched the order of the following two lines because
  // it did not make sense to me to register the service worker before permission was granted
  await requestNotificationPermission();
  swRegistration = await registerServiceWorker();
};

// eslint-disable-next-line no-unused-vars
const unregisterServiceWorker = async () => {
  if (swRegistration) {
    if (await swRegistration.unregister())
      console.log(
        "The Life Helper service worker was successfully unregistered."
      );
    else
      console.log(
        "The Life Helper service worker was NOT successfully unregistered!"
      );
  } else {
    console.log(
      `The Life Helper service worker is not currently registered, so it cannot be unregistered.`
    );
  }
};

// eslint-disable-next-line no-unused-vars
function sendMessage() {
  if (!navigator.serviceWorker.controller)
    alert("No service worker is currently active");
  else {
    navigator.serviceWorker.controller.postMessage({
      type: "MESSAGE_IDENTIFIER",
    });
  }
}

/* *** Helper Functions *** */
const check = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
};
const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register(
    "src/service.js"
  );
  return swRegistration;
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
};
