"use strict";

/* *** Commented out 7/31/2024 *** */
/* *** By Tom *** */
// var swRegistration;
// var svcWorker;

import { createSignal } from "solid-js";

import { logToConsole } from "./helperFunctions";

export var [webPushList, setWebPushList] = createSignal([]);

export const askWebPushPermission = async (message) => {
  await requestNotificationPermission(message);
};

export const registerServiceWorker = async (msg) => {
  if (BrowserSupports()) {
    logToConsole("starting registerServiceWorker");
    if (requestNotificationPermission(msg)) {
      await navigator.serviceWorker.register("/service_worker.js", {
        updateViaCache: "none",
      });

      logToConsole("Service Worker registered");
    } else {
      logToConsole("User denied permission to send push notifications");
    }
  } else {
    logToConsole("Service workers not supported by this browser");
  }
};

export function sendMessage(msg) {
  logToConsole("starting sendMessage");
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
    logToConsole("Controller changed");
  }
);

navigator.serviceWorker.addEventListener("message", (event) => {
  logToConsole("Got a message from the service worker!!!");
  if (event.data.data && event.data.type === "Push Notification") {
    var webPushMessage = `Web Push: ${
      //   event.data.data.task_id ? event.data.data.task_id : "No task_id"
      JSON.stringify(event.data.data)
    }`;
    logToConsole(webPushMessage);
    webPushList().push(event.data.data);
    setWebPushList(structuredClone(webPushList()));
    // document.title = event.data.data.name;
    // I am going to use the strategy of forcing a data refresh from the
    // database to give the visual effect of updating cache (for now).
  }
  if (event.data && event.data.type === "Service Worker Activated") {
    logToConsole(
      "The service worker is notifying the page that it is activated."
    );
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
  logToConsole("starting requestNotificationPermission");
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
