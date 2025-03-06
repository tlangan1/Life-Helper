"use strict";

const version = 1.76;
var cachePrefix = "life-helper";
var cacheName = `${cachePrefix}-${version}`;
var backendURL;

// *** Service Worker Event Listeners ***

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("message", onMessage);
self.addEventListener("fetch", onFetch);

// It is important to catch the error here as main is asynchronous and, hence,
// if an error occurs in main it will be silent.
main().catch(console.error);

// This function will run every time the service worker is started whether
// or not it has already been installed and activated.
async function main() {
  logToConsole(
    `main: Life Helper service worker version (${version}) is starting...`
  );
}

async function onInstall(event) {
  logToConsole(
    `Life Helper service worker version ${version} is installed..."install" event beginning to run.`
  );
  self.skipWaiting();
}

async function onActivate(event) {
  // This will be called only once when the service worker is activated.
  logToConsole(
    `Life Helper service worker version ${version} is activated..."activate" event beginning to run.`
  );
  clearCaches(cachePrefix);
  loadCache();

  event.waitUntil(clients.claim());

  self.clients.matchAll().then((clientList) => {
    if (clientList.length > 0) {
      for (let index = 0; index < clientList.length; ++index) {
        clientList[index].postMessage({
          type: "Service Worker Activated",
        });
      }
    }
  });
}

async function onMessage(event) {
  if (event.data) {
    logToConsole(
      `Got the message ${
        event.data.message
      } from the client page, ${event.source.url.substring(
        0,
        event.source.url.length - 6
      )}`
    );
    if (event.data.message.type == "Backend Server URL") {
      backendURL = event.data.message.backend_server_url;
      obtainPushSubscription();
    }
  }
}

/* *** using cache.put *** */
// function onFetch(event) {
//   // Prevent the default, and handle the request ourselves.
//   event.respondWith(
//     (async () => {
//       var now = new Date();
//       logToConsole(`${now}: Handling fetch event for ${event.request.url}`);
//       // Try to get the response from a cache.
//       // const cachedResponse = await caches.match(event.request);
//       var cache = await caches.open(cacheName);
//       var cachedResponse = await cache.match(event.request);
//       // Return it if we found one.
//       if (cachedResponse) {
//         logToConsole(`use cached response for ${event.request.url}`);
//         return cachedResponse;
//       }
//       // If we didn't find a match in the cache, use the network.
//       var response = await fetch(event.request);
//       // logToConsole(`use network response for ${event.request.url}`);
//       logToConsole(
//         `use network response for ${event.request.url} and put it in cache now`
//       );
//       cache.put(event.request, response.clone());
//       return response;
//     })()
//   );
// }

/* *** using cache.add *** */
function onFetch(event) {
  return;
  if (event.request.method != "GET") return;
  // Prevent the default, and handle the request ourselves.
  event.respondWith(
    (async () => {
      var now = new Date();
      logToConsole(`${now}: Handling fetch event for ${event.request.url}`);
      // Try to get the response from a cache.
      // const cachedResponse = await caches.match(event.request);
      var cache = await caches.open(cacheName);
      var cachedResponse = await cache.match(event.request);
      // Return it if we found one.
      if (cachedResponse) {
        logToConsole(`use cached response for ${event.request.url}`);
        return cachedResponse;
      }
      // If we didn't find a match in the cache, use the network.
      var response = await fetch(event.request);
      logToConsole(
        `use network response for ${event.request.url} and put it in cache now`
      );
      cache.add(event.request, response.clone());
      return response;
    })()
  );
}

self.addEventListener("push", function (event) {
  if (event.data) {
    logToConsole("Push event!! ", event.data.json());
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
    logToConsole("Push event but no data");
  }
});

self.addEventListener("pushsubscriptionchange", function (event) {
  logToConsole("Push Subscription Change event!! ", event);
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

    const response = await saveSubscription(subscription);
    logToConsole(response);
  } catch (err) {
    logToConsole("Error", err);
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
const saveSubscription = async (subscription) => {
  const SERVER_URL = `${backendURL}/add/web_push_subscription`;
  logToConsole(
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

async function loadCache() {
  var cache = await caches.open(cacheName);

  var urlsToCache = {
    isLoggedOut: [
      "/src/assets/android-chrome-192x192.png",
      "/src/assets/favicon-16x16.png",
      "/src/assets/favicon-32x32.png",
      "/src/assets/site.webmanifest",
    ],
  };

  var options = {
    method: "GET",
    cache: "no-cache",
    credentials: "omit",
  };

  urlsToCache.isLoggedOut.map((url) => loadCacheItem(url, options, cache));
}

async function loadCacheItem(url, options, cache) {
  var response = await cache.match(url);
  if (response) {
    logToConsole("Found response in cache:", response);

    return response;
  }
  logToConsole("No response found in cache. About to fetch from network…");

  try {
    response = await fetchURL(url, options);

    cache.put(url, response);
  } catch {
    logToConsole("Unable to cache item...request failed.");
  }
}

async function fetchURL(url, options) {
  var response = await fetch(url, options);

  if (response.ok) {
    return response;
  } else {
    throw new Error("The response was not ok");
  }
}

async function clearCaches(cachePrefix) {
  logToConsole(
    `Clearing cache for any named caches that are prefixed with ${cachePrefix} but are not version ${version}`
  );

  var regexp = new RegExp(`^${cachePrefix}-(\\d+\\.\\d*)$`);
  var cacheNames = await caches.keys();
  var oldCacheNames = cacheNames.filter(function matchOldCache(cacheName) {
    var [, cacheNameVersion] = cacheName.match(regexp) || [];
    cacheNameVersion =
      cacheNameVersion != null ? Number(cacheNameVersion) : cacheNameVersion;
    return cacheNameVersion > 0 && version !== cacheNameVersion;
  });

  await Promise.all(
    oldCacheNames.map(function deleteCache(cacheName) {
      return caches.delete(cacheName);
    })
  );
}

function logToConsole(message) {
  console.log(`${new Date().toLocaleString()}: ${message}`);
}
