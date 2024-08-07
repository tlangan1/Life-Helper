"use strict";

/* *** Commented out 7/31/2024 *** */
/* *** By Tom *** */
// var swRegistration;
// var svcWorker;

// eslint-disable-next-line no-unused-vars
export const askPermissionAndRegisterServiceIfAppropriate = async () => {
  if (BrowserSupports()) {
    if (await requestNotificationPermission()) {
      await registerServiceWorker();
    }
  }
};

// eslint-disable-next-line no-unused-vars
/* *** This code is not currently used and probably never will be. *** */
// export const unregisterServiceWorker = async () => {
//   if (swRegistration) {
//     if (await swRegistration.unregister())
//       console.log(
//         "The Life Helper service worker was successfully unregistered."
//       );
//     else
//       console.log(
//         "The Life Helper service worker was NOT successfully unregistered!"
//       );
//   } else {
//     console.log(
//       `The Life Helper service worker is not currently registered, so it cannot be unregistered.`
//     );
//   }
// };

// eslint-disable-next-line no-unused-vars
export function sendMessage() {
  if (!navigator.serviceWorker.controller)
    alert("No service worker is currently active");
  else {
    navigator.serviceWorker.controller.postMessage({
      type: "MESSAGE_IDENTIFIER",
    });
  }
}

/* *** Helper Functions *** */
function BrowserSupports() {
  if (!("serviceWorker" in navigator)) {
    // Service Workers not supported
    return false;
  }
  if (!("PushManager" in window)) {
    // Push not supported
    return false;
  }

  return true;
}
const registerServiceWorker = async () => {
  await navigator.serviceWorker.register("/service_worker.js", {
    updateViaCache: "none",
  });

  console.log("Service Worker registered");

  /* *** Commented out 7/31/2024 *** */
  //   svcWorker =
  //     swRegistration.installing ||
  //     swRegistration.waiting ||
  //     swRegistration.active;
};

navigator.serviceWorker.addEventListener(
  "controllerchange",
  function onControllerChange(event) {
    /* *** Commented out 7/31/2024 *** */
    // svcWorker = navigator.serviceWorker.controller;
    console.log("Controller changed");
  }
);

async function requestNotificationPermission() {
  /* *** At some point I should test *** */
  //   const x = new Notification("Hello!");
  //   const y = await Notification.requestPermission();
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission == "granted") return true;
  else return false;
}

navigator.serviceWorker.addEventListener("message", (event) => {
  console.log("Got message from service worker!!!");
  if (event.data && event.data.type === "Push Notification") {
    document.title = event.data.data.name;
  }
});
