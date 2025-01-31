/** @jsxImportSource solid-js */
import { createSignal } from "solid-js";

import { affectItem } from "./helperFunctions";
import { useGlobalState } from "./GlobalStateProvider";

export function Login(props) {
  var { setLoggedIn, setUser, passwordPattern, dataServer } = useGlobalState();
  var [passwordVisible, setPasswordVisible] = createSignal(false);

  return (
    <section class="route">
      <h2>
        Log In or{" "}
        <a href="/register" class="navlink">
          Sign Up Here
        </a>
      </h2>

      <form id="formLogin">
        <fieldset>
          <div class="form-control-wrapper">
            <div class="embedded-label-wrapper">
              <input
                id="login_user_id"
                required
                type="text"
                autocomplete="current username"
                placeholder=""
                title="Enter your ID."
                minLength="10"
                maxLength="30"
              />
              <label for="login_user_id">User ID</label>
              <span></span>
            </div>
          </div>
          <div class="form-control-wrapper">
            <div class="embedded-label-wrapper">
              <input
                id="login_password"
                required
                type={passwordVisible() ? "text" : "password"}
                autocomplete="current-password"
                // *** ************************************************* ***
                // placeholder="" can be used for the css that prevents
                // the input field from being invalid when a placeholder
                // is present.
                placeholder=""
                title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
                pattern={passwordPattern}
              />
              <label for="login_password">Password</label>
              <span
                class={passwordVisible() ? "hide" : "show"}
                onClick={() => setPasswordVisible(!passwordVisible())}
              >
                {passwordVisible() ? "Hide" : "Show"}
              </span>
            </div>
          </div>
        </fieldset>
      </form>
      <button
        class="action-button"
        onClick={(e) => {
          affectItemCaller(e, "check", "user_login", dataServer);
        }}
      >
        Login
      </button>
    </section>
  );

  // *** Helper functions for the code above
  async function affectItemCaller(e, operation, item_type, dataServer) {
    var sentData = {
      user_name: document.getElementById("login_user_id").value,
      password: document.getElementById("login_password").value,
    };

    var returnedData = await affectItem(
      e,
      operation,
      item_type,
      sentData,
      dataServer
    );

    // TODO: Enhance this code.
    if (returnedData.success) {
      setLoggedIn(true);
      setUser(returnedData);
      //   history.pushState({}, "", "./");
    } else {
      alert("Login failed. Please try again.");
    }
  }
}
