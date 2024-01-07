self.addEventListener("activate", async () => {
  // This will be called only once when the service worker is activated.
  console.log("The Life Helper service worker was beginning activation.");
  try {
    console.log("In try block");
    const applicationServerKey = urlB64ToUint8Array(
      "BExD80_HkFrtVmffpbNP-KzVCoL6Y1m7sTvP6Ai7vCGZsn-XDsjwCEbG5Hz0sE0K3_crP6-1Jqdw2a-tjHKEqHk"
    );
    console.log("Before setting options");
    const options = { applicationServerKey, userVisibleOnly: true };
    console.log("Before call subscribe");
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log("Before calling saveSubscription");
    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.log("Error", err);
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "MESSAGE_IDENTIFIER") {
    console.log("Got the message");
  }
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("Push event!! ", event.data.text());
  } else {
    console.log("Push event but no data");
  }
});

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
  const SERVER_URL = "https://localhost:3001/add/web_push_subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  /* *** Why does this code expect a JSON package to be returned *** */
  //   return response.json();
  return response;
};
