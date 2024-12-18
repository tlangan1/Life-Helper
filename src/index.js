"use strict";

/* *** Commented out 7/31/2024 *** */
/* *** By Tom *** */
// var swRegistration;
// var svcWorker;

export const askWebPushPermission = async (message) => {
  await requestNotificationPermission(message);
};

export const registerServiceWorker = async (msg) => {
  if (BrowserSupports()) {
    console.log("starting registerServiceWorker");
    if (requestNotificationPermission(msg)) {
      await navigator.serviceWorker.register("/service_worker.js", {
        updateViaCache: "none",
      });

      console.log("Service Worker registered");
    } else {
      console.log("User denied permission to send push notifications");
    }
  } else {
    console.log("Service workers not supported by this browser");
  }
};

export function sendMessage(msg) {
  console.log("starting sendMessage");
  if (!navigator.serviceWorker.controller)
    alert("No service worker is currently active");
  else {
    navigator.serviceWorker.controller.postMessage({
      message: msg,
    });
  }
}

/* *** Event Listeners *** */
navigator.serviceWorker.addEventListener(
  "controllerchange",
  function onControllerChange(event) {
    /* *** Commented out 7/31/2024 *** */
    // svcWorker = navigator.serviceWorker.controller;
    console.log("Controller changed");
  }
);

navigator.serviceWorker.addEventListener("message", (event) => {
  console.log("Got a message from the service worker!!!");
  if (event.data && event.data.type === "Push Notification") {
    console.log("Push Notification received");
    document.title = event.data.data.name;
    // I am going to use the strategy of forcing a data refresh from the
    // database to give the visual effect of updating cache (for now).
  }
  if (event.data && event.data.type === "Service Worker Activated") {
    console.log(
      "The service worker is notifying the page that it is activated."
    );
    document.title = "Activated";
    document.querySelector(".subscription-button").disabled = false;
  }
});

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

async function requestNotificationPermission(msg) {
  console.log("starting requestNotificationPermission");
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.

  // I am sending this message to the service worker to provide the url
  // to use for the backend server. The service worker needs this to
  // send the push subscription to the database. I chose to not hard code
  // this url in both the web site and in the service worker and used this
  // strategy instead
  if (permission == "granted") {
    sendMessage(msg);
    return true;
  }
  return false;
}
