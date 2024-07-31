"use strict";

const version = 2;

// *** Service Worker Event Listeners ***

self.addEventListener("activate", async (event) => {
  // This will be called only once when the service worker is activated.
  event.waitUntil(clients.claim());
  console.log("The Life Helper service worker was beginning activation.");
  try {
    const applicationServerKey = urlB64ToUint8Array(
      // cSpell:disable
      "BExD80_HkFrtVmffpbNP-KzVCoL6Y1m7sTvP6Ai7vCGZsn-XDsjwCEbG5Hz0sE0K3_crP6-1Jqdw2a-tjHKEqHk"
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log("Before calling saveSubscription");
    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("install", async (event) => {
  self.skipWaiting();
  console.log("The Life Helper service worker was installed.");
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "MESSAGE_IDENTIFIER") {
    console.log("Got the message");
  }
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.json());
    // TODO: Send a message to the page to notify it that a push has been received
    // This is where I think I am dropping the ball.
    // What I should be doing is adding it to a cache to which the page is attached.
    event.waitUntil(
      self.clients.matchAll().then((clientList) => {
        if (clientList.length > 0) {
          for (let index = 0; index < clientList.length; ++index) {
            clientList[index].postMessage({
              type: "Push Notification",
              data: event.data.json(),
            });
          }
        }
      })
    );
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener("pushsubscriptionchange", function (event) {
  console.log("Push Subscription Change event!! ", event);
  /* *** ******************************************************* *** */
  /* *** This is pushpad's code and below is MDN's code *** */
  /* *** ******************************************************* *** */
  //   event.waitUntil(
  //     fetch("https://pushpad.xyz/pushsubscriptionchange", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         old_endpoint: event.oldSubscription
  //           ? event.oldSubscription.endpoint
  //           : null,
  //         new_endpoint: event.newSubscription
  //           ? event.newSubscription.endpoint
  //           : null,
  //         new_p256dh: event.newSubscription
  //           ? event.newSubscription.toJSON().keys.p256dh
  //           : null,
  //         new_auth: event.newSubscription
  //           ? event.newSubscription.toJSON().keys.auth
  //           : null,
  //       }),
  //     })
  //   );
  /* *** ******************************************************* *** */
  /* *** This is MDN's code *** */
  /* *** ******************************************************* *** */
  // self.addEventListener(
  //   "pushsubscriptionchange",
  //   (event) => {
  //     const conv = (val) =>
  //       self.btoa(String.fromCharCode.apply(null, new Uint8Array(val)));
  //     const getPayload = (subscription) => ({
  //       endpoint: subscription.endpoint,
  //       publicKey: conv(subscription.getKey("p256dh")),
  //       authToken: conv(subscription.getKey("auth")),
  //     });

  //     const subscription = self.registration.pushManager
  //       .subscribe(event.oldSubscription.options)
  //       .then((subscription) =>
  //         fetch("register", {
  //           method: "post",
  //           headers: {
  //             "Content-type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             old: getPayload(event.oldSubscription),
  //             new: getPayload(subscription),
  //           }),
  //         })
  //       );
  //     event.waitUntil(subscription);
  //   },
  //   false
  // );
});

// *** Helper Functions ***

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
// saveSubscription saves the subscription to the backend
const saveSubscription = async (subscription) => {
  // Only relevant change 7/26/2024. This should have been changed on 7/21/2024 when
  // the GlobalStateProvider was changed.
  // const SERVER_URL = "https://localhost:3001/add/web_push_subscription";
  const SERVER_URL = "https://192.168.1.159:3001/add/web_push_subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response;
};
