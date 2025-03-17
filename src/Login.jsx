/** @jsxImportSource solid-js */
import { createSignal } from "solid-js";

import { /* affectItem, */ login } from "./JS/helperFunctions";
import { useGlobalState } from "./GlobalStateProvider";

export function Login(props) {
  var loginUserID;
  var loginPassword;
  var { setUser, passwordPattern, dataServer } = useGlobalState();
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
        <div class="register_login">
          <div class="form-control-wrapper">
            <div class="embedded-label-wrapper">
              <input
                ref={loginUserID}
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
                ref={loginPassword}
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
        </div>
      </form>
      <button
        class="action-button"
        onClick={(e) => {
          login(
            { user_name: loginUserID.value, password: loginPassword.value },
            setUser,
            dataServer
          );
        }}
      >
        Login
      </button>
    </section>
  );

  // *** Helper functions for the code above
}
