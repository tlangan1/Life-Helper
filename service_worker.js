"use strict";

const version = 1.07;
var cachePrefix = "life-helper";
var cacheName = `${cachePrefix}-${version}`;
var backendURL;

// *** Service Worker Event Listeners ***

self.addEventListener("install", async (event) => {
  self.skipWaiting();
  console.log("The Life Helper service worker was installed.");
});

self.addEventListener("activate", async (event) => {
  // This will be called only once when the service worker is activated.
  console.log("The Life Helper service worker was beginning activation.");

  event.waitUntil(clients.claim());
  clearCaches(cachePrefix);

  self.clients.matchAll().then((clientList) => {
    if (clientList.length > 0) {
      for (let index = 0; index < clientList.length; ++index) {
        clientList[index].postMessage({
          type: "Service Worker Activated",
        });
      }
    }
  });
});

self.addEventListener("message", (event) => {
  if (event.data) {
    console.log(
      `Got this message from the host, ${event.source.url.substring(
        0,
        event.source.url.length - 6
      )}`
    );
    if (event.data.message.type == "Backend Server URL") {
      backendURL = event.data.message.backend_server_url;
      obtainPushSubscription();
    }
  }
});

self.addEventListener("fetch", (event) => {
  var now = new Date();
  console.log(`${now}: Handling fetch event for ${event.request.url}`);
  var cache = caches.open(cacheName);

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Found response in cache:", response);

        return response;
      }
      console.log("No response found in cache. About to fetch from network…");

      return fetch(event.request)
        .then((response) => {
          console.log("Response from network is:", response);

          // return cache.put(event.request, response);
          return response;
        })
        .catch((error) => {
          console.error("Fetching failed:", error);

          throw error;
        });
    })
  );
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
  // cSpell:disable
  /* *** This is pushpad's code and below is MDN's code *** */
  // cSpell:disable
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

/* *** Helper Functions *** */

/* *** Push subscription helper functions *** */
async function obtainPushSubscription() {
  try {
    const applicationServerKey = urlB64ToUint8Array(
      // cSpell:disable
      "BExD80_HkFrtVmffpbNP-KzVCoL6Y1m7sTvP6Ai7vCGZsn-XDsjwCEbG5Hz0sE0K3_crP6-1Jqdw2a-tjHKEqHk"
      // cSpell:enable
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log("Before calling saveSubscription");
    const response = await saveSubscription(
      subscription,
      // event.target.registration.scope
      backendURL
    );
    console.log(response);
  } catch (err) {
    console.log("Error", err);
  }
}

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
const saveSubscription = async (subscription, url) => {
  const SERVER_URL = `${url}/add/web_push_subscription`;
  console.log(
    `Before fetch call to save the web push subscription: SERVER_URL is ${SERVER_URL}`
  );
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response;
};

/* *** Cache helper functions *** */

async function clearCaches(cachePrefix) {
  var regexp = new RegExp(`^${cachePrefix}-(\\d+\\.\\d*)$`);
  var cacheNames = await caches.keys();
  var oldCacheNames = cacheNames.filter(function matchOldCache(cacheName) {
    var [, cacheNameVersion] = cacheName.match(regexp) || [];
    cacheNameVersion =
      cacheNameVersion != null ? Number(cacheNameVersion) : cacheNameVersion;
    return cacheNameVersion > 0 && version !== cacheNameVersion;
  });

  console.log(`${cachePrefix}`);
  await Promise.all(
    oldCacheNames.map(function deleteCache(cacheName) {
      return caches.delete(cacheName);
    })
  );
}
