/** @jsxImportSource solid-js */
import { createEffect, createSignal, onMount } from "solid-js";
import { affectItem } from "./helperFunctions";
import { useGlobalState } from "./GlobalStateProvider";

export function Register(props) {
  var [step, setStep] = createSignal("user name creation");
  var { dataServer } = useGlobalState();
  var [validityUserName, setValidityUserName] = createSignal({});
  var [validityPassword, setValidityPassword] = createSignal({});
  var checkUserNameValidity = initializeValidityChecker(validityUserName);
  var checkPasswordValidity = initializeValidityChecker(validityPassword);

  onMount(() => {
    initializeFieldSetValidator(
      "register_user_name_creation",
      setValidityUserName
    );
    initializeFieldSetValidator(
      "register_password_creation",
      setValidityPassword
    );
    function initializeFieldSetValidator(fieldsetID, setter) {
      var validityObject = {};
      var fieldset = document.getElementById(fieldsetID);
      var inputs = fieldset.querySelectorAll("input");
      inputs.forEach((input) => {
        validityObject[input.id] = input.checkValidity();
      });
      setter(validityObject);
    }
  });

  function submitHandler(e) {
    e.preventDefault();
  }

  return (
    <section class="route">
      <h2>Register</h2>

      {/* <form id="formRegister" onSubmit={submitHandler}> */}
      <form id="formRegister">
        <fieldset
          id="register_user_name_creation"
          classList={{
            hidden: step() != "user name creation",
          }}
        >
          <div class="form-control-wrapper">
            <label for="register_full_name">Full Name</label>
            <div class="input-validation-wrapper">
              <input
                id="register_full_name"
                required
                type="text"
                autocomplete="name"
                placeholder=""
                title="Enter your full name."
                minLength="10"
                maxLength="100"
                onChange={(e) => checkUserNameValidity.setValidity(e.target)}
              />
              <span></span>
            </div>
          </div>
          <div class="form-control-wrapper">
            <label for="register_display_name">Display Name</label>
            <div class="input-validation-wrapper">
              <input
                id="register_display_name"
                required
                type="text"
                autocomplete="given-name"
                placeholder=""
                title="Enter the name you want to be called by."
                minLength="1"
                maxLength="30"
                onChange={(e) => checkUserNameValidity.setValidity(e.target)}
              />
              <span></span>
            </div>
          </div>
          {/* The mere presence of the word Email in the label will cause */}
          {/* chrome to suggest an email address */}
          <div class="form-control-wrapper">
            <label for="register_user_name">User Name or Email</label>
            {/* If you use this label it will not suggest an email address */}
            {/* <label for="register_user_name">User Name</label> */}
            <div class="input-validation-wrapper">
              <input
                id="register_user_name"
                required
                type="text"
                autocomplete="new username"
                placeholder=""
                title="Enter a user name."
                minLength="10"
                maxLength="30"
                onChange={(e) => checkUserNameValidity.setValidity(e.target)}
              />
              <span></span>
            </div>
          </div>
          <button
            class="action-button"
            disabled={!checkUserNameValidity.ifInvalid()}
            onClick={() => setStep("password creation")}
          >
            Continue
          </button>
        </fieldset>
        <fieldset
          id="register_password_creation"
          classList={{
            hidden: step() == "user name creation",
          }}
        >
          <div class="password-wrapper">
            <label for="register_password">Password</label>
            <div class="password-eye">
              <span class="eye-strikethrough">/</span>
              <span
                aria-label="Toggle password visibility"
                aria-hidden="true"
                class="eye"
              >
                👁
              </span>

              <span>Show</span>
            </div>
            <input
              id="register_password"
              required
              type="password"
              autocomplete="new-password"
              placeholder="password"
              title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
              aria-describedby="password_requirements"
              // *** ************************************************* ***
              // placeholder="" Note that a blank placeholder will work for the css
              // that does not style the input field as invalid when it is empty.
              // placeholder="" but I am going to use a placeholder anyway.
              onChange={(e) => checkPasswordValidity.setValidity(e.target)}
              // *** ************************************************* ***
              // This pattern is an example of the
              // problem with chrome...see the README.md.
              // chrome changes this
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\s]{10,}$"
              // to this
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[A-Za-zds]{10,}$"
              // so I have to change it to this
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d\\s]{10,}$"
              // *** ************************************************* ***
              // This pattern will enforce the rule that the password
              // is at least 10 characters long and contains
              // at least one lowercase letter, one uppercase letter.
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d\\s]{10,}$"
            />
          </div>
          <div class="password-wrapper">
            <label for="register_password_confirmation">Confirm Password</label>
            <div class="password-eye">
              <span class="eye">👁</span>
              <span
                aria-label="Toggle password visibility"
                aria-hidden="true"
              ></span>
              <span>Show</span>
            </div>
            <input
              id="register_password_confirmation"
              required
              type="password"
              autocomplete="new-password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d\\s]{10,}$"
              title="The password must be at least 10 characters long and contain at least one lowercase letter, uppercase letter and number."
              aria-describedby="password_requirements"
              placeholder="password"
              onChange={(e) => checkPasswordValidity.setValidity(e.target)}
            />
          </div>
          <p id="password_requirements">
            The password must be at least 10 characters in length and contain at
            least one upper case letter, one lower case letter and one number.
          </p>
          <button
            class="action-button"
            disabled={
              !checkPasswordValidity.ifInvalid() || !checkPasswordsMatch()
            }
            onClick={(e) => {
              affectItemCaller(e, "add", "user_login", dataServer);
            }}
          >
            Sign Up
          </button>
        </fieldset>
      </form>
    </section>
  );

  // *** Helper functions for the code above
  async function affectItemCaller(e, operation, item_type, dataServer) {
    var data = {
      user_name: document.getElementById("register_user_name_or_email").value,
      password: document.getElementById("register_password").value,
      full_name: document.getElementById("register_full_name").value,
      display_name: document.getElementById("display_name").value,
    };

    var success = await affectItem(e, operation, item_type, data, dataServer);
    // TODO: Add code to handle the success or failure of the request.
    // if (success) {
    //   history.pushState({}, "", "./");
    // }
  }

  function initializeValidityChecker(signal) {
    return {
      setValidity: function setValidity(input) {
        signal()[input.id] = input.checkValidity();
        setValidityUserName(structuredClone(signal()));
      },

      ifInvalid: function checkValidity() {
        return Object.values(signal()).filter((value) => !value).length == 0;
      },
    };
  }

  function checkPasswordsMatch() {
    if (!document.getElementById("register_password")) return false;
    else
      return (
        document.getElementById("register_password").value ===
        document.getElementById("register_password_confirmation").value
      );
  }
}
