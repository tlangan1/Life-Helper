import { useGlobalState } from "./GlobalStateProvider";
import { reformatMySQLDate } from "./JS/helperFunctions";

import "./CSS/Input_Controls.css";

import { sendMessage, registerServiceWorker } from "./JS/index.js";

export function AccountForm() {
  var { user, dataServer } = useGlobalState();

  return (
    <>
      <h1>Account</h1>
      <div class="label-left-wrapper">
        <div class="control">
          <label for="full_name">Full Name</label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            value={user().full_name}
          />
        </div>
        <div class="control">
          <label for="display_name">Display Name</label>
          <input
            type="text"
            name="display_name"
            id="display_name"
            value={user().display_name}
          />
        </div>
        <div class="control">
          <label for="email_address">Email Address</label>
          <input
            type="text"
            name="email_address"
            id="email_address"
            value={user().email_address}
          />
        </div>
        <div class="control">
          <label for="joined">Joined</label>
          <input
            type="text"
            name="joined"
            id="joined"
            value={reformatMySQLDate(user().created_dtm)}
          />
        </div>
        <button
          class="action-button web-push-subscription-button"
          onClick={(e) =>
            registerServiceWorker({
              type: "Data Server URL",
              dataServer: dataServer,
            })
          }
          disabled={navigator.serviceWorker.controller}
        >
          Request A Web Push Subscription
        </button>
        <button
          class="action-button"
          onClick={(e) => sendMessage("Test message from Life Helper App")}
        >
          Send Message To Service Worker
        </button>
      </div>
    </>
  );
}
